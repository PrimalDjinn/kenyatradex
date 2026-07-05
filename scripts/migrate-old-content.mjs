import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative } from 'node:path'

const nuxtRoot = process.cwd()
const oldRoot = process.env.OLD_SITE_ROOT || '/home/allan/ktx/site'
const contentRoot = join(nuxtRoot, 'content')

const serviceSlugs = new Set([
  'air-freight',
  'clearing-forwarding',
  'cross-border-consulting',
  'customs-bonded-warehouse-kenya',
  'customs-clearance-kenya',
  'customs-consultancy',
  'export-cargo-from-kenya',
  'import-car-from-south-africa-to-kenya',
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
])

const pageSlugs = new Set(['home', 'about', 'blog', 'import-duty-calculator'])
const ignoredRootFiles = new Set(['form-handler.php', 'manifest.json', 'robots.txt', 'sitemap.xml', 'sw.js', 'ocean-freight copy.html'])

const defaultFields = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Full Name *', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address *', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(254) ___ ___ ___' },
  { name: 'message', label: 'Cargo details', type: 'textarea', placeholder: 'Cargo details: type, volume, origin, destination, timing and any document or border requirements. *', required: true }
]

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

function cleanDir(path) {
  rmSync(path, { recursive: true, force: true })
  ensureDir(path)
}

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
    .replace(/<\/(p|div|li|h[1-6]|tr|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function textFromFirst(html, regex) {
  const match = html.match(regex)
  return match ? stripTags(match[1]) : undefined
}

function attr(html, regex) {
  const match = html.match(regex)
  return match ? decodeHtml(match[1]).trim() : undefined
}

function normalizeImage(value) {
  if (!value) return undefined
  return value.replace(/^https?:\/\/kenyatradex\.africa/i, '')
}

function readHtml(path) {
  return readFileSync(path, 'utf8')
}

function metadata(html, slug) {
  return {
    slug,
    title: textFromFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || slug,
    description: attr(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i),
    canonical: attr(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i),
    image: normalizeImage(attr(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i))
  }
}

function bodyHtml(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  if (main) return main[1]
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)
  return body ? body[1] : html
}

function cleanContentHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<header\b[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, '')
    .replace(/<form\b[\s\S]*?<\/form>/gi, '')
    .replace(/<button\b[\s\S]*?<\/button>/gi, '')
}

function extractJsonLdFaq(html) {
  const faq = []
  for (const match of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = match[1].trim()
    try {
      const parsed = JSON.parse(raw)
      const nodes = Array.isArray(parsed) ? parsed : [parsed]
      for (const node of nodes) {
        if (node['@type'] !== 'FAQPage' || !Array.isArray(node.mainEntity)) continue
        for (const item of node.mainEntity) {
          const question = item.name || item.question
          const answer = item.acceptedAnswer?.text || item.answer
          if (question && answer) faq.push({ question: stripTags(question), answer: stripTags(answer) })
        }
      }
    } catch {
      // Some legacy JSON-LD snippets contain comments or relaxed formatting. Ignore and fall back to visible content.
    }
  }
  return faq
}

function splitSections(html) {
  const sections = [...html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/gi)].map((match) => match[1])
  if (sections.length) return sections
  const articles = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)].map((match) => match[1])
  return articles.length ? articles : [html]
}

function extractLists(sectionHtml, tag = 'li') {
  return [...sectionHtml.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean)
}

