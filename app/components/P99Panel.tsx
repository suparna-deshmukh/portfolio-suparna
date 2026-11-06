'use client'

import { useEffect, useState } from 'react'
import { P99_EVENT } from './P99Hint'

interface Metrics { ttfb: number; lcp: number; kb: number }

/** Type "p99" anywhere to see this page's real load numbers. Escape closes it. */
export default function P99Panel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    let buffer = ''
    let lcp = 0
    let po: PerformanceObserver | undefined
    try {
      po = new PerformanceObserver(list => { const e = list.getEntries(); lcp = e[e.length - 1].startTime })
      po.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch { /* unsupported */ }

    const open = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      const bytes = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).reduce((sum, r) => sum + (r.transferSize || 0), nav?.transferSize || 0)
      setMetrics({ ttfb: Math.round(nav?.responseStart ?? 0), lcp: Math.round(lcp), kb: Math.round(bytes / 1024) })
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMetrics(null); return }
      const target = e.target as HTMLElement
      if (/input|textarea/i.test(target.tagName) || target.isContentEditable || e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-3)
      if (buffer === 'p99') open()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(P99_EVENT, open)
    if (process.env.NODE_ENV === 'production') {
      console.info('Built by Suparna Deshmukh. Type "p99" anywhere to see how fast this page loaded.')
    }
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(P99_EVENT, open); po?.disconnect() }
  }, [])

  if (!metrics) return null
  return (
    <div className="p99" role="status">
      <b>TTFB</b> {metrics.ttfb} ms<br />
      <b>LCP</b> {metrics.lcp} ms<br />
      <b>Transferred</b> {metrics.kb} KB
      <small><button type="button" className="kb" onClick={() => setMetrics(null)}>Close</button> · Esc</small>
    </div>
  )
}
