'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RESUME_URL, link } from '../lib/site'
import { DEFAULT_THEME, NEXT_THEME, THEME_COLORS, resolveTheme, type ThemePref } from '../lib/site'
import { istTime } from '../lib/hooks'

type Resolved = 'light' | 'dark'
const SYSTEM = (
  <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" /></>
)
const SUN = (
  <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>
)
const MOON = <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
const DL = (
  <><path d="M12 3v11m0 0 4-4m-4 4-4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>
)

export default function Header() {
  const isHome = usePathname() === '/'
  const [time, setTime] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [pref, setPref] = useState<ThemePref>(DEFAULT_THEME)
  const [resolved, setResolved] = useState<Resolved>('light')
  const prefRef = useRef<ThemePref>(DEFAULT_THEME)
  const sentinelRef = useRef<HTMLSpanElement>(null)

  const applyTheme = (r: Resolved) => {
    const d = document.documentElement
    d.dataset.theme = r
    d.style.colorScheme = r
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.setAttribute('content', (meta.getAttribute('media') ?? '').includes('dark') ? THEME_COLORS.dark : THEME_COLORS.light)
    })
  }

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem('theme') } catch { /* storage blocked */ }
    const initial: ThemePref = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : DEFAULT_THEME
    prefRef.current = initial
    setPref(initial)
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)')
    const initialResolved = resolveTheme(initial, sysDark.matches)
    setResolved(initialResolved)
    applyTheme(initialResolved)
    const onSystem = (e: MediaQueryListEvent) => {
      if (prefRef.current === 'system') {
        const next = resolveTheme('system', e.matches)
        setResolved(next)
        applyTheme(next)
      }
    }
    sysDark.addEventListener('change', onSystem)
    const tick = () => setTime(istTime())
    tick()
    const id = setInterval(tick, 30_000)
    // A sentinel 80px down the page: no scroll listener, so no forced layout on every scroll event.
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    if (sentinelRef.current) io.observe(sentinelRef.current)
    return () => { clearInterval(id); io.disconnect(); sysDark.removeEventListener('change', onSystem) }
  }, [])

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: ThemePref = NEXT_THEME[pref]
    const nextResolved: Resolved = resolveTheme(next, window.matchMedia('(prefers-color-scheme: dark)').matches)
    const apply = () => {
      try { localStorage.setItem('theme', next) } catch { /* storage blocked */ }
      prefRef.current = next
      setPref(next)
      setResolved(nextResolved)
      applyTheme(nextResolved)
      window.dispatchEvent(new Event('themechange'))
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    if (!doc.startViewTransition || reduced) { apply(); return }
    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    doc.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <>
      <span ref={sentinelRef} className="hdr-sentinel" aria-hidden="true" />
      <header className={`hdr${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="home" aria-label="Suparna Deshmukh, home">
          <span className="full">Suparna Deshmukh</span><span className="ini">SD</span>
        </Link>
        <div className="right">
          <span className="pill loc" aria-label="Bengaluru, local time">
            <span className="city">Bengaluru</span><i />
            <span className="num clock" suppressHydrationWarning>{time || '--:--'}</span><i />
            <span>IST</span>
          </span>
          {link(RESUME_URL) && (
            <a className="res" href={RESUME_URL}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{DL}</svg>
              Resume
            </a>
          )}
          <a className="talk" href={isHome ? '#contact' : '/#contact'}>Let&apos;s talk</a>
          <button className="themebtn" type="button" onClick={toggleTheme}
            aria-label={`Theme: ${pref === 'system' ? 'system (follows device)' : pref}. Switch to ${NEXT_THEME[pref] === 'system' ? 'system (follows device)' : NEXT_THEME[pref]}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{pref === 'system' ? SYSTEM : resolved === 'dark' ? MOON : SUN}</svg>
          </button>
        </div>
      </header>
    </>
  )
}
