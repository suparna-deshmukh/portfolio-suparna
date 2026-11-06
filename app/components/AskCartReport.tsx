'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { usePrefersReducedMotion, useVisibleLoop } from '../lib/hooks'
import FitStage from './FitStage'
import { m } from '../lib/metrics'

interface Mode { name: string; tool: string; agent: string; missed: boolean }

// The three failure modes the MVP evals exercise: each one the pipeline is designed to catch,
// so every verdict is CAUGHT — the eval suite guards search, RAG and UX (pass rate and sample
// size come from the metrics registry, as of the MVP evals).
const MODES: Mode[] = [
  { name: 'vague_intent', tool: 'results: 0', agent: 'asks 1 follow-up question', missed: false },
  { name: 'hinglish_query', tool: '\u201Csneekrs red\u201D', agent: 'embedding fallback \u00B7 top-3 hit', missed: false },
  { name: 'missing_context', tool: 'filters: none', agent: `guided narrowing \u2192 ${m('ac-narrow').shown} SKUs`, missed: false },
]

const STEP = { inject: 0, answer: 520, verdict: 1040 }
const ROW_AT = [400, 1750, 3100]
const GAUGE_AT = 4500
const STAMP_AT = 5500
const SHAKE_MS = 550
const LOOP_MS = 9500
const TRACK_PX = 420
const SCORE = parseFloat(m('ac-eval').shown)

const search = (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></>)

export default function AskCartReport() {
  const ref = useRef<HTMLDivElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLDivElement | null)[]>([])
  const timers = useRef<number[]>([])
  const running = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [counts, setCounts] = useState(false)

  // Feature detection after mount (SSR renders the static path) — the only safe place for this setState.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCounts(typeof CSS !== 'undefined' && 'registerProperty' in CSS) }, [])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const rowEls = () => rows.current.filter((r): r is HTMLDivElement => !!r)

  const cycle = useCallback(() => {
    const p = paper.current
    if (!p || !running.current) return
    clear()
    rowEls().forEach(r => r.classList.remove('inj', 'ans', 'vrd'))
    p.classList.remove('g', 'st', 'shake')
    ROW_AT.forEach((base, i) => {
      later(() => rows.current[i]?.classList.add('inj'), base + STEP.inject)
      later(() => rows.current[i]?.classList.add('ans'), base + STEP.answer)
      later(() => rows.current[i]?.classList.add('vrd'), base + STEP.verdict)
    })
    later(() => p.classList.add('g'), GAUGE_AT)
    later(() => p.classList.add('st', 'shake'), STAMP_AT)
    later(() => p.classList.remove('shake'), STAMP_AT + SHAKE_MS)
    // eslint-disable-next-line react-hooks/immutability -- self-recursive loop callback
    later(cycle, LOOP_MS)
  }, [])
  // The first frame is the finished report; the loop replays it from the first failure.
  const start = useCallback(() => {
    running.current = true
    if (!timers.current.length) later(cycle, LOOP_MS - STAMP_AT)
  }, [cycle])
  const stop = useCallback(() => { running.current = false; clear() }, [])
  useVisibleLoop(ref, start, stop, !reduced)
  useEffect(() => stop, [stop])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = paper.current
    if (!p || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 2 - 1
    const y = ((e.clientY - r.top) / r.height) * 2 - 1
    p.style.transform = `perspective(900px) rotateY(${(x * 3).toFixed(2)}deg) rotateX(${(-y * 3).toFixed(2)}deg)`
  }
  const onLeave = () => { if (paper.current) paper.current.style.transform = '' }
  const replay = (i: number) => {
    const r = rows.current[i]
    if (reduced || !r || !r.classList.contains('vrd')) return
    r.classList.remove('inj', 'ans', 'vrd')
    void r.offsetWidth
    r.classList.add('inj')
    later(() => r.classList.add('ans'), 260)
    later(() => r.classList.add('vrd'), 600)
  }

  return (
    <div ref={ref} role="img" aria-label={`Animated AskCart search quality report: three search failure modes from the MVP evals, all caught, with an eval pass rate of ${SCORE}, green`}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="tr-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="8" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 5.4" result="holes" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="3" result="d" />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
      </svg>
      <FitStage w={560} h={440}>
        <div className="tr" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div ref={paper} className={`tr-paper g st${counts ? ' cnt' : ''}`} style={{ ['--tw' as string]: `${TRACK_PX}px` } as CSSProperties}>
            <div className="tr-hd">
              <div><b>AskCart</b><small>Search quality report · MVP evals</small></div>
              <span className="sc">eval suite · n={m('ac-eval').n}<br />every mode caught</span>
            </div>
            {MODES.map((m, i) => (
              <div key={m.name} ref={el => { rows.current[i] = el }} className="tr-row inj ans vrd" onPointerEnter={() => replay(i)}>
                <span className="chip"><svg viewBox="0 0 24 24" aria-hidden="true">{search}</svg>{m.name}</span>
                <div className="ln2">
                  <span><em>tool</em><b>{m.tool}</b></span>
                  <span className={m.missed ? 'bad' : ''}><em>agent</em><b>{m.agent}</b></span>
                </div>
                <span className={`vd ${m.missed ? 'miss' : 'hit'}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">{m.missed ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M20 6 9 17l-5-5" />}</svg>
                  {m.missed ? 'MISSED' : 'CAUGHT'}
                </span>
              </div>
            ))}
            <div className="tr-gz">
              <div className="gl"><span>Eval pass rate</span><b><span className="v">{SCORE}</span> <span className="zone">GREEN</span></b></div>
              <div className="track"><span className="mark" /></div>
            </div>
            <div className="tr-stamp grn"><span className="ring" /><span><b>{SCORE}</b><i>GREEN</i></span></div>
          </div>
        </div>
      </FitStage>
    </div>
  )
}
