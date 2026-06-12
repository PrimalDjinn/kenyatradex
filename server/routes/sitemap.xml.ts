import { allServicePages } from '../../app/data/service-pages'

const staticPages = ['/', '/about.html', '/blog.html', '/import-duty-calculator.html']
const blogPages = [
  '/blog/fcl-vs-lcl-shipping-kenya.html',
  '/blog/how-to-clear-customs-at-mombasa-port.html',
  '/blog/import-vehicles-to-kenya-2026.html',
  '/blog/kenya-import-duty-rates-2026.html',
  '/blog/transit-bond-uganda-rwanda.html'
]

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
  const serviceUrls = allServicePages.map((page) => `/${page.slug}.html`)
  const urls = [
    ...staticPages.map((path) => urlEntry(path, path === '/' ? '1.0' : '0.8')),
    ...serviceUrls.map((path) => urlEntry(path, '0.9')),
    ...blogPages.map((path) => urlEntry(path, '0.7'))
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
})
