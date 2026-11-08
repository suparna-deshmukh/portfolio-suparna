'use client'

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import { useTimeline, type TlStep } from '../lib/timeline'
import FitStage from './FitStage'
import Stamp from './Stamp'
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

const STEP = { answer: 360, verdict: 730 }
const ROW_AT = [200, 900, 1550]
const GAUGE_AT = 2250
const STAMP_AT = 2800
const LOOP_MS = 4900
const TRACK_PX = 420
const SCORE = parseFloat(m('ac-eval').shown)

const STEPS: TlStep[] = [
  ...MODES.flatMap((_, i) => [
    { at: ROW_AT[i], name: `row${i}.inj` },
    { at: ROW_AT[i] + STEP.answer, name: `row${i}.ans` },
    { at: ROW_AT[i] + STEP.verdict, name: `row${i}.vrd` },
  ]),
  { at: GAUGE_AT, name: 'gauge' },
  { at: STAMP_AT, name: 'stamp' },
]

const search = (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></>)

export default function AskCartReport() {
  const ref = useRef<HTMLDivElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLDivElement | null)[]>([])
  const timers = useRef<number[]>([])
  const reduced = usePrefersReducedMotion()
  const [counts, setCounts] = useState(false)

  const tl = useTimeline(ref, STEPS, LOOP_MS, { initialHoldMs: 0 })
  const replaying = tl.inCycle && tl.has('stamp')

  // Feature detection after mount (SSR renders the static path) — the only safe place for this setState.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCounts(typeof CSS !== 'undefined' && 'registerProperty' in CSS) }, [])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

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
      <FitStage w={560} h={440}>
        <div className="tr" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div ref={paper} className={`tr-paper${tl.has('gauge') ? ' g' : ''}${replaying ? ' st shake' : tl.has('stamp') ? ' st' : ''}${counts ? ' cnt' : ''}`} style={{ ['--tw' as string]: `${TRACK_PX}px` } as CSSProperties}>
            <div className="tr-hd">
              <div><b>AskCart</b><small>Search quality report · MVP evals</small></div>
              <span className="sc">eval suite · n={m('ac-eval').n}<br />every mode caught</span>
            </div>
            {MODES.map((mode, i) => (
              <div key={mode.name} ref={el => { rows.current[i] = el }}
                className={`tr-row${tl.has(`row${i}.inj`) ? ' inj' : ''}${tl.has(`row${i}.ans`) ? ' ans' : ''}${tl.has(`row${i}.vrd`) ? ' vrd' : ''}`}
                onPointerEnter={() => replay(i)}>
                <span className="chip"><svg viewBox="0 0 24 24" aria-hidden="true">{search}</svg>{mode.name}</span>
                <div className="ln2">
                  <span><em>tool</em><b>{mode.tool}</b></span>
                  <span className={mode.missed ? 'bad' : ''}><em>agent</em><b>{mode.agent}</b></span>
                </div>
                <span className={`vd ink-rect ${mode.missed ? 'miss' : 'hit'}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">{mode.missed ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M20 6 9 17l-5-5" />}</svg>
                  {mode.missed ? 'MISSED' : 'CAUGHT'}
                </span>
              </div>
            ))}
            <div className="tr-gz">
              <div className="gl"><span>Eval pass rate</span><b><span className="v">{SCORE}</span> <span className="zone">GREEN</span></b></div>
              <div className="track"><span className="mark" /></div>
            </div>
            <Stamp
              shape="round" tone="ok" size="lg" rot={-9}
              label={SCORE} sub="GREEN"
              slammed={tl.has('stamp')}
              decorative
              className="tr-stamp timeline"
            />
          </div>
        </div>
      </FitStage>
    </div>
  )
}
