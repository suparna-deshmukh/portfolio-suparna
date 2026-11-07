'use client'

import '../corporate.css'
import { useEffect, useRef } from 'react'
import { CORPORATE, CORPORATE_LEDE, ATTRIBUTION_LEGEND, PREFILL_EVENT, link, type Corporate } from '../lib/site'
import { m } from '../lib/metrics'
import CountUp from './CountUp'
import Stamp from './Stamp'
import MetricTip from './MetricTip'
import SectionHeader from './SectionHeader'
import { useTimeline, type TlStep } from '../lib/timeline'
import { usePrefersReducedMotion } from '../lib/hooks'
import Attribution from './Attribution'
import Disclosure from './Disclosure'
import Rich from './Rich'

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
const STAMP_AT = 4650
const LOOP_MS = 8800
const DOC_STEPS: TlStep[] = [
  ...[0, 1, 2].map(i => ({ at: ROW_AT[i], name: `row${i}.inj` })),
  { at: STAMP_AT, name: 'stamp' },
]

/**
 * The file's paper: a compact report — the deliverable rows write in one by one, then the
 * rubber stamp lands on the bottom edge. Plays once and rests; the first paint is the
 * finished document.
 */
function CorporateDoc({ c }: { c: Corporate }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const tl = useTimeline(ref, DOC_STEPS, LOOP_MS, { loop: true })
  const replaying = tl.inCycle && tl.has('stamp')

  return (
    <div ref={ref} className="cfdoc"
      onPointerEnter={() => { if (!reduced) tl.replay() }}
      onFocus={() => { if (!reduced) tl.replay() }}
      onClick={() => tl.replay()}
    >
      <div className="cfdoc-fig" role="img"
        aria-label={`${c.doc.type} for ${c.name}: ${c.rows.map(r => r.label).join(', ')}. Proof: ${c.proof.value} ${c.proof.label}.${c.proofMetric ? ` ${m(c.proofMetric).source}, as of ${m(c.proofMetric).asOf}.` : ''}`}
      >
        <div className={`cfdoc-paper${replaying ? ' st shake' : tl.has('stamp') ? ' st' : ''}`}>
        <div className="cfdoc-hd">
          <span className="cfdoc-emb" aria-hidden="true">{EMBLEMS[c.id]}</span>
          <span className="cfdoc-tt"><b>{c.doc.type}</b></span>
        </div>
        {c.rows.map((r, i) => (
          <div key={r.label} className={`cfdoc-row${tl.has(`row${i}.inj`) ? ' inj' : ''}`} title={r.evidence}>
            <span>{r.label}</span>
          </div>
        ))}
      </div>
      <Stamp
        shape="rect" tone="ink" size="md" rot={-6}
        label={c.proof.value} sub={c.stamp}
        slammed={tl.has('stamp')}
        decorative
        className="cfdoc-stamp timeline"
      />
      </div>
      <button type="button" className="cfdoc-replay" aria-label={`Replay the ${c.doc.type} animation`} onClick={e => { e.stopPropagation(); tl.replay() }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 0 1 14-4l-4 4" /><path d="M20 14a8 8 0 0 1-14 4l4-4" /><path d="M4 4v6h6M20 20v-6h-6" /></svg>
      </button>
    </div>
  )
}

/**
 * Corporate projects as stamped files: one wide sheet per engagement. The left hand is a
 * self-stamping paper (term sheet, pricing audit, grant review) that plays once and rests;
 * the right hand is the engagement's story: eyebrow, title, proofs and the details.
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

  const year = (when: string) => when.slice(-4)
  return (
    <section className="band band-sand" id="corporate">
      <div className="sec wrap">
        <SectionHeader
          id="corporate"
          label="Corporate Projects"
          variant="xl"
          title="Corporate projects."
          meta={[
            `${CORPORATE.length} client engagements · GTM and fundraising`,
            'Two team-lead files via 180 Degrees Consulting, one independent',
          ]}
          aside={
            <>
              <b className="cf-lede">{CORPORATE_LEDE}</b>
              <p className="cf-legend">{ATTRIBUTION_LEGEND}</p>
            </>
          }
        />
        <ol className="cf-tabs" aria-label="Corporate project files">
          {CORPORATE.map(c => (
            <li key={c.id}>
              <a href={`#corporate-${c.id}`} className="cf-tab" data-emb={c.id}>
                <i aria-hidden="true">{EMBLEMS[c.id]}</i>
                <span>
                  <b>{c.name}</b>
                  <em>{c.engagement.via === '180DC' ? '180 DC' : 'Independent'} · {year(c.when)}</em>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <ol className="cf-files" aria-label="Corporate projects">
          {CORPORATE.map((c, fi) => (
            <li key={c.id} className="cf-file" id={`corporate-${c.id}`} data-emb={c.id} style={{ ['--fi' as string]: fi }}>
              <span className="cf-filetab" aria-hidden="true">
                {c.engagement.via === '180DC' ? '180 DC' : 'Independent'} · {year(c.when)}
              </span>
              <CorporateDoc c={c} />
              <div className="cf-main">
                <p className="cf-eyebrow">
                  <span className={`cf-via${c.engagement.via === 'independent' ? ' ind' : ''}`}>
                    {c.engagement.via === '180DC' ? '180 Degrees Consulting · team lead' : 'Independent engagement'}
                  </span>
                </p>
                <div className="cf-head">
                  <h3>{c.name}</h3>
                  <span className="cf-meta">{c.engagement.role} · {c.when} · {c.where}</span>
                </div>
                <p className="cf-big">
                  <MetricTip id={c.proofMetric ?? ''} focusable={false}><CountUp text={c.proof.value} /></MetricTip>
                  <span>{c.proofAttribution} · {c.chips.find(ch => ch.metric === c.proofMetric)?.label ?? c.proof.label}</span>
                </p>
                {c.line && <p className="cf-line"><Rich text={c.line} /></p>}
                {c.chips.filter(ch => ch.metric !== c.proofMetric).slice(0, 1).map(ch => (
                  <span key={ch.label} className="cf-chip cf-chip1">
                    <b>{ch.metric ? <MetricTip id={ch.metric} focusable={false}><CountUp text={ch.value} /></MetricTip> : ch.value}</b>
                    <span>{ch.label}</span>
                    <Attribution a={ch.attribution} />
                  </span>
                ))}
                <Disclosure label={`Details — ${c.name}`} className="cf-disc">
                  <ul className="cf-points">
                    {c.points.slice(1).map(pt => <li key={pt}>{pt}</li>)}
                  </ul>
                </Disclosure>
                <div className="cf-foot">
                  {c.deck && link(c.deck.href) && (
                    <a className="cf-chip cf-chip-deck" href={c.deck.href} target="_blank" rel="noopener noreferrer">
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
