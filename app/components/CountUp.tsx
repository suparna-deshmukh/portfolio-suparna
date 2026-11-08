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
export default function CountUp({ text, className, from, delayMs = 0, ms }: { text: string; className?: string; from?: number; delayMs?: number; ms?: number }) {
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
    const duration = ms ?? (target < 10 ? SHORT_MS : LONG_MS)
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const value = (fromVal + (target - fromVal) * easeOut(t)).toFixed(decimals)
      setShown(text.slice(0, match.index) + value + text.slice((match.index ?? 0) + match[1].length))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    const startCount = () => {
      start = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const timer = delayMs > 0 ? window.setTimeout(startCount, delayMs) : (startCount(), 0)
    return () => { cancelAnimationFrame(raf); if (timer) window.clearTimeout(timer) }
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
