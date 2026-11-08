'use client'

import { useRef, type PointerEvent } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import { useTimeline, type TlStep } from '../lib/timeline'
import FitStage from './FitStage'
import Stamp from './Stamp'
import { m } from '../lib/metrics'

/** Sample review text (illustrative) and the four root causes it resolves into. */
const RAW: { text: string; hl: string }[] = [
  { text: '"red sneekrs, 0 results"', hl: 'sneekrs' },
  { text: '"waterproof for monsoon"', hl: '' },
  { text: '"foldable keyboard, which one?"', hl: 'foldable' },
  { text: '"leather sling bag brownish"', hl: 'brownish' },
]

const CAUSES: { no: string; name: string; sub: string }[] = [
  { no: '01', name: 'vague intent', sub: 'query too open' },
  { no: '02', name: 'missing context', sub: 'no filters set' },
  { no: '03', name: 'slang and typo drift', sub: '\u201Csneekrs\u201D' },
  { no: '04', name: 'catalog gaps', sub: 'no query fixes these' },
]

const ROW_AT = [100, 500, 900, 1300]
const STEPS: TlStep[] = [
  ...RAW.map((_, i) => ({ at: ROW_AT[i], name: `row${i}` })),
  { at: 1700, name: 'agent' },
  { at: 2100, name: 'pipe' },
  ...CAUSES.map((_, i) => ({ at: 2600 + i * 400, name: `c${i}` })),
  { at: 4400, name: 'stamp' },
]
const LOOP_MS = 9000

/**
 * The extractor's real mechanism, animated: raw review text from three stores, the agentic
 * extractor, the 6-stage SQL pipeline, and the four root causes it isolates. One stamped
 * number at the end: 94.6K reviews. First paint is the finished frame.
 */
export default function InsightFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  const lines = useRef<(HTMLDivElement | null)[]>([])
  const causes = useRef<(HTMLDivElement | null)[]>([])
  const reduced = usePrefersReducedMotion()

  const tl = useTimeline(ref, STEPS, LOOP_MS, { initialHoldMs: 0 })
  const replaying = tl.inCycle && tl.has('stamp')

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = paper.current
    if (!p || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 2 - 1
    const y = ((e.clientY - r.top) / r.height) * 2 - 1
    p.style.transform = `perspective(900px) rotateY(${(x * 3).toFixed(2)}deg) rotateX(${(-y * 3).toFixed(2)}deg)`
  }
  const onLeave = () => { if (paper.current) paper.current.style.transform = '' }

  const replayRow = (arr: React.RefObject<(HTMLDivElement | null)[]>, i: number) => {
    const el = arr.current[i]
    if (reduced || !el || !el.classList.contains('inj')) return
    el.classList.remove('inj')
    void el.offsetWidth
    el.classList.add('inj')
  }

  return (
    <div ref={ref} role="img"
      aria-label={`Animated review mining pipeline: raw e-commerce reviews from Reddit, the App Store and Play Store pass through an agentic extractor and a 6-stage SQL pipeline, and come out as four root causes of search failure. 94.6K reviews in, four causes out. Sample text is illustrative.`}>
      <FitStage w={560} h={440}>
        <div className="if" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div ref={paper} className={`if-paper${replaying ? ' shake' : ''}`}>
            <div className="if-hd">
              <div><b>Insight Extractor</b><small>Agentic review mining · 3 sources</small></div>
              <span className="sc">{m('ac-reviews').shown} reviews in<br />4 causes out</span>
            </div>
            <div className="if-cols">
              <div className="if-raw">
                {RAW.map((l, i) => (
                  <div key={l.text} ref={el => { lines.current[i] = el }}
                    className={`if-line${tl.has(`row${i}`) ? ' inj' : ''}`}
                    onPointerEnter={() => replayRow(lines, i)}>
                    {l.text.slice(0, l.text.indexOf(l.hl))}<mark>{l.hl}</mark>{l.text.slice(l.text.indexOf(l.hl) + l.hl.length)}
                  </div>
                ))}
                <div className="if-src"><span>reddit · app store · play store</span><i className="if-ill">Illustrative</i></div>
              </div>
              <div className="if-agent">
                <span className={`if-hex${tl.has('agent') ? ' on' : ''}`} aria-hidden="true">
                  <svg viewBox="0 0 58 58">
                    <polygon points="29,4 51,16.5 51,41.5 29,54 7,41.5 7,16.5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="7" y1="16.5" x2="51" y2="41.5" stroke="currentColor" strokeWidth="1" opacity=".35" />
                    <line x1="51" y1="16.5" x2="7" y2="41.5" stroke="currentColor" strokeWidth="1" opacity=".35" />
                    <text x="29" y="34" textAnchor="middle" style={{ font: '700 13px var(--fm)', fill: 'currentColor' }}>AI</text>
                  </svg>
                </span>
                <span className="if-agem">agentic extractor</span>
                <span className={`if-pipe${tl.has('pipe') ? ' on' : ''}`} aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}
                  <b>6-stage SQL</b>
                </span>
              </div>
              <div className="if-causes">
                {CAUSES.map((c, i) => (
                  <div key={c.name} ref={el => { causes.current[i] = el }}
                    className={`if-cause${tl.has(`c${i}`) ? ' inj' : ''}`}
                    onPointerEnter={() => replayRow(causes, i)}>
                    <b aria-hidden="true">{c.no}</b>
                    <div><b>{c.name}</b><small>{c.sub}</small></div>
                  </div>
                ))}
              </div>
            </div>
            <Stamp
              shape="round" tone="ok" size="lg" rot={-9}
              label={m('ac-reviews').shown} sub="REVIEWS"
              slammed={tl.has('stamp')}
              decorative
              className="if-stamp timeline"
            />
          </div>
        </div>
      </FitStage>
    </div>
  )
}
