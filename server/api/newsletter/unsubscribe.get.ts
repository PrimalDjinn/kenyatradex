import { readSubscriberToken } from "../../utils/newsletter";

export default defineEventHandler((event) => {
  const tokenValue = String(getQuery(event).token || "");
  if (!readSubscriberToken(tokenValue, "unsubscribe")) {
    throw createError({ statusCode: 400, statusMessage: "This unsubscribe link is invalid or expired." });
  }
  return sendRedirect(event, `/newsletter/unsubscribe?token=${encodeURIComponent(tokenValue)}`);
});
