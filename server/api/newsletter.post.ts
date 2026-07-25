import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import {
  confirmationEmail,
  createConfirmationNonce,
  createSubscriberToken,
  getNewsletterFrom,
  getNewsletterSiteUrl,
  getNewsletterTransport,
} from "../utils/newsletter";

type NewsletterPayload = {
  name?: string;
  email?: string;
  source?: string;
  website?: string;
  "g-recaptcha-response"?: string;
};

function clean(value: unknown) {
  return String(value || "").trim();
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<NewsletterPayload>(event);
  if (clean(body.website)) return { success: true };

  const name = clean(body.name).slice(0, 120) || null;
  const email = clean(body.email).toLowerCase();
  const source = (clean(body.source) || "website").slice(0, 120);
  const recaptchaResponse = clean(body["g-recaptcha-response"]);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "A valid email address is required." });
  }
  if (email.length > 320) throw createError({ statusCode: 400, statusMessage: "A valid email address is required." });

  const recaptchaSecret = String(process.env.NUXT_RECAPTCHA_SECRET || config.recaptchaSecret || "");
  if (!recaptchaSecret || !recaptchaResponse)
    throw createError({ statusCode: 400, statusMessage: "Please complete the reCAPTCHA verification." });
  const verification = await $fetch<{ success?: boolean }>("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: recaptchaSecret,
      response: recaptchaResponse,
      remoteip: getRequestIP(event) || "",
    }),
  });
  if (!verification.success)
    throw createError({ statusCode: 400, statusMessage: "reCAPTCHA verification failed. Please try again." });

  const [existing] = await db
    .select()
    .from(schema.newsletterSubscribers)
    .where(eq(schema.newsletterSubscribers.email, email))
    .limit(1);
  const response = { success: true, confirmationRequired: true };
  if (existing?.status === "subscribed" && existing.confirmedAt) return response;
  if (existing?.bouncedAt || existing?.complainedAt) return response;
  if (existing?.status === "pending" && Date.now() - existing.updatedAt.getTime() < 10 * 60 * 1000) return response;

  const now = new Date();
  const confirmation = createConfirmationNonce();
  const [subscriber] = existing
    ? await db
        .update(schema.newsletterSubscribers)
        .set({
          name,
          source,
          status: "pending",
          frequency: "monthly",
          consentAt: now,
          confirmationTokenHash: confirmation.hash,
          confirmedAt: null,
          unsubscribedAt: null,
          updatedAt: now,
        })
        .where(eq(schema.newsletterSubscribers.id, existing.id))
        .returning()
    : await db
        .insert(schema.newsletterSubscribers)
        .values({
          name,
          email,
          source,
          status: "pending",
          frequency: "monthly",
          consentAt: now,
          confirmationTokenHash: confirmation.hash,
          updatedAt: now,
        })
        .onConflictDoNothing({ target: schema.newsletterSubscribers.email })
        .returning();
  if (!subscriber) return response;

  const token = createSubscriberToken(subscriber.id, "confirm", confirmation.nonce);
  const confirmationUrl = `${getNewsletterSiteUrl()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
  await getNewsletterTransport().sendMail({
    from: getNewsletterFrom(),
    to: subscriber.email,
    subject: "Confirm your Kenya Tradex updates",
    html: confirmationEmail(subscriber.name, confirmationUrl),
    replyTo: "info@kenyatradex.africa",
  });

  return response;
});
