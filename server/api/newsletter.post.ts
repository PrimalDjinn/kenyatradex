import { db, schema } from '@nuxthub/db'

type NewsletterPayload = {
  name?: string
  email?: string
  source?: string
  website?: string
}

function clean(value: unknown) {
  return String(value || '').trim()
}

export default defineEventHandler(async (event) => {
  const body = await readBody<NewsletterPayload>(event)
  if (clean(body.website)) return { success: true }

  const name = clean(body.name) || null
  const email = clean(body.email).toLowerCase()
  const source = clean(body.source) || 'website'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid email address is required.' })
  }

  await db.insert(schema.newsletterSubscribers)
    .values({ name, email, source, status: 'subscribed', updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.newsletterSubscribers.email,
      set: { name, source, status: 'subscribed', updatedAt: new Date() }
    })

  return { success: true }
})
