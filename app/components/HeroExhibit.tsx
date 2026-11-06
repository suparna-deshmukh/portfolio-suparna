'use client'

import '../hero-right.css'
import AskCartPhone from './AskCartPhone'

/**
 * The hero's right hand: an annotated exhibit. Four objects pinned loose on the cross-grid — the ID
 * badge, the BITS Goa campus, the RISA stat card, the AskCart phone — each tagged with a
 * dimension-style callout. The pointer drives a small parallax; each object links to where it goes.
 */
export default function HeroExhibit() {
  return (
    <div className="ex-wrap">
      <div className="exhibit" id="hero-exhibit">
        <a className="ex-ob ex-badge" href="#about" style={{ ['--d' as string]: 1.15, ['--rot' as string]: '-5deg' }}>
          <span className="ex-clip" aria-hidden="true" />
          <img src="/images/hero/suparna-portrait.webp" alt="Suparna Deshmukh" width={144} height={136} />
          <b>Suparna Deshmukh</b>
          <small>Associate Product Manager</small>
          <small>RISA Labs · Bengaluru</small>
          <span className="ex-bcode" aria-hidden="true" />
        </a>

        <a className="ex-ob ex-risa" href="#experience-risa" style={{ ['--d' as string]: 1.45, ['--rot' as string]: '3deg' }} aria-label="RISA Labs — 500 hours a week saved across 200 users">
          <span className="ex-risa-hd"><b>RISA Labs</b><small>APM intern · now</small></span>
          <span className="ex-risa-big">500<i> hrs/wk</i></span>
          <span className="ex-risa-sub">saved across 200 users · Status Tracking 0→1</span>
          <span className="ex-risa-sub">118 payers · 75% coverage / 96% precision</span>
        </a>

        <a className="ex-ob ex-phone" href="/projects/askcart" style={{ ['--d' as string]: 0.7, ['--rot' as string]: '2.5deg' }}>
          <span className="ex-island" aria-hidden="true" />
          <span className="acp-frame"><AskCartPhone /></span>
        </a>

        <a className="ex-ob ex-campus" href="#about" style={{ ['--d' as string]: 0.9, ['--rot' as string]: '-2deg' }} aria-label="BITS Pilani, Goa — ECE with a Finance minor, class of 2027">
          <span className="ex-clip" aria-hidden="true" />
          <img src="/images/hero/bits-goa-sketch.webp" alt="Sketch of the BITS Pilani Goa campus" width={228} height={137} loading="lazy" />
          <b>BITS Pilani, Goa</b>
          <small>ECE (Hons.) + Finance minor · Class of 2027</small>
        </a>

        <svg className="ex-calls" viewBox="0 0 660 540" aria-hidden="true">
          <g>
            <text x="14" y="30"><tspan className="ix">01</tspan> · THE PERSON</text>
            <path d="M 150 26 L 108 46" />
            <circle cx="108" cy="46" r="3.2" />
          </g>
          <g>
            <text x="14" y="326"><tspan className="ix">02</tspan> · BITS PILANI, GOA</text>
            <path d="M 178 322 L 102 344" />
            <circle cx="102" cy="344" r="3.2" />
          </g>
          <g>
            <text x="206" y="120"><tspan className="ix">03</tspan> · RISA LABS</text>
            <path d="M 248 126 L 268 150" />
            <circle cx="268" cy="150" r="3.2" />
          </g>
          <g>
            <text x="206" y="92"><tspan className="ix">04</tspan> · ASKCart</text>
            <path d="M 264 88 L 382 76" />
            <circle cx="384" cy="76" r="3.2" />
          </g>
        </svg>
      </div>
    </div>
  )
}
