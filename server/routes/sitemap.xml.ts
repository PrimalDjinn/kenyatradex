import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { joinURL } from 'ufo'

const defaultLastmod = '2026-04-20'

type SitemapMeta = {
  include?: boolean
  lastmod?: string
  changefreq?: string
  priority?: string | number
  imageTitle?: string
  order?: number
}

type SitemapRecord = {
  path: string
  title?: string
  image?: string
  date?: string
  updated?: string
  sitemap?: SitemapMeta
  collection: 'pages' | 'services' | 'downloads' | 'blog'
}

function escapeXml(value = '') {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function absoluteAsset(siteUrl: string, path?: string) {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return joinURL(siteUrl, path)
}

function pathFromCanonical(canonical?: string) {
  if (!canonical) return undefined
  try {
    return new URL(canonical).pathname
  } catch {
    return undefined
  }
}

function contentPath(collection: SitemapRecord['collection'], slug: string, record: { canonical?: string, route?: { path?: string } }) {
  if (record.route?.path) return record.route.path
  const canonicalPath = pathFromCanonical(record.canonical)
  if (canonicalPath) return canonicalPath
  if (collection === 'blog') return `/blog/${slug}.html`
  if (collection === 'downloads') return `/downloads/${slug}.html`
  return slug === 'home' ? '/' : `/${slug}.html`
}

function readJsonRecords(dir: string, collection: 'pages' | 'services' | 'downloads'): SitemapRecord[] {
  const root = join(process.cwd(), dir)
  if (!existsSync(root)) return []
  return readdirSync(root)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const slug = basename(file, '.json')
      const record = JSON.parse(readFileSync(join(root, file), 'utf8'))
      return {
        path: contentPath(collection, slug, record),
        title: record.title,
        image: record.hero?.image || record.image,
        updated: record.updated || record.hero?.updated,
        sitemap: record.sitemap,
        collection
      }
    })
}

function parseFrontMatter(body: string) {
  const frontMatter = body.match(/^---\n([\s\S]*?)\n---/)?.[1] || ''
  const field = (name: string) => frontMatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?`, 'm'))?.[1]
  return {
    title: field('title'),
    image: field('image'),
    date: field('date'),
    updated: field('updated'),
    canonical: field('canonical')
  }
}

function readBlogRecords(): SitemapRecord[] {
  const root = join(process.cwd(), 'content/blog')
  if (!existsSync(root)) return []
  return readdirSync(root)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = basename(file, '.md')
      const record = parseFrontMatter(readFileSync(join(root, file), 'utf8'))
      return {
        path: contentPath('blog', slug, record),
        title: record.title,
        image: record.image,
        date: record.date,
        updated: record.updated,
        collection: 'blog'
      }
    })
}

function defaultPriority(record: SitemapRecord) {
  if (record.path === '/') return '1.0'
  if (record.collection === 'blog') return '0.7'
  if (record.collection === 'downloads') return '0.5'
  if (record.collection === 'services') return '0.9'
  return record.path === '/import-duty-calculator.html' ? '0.9' : '0.8'
}

function includeInSitemap(record: SitemapRecord) {
  if (record.sitemap?.include !== undefined) return record.sitemap.include
  return record.collection !== 'downloads'
}

function urlEntry(siteUrl: string, record: SitemapRecord) {
  const priority = String(record.sitemap?.priority || defaultPriority(record))
  const changefreq = record.sitemap?.changefreq || (record.path === '/' || record.path === '/blog.html' || record.path === '/import-duty-calculator.html' ? 'weekly' : 'monthly')
  const lastmod = record.sitemap?.lastmod || record.updated || record.date || defaultLastmod
  const image = absoluteAsset(siteUrl, record.image)
  const imageBlock = image
    ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(record.sitemap?.imageTitle || record.title || 'Kenya Tradex logistics support')}</image:title>
    </image:image>`
    : ''

  return `  <url>
    <loc>${escapeXml(joinURL(siteUrl, record.path))}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>${imageBlock}
  </url>`
}

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const siteUrl = getSiteUrl(event)

  const seen = new Set<string>()
  const records = [
    ...readJsonRecords('content/pages', 'pages'),
    ...readJsonRecords('content/services', 'services'),
    ...readJsonRecords('content/downloads', 'downloads'),
    ...readBlogRecords()
  ]
    .filter(includeInSitemap)
    .filter((record) => {
      if (seen.has(record.path)) return false
      seen.add(record.path)
      return true
    })
    .sort((a, b) => {
      if (a.path === '/') return -1
      if (b.path === '/') return 1
      const orderA = a.sitemap?.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.sitemap?.order ?? Number.MAX_SAFE_INTEGER
      return orderA === orderB ? a.path.localeCompare(b.path) : orderA - orderB
    })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${records.map((record) => urlEntry(siteUrl, record)).join('\n')}
</urlset>
`
})
