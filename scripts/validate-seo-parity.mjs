import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const root = process.cwd()
const legacyRoot = process.env.LEGACY_ROOT || '/home/allan/ktx/site'
const siteUrl = 'https://kenyatradex.africa'

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

function files(dir, extension) {
  const path = join(root, dir)
  if (!existsSync(path)) return []
  return readdirSync(path).filter((file) => file.endsWith(extension))
}

function legacySitemapUrls() {
  const xml = readIfExists(join(legacyRoot, 'sitemap.xml'))
  return [...xml.matchAll(/<loc>(https:\/\/kenyatradex\.africa[^<]+)<\/loc>/g)].map((match) => match[1]).sort()
}

function currentSitemapUrls() {
  const pageUrls = files('content/pages', '.json').map((file) => {
    const slug = basename(file, '.json')
    return slug === 'home' ? `${siteUrl}/` : `${siteUrl}/${slug}.html`
  })
  const serviceUrls = files('content/services', '.json').map((file) => `${siteUrl}/${basename(file, '.json')}.html`)
  const blogUrls = files('content/blog', '.md').map((file) => `${siteUrl}/blog/${basename(file, '.md')}.html`)
  return [...pageUrls, ...serviceUrls, ...blogUrls].sort()
}

function contentFiles() {
  const groups = [
    ['content/pages', '.json'],
    ['content/services', '.json'],
    ['content/downloads', '.json'],
    ['content/site', '.json'],
    ['content/blog', '.md']
  ]
  return groups.flatMap(([dir, extension]) => files(dir, extension).map((file) => join(root, dir, file)))
}

function referencedPublicAssets() {
  const assets = new Set()
  for (const path of contentFiles()) {
    const text = readFileSync(path, 'utf8')
    for (const match of text.matchAll(/["'(]((?:\/images|\/files\/downloads)\/[^"')\s]+)["')]/g)) {
      assets.add(match[1])
    }
  }
  return [...assets].sort()
}

const legacyUrls = legacySitemapUrls()
const currentUrls = currentSitemapUrls()
const missingUrls = legacyUrls.filter((url) => !currentUrls.includes(url))
const extraUrls = currentUrls.filter((url) => !legacyUrls.includes(url))
const missingAssets = referencedPublicAssets().filter((asset) => !existsSync(join(root, 'public', asset.replace(/^\//, ''))))
function legacyFiles(dir, extension) {
  const path = join(legacyRoot, dir)
  if (!existsSync(path)) return []
  return readdirSync(path).filter((file) => file.endsWith(extension))
}

const legacyPdfs = legacyFiles('downloads', '.pdf').map((file) => basename(file, '.pdf'))
const missingPdfRedirects = legacyPdfs.filter((slug) => !existsSync(join(root, 'server/routes/downloads', `${slug}.pdf.ts`)))

if (missingUrls.length || extraUrls.length || missingAssets.length || missingPdfRedirects.length) {
  console.error('SEO parity validation failed.')
  if (missingUrls.length) console.error(`Missing sitemap URLs:\n${missingUrls.map((url) => `  - ${url}`).join('\n')}`)
  if (extraUrls.length) console.error(`Extra sitemap URLs:\n${extraUrls.map((url) => `  - ${url}`).join('\n')}`)
  if (missingAssets.length) console.error(`Missing public assets referenced by content:\n${missingAssets.map((asset) => `  - ${asset}`).join('\n')}`)
  if (missingPdfRedirects.length) console.error(`Missing legacy PDF redirects:\n${missingPdfRedirects.map((slug) => `  - /downloads/${slug}.pdf`).join('\n')}`)
  process.exit(1)
}

console.log(`SEO parity passed: ${legacyUrls.length} sitemap URLs, ${referencedPublicAssets().length} referenced public assets and ${legacyPdfs.length} legacy PDF redirects covered.`)
