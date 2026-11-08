'use client'

import { useEffect, useRef, useState } from 'react'
import SectionHeader from './SectionHeader'
import ProvenanceChip from './ProvenanceChip'
import Disclosure from './Disclosure'
import CountUp from './CountUp'
import MetricTip from './MetricTip'
import Rich from './Rich'
import { METHOD_STEPS, DATA_LEDGERS, type DataLedger as Ledger } from '../lib/site'
import { useTimeline, type TlStep } from '../lib/timeline'

const COHORT_ROWS = [1, 0.92, 0.97, 0.9, 1, 0.95]
const DORMANT: [number, number][] = [[3, 6], [4, 7]]
const BARS = [{ v: 42, hot: true }, { v: 24 }, { v: 22 }, { v: 18 }, { v: 12 }]
const DONUT = [34, 22, 18, 14, 12]
const LOOP_MS = 8500

const STEPS: Record<Ledger['figure']['type'], TlStep[]> = {
  heatmap: [{ at: 60, name: 'go' }, { at: 800, name: 'ring' }, { at: 900, name: 'dorm' }, { at: 1200, name: 'pulse' }],
  bars: [{ at: 60, name: 'go' }, { at: 800, name: 'pulse' }],
  spike: [{ at: 100, name: 'go' }, { at: 700, name: 'area' }, { at: 900, name: 'peak' }],
  donut: [{ at: 60, name: 'go' }, { at: 800, name: 'leg' }],
}

const CAPTION: Record<Ledger['figure']['type'], string> = {
  heatmap: '90-day retention cohorts',
  bars: 'SHAP by channel · relative',
  spike: 'Spike to trend',
  donut: '5 risk profiles',
}

const ARIA: Record<Ledger['figure']['type'], string> = {
  heatmap: 'Cohort heatmap: six user cohorts, week 0 to 8 share of users still active. Cohorts C4 and C5 turn dormant around week 6.',
  bars: 'Channel bars: relative conversion share across five channels; channel one, the top SHAP contributor, is highlighted.',
  spike: 'Line chart: views spike, then settle into a trend; the peak is the viral moment the model predicts.',
  donut: 'Donut chart: loan records split into five risk segments, from 34% down to 12%.',
}

/** Cohort heatmap in HTML: row labels, cells as divs, week labels underneath.
 *  Dormant cells carry the rust ring. Hover, focus or tap isolates a row. */
function HeatFigure() {
  return (
    <div className="dl-heat">
      {COHORT_ROWS.map((f, r) => {
        const vals = Array.from({ length: 9 }, (_, w) => Math.round(Math.max(0.08, (1 - w * 0.105) * f) * 100))
        return (
          <div key={r} className="dl-hrow" tabIndex={0}
            aria-label={`Cohort C${r + 1}, week 0 to 8: ${vals.join(', ')} percent of users still active`}>
            <i className="dl-hlab">C{r + 1}</i>
            {vals.map((v, w) => (
              <i key={w} className={`dl-cell${DORMANT.some(([dr, dw]) => dr === r && dw === w) ? ' dorm' : ''}`}
                style={{ ['--o' as string]: (v / 100).toFixed(2), ['--d' as string]: `${w * 65 + r * 8}ms` }} />
            ))}
          </div>
        )
      })}
      <span className="dl-wks" aria-hidden="true"><i>WK 0</i><i>WK 8</i></span>
      <span className="dl-dorm" aria-hidden="true">Dormant</span>
    </div>
  )
}

/** Five channel bars, growing from the baseline; the top channel gets a ring pulse. */
function BarsFigure() {
  return (
    <div className="dl-bars">
      {BARS.map((b, i) => (
        <div key={i} className="dl-barg" tabIndex={0} aria-label={`Channel ${i + 1}: ${b.v} relative conversion share`}>
          <span className="dl-barval" style={{ ['--i' as string]: i }}><CountUp text={String(b.v)} /></span>
          <i className={`dl-bar${b.hot ? ' hot' : ''}`} style={{ ['--h' as string]: `${Math.round((b.v / 42) * 100)}%`, ['--i' as string]: i }} />
        </div>
      ))}
    </div>
  )
}

/** Spike line: the SVG draws, the area fades in, the peak dot pops. */
function SpikeFigure() {
  return (
    <div className="dl-spike">
      <svg className="dl-spikesvg" viewBox="0 0 300 66" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="dlArea2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".26" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="dl-area" d="M8 58 L40 54 L68 56 L96 50 L124 46 L146 40 L164 34 L194 14 L214 38 L242 46 L292 52 L292 66 L8 66 Z" />
        <path className="dl-line" pathLength="100" d="M8 58 L40 54 L68 56 L96 50 L124 46 L146 40 L164 34 L194 14 L214 38 L242 46 L292 52" />
      </svg>
      <i className="dl-peak" aria-hidden="true" />
    </div>
  )
}

