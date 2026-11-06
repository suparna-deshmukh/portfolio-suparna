'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_SECTIONS } from '../lib/site'
import { SECTION_EVENT } from '../lib/hooks'
import '../topnav.css'

const SMALL_PX = 640
const SHORT_PX = 500 // phones in landscape: auto-hide the bottom bar too

/** One line icon per section, drawn from the site's own objects: a shipped box, the ring binder, a pen nib, the ID badge, a paper plane. */
const ICONS: Record<string, React.ReactNode> = {
  projects: <><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /><path d="m7.8 5.3 8.5 4.5" /></>,
  corporate: <><path d="M3.5 7.5 6 4h4.5L12 7.5h8.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19z" /><path d="M3.5 12h17M9.5 15.5h5" /></>,
  data: <><ellipse cx="12" cy="5.5" rx="8.5" ry="3" /><path d="M3.5 5.5v13c0 1.7 3.8 3 8.5 3s8.5-1.3 8.5-3v-13M3.5 12c0 1.7 3.8 3 8.5 3s8.5-1.3 8.5-3" /></>,
  experience: <><rect x="5" y="3" width="15" height="18" rx="1.5" /><path d="M3 7.5h4M3 12h4M3 16.5h4M10 8h7M10 12h7M10 16h4" /></>,
  about: <><rect x="3.5" y="5" width="17" height="14" rx="2" /><circle cx="9" cy="11" r="2.2" /><path d="M5.8 16.2c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h3.5M14.5 13.5h2.5M10 3v3M14 3v3" /></>,
  contact: <><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3z" /><path d="m10 13 4.5-4.5" /></>,
}
const STAY_AFTER_CHANGE_MS = 1200

export default function FloatNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const navRef = useRef<HTMLElement>(null)
  const indRef = useRef<HTMLSpanElement>(null)
  const progRef = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [active, setActive] = useState<number>(-1)
  const [hidden, setHidden] = useState(false)
  const activeRef = useRef(-1)
  const stayUntil = useRef(0)

  // The pill is a fixed-width element moved and scaled with transform only, so it never reflows.
  const moveIndicator = useCallback((i: number) => {
    const nav = navRef.current, ind = indRef.current, link = linkRefs.current[i]
    if (!nav || !ind) return
    if (i < 0 || !link) { ind.style.opacity = '0'; return }
    const nr = nav.getBoundingClientRect(), r = link.getBoundingClientRect()
    const base = ind.offsetWidth || 100
    ind.style.opacity = '1'
    // .ind is positioned inside the nav's 1px border, hence the -1
    ind.style.transform = `translateX(${r.left - nr.left - 1}px) scaleX(${r.width / base})`
  }, [])

  useEffect(() => { moveIndicator(active) }, [active, moveIndicator])

  // Active section comes from the shared arrival observer (lib/hooks useSectionArrival).
  useEffect(() => {
    if (!isHome) { setActive(-1); activeRef.current = -1; return }
    const onSection = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const i = NAV_SECTIONS.findIndex(s => s.id === id)
      if (i !== activeRef.current) {
        activeRef.current = i
        setActive(i)
        stayUntil.current = performance.now() + STAY_AFTER_CHANGE_MS
        setHidden(false)
      }
    }
    window.addEventListener(SECTION_EVENT, onSection)
    return () => window.removeEventListener(SECTION_EVENT, onSection)
  }, [isHome])

  // One rAF-throttled scroll listener: progress through the active section + hide on scroll down (phones), on every route.
  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const i = activeRef.current
      const sec = i >= 0 ? document.getElementById(NAV_SECTIONS[i].id) : null
      if (sec && progRef.current) {
        const top = sec.offsetTop, h = sec.offsetHeight - window.innerHeight
        const p = h > 0 ? Math.min(1, Math.max(0, (y - top) / h)) : 1
        progRef.current.style.transform = `scaleX(${p})`
      }
      const small = window.innerWidth < SMALL_PX || window.innerHeight < SHORT_PX
      const nearBottom = y > document.body.scrollHeight - window.innerHeight - 80
      const pinned = performance.now() < stayUntil.current
      if (small && !pinned && y > lastY + 6 && y > 120 && !nearBottom) setHidden(true)
      else if (y < lastY - 6 || !small) setHidden(false)
      lastY = y
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => { moveIndicator(activeRef.current); onScroll() }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [pathname, moveIndicator])

  return (
    <nav ref={navRef} className={`fnav${hidden ? ' hidden' : ''}`} aria-label="Sections">
      <span ref={indRef} className="ind" aria-hidden="true"><span className="pillbg" /><span ref={progRef} className="prog" /></span>
      {NAV_SECTIONS.map(({ id, label }, i) => (
        <Link
          key={id}
          href={`/#${id}`}
          ref={el => { linkRefs.current[i] = el }}
          className={active === i ? 'on' : undefined}
          aria-current={active === i ? 'true' : undefined}
        >
          <svg className="nic" viewBox="0 0 24 24" aria-hidden="true">{ICONS[id]}</svg>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
