'use client'

import '../about.css'
import { useEffect, useRef } from 'react'
import { ACHIEVEMENTS, EDUCATION, POSITIONS, link } from '../lib/site'
import CountUp from './CountUp'
import MetricTip from './MetricTip'
import SectionHeader from './SectionHeader'
import { CurrentlyTicker } from './AboutExtras'

/**
 * A field of slim tiles that fill in one by one when the panel enters view —
 * the project board run, one tile per engagement.
 */
function TileField({ count, cols, caption, label }: { count: number; cols: number; caption: string; label: string }) {
  return (
    <div className="ab-tiles" role="img" aria-label={label}>
      <div className="ab-tiles-grid" style={{ ['--cols' as string]: cols }} aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}
      </div>
      <span>{caption}</span>
    </div>
  )
}

/** The placement ledger: rubber-stamped offers that slam in one by one — each stamp stands for 40 students. */
function OfferStamps() {
  return (
    <div className="ab-offers" role="img" aria-label="240 students placed — six stamps, each one stands for 40 students">
      {Array.from({ length: 6 }).map((_, i) => (
        <i key={i} style={{ ['--i' as string]: i, ['--tilt' as string]: i % 2 ? '1.6deg' : '-2.2deg' }} aria-hidden="true">OFFER</i>
      ))}
      <span>1 stamp = 40 students · 240 placed</span>
    </div>
  )
}

const SPONSORS = ['Uplearn by Upstox', 'NextLeap', 'Unstop', 'The MBA Edge']

/** The Consultathon sponsor strip: a slow marquee across the panel. */
function SponsorMarquee() {
  const row = [...SPONSORS, ...SPONSORS]
  return (
    <div className="ab-marq" aria-label={`Consultathon sponsors: ${SPONSORS.join(', ')} and more`}>
      <div className="ab-marq-in">
        {row.map((n, i) => <span key={i} aria-hidden={i >= SPONSORS.length}>{n}</span>)}
      </div>
    </div>
  )
}

/** The people behind the role: a field of dots that lights up member by member. */
function TeamDots({ count, label }: { count: number; label: string }) {
  return (
    <div className="ab-team" aria-label={`${count} — ${label}`}>
      {Array.from({ length: count }).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} aria-hidden="true" />)}
      <span>{count} · {label}</span>
    </div>
  )
}

/** Right page: the college years as stat panels — positions of responsibility, numbers doing the talking. */
function Positions() {
  return (
    <div className="ab-read" id="about-positions">
      <p className="lab">Positions of responsibility <span>3 roles · BITS Goa</span></p>
      <div className="ab-panels">
        {POSITIONS.map(p => (
          <article key={p.id} className="ab-panel">
            <header>
              <b>{p.title}</b><span>{p.org}</span><em>{p.when}</em>
            </header>
            <p>{p.blurb}</p>
            {p.id === 'consult'
              ? <TileField count={16} cols={8} caption="16 projects · 45 consultants" label="16 projects run across 45 consultants" />
              : p.team && <TeamDots count={p.team.count} label={p.team.label} />}
            {p.id === 'placement' && <OfferStamps />}
            {p.id === 'consult' && <SponsorMarquee />}
            {p.stats.length > 0 && (
              <dl className="ab-stats">
                {p.stats.map(s => (
                  <div key={s.label}>{s.metric
                    ? <MetricTip id={s.metric}><CountUp text={s.value} /></MetricTip>
                    : <CountUp text={s.value} />}<span>{s.label}</span></div>
                ))}
              </dl>
            )}
            {p.chips.length > 0 && (
              <ul className="ab-chips">
                {p.chips.map(ch => (
                  <li key={ch.text}>
                    {ch.href
                      ? <a href={ch.href} target="_blank" rel="noopener noreferrer">{ch.text} ↗</a>
                      : ch.text}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
      <div className="ab-honors">
        <p className="lab">Honors <span>case competitions and fellowships</span></p>
        <ol>
          {ACHIEVEMENTS.map(a => (
            <li key={a.name}>
              <span className="ab-crest" style={{ color: a.crest.color }} aria-hidden="true">
                <svg viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="24" cy="24" r="16.5" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 3" />
                  <text x="24" y={a.crest.text.length > 1 ? 27.5 : 30.5} textAnchor="middle"
                    style={{ font: `700 ${a.crest.text.length > 1 ? 10.5 : 20}px var(--fd)`, fill: 'currentColor', letterSpacing: a.crest.text.length > 1 ? '.06em' : '0' }}>
                    {a.crest.text}
                  </text>
                </svg>
              </span>
              <b>{a.rank} <i>of {a.of}</i></b>
              <span className="ab-hn-name">{a.name}</span>
              <span>{a.note}</span>
              {a.deck && link(a.deck.href) && (
                <a className="ab-hn-deck" href={a.deck.href} target="_blank" rel="noopener noreferrer">
                  {a.deck.label} <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default function About() {
  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>('#about .ab-panel'))
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target) }
      }
    }, { threshold: 0.3 })
    panels.forEach(p => io.observe(p))
    return () => io.disconnect()
  }, [])

  return (
    <section className="band" id="about">
      <div className="sec wrap">
        <SectionHeader
          id="about"
          label="About"
          variant="serif"
          title="The person behind the work."
          meta={['Associate Product Manager intern at RISA Labs', 'Bengaluru']}
          aside={<CurrentlyTicker facts={['Associate Product Manager intern at RISA Labs', 'AI workflows for US healthcare', 'Placement Coordinator at BITS Goa', 'Consultathon: ₹17L sponsorships, 3,200 registrations', 'Building AskCart']} />}
        />
        <div className="ab-spread">
          <div className="ab-page ab-l">
            <blockquote className="ab-pq">The best product decisions come from people, not dashboards.</blockquote>
            <div className="ab-bio">
              <p className="ab-dc">I studied Electronics and Communication Engineering at BITS Pilani Goa, with a Finance minor. I drifted into product because my questions were never only about the tech — they were also about people, and about money. Now I&apos;m an Associate Product Manager at RISA Labs, shipping AI workflows for US healthcare.</p>
              <p>Outside work I lead campus placements at BITS Goa and run a 45-consultant practice at 180 Degrees Consulting.</p>
            </div>
            <div className="ab-edu">
              <svg className="ab-edu-crest" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="22" cy="22" r="15" fill="none" stroke="currentColor" strokeWidth=".7" />
                <path d="M14 27v-8l8-5 8 5v8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M17.5 27v-5.5M22 27v-5.5M26.5 27v-5.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13.5 30h17" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <div className="ab-edu-bd">
                <p className="lab">Education</p>
                <b>{EDUCATION.school}</b>
                <span>{EDUCATION.degree}</span>
                <span className="ab-edu-meta"><em>{EDUCATION.minor}</em><i aria-hidden="true" /><em>{EDUCATION.classYear}</em></span>
              </div>
            </div>
            <span className="ab-folio" aria-hidden="true">Suparna Deshmukh</span>
          </div>
          <div className="ab-page ab-r">
            <Positions />
            <span className="ab-folio" aria-hidden="true">Bengaluru</span>
          </div>
        </div>
      </div>
    </section>
  )
}
