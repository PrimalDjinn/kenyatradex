import { index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  pageName: text('page_name').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  service: text('service'),
  destination: text('destination'),
  message: text('message').notNull(),
  fields: jsonb('fields').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  source: text('source').notNull().default('website'),
  status: text('status').notNull().default('subscribed'),
  frequency: text('frequency').notNull().default('monthly'),
  consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),
  confirmationTokenHash: text('confirmation_token_hash'),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  bouncedAt: timestamp('bounced_at', { withTimezone: true }),
  complainedAt: timestamp('complained_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex('newsletter_subscribers_email_idx').on(table.email)
])

export const newsletterPublications = pgTable('newsletter_publications', {
  id: serial('id').primaryKey(),
  articleId: text('article_id').notNull(),
  version: integer('version').notNull(),
  title: text('title').notNull(),
  subject: text('subject').notNull(),
  summary: text('summary').notNull(),
  url: text('url').notNull(),
  image: text('image'),
  deploySha: text('deploy_sha').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  digestedAt: timestamp('digested_at', { withTimezone: true })
}, (table) => [
  uniqueIndex('newsletter_publications_article_version_idx').on(table.articleId, table.version),
  index('newsletter_publications_digest_idx').on(table.digestedAt)
])

export const newsletterCampaigns = pgTable('newsletter_campaigns', {
  id: serial('id').primaryKey(),
  key: text('key').notNull(),
  subject: text('subject').notNull(),
  preheader: text('preheader').notNull(),
  publications: jsonb('publications').notNull(),
  status: text('status').notNull().default('pending'),
  recipientCount: integer('recipient_count').notNull().default(0),
  sentCount: integer('sent_count').notNull().default(0),
  failedCount: integer('failed_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true })
}, (table) => [
  uniqueIndex('newsletter_campaigns_key_idx').on(table.key),
  index('newsletter_campaigns_status_idx').on(table.status)
])

export const newsletterDeliveries = pgTable('newsletter_deliveries', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').notNull().references(() => newsletterCampaigns.id, { onDelete: 'cascade' }),
  subscriberId: integer('subscriber_id').notNull().references(() => newsletterSubscribers.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'),
  attempts: integer('attempts').notNull().default(0),
  nextAttemptAt: timestamp('next_attempt_at', { withTimezone: true }).notNull().defaultNow(),
  providerId: text('provider_id'),
  lastError: text('last_error'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex('newsletter_deliveries_campaign_subscriber_idx').on(table.campaignId, table.subscriberId),
  index('newsletter_deliveries_queue_idx').on(table.status, table.nextAttemptAt)
])
