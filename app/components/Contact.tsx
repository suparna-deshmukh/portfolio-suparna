'use client'

import '../contact.css'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CONTACT_EMAIL, PHONE, PHONE_TEL, SOCIALS } from '../lib/site'
import { istTime, useVisibleLoop } from '../lib/hooks'
import { CONTACT_RULES, type ContactField } from '../lib/contact-form'
import SectionHeader from './SectionHeader'
import ContactThreads from './ContactThreads'
import { PREFILL_EVENT } from '../lib/site'
import SocialCards from './SocialCards'
import Signature from './Signature'

const QUOTE_MAX_CHARS = 280

type Field = 'name' | 'email' | 'message'
type Status = 'idle' | 'sending' | 'sent' | 'failed'

const TIME_TICK_MS = 30_000
const FOCUS_AFTER_SCROLL_MS = 450
const COPIED_MS = 1600
const noop = () => {}

// Validation rules live in lib/contact-form — the API re-validates with the same module.
const FIELDS = Object.keys(CONTACT_RULES) as ContactField[]

export default function Contact({ footer }: { footer?: ReactNode }) {
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [sentPreview, setSentPreview] = useState('')
  const [hp, setHp] = useState('')
  const [failNote, setFailNote] = useState('')
  const [copiedMsg, setCopiedMsg] = useState(false)
  const startedAt = useRef(0) // when the form appeared — the API rejects anything filled in under 2.5 s
  const [copied, setCopied] = useState(false)
  const [phoneShown, setPhoneShown] = useState(false)
  const [now, setNow] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  useVisibleLoop(sectionRef, noop, noop) // pauses the presence dot off screen

  useEffect(() => {
    startedAt.current = Date.now()
    const tick = () => setNow(istTime())
    tick()
    const id = window.setInterval(tick, TIME_TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  // Prefill from "Ask me" (event) or from an article reply card (?re=<title>&q=<line>), only into an empty message.
  useEffect(() => {
    const prefill = (message: string) => {
      setValues(v => (v.message.trim() ? v : { ...v, message }))
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.setTimeout(() => formRef.current?.querySelector('textarea')?.focus({ preventScroll: true }), reduced ? 0 : FOCUS_AFTER_SCROLL_MS)
    }
    const params = new URLSearchParams(window.location.search)
    const re = params.get('re')
    const q = params.get('q')?.replace(/\s+/g, ' ').trim().slice(0, QUOTE_MAX_CHARS)
    if (re) prefill(q ? `Re: ${re}\n> ${q}\n\n` : `Re: ${re}\n\n`)
    const onPrefill = (e: Event) => prefill((e as CustomEvent<string>).detail)
    window.addEventListener(PREFILL_EVENT, onPrefill)
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill)
  }, [])

  const validate = (field: Field, value = values[field]) => {
    const msg = CONTACT_RULES[field](value)
    setErrors(prev => ({ ...prev, [field]: msg }))
    return !msg
  }

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(CONTACT_EMAIL) } catch { /* clipboard blocked; still confirm */ }
    setCopied(true)
    window.setTimeout(() => setCopied(false), COPIED_MS)
  }

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    const ok = FIELDS.map(f => validate(f)).every(Boolean)
    if (!ok) {
      // .invalid is not rendered yet at this point, so pick the first failing field from the rules directly
      const bad = FIELDS.find(f => CONTACT_RULES[f](values[f]))
      const el = bad ? formRef.current?.elements.namedItem(bad) : null
      if (el instanceof HTMLElement) el.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, hp, started: startedAt.current }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFailNote(data?.code === 'rate' ? 'A few too many messages from here — give it a minute.' : 'Your message didn’t send, but it’s still here.')
        throw new Error(String(res.status))
      }
      setSentPreview(values.message.trim().split(/\s+/).slice(0, 5).join(' '))
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const copyMessage = async () => {
    try { await navigator.clipboard.writeText(values.message) } catch { /* clipboard blocked; still confirm */ }
    setCopiedMsg(true)
    window.setTimeout(() => setCopiedMsg(false), COPIED_MS)
  }

  const mailtoFallback = CONTACT_EMAIL
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Portfolio message from ${values.name.trim()}`)}&body=${encodeURIComponent(values.message)}`
    : ''

  const input = (field: Field, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      name={field}
      value={values[field]}
      className={errors[field] ? 'invalid' : undefined}
      aria-invalid={!!errors[field]}
      aria-required="true"
      aria-describedby={errors[field] ? `err-${field}` : undefined}
      onChange={e => { setValues(v => ({ ...v, [field]: e.target.value })); if (errors[field]) validate(field, e.target.value) }}
      onBlur={e => e.target.value && validate(field, e.target.value)}
    />
  )

  return (
    <section ref={sectionRef} className="band band-night" id="contact">
      <ContactThreads />
      <div className="sec wrap">
        <SectionHeader
          id="contact"
          label="Contact"
          variant="xl"
          pre="Need a PM who ships?"
          title="Let's talk."
          meta={['Form, email, phone or LinkedIn', 'Bengaluru · IST']}
        />
        <div className="ct">
          <div>
            <div className="mail">
              {CONTACT_EMAIL ? (
                <>
                  <a className="addr" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  <button className={`copyb${copied ? ' done' : ''}`} type="button" onClick={copyEmail}>{copied ? 'Copied' : 'Copy email'}</button>
                </>
              ) : (
                <span className="addr">Email me via the form — I reply to everything.</span>
              )}
            </div>
            <p className="phone">
              {phoneShown
                ? <a href={PHONE_TEL}>{PHONE}</a>
                : <button type="button" className="phone-reveal" onClick={() => setPhoneShown(true)} aria-label="Show phone number">Show number</button>}
              {' '}· Bengaluru, IN
            </p>
            <span className="sr" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
            <noscript>{CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}</noscript>
            <p className="here"><i aria-hidden="true" />It&apos;s <span className="num" suppressHydrationWarning>{now || '--:--'}</span> in Bengaluru right now.</p>
            <SocialCards />
          </div>

          <form ref={formRef} className="form" onSubmit={submit} noValidate>
            {status === 'sent' ? (
              <div className="sent on" role="status">
                <span className="tick">✓</span>
                <span>
                  Sent: <q>“{sentPreview}…”</q><br />
                  {CONTACT_EMAIL ? <>I&apos;ll reply from {CONTACT_EMAIL}.</> : <>I&apos;ll get back to you here.</>}
                  <span className="also">Until then <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>{SOCIALS.x && <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer">X ↗</a>}</span>
                </span>
              </div>
            ) : (
              <>
                {/* Honeypot: hidden from people, visible to bots. Filling it is a silent success. */}
                <label className="hp" aria-hidden="true">
                  <span>Leave this field empty</span>
                  <input type="text" name="hp" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} />
                </label>
                <div className="two">
                  <label>Name{input('name', { autoComplete: 'name', placeholder: 'Your name' })}<span className="err" id="err-name">{errors.name}</span></label>
                  <label>Email{input('email', { type: 'email', autoComplete: 'email', placeholder: 'you@company.com' })}<span className="err" id="err-email">{errors.email}</span></label>
                </div>
                <label>
                  What&apos;s on your mind?
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="A role, a problem worth solving, or a question about my case studies."
                    value={values.message}
                    className={errors.message ? 'invalid' : undefined}
                    aria-invalid={!!errors.message}
                    aria-required="true"
                    aria-describedby={errors.message ? 'err-message' : undefined}
                    onChange={e => { setValues(v => ({ ...v, message: e.target.value })); if (errors.message) validate('message', e.target.value) }}
                    onBlur={e => e.target.value && validate('message', e.target.value)}
                  />
                  <span className="err" id="err-message">{errors.message}</span>
                </label>
                <div className="row">
                  {status === 'failed' && (
                    <span className="fail" role="alert">
                      {failNote || 'Your message didn&apos;t send, but it&apos;s still here.'} <button type="button" className="retry" onClick={() => submit()}>Try again</button>{' '}
                      <button type="button" className="retry" onClick={copyMessage}>{copiedMsg ? 'Copied' : 'Copy message'}</button>
                      {mailtoFallback && <> or <a href={mailtoFallback}>send it as email</a>.</>}
                    </span>
                  )}
                  <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
                </div>
              </>
            )}
            <div className="ct-sign"><Signature /></div>
          </form>
        </div>
        {footer}
      </div>
    </section>
  )
}
