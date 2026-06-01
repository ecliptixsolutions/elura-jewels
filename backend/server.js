/* global process */
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resend } from 'resend'
import { handleShopifyApi } from './shopifyAdmin.js'
import {
  ApiError,
  applyRateLimit,
  isValidEmail,
  sendSafeError,
} from './security.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true })

const app = express()
const port = Number(process.env.PORT || 5000)
const resend = new Resend(process.env.RESEND_API_KEY)

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://elurajewels.com',
  'https://www.elurajewels.com',
  'https://elurajewels.co.uk',
  'https://www.elurajewels.co.uk',
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
]

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin not allowed by CORS'))
    },
  }),
)
app.use(express.json())

app.all('/api/shopify', handleShopifyApi)

app.post('/send-email', async (req, res) => {
  try {
    applyRateLimit(req, {
      keyPrefix: 'contact',
      limit: 5,
      windowMs: 10 * 60_000,
    })

    const { name, email, message } = req.body ?? {}
    const trimmedName = name?.trim()
    const trimmedEmail = email?.trim()
    const trimmedMessage = message?.trim()

    if (!process.env.RESEND_API_KEY) {
      throw new ApiError(503, 'Email is temporarily unavailable. Please try again.', 'Missing RESEND_API_KEY.')
    }

    if (!trimmedName || !isValidEmail(trimmedEmail) || !trimmedMessage) {
      throw new ApiError(400, 'Please complete all required fields with a valid email address.')
    }

    const safeName = escapeHtml(trimmedName)
    const safeEmail = escapeHtml(trimmedEmail)
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br />')

    await Promise.all([
      resend.emails.send({
        from: 'ELURA <info@elurajewels.com>',
        to: 'info.elurajewels@gmail.com',
        replyTo: trimmedEmail,
        subject: 'New Contact Message',
        html: `
          <div>
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
      }),
      resend.emails.send({
        from: 'ELURA <info@elurajewels.com>',
        to: trimmedEmail,
        subject: 'We received your message',
        html: `
          <div>
            <p>Hi ${safeName},</p>
            <p>Thank you for contacting ELURA. We will get back to you shortly.</p>
          </div>
        `,
      }),
    ])

    res.json({ success: true })
  } catch (error) {
    sendSafeError(res, error)
  }
})

app.listen(port, () => {
  console.log(`ELURA contact server running on http://localhost:${port}`)
})
