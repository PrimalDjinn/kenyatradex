export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /
Disallow: /cdn-cgi/
Disallow: /admin
Disallow: /_studio

Sitemap: https://kenyatradex.africa/sitemap.xml
`
})
