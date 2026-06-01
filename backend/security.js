/* global process */
import { Buffer } from 'node:buffer'
import { createHash, createVerify } from 'node:crypto'

const firebaseCertsUrl =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
const jsonContentType = 'application/json'

let firebaseCertCache = {
  certs: null,
  expiresAt: 0,
}

const rateLimitBuckets = new Map()

class ApiError extends Error {
  constructor(statusCode, publicMessage, logMessage = publicMessage) {
    super(logMessage)
    this.statusCode = statusCode
    this.publicMessage = publicMessage
  }
}

const getFirebaseProjectId = () =>
  process.env.FIREBASE_PROJECT_ID ||
  process.env.VITE_FIREBASE_PROJECT_ID ||
  ''

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || 'padariyaarth@gmail.com,info.elurajewels@gmail.com,services@ecliptixsolutions.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

const safeJson = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const decodeBase64UrlJson = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

  return safeJson(Buffer.from(padded, 'base64').toString('utf8'))
}

const getAuthorizationToken = (req) => {
  const header = req.headers?.authorization || req.headers?.Authorization || ''
  const match = /^Bearer\s+(.+)$/i.exec(header)

  return match?.[1] ?? ''
}

async function getFirebaseCerts() {
  if (firebaseCertCache.certs && Date.now() < firebaseCertCache.expiresAt) {
    return firebaseCertCache.certs
  }

  const response = await fetch(firebaseCertsUrl)

  if (!response.ok) {
    throw new ApiError(503, 'Authentication is temporarily unavailable.', 'Unable to fetch Firebase public certificates.')
  }

  const cacheControl = response.headers.get('cache-control') || ''
  const maxAgeMatch = /max-age=(\d+)/.exec(cacheControl)
  const maxAge = Number(maxAgeMatch?.[1] || 3600)

  firebaseCertCache = {
    certs: await response.json(),
    expiresAt: Date.now() + maxAge * 1000,
  }

  return firebaseCertCache.certs
}

async function verifyFirebaseIdToken(idToken) {
  const projectId = getFirebaseProjectId()

  if (!projectId) {
    throw new ApiError(503, 'Authentication is not configured.', 'Missing Firebase project ID.')
  }

  const parts = String(idToken || '').split('.')

  if (parts.length !== 3) {
    throw new ApiError(401, 'Unauthorized.', 'Malformed Firebase ID token.')
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const header = decodeBase64UrlJson(encodedHeader)
  const payload = decodeBase64UrlJson(encodedPayload)

  if (!header?.kid || header.alg !== 'RS256' || !payload) {
    throw new ApiError(401, 'Unauthorized.', 'Invalid Firebase ID token header or payload.')
  }

  const certs = await getFirebaseCerts()
  const cert = certs[header.kid]

  if (!cert) {
    throw new ApiError(401, 'Unauthorized.', 'Firebase certificate key was not found.')
  }

  const verifier = createVerify('RSA-SHA256')
  verifier.update(`${encodedHeader}.${encodedPayload}`)
  verifier.end()

  const signature = Buffer.from(
    encodedSignature.replace(/-/g, '+').replace(/_/g, '/'),
    'base64',
  )

  if (!verifier.verify(cert, signature)) {
    throw new ApiError(401, 'Unauthorized.', 'Firebase ID token signature verification failed.')
  }

  const nowSeconds = Math.floor(Date.now() / 1000)
  const issuer = `https://securetoken.google.com/${projectId}`

  if (payload.aud !== projectId || payload.iss !== issuer || payload.exp <= nowSeconds) {
    throw new ApiError(401, 'Unauthorized.', 'Firebase ID token claims are invalid or expired.')
  }

  return payload
}

async function requireAdmin(req) {
  const payload = await requireAuthenticated(req)
  const email = String(payload.email || '').toLowerCase()

  if (!email || !getAdminEmails().includes(email)) {
    throw new ApiError(403, 'Forbidden.', `Non-admin API access attempt from ${email || 'unknown email'}.`)
  }

  req.adminUser = {
    uid: payload.user_id || payload.sub,
    email,
  }
}

async function requireAuthenticated(req) {
  const token = getAuthorizationToken(req)

  if (!token) {
    throw new ApiError(401, 'Unauthorized.', 'Missing admin Authorization header.')
  }

  const payload = await verifyFirebaseIdToken(token)

  req.authenticatedUser = {
    uid: payload.user_id || payload.sub,
    email: String(payload.email || '').toLowerCase(),
  }

  return payload
}

const getClientIp = (req) => {
  const forwardedFor = req.headers?.['x-forwarded-for']
  const realIp = req.headers?.['x-real-ip']

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim()
  }

  return realIp || req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown'
}

function applyRateLimit(req, options = {}) {
  const {
    keyPrefix = 'global',
    limit = 60,
    windowMs = 60_000,
  } = options
  const ip = getClientIp(req)
  const key = `${keyPrefix}:${ip}`
  const now = Date.now()
  const bucket = rateLimitBuckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return
  }

  bucket.count += 1

  if (bucket.count > limit) {
    throw new ApiError(429, 'Too many requests. Please try again later.', `Rate limit exceeded for ${keyPrefix} from ${ip}.`)
  }
}

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email || '').trim())

const hashValue = (value) =>
  createHash('sha256').update(String(value || '')).digest('hex').slice(0, 16)

async function verifyTurnstileToken(token, req) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY

  if (!secret) {
    return
  }

  if (!token) {
    throw new ApiError(400, 'Please complete the security check.', 'Missing Cloudflare Turnstile token.')
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: getClientIp(req),
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || !payload.success) {
    throw new ApiError(400, 'Please complete the security check.', `Turnstile verification failed: ${(payload['error-codes'] || []).join(', ')}`)
  }
}

function sendSafeError(res, error) {
  const statusCode = error.statusCode || 500
  const publicMessage =
    error.publicMessage ||
    (statusCode >= 500 ? 'Something went wrong. Please try again.' : error.message)

  if (statusCode >= 500 || !error.publicMessage) {
    console.error('API error:', {
      statusCode,
      message: error.message,
      stack: error.stack,
    })
  } else if (statusCode === 429) {
    console.warn('API warning:', {
      statusCode,
      message: error.message,
    })
  }

  res.status(statusCode).setHeader?.('Content-Type', jsonContentType)
  res.json({
    error: publicMessage,
  })
}

export {
  ApiError,
  applyRateLimit,
  getClientIp,
  hashValue,
  isValidEmail,
  requireAuthenticated,
  requireAdmin,
  sendSafeError,
  verifyTurnstileToken,
}
