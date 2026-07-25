import { currentContentRoutes } from './lib/content-registry.mjs'

const root = process.cwd()
const currentRoutes = currentContentRoutes(root).map((route) => route.path).sort()
const duplicateRoutes = currentRoutes.filter((route, index) => currentRoutes.indexOf(route) !== index)
const invalidRoutes = currentRoutes.filter((route) => !route.startsWith('/') || (route !== '/' && !route.endsWith('.html')) || route.includes(' '))

if (duplicateRoutes.length || invalidRoutes.length) {
  console.error('Nuxt route registry validation failed.')
  if (duplicateRoutes.length) console.error(`Duplicate content routes:\n${[...new Set(duplicateRoutes)].map((route) => `  - ${route}`).join('\n')}`)
  if (invalidRoutes.length) console.error(`Invalid content routes:\n${invalidRoutes.map((route) => `  - ${route}`).join('\n')}`)
  process.exit(1)
}

console.log(`Route registry passed: ${currentRoutes.length} unique Nuxt Content routes.`)
