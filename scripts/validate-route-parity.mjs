import { readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const root = process.cwd()
const expectedRootPages = [
  'about',
  'air-freight',
  'blog',
  'clearing-forwarding',
  'cross-border-consulting',
  'customs-bonded-warehouse-kenya',
  'customs-clearance-kenya',
  'customs-consultancy',
  'export-cargo-from-kenya',
  'import-car-from-south-africa-to-kenya',
  'import-duty-calculator',
  'index',
  'jebel-ali-to-mombasa-transit-time',
  'jkia-air-cargo-clearance',
  'mombasa-customs-clearance',
  'nairobi-icd-customs-clearance',
  'ocean-freight',
  'overland-transport',
  'project-logistics',
  'shipping-cost-from-china-to-kenya-1-cbm',
  'shipping-from-china',
  'shipping-from-dubai-to-kenya',
  'special-economic-zone-free-trade-zone-industrial-park',
  'transit-cargo-uganda-rwanda-drc-south-sudan',
  'vehicle-import-to-kenya',
  'warehousing'
].sort()

const expectedBlogPages = [
  'fcl-vs-lcl-shipping-kenya',
  'how-to-clear-customs-at-mombasa-port',
  'import-vehicles-to-kenya-2026',
  'kenya-import-duty-rates-2026',
  'transit-bond-uganda-rwanda'
].sort()

const expectedDownloadPages = [
  'fcl-lcl-shipping-guide',
  'kenya-import-duty-guide',
  'mombasa-clearance-checklist',
  'vehicle-import-checklist'
].sort()

function jsonSlugs(dir) {
  return readdirSync(join(root, dir))
    .filter((file) => file.endsWith('.json'))
    .map((file) => basename(file, '.json'))
}

const contentPageSlugs = jsonSlugs('content/pages')
const contentServiceSlugs = jsonSlugs('content/services')
const contentDownloadSlugs = jsonSlugs('content/downloads')
const nuxtRootPages = new Set([...contentPageSlugs.map((slug) => slug === 'home' ? 'index' : slug), ...contentServiceSlugs])

const contentBlogPages = readdirSync(join(root, 'content/blog'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => basename(file, '.md'))
  .sort()

const missingRootPages = expectedRootPages.filter((page) => !nuxtRootPages.has(page))
const missingBlogPages = expectedBlogPages.filter((page) => !contentBlogPages.includes(page))
const missingDownloadPages = expectedDownloadPages.filter((page) => !contentDownloadSlugs.includes(page))

if (missingRootPages.length || missingBlogPages.length || missingDownloadPages.length) {
  console.error('Nuxt route parity failed.')
  if (missingRootPages.length) console.error(`Missing root pages: ${missingRootPages.join(', ')}`)
  if (missingBlogPages.length) console.error(`Missing blog pages: ${missingBlogPages.join(', ')}`)
  if (missingDownloadPages.length) console.error(`Missing download pages: ${missingDownloadPages.join(', ')}`)
  process.exit(1)
}

console.log(`Route parity passed: ${expectedRootPages.length} root pages, ${expectedBlogPages.length} blog posts and ${expectedDownloadPages.length} download pages are covered by Nuxt Content.`)
console.log('Note: ocean-freight copy.html is treated as a duplicate legacy artifact and is intentionally excluded.')
