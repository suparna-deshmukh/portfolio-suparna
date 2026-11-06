import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { EMAIL } from '../../lib/site'

// Lazy so the site builds and runs without RESEND_API_KEY set; sending 500s cleanly until it is.
let client: Resend | null = null
const getResend = (): Resend | null => {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  client ??= new Resend(key)
  return client
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const resend = getResend()
    if (!resend) {
      return NextResponse.json({ error: 'Mail is not configured on this deployment' }, { status: 503 })
    }
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: EMAIL,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    })

    if (error) {
      console.error('contact: resend failed', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('contact: unexpected error', err)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
