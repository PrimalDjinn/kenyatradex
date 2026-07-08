import { readAdminSession } from '../utils/admin-auth'

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname
  const isStudioRoute = pathname === '/_studio' || pathname.startsWith('/_studio/') || pathname.startsWith('/__nuxt_studio/')
  const session = readAdminSession(event)
  if (!isStudioRoute) return

  if (session) {
    if (pathname === '/_studio') {
      const redirect = String(getQuery(event).redirect || '/blog.html')
      return sendRedirect(event, redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/blog.html')
    }
    return
  }

  const acceptsHtml = getHeader(event, 'accept')?.includes('text/html')
  if (pathname.startsWith('/__nuxt_studio/') && !acceptsHtml) {
    throw createError({ statusCode: 401, statusMessage: 'Admin login required.' })
  }

  return sendRedirect(event, `/admin?redirect=${encodeURIComponent(pathname)}`)
})
