'use client'

import { useRef, type CSSProperties } from 'react'
import { useInViewOnce } from '../lib/hooks'

interface Stroke {
  d: string
  /** start delay and duration in seconds, plus an easing that sets the pen's speed curve */
  at: number
  dur: number
  ease: string
  dot?: boolean
}

// Hand-drawn cursive "Suparna", written upright on a 390x116 grid and slanted by the group transform.
// Order and timing follow a real hand: S, pen run through "uparna", then the underline flick.
const STROKES: Stroke[] = [
  { d: 'M44 30 C48 18 62 12 72 18 C82 24 70 36 58 44 C46 52 44 64 56 68 C68 72 80 62 84 52', at: 0, dur: 0.5, ease: 'cubic-bezier(.55,.1,.45,.95)' },
  { d: 'M86 40 C88 54 90 68 94 74 C98 79 104 74 106 64 C108 55 108 47 108 42 C110 54 112 66 118 69 C124 72 128 62 129 52 C130 64 130 82 127 94 C125 103 120 108 114 108 C122 100 126 90 128 80 C134 84 140 80 142 70 C144 60 142 50 140 44 C144 54 146 66 152 69 C158 72 162 64 163 55', at: 0.58, dur: 0.95, ease: 'cubic-bezier(.4,.15,.6,.9)' },
  { d: 'M166 52 C164 62 162 70 166 75 C170 79 176 74 178 66 C179 60 178 53 176 49 C180 58 182 70 188 73 C194 76 198 67 199 59 C201 52 205 45 211 43 C209 52 209 61 211 69 C213 75 218 75 220 69', at: 1.56, dur: 0.55, ease: 'cubic-bezier(.5,0,.35,1)' },
  { d: 'M224 42 C226 56 228 68 232 74 C236 79 242 73 244 64 C246 56 246 49 246 44 C248 56 250 68 256 71 C262 74 266 65 267 56 C265 64 263 71 261 75 C265 79 271 74 273 66 C274 60 273 52 271 47 C275 57 277 69 283 72 C289 75 293 67 294 59', at: 2.14, dur: 0.8, ease: 'cubic-bezier(.45,.1,.4,1)' },
  { d: 'M302 52 C300 62 298 70 302 75 C306 79 312 74 314 66 C315 60 314 53 312 49 C316 58 318 70 324 73 C330 76 334 67 335 59', at: 2.98, dur: 0.4, ease: 'cubic-bezier(.5,0,.35,1)' },
  { d: 'M30 102 C110 92 220 88 320 92 C348 93 362 95 370 88', at: 3.44, dur: 0.46, ease: 'cubic-bezier(.6,0,.2,1)' },
]

/** "Suparna" in jade, signed stroke by stroke the first time it scrolls into view. Static when motion is reduced. */
export default function Signature() {
  const ref = useRef<SVGSVGElement>(null)
  const seen = useInViewOnce(ref, 0.6)
  return (
    <svg ref={ref} className={`sig${seen ? ' on' : ''}`} viewBox="0 0 390 116" role="img" aria-label="Signed, Suparna">
      <g transform="translate(20 0) skewX(-12)">
        {STROKES.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            aria-hidden="true"
            className={s.dot ? 'dot' : undefined}
            style={{ '--at': `${s.at}s`, '--dur': `${s.dur}s`, '--pen': s.ease } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  )
}
