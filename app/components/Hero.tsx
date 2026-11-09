'use client'

import '../hero-left.css'
import { useEffect, useRef } from 'react'
import { useVisibleLoop } from '../lib/hooks'
import HeroLetterhead from './HeroLetterhead'
import HeroExhibit from './HeroExhibit'

const noop = () => {}

const EXHIBIT_W = 726
// 212px = .hd-in vertical padding (108 + 104)
const HERO_PAD_V = 212

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useVisibleLoop(heroRef, noop, noop) // .paused stops background and board loops off screen

  // Fit the fixed-size exhibit to its column; the pointer drives a small parallax on the objects.
  useEffect(() => {
    const wrap = wrapRef.current
    const exhibit = document.getElementById('hero-exhibit')
    const hdIn = document.querySelector<HTMLElement>('.hd-in')
    if (!wrap || !exhibit || !hdIn) return
    const tb = document.querySelector<HTMLElement>('.tb')
    const fit = () => {
      // Mobile (<=639) uses a purpose-built unscaled composition; desktop scales the fixed 726px
      // desk to the column and syncs the wrapper's height to the scaled block. In the two-column
      // layout card and desk share one scale factor (--heroS), computed from the card's real
      // unzoomed height so the whole hero fits the first screen at any width.
      const stacked = window.matchMedia('(max-width:1024px)').matches
      let heroS = 1
      if (!stacked && tb) {
        const prev = tb.style.zoom
        tb.style.zoom = '1'
        const unzoomed = Math.max(tb.offsetHeight + 10, exhibit.offsetHeight) + 6
        tb.style.zoom = prev
        heroS = Math.min(1, (window.innerHeight - HERO_PAD_V) / unzoomed)
      }
      hdIn.style.setProperty('--heroS', heroS.toFixed(4))
      const s = window.matchMedia('(max-width:639px)').matches
        ? 1
        : Math.min(wrap.clientWidth / EXHIBIT_W, 1.15, heroS)
      exhibit.style.setProperty('--s', String(s))
      wrap.style.height = `${Math.round(exhibit.offsetHeight * s)}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    window.addEventListener('resize', fit)
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
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
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
