'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { usePrefersReducedMotion } from './hooks'
import { useMotionPref } from './motion'

export interface TlStep {
  /** absolute offset (ms) within the loop cycle */
  at: number
  /** stable name; drive classes from `has(name)` */
  name: string
}

export interface TimelineHandle {
  /** True while a replay cycle is running (false in the finished first frame and off-screen). */
  readonly inCycle: boolean
  /** True if the named step has fired in the current cycle. Always true in the final state. */
  has: (name: string) => boolean
}

/**
 * Declarative timeline for the self-animating figures (P2-6). Steps are absolute offsets
 * within one loop cycle; the first frame is the finished state (every step considered fired),
 * and each visible cycle clears the baseline and re-fires the steps in order.
 *
 * Handles: off-screen pause and tab-hidden pause (`.paused` on the host, like useVisibleLoop),
 * reduced motion and Motion Off (stays on the finished frame, no timers), and a pre-cycle
 * hold so the finished state breathes before the first replay.
 */
export function useTimeline<T extends HTMLElement>(
  ref: RefObject<T | null>,
  steps: readonly TlStep[],
  loopMs: number,
  opts: { initialHoldMs?: number } = {},
): TimelineHandle {
  // `steps` is a module-level constant at every call site, so these are stable per mount
  const sorted = useMemo(() => steps.slice().sort((a, b) => a.at - b.at), [steps])
  const finalSet = useMemo(() => new Set(sorted.map(s => s.name)), [sorted])
  const holdMs = opts.initialHoldMs ?? 0
  const [fired, setFired] = useState<ReadonlySet<string>>(() => finalSet)
  const [inCycle, setInCycle] = useState(false)
  const timers = useRef<number[]>([])
  const running = useRef(false)
  const reduced = usePrefersReducedMotion()
  const motionOff = useMotionPref() === 'off'
  const still = reduced || motionOff

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  const cycle = useCallback(() => {
    if (!running.current) return
    clear()
    setFired(new Set())
    setInCycle(true)
    for (const step of sorted) later(() => setFired(prev => new Set(prev).add(step.name)), step.at)
    // eslint-disable-next-line react-hooks/immutability -- self-recursive loop callback
    later(cycle, loopMs)
  }, [sorted, loopMs, clear, later])

  const start = useCallback(() => {
    if (still) { setFired(finalSet); return }
    running.current = true
    if (!timers.current.length) later(cycle, holdMs)
  }, [cycle, still, holdMs, finalSet, later])

  const stop = useCallback(() => {
    running.current = false
    clear()
    setInCycle(false)
    setFired(finalSet)
  }, [clear, finalSet])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let visible = false
    const sync = () => (visible && !document.hidden ? start() : stop())
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      el.classList.toggle('paused', !visible)
      sync()
    }, { threshold: 0.05 })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      stop()
    }
  }, [ref, start, stop, still])

  useEffect(() => stop, [stop])

  return { inCycle, has: (name: string) => fired.has(name) }
}
