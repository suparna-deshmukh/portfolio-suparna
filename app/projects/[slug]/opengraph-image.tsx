import { ImageResponse } from 'next/og'
import { getCaseStudies } from '../../lib/posts'
import { m } from '../../lib/metrics'
import { OG_PALETTE as OG, ogFonts } from '../../lib/og-fonts'

// Per-case share card: case wash, title, summary, and the one number worth stamping.
export const alt = 'Case study — Suparna Deshmukh'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CASE_STYLE: Record<string, { wash: string; accent: string }> = {
  askcart: { wash: '#DCEAE0', accent: OG.pine },
  'research-agent': { wash: '#E2EAEF', accent: OG.blue },
}

export default async function OgImage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const project = getCaseStudies().find(p => p.slug === slug)
  if (!project) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', background: OG.paper }} />,
      { ...size, fonts: ogFonts() }
    )
  }
  const style = CASE_STYLE[slug] ?? { wash: OG.paper, accent: OG.pine }
  const [name, subtitle] = project.title.split(': ')
  const hot = project.stats?.find(s => s.hot) ?? project.stats?.[0]
  const hotShown = hot ? m(hot.id).shown : ''
  const index = getCaseStudies().findIndex(p => p.slug === slug)

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: style.wash, padding: '64px 84px 56px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 22, letterSpacing: '0.18em', color: OG.dim }}>CASE STUDY — {String(index + 1).padStart(2, '0')}</span>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 22, letterSpacing: '0.18em', color: OG.dim }}>SUPARNA DESHMUKH</span>
        </div>
        <div style={{ height: 2, background: OG.ink, opacity: 0.14, marginTop: 22 }} />

        <div style={{ marginTop: 44, maxWidth: 760, display: 'flex' }}>
          <span style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 76, lineHeight: 1.04, letterSpacing: '-0.02em', color: OG.ink }}>{name}</span>
        </div>
        <div style={{ marginTop: 18, maxWidth: 760, display: 'flex' }}>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 27, lineHeight: 1.45, color: OG.dim }}>{subtitle ?? project.summary}</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 22, letterSpacing: '0.1em', color: OG.dim }}>{project.tags.join('  ·  ')}</span>
          {/* the one number worth stamping */}
          {hot && (
            <div style={{ border: `4px solid ${style.accent}`, borderRadius: 8, padding: '16px 26px 14px', opacity: 0.95, transform: 'rotate(3deg)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 68, lineHeight: 1, color: style.accent }}>{hotShown}</span>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 17, letterSpacing: '0.06em', color: OG.dim, textTransform: 'uppercase' }}>{hot.label}</span>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts(), headers: { 'Cache-Control': 'public, max-age=3600' } }
  )
}
