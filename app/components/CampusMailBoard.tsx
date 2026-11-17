'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import { useTimeline, type TlStep } from '../lib/timeline'
import FitStage from './FitStage'
import Stamp from './Stamp'
import { m } from '../lib/metrics'

// One campaign's audience, one row each. status flips queued -> sent -> delivered -> replied.
interface Rec { co: string; role: string; y: number; reply?: boolean }
const RECS: Rec[] = [
  { co: 'Acme Steel', role: 'HR lead', y: 22, reply: true },
  { co: 'Bharat Energy', role: 'Talent', y: 92 },
  { co: 'NovaSoft', role: 'Recruiter', y: 162, reply: true },
  { co: 'Orbit Labs', role: 'Talent', y: 232 },
]

const SENT = m('pc-crm-emails').num ?? 3700
const COUNT_MS = 900

const DRAFT_MS = 0
const PERSON_MS = 1100
const SEND_MS = 2200
const REPLY_MS = 3600
const STAMP_MS = 4300
const LOOP_MS = 7200
const STEPS: TlStep[] = [
  { at: DRAFT_MS, name: 'draft' },
  { at: PERSON_MS, name: 'person' },
  { at: SEND_MS, name: 'sent' },
  { at: REPLY_MS, name: 'replies' },
  { at: STAMP_MS, name: 'stamp' },
]

const v = (name: string, value: string | number) => ({ [`--${name}`]: value })

export default function CampusMailBoard() {
  const ref = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState(false)

  const tl = useTimeline(ref, STEPS, LOOP_MS, { initialHoldMs: 0 })
  const person = hover || tl.has('person')
  const sent = tl.has('sent')
  const replies = tl.has('replies')

  const countUp = useCallback(() => {
    const el = count.current
    if (!el) return
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / COUNT_MS)
      el.textContent = `${Math.round(SENT * (1 - Math.pow(1 - p, 3))).toLocaleString('en-IN')}`
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fires when the cycle's sent step lands
  useEffect(() => { if (sent) countUp() }, [sent])

  const onEnter = () => { if (reduced) return; setHover(true) }
  const onLeave = () => setHover(false)

  return (
    <div ref={ref} role="img" aria-label="Animated send flow: a campaign email is personalised per recruiter, sent, and replies come back — 3,700 emails across the placement cycle">
      <FitStage w={560} h={340}>
        <div
          className={`cm ${person ? 'person' : ''} ${sent ? 'sent' : ''} ${replies ? 'replies' : ''}`}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
        >
          <div className="cm-mail">
            <div className="cm-subj">
              <small>Subject</small>
              <b>2026 Placements — {`{recruiter_name}`}</b>
            </div>
            <p>
              Writing to you as Placement Coordinator, BITS Goa. We are opening our
              <span className="cm-merge"> {`{company_name}`}</span> drive and would love
              to talk to your team about the batch.
            </p>
            <div className="cm-sign">— Suparna D., Placement Cell</div>
            <span className="cm-tag">AI draft · 15-person team</span>
          </div>

          <div className="cm-rail">
            {RECS.map((r, i) => (
              <div key={r.co} className={`cm-rec ${r.reply ? 'rep' : ''}`} style={{ ...v('y', `${r.y}px`), ...v('i', i) } as CSSProperties}>
                <span className="dot" />
                <div className="who">
                  <b>{r.co}</b>
                  <small>{r.role}</small>
                </div>
                <span className={`st ${r.reply ? 'rep' : ''}`}>
                  <i className="q">queued</i><i className="s">sent</i><i className="d">delivered</i><i className="r">replied</i>
                </span>
              </div>
            ))}
          </div>

          <div className="cm-tot">
            <span ref={count} className="n">0</span>
            <label>emails sent, all campaigns</label>
          </div>

          <Stamp
            shape="round" tone="ok" size="lg" rot={-8}
            label="3,700 SENT" sub="4 campaigns"
            slammed={tl.has('stamp')} decorative
            className="cm-stamp timeline"
          />
        </div>
      </FitStage>
    </div>
  )
}
