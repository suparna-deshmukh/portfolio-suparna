import '../stamp.css'
import type { CSSProperties } from 'react'

export type StampTone = 'ok' | 'warn' | 'bad' | 'ink'
export type StampShape = 'round' | 'rect' | 'offer'
export type StampSize = 'sm' | 'md' | 'lg'

interface StampProps {
  label: React.ReactNode
  sub?: React.ReactNode
  /** colour token: ok=accent, warn=project accent, bad=error, ink=foreground. Default ink. */
  tone?: StampTone
  /** round = big proof stamp, rect = double-ruled plate, offer = thin inline chip. Default rect. */
  shape?: StampShape
  size?: StampSize
  /** resting rotation in degrees. Default -6. */
  rot?: number
  /** timeline step has fired: finished state, plus the slam under html.motion-ok. */
  slammed?: boolean
  /** the stamp is decorative; the text equivalent lives elsewhere (aria-label etc). */
  decorative?: boolean
  className?: string
  style?: CSSProperties
}

/** A rubber-ink stamp. See app/stamp.css — one shared mask per shape, one slam keyframe. */
export default function Stamp({ label, sub, tone = 'ink', shape = 'rect', size = 'md', rot = -6, slammed = false, decorative, className, style }: StampProps) {
  const cls = ['stamp', `stamp--${shape}`, `stamp--${tone}`, `stamp--${size}`, slammed ? 'slammed' : '', className]
    .filter(Boolean).join(' ')
  return (
    <span className={cls} style={{ ['--stamp-rot' as string]: `${rot}deg`, ...style }} aria-hidden={decorative || undefined}>
      {shape === 'round' && <span className="stamp-ring" aria-hidden="true" />}
      <span className="stamp-txt">
        <b>{label}</b>
        {sub != null && <i>{sub}</i>}
      </span>
    </span>
  )
}
