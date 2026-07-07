import { basename } from 'node:path'
import { currentContentRoutes, files } from './lib/content-registry.mjs'

const root = process.cwd()
const legacyRoot = process.env.LEGACY_ROOT || '/home/allan/ktx/site'
const ignoredLegacyRootFiles = new Set(['ocean-freight copy.html'])

function legacyRootRoutes() {
  return files(legacyRoot, '.', '.html')
    .filter((file) => !ignoredLegacyRootFiles.has(file))
    .map((file) => file === 'index.html' ? '/' : `/${basename(file, '.html')}.html`)
    .sort()
}

function legacyNestedRoutes(dir) {
  return files(legacyRoot, dir, '.html')
    .map((file) => `/${dir}/${basename(file, '.html')}.html`)
    .sort()
}

const currentRoutes = currentContentRoutes(root).map((route) => route.path).sort()
const expectedRootRoutes = legacyRootRoutes()
const expectedBlogRoutes = legacyNestedRoutes('blog')
const expectedDownloadRoutes = legacyNestedRoutes('downloads')
const expectedRoutes = [...expectedRootRoutes, ...expectedBlogRoutes, ...expectedDownloadRoutes].sort()

const missingRoutes = expectedRoutes.filter((route) => !currentRoutes.includes(route))
const extraRoutes = currentRoutes.filter((route) => !expectedRoutes.includes(route))

if (missingRoutes.length || extraRoutes.length) {
  console.error('Nuxt route parity failed.')
  if (missingRoutes.length) console.error(`Missing routes:\n${missingRoutes.map((route) => `  - ${route}`).join('\n')}`)
  if (extraRoutes.length) console.error(`Extra routes:\n${extraRoutes.map((route) => `  - ${route}`).join('\n')}`)
  process.exit(1)
}

console.log(`Route parity passed: ${expectedRootRoutes.length} root pages, ${expectedBlogRoutes.length} blog posts and ${expectedDownloadRoutes.length} download pages are covered by Nuxt Content.`)
console.log('Note: ocean-freight copy.html is treated as a duplicate legacy artifact and is intentionally excluded.')
