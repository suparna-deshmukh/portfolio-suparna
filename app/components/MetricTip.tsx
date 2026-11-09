'use client'

import { useCallback, useRef, type ReactNode } from 'react'
import { m } from '../lib/metrics'

/**
 * Hover and focus proof for a headline number: sample size, as-of date and where the figure
 * comes from. Tabbable by default so the proof is reachable without a pointer; pass
 * `focusable={false}` when the stat sits inside a link or a role="img" figure — then the
 * same proof travels in the container's aria-label instead.
 *
 * The bubble is centered on the trigger; when the trigger sits near an edge of a clipping
 * container (a case card, a ledger card, the viewport), the bubble would hang past it, so on
 * show it is nudged back inside via --mtip-dx (measured against the nearest clipping ancestor).
 */
export default function MetricTip({ id, children, className, focusable = true }: {
  id: string
  children: ReactNode
  className?: string
  focusable?: boolean
}) {
  const mt = m(id)
  const detail = [mt.n ? `n=${mt.n}` : null, `as of ${mt.asOf}`].filter(Boolean).join(' · ')
  const rootRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)

  const clamp = useCallback(() => {
    const b = bubbleRef.current
    const root = rootRef.current
    if (!b || !root || typeof window === 'undefined') return
    const br = b.getBoundingClientRect()
    let left = 8
    let right = window.innerWidth - 8
    let n = root.parentElement
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n)
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        const nr = n.getBoundingClientRect()
        left = Math.max(left, nr.left + 6)
        right = Math.min(right, nr.right - 6)
        break
      }
      n = n.parentElement
    }
    let dx = 0
    if (br.left < left) dx = left - br.left
    else if (br.right > right) dx = right - br.right
    b.style.setProperty('--mtip-dx', `${dx}px`)
  }, [])

  const onShow = useCallback(() => { requestAnimationFrame(clamp) }, [clamp])
  const onHide = useCallback(() => {
    bubbleRef.current?.style.removeProperty('--mtip-dx')
  }, [])

  return (
    <span
      ref={rootRef}
      className={['mtip', className].filter(Boolean).join(' ')}
      tabIndex={focusable ? 0 : undefined}
      aria-label={`${mt.shown}. ${mt.source}. ${detail}.`}
      onMouseEnter={onShow}
      onMouseLeave={onHide}
      onFocus={onShow}
      onBlur={onHide}
    >
      {children}
      <span ref={bubbleRef} className="mtip-b" aria-hidden="true"><span className="mtip-src">{mt.source}</span><span className="mtip-det">{detail}</span></span>
    </span>
  )
}
