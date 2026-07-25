import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { parse } from 'yaml'

const root = process.cwd()
const blogDirectory = join(root, process.env.NEWSLETTER_BLOG_DIR || 'content/blog')
const deploySha = String(process.env.DEPLOY_SHA || '').trim()

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? markdownFiles(path) : path.endsWith('.md') ? [path] : []
  })
}

function parseFrontMatter(path) {
  const source = readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
  const value = source.match(/^---\n([\s\S]*?)\n---/)?.[1] || ''
  return parse(value) || {}
}

const publications = markdownFiles(blogDirectory)
  .sort()
  .map((file) => {
    const content = parseFrontMatter(file)
    const relativePath = relative(blogDirectory, file).split(sep).join('/').replace(/\.md$/, '')
    const version = Number(content.newsletterVersion || 0)
    const title = String(content.title || '').trim()
    return {
      articleId: `blog/${relativePath}`,
      version,
      title,
      subject: String(content.newsletterSubject || title).trim(),
      summary: String(content.newsletterSummary || content.description || '').trim(),
      url: String(content.path || `/blog/${relativePath}.html`).trim(),
      image: content.image ? String(content.image).trim() : undefined
    }
  })
  .filter(publication => publication.version > 0)

process.stdout.write(JSON.stringify({ deploySha, publications }))
