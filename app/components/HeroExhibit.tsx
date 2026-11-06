'use client'

import '../hero-right.css'
import Link from 'next/link'
import Image from 'next/image'
import AskCartPhone from './AskCartPhone'
import MetricTip from './MetricTip'
import { m } from '../lib/metrics'

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
          <Image src="/images/hero/suparna-portrait.webp" alt="Suparna Deshmukh" width={144} height={136} />
          <b>Suparna Deshmukh</b>
          <small>Associate Product Manager</small>
          <small>RISA Labs · Bengaluru</small>
          <span className="ex-bcode" aria-hidden="true" />
        </a>

        <a className="ex-ob ex-risa" href="#experience-risa" style={{ ['--d' as string]: 1.45, ['--rot' as string]: '3deg' }} aria-label={`RISA Labs — ${m('risa-hours').num} hours a week saved across ${m('risa-users').shown} users. ${m('risa-hours').source}, as of ${m('risa-hours').asOf}`}>
          <span className="ex-risa-hd"><b>RISA Labs</b><small>APM intern · now</small></span>
          <MetricTip id="risa-hours" className="block" focusable={false}><span className="ex-risa-big">{m('risa-hours').num}<i> hrs/wk</i></span></MetricTip>
          <span className="ex-risa-sub">saved across {m('risa-users').shown} users · Status Tracking 0→1</span>
          <span className="ex-risa-sub">{m('risa-payers').shown} payers · {m('risa-coverage').shown} coverage / {m('risa-precision').shown} precision</span>
        </a>

        <Link className="ex-ob ex-phone" href="/projects/askcart" style={{ ['--d' as string]: 0.7, ['--rot' as string]: '2.5deg' }}>
          <span className="ex-island" aria-hidden="true" />
          <span className="acp-frame"><AskCartPhone /></span>
        </Link>

        <a className="ex-ob ex-campus" href="#about" style={{ ['--d' as string]: 0.9, ['--rot' as string]: '-2deg' }} aria-label="BITS Pilani, Goa — ECE with a Finance minor, class of 2027">
          <span className="ex-clip" aria-hidden="true" />
          <Image src="/images/hero/bits-goa-sketch.webp" alt="Sketch of the BITS Pilani Goa campus" width={228} height={137} priority />
          <b>BITS Pilani, Goa</b>
          <small>Electronics & Communication Engineering</small>
          <small>Finance minor · Class of 2027</small>
        </a>

        <div className="ex-note ex-n1" style={{ ['--d' as string]: 1.25, ['--rot' as string]: '-2deg' }}>
          <MetricTip id="acc-rank" className="block"><span className="ex-note-num">{m('acc-rank').shown}</span></MetricTip>
          <span className="ex-note-lab">of {m('acc-of').shown} · Accenture Strategy ’25</span>
        </div>
        <div className="ex-note ex-n2" style={{ ['--d' as string]: 1.05, ['--rot' as string]: '1.6deg' }}>
          <span className="ex-note-num">Placement Coordinator</span>
          <span className="ex-note-lab">BITS Goa · 2026 batch</span>
        </div>
        <div className="ex-note ex-n3" style={{ ['--d' as string]: 1.35, ['--rot' as string]: '-1.2deg' }}>
          <MetricTip id="ed-raise" className="block"><span className="ex-note-num">{m('ed-raise').shown}</span></MetricTip>
          <span className="ex-note-lab">Series A · 180DC, Everyday Diamonds</span>
        </div>

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
