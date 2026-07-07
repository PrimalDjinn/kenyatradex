import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

export const siteUrl = 'https://kenyatradex.africa'

export function files(root, dir, extension) {
  const path = join(root, dir)
  if (!existsSync(path)) return []
  return readdirSync(path).filter((file) => file.endsWith(extension))
}

function pathFromCanonical(canonical) {
  if (!canonical) return undefined
  try {
    return new URL(canonical).pathname
  } catch {
    return undefined
  }
}

function contentPath(collection, slug, record = {}) {
  if (record.route?.path) return record.route.path
  const canonicalPath = pathFromCanonical(record.canonical)
  if (canonicalPath) return canonicalPath
  if (collection === 'blog') return `/blog/${slug}.html`
  if (collection === 'downloads') return `/downloads/${slug}.html`
  return slug === 'home' ? '/' : `/${slug}.html`
}

function parseScalarFrontMatter(body) {
  const frontMatter = body.match(/^---\n([\s\S]*?)\n---/)?.[1] || ''
  const field = (name) => frontMatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?`, 'm'))?.[1]
  return {
    canonical: field('canonical'),
    title: field('title'),
    image: field('image'),
    date: field('date'),
    updated: field('updated')
  }
}

function jsonRoutes(root, dir, collection, includeInSitemap) {
  return files(root, dir, '.json').map((file) => {
    const slug = basename(file, '.json')
    const record = JSON.parse(readFileSync(join(root, dir, file), 'utf8'))
    return {
      collection,
      slug,
      path: contentPath(collection, slug, record),
      url: `${siteUrl}${contentPath(collection, slug, record)}`,
      sitemap: record.sitemap,
      includeInSitemap: record.sitemap?.include ?? includeInSitemap
    }
  })
}

function blogRoutes(root) {
  return files(root, 'content/blog', '.md').map((file) => {
    const slug = basename(file, '.md')
    const record = parseScalarFrontMatter(readFileSync(join(root, 'content/blog', file), 'utf8'))
    const path = contentPath('blog', slug, record)
    return {
      collection: 'blog',
      slug,
      path,
      url: `${siteUrl}${path}`,
      includeInSitemap: true
    }
  })
}

export function currentContentRoutes(root) {
  return [
    ...jsonRoutes(root, 'content/pages', 'pages', true),
    ...jsonRoutes(root, 'content/services', 'services', true),
    ...jsonRoutes(root, 'content/downloads', 'downloads', false),
    ...blogRoutes(root)
  ]
}

export function currentSitemapUrls(root) {
  return currentContentRoutes(root)
    .filter((route) => route.includeInSitemap)
    .map((route) => route.url)
    .sort()
}
