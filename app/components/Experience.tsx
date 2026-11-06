'use client'

import '../route.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EXPERIENCE, type Company } from '../lib/site'
import SectionHeader from './SectionHeader'
import CountUp from './CountUp'

/** The reading line: a station is current while it crosses the band 40% to 45% down the viewport. */
const READING_LINE = '-40% 0px -55% 0px'

const firstYear = () => {
  const years = EXPERIENCE.map(c => parseInt(c.years.match(/'(\d\d)/)?.[1] ?? '', 10)).filter(n => !Number.isNaN(n))
  return years.length ? 2000 + Math.min(...years) : null
}

const COMPASS = (
  <svg className="rt-compass" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2.2 5-4.8 2 2.2-5z" fill="currentColor" stroke="none" />
  </svg>
)

const CHEVRON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 3.8 5 6.3l2.5-2.5" /></svg>
)

/** "Jul 2025 to Dec 2025 · Internship · Bengaluru" loses the city the station header already shows. */
function stopDates(meta: string, city: string): string {
  const parts = meta.split(' · ')
  return parts.length > 2 && parts[parts.length - 1] === city ? parts.slice(0, -1).join(' · ') : meta
}

/** One stop on the road: a station node and a paper card with the role's proof. */
function Station({ c, index, now }: { c: Company; index: number; now: boolean }) {
  const role = c.roles[0]
  if (role.pending) return null
  return (
    <article id={`experience-${c.id}`} className={`rt-stn${now ? ' now' : ''}`} style={{ ['--si' as string]: index }}>
      <span className="rt-node" aria-hidden="true">{now ? 'NOW' : `S${index + 1}`}</span>
      <div className="rt-card">
        <header className="rt-head">
          <h3>{c.name}</h3>
          <span className="rt-sum">{c.summary}</span>
        </header>
        <div className="rt-body">
          <section className="rt-role">
            <span className="rt-dates">{stopDates(role.meta, c.city)}</span>
            <h4>{role.title}</h4>
            <div className="rt-big"><CountUp text={role.hero.value} /><span>{role.hero.label}</span></div>
            <p className="rt-how">{role.how}</p>
          </section>
          <div>
            <ul className="rt-out">
              {role.results.map(r => <li key={r.label}><b>{r.value}</b><span>{r.label}</span></li>)}
            </ul>
            <details className="rt-ft">
              <summary><span>All {role.bullets.length} results {CHEVRON}</span></summary>
              <ul>{role.bullets.map(b => <li key={b.lead}><strong>{b.lead}</strong>{b.rest}</li>)}</ul>
            </details>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Experience as a route: a sticky route manifest (the itinerary) on the left, the stops on a
 * dashed road on the right — newest stop first (the one she's on now), then back in time.
 */
export default function Experience() {
  const STOPS = EXPERIENCE
  const since = firstYear()
  const routeRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<[number, number] | null>(null)
  const hoverMq = useRef<MediaQueryList | null>(null)
  const [active, setActive] = useState(0)
  const [card, setCard] = useState<number | null>(null)

  // Current manifest row: the station crossing the reading line.
  useEffect(() => {
    const box = routeRef.current
    if (!box) return
    const stops = Array.from(box.querySelectorAll<HTMLElement>('.rt-stn'))
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const i = stops.indexOf(e.target as HTMLElement)
        if (i >= 0) setActive(i)
      })
    }, { rootMargin: READING_LINE })
    stops.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Hover card: the headline result of the stop whose manifest row is under the cursor (mouse only).
  const updateCard = useCallback(() => {
    const p = pointer.current, box = routeRef.current, fl = floatRef.current
    hoverMq.current ??= window.matchMedia('(hover: hover)')
    if (!p || !box || !fl || !hoverMq.current.matches) { setCard(null); return }
    const row = document.elementFromPoint(p[0], p[1])?.closest('[data-row]') as HTMLElement | null
    const idx = row ? Number(row.dataset.row) : -1
    if (idx < 0) { setCard(null); return }
    const r = box.getBoundingClientRect()
    fl.style.left = `${Math.max(0, Math.min(r.width - 300, p[0] - r.left + 28))}px`
    fl.style.top = `${p[1] - r.top}px`
    setCard(idx)
  }, [])

  useEffect(() => {
    // One hit test per frame at most: each call forces layout via elementFromPoint + getBoundingClientRect.
    let frame = 0
    const onScroll = () => {
      if (!pointer.current || frame) return
      frame = requestAnimationFrame(() => { frame = 0; updateCard() })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [updateCard])

  const shownCard = card !== null ? STOPS[card] : null

  return (
    <section className="band" id="experience">
      <div className="sec wrap sec-headonly">
        <SectionHeader
          id="experience"
          label="Experience"
          variant="xl"
          title="The route so far."
          meta={[`${STOPS.length} stops · 5 sectors · ${since} to now`, 'Two product teams, then internships across energy, gaming VC and wealth']}
        />
      </div>
      <div className="wrap rt-wrap">
        <div
          ref={routeRef}
          className="rt"
          onPointerMove={e => { pointer.current = [e.clientX, e.clientY]; updateCard() }}
          onPointerLeave={() => { pointer.current = null; setCard(null) }}
        >
          <nav className="rt-man" aria-label="Route manifest">
            <header>
              {COMPASS}
              <b>Route manifest</b>
              <small>{STOPS.length} stops</small>
            </header>
            <ol>
              {STOPS.map((c, i) => (
                <li key={c.id}>
                  {c.group && c.group !== STOPS[i - 1]?.group && (
                    <span className="rt-div">{c.group === 'product' ? 'Product' : 'Industry'}</span>
                  )}
                  <a
                    href={`#experience-${c.id}`}
                    data-row={i}
                    className={i === active ? 'on' : undefined}
                    aria-current={i === active ? 'location' : undefined}
                    onClick={() => setActive(i)}
                  >
                    <span className="rt-st">{i === 0 ? 'NOW' : `S${i + 1}`}</span>
                    <span className="n">{c.name}<em>{c.sector}</em></span>
                    <span className="m">{c.metric}</span>
                    <span className="y">{c.years}</span>
                    <span className="k">{c.metricCaption}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="rt-stops">
            {STOPS.map((c, i) => <Station key={c.id} c={c} index={i} now={i === 0} />)}
          </div>
          <div ref={floatRef} className={`float${shownCard ? ' on' : ''}`} aria-hidden="true">
            <small>{shownCard?.summary}</small>
            <b>{shownCard?.metric}</b>
            <span>{shownCard?.metricCaption}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
