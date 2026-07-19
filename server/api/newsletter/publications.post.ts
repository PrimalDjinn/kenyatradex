import { db, schema } from '@nuxthub/db'
import { queryCollection } from '@nuxt/content/server'
import { verifyPipelineRequest } from '../../utils/newsletter'

type PublicationPayload = {
  deploySha?: string
  publications?: Array<{
    articleId?: string
    version?: number
    title?: string
    subject?: string
    summary?: string
    url?: string
    image?: string
  }>
}

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event) || '{}'
  verifyPipelineRequest(event, rawBody)

  let payload: PublicationPayload
  try {
    payload = JSON.parse(rawBody) as PublicationPayload
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid publication payload.' })
  }

  const deploySha = String(payload.deploySha || '').trim()
  const publications = Array.isArray(payload.publications) ? payload.publications.slice(0, 100) : []
  if (!deploySha) throw createError({ statusCode: 400, statusMessage: 'Deployment SHA is required.' })

  let accepted = 0
  for (const publication of publications) {
    const articleId = String(publication.articleId || '').trim()
    const version = Number(publication.version || 0)
    const title = String(publication.title || '').trim()
    const summary = String(publication.summary || '').trim()
    const path = String(publication.url || '').trim()
    if (!articleId || !Number.isInteger(version) || version < 1 || !title || !summary || !path.startsWith('/blog/') || !path.endsWith('.html')) continue

    const deployed = await queryCollection(event, 'blog').path(path).first()
    if (!deployed || Number(deployed.newsletterVersion || 0) !== version) {
      throw createError({ statusCode: 409, statusMessage: 'The newsletter publication is not deployed yet.' })
    }

    const rows = await db.insert(schema.newsletterPublications).values({
      articleId,
      version,
      title,
      subject: String(publication.subject || title).trim(),
      summary,
      url: path,
      image: String(publication.image || '').trim() || null,
      deploySha
    }).onConflictDoNothing({
      target: [schema.newsletterPublications.articleId, schema.newsletterPublications.version]
    }).returning({ id: schema.newsletterPublications.id })
    accepted += rows.length
  }

  return { success: true, accepted }
})
