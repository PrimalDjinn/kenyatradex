import { withQuery } from 'ufo'
import { readAdminSession } from '../../../utils/admin-auth'
import { createAuthorizationCode } from '../../../utils/studio-sso'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const session = readAdminSession(event)
  const redirectUri = String(query.redirect_uri || '')
  const state = String(query.state || '')
  const codeChallenge = String(query.code_challenge || '')

  if (!redirectUri || !state || !codeChallenge) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Studio SSO authorization request.' })
  }

  if (!session) {
    const path = getRequestURL(event).pathname
    const search = getRequestURL(event).search
    return sendRedirect(event, `/admin?redirect=${encodeURIComponent(`${path}${search}`)}`)
  }

  const code = createAuthorizationCode(session.email, codeChallenge, redirectUri)
  return sendRedirect(event, withQuery(redirectUri, { code, state }))
})
