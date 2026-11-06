'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import '../endpull.css'

/* Tuning. Distances in px, springs as stiffness / damping (mass 1). */
const ZONE_PX = 48 // how far below the Contact view the curl starts
const FOOT_CLEAR_PX = 24 // how far past the footer the reader goes before the page returns
const SCROLL_CURL = 0.62 // corner size reached by scrolling to the very end
const EXTRA_PULL = 240 // wheel past the end peels the rest of the way
const RESIST = 0.55
const MAIN_SHARE = 0.12
const IDLE_RETURN_MS = 240 // stop scrolling this long inside the zone and the page returns
const SCROLL_PAD = 72
const FLASH_MS = 120
const RETURN_DELAY_MS = 90
const PROG_MS = 1200
const SNAP = { k: 520, c: 34 }
const RETURN = { k: 260, c: 28 }
const STEP = 1 / 120

type Spring = { k: number; c: number }

/** Semi-implicit Euler spring from `from` to 0; calls onFrame with the value each frame. */
function spring(from: number, { k, c }: Spring, onFrame: (v: number) => void, onDone: () => void) {
  let x = from
  let v = 0
  let last = performance.now()
  let raf = 0
  const tick = (now: number) => {
    let dt = Math.min(0.064, (now - last) / 1000)
    last = now
    while (dt > 0) {
      const h = Math.min(STEP, dt)
      v += (-k * x - c * v) * h
      x += v * h
      dt -= h
    }
    if (Math.abs(x) < 0.3 && Math.abs(v) < 0.3) { onFrame(0); onDone(); return }
    onFrame(x)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

/**
 * The end of the page. Scroll on past the Contact form and the bottom right corner of the last sheet starts
 * peeling up off the desk ("that's the last page"), further the deeper you go; wheel past the very end and
 * it peels all the way. Stop scrolling once past the footer (so the footer stays readable) and it slaps flat
 * and the page springs back so Contact sits in view.
 * Transforms only. Keyboard scrolling, anchors, the nav, form focus and selected text never trigger it.
 * Desktop pointer with motion allowed only: touch and reduced motion get a plain page end. Scrolling up cancels it.
 */
export default function EndPull() {
  const [mounted, setMounted] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mount flag: content is SSR'd and only "pulled" client-side, so this setState belongs in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const main = document.querySelector<HTMLElement>('main.bands')
    const contact = document.getElementById('contact')
    if (!main || !contact) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement
    const visual = () => fine.matches && !reduced.matches
    const sync = () => root.classList.toggle('endpull', visual())
    sync()

    let maxScroll = 0
    let target = 0
    let returnFrom = 0
    const measure = () => {
      maxScroll = root.scrollHeight - window.innerHeight
      target = Math.max(0, Math.min(maxScroll, contact.getBoundingClientRect().top + window.scrollY - SCROLL_PAD))
      // The footer stays readable: the return only arms once the reader has scrolled past it.
      const foot = contact.querySelector<HTMLElement>('.foot')
      const footClear = foot ? foot.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + FOOT_CLEAR_PX : 0
      returnFrom = Math.max(target + ZONE_PX, footClear)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(contact)
    ro.observe(document.body)

    let pulled = 0
    let lift = 0
    let idleTimer = 0
    let returnTimer = 0
    let lastY = window.scrollY
    let busy = false
    let lastInputKey = false
    let programmatic = false
    let progTimer = 0
    let stopSpring: (() => void) | null = null

    const past = () => window.scrollY - target
    // Past the footer, or wheeling beyond the very end of the page.
    const inReturnZone = () => window.scrollY > returnFrom || lift > 0
    const atEnd = () => window.scrollY >= maxScroll - 1
    const blocked = () =>
      busy || programmatic || lastInputKey ||
      !!document.activeElement?.closest('#contact form') ||
      !!window.getSelection()?.toString() ||
      !!document.querySelector('.p99')

    let curlNow = -1
    const setCurl = (scale: number) => {
      const st = stageRef.current
      if (!st || scale === curlNow) return
      curlNow = scale
      st.style.visibility = scale > 0.01 ? 'visible' : 'hidden'
      st.style.transform = `scale(${scale})`
    }
    const scrollCurl = () => {
      const span = Math.max(1, maxScroll - target - ZONE_PX)
      return SCROLL_CURL * Math.min(1, Math.max(0, (past() - ZONE_PX) / span))
    }
    const clear = () => {
      main.style.transform = ''
      main.style.willChange = ''
      if (stageRef.current) stageRef.current.style.willChange = ''
      setCurl(0)
      busy = false
      pulled = 0
      lift = 0
    }

    /** Lands Contact in view: instant scroll, then the page springs from where it visually was. */
    const goToContact = () => {
      returnTimer = 0
      measure()
      // Never pull the reader down to Contact, and never on touch or reduced motion.
      if (!visual() || window.scrollY < target - 4) { stopSpring?.(); clear(); return }
      busy = true
      const from = window.scrollY - target + lift * MAIN_SHARE
      window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior })
      main.style.willChange = 'transform'
      main.style.transform = `translate3d(0,${-from}px,0)`
      stopSpring = spring(from, RETURN, v => { main.style.transform = `translate3d(0,${-v}px,0)` }, clear)
    }

    /** The corner slaps flat (a flash along the band's edge), and the page starts back a beat later. */
    const release = () => {
      if (!visual() || blocked() || !inReturnZone()) return
      busy = true
      window.clearTimeout(idleTimer)
      flashRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FLASH_MS * 2, easing: 'ease-out' })
      const curl = scrollCurl() + (lift / EXTRA_PULL) * (1 - SCROLL_CURL)
      stopSpring = spring(curl * 100, SNAP, v => setCurl(v / 100), () => setCurl(0))
      returnTimer = window.setTimeout(goToContact, RETURN_DELAY_MS)
    }
    const armIdle = () => {
      window.clearTimeout(idleTimer)
      if (!visual()) return
      if (inReturnZone() && !blocked()) idleTimer = window.setTimeout(release, IDLE_RETURN_MS)
    }
    /** The reader is heading back up: drop any pending return and any curl still in flight. */
    const cancelReturn = () => {
      window.clearTimeout(idleTimer)
      if (!returnTimer) return
      window.clearTimeout(returnTimer)
      returnTimer = 0
      stopSpring?.()
      clear()
    }

    const onScroll = () => {
      const y = window.scrollY
      const goingUp = y < lastY
      lastY = y
      if (goingUp) cancelReturn()
      if (busy) return
      // Far above Contact nothing can curl or arm: skip the per-event style writes and DOM queries.
      if (y < target - window.innerHeight && !lift) { setCurl(0); return }
      if (visual() && !programmatic && !lastInputKey) setCurl(scrollCurl() + (lift / EXTRA_PULL) * (1 - SCROLL_CURL))
      if (!atEnd() && lift) { lift = 0; pulled = 0; main.style.transform = '' }
      if (!goingUp) armIdle()
    }

    const onWheel = (e: WheelEvent) => {
      lastInputKey = false
      if (e.deltaY < 0) { cancelReturn(); return }
      if (busy || blocked()) return
      if (atEnd() && e.deltaY > 0 && visual()) {
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
        pulled += e.deltaY * unit
        lift = EXTRA_PULL * (1 - 1 / (1 + (RESIST * pulled) / EXTRA_PULL))
        main.style.willChange = 'transform'
        if (stageRef.current) stageRef.current.style.willChange = 'transform'
        main.style.transform = `translate3d(0,${-lift * MAIN_SHARE}px,0)`
        setCurl(SCROLL_CURL + (lift / EXTRA_PULL) * (1 - SCROLL_CURL))
      }
      armIdle()
    }

    const onPointerish = () => { lastInputKey = false }
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      lastInputKey = true
      window.clearTimeout(idleTimer)
      if (!busy) setCurl(0)
    }
    const onNav = () => {
      programmatic = true
      window.clearTimeout(idleTimer)
      window.clearTimeout(progTimer)
      progTimer = window.setTimeout(() => { programmatic = false }, PROG_MS)
    }
    const onClick = (e: MouseEvent) => { if ((e.target as Element).closest?.('a[href*="#"]')) onNav() }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onPointerish, { passive: true })
    window.addEventListener('pointerdown', onPointerish, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('hashchange', onNav)
    document.addEventListener('click', onClick, true)
    fine.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    return () => {
      ro.disconnect()
      stopSpring?.()
      clear()
      window.clearTimeout(idleTimer)
      window.clearTimeout(returnTimer)
      window.clearTimeout(progTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onPointerish)
      window.removeEventListener('pointerdown', onPointerish)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('hashchange', onNav)
      document.removeEventListener('click', onClick, true)
      fine.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
      root.classList.remove('endpull')
    }
  }, [])

  if (!mounted) return null
  return createPortal(
    <>
      <div ref={stageRef} className="endpull-stage" aria-hidden="true">
        <div className="ep-desk"><span>that&apos;s the last page</span></div>
        <div className="ep-flap" />
      </div>
      <div ref={flashRef} className="endpull-flash" aria-hidden="true" />
    </>,
    document.body,
  )
}
