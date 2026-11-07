'use client'

import { useEffect, useRef, useState } from 'react'
import { useInViewOnce } from '../lib/hooks'

const LONG_MS = 900
const SHORT_MS = 400
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

/**
 * Counts the last number in `text` up once when seen. The final value is server-rendered,
 * so no-JS, crawlers and reduced-motion visitors always read the real figure.
 * "38→51%" counts from 38; everything else counts from 0.
 * An explicit `from` overrides the start value (e.g. the 85% in "58% to 85%").
 */
export default function CountUp({ text, className, from }: { text: string; className?: string; from?: number }) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInViewOnce(ref, 0.4)
  const [shown, setShown] = useState(text)

  const match = text.match(/(\d+(?:\.\d+)?)(?!.*\d)/)
  const target = match ? parseFloat(match[1]) : NaN
  const fromVal = from ?? (/→/.test(text) ? parseFloat(text) : 0)
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0

  useEffect(() => {
    if (!seen || !match || Number.isNaN(target)) return
    if (!document.documentElement.classList.contains('motion-ok')) return
    const duration = target < 10 ? SHORT_MS : LONG_MS
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const value = (fromVal + (target - fromVal) * easeOut(t)).toFixed(decimals)
      setShown(text.slice(0, match.index) + value + text.slice((match.index ?? 0) + match[1].length))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // runs once per page load when first seen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])

  return (
    <b ref={ref} className={className} style={{ minWidth: `${text.length}ch` }}>
      <span className="sr">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </b>
  )
}
