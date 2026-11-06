'use client'

import { useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'
import CountUp from './CountUp'
import MetricTip from './MetricTip'
import { DATA_LEDGERS } from '../lib/site'
import { m } from '../lib/metrics'

const COHORT_ROWS = [1, 0.92, 0.97, 0.9, 1, 0.95]

/** One animated figure per ledger: spike, cohort heat, channel bars, risk donut.
    P1-4: roomier 80-unit viewBoxes + >=10.5px labels (mobile override >=11px effective). */
function LedgerVis({ n }: { n: string }) {
  if (n === '01') {
    return (
      <svg className="dl-vis v1" viewBox="0 0 300 80" aria-hidden="true">
        <defs>
          <linearGradient id="dlArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".28" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line className="g" x1="8" y1="66" x2="292" y2="66" />
        <line className="g" x1="8" y1="52" x2="292" y2="52" />
        <line className="g" x1="8" y1="38" x2="292" y2="38" />
        <path className="area" d="M10 64 L44 60 L74 62 L104 56 L134 52 L158 46 L176 40 L208 22 L228 44 L256 52 L290 58 L290 66 L10 66 Z" />
        <path className="line" pathLength="100" d="M10 64 L44 60 L74 62 L104 56 L134 52 L158 46 L176 40 L208 22 L228 44 L256 52 L290 58" />
        <circle className="peak" cx="208" cy="22" r="3" />
        <text className="cap" x="208" y="12" textAnchor="middle">spike &rarr; trend</text>
        <text className="cap" x="292" y="76" textAnchor="end">{m('d1-auc').shown} AUC classifier</text>
      </svg>
    )
  }
  if (n === '02') {
    const rows: React.ReactNode[] = []
    COHORT_ROWS.forEach((f, r) => {
      const cells: React.ReactNode[] = []
      for (let w = 0; w < 9; w++) {
        const o = Math.max(0.08, (1 - w * 0.105) * f)
        cells.push(
          <rect key={`${r}-${w}`} className="c" x={34 + w * 28} y={8 + r * 10} width={24} height={7} rx={1.5}
            style={{ ['--o' as string]: o.toFixed(3), transitionDelay: `${(r * 9 + w) * 16}ms` }} />
        )
      }
      rows.push(
        <g key={r} className="crow">
          <text className="rowlab" x={28} y={14 + r * 10} textAnchor="end">{`C${r + 1}`}</text>
          {cells}
        </g>
      )
    })
    return (
      <svg className="dl-vis v2" viewBox="0 0 320 80" aria-hidden="true">
        <g className="heat">{rows}</g>
        <rect className="ring" x={34 + 6 * 28 - 1.5} y={8 + 3 * 10 - 1.5} width={27} height={10} rx={2.5} />
        <rect className="ring" x={34 + 7 * 28 - 1.5} y={8 + 4 * 10 - 1.5} width={27} height={10} rx={2.5} />
        <text className="cap" x="34" y="76">wk 0</text>
        <text className="cap" x={34 + 8 * 28} y="76" textAnchor="end">wk 8 &rarr;</text>
        <text className="cap ringlab" x="318" y="47" textAnchor="end">dormant</text>
      </svg>
    )
  }
  if (n === '03') {
    const bars = [
      { x: 24, h: 24, v: '24' }, { x: 72, h: 18, v: '18' }, { x: 120, h: 42, v: '42', hot: true },
      { x: 168, h: 12, v: '12' }, { x: 216, h: 22, v: '22' },
    ]
    return (
      <svg className="dl-vis v3" viewBox="0 0 300 80" aria-hidden="true">
        <line className="g" x1="8" y1="70" x2="292" y2="70" />
        <line className="g" x1="8" y1="47" x2="292" y2="47" />
        {bars.map((b, i) => (
          <g key={b.x} className="barg">
            <rect className={`bar${b.hot ? ' hot' : ''}`} x={b.x} y={70 - b.h} width={30} height={b.h} rx={3}
              style={{ transitionDelay: `${i * 120}ms` }} />
            <text className="barlab" x={b.x + 15} y={66 - b.h} textAnchor="middle">{b.v}</text>
          </g>
        ))}
        <text className="cap" x="292" y="78" textAnchor="end">SHAP impact by channel &middot; relative</text>
      </svg>
    )
  }
  const segs = [
    { len: 34, rot: 0, o: 1 }, { len: 22, rot: 122.4, o: 0.78 }, { len: 18, rot: 201.6, o: 0.58 },
    { len: 14, rot: 266.4, o: 0.4 }, { len: 12, rot: 316.8, o: 0.26 },
  ]
  return (
    <svg className="dl-vis" viewBox="0 0 300 80" aria-hidden="true">
      <g transform="translate(48 34)">
        <circle className="donutbg" r="26" fill="none" strokeWidth="9" />
        {segs.map((sg, i) => (
          <circle key={i} className="seg" r="26" fill="none" strokeOpacity={sg.o} strokeWidth="9"
            pathLength={100} style={{ ['--len' as string]: sg.len, transitionDelay: `${i * 130}ms`, transform: `rotate(${sg.rot - 90}deg)` }} />
        ))}
        <text className="mid" x="0" y="5" textAnchor="middle">5</text>
      </g>
      <text className="midcap" x="48" y="78" textAnchor="middle">risk profiles</text>
      <g className="leg">
        {['34%', '22%', '18%', '14%', '12%'].map((t, i) => (
          <g key={t} transform={`translate(104 ${10 + i * 13})`}>
            <rect width="7" height="7" y="-6" rx="1.5" className="legdot" opacity={1 - i * 0.2} />
            <text x="12" y="0">{t}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

/** Four data projects as ledger cards: ruled paper, a red margin, a figure, every pointer from the resume. */
export default function DataLedger() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = gridRef.current
    if (!box) return
    const cards = Array.from(box.querySelectorAll<HTMLElement>('.dl-card'))
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
        />
        <div className="dl-grid" ref={gridRef} aria-label="Data projects">
          {DATA_LEDGERS.map(l => (
            <article key={l.n} className="dl-card">
              <span className="dl-num" aria-hidden="true">{l.n}</span>
              <header className="dl-head">
                <h3>{l.title}</h3>
                <span className="dl-where">{l.where}</span>
              </header>
              <LedgerVis n={l.n} />
              <ul className="dl-points">
                {l.points.map(p => <li key={p}>{p}</li>)}
              </ul>
              <footer className="dl-foot">
                <span className="dl-tech">{l.tech}</span>
                <span className="dl-res"><MetricTip id={l.resultMetric}><CountUp text={l.result} /></MetricTip><small>{l.resLabel}</small></span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
