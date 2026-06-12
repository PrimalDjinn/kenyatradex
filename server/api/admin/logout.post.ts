import { adminSessionCookie } from '../../utils/admin-auth'

export default defineEventHandler((event) => {
  deleteCookie(event, adminSessionCookie, { path: '/' })
  return { success: true }
})
