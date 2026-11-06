'use client'

import { useEffect } from 'react'
import { useBandPause, useSectionArrival } from '../lib/hooks'

/**
 * Home-page wiring: section arrival for headers + FloatNav, off-screen band loop pausing,
 * and the runtime half of the adaptive degrade — on coarse pointers, a burst of long tasks
 * during the first 5 s marks `html.lite` (the cheap half is decided in the pre-paint script).
 */
export default function PageMotion() {
  useSectionArrival()
  useBandPause()

  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches || !('PerformanceObserver' in window)) return
    let longTasks = 0
    const po = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (entry.duration > 50) longTasks++
      if (longTasks >= 3) {
        document.documentElement.classList.add('lite')
        po.disconnect()
        return
      }
    })
    try { po.observe({ entryTypes: ['longtask'] }) } catch { return }
    const stop = setTimeout(() => po.disconnect(), 5000)
    return () => { po.disconnect(); clearTimeout(stop) }
  }, [])

  return null
}
