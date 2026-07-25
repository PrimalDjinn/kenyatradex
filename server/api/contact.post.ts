import nodemailer from 'nodemailer'
import { db, schema } from '@nuxthub/db'

type FormPayload = Record<string, string | string[] | undefined>

function clean(value: unknown) {
  if (Array.isArray(value)) return value.join(', ').trim()
  return String(value || '').trim()
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] || char)
}

async function verifyRecaptcha(secret: string, response: string, remoteip?: string) {
  const body = new URLSearchParams({ secret, response })
  if (remoteip) body.set('remoteip', remoteip)
  const result = await $fetch<{ success?: boolean }>('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body
  })
  return Boolean(result.success)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<FormPayload>(event)
  const recaptchaResponse = clean(body['g-recaptcha-response'])
  const recaptchaSecret = String(process.env.NUXT_RECAPTCHA_SECRET || config.recaptchaSecret || '')
  const smtpHost = String(process.env.NUXT_SMTP_HOST || config.smtpHost || '')
  const smtpPort = String(process.env.NUXT_SMTP_PORT || config.smtpPort || '587')
  const smtpSecure = String(process.env.NUXT_SMTP_SECURE || config.smtpSecure || 'false')
  const smtpUser = String(process.env.NUXT_SMTP_USER || config.smtpUser || '')
  const smtpPass = String(process.env.NUXT_SMTP_PASS || config.smtpPass || '')
  const formRecipient = String(process.env.NUXT_FORM_RECIPIENT || config.formRecipient || 'info@kenyatradex.africa')
  const siteUrl = getSiteUrl(event)

  if (!recaptchaSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Server reCAPTCHA configuration is incomplete. Please contact Kenya Tradex directly at info@kenyatradex.africa.' })
  }
  if (!recaptchaResponse) {
    throw createError({ statusCode: 400, statusMessage: 'Please complete the reCAPTCHA verification.' })
  }

  const verified = await verifyRecaptcha(recaptchaSecret, recaptchaResponse, getRequestIP(event) || undefined)
  if (!verified) {
    throw createError({ statusCode: 400, statusMessage: 'reCAPTCHA verification failed. Please try again.' })
  }

  const ignore = new Set(['g-recaptcha-response'])
  const fields: Record<string, string> = {}
  for (const [key, value] of Object.entries(body)) {
    if (ignore.has(key)) continue
    const cleanKey = clean(key)
    const cleanValue = clean(value).replace(/[\r\n]/g, cleanKey === 'email' || cleanKey === 'name' ? '' : '\n')
    if (cleanKey && cleanValue) fields[cleanKey] = cleanValue
  }

  const errors: string[] = []
  const name = fields.name || ''
  const email = fields.email || ''
  const phone = fields.phone || ''
  const message = fields.message || ''

  if (name.length < 2) errors.push('Name is required (minimum 2 characters)')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email address is required')
  if (phone) {
    const phoneClean = phone.replace(/[\s()\-+]/g, '')
    if (!/^(254|0)?[1-9]\d{8,9}$/.test(phoneClean)) errors.push('Phone number must be valid (e.g., (254) 723 000 000)')
  }
  if (!message) errors.push('Please provide cargo/service details')
  if (errors.length) throw createError({ statusCode: 400, statusMessage: errors.join('. ') })

  const pageName = fields.page_name || 'Website Inquiry'
  const service = fields.service || fields.service_interest || fields.shipment_type || fields.shipping_method || fields.cargo_type || fields.vehicle_type || fields.location || pageName
  const destination = fields.destination || fields.country || fields.origin_country || fields.origin || fields.location
  fields.service = service
  if (destination) fields.destination = destination

  await db.insert(schema.inquiries).values({
    pageName,
    name,
    email,
    phone: phone || null,
    service,
    destination: destination || null,
    message,
    fields
  })

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw createError({ statusCode: 500, statusMessage: 'Server email configuration is incomplete. Please contact Kenya Tradex directly at info@kenyatradex.africa.' })
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: smtpSecure === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  })

  const rows = Object.entries(fields)
    .map(([key, value]) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:30%;">${escapeHtml(key.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()))}:</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`)
    .join('')
  const ownerHtml = `<html><body style="font-family:Arial,sans-serif;color:#333;"><h2 style="color:#0B1A33;">New website inquiry received</h2><table style="border-collapse:collapse;width:100%;max-width:600px;">${rows}</table></body></html>`
  const autoReplyHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f8fafc;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;"><tr><td style="background:#0B1A33;padding:24px;text-align:center;"><h1 style="margin:0;color:#fff;font-size:24px;">Kenya Tradex</h1><p style="margin:8px 0 0;color:rgba(255,255,255,.8);">Freight Forwarding & Logistics</p></td></tr><tr><td style="padding:32px 24px;"><p>Dear ${escapeHtml(name)},</p><p>Thank you for contacting Kenya Tradex.</p><p>We have received your inquiry and our team is reviewing it. We will get back to you shortly.</p><p>Phone: <a href="tel:+254721596259">+254 721 596 259</a><br>Email: <a href="mailto:info@kenyatradex.africa">info@kenyatradex.africa</a><br>Website: <a href="${siteUrl}">${siteUrl.replace(/^https?:\/\//, '')}</a></p><p>Kind regards,<br><strong>Kenya Tradex Team</strong></p></td></tr></table></td></tr></table></body></html>`

  try {
    await transporter.sendMail({
      from: { name: 'Kenya Tradex', address: smtpUser },
      to: formRecipient,
      replyTo: email,
      subject: `${pageName} | Kenya Tradex Inquiry`,
      html: ownerHtml
    })
    await transporter.sendMail({
      from: { name: 'Kenya Tradex', address: smtpUser },
      to: email,
      subject: 'Kenya Tradex: Inquiry Received',
      html: autoReplyHtml,
      replyTo: 'info@kenyatradex.africa'
    })
  } catch (error) {
    console.error('Kenya Tradex Form Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email. Please try again.' })
  }

  return { success: true }
})
