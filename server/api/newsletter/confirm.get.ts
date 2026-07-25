import { db, schema } from "@nuxthub/db";
import { and, eq } from "drizzle-orm";
import { hashConfirmationNonce, readSubscriberToken } from "../../utils/newsletter";

export default defineEventHandler(async (event) => {
  const token = readSubscriberToken(String(getQuery(event).token || ""), "confirm");
  if (!token?.nonce)
    throw createError({ statusCode: 400, statusMessage: "This confirmation link is invalid or expired." });

  const confirmed = await db
    .update(schema.newsletterSubscribers)
    .set({
      status: "subscribed",
      confirmationTokenHash: null,
      confirmedAt: new Date(),
      unsubscribedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(schema.newsletterSubscribers.id, token.id),
        eq(schema.newsletterSubscribers.status, "pending"),
        eq(schema.newsletterSubscribers.confirmationTokenHash, hashConfirmationNonce(token.nonce)),
      ),
    )
    .returning({ id: schema.newsletterSubscribers.id });
  if (!confirmed.length)
    throw createError({ statusCode: 400, statusMessage: "This confirmation link has already been used or replaced." });

  return sendRedirect(event, "/blog.html?newsletter=confirmed");
});
