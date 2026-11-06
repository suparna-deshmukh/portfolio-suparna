'use client'

import { useId, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Accessible expand/collapse (sections brief X-4). The body always stays in the DOM —
 * it is collapsed with grid rows, so no-JS and crawlers see everything (SSR renders
 * expanded; JS collapses after mount unless the session said open). State persists in
 * sessionStorage per instance. Height animates with grid-template-rows; Motion Off kills
 * the transition via the global motion-off CSS.
 */
export default function Disclosure({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const id = useId()
  const bodyId = useId()
  const keyRef = useRef(`sd-disc:${id}`)
  const [open, setOpen] = useState(true)
  useEffect(() => {
    try { setOpen(sessionStorage.getItem(keyRef.current) !== '0') } catch { /* storage blocked */ }
  }, [keyRef])
  const toggle = () => {
    setOpen(o => {
      try { sessionStorage.setItem(keyRef.current, o ? '0' : '1') } catch { /* storage blocked */ }
      return !o
    })
  }
  return (
    <div className={className ? `disc ${className}` : 'disc'} data-open={open ? '1' : '0'}>
      <button type="button" className="disc-btn" aria-expanded={open} aria-controls={bodyId} onClick={toggle}>
        <span>{label}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className="disc-body" id={bodyId}>
        <div className="disc-inner">{children}</div>
      </div>
    </div>
  )
}
