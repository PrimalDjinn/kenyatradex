import { readAdminSession } from "../../utils/admin-auth";

export default defineEventHandler((event) => {
  const session = readAdminSession(event);
  return { authenticated: Boolean(session), email: session?.email || null };
});