/** Risk donut: a fixed 64px SVG with five segments, legend rows on the right. */
function DonutFigure({ a, setA }: { a: number; setA: (n: number) => void }) {
  const rots = DONUT.map((_, i) => -90 + DONUT.slice(0, i).reduce((a, b) => a + b, 0) * 3.6)
  return (
    <div className="dl-donutwrap" data-a={a >= 0 ? a : undefined}>
      <div className="dl-donut">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle className="dl-dbg" cx="32" cy="32" r="26" fill="none" strokeWidth="9" />
          {DONUT.map((len, i) => (
            <circle key={i} className="dl-seg" cx="32" cy="32" r="26" fill="none" strokeWidth="9"
              strokeOpacity={1 - i * 0.16} pathLength={100}
              style={{ ['--len' as string]: len, ['--i' as string]: i, transform: `rotate(${rots[i]}deg)`, transformOrigin: '32px 32px' }}
              onPointerEnter={() => setA(i)} onPointerLeave={() => setA(-1)} />
          ))}
        </svg>
        <span className="dl-dmid" aria-hidden="true"><b><CountUp text="5" /></b></span>
      </div>
      <div className="dl-leg">
        {DONUT.map((len, i) => (
          <span key={i} className="dl-legrow" tabIndex={0} aria-label={`Risk segment P${i + 1}: ${len}% of records`}
            style={{ ['--i' as string]: i }}
            onPointerEnter={() => setA(i)} onFocus={() => setA(i)} onPointerLeave={() => setA(-1)} onBlur={() => setA(-1)}>
            <i className="dl-legdot" aria-hidden="true" />P{i + 1} <b>{len}%</b>
          </span>
        ))}
      </div>
    </div>
  )
}

/** One figure slot per ledger card: a fixed 82px stage (66px chart + 16px caption) that
 *  loops while in view, replays on hover, focus or tap, and rests on its finished frame. */
function FigureSlot({ l }: { l: Ledger }) {
  const ref = useRef<HTMLDivElement>(null)
  const tl = useTimeline(ref, STEPS[l.figure.type], LOOP_MS, { loop: true })
  const [a, setA] = useState(-1)
  const cls = `dl-slot ${l.figure.type}${tl.has('go') ? ' go' : ''}${tl.has('ring') ? ' ring' : ''}${tl.has('dorm') ? ' dorm' : ''}${tl.has('pulse') ? ' pulse' : ''}${tl.has('area') ? ' area' : ''}${tl.has('peak') ? ' peak' : ''}${tl.has('leg') ? ' leg' : ''}${tl.has('chip') ? ' chip' : ''}`
  return (
    <div ref={ref} className={cls} role="img" aria-label={ARIA[l.figure.type]}
      onPointerEnter={tl.replay} onFocus={tl.replay} onClick={tl.replay}>
      <div className="dl-chart">
        {l.figure.type === 'heatmap' && <HeatFigure />}
        {l.figure.type === 'bars' && <BarsFigure />}
        {l.figure.type === 'spike' && <SpikeFigure />}
        {l.figure.type === 'donut' && <DonutFigure a={a} setA={setA} />}
      </div>
      <div className="dl-cap">
        <span>{CAPTION[l.figure.type]}</span>
        {l.figure.status === 'illustrative' && <i className="dl-ill">Illustrative</i>}
      </div>
    </div>
  )
}

export default function DataProjects() {
  const gridRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.dl-card'))
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target) }
      }
    }, { threshold: 0.3 })
    cards.forEach(c => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <section className="band" id="data">
      <div className="sec wrap">
        <SectionHeader
          id="data"
          label="Data Projects"
          variant="sm"
          title="Four ledgers, one method."
          meta={['4 data projects · SQL + Python', 'From viral videos to loan books']}
          aside={
            <p className="dl-asidetx">Same four steps in every card: ask a question, pull the data, analyze it, and let it inform a decision. Figures are illustrative sketches of the analysis until real exports are wired in.</p>
          }
        />
        <div className="dl-method" aria-label="The method shared by every ledger">
          {METHOD_STEPS.map(st => (
            <button key={st} type="button" className="dl-mstep" data-step={st.toLowerCase()}
              onPointerEnter={() => gridRef.current?.setAttribute('data-hl', st.toLowerCase())}
              onFocus={() => gridRef.current?.setAttribute('data-hl', st.toLowerCase())}
              onPointerLeave={() => gridRef.current?.removeAttribute('data-hl')}
              onBlur={() => gridRef.current?.removeAttribute('data-hl')}
              onClick={() => gridRef.current?.setAttribute('data-hl', st.toLowerCase())}>
              {st}
            </button>
          ))}
        </div>
        <div className="dl-grid" ref={gridRef} aria-label="Data projects">
          {[...DATA_LEDGERS].sort((a, b) => a.rank - b.rank).map(l => (
            <article key={l.n} className="dl-card">
              <span className="dl-num" aria-hidden="true">{l.n}</span>
              <header className="dl-head">
                <h3>{l.title}</h3>
                <span className="dl-where">{l.where} <ProvenanceChip p={l.provenance} /></span>
              </header>
              {l.finding && <p className="dl-find">{l.finding}</p>}
              <FigureSlot l={l} />
              <ul className="dl-points">
                {l.points.map(p => <li key={p}><Rich text={p} /></li>)}
              </ul>
              <footer className="dl-foot">
                <span className="dl-tech">{l.tech}</span>
                <div className="dl-resline">
                  <i className="dl-reskind">{l.kind === 'scale' ? 'Scale' : l.kind === 'modeled' ? 'Modeled' : 'Result'}</i>
                  <span className="dl-res">
                    <MetricTip id={l.resultMetric}><CountUp text={l.result} /></MetricTip>
                  </span>
                  <small className="dl-resq">{l.resLabel}</small>
                </div>
              </footer>
              {l.detail && (l.detail.method || l.detail.informs || l.detail.limits) && (
                <Disclosure label={`Method and limits — ${l.title}`} className="dl-disc">
                  <ul className="dl-method-b">{l.detail.method?.map(b => <li key={b}>{b}</li>)}</ul>
                  {l.detail.informs && <p className="dl-informs">{l.detail.informs}</p>}
                  {l.detail.limits && <p className="dl-limits">{l.detail.limits}</p>}
                </Disclosure>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
