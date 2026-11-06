// Shared contact-form contract: the client validates with the same rules the API
// re-validates server-side, so there is one source of truth for what a message is.

export type ContactField = 'name' | 'email' | 'message'

export const CONTACT_RULES: Record<ContactField, (v: string) => string> = {
  name: v => (v.trim() ? '' : "Add your name so I know who's writing."),
  email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Check the email address, like you@company.com, so I can reply.'),
  message: v => (v.trim().length >= 10 ? '' : 'Say a little more, at least a sentence.'),
}

/** Per-field error messages; an empty string means the field is fine. */
export function validateContact(values: Record<ContactField, string>): Record<ContactField, string> {
  return {
    name: CONTACT_RULES.name(String(values.name ?? '')),
    email: CONTACT_RULES.email(String(values.email ?? '')),
    message: CONTACT_RULES.message(String(values.message ?? '')),
  }
}

export const MAX_BODY_BYTES = 10 * 1024 // P0-5: 10 KB request cap
export const MIN_FILL_MS = 2500         // P0-5: a human takes more than 2.5 s to fill three fields
