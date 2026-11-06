'use client'

import { useRef, type ComponentType } from 'react'
import { useInViewOnce } from '../lib/hooks'

interface Props {
  /** Component whose chunk is only fetched when the wrapper nears the viewport. */
  comp: ComponentType
  /** How close to the viewport (px) to start loading. Default 600. */
  margin?: number
  className?: string
}

/**
 * IO-gated mount for heavy client figures (P1-7): the dynamic chunk is fetched only
 * when the wrapper is within `margin` of the viewport, so first-load JS and the
 * initial render skip work the user may never see. The wrapper holds no reserved
 * height — figures sit below the fold, so mounting early (600px ahead) means no
 * visible layout shift.
 */
export default function LazyMount({ comp: C, margin = 600, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInViewOnce(ref, 0, `${margin}px`)
  return (
    <div ref={ref} className={className}>
      {seen ? <C /> : null}
    </div>
  )
}
