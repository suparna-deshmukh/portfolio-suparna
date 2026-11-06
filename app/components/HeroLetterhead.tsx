'use client'

import { SOCIALS, PHONE } from '../lib/site'
import { m } from '../lib/metrics'

// Hero left column: the name set as an engineering title block — a name plate, then ruled rows
// for the current work and the education, and the foot with CTAs and direct lines.
// Text is visible on first paint; only the rules and the highlight draw in, and only under html.motion-ok.

interface Row {
  label: string
  value: string
  detail: string
  live?: boolean
  stack?: boolean
}

const ROWS: Row[] = [
  { label: 'Currently', value: 'Associate Product Manager intern at RISA Labs', detail: 'AI workflows, US healthcare', stack: true },
  { label: 'Building', value: 'AskCart', detail: 'guided AI search, personal build' },
  { label: 'Placements', value: 'Placement Coordinator at BITS Goa', detail: `${m('pc-placed').shown} placed · batch ${m('pc-rate').shown.replace('→', ' → ')}`, stack: true },
]

const LINKS = [
  { label: 'LinkedIn', href: SOCIALS.linkedin },
  { label: 'X', href: SOCIALS.x || null },
  { label: 'GitHub', href: SOCIALS.github },
].filter((l): l is { label: string; href: string } => !!l.href)

export default function HeroLetterhead() {
  return (
    <div className="tb">
      <div className="tb-r tb-name-r">
        <h1 className="tb-name"><span className="tb-first">Suparna</span> Deshmukh</h1>
        <span className="tb-seal" aria-hidden="true">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="40" cy="40" r="21.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <defs>
              <path id="tb-seal-arc" d="M40 13 a27 27 0 1 1 -0.01 0" fill="none" />
            </defs>
            <text className="tb-seal-t"><textPath href="#tb-seal-arc">SUPARNA DESHMUKH · PRODUCT · CLASS OF 27 ·</textPath></text>
            <text x="40" y="45" textAnchor="middle" className="tb-seal-m">SD</text>
          </svg>
        </span>
      </div>
      <dl className="tb-rows">
        {ROWS.map((r, i) => (
          <div key={r.label} className={['tb-row', r.live && 'live', r.stack && 'stack'].filter(Boolean).join(' ')} style={{ ['--i' as string]: i }}>
            <dt>{r.live && <i aria-hidden="true" />}{r.label}</dt>
            <dd className="tb-val">{r.value}</dd>
            <dd className="tb-det">{r.detail}</dd>
          </div>
        ))}
      </dl>
      <div className="tb-foot">
        <div className="hctas">
          <a className="btn" href="#projects">See the builds <span aria-hidden="true">↓</span></a>
          <a className="btn ghost" href="#contact">Let&apos;s talk</a>
        </div>
        <p className="tb-links">
          <span>{PHONE}</span>
          {LINKS.map(l => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span></a>)}
        </p>
      </div>
    </div>
  )
}
