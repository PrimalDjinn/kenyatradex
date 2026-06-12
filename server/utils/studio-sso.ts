import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

type AuthorizationCode = {
  email: string
  codeChallenge: string
  redirectUri: string
  expiresAt: number
}

type AccessToken = {
  email: string
  expiresAt: number
}

const codes = new Map<string, AuthorizationCode>()
const tokens = new Map<string, AccessToken>()

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer)
}

export function verifyStudioClient(clientId: string, clientSecret: string) {
  const expectedId = process.env.STUDIO_SSO_CLIENT_ID || 'kenyatradex-studio'
  const expectedSecret = process.env.STUDIO_SSO_CLIENT_SECRET || process.env.NUXT_ADMIN_SESSION_SECRET || process.env.NUXT_ADMIN_PASSWORD || ''
  return Boolean(expectedSecret) && safeEqual(clientId, expectedId) && safeEqual(clientSecret, expectedSecret)
}

export function createAuthorizationCode(email: string, codeChallenge: string, redirectUri: string) {
  const code = randomBytes(32).toString('base64url')
  codes.set(code, {
    email,
    codeChallenge,
    redirectUri,
    expiresAt: Date.now() + 5 * 60 * 1000
  })
  return code
}

export function consumeAuthorizationCode(code: string, codeVerifier: string, redirectUri: string) {
  const entry = codes.get(code)
  codes.delete(code)
  if (!entry || entry.expiresAt < Date.now() || entry.redirectUri !== redirectUri) return null

  const challenge = createHash('sha256').update(codeVerifier).digest('base64url')
  if (!safeEqual(challenge, entry.codeChallenge)) return null

  const accessToken = randomBytes(32).toString('base64url')
  tokens.set(accessToken, {
    email: entry.email,
    expiresAt: Date.now() + 10 * 60 * 1000
  })
  return accessToken
}

export function readAccessToken(value: string) {
  const entry = tokens.get(value)
  if (!entry || entry.expiresAt < Date.now()) {
    tokens.delete(value)
    return null
  }
  return entry
}
