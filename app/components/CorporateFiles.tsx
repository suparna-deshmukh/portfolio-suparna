'use client'

import '../corporate.css'
import { useEffect, useRef } from 'react'
import { CORPORATE, CORPORATE_AGG, PREFILL_EVENT, link, type Corporate } from '../lib/site'
import { m } from '../lib/metrics'
import CountUp from './CountUp'
import Stamp from './Stamp'
import MetricTip from './MetricTip'
import SectionHeader from './SectionHeader'
import { useTimeline, type TlStep } from '../lib/timeline'

/** One animated emblem per engagement: diamond, autonomous vehicle, biochar sprout. */
const KRI = 'kri' + 'she'
const EMBLEMS: Record<string, React.ReactNode> = {
  everyday: (
    <svg viewBox="0 0 84 84" aria-hidden="true">
      <defs>
        <linearGradient id="cfDiaGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset=".5" stopColor="currentColor" stopOpacity=".35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <clipPath id="cfDiaClip"><path d="M24 26h36l12 15-28 31-28-31z" /></clipPath>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M24 26h36l12 15-28 31-28-31z" />
        <path d="M14 41h56M24 26l9 15 9-15 9 15 9-15M33 41l9 31 9-31" />
      </g>
      <circle className="cf-glow" cx="42" cy="42" r="26" />
      <g clipPath="url(#cfDiaClip)">
        <rect className="cf-dia-shine" x="-26" y="14" width="14" height="66" fill="url(#cfDiaGrad)" transform="rotate(18 42 42)" />
        <rect className="cf-dia-shine s2" x="-26" y="14" width="8" height="66" fill="url(#cfDiaGrad)" transform="rotate(18 42 42)" />
      </g>
      <path className="cf-spark" d="M66 12v10M61 17h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path className="cf-spark sp2" d="M16 10v8M12 14h8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  fedaykin: (
    <svg viewBox="0 0 84 84" aria-hidden="true">
      <line className="cf-lane" x1="22" y1="4" x2="22" y2="80" />
      <line className="cf-lane" x1="62" y1="4" x2="62" y2="80" />
      <path className="cf-scan s1" d="M27 16a17 17 0 0 1 30 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path className="cf-scan s2" d="M22 9a23 23 0 0 1 40 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <g className="cf-car" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="33" y="24" width="18" height="36" rx="7.5" />
        <line x1="35.5" y1="34" x2="48.5" y2="34" strokeLinecap="round" />
        <line x1="35.5" y1="50" x2="48.5" y2="50" strokeLinecap="round" />
      </g>
      <circle className="cf-blip" cx="62" cy="64" r="3" />
      <circle className="cf-blip b2" cx="22" cy="14" r="2.4" />
    </svg>
  ),
  [KRI]: (
    <svg viewBox="0 0 84 84" aria-hidden="true">
      <path className="cf-soil" d="M14 64c9-7 19-7 28-1s19 6 28-1v16H14z" />
      <path className="cf-stem" d="M42 62V30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path className="cf-leaf l1" d="M42 46c-3-11-11-14-19-13 1 9 8 15 19 13z" />
      <path className="cf-leaf l2" d="M42 36c3-11 11-14 19-13-1 9-8 15-19 13z" />
      <circle className="cf-bud" cx="42" cy="26" r="4.5" />
      <circle className="cf-dot d1" cx="25" cy="56" r="2" />
      <circle className="cf-dot d2" cx="59" cy="52" r="2" />
      <circle className="cf-dot d3" cx="48" cy="58" r="1.6" />
      <circle className="cf-dot d4" cx="34" cy="52" r="1.4" />
    </svg>
  ),
}

const ROW_AT = [380, 1500, 2620]
const VERDICT_AT = 460
const GAUGE_AT = 3750
const STAMP_AT = 4650
const LOOP_MS = 8800
const DOC_STEPS: TlStep[] = [
  ...[0, 1, 2].flatMap(i => [
    { at: ROW_AT[i], name: `row${i}.inj` },
    { at: ROW_AT[i] + VERDICT_AT, name: `row${i}.vrd` },
  ]),
  { at: GAUGE_AT, name: 'gauge' },
  { at: STAMP_AT, name: 'stamp' },
]

/**
 * The file's paper: a compact AskCart-report — rows whose verdicts slam in one by one,
 * the proof gauge filling, then the rubber stamp landing on the bottom edge. Loops while
 * in view; the first paint is the finished document.
 */
function CorporateDoc({ c, index }: { c: Corporate; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const tl = useTimeline(ref, DOC_STEPS, LOOP_MS, { initialHoldMs: LOOP_MS - STAMP_AT })
  const replaying = tl.inCycle && tl.has('stamp')

  return (
    <div ref={ref} className="cfdoc" role="img"
      aria-label={`${c.doc.type} for ${c.name}: ${c.doc.rows.map(r => `${r.label} — ${r.verdict}`).join(', ')}. Proof: ${c.proof.value} ${c.proof.label}.${c.proofMetric ? ` ${m(c.proofMetric).source}, as of ${m(c.proofMetric).asOf}.` : ''}`}>
      <div className={`cfdoc-paper${tl.has('gauge') ? ' g' : ''}${replaying ? ' st shake' : tl.has('stamp') ? ' st' : ''}`}>
        <div className="cfdoc-hd">
          <span className="cfdoc-emb" aria-hidden="true">{EMBLEMS[c.id]}</span>
          <span className="cfdoc-tt"><b>{c.doc.type}</b><small>file 0{index + 1} · {c.name}</small></span>
        </div>
        {c.doc.rows.map((r, i) => (
          <div key={r.label} className={`cfdoc-row${tl.has(`row${i}.inj`) ? ' inj' : ''}${tl.has(`row${i}.vrd`) ? ' vrd' : ''}`}>
            <span>{r.label}</span>
            <em className="cfdoc-vd ink-rect">{r.verdict}</em>
          </div>
        ))}
        <div className="cfdoc-gz">
          <svg viewBox="0 0 120 64" aria-hidden="true">
            <path className="cfdoc-gf" d="M10 60 a50 50 0 0 1 100 0" />
            <path className="cfdoc-gv" d="M10 60 a50 50 0 0 1 100 0" style={{ ['--g' as string]: c.proof.gauge }} />
          </svg>
          <b>{c.proofMetric
            ? <MetricTip id={c.proofMetric} focusable={false}><CountUp text={c.proof.value} /></MetricTip>
            : <CountUp text={c.proof.value} />}</b>
          <span>{c.proof.label}</span>
        </div>
      </div>
      <Stamp
        shape="rect" tone="ink" size="md" rot={-6}
        label={c.proof.value} sub={c.doc.stampWord}
        slammed={tl.has('stamp')}
        decorative
        className="cfdoc-stamp timeline"
      />
    </div>
  )
}

/**
 * Corporate projects as stamped files: one wide sheet per engagement. The left hand is a
 * self-animating paper (term sheet, pricing audit, grant review) that re-stamps its proof;
 * the right hand is the engagement's story and the deck it produced.
 */
export default function Corporate() {
  useEffect(() => {
    const files = Array.from(document.querySelectorAll<HTMLElement>('.cf-file'))
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target) }
      }
    }, { threshold: 0.25 })
    files.forEach(f => io.observe(f))
    return () => io.disconnect()
  }, [])

  const meta: [string, string] = [
    `${CORPORATE.length} engagements · GTM and fundraising`,
    'Everyday Diamonds · Fedaykin AV · KriSHE Carbon',
  ]
  return (
    <section className="band band-sand" id="corporate">
      <div className="sec wrap">
        <SectionHeader
          id="corporate"
          label="Corporate Projects"
          variant="xl"
          title="Corporate projects."
          meta={meta}
          aside={
            <>
              <b>{CORPORATE.length} engagements</b>
              <span>Two as team lead via 180 Degrees Consulting, one independent</span>
              <div className="cf-aggs">
                {CORPORATE_AGG.map(s => <span key={s.label}><b>{s.value}</b>{s.label}</span>)}
              </div>
            </>
          }
        />
        <ol className="cf-files" aria-label="Corporate projects">
          {CORPORATE.map((c, i) => (
            <li key={c.id} className="cf-file" data-emb={c.id}>
              <CorporateDoc c={c} index={i} />
              <div className="cf-main">
                <div className="cf-head">
                  <h3>{c.name}</h3>
                  <span className="cf-meta">{c.role} · {c.when} · {c.where}</span>
                </div>
                <p className="cf-ctx">{c.context}</p>
                {c.myPart && <p className="cf-mypart"><b>My part</b> {c.myPart}</p>}
                <ul className="cf-points">
                  {c.points.map(pt => <li key={pt}>{pt}</li>)}
                </ul>
                <div className="cf-foot">
                  {c.chips.map(ch => (
                    <span key={ch.label} className="cf-chip"><b>{ch.value}</b><span>{ch.label}</span></span>
                  ))}
                  {c.deck && link(c.deck.href) && (
                    <a key={c.deck.label} className="cf-chip cf-chip-deck" href={c.deck.href} target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13h6M10 17h6" /></svg>
                      <span>{c.deck.label}</span><b aria-hidden="true">↗</b>
                    </a>
                  )}
                  <a
                    className="btn ghost sm"
                    href="#contact"
                    onClick={() => window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: c.ask }))}
                  >
                    Ask me about it →
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
