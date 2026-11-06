'use client'

import { useEffect, useState } from 'react'

const QUERY = ['waterproof', 'waterproof sneakers']
const OPTIONS = ['Under ₹3K', '₹3K – 5K', '₹5K – 8K']
const RESULTS = [
  { n: 'Monsoon Grip Trail', p: '₹4,299', r: '4.6' },
  { n: 'RainStride Lite', p: '₹3,799', r: '4.4' },
]
const STEP_MS = 1500
const LAST = 7

/**
 * The hero phone: a live loop of AskCart's guided search — the query types itself, one narrow
 * follow-up question appears, an answer is picked, and the results land. Replays while on screen;
 * reduced motion shows the settled frame.
 */
export default function AskCartPhone() {
  const [step, setStep] = useState(LAST)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setStep(s => (s + 1) % (LAST + 1)), STEP_MS)
    return () => window.clearInterval(id)
  }, [])

  const typed = step >= 1 ? QUERY[Math.min(1, step - 1)] : ''
  const questionOn = step >= 3
  const optionOn = step >= 5
  const resultsOn = step >= 7

  return (
    <span className="acp" aria-hidden="true">
      <span className="acp-status">
        <span>9:41</span>
        <span className="acp-bat"><i /></span>
      </span>
      <span className="acp-app"><b>AskCart</b><small>guided search</small></span>
      <span className="acp-field">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="acp-q">{typed}<i className="acp-caret" /></span>
      </span>
      <span className={`acp-card${questionOn ? ' on' : ''}`}>
        <small>One narrow question</small>
        <b>What&apos;s your budget?</b>
        <span className="acp-opts">
          {OPTIONS.map((o, i) => <i key={o} className={optionOn && i === 1 ? 'pick' : undefined}>{o}</i>)}
        </span>
      </span>
      <span className={`acp-res${resultsOn ? ' on' : ''}`}>
        <small>12 matches · 0 dead ends</small>
        {RESULTS.map(r => (
          <span className="acp-row" key={r.n}>
            <i className="acp-th" />
            <span><b>{r.n}</b><small>{r.p}</small></span>
            <em>★ {r.r}</em>
          </span>
        ))}
      </span>
    </span>
  )
}
