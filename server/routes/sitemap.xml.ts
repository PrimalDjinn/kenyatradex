import { readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const staticPages = ['/', '/about.html', '/blog.html', '/import-duty-calculator.html']

function contentSlugs(dir: string, extension: string) {
  try {
    return readdirSync(join(process.cwd(), dir))
      .filter((file) => file.endsWith(extension))
      .map((file) => basename(file, extension))
  } catch {
    return []
  }
}

function urlEntry(path: string, priority = '0.8') {
  return `  <url>
    <loc>https://kenyatradex.africa${path}</loc>
    <lastmod>2026-06-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const serviceUrls = contentSlugs('content/services', '.json').map((slug) => `/${slug}.html`)
  const blogPages = contentSlugs('content/blog', '.md').map((slug) => `/blog/${slug}.html`)
  const downloadPages = contentSlugs('content/downloads', '.json').map((slug) => `/downloads/${slug}.html`)
  const urls = [
    ...staticPages.map((path) => urlEntry(path, path === '/' ? '1.0' : '0.8')),
    ...serviceUrls.map((path) => urlEntry(path, '0.9')),
    ...blogPages.map((path) => urlEntry(path, '0.7')),
    ...downloadPages.map((path) => urlEntry(path, '0.5'))
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
})
