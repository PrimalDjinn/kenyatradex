import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const siteUrl = 'https://kenyatradex.africa'
const defaultLastmod = '2026-04-20'

const sitemapMeta: Record<string, { lastmod?: string, changefreq?: string, priority?: string, imageTitle?: string }> = {
  '/': { lastmod: '2026-06-11', changefreq: 'weekly', priority: '1.0', imageTitle: 'Kenya Tradex logistics operations - freight forwarding and customs clearance' },
  '/about.html': { priority: '0.8' },
  '/blog.html': { changefreq: 'weekly', priority: '0.8' },
  '/import-duty-calculator.html': { lastmod: '2026-05-29', changefreq: 'weekly', priority: '0.9', imageTitle: 'Kenya Import Duty Calculator - calculate vehicle and cargo taxes with Kenya Tradex' },
  '/ocean-freight.html': { priority: '0.9' },
  '/air-freight.html': { lastmod: '2026-05-29', priority: '0.9' },
  '/clearing-forwarding.html': { lastmod: '2026-05-29', priority: '0.9' },
  '/warehousing.html': { priority: '0.8' },
  '/overland-transport.html': { priority: '0.8' },
  '/customs-consultancy.html': { priority: '0.8' },
  '/kra-customs-bonds-cb1-cb1a-cb10-kenya.html': { lastmod: '2026-07-07', priority: '0.85', imageTitle: 'KRA customs bonds CB1 CB1A and CB10 support by Kenya Tradex' },
  '/project-logistics.html': { priority: '0.8' },
  '/cross-border-consulting.html': { priority: '0.8' },
  '/special-economic-zone-free-trade-zone-industrial-park.html': { lastmod: '2026-06-15', priority: '0.85', imageTitle: 'Special Economic Zone Free Trade Zone and Industrial Park logistics support by Kenya Tradex' },
  '/export-cargo-from-kenya.html': { lastmod: '2026-07-01', priority: '0.85', imageTitle: 'Export cargo from Kenya and East Africa with customs clearance and freight forwarding by Kenya Tradex' },
  '/shipping-from-china.html': { lastmod: '2026-05-29', priority: '0.9', imageTitle: 'Shipping from China to Kenya - ocean and air freight with Kenya Tradex' },
  '/shipping-from-dubai-to-kenya.html': { priority: '0.9', imageTitle: 'Shipping from Dubai to Kenya - ocean and air freight with Kenya Tradex' },
  '/jebel-ali-to-mombasa-transit-time.html': { lastmod: '2026-05-29', priority: '0.8', imageTitle: 'Jebel Ali to Mombasa transit time guide by Kenya Tradex' },
  '/vehicle-import-to-kenya.html': { priority: '0.9', imageTitle: 'Vehicle and car import to Kenya - used car shipping with Kenya Tradex' },
  '/import-car-from-south-africa-to-kenya.html': { lastmod: '2026-04-23', priority: '0.8', imageTitle: 'Import car from South Africa to Kenya with Kenya Tradex' },
  '/shipping-cost-from-china-to-kenya-1-cbm.html': { lastmod: '2026-04-23', priority: '0.8', imageTitle: '1 CBM shipping cost from China to Kenya guide by Kenya Tradex' },
  '/customs-bonded-warehouse-kenya.html': { lastmod: '2026-05-29', priority: '0.8', imageTitle: 'Customs bonded warehouse Kenya guide by Kenya Tradex' },
  '/customs-clearance-kenya.html': { lastmod: '2026-06-11', priority: '0.9', imageTitle: 'Customs clearance in Kenya with KRA KPA and KEBS support by Kenya Tradex' },
  '/mombasa-customs-clearance.html': { lastmod: '2026-06-20', priority: '0.9', imageTitle: 'Mombasa customs clearance support by Kenya Tradex' },
  '/nairobi-icd-customs-clearance.html': { lastmod: '2026-06-20', priority: '0.85', imageTitle: 'Nairobi ICD customs clearance support by Kenya Tradex' },
  '/jkia-air-cargo-clearance.html': { lastmod: '2026-06-20', priority: '0.85', imageTitle: 'JKIA air cargo clearance support by Kenya Tradex' },
  '/transit-cargo-uganda-rwanda-drc-south-sudan.html': { lastmod: '2026-06-20', priority: '0.9', imageTitle: 'Mombasa to Juba Kigali Kampala DRC and South Sudan transit cargo by Kenya Tradex' }
}

