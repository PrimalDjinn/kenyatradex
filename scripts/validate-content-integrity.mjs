import { existsSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { currentContentRoutes, files, siteUrl } from './lib/content-registry.mjs'

const root = process.cwd()
const failures = []

function routePathFromCanonical(canonical) {
  if (!canonical) return undefined
  try {
    return new URL(canonical).pathname
  } catch {
    failures.push(`Invalid canonical URL: ${canonical}`)
    return undefined
  }
}

function expectedRoute(collection, slug, record) {
  if (record.route?.path) return record.route.path
  const canonicalPath = routePathFromCanonical(record.canonical)
  if (canonicalPath) return canonicalPath
  if (collection === 'downloads') return `/downloads/${slug}.html`
  return slug === 'home' ? '/' : `/${slug}.html`
}

function requireText(value, label) {
  if (!value || !String(value).trim()) failures.push(`Missing ${label}`)
}

function validateJsonCollection(dir, collection) {
  for (const file of files(root, dir, '.json')) {
    const slug = basename(file, '.json')
    const path = join(root, dir, file)
    const record = JSON.parse(readFileSync(path, 'utf8'))
    const label = `${dir}/${file}`

    if (record.slug !== slug) failures.push(`${label}: slug must match filename (${slug})`)
    requireText(record.title, `${label}: title`)
    requireText(record.description, `${label}: description`)

    const route = expectedRoute(collection, slug, record)
    if (!route.startsWith('/') || (route !== '/' && !route.endsWith('.html'))) failures.push(`${label}: invalid route ${route}`)
    if (record.canonical && record.canonical !== `${siteUrl}${route}`) failures.push(`${label}: canonical does not match route ${route}`)

    if (record.pdf && !existsSync(join(root, 'public', record.pdf.replace(/^\//, '')))) failures.push(`${label}: missing PDF asset ${record.pdf}`)
  }
}

function parseFrontMatter(body) {
  const frontMatter = body.match(/^---\n([\s\S]*?)\n---/)?.[1] || ''
  const field = (name) => frontMatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?`, 'm'))?.[1]
  return { title: field('title'), description: field('description'), canonical: field('canonical') }
}

function validateBlog() {
  for (const file of files(root, 'content/blog', '.md')) {
    const slug = basename(file, '.md')
    const label = `content/blog/${file}`
    const frontMatter = parseFrontMatter(readFileSync(join(root, 'content/blog', file), 'utf8'))
    requireText(frontMatter.title, `${label}: title`)
    requireText(frontMatter.description, `${label}: description`)
    const route = frontMatter.canonical ? routePathFromCanonical(frontMatter.canonical) : `/blog/${slug}.html`
    if (frontMatter.canonical && frontMatter.canonical !== `${siteUrl}${route}`) failures.push(`${label}: canonical does not match route ${route}`)
  }
}

validateJsonCollection('content/pages', 'pages')
validateJsonCollection('content/services', 'services')
validateJsonCollection('content/downloads', 'downloads')
validateBlog()

const routes = currentContentRoutes(root).map((route) => route.path).sort()
const duplicateRoutes = routes.filter((route, index) => routes.indexOf(route) !== index)
if (duplicateRoutes.length) failures.push(`Duplicate routes: ${[...new Set(duplicateRoutes)].join(', ')}`)

if (failures.length) {
  console.error('Content integrity validation failed.')
  console.error(failures.map((failure) => `  - ${failure}`).join('\n'))
  process.exit(1)
}

console.log(`Content integrity passed for ${routes.length} Nuxt Content routes.`)
