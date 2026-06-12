import { readAccessToken } from '../../../utils/studio-sso'

export default defineEventHandler((event) => {
  const authorization = getHeader(event, 'authorization') || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  const session = readAccessToken(token)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Studio SSO access token.' })
  }

  return {
    sub: session.email,
    email: session.email,
    name: 'Kenya Tradex Admin',
    picture: '/images/kenya-tradex-logo.png',
    git_provider: 'github'
  }
})
