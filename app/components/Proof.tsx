'use client'

import type { ReactNode } from 'react'
import MetricTip from './MetricTip'
import Attribution from './Attribution'
import type { Attribution as Attr } from '../lib/site'

/**
 * One figure with its proof (sections brief X-2): the number carries its qualifier on
 * hover, focus and tap (the MetricTip bubble — sample size, as-of, source), plus an
 * optional kind label (Result / Modeled / Scale) and an attribution marker.
 */
export default function Proof({ metric, attribution, kindLabel, children, className }: {
  metric: string
  attribution?: Attr
  kindLabel?: string
  children: ReactNode
  className?: string
}) {
  return (
    <span className={className ? `proof ${className}` : 'proof'}>
      <MetricTip id={metric}>{children}</MetricTip>
      {kindLabel ? <span className="proof-kind">{kindLabel}</span> : null}
      {attribution ? <Attribution a={attribution} /> : null}
    </span>
  )
}
