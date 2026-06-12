import { jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

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
