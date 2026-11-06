'use client'

import { useEffect, useState } from 'react'
import { istTime } from '../lib/hooks'

const TICK_MS = 30_000

/** "Currently" ticker for the About header: known facts only, plus the Bengaluru clock with a sweeping dial. */
export function CurrentlyTicker({ facts }: { facts: string[] }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(istTime())
    tick()
    const id = window.setInterval(tick, TICK_MS)
    return () => window.clearInterval(id)
  }, [])
  const items = [...facts, `Bengaluru ${time || '--:--'} IST`]
  const track = items.map((f, i) => <span key={i} className="tk-item">{f}</span>)
  return (
    <div className="ticker" role="group" aria-label={`Currently: ${items.join('. ')}`}>
      <span className="dial" aria-hidden="true"><i /></span>
      <div className="tk-mask" aria-hidden="true">
        <div className="tk-track">{track}{track}</div>
      </div>
    </div>
  )
}
