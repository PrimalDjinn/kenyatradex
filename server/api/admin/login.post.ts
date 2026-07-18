import { adminSessionCookie, createAdminSession, verifyAdminCredentials } from '../../utils/admin-auth'

type LoginBody = {
  email?: string
  password?: string
}

const attempts = new Map<string, { count: number; resetAt: number }>()
const windowMs = 15 * 60 * 1000
const maxAttempts = 8

function checkRateLimit(ip: string) {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs })
    return
  }
  entry.count += 1
  if (entry.count > maxAttempts) {
    throw createError({ statusCode: 429, statusMessage: 'Too many login attempts. Please try again later.' })
  }
}

function clearRateLimit(ip: string) {
  attempts.delete(ip)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = String(body.email || '')
  const password = String(body.password || '')
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  checkRateLimit(ip)

  if (!verifyAdminCredentials(email, password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid admin email or password.' })
  }

  clearRateLimit(ip)

  const adminEmail = email.trim().toLowerCase()

  await setStudioUserSession(event, {
    providerId: adminEmail,
    name: 'Kenya Tradex Admin',
    email: adminEmail,
    avatar: ''
  })

  setCookie(event, adminSessionCookie, createAdminSession(adminEmail), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  })

  return { success: true }
})
