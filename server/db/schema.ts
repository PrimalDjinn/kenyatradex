import { jsonb, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

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
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex('newsletter_subscribers_email_idx').on(table.email)
])
