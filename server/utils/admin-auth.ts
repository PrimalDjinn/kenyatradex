import { createHmac, timingSafeEqual } from "node:crypto";
import type { H3Event } from "h3";

export const adminSessionCookie = "kenyatradex_admin_session";

type AdminSession = {
  email: string;
  exp: number;
};

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

export function verifyAdminCredentials(email: string, password: string) {
  const config = useRuntimeConfig();
  const adminEmail = String(process.env.NUXT_ADMIN_EMAIL || config.adminEmail || "")
    .trim()
    .toLowerCase();
  const adminPassword = String(process.env.NUXT_ADMIN_PASSWORD || config.adminPassword || "");

  if (!adminEmail || !adminPassword) {
    throw createError({ statusCode: 500, statusMessage: "Admin credentials are not configured." });
  }

  return safeEqual(email.trim().toLowerCase(), adminEmail) && safeEqual(password, adminPassword);
}

export function createAdminSession(email: string) {
  const config = useRuntimeConfig();
  const secret = String(
    process.env.NUXT_ADMIN_SESSION_SECRET ||
      config.adminSessionSecret ||
      process.env.NUXT_ADMIN_PASSWORD ||
      config.adminPassword ||
      "",
  );
  if (!secret) throw createError({ statusCode: 500, statusMessage: "Admin session secret is not configured." });

  const session: AdminSession = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + 1000 * 60 * 60 * 8,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function readAdminSession(event: H3Event) {
  const config = useRuntimeConfig();
  const secret = String(
    process.env.NUXT_ADMIN_SESSION_SECRET ||
      config.adminSessionSecret ||
      process.env.NUXT_ADMIN_PASSWORD ||
      config.adminPassword ||
      "",
  );
  const token = getCookie(event, adminSessionCookie);
  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!session.email || !session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}
