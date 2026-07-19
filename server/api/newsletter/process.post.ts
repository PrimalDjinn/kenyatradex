import { db, schema } from '@nuxthub/db'
import { and, eq, inArray, isNotNull, isNull, lte, or } from 'drizzle-orm'
import { createSubscriberToken, digestEmail, digestText, getNewsletterFrom, getNewsletterSiteUrl, getNewsletterTransport, verifyPipelineRequest, type NewsletterPublicationSnapshot } from '../../utils/newsletter'

type ProcessPayload = {
  forceDigest?: boolean
}

const batchSize = 25
const maxAttempts = 5

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event) || '{}'
  verifyPipelineRequest(event, rawBody)

  const payload = parseProcessPayload(rawBody)

  const now = new Date()
  const month = now.toISOString().slice(0, 7)
  await db.update(schema.newsletterDeliveries).set({
    status: 'review',
    lastError: 'Delivery was interrupted while SMTP acceptance was unknown.',
    updatedAt: now
  }).where(and(eq(schema.newsletterDeliveries.status, 'sending'), lte(schema.newsletterDeliveries.nextAttemptAt, now)))
  if (payload.forceDigest || now.getUTCDate() === 1) await createMonthlyDigest(month, now)

  const queue = await db.select({
    deliveryId: schema.newsletterDeliveries.id,
    campaignId: schema.newsletterDeliveries.campaignId,
    subscriberId: schema.newsletterSubscribers.id,
    subscriberName: schema.newsletterSubscribers.name,
    email: schema.newsletterSubscribers.email,
    deliveryStatus: schema.newsletterDeliveries.status,
    attempts: schema.newsletterDeliveries.attempts,
    subject: schema.newsletterCampaigns.subject,
    publications: schema.newsletterCampaigns.publications
  })
    .from(schema.newsletterDeliveries)
    .innerJoin(schema.newsletterCampaigns, eq(schema.newsletterDeliveries.campaignId, schema.newsletterCampaigns.id))
    .innerJoin(schema.newsletterSubscribers, eq(schema.newsletterDeliveries.subscriberId, schema.newsletterSubscribers.id))
    .where(and(
      or(eq(schema.newsletterDeliveries.status, 'pending'), eq(schema.newsletterDeliveries.status, 'retry'), eq(schema.newsletterDeliveries.status, 'processing')),
      lte(schema.newsletterDeliveries.nextAttemptAt, now),
      or(eq(schema.newsletterCampaigns.status, 'pending'), eq(schema.newsletterCampaigns.status, 'sending')),
      eq(schema.newsletterSubscribers.status, 'subscribed'),
      isNotNull(schema.newsletterSubscribers.confirmedAt)
    ))
    .limit(batchSize)

  const transport = queue.length ? getNewsletterTransport() : null
  const siteUrl = getNewsletterSiteUrl()
  const campaignIds = [...new Set(queue.map(item => item.campaignId))]
  if (campaignIds.length) {
    await db.update(schema.newsletterCampaigns)
      .set({ status: 'sending', startedAt: now })
      .where(and(inArray(schema.newsletterCampaigns.id, campaignIds), eq(schema.newsletterCampaigns.status, 'pending')))
  }

  let claimedCount = 0
  let sent = 0
  let retried = 0
  let failed = 0
  for (const item of queue) {
    const claimed = await db.update(schema.newsletterDeliveries).set({
      status: 'processing',
      nextAttemptAt: new Date(Date.now() + 15 * 60 * 1000),
      updatedAt: new Date()
    }).where(and(
      eq(schema.newsletterDeliveries.id, item.deliveryId),
      eq(schema.newsletterDeliveries.status, item.deliveryStatus),
      lte(schema.newsletterDeliveries.nextAttemptAt, now)
    )).returning({ id: schema.newsletterDeliveries.id })
    if (!claimed.length) continue
    claimedCount++

    const attempts = item.attempts + 1
    try {
      const [active] = await db.select({
        deliveryStatus: schema.newsletterDeliveries.status,
        subscriberStatus: schema.newsletterSubscribers.status
      }).from(schema.newsletterDeliveries)
        .innerJoin(schema.newsletterSubscribers, eq(schema.newsletterDeliveries.subscriberId, schema.newsletterSubscribers.id))
        .where(eq(schema.newsletterDeliveries.id, item.deliveryId))
        .limit(1)
      if (!active || active.deliveryStatus !== 'processing' || active.subscriberStatus !== 'subscribed') {
        await db.update(schema.newsletterDeliveries).set({ status: 'suppressed', updatedAt: new Date() })
          .where(and(eq(schema.newsletterDeliveries.id, item.deliveryId), eq(schema.newsletterDeliveries.status, 'processing')))
        continue
      }

      const sending = await db.update(schema.newsletterDeliveries).set({ status: 'sending', updatedAt: new Date() })
        .where(and(eq(schema.newsletterDeliveries.id, item.deliveryId), eq(schema.newsletterDeliveries.status, 'processing')))
        .returning({ id: schema.newsletterDeliveries.id })
      if (!sending.length) continue

      const unsubscribeToken = createSubscriberToken(item.subscriberId, 'unsubscribe')
      const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
      const oneClickUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
      const publications = (item.publications as NewsletterPublicationSnapshot[]).map(publication => ({
        ...publication,
        url: publication.url.startsWith('http') ? publication.url : `${siteUrl}${publication.url}`
      }))
      const result = await transport!.sendMail({
        from: getNewsletterFrom(),
        to: item.email,
        subject: item.subject,
        html: digestEmail(publications, unsubscribeUrl),
        text: digestText(publications, unsubscribeUrl),
        replyTo: 'info@kenyatradex.africa',
        headers: {
          'List-Unsubscribe': `<${oneClickUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      })
      await db.update(schema.newsletterDeliveries).set({
        status: 'sent',
        attempts,
        providerId: result.messageId || null,
        lastError: null,
        sentAt: new Date(),
        updatedAt: new Date()
      }).where(and(eq(schema.newsletterDeliveries.id, item.deliveryId), eq(schema.newsletterDeliveries.status, 'sending')))
      sent++
    } catch (error) {
      const terminal = attempts >= maxAttempts
      const delayMinutes = Math.min(24 * 60, 5 * (2 ** Math.max(0, attempts - 1)))
      const transportError = error as { code?: string, responseCode?: number }
      const responseCode = Number(transportError.responseCode || 0)
      const retryableCode = ['EDNS', 'ECONNECTION', 'ECONNREFUSED'].includes(String(transportError.code || ''))
      const retryable = (responseCode >= 400 && responseCode < 500 || retryableCode) && !terminal
      await db.update(schema.newsletterDeliveries).set({
        status: retryable ? 'retry' : responseCode >= 500 || terminal ? 'failed' : 'review',
        attempts,
        nextAttemptAt: new Date(Date.now() + delayMinutes * 60 * 1000),
        lastError: String(error instanceof Error ? error.message : error).slice(0, 1000),
        updatedAt: new Date()
      }).where(and(eq(schema.newsletterDeliveries.id, item.deliveryId), eq(schema.newsletterDeliveries.status, 'sending')))
      if (retryable) retried++
      else failed++
    }
  }

  const activeCampaigns = await db.select({ id: schema.newsletterCampaigns.id }).from(schema.newsletterCampaigns)
    .where(or(eq(schema.newsletterCampaigns.status, 'pending'), eq(schema.newsletterCampaigns.status, 'sending')))
  for (const campaignId of new Set([...campaignIds, ...activeCampaigns.map(campaign => campaign.id)])) await refreshCampaign(campaignId)
  return { success: true, processed: claimedCount, sent, retried, failed }
})

async function createMonthlyDigest(month: string, now: Date) {
  const publications = await db.select().from(schema.newsletterPublications).where(isNull(schema.newsletterPublications.digestedAt))
  if (!publications.length) return

  const latestPublications = [...publications.reduce((latest, publication) => {
    const current = latest.get(publication.articleId)
    if (!current || publication.version > current.version) latest.set(publication.articleId, publication)
    return latest
  }, new Map<string, typeof publications[number]>()).values()]
  const snapshots: NewsletterPublicationSnapshot[] = latestPublications.map(publication => ({
    articleId: publication.articleId,
    version: publication.version,
    title: publication.title,
    subject: publication.subject,
    summary: publication.summary,
    url: publication.url,
    image: publication.image
  }))
  const firstPublication = snapshots[0]!
  const subject = snapshots.length === 1 ? firstPublication.subject : `Kenya Tradex monthly update: ${snapshots.length} new guides`
  await db.transaction(async (tx) => {
    const [campaign] = await tx.insert(schema.newsletterCampaigns).values({
      key: `monthly-${month}`,
      subject,
      preheader: firstPublication.summary,
      publications: snapshots
    }).onConflictDoNothing({ target: schema.newsletterCampaigns.key }).returning()
    if (!campaign) return

    const subscribers = await tx.select({ id: schema.newsletterSubscribers.id })
      .from(schema.newsletterSubscribers)
      .where(and(
        eq(schema.newsletterSubscribers.status, 'subscribed'),
        eq(schema.newsletterSubscribers.frequency, 'monthly'),
        isNotNull(schema.newsletterSubscribers.confirmedAt)
      ))

    if (subscribers.length) {
      await tx.insert(schema.newsletterDeliveries)
        .values(subscribers.map(subscriber => ({ campaignId: campaign.id, subscriberId: subscriber.id })))
        .onConflictDoNothing({ target: [schema.newsletterDeliveries.campaignId, schema.newsletterDeliveries.subscriberId] })
    }
    await tx.update(schema.newsletterPublications)
      .set({ digestedAt: now })
      .where(inArray(schema.newsletterPublications.id, publications.map(publication => publication.id)))
    await tx.update(schema.newsletterCampaigns)
      .set({ recipientCount: subscribers.length, status: subscribers.length ? 'pending' : 'completed', completedAt: subscribers.length ? null : now })
      .where(eq(schema.newsletterCampaigns.id, campaign.id))
  })
}

function parseProcessPayload(rawBody: string) {
  try {
    return JSON.parse(rawBody) as ProcessPayload
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid newsletter worker payload.' })
  }
}

async function refreshCampaign(campaignId: number) {
  const deliveries = await db.select({ status: schema.newsletterDeliveries.status })
    .from(schema.newsletterDeliveries)
    .where(eq(schema.newsletterDeliveries.campaignId, campaignId))
  const sentCount = deliveries.filter(delivery => delivery.status === 'sent').length
  const failedCount = deliveries.filter(delivery => ['failed', 'review'].includes(delivery.status)).length
  const activeCount = deliveries.filter(delivery => ['pending', 'retry', 'processing', 'sending'].includes(delivery.status)).length
  await db.update(schema.newsletterCampaigns).set({
    sentCount,
    failedCount,
    status: activeCount ? 'sending' : 'completed',
    completedAt: activeCount ? null : new Date()
  }).where(eq(schema.newsletterCampaigns.id, campaignId))
}
