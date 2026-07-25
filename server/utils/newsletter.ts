import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { H3Event } from "h3";
import nodemailer from "nodemailer";

type SubscriberToken = {
  id: number;
  nonce?: string;
  purpose: "confirm" | "unsubscribe";
  exp: number;
};

export type NewsletterPublicationSnapshot = {
  articleId: string;
  version: number;
  title: string;
  subject: string;
  summary: string;
  url: string;
  image?: string | null;
};

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

function newsletterSecret() {
  const config = useRuntimeConfig();
  const secret = String(process.env.NUXT_NEWSLETTER_SECRET || config.newsletterSecret || "");
  if (!secret) throw createError({ statusCode: 500, statusMessage: "Newsletter token signing is not configured." });
  return secret;
}

export function createConfirmationNonce() {
  const nonce = randomBytes(32).toString("base64url");
  return { nonce, hash: createHash("sha256").update(nonce).digest("base64url") };
}

export function hashConfirmationNonce(nonce: string) {
  return createHash("sha256").update(nonce).digest("base64url");
}

export function createSubscriberToken(id: number, purpose: SubscriberToken["purpose"], nonce?: string) {
  const maxAge = purpose === "confirm" ? 1000 * 60 * 60 * 48 : 1000 * 60 * 60 * 24 * 365 * 5;
  const payload = Buffer.from(
    JSON.stringify({ id, nonce, purpose, exp: Date.now() + maxAge } satisfies SubscriberToken),
  ).toString("base64url");
  return `${payload}.${sign(payload, newsletterSecret())}`;
}

export function readSubscriberToken(token: string, purpose: SubscriberToken["purpose"]) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, newsletterSecret()))) return null;

  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SubscriberToken;
    if (!value.id || value.purpose !== purpose || value.exp < Date.now()) return null;
    return value;
  } catch {
    return null;
  }
}

export function signPipelineBody(body: string, timestamp: string, secret: string) {
  return sign(`${timestamp}.${body}`, secret);
}

export function verifyPipelineRequest(event: H3Event, body: string) {
  const config = useRuntimeConfig();
  const secret = String(process.env.NUXT_NEWSLETTER_PIPELINE_SECRET || config.newsletterPipelineSecret || "");
  const timestamp = getHeader(event, "x-newsletter-timestamp") || "";
  const signature = getHeader(event, "x-newsletter-signature") || "";
  const timestampMs = Number(timestamp) * 1000;

  if (
    !secret ||
    !timestamp ||
    !signature ||
    !Number.isFinite(timestampMs) ||
    Math.abs(Date.now() - timestampMs) > 1000 * 60 * 5
  ) {
    throw createError({ statusCode: 401, statusMessage: "Invalid newsletter pipeline signature." });
  }

  if (!safeEqual(signature, signPipelineBody(body, timestamp, secret))) {
    throw createError({ statusCode: 401, statusMessage: "Invalid newsletter pipeline signature." });
  }
}

export function getNewsletterTransport() {
  const config = useRuntimeConfig();
  const host = String(process.env.NUXT_SMTP_HOST || config.smtpHost || "");
  const user = String(process.env.NUXT_SMTP_USER || config.smtpUser || "");
  const pass = String(process.env.NUXT_SMTP_PASS || config.smtpPass || "");
  if (!host || !user || !pass)
    throw createError({ statusCode: 500, statusMessage: "Newsletter SMTP is not configured." });

  return nodemailer.createTransport({
    host,
    port: Number(process.env.NUXT_SMTP_PORT || config.smtpPort || 587),
    secure: String(process.env.NUXT_SMTP_SECURE || config.smtpSecure || "false") === "true",
    auth: { user, pass },
  });
}

export function getNewsletterFrom() {
  const config = useRuntimeConfig();
  const address = String(
    process.env.NUXT_NEWSLETTER_FROM || config.newsletterFrom || process.env.NUXT_SMTP_USER || config.smtpUser || "",
  );
  if (!address) throw createError({ statusCode: 500, statusMessage: "Newsletter sender is not configured." });
  return { name: "Kenya Tradex", address };
}

export function getNewsletterSiteUrl() {
  const config = useRuntimeConfig();
  return String(config.public.siteUrl || "https://kenyatradex.africa").replace(/\/$/, "");
}

function escapeHtml(value: unknown) {
  return String(value || "").replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character,
  );
}

export function confirmationEmail(name: string | null, confirmationUrl: string) {
  const greeting = name ? `Dear ${escapeHtml(name)},` : "Hello,";
  return `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px"><table role="presentation" width="600" style="max-width:100%;background:#fff"><tr><td style="background:#0b1a33;padding:24px;color:#fff"><h1 style="margin:0;font-size:24px">Confirm Kenya Tradex updates</h1></td></tr><tr><td style="padding:32px 24px"><p>${greeting}</p><p>Confirm that you want monthly customs, trade regulation and logistics updates from Kenya Tradex.</p><p style="margin:28px 0"><a href="${escapeHtml(confirmationUrl)}" style="display:inline-block;background:#b4232f;color:#fff;text-decoration:none;padding:13px 20px;font-weight:700">Confirm subscription</a></p><p>If you did not request these updates, no action is required.</p></td></tr></table></td></tr></table></body></html>`;
}

export function digestEmail(publications: NewsletterPublicationSnapshot[], unsubscribeUrl: string) {
  const articles = publications
    .map(
      (publication) =>
        `<tr><td style="padding:22px 0;border-bottom:1px solid #d8e0ea"><h2 style="margin:0 0 8px;font-size:21px;color:#0b1a33">${escapeHtml(publication.title)}</h2><p style="margin:0 0 14px;line-height:1.6;color:#45536a">${escapeHtml(publication.summary)}</p><a href="${escapeHtml(publication.url)}" style="color:#a51f2b;font-weight:700">Read the guide</a></td></tr>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033"><div style="display:none;max-height:0;overflow:hidden">Customs, trade and logistics updates from Kenya Tradex.</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px"><table role="presentation" width="600" style="max-width:100%;background:#fff"><tr><td style="background:#0b1a33;padding:28px 24px;color:#fff"><h1 style="margin:0;font-size:26px">Kenya Tradex monthly update</h1><p style="margin:8px 0 0;color:#d6dfec">Practical customs and logistics guidance</p></td></tr><tr><td style="padding:12px 24px 28px"><table role="presentation" width="100%">${articles}</table><p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#667085">Kenya Tradex, BP Plaza, 3rd Floor, Umoja Rd, Mombasa, Kenya.<br>You subscribed to Kenya Tradex monthly updates. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#667085">Unsubscribe</a>.</p></td></tr></table></td></tr></table></body></html>`;
}

export function digestText(publications: NewsletterPublicationSnapshot[], unsubscribeUrl: string) {
  const articles = publications
    .map((publication) => `${publication.title}\n${publication.summary}\n${publication.url}`)
    .join("\n\n");
  return `Kenya Tradex monthly update\n\n${articles}\n\nKenya Tradex, BP Plaza, 3rd Floor, Umoja Rd, Mombasa, Kenya.\nUnsubscribe: ${unsubscribeUrl}`;
}
