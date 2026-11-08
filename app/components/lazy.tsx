'use client'

import dynamic from 'next/dynamic'
import LazyMount from './LazyMount'

/**
 * P1-7: heavy client figures and the p99 panel load as their own chunks, fetched only
 * when their mount point nears the viewport (or immediately, for the always-on panel).
 */
const AskCartReport = dynamic(() => import('./AskCartReport'), { ssr: false })
const ResearchBoard = dynamic(() => import('./ResearchBoard'), { ssr: false })
const InsightFlow = dynamic(() => import('./InsightFlow'), { ssr: false })
const EndPull = dynamic(() => import('./EndPull'), { ssr: false })
const P99Panel = dynamic(() => import('./P99Panel'), { ssr: false })

export const LazyAskCartReport = () => <LazyMount comp={AskCartReport} />
export const LazyResearchBoard = () => <LazyMount comp={ResearchBoard} />
export const LazyInsightFlow = () => <LazyMount comp={InsightFlow} />
export const LazyEndPull = () => <LazyMount comp={EndPull} margin={800} />
export const LazyP99Panel = () => <LazyMount comp={P99Panel} margin={2000} />
