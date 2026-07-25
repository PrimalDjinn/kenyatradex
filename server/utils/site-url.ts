import type { H3Event } from "h3";

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl(event: H3Event) {
  const config = useRuntimeConfig(event);
  const configured = String(config.public.siteUrl || "").trim();
  if (configured) return normalizeSiteUrl(configured);
  return normalizeSiteUrl(getRequestURL(event).origin);
}
