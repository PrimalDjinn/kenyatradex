import { readAdminSession } from "../utils/admin-auth";

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname;
  const isStudioRoute = pathname === "/_studio" || pathname === "/_studio/";
  const session = readAdminSession(event);
  if (!isStudioRoute) return;

  if (session) {
    const redirect = String(getQuery(event).redirect || "/blog.html");
    return sendRedirect(event, redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/blog.html");
  }

  return sendRedirect(event, `/admin?redirect=${encodeURIComponent(pathname)}`);
});
