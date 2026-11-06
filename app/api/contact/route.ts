import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import { Resend } from 'resend'
import { CONTACT_EMAIL, EMAIL } from '../../lib/site'
import { MAX_BODY_BYTES, MIN_FILL_MS, validateContact } from '../../lib/contact-form'

// P0-5: hardening — typed error codes (invalid | rate | provider | unknown), 10 KB body cap,
// honeypot, ≥2.5 s fill time, per-IP token bucket (5/hour), 8 s mail timeout. The message
// body never reaches the logs; metadata only.

const SEND_TIMEOUT_MS = 8000
const BUCKET_CAPACITY = 5
const BUCKET_REFILL_MS = 3_600_000 // 5 per hour

type Bucket = { tokens: number; last: number }
const buckets = new Map<string, Bucket>()

function consumeToken(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const key = createHash('sha256').update(ip).digest('hex')
  const now = Date.now()
  const bucket = buckets.get(key) ?? { tokens: BUCKET_CAPACITY, last: now }
  bucket.tokens = Math.min(BUCKET_CAPACITY, bucket.tokens + ((now - bucket.last) / BUCKET_REFILL_MS) * BUCKET_CAPACITY)
  bucket.last = now
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    buckets.set(key, bucket)
    return { ok: true }
  }
  buckets.set(key, bucket)
  return { ok: false, retryAfterSec: Math.ceil(((1 - bucket.tokens) / BUCKET_CAPACITY) * BUCKET_REFILL_MS / 1000) }
}

// Lazy so the site runs without RESEND_API_KEY set; production 502s cleanly, dev files locally.
let client: Resend | null = null
const getResend = (): Resend | null => {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  client ??= new Resend(key)
  return client
}

const devOutbox = (entry: { name: string; email: string; subject: string; at: string }) => {
  try { appendFileSync('.contact-outbox.jsonl', JSON.stringify(entry) + '\n') } catch { /* disk is best-effort in dev */ }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'direct'

  // 1 · body cap (before parsing anything)
  const raw = await request.text().catch(() => '')
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, code: 'invalid', error: 'Message too long.' }, { status: 400 })

  // 2 · parse
  let body: { name?: unknown; email?: unknown; message?: unknown; hp?: unknown; started?: unknown }
  try { body = JSON.parse(raw) as typeof body } catch { return NextResponse.json({ ok: false, code: 'invalid', error: 'Could not read the message.' }, { status: 400 }) }

  // 3 · honeypot: bots that fill it get a success they will act on, and nothing is sent or logged
  if (typeof body.hp === 'string' && body.hp.trim() !== '') return NextResponse.json({ ok: true })

  // 4 · rate limit
  const gate = consumeToken(ip)
  if (!gate.ok) return NextResponse.json({ ok: false, code: 'rate', error: 'A few too many messages from here — try again shortly.' }, { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } })

  // 5 · fill time (client reports when the form appeared; bots submit instantly)
  const values = { name: String(body.name ?? ''), email: String(body.email ?? ''), message: String(body.message ?? '') }
  const errors = validateContact(values)
  const bad = (Object.keys(errors) as (keyof typeof errors)[]).filter(f => errors[f])
  if (bad.length) return NextResponse.json({ ok: false, code: 'invalid', fields: Object.fromEntries(bad.map(f => [f, errors[f]])) }, { status: 400 })

  // 6 · fill time (client reports when the form appeared; bots submit instantly)
  const started = typeof body.started === 'number' ? body.started : Number.NaN
  if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, code: 'invalid', error: 'That looked faster than human — take a moment and try again.' }, { status: 400 })
  }

  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()

  try {
    const resend = getResend()
    if (!resend) {
      if (process.env.NODE_ENV !== 'development') {
        console.warn('contact: mail provider not configured; dropped', { name, from: email, at: new Date().toISOString() })
        return NextResponse.json({ ok: false, code: 'provider', error: 'Mail is not configured on this deployment.' }, { status: 502 })
      }
      devOutbox({ name, email, subject: `Portfolio message from ${name}`, at: new Date().toISOString() })
      console.info('contact: dev outbox (no RESEND_API_KEY)', { name, from: email, at: new Date().toISOString() })
      return NextResponse.json({ ok: true })
    }

    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('mail timeout')), SEND_TIMEOUT_MS))
    const { error } = await Promise.race([
      resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: CONTACT_EMAIL || EMAIL,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email,
      }),
      timeout,
    ])
    if (error) {
      console.error('contact: resend failed', error)
      return NextResponse.json({ ok: false, code: 'provider', error: 'Sending failed on our side — try again or email directly.' }, { status: 502 })
    }
    console.info('contact: delivered', { name, from: email, at: new Date().toISOString() })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'mail timeout') {
      console.error('contact: mail timeout after 8s', { name, from: email })
      return NextResponse.json({ ok: false, code: 'provider', error: 'Sending timed out — try again or email directly.' }, { status: 502 })
    }
    console.error('contact: unexpected error', err)
    return NextResponse.json({ ok: false, code: 'unknown', error: 'Something went wrong — try again or email directly.' }, { status: 500 })
  }
}
