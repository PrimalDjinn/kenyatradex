import { consumeAuthorizationCode, verifyStudioClient } from '../../../utils/studio-sso'

type TokenRequest = {
  grant_type?: string
  code?: string
  client_id?: string
  client_secret?: string
  redirect_uri?: string
  code_verifier?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<TokenRequest>(event)
  const clientId = String(body.client_id || '')
  const clientSecret = String(body.client_secret || '')

  if (body.grant_type !== 'authorization_code' || !verifyStudioClient(clientId, clientSecret)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Studio SSO token request.' })
  }

  const accessToken = consumeAuthorizationCode(String(body.code || ''), String(body.code_verifier || ''), String(body.redirect_uri || ''))
  if (!accessToken) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or expired Studio SSO authorization code.' })
  }

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 600
  }
})
