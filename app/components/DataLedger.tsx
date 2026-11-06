'use client'

import { useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'
import CountUp from './CountUp'

const LEDGERS = [
  {
    n: '01',
    title: 'Content Virality Prediction & Segmentation',
    where: 'YouTube Trending dataset · 200K+ videos',
    points: [
      'Built NLP features from titles and tags; applied K-means to segment 200K+ videos into archetypes by views and engagement.',
      'Trained an XGBoost classifier predicting trending content at 82% AUC; surfaced the key drivers for content decisions via SHAP.',
    ],
    result: '82% AUC',
    resLabel: 'trending-content classifier',
    tech: 'SQL · Python · scikit-learn · XGBoost',
  },
  {
    n: '02',
    title: 'Mutual Fund Activation & Retention',
    where: 'Synthetic/AMFI investment data · 50K users',
    points: [
      'Queried investment data via SQL; segmented 50K users by activation stages and constructed detailed 90-day retention cohort views.',
      'Identified dormant user personas using RFM analysis; proposed re-engagement features backed by cohort-driven insights.',
    ],
    result: '50K',
    resLabel: 'users · 90-day retention cohorts',
    tech: 'SQL · Python · Excel',
  },
  {
    n: '03',
    title: 'Growth Attribution & CAC Optimization',
    where: 'Neobank fintech · 45K campaign records',
    points: [
      'Trained XGBoost on 45K neobank campaign records; used SHAP to attribute conversions across 5 digital and direct channels.',
      'Identified the top acquisition signals per channel; built an AI reallocation model reducing simulated CAC by 28% across the channel mix.',
    ],
    result: '−28%',
    resLabel: 'simulated CAC, AI reallocation',
    tech: 'Python · scikit-learn · SHAP · SQL',
  },
  {
    n: '04',
    title: 'Loan Risk Segmentation & Default Prediction',
    where: 'LendingClub dataset · 100K+ loan records',
    points: [
      'Queried 100K+ loan records via SQL; segmented users into 5 risk profiles using structured RFM-style feature analysis.',
      'Built a logistic regression model to predict defaults; mapped risk segments to product features and targeted UX interventions.',
    ],
    result: '100K+',
    resLabel: 'records → 5 risk profiles',
    tech: 'SQL · Python · scikit-learn',
  },
]

const COHORT_ROWS = [1, 0.92, 0.97, 0.9, 1, 0.95]

/** One animated figure per ledger: spike, cohort heat, channel bars, risk donut. */
function LedgerVis({ n }: { n: string }) {
  if (n === '01') {
    return (
      <svg className="dl-vis v1" viewBox="0 0 300 64" aria-hidden="true">
        <defs>
          <linearGradient id="dlArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".28" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line className="g" x1="8" y1="54" x2="292" y2="54" />
        <line className="g" x1="8" y1="40" x2="292" y2="40" />
        <line className="g" x1="8" y1="26" x2="292" y2="26" />
        <path className="area" d="M10 50 L44 46 L74 48 L104 42 L134 38 L158 32 L176 26 L208 8 L228 30 L256 38 L290 44 L290 54 L10 54 Z" />
        <path className="line" pathLength="100" d="M10 50 L44 46 L74 48 L104 42 L134 38 L158 32 L176 26 L208 8 L228 30 L256 38 L290 44" />
        <circle className="peak" cx="208" cy="8" r="3" />
        <text className="cap" x="208" y="5" textAnchor="middle">spike → trend</text>
        <text className="cap" x="292" y="62" textAnchor="end">82% AUC classifier</text>
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
          <rect key={`${r}-${w}`} className="c" x={34 + w * 28} y={4 + r * 10} width={24} height={7} rx={1.5}
            style={{ ['--o' as string]: o.toFixed(3), transitionDelay: `${(r * 9 + w) * 16}ms` }} />
        )
      }
      rows.push(
        <g key={r} className="crow">
          <text className="rowlab" x={22} y={10 + r * 10}>{`C${r + 1}`}</text>
          {cells}
        </g>
      )
    })
    return (
      <svg className="dl-vis v2" viewBox="0 0 300 64" aria-hidden="true">
        <g className="heat">{rows}</g>
        <rect className="ring" x={34 + 6 * 28 - 1.5} y={3 + 3 * 10} width={27} height={10} rx={2.5} />
        <rect className="ring" x={34 + 7 * 28 - 1.5} y={3 + 4 * 10} width={27} height={10} rx={2.5} />
        <text className="cap" x="34" y="63">wk 0</text>
        <text className="cap" x={34 + 8 * 28} y="63" textAnchor="end">wk 8 →</text>
        <text className="cap ringlab" x={34 + 8 * 28 + 12} y={3 + 4 * 10 + 7}>dormant</text>
      </svg>
    )
  }
  if (n === '03') {
    const bars = [
      { x: 24, h: 27, v: '24' }, { x: 72, h: 20, v: '18' }, { x: 120, h: 47, v: '42', hot: true },
      { x: 168, h: 13, v: '12' }, { x: 216, h: 25, v: '22' },
    ]
    return (
      <svg className="dl-vis v3" viewBox="0 0 300 64" aria-hidden="true">
        <line className="g" x1="8" y1="58" x2="292" y2="58" />
        <line className="g" x1="8" y1="35" x2="292" y2="35" />
        {bars.map((b, i) => (
          <g key={b.x} className="barg">
            <rect className={`bar${b.hot ? ' hot' : ''}`} x={b.x} y={58 - b.h} width={30} height={b.h} rx={3}
              style={{ transitionDelay: `${i * 120}ms` }} />
            <text className="barlab" x={b.x + 15} y={54 - b.h} textAnchor="middle">{b.v}</text>
          </g>
        ))}
        <text className="cap" x="292" y="63" textAnchor="end">SHAP impact by channel · relative</text>
      </svg>
    )
  }
  const segs = [
    { len: 34, rot: 0, o: 1 }, { len: 22, rot: 122.4, o: 0.78 }, { len: 18, rot: 201.6, o: 0.58 },
    { len: 14, rot: 266.4, o: 0.4 }, { len: 12, rot: 316.8, o: 0.26 },
  ]
  return (
    <svg className="dl-vis" viewBox="0 0 300 64" aria-hidden="true">
      <g transform="translate(48 32)">
        <circle className="donutbg" r="26" fill="none" strokeWidth="9" />
        {segs.map((sg, i) => (
          <circle key={i} className="seg" r="26" fill="none" strokeOpacity={sg.o} strokeWidth="9"
            pathLength={100} style={{ ['--len' as string]: sg.len, transitionDelay: `${i * 130}ms`, transform: `rotate(${sg.rot - 90}deg)` }} />
        ))}
        <text className="mid" x="0" y="2" textAnchor="middle">5</text>
        <text className="midcap" x="0" y="13" textAnchor="middle">profiles</text>
      </g>
      <g className="leg">
        {['34%', '22%', '18%', '14%', '12%'].map((t, i) => (
          <g key={t} transform={`translate(104 ${4 + i * 11.5})`}>
            <rect width="7" height="7" y="-6.5" rx="1.5" className="legdot" opacity={1 - i * 0.2} />
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
          {LEDGERS.map(l => (
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
                <span className="dl-res"><CountUp text={l.result} /><small>{l.resLabel}</small></span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