function extractCards(sectionHtml) {
  return [...sectionHtml.matchAll(/<(article|div)\b[^>]*(?:card|feature|service|proof|agency|quick|coverage)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => {
      const title = textFromFirst(match[2], /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)
      const text = [...match[2].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((p) => stripTags(p[1])).filter(Boolean).join(' ')
      return [title, text].filter(Boolean).join(': ')
    })
    .filter(Boolean)
}

function extractBlocks(html) {
  const cleaned = cleanContentHtml(bodyHtml(html))
  const blocks = []

  for (const section of splitSections(cleaned)) {
    const title = textFromFirst(section, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i)
      || textFromFirst(section, /<h3\b[^>]*>([\s\S]*?)<\/h3>/i)
      || textFromFirst(section, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
    const paragraphs = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => stripTags(match[1]))
      .filter(Boolean)
      .filter((paragraph) => paragraph !== title)
    const steps = /<ol\b/i.test(section) ? extractLists(section) : []
    const listItems = !steps.length ? extractLists(section) : []
    const cardItems = extractCards(section)
    const items = [...cardItems, ...listItems].filter((item, index, all) => item && all.indexOf(item) === index)

    if (!title && !paragraphs.length && !items.length && !steps.length) continue

    const isNewsletter = title?.toLowerCase().includes('stay informed on trade regulations')
    blocks.push({
      type: isNewsletter ? 'newsletter' : steps.length ? 'steps' : items.length ? 'list' : 'text',
      ...(title ? { title } : {}),
      ...(paragraphs[0] ? { body: paragraphs[0] } : {}),
      ...(paragraphs.length > 1 ? { paragraphs: paragraphs.slice(1) } : {}),
      ...(items.length ? { items } : {}),
      ...(steps.length ? { steps } : {})
    })
  }

  return blocks.filter((block, index, all) => {
    const signature = JSON.stringify(block)
    return all.findIndex((other) => JSON.stringify(other) === signature) === index
  })
}

function extractHero(html, meta) {
  const cleaned = cleanContentHtml(bodyHtml(html))
  const hero = cleaned.match(/<section\b[^>]*(?:hero|article-hero)[^>]*>([\s\S]*?)<\/section>/i)?.[1] || cleaned
  return {
    eyebrow: textFromFirst(hero, /class=["'][^"']*eyebrow[^"']*["'][^>]*>([\s\S]*?)<\//i),
    heading: textFromFirst(hero, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || meta.title,
    lead: textFromFirst(hero, /<p\b[^>]*(?:class=["'][^"']*lead[^"']*["'])?[^>]*>([\s\S]*?)<\/p>/i) || meta.description,
    image: meta.image || '/images/home-hero-og.jpg',
    imageAlt: textFromFirst(hero, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || meta.title
  }
}

function formFor(slug, title) {
  return {
    id: `${slug}-form`,
    pageName: `${title.replace(/\s*\|.*$/, '')} Inquiry`,
    title: 'Request Kenya Tradex support',
    intro: 'Share the cargo file basics and Kenya Tradex will respond with the next practical step.',
    submitLabel: 'Send quote request',
    successMessage: 'Request received. Kenya Tradex will respond shortly.',
    fields: defaultFields
  }
}

function pageRecord(path, slug) {
  const html = readHtml(path)
  const meta = metadata(html, slug)
  return {
    ...meta,
    hero: extractHero(html, meta),
    blocks: extractBlocks(html),
    faq: extractJsonLdFaq(html),
    form: formFor(slug, meta.title)
  }
}

function writeJson(path, value) {
  ensureDir(dirname(path))
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function markdownEscape(value = '') {
  return value.replace(/\n{3,}/g, '\n\n').trim()
}

function htmlToMarkdown(html) {
  let content = cleanContentHtml(html)
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => `\n# ${stripTags(text)}\n`)
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => `\n## ${stripTags(text)}\n`)
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => `\n### ${stripTags(text)}\n`)
    .replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, (_, text) => `\n#### ${stripTags(text)}\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => `\n- ${stripTags(text)}`)
    .replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => `\n${stripTags(text)}\n`)
    .replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (_, text) => `\n${stripTags(text).replace(/\n/g, ' | ')}\n`)
    .replace(/<[^>]+>/g, '\n')
  content = stripTags(content)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n\n')
  return markdownEscape(content)
}

function writeBlog(path) {
  const html = readHtml(path)
  const slug = basename(path, '.html')
  const meta = metadata(html, slug)
  const image = meta.image || normalizeImage(attr(html, /<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/i))
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] || bodyHtml(html)
  const date = attr(html, /article:published_time["']\s+content=["']([^"']*)["']/i)
  const updated = attr(html, /article:modified_time["']\s+content=["']([^"']*)["']/i)
  const frontMatter = [
    '---',
    `title: ${JSON.stringify(meta.title)}`,
    `description: ${JSON.stringify(meta.description || '')}`,
    image ? `image: ${JSON.stringify(image)}` : undefined,
    date ? `date: ${JSON.stringify(date)}` : undefined,
    updated ? `updated: ${JSON.stringify(updated)}` : undefined,
    '---'
  ].filter(Boolean).join('\n')
  writeFileSync(join(contentRoot, 'blog', `${slug}.md`), `${frontMatter}\n\n${htmlToMarkdown(article)}\n`)
}

function copyRecursive(src, dest) {
  if (!existsSync(src)) return
  const stat = statSync(src)
  if (stat.isDirectory()) {
    ensureDir(dest)
    for (const entry of readdirSync(src)) copyRecursive(join(src, entry), join(dest, entry))
    return
  }
  if (extname(src) === '.DS_Store' || extname(src) === '.html') return
  ensureDir(dirname(dest))
  copyFileSync(src, dest)
}

cleanDir(join(contentRoot, 'pages'))
cleanDir(join(contentRoot, 'services'))
cleanDir(join(contentRoot, 'downloads'))
ensureDir(join(contentRoot, 'blog'))

copyRecursive(join(oldRoot, 'images'), join(nuxtRoot, 'public/images'))
copyRecursive(join(oldRoot, 'downloads'), join(nuxtRoot, 'public/downloads'))
if (existsSync(join(oldRoot, 'home-hero.optimized.mp4'))) copyFileSync(join(oldRoot, 'home-hero.optimized.mp4'), join(nuxtRoot, 'public/home-hero.optimized.mp4'))

for (const file of readdirSync(oldRoot)) {
  if (!file.endsWith('.html') || ignoredRootFiles.has(file)) continue
  const filePath = join(oldRoot, file)
  const slug = file === 'index.html' ? 'home' : basename(file, '.html')
  const record = pageRecord(filePath, slug)
  if (serviceSlugs.has(slug)) writeJson(join(contentRoot, 'services', `${slug}.json`), record)
  else if (pageSlugs.has(slug)) writeJson(join(contentRoot, 'pages', `${slug}.json`), record)
}

for (const file of readdirSync(join(oldRoot, 'blog')).filter((entry) => entry.endsWith('.html'))) {
  writeBlog(join(oldRoot, 'blog', file))
}

for (const file of readdirSync(join(oldRoot, 'downloads')).filter((entry) => entry.endsWith('.html'))) {
  const slug = basename(file, '.html')
  const record = pageRecord(join(oldRoot, 'downloads', file), slug)
  const pdf = join(oldRoot, 'downloads', `${slug}.pdf`)
  writeJson(join(contentRoot, 'downloads', `${slug}.json`), {
    ...record,
    canonical: `https://kenyatradex.africa/downloads/${slug}.html`,
    pdf: existsSync(pdf) ? `/downloads/${slug}.pdf` : undefined
  })
}

console.log(`Migrated content from ${oldRoot} to ${relative(nuxtRoot, contentRoot)}.`)
