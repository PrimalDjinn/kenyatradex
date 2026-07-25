import { adminSessionCookie } from "../../utils/admin-auth";

export default defineEventHandler(async (event) => {
  await clearStudioUserSession(event);
  deleteCookie(event, adminSessionCookie, { path: "/" });
  return { success: true };
});
