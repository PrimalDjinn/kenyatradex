import { db, schema } from "@nuxthub/db";
import { and, eq, or } from "drizzle-orm";
import { readSubscriberToken } from "../../utils/newsletter";

export default defineEventHandler(async (event) => {
  const tokenValue = String(getQuery(event).token || getHeader(event, "x-newsletter-token") || "");
  const token = readSubscriberToken(tokenValue, "unsubscribe");
  if (!token) throw createError({ statusCode: 400, statusMessage: "This unsubscribe link is invalid or expired." });

  await db
    .update(schema.newsletterSubscribers)
    .set({ status: "unsubscribed", confirmationTokenHash: null, unsubscribedAt: new Date(), updatedAt: new Date() })
    .where(eq(schema.newsletterSubscribers.id, token.id));
  await db
    .update(schema.newsletterDeliveries)
    .set({ status: "suppressed", updatedAt: new Date() })
    .where(
      and(
        eq(schema.newsletterDeliveries.subscriberId, token.id),
        or(
          eq(schema.newsletterDeliveries.status, "pending"),
          eq(schema.newsletterDeliveries.status, "retry"),
          eq(schema.newsletterDeliveries.status, "processing"),
          eq(schema.newsletterDeliveries.status, "sending"),
        ),
      ),
    );

  return { success: true };
});
