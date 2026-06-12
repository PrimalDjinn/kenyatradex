import { readdirSync, readFileSync } from 'node:fs'
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

const servicePagesSource = readFileSync(join(root, 'app/data/service-pages.ts'), 'utf8')
const directServiceSlugs = [...servicePagesSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
const simpleServiceSlugs = [...servicePagesSource.matchAll(/^\s*\['([^']+)'/gm)].map((match) => match[1])
const nuxtRootPages = new Set(['index', 'about', 'blog', 'import-duty-calculator', ...directServiceSlugs, ...simpleServiceSlugs])

const contentBlogPages = readdirSync(join(root, 'content/blog'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => basename(file, '.md'))
  .sort()

const missingRootPages = expectedRootPages.filter((page) => !nuxtRootPages.has(page))
const missingBlogPages = expectedBlogPages.filter((page) => !contentBlogPages.includes(page))

if (missingRootPages.length || missingBlogPages.length) {
  console.error('Nuxt route parity failed.')
  if (missingRootPages.length) console.error(`Missing root pages: ${missingRootPages.join(', ')}`)
  if (missingBlogPages.length) console.error(`Missing blog pages: ${missingBlogPages.join(', ')}`)
  process.exit(1)
}

console.log(`Route parity passed: ${expectedRootPages.length} root pages and ${expectedBlogPages.length} blog posts are covered by Nuxt.`)
console.log('Note: this validates expected legacy URL coverage after removing old static files.')
