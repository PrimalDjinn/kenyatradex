import { joinURL } from 'ufo'

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  const siteUrl = getSiteUrl(event)
  return `User-agent: *
Allow: /
Disallow: /cdn-cgi/
Disallow: /admin
Disallow: /_studio

Sitemap: ${joinURL(siteUrl, '/sitemap.xml')}
`
})
