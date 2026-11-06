'use client'

import { useEffect, useState } from 'react'

/**
 * User motion control (P1-5). "Off" behaves exactly like `prefers-reduced-motion: reduce`:
 * the pre-paint script never sets `motion-ok` for a stored 'off', and `html.motion-off`
 * freezes every CSS animation/transition to its finished state (see globals.css).
 * JS-driven loops keep running their timers but each step lands on a finished frame,
 * so nothing visibly moves.
 */

export type MotionPref = 'on' | 'off'
export const MOTION_EVENT = 'motionchange'

export function storedMotion(): MotionPref {
  try { return localStorage.getItem('motion') === 'off' ? 'off' : 'on' } catch { return 'on' }
}

export function isMotionOff(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('motion-off')
}

export function setMotion(pref: MotionPref) {
  try { localStorage.setItem('motion', pref) } catch { /* storage blocked */ }
  const d = document.documentElement
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  d.classList.toggle('motion-off', pref === 'off')
  if (pref === 'off') d.classList.remove('motion-ok')
  else if (!reduced && !d.classList.contains('motion-ok')) d.classList.add('motion-ok')
  window.dispatchEvent(new CustomEvent(MOTION_EVENT, { detail: pref }))
}

/** Shared motion preference for every control (header, footer, future palette). */
export function useMotionPref(): MotionPref {
  const [motion, setMotionPref] = useState<MotionPref>('on')
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount sync of the pre-paint script's state
    setMotionPref(storedMotion())
    const on = () => setMotionPref(storedMotion())
    window.addEventListener(MOTION_EVENT, on)
    return () => window.removeEventListener(MOTION_EVENT, on)
  }, [])
  return motion
}
