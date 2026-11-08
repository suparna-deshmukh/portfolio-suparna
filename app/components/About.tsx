'use client'

import '../about.css'
import { useEffect } from 'react'
import { ACHIEVEMENTS, POSITIONS, link } from '../lib/site'
import { m } from '../lib/metrics'
import CountUp from './CountUp'
import MetricTip from './MetricTip'
import SectionHeader from './SectionHeader'
import { CurrentlyTicker } from './AboutExtras'
import Image from 'next/image'
import Disclosure from './Disclosure'
import Rich from './Rich'

/** One project per tile, in a single 16-tile row (the Director's signature visual, R-2). */
function TileField({ count, caption }: { count: number; caption: string }) {
  return (
    <div className="ab-tiles" role="img" aria-label={caption}>
      <div className="ab-tiles-grid" style={{ ['--cols' as string]: count }} aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}
      </div>
      <span>{caption}</span>
    </div>
  )
}

/** Placement track: the 58% to 85% segment fills left to right, then one round stamp
 *  slams at the end. The finished frame is the base state (P3). */
function PlacementTrack() {
  const placed = m('pc-placed').num ?? 240
  return (
    <div className="ab-trackfig" role="img" aria-label={`Batch placement rose from 58% to 85%. ${placed} students placed so far.`}>
      <div className="ab-track" aria-hidden="true"><i className="ab-trackseg" /></div>
      <span className="ab-trackstamp" aria-hidden="true"><b>{placed}</b>PLACED</span>
    </div>
  )
}

/** The headline figure: a rate like "58%→85%" splits into a small dim start and a big
 *  count-up finish; everything else counts from zero. */
function HeroFigure({ metric, label, secondary }: { metric: string; label: string; secondary?: { metric: string; label: string } }) {
  const shown = m(metric).shown
  const arrow = shown.includes('→') ? shown.split('→') : null
  return (
    <p className="ab-headline">
      <span className="ab-herofig">
        {arrow
          ? <>
            <small className="ab-from">{arrow[0]} →</small>
            <MetricTip id={metric} focusable={false}><CountUp text={arrow[1]} from={parseFloat(arrow[0])} className="ab-hero" /></MetricTip>
          </>
          : <MetricTip id={metric} focusable={false}><CountUp text={shown} className="ab-hero" /></MetricTip>}
        <span className="ab-hlabel">{label}</span>
      </span>
      {secondary && (
        <span className="ab-sec">
          <MetricTip id={secondary.metric} focusable={false}><CountUp text={m(secondary.metric).shown} /></MetricTip>
          <span>{secondary.label}</span>
        </span>
      )}
    </p>
  )
}

/** Right page: the college years — two panels (Placement, Director) plus the CEL one-row
 *  strip, each with one headline; the rest behind a closed disclosure (R-1). */
function Positions() {
  const panels = POSITIONS.filter(p => !p.strip)
  const strip = POSITIONS.find(p => p.strip)
  return (
    <div className="ab-read" id="about-positions">
      <p className="lab">Positions of responsibility <span>3 roles · BITS Goa</span></p>
      <div className="ab-panels">
        {panels.map(p => (
          <article key={p.id} className="ab-panel" id={`about-${p.id}`}>
            <p className="ab-eyebrow">
              <span title={p.org}>{String(p.no).padStart(2, '0')} · {p.org.toUpperCase()}</span>
              {p.current && <b className="ab-now">NOW</b>}
            </p>
            <header>
              <b>{p.title}</b>
              <em>{p.when}</em>
            </header>
            <div className="ab-herorow">
              <HeroFigure metric={p.headline.metric} label={p.headline.label} secondary={p.secondary} />
              {p.id === 'placement' && <PlacementTrack />}
              {p.id === 'consult' && <TileField count={m('dc-projects').num ?? 16} caption={`${m('dc-projects').shown} projects · 45 consultants`} />}
            </div>
            {p.line && <p className="ab-line"><Rich text={p.line} /></p>}
            {p.chips.length > 0 && (
              <ul className="ab-chips">
                {p.chips.map(ch => (
                  <li key={ch.text}>
                    {ch.href
                      ? <a href={ch.href} target="_blank" rel="noopener noreferrer">{ch.text} ↗</a>
                      : ch.metric
                        ? <MetricTip id={ch.metric} focusable={false}>{ch.text}</MetricTip>
                        : ch.text}
                  </li>
                ))}
              </ul>
            )}
            {p.details && p.details.length > 0 && (
              <Disclosure label="More detail" className="ab-disc">
                <ul className="ab-details">
                  {p.details.map(d => <li key={d}><Rich text={d} /></li>)}
                </ul>
              </Disclosure>
            )}
          </article>
        ))}
      </div>
      {strip && (
        <div className="ab-strip" id={`about-${strip.id}`}>
          <div className="ab-strip-hd">
            <p className="ab-eyebrow"><span title={strip.org}>{String(strip.no).padStart(2, '0')} · {strip.org.toUpperCase()}</span></p>
            <header>
              <b>{strip.title}</b>
              <em>{strip.when}</em>
            </header>
            {strip.line && <p className="ab-strip-line"><Rich text={strip.line} /></p>}
          </div>
          <div className="ab-strip-stats">
            <div className="ab-statrow">
              {strip.stats.map(s => (
                <div key={s.label} className="ab-strip-stat">
                  <span className="ab-statnum">
                    <MetricTip id={s.metric ?? ''} focusable={false}><CountUp text={s.value} ms={600} /></MetricTip>
                    {s.suffix && <i className="ab-suf">{s.suffix}</i>}
                  </span>
                  <span className="ab-slab">{s.label}</span>
                </div>
              ))}
            </div>
            {strip.highlights && strip.highlights.length > 0 && (
              <div className="ab-strip-chips">
                {strip.highlights.map(h => <span key={h} className="ab-strip-chip">{h}</span>)}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="ab-honors" id="about-honors">
        <p className="lab">Honors <span>case competitions and fellowships</span></p>
        <ol>
          {ACHIEVEMENTS.map(a => (
            <li key={a.name}>
              <span className="ab-hn-top">
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
                <span className="ab-hn-txt">
                  <b>{a.rank} <i>of {a.of}</i></b>
                  <span className="ab-hn-name">{a.name}</span>
                  <span className="ab-hn-org">{a.organiser} · {a.year}</span>
                  <span>{a.note}</span>
                </span>
              </span>
              {a.thumb && (
                <Image className="ab-hn-thumb" src={a.thumb} alt={`Slide from the ${a.name} deck`} width={440} height={248} loading="lazy" />
              )}
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
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in', 'play'); io.unobserve(e.target) }
      }
    }, { threshold: 0.3 })
    panels.forEach(p => io.observe(p))
    // hover, focus or tap on a visual replays just that object's choreography
    const visuals = Array.from(document.querySelectorAll<HTMLElement>('#about .ab-trackfig, #about .ab-tiles'))
    const handlers = visuals.map(v => {
      const re = () => {
        const panel = v.closest<HTMLElement>('.ab-panel')
        if (!panel) return
        panel.classList.remove('play')
        void panel.offsetWidth
        panel.classList.add('play')
      }
      v.addEventListener('pointerenter', re)
      v.addEventListener('focusin', re)
      v.addEventListener('click', re)
      return [v, re] as const
    })
    return () => {
      io.disconnect()
      handlers.forEach(([v, re]) => {
        v.removeEventListener('pointerenter', re)
        v.removeEventListener('focusin', re)
        v.removeEventListener('click', re)
      })
    }
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
