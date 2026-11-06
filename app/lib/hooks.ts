'use client'

import { useEffect, useState, type RefObject } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Calls start/stop as the element enters/leaves the viewport and as the tab is shown/hidden. */
export function useVisibleLoop(ref: RefObject<Element | null>, start: () => void, stop: () => void, enabled = true) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    let visible = false
    const sync = () => (visible && !document.hidden ? start() : stop())
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      el.classList.toggle('paused', !visible)
      sync()
    }, { threshold: 0.05 })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      stop()
    }
    // start/stop are expected to be stable (refs inside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled])
}

/** True once the element has scrolled into view (fires once). */
export function useInViewOnce(ref: RefObject<Element | null>, threshold = 0.2): boolean {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, seen])
  return seen
}

export const SECTION_EVENT = 'sectionchange'

/**
 * Observers over the home sections: marks each section [data-arrived] as soon as its top is well inside
 * the viewport (so headings are in place before a skimmer reaches them), and broadcasts the section on
 * the reading line for FloatNav.
 */
const ARRIVE_MARGIN = '0px 0px -15% 0px'

export function useSectionArrival() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
    if (!sections.length) return
    // The current section is the last one in DOM order that touches the reading line.
    const onLine = new Set<HTMLElement>()
    let current = ''
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) { onLine.add(el); el.dataset.arrived = '' } else onLine.delete(el)
      }
      const top = sections.filter(s => onLine.has(s)).pop()
      const id = top?.id ?? ''
      if (id !== current) { current = id; window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: id })) }
    }, { rootMargin: '-40% 0px -55% 0px' })
    const arrive = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        ;(entry.target as HTMLElement).dataset.arrived = ''
        arrive.unobserve(entry.target)
      }
    }, { rootMargin: ARRIVE_MARGIN })
    sections.forEach(s => { io.observe(s); arrive.observe(s) })
    return () => { io.disconnect(); arrive.disconnect() }
  }, [])
}

/** Adds .paused to home bands while they are off screen, so their background loops stop. */
export function useBandPause() {
  useEffect(() => {
    const bands = Array.from(document.querySelectorAll<HTMLElement>("main > section.band"))
    const io = new IntersectionObserver(entries => {
      for (const e of entries) (e.target as HTMLElement).classList.toggle("paused", !e.isIntersecting)
    })
    bands.forEach(b => io.observe(b))
    return () => io.disconnect()
  }, [])
}

export function istTime(): string {
  try {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
  } catch {
    return ''
  }
}
