import type { Attribution } from '../lib/site'

/**
 * The attribution marker (sections brief X-3): who actually produced the outcome, in words
 * plus a glyph, never color alone. Renders 11px minimum.
 */
const GLYPH: Record<Attribution, string> = { led: '◆', built: '✦', contributed: '◈', supported: '○' }

export default function Attribution({ a, className }: { a: Attribution; className?: string }) {
  return (
    <span className={className ? `attr ${className}` : 'attr'} title={`attribution: ${a}`}>
      <i aria-hidden="true">{GLYPH[a]}</i>
      {a}
    </span>
  )
}
