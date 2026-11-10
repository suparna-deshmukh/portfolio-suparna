'use client'

import '../hero-left.css'
import { useEffect, useRef } from 'react'
import { useVisibleLoop } from '../lib/hooks'
import HeroLetterhead from './HeroLetterhead'
import HeroExhibit from './HeroExhibit'

const noop = () => {}

const EXHIBIT_W = 726
// .hd-in vertical padding (84 + 64); card zoom and exhibit scale are sized against innerHeight minus this
const HERO_PAD_V = 148

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useVisibleLoop(heroRef, noop, noop) // .paused stops background and board loops off screen

  // Fit the fixed-size exhibit to its column.
  useEffect(() => {
    const cell = wrapRef.current
    const box = cell?.querySelector<HTMLElement>('.ex-wrap')
    const exhibit = document.getElementById('hero-exhibit')
    const hdIn = document.querySelector<HTMLElement>('.hd-in')
    if (!cell || !box || !exhibit || !hdIn) return
    const tb = document.querySelector<HTMLElement>('.tb')
    const fit = () => {
      // <=1024: single column — the exhibit fits the column width, the card never zooms.
      const stacked = window.matchMedia('(max-width:1024px)').matches
      if (stacked) {
        box.style.width = '' // drop any desktop sizing, fall back to CSS min(726px,100%)
        hdIn.style.gridTemplateColumns = '' // drop the pinned px columns, fall back to 1fr
        const s = window.matchMedia('(max-width:639px)').matches
          ? 1
          : Math.min(cell.clientWidth / EXHIBIT_W, 1.15)
        exhibit.style.setProperty('--s', String(s))
        box.style.height = `${Math.round(exhibit.offsetHeight * s)}px`
        return
      }
      // >=1025: pin the 5/8 columns to exact px first, so the card's zoom can never feed back
      // into the fr distribution (that loop was the x-axis drift on browser zoom). Then size
      // the card (zoom) and the exhibit (scale) independently against the same viewport
      // budget: card flush at the left margin, desk flush at the right, and the desk at
      // exactly the card's height whenever the margins allow it.
      const pad = parseFloat(getComputedStyle(hdIn).paddingLeft)
      const contentW = hdIn.getBoundingClientRect().width - pad * 2
      const gap = Math.min(48, Math.max(24, window.innerWidth * 0.03))
      const col5 = Math.round((contentW - gap) * 5 / 13)
      const col8 = Math.round(contentW - gap - col5)
      hdIn.style.gridTemplateColumns = `${col5}px ${col8}px`
      const budget = window.innerHeight - HERO_PAD_V
      const exH = exhibit.offsetHeight
      const sW = Math.min(col8 / EXHIBIT_W, 1.15)
      // The card's local width is its column divided by its zoom, so its height depends on
      // the zoom we ship (lines reflow when the zoomed card crosses its 580px max-width).
      // on-screen height is monotone in the zoom, so bisect for the largest fit; the floor
      // keeps the hero from ever overflowing the first screen.
      const cardAt = (z: number) => {
        if (!tb) return 0
        const prev = tb.style.zoom
        tb.style.zoom = String(z)
        const v = tb.getBoundingClientRect().height + 10 * z // + the zoomed 10px bottom margin
        tb.style.zoom = prev
        return v
      }
      let heroS = 1
      if (tb && cardAt(1) > budget) {
        let lo = 0.3
        let hi = 1
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2
          if (cardAt(mid) <= budget) lo = mid
          else hi = mid
        }
        heroS = lo
      }
      heroS = Math.floor(heroS * 100) / 100
      if (tb && cardAt(heroS) > budget + 0.5) {
        while (heroS > 0.3 && cardAt(heroS) > budget + 0.5) heroS = Math.floor((heroS - 0.01) * 100) / 100
      }
      hdIn.style.setProperty('--heroS', String(heroS))
      // match the card's height whenever the column width allows; otherwise the desk fills
      // the column (width-fit) and still hugs the right margin
      const s = tb ? Math.min(sW, (cardAt(heroS) - 10 * heroS) / exH) : sW
      exhibit.style.setProperty('--s', String(s))
      // the box becomes exactly the scaled desk's box; the auto left margin keeps it
      // hugging the right content edge
      box.style.width = `${Math.round(EXHIBIT_W * s)}px`
      box.style.height = `${Math.round(exH * s)}px`
    }
    fit()
    // resize is the only trigger (no ResizeObserver: nothing it would observe feeds back
    // into the measurements); rAF-debounced so a burst of events from browser zoom lands as one pass
    let rafResize = 0
    const onResize = () => {
      if (rafResize) return
      rafResize = requestAnimationFrame(() => { rafResize = 0; fit() })
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(rafResize) }
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
