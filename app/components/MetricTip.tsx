'use client'

import type { ReactNode } from 'react'
import { m } from '../lib/metrics'

/**
 * Hover and focus proof for a headline number: sample size, as-of date and where the figure
 * comes from. Tabbable by default so the proof is reachable without a pointer; pass
 * `focusable={false}` when the stat sits inside a link or a role="img" figure — then the
 * same proof travels in the container's aria-label instead.
 */
export default function MetricTip({ id, children, className, focusable = true }: {
  id: string
  children: ReactNode
  className?: string
  focusable?: boolean
}) {
  const mt = m(id)
  const head = [mt.n ? `n=${mt.n}` : null, `as of ${mt.asOf}`].filter(Boolean).join(' · ')
  return (
    <span
      className={['mtip', className].filter(Boolean).join(' ')}
      tabIndex={focusable ? 0 : undefined}
      aria-label={`${mt.shown}. ${head}. ${mt.source}`}
    >
      {children}
      <span className="mtip-b" aria-hidden="true"><b>{head}</b><i>{mt.source}</i></span>
    </span>
  )
}
