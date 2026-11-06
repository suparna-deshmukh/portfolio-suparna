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
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = wrap.getBoundingClientRect()
        exhibit.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
        exhibit.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
      })
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true })
    return () => { ro.disconnect(); window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section id="hero" ref={heroRef} className="hero band">
      <div className="hbg" aria-hidden="true">
        <span className="hbg-glow g1" /><span className="hbg-glow g2" /><span className="hbg-glow g3" />
        <span className="hbg-grid" />
        <svg className="hbg-lines" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-40 640 C 280 520, 520 760, 860 600 S 1300 480, 1480 560" />
          <path className="flow" d="M-40 700 C 320 600, 600 820, 920 660 S 1320 560, 1480 640" />
          <path d="M-40 220 C 300 140, 640 300, 980 180 S 1320 120, 1480 170" />
        </svg>
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
