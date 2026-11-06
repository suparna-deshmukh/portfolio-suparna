'use client'

import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent } from 'react'
import { usePrefersReducedMotion, useVisibleLoop } from '../lib/hooks'
import FitStage from './FitStage'
import { m } from '../lib/metrics'

type Src = 'call' | 'slack' | 'jira'

interface Note { src: Src; tag: string; text: string; x0: number; y0: number; r0: number; x1: number; y1: number; z: number; d: number }

// Scattered position (x0, y0, r0) and the pile it sorts into (x1, y1). The first three are one theme.
// The note on top of each sorted pile shows a different source thread.
const NOTES: Note[] = [
  { src: 'call', tag: 'Reddit', text: 'battery dies after a year', x0: 14, y0: 22, r0: -5, x1: 24, y1: 28, z: 4, d: 10 },
  { src: 'slack', tag: 'HN', text: 'still no fast charging', x0: 318, y0: 34, r0: 4, x1: 17, y1: 22, z: 5, d: 7 },
  { src: 'jira', tag: 'Reddit #182', text: 'replaced the pack twice', x0: 160, y0: 158, r0: -2, x1: 10, y1: 16, z: 6, d: 13 },
  { src: 'call', tag: 'Reddit', text: 'subscription charged twice', x0: 376, y0: 182, r0: 5, x1: 10, y1: 112, z: 3, d: 9 },
  { src: 'slack', tag: 'HN', text: 'auto-renew trap, again', x0: 36, y0: 208, r0: 3, x1: 17, y1: 118, z: 2, d: 6 },
  { src: 'slack', tag: 'Reddit', text: 'size chart is wrong', x0: 228, y0: 252, r0: -4, x1: 10, y1: 208, z: 1, d: 11 },
]

const ICONS: Record<Src, React.JSX.Element> = {
  call: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  slack: <><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" /></>,
  jira: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></>,
}

const SCATTER_MS = 2100
const SORTED_MS = 4700
const FIRST_HOLD_MS = 2600
const COUNT_MS = 600
const RESUME_MS = 450
const TOP_MENTIONS = m('ra-mentions').num ?? 7

const v = (name: string, value: string | number) => ({ [`--${name}`]: value })

export default function ResearchBoard() {
  const ref = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const timers = useRef<number[]>([])
  const running = useRef(false)
  const hovering = useRef(false)
  const first = useRef(true)
  const reduced = usePrefersReducedMotion()

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const countUp = () => {
    const el = count.current
    if (!el) return
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / COUNT_MS)
      el.textContent = `${Math.round(TOP_MENTIONS * (1 - Math.pow(1 - p, 3)))} mentions`
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  const scatter = () => { board.current?.classList.remove('sorted'); board.current?.classList.add('thread') }
  const sort = () => { board.current?.classList.remove('thread'); board.current?.classList.add('sorted'); countUp() }

  const cycle = useCallback(() => {
    if (!running.current || hovering.current) return
    clear()
    scatter()
    later(() => { if (!hovering.current) sort() }, SCATTER_MS)
    // eslint-disable-next-line react-hooks/immutability -- self-recursive loop callback
    later(cycle, SCATTER_MS + SORTED_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `scatter`/`sort` are stable per-mount closures
  }, [])
  // The first frame is the finished answer, so a glance never lands on a mess; the loop starts after a hold.
  const start = useCallback(() => {
    running.current = true
    if (hovering.current || timers.current.length) return
    later(cycle, first.current ? FIRST_HOLD_MS : 400)
    first.current = false
  }, [cycle])
  const stop = useCallback(() => { running.current = false; clear() }, [])
  useVisibleLoop(ref, start, stop, !reduced)
  useEffect(() => stop, [stop])

  const onEnter = () => { if (reduced) return; hovering.current = true; clear(); scatter() }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const b = board.current
    if (!b || reduced) return
    const r = b.getBoundingClientRect()
    b.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(2))
    b.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(2))
  }
  const onLeave = () => {
    const b = board.current
    if (!b || reduced) return
    hovering.current = false
    b.style.setProperty('--px', '0')
    b.style.setProperty('--py', '0')
    clear()
    later(sort, RESUME_MS)
    later(cycle, RESUME_MS + SORTED_MS)
  }

  return (
    <div ref={ref} role="img" aria-label="Animated research board: pain points scraped from Reddit and Hacker News are grouped by theme and ranked, with Battery and Charging on top">
      <FitStage w={560} h={340}>
        <div ref={board} className="fb sorted" onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
          {NOTES.map((n, i) => (
            <div
              key={n.text}
              className="fb-note"
              style={{ ...v('i', i), ...v('x0', `${n.x0}px`), ...v('y0', `${n.y0}px`), ...v('r0', `${n.r0}deg`), ...v('x1', `${n.x1}px`), ...v('y1', `${n.y1}px`), ...v('z', n.z), ...v('d', n.d) } as CSSProperties}
            >
              <small><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[n.src]}</svg>{n.tag}</small>
              {n.text}
            </div>
          ))}
          <svg className="fb-threads" viewBox="0 0 560 340" aria-hidden="true">
            <path d="M99 55 L245 191 L403 67" />
            <circle style={v('k', 0) as CSSProperties} cx="99" cy="55" r="5" />
            <circle style={v('k', 1) as CSSProperties} cx="245" cy="191" r="5" />
            <circle style={v('k', 2) as CSSProperties} cx="403" cy="67" r="5" />
          </svg>
          <div className="fb-rows">
            <div className="fb-rw top" style={{ ...v('y', '12px'), ...v('i', 0) } as CSSProperties}>
              <div className="t"><span className="rk">1</span><span className="hl">Battery & Charging</span></div>
              <div className="m"><span className="bar"><i style={{ ...v('w', 1), ...v('i', 0) } as CSSProperties} /></span><span ref={count} className="n">{TOP_MENTIONS} mentions</span><span className="imp h">High impact</span></div>
              <span className="fb-stamp">Fix first</span>
            </div>
            <div className="fb-rw redact" aria-hidden="true" style={{ ...v('y', '106px'), ...v('i', 1) } as CSSProperties}>
              <div className="t"><span className="rk">2</span><span className="tx">████████ ██████</span></div>
              <div className="m"><span className="bar"><i style={{ ...v('w', 0.62), ...v('i', 1) } as CSSProperties} /></span><span className="n">██</span><span className="imp m">Medium</span></div>
            </div>
            <div className="fb-rw redact" aria-hidden="true" style={{ ...v('y', '200px'), ...v('i', 2) } as CSSProperties}>
              <div className="t"><span className="rk">3</span><span className="tx">██████ ████████</span></div>
              <div className="m"><span className="bar"><i style={{ ...v('w', 0.3), ...v('i', 2) } as CSSProperties} /></span><span className="n">██</span><span className="imp l">Low</span></div>
            </div>
          </div>
          <span className="fb-cap">2 sources, 1 PRD</span>
        </div>
      </FitStage>
    </div>
  )
}
