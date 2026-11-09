'use client'

import '../hero-right.css'
import Link from 'next/link'
import Image from 'next/image'
import AskCartPhone from './AskCartPhone'
import MetricTip from './MetricTip'
import CountUp from './CountUp'
import { m } from '../lib/metrics'
import { EDUCATION } from '../lib/site'

/**
 * The hero's right hand: an annotated exhibit in a three-column desk grid — the ID badge over
 * the BITS Goa campus card, the RISA stat card with two taped notes under it, and the AskCart
 * phone with the Series A note. Each object is tagged with a dimension-style callout riding its
 * own gutter above it; the pointer drives a small parallax and objects lift on hover.
 */
export default function HeroExhibit() {
  return (
    <div className="ex-wrap">
      <div className="exhibit" id="hero-exhibit">
        <div className="ex-col">
          <span className="ex-lab"><span className="ix">01</span> · THE PERSON</span>
          <a className="ex-ob ex-badge" href="#about" style={{ ['--d' as string]: 1.15 }}>
            <span className="ex-clip" aria-hidden="true" />
            <Image src="/images/hero/suparna-portrait-f1628725.webp" alt="Suparna Deshmukh" width={1254} height={1254} quality={90} sizes="(max-width: 640px) 80vw, 300px" priority style={{ width: '100%', height: 'auto' }} />
            <b>Suparna Deshmukh</b>
            <small>Associate Product Manager Intern</small>
            <small>RISA Labs · Bengaluru</small>
            <span className="ex-bcode" aria-hidden="true" />
          </a>
          <span className="ex-lab"><span className="ix">02</span> · BITS PILANI, GOA</span>
          <a className="ex-ob ex-campus" href="#about" style={{ ['--d' as string]: 0.9 }} aria-label="BITS Pilani, Goa: ECE with a Finance minor, class of 2027">
            <span className="ex-clip" aria-hidden="true" />
            <Image src="/images/hero/bits-goa-5cd7ed84.webp" alt="The BITS Pilani Goa campus: main building, palms and lawn" width={800} height={306} quality={90} sizes="(max-width: 640px) 88vw, 272px" priority style={{ width: '100%', height: 'auto' }} />
            <b>BITS Pilani, Goa</b>
            <small>{EDUCATION.branch}</small>
            <small>Finance minor · Class of 2027</small>
          </a>
        </div>

        <div className="ex-col">
          <span className="ex-lab"><span className="ix">03</span> · RISA LABS</span>
          <a className="ex-ob ex-risa" href="#experience-risa" style={{ ['--d' as string]: 1.45 }} aria-label={`RISA Labs: ${m('risa-hours').num} hours a week saved across ${m('risa-users').shown} users by Status Tracking; ${m('risa-docs').num} docs/day on a cron pipeline; ${m('risa-vapi').shown} accuracy on the Vapi calling MVP; ${m('risa-qc').shown} QC throughput; ${m('risa-pulse').shown} auto-RCA precision; ${m('risa-tat').shown} faster portal filing; ${m('risa-studio').shown} saved by Document Studio. ${m('risa-hours').source}, as of ${m('risa-hours').asOf}`}>
            <span className="ex-risa-hd"><b>RISA Labs</b><small>APM intern · now</small></span>
            <MetricTip id="risa-hours" className="block" focusable={false}><span className="ex-risa-big"><CountUp text={String(m('risa-hours').num)} delayMs={600} /><i> hrs/wk</i></span></MetricTip>
            <span className="ex-risa-sub">saved across {m('risa-users').shown} users · Status Tracking 0→1</span>
            <span className="ex-risa-grid" aria-label="Other RISA standouts">
              {([
                ['risa-docs', 'docs/day'],
                ['risa-vapi', 'Vapi calls'],
                ['risa-qc', 'QC speed'],
                ['risa-pulse', 'auto-RCA'],
                ['risa-tat', 'portal TAT'],
                ['risa-studio', 'Doc Studio'],
              ] as const).map(([id, lab], i) => (
                <span key={id} className="ex-rg">
                  <MetricTip id={id} focusable={false}><CountUp text={m(id).shown} delayMs={700 + i * 80} /></MetricTip>
                  <small>{lab}</small>
                </span>
              ))}
            </span>
          </a>
          <a className="ex-ob ex-im" href="#experience-investmates" style={{ ['--d' as string]: 1.55 }} aria-label={`InvestMates: ${m('im-ctr').shown} homepage CTR lift from the revamp A/B test. ${m('im-ctr').source}, as of ${m('im-ctr').asOf}`}>
            <span className="ex-im-hd"><b>InvestMates</b><small>FinTech · Wealth · ’25</small></span>
            <MetricTip id="im-ctr" className="block" focusable={false}><span className="ex-im-big"><CountUp text={m('im-ctr').shown} delayMs={650} /></span></MetricTip>
            <span className="ex-im-lab">homepage CTR lift</span>
          </a>
          <span className="ex-lab"><span className="ix">05</span> · POR</span>
          <div className="ex-note ex-note--pc" style={{ ['--d' as string]: 1.05, ['--rot' as string]: '0.8deg' }}>
            <span className="ex-note-num">Placement Coordinator</span>
            <span className="ex-note-lab">BITS Goa · 2026 batch</span>
          </div>
          <a className="ex-ob ex-por" href="#corporate-everyday" style={{ ['--d' as string]: 1.75 }} aria-label={`Director, 180 Degrees Consulting: ${m('ed-raise').shown} Series A for Everyday Diamonds from All In Capital. ${m('ed-raise').source}, as of ${m('ed-raise').asOf}`}>
            <span className="ex-por-hd"><b>Director, 180DC</b><small>180 Degrees Consulting</small></span>
            <MetricTip id="ed-raise" className="block" focusable={false}><span className="ex-por-big"><CountUp text={m('ed-raise').shown} delayMs={800} /><i> Series A</i></span></MetricTip>
            <span className="ex-por-lab">Everyday Diamonds · All In Capital</span>
          </a>
        </div>

        <div className="ex-col">
          <span className="ex-lab"><span className="ix">04</span> · ASKCart</span>
          <Link className="ex-ob ex-phone" href="/projects/askcart" style={{ ['--d' as string]: 0.7 }} aria-label="AskCart: guided AI search, personal build">
            <span className="ex-island" aria-hidden="true" />
            <span className="acp-frame"><AskCartPhone /></span>
          </Link>
          <span className="ex-lab"><span className="ix">06</span> · ACHIEVEMENTS</span>
          <div className="ex-note ex-note--acc" style={{ ['--d' as string]: 1.25, ['--rot' as string]: '-0.8deg' }}>
            <MetricTip id="acc-rank" className="block"><span className="ex-note-num"><CountUp text={m('acc-rank').shown} delayMs={1100} /></span></MetricTip>
            <span className="ex-note-lab">of {m('acc-of').shown} · Accenture Strategy ’25</span>
          </div>
          <div className="ex-note ex-note--iima" style={{ ['--d' as string]: 1.45, ['--rot' as string]: '0.5deg' }}>
            <MetricTip id="iima-rank" className="block"><span className="ex-note-num"><CountUp text={m('iima-rank').shown} delayMs={1300} /></span></MetricTip>
            <span className="ex-note-lab">of {m('iima-of').shown} · IIMA Fintech Frontier ’24</span>
          </div>
        </div>
      </div>
    </div>
  )
}