const preferredRootOrder = [
  '/',
  '/about.html',
  '/ocean-freight.html',
  '/air-freight.html',
  '/clearing-forwarding.html',
  '/warehousing.html',
  '/overland-transport.html',
  '/customs-consultancy.html',
  '/kra-customs-bonds-cb1-cb1a-cb10-kenya.html',
  '/project-logistics.html',
  '/cross-border-consulting.html',
  '/special-economic-zone-free-trade-zone-industrial-park.html',
  '/export-cargo-from-kenya.html',
  '/shipping-from-china.html',
  '/shipping-from-dubai-to-kenya.html',
  '/jebel-ali-to-mombasa-transit-time.html',
  '/vehicle-import-to-kenya.html',
  '/import-car-from-south-africa-to-kenya.html',
  '/shipping-cost-from-china-to-kenya-1-cbm.html',
  '/customs-bonded-warehouse-kenya.html',
  '/customs-clearance-kenya.html',
  '/mombasa-customs-clearance.html',
  '/nairobi-icd-customs-clearance.html',
  '/jkia-air-cargo-clearance.html',
  '/transit-cargo-uganda-rwanda-drc-south-sudan.html',
  '/blog.html',
  '/import-duty-calculator.html'
]

type SitemapRecord = { path: string, title?: string, image?: string, date?: string, updated?: string }

function escapeXml(value = '') {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function readJsonRecords(dir: string, toPath: (slug: string) => string): SitemapRecord[] {
  const root = join(process.cwd(), dir)
  if (!existsSync(root)) return []
  return readdirSync(root)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const slug = basename(file, '.json')
      const record = JSON.parse(readFileSync(join(root, file), 'utf8'))
      return {
        path: toPath(slug),
        title: record.title,
        image: record.hero?.image || record.image
      }
    })
}

function readBlogRecords(): SitemapRecord[] {
  const root = join(process.cwd(), 'content/blog')
  if (!existsSync(root)) return []
  return readdirSync(root)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = basename(file, '.md')
      const body = readFileSync(join(root, file), 'utf8')
      const frontMatter = body.match(/^---\n([\s\S]*?)\n---/)?.[1] || ''
      const field = (name: string) => frontMatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?`, 'm'))?.[1]
      return {
        path: `/blog/${slug}.html`,
        title: field('title'),
        image: field('image'),
        date: field('date'),
        updated: field('updated')
      }
    })
}

function absoluteAsset(path?: string) {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function urlEntry(record: SitemapRecord) {
  const meta = sitemapMeta[record.path] || {}
  const priority = meta.priority || (record.path.startsWith('/blog/') ? '0.7' : '0.8')
  const changefreq = meta.changefreq || 'monthly'
  const lastmod = record.updated || record.date || meta.lastmod || defaultLastmod
  const image = absoluteAsset(record.image)
  const imageBlock = image
    ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(meta.imageTitle || record.title || 'Kenya Tradex logistics support')}</image:title>
    </image:image>`
    : ''

  return `  <url>
    <loc>${escapeXml(`${siteUrl}${record.path}`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>${imageBlock}
  </url>`
}

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const rootRecords = [
    ...readJsonRecords('content/pages', (slug) => slug === 'home' ? '/' : `/${slug}.html`),
    ...readJsonRecords('content/services', (slug) => `/${slug}.html`)
  ]
  const blogRecords = readBlogRecords()
  const byPath = new Map<string, SitemapRecord>([...rootRecords, ...blogRecords].map((record) => [record.path, record]))
  const ordered = [
    ...preferredRootOrder.map((path) => byPath.get(path)).filter((record): record is SitemapRecord => Boolean(record)),
    ...blogRecords
  ]
  const seen = new Set<string>()
  const urls = ordered.filter((record) => {
    if (seen.has(record.path)) return false
    seen.add(record.path)
    return true
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(urlEntry).join('\n')}
</urlset>
`
})
