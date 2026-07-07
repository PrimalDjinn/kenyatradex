import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { currentSitemapUrls, files } from './lib/content-registry.mjs'

const root = process.cwd()

function contentFiles() {
  const groups = [
    ['content/pages', '.json'],
    ['content/services', '.json'],
    ['content/downloads', '.json'],
    ['content/site', '.json'],
    ['content/blog', '.md']
  ]
  return groups.flatMap(([dir, extension]) => files(root, dir, extension).map((file) => join(root, dir, file)))
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

const currentUrls = currentSitemapUrls(root)
const duplicateUrls = currentUrls.filter((url, index) => currentUrls.indexOf(url) !== index)
const missingAssets = referencedPublicAssets().filter((asset) => !existsSync(join(root, 'public', asset.replace(/^\//, ''))))

if (duplicateUrls.length || missingAssets.length) {
  console.error('SEO registry validation failed.')
  if (duplicateUrls.length) console.error(`Duplicate sitemap URLs:\n${[...new Set(duplicateUrls)].map((url) => `  - ${url}`).join('\n')}`)
  if (missingAssets.length) console.error(`Missing public assets referenced by content:\n${missingAssets.map((asset) => `  - ${asset}`).join('\n')}`)
  process.exit(1)
}

console.log(`SEO registry passed: ${currentUrls.length} sitemap URLs and ${referencedPublicAssets().length} referenced public assets covered.`)
