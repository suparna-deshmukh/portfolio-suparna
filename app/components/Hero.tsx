'use client'

import '../hero-left.css'
import { useEffect, useRef } from 'react'
import { useVisibleLoop } from '../lib/hooks'
import HeroLetterhead from './HeroLetterhead'
import HeroExhibit from './HeroExhibit'

const noop = () => {}

const EXHIBIT_W = 660

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useVisibleLoop(heroRef, noop, noop) // .paused stops background and board loops off screen

  // Fit the fixed-size exhibit to its column; the pointer drives a small parallax on the objects.
  useEffect(() => {
    const wrap = wrapRef.current
    const exhibit = document.getElementById('hero-exhibit')
    if (!wrap || !exhibit) return
    const fit = () => exhibit.style.setProperty('--s', String(Math.min(wrap.clientWidth / EXHIBIT_W, 1.15)))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    let raf = 0
    const onMove = (e: PointerEvent) => {
      if (document.documentElement.classList.contains('motion-off')) return
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = wrap.getBoundingClientRect()
        exhibit.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
        exhibit.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
      })
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // No pointer parallax on coarse pointers (P1-5); motion-off is checked per-event in onMove.
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (!reduced && !coarse) window.addEventListener('pointermove', onMove, { passive: true })
    return () => { ro.disconnect(); window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section id="hero" ref={heroRef} className="hero band">
      <div className="hbg" aria-hidden="true">
        <span className="hbg-glow g1" /><span className="hbg-glow g2" /><span className="hbg-glow g3" />
        <span className="hbg-grid" />
        <span className="hbg-grain" />
      </div>

      <div className="hd-in">
        <div className="hd-left">
          <HeroLetterhead />
        </div>
        <div className="hd-right" ref={wrapRef}>
          <HeroExhibit />
        </div>
      </div>
    </section>
  )
}
