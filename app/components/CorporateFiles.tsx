'use client'

import '../corporate.css'
import { useEffect } from 'react'
import { CORPORATE, CORPORATE_AGG, PREFILL_EVENT } from '../lib/site'
import SectionHeader from './SectionHeader'

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
      <g clipPath="url(#cfDiaClip)">
        <rect className="cf-dia-shine" x="-26" y="14" width="14" height="66" fill="url(#cfDiaGrad)" transform="rotate(18 42 42)" />
      </g>
      <path className="cf-spark" d="M66 12v10M61 17h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
    </svg>
  ),
  [KRI]: (
    <svg viewBox="0 0 84 84" aria-hidden="true">
      <path className="cf-soil" d="M14 64c9-7 19-7 28-1s19 6 28-1v16H14z" />
      <path className="cf-stem" d="M42 62V30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path className="cf-leaf l1" d="M42 46c-3-11-11-14-19-13 1 9 8 15 19 13z" />
      <path className="cf-leaf l2" d="M42 36c3-11 11-14 19-13-1 9-8 15-19 13z" />
      <circle className="cf-dot d1" cx="25" cy="56" r="2" />
      <circle className="cf-dot d2" cx="59" cy="52" r="2" />
      <circle className="cf-dot d3" cx="48" cy="58" r="1.6" />
    </svg>
  ),
}

/**
 * Corporate projects as stamped files: one wide sheet per engagement, an animated emblem
 * beside a big outlined index numeral, a rubber stamp that straddles the sheet edge, and
 * the results as chips.
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
          label="Corporate"
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
              <div className="cf-side">
                <span className="cf-emb" aria-hidden="true">{EMBLEMS[c.id]}</span>
                <span className="cf-num" aria-hidden="true">0{i + 1}</span>
              </div>
              <span className="cf-stamp" aria-hidden="true">{c.stamp}</span>
              <div className="cf-main">
                <div className="cf-head">
                  <h3>{c.name}</h3>
                  <span className="cf-meta">{c.role} · {c.when} · {c.where}</span>
                </div>
                <p className="cf-ctx">{c.context}</p>
                <ul className="cf-points">
                  {c.points.map(pt => <li key={pt}>{pt}</li>)}
                </ul>
                <div className="cf-foot">
                  {c.chips.map(ch => (
                    <span key={ch.label} className="cf-chip"><b>{ch.value}</b><span>{ch.label}</span></span>
                  ))}
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
