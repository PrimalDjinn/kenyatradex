import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const root = process.cwd()
const oldRoot = process.env.OLD_SITE_ROOT || '/home/allan/ktx/site'
const ignored = new Set(['ocean-freight copy.html'])

function decodeHtml(value = '') {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
}

function stripTags(value = '') {
  return decodeHtml(value)
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr|td|th|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function normalize(value = '') {
  return decodeHtml(value)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9+%]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function htmlBody(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  if (main) return main[1]
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)
  return body ? body[1] : html
}

function contentHtml(html) {
  return htmlBody(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<header\b[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, '')
    .replace(/<form\b[\s\S]*?<\/form>/gi, '')
    .replace(/<button\b[\s\S]*?<\/button>/gi, '')
}

function first(html, regex) {
  return stripTags(html.match(regex)?.[1] || '')
}

function meta(html, name) {
  return decodeHtml(html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i'))?.[1] || '')
}

function fragmentsFromHtml(path) {
  const html = readFileSync(path, 'utf8')
  const cleaned = contentHtml(html)
  const fragments = [
    first(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    meta(html, 'description')
  ]

  for (const match of cleaned.matchAll(/<(h1|h2|h3|p|li|td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    fragments.push(stripTags(match[2]))
  }

  return [...new Set(fragments
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter((item) => item.length >= 28)
    .filter((item) => !/^copyright\b/i.test(item))
    .filter((item) => !/^send route, cargo type/i.test(item)))]
}

function readTargetText(kind, slug) {
  if (kind === 'blog') return readFileSync(join(root, 'content/blog', `${slug}.md`), 'utf8')
  const dir = kind === 'download' ? 'downloads' : kind === 'service' ? 'services' : 'pages'
  const file = join(root, 'content', dir, `${slug}.json`)
  return JSON.stringify(JSON.parse(readFileSync(file, 'utf8')))
}

function targetFor(relativePath) {
  if (relativePath.startsWith('blog/')) return { kind: 'blog', slug: basename(relativePath, '.html') }
  if (relativePath.startsWith('downloads/')) return { kind: 'download', slug: basename(relativePath, '.html') }
  const file = basename(relativePath)
  const slug = file === 'index.html' ? 'home' : basename(file, '.html')
  if (['home', 'about', 'blog', 'import-duty-calculator'].includes(slug)) return { kind: 'page', slug }
  return { kind: 'service', slug }
}

function oldHtmlFiles(dir = oldRoot, prefix = '') {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) files.push(...oldHtmlFiles(join(dir, entry.name), join(prefix, entry.name)))
    else if (entry.name.endsWith('.html')) files.push(join(prefix, entry.name))
  }
  return files.filter((file) => !ignored.has(file))
}

const failures = []
const summaries = []

for (const relativePath of oldHtmlFiles()) {
  const target = targetFor(relativePath)
  const targetPath = target.kind === 'blog'
    ? join(root, 'content/blog', `${target.slug}.md`)
    : join(root, 'content', target.kind === 'download' ? 'downloads' : target.kind === 'service' ? 'services' : 'pages', `${target.slug}.json`)

  if (!existsSync(targetPath)) {
    failures.push(`${relativePath}: missing target ${targetPath}`)
    continue
  }

  const fragments = fragmentsFromHtml(join(oldRoot, relativePath))
  const targetText = normalize(readTargetText(target.kind, target.slug))
  const missing = fragments.filter((fragment) => !targetText.includes(normalize(fragment)))

  summaries.push(`${relativePath}: ${fragments.length - missing.length}/${fragments.length} content fragments covered`)
  if (missing.length) {
    failures.push(`${relativePath}: ${missing.length} missing fragments\n  - ${missing.slice(0, 8).join('\n  - ')}`)
  }
}

if (failures.length) {
  console.error('Content coverage failed.')
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Content coverage passed for ${summaries.length} legacy HTML pages.`)
for (const summary of summaries) console.log(summary)
