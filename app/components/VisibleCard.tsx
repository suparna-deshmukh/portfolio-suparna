'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { useVisibleLoop } from '../lib/hooks'

const noop = () => {}

/** A card counts as "in front" once it reaches the top half of the viewport. */
const FRONT_LINE = '0px 0px -50% 0px'

/**
 * Marks the enclosing section with data-current = the tint of the last card (in DOM order) that has reached
 * the top half of the viewport. In the sticky stack that is the card in front, so the band can take its tint.
 * When no card is on the line (section above or below the viewport) the last value is kept.
 */
function useFrontTint(ref: RefObject<HTMLElement | null>, tint?: string) {
  useEffect(() => {
    const el = ref.current
    const band = el?.closest<HTMLElement>('section')
    if (!el || !band || !tint) return
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute('data-on-line', entry.isIntersecting)
      const onLine = band.querySelectorAll<HTMLElement>('[data-tint][data-on-line]')
      const front = onLine[onLine.length - 1]?.dataset.tint
      if (front && band.dataset.current !== front) band.dataset.current = front
    }, { rootMargin: FRONT_LINE })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, tint])
}

interface Props { id?: string; className: string; style?: CSSProperties; tint?: string; children: ReactNode }

/**
 * An <article> that gets .paused while off screen, so its CSS loops stop when nobody can see them.
 * With a tint, it also tells its section which card is in front (see useFrontTint).
 */
export default function VisibleCard({ id, className, style, tint, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  useVisibleLoop(ref, noop, noop)
  useFrontTint(ref, tint)
  return <article ref={ref} id={id} className={className} style={style} data-tint={tint}>{children}</article>
}
