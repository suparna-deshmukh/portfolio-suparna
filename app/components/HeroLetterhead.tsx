'use client'

import { useEffect, useRef } from 'react'
import { HERO_LINE, SOCIALS } from '../lib/site'
import { m } from '../lib/metrics'

// Hero left column: the printed-card title block. Double-hairline frame, paper grain,
// oversized serif name, slowly rotating seal, ruled ledger rows and pill CTAs.
// Every string, link target and behaviour is frozen — see docs/hero-revamp-notes.md.
// Text is visible on first paint; the entrance is a short CSS flourish played on top
// (total < 600ms), and the pointer tilt/highlight attach only after idle on fine pointers.

interface Row {
  label: string
  value: string
  detail: string
}

const ROWS: Row[] = [
  { label: 'Currently', value: 'Associate Product Manager Intern at RISA Labs', detail: 'AI workflows, US healthcare' },
  { label: 'Building', value: 'AskCart', detail: 'guided AI search, personal build' },
  { label: 'Placements', value: 'Placement Coordinator at BITS Goa', detail: `Selected ${m('pc-select').shown} of ${m('pc-pool').shown} students` },
]

const LINKS = [
  { label: 'LinkedIn', href: SOCIALS.linkedin },
  { label: 'X', href: SOCIALS.x || null },
  { label: 'GitHub', href: SOCIALS.github },
].filter((l): l is { label: string; href: string } => !!l.href)

// The underlined phrase — the last three words of the positioning line, derived, never re-spelled.
const U_WORDS = 3
const U_LEAD = 'measure'

export default function HeroLetterhead() {
  const tiltRef = useRef<HTMLDivElement>(null)

  // Tilt + pointer highlight: pure decoration, attached after idle, fine pointers only.
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return
    const el = tiltRef.current
    if (!el) return
    let raf = 0
    let on = false
    const reset = () => {
      el.style.setProperty('--tiltX', '0')
      el.style.setProperty('--tiltY', '0')
      el.style.setProperty('--mx', '200%')
      el.style.setProperty('--my', '200%')
    }
    const onMove = (e: PointerEvent) => {
      if (!on || raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        el.style.setProperty('--tiltX', (y * -1.5).toFixed(3))
        el.style.setProperty('--tiltY', (x * 2).toFixed(3))
        el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%')
        el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%')
      })
    }
    const start = () => {
      on = true
      window.addEventListener('pointermove', onMove, { passive: true })
      el.addEventListener('pointerleave', reset)
    }
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number; cancelIdleCallback?: (id: number) => void }
    const idle = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 600 }) : window.setTimeout(start, 300)
    return () => {
      if (w.requestIdleCallback) w.cancelIdleCallback?.(idle)
      else window.clearTimeout(idle)
      on = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
    }
  }, [])

  const words = HERO_LINE.split(' ')
  const uOk = words.length > U_WORDS && words[words.length - U_WORDS] === U_LEAD
  const uPre = words.slice(0, -U_WORDS).join(' ')
  const uPhrase = words.slice(-U_WORDS).join(' ')

  return (
    <div className="tb" ref={tiltRef}>
      <i className="tb-grain" aria-hidden="true" />
      <div className="tb-r tb-name-r">
        <h1 className="tb-name"><span className="tb-first">Suparna</span> <span className="tb-last">Deshmukh</span></h1>
        <span className="tb-seal" aria-hidden="true">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="40" cy="40" r="21.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <g className="tb-seal-ring">
              <defs>
                <path id="tb-seal-arc" d="M40 13 a27 27 0 1 1 -0.01 0" fill="none" />
              </defs>
              <text className="tb-seal-t"><textPath href="#tb-seal-arc">SUPARNA DESHMUKH · PRODUCT ·</textPath></text>
            </g>
            <circle cx="40" cy="40" r="11" className="tb-seal-dot" fill="currentColor" />
          </svg>
        </span>
      </div>
      <p className="tb-line">{uOk ? <>{uPre} <span className="tb-u">{uPhrase}<svg viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true"><path className="tb-u-line" pathLength="100" d="M2 5.5 C 34 3.2, 64 7, 98 4.6 S 156 6.6, 198 3.6" /></svg></span></> : HERO_LINE}</p>
      <dl className="tb-rows">
        {ROWS.map(r => (
          <div key={r.label} className="tb-row">
            <dt>{r.label}</dt>
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
          {LINKS.map(l => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span></a>)}
        </p>
      </div>
    </div>
  )
}
