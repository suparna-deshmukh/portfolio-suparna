import { ImageResponse } from 'next/og'
import { OG_PALETTE as OG, ogFonts } from './lib/og-fonts'

// Site card: the letterhead — name plate, the proof rows, a pressed seal. 1200×630.
export const alt = 'Suparna Deshmukh — AI Product Manager portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const rows = [
  ['Associate Product Manager Intern', 'RISA Labs · Bengaluru'],
  ['Placement Coordinator', 'BITS Pilani, Goa · 2026 batch'],
  ['Electronics & Communication + Finance', 'BITS Pilani, Goa · Class of 2027'],
]

export default function OgImage() {
  return new ImageResponse(
    (
      // every div with element children needs an explicit display in this satori build
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: OG.paper, padding: '64px 84px 56px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, background: OG.orange }} />
          <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 22, letterSpacing: '0.18em', color: OG.dim }}>PORTFOLIO — 2026</span>
        </div>
        <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 22, letterSpacing: '0.18em', color: OG.dim }}>BENGALURU · IST</span>
      </div>
        <div style={{ height: 2, background: OG.ink, opacity: 0.14, marginTop: 22 }} />
        <div style={{ marginTop: 46, display: 'flex' }}>
          <span style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 112, lineHeight: 1, letterSpacing: '-0.02em', color: OG.ink }}>Suparna Deshmukh</span>
        </div>
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 600, fontSize: 34, color: OG.pineInk }}>AI Product Manager</span>
        <div style={{ flex: 1, height: 1, background: OG.line }} />
      </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingRight: 60 }}>
            {rows.map(([lead, tail]) => (
              <div key={lead} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 10, height: 10, background: OG.pine, opacity: 0.85 }} />
                <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 29, color: OG.ink }}>{lead}</span>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 29, color: OG.dim }}>— {tail}</span>
              </div>
            ))}
          </div>
          <div style={{ width: 170, height: 170, borderRadius: '50%', border: `5px solid ${OG.pine}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)', opacity: 0.92 }}>
            <div style={{ width: 142, height: 142, borderRadius: '50%', border: `2px solid ${OG.pine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 600, fontSize: 64, color: OG.pineInk }}>SD</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts(), headers: { 'Cache-Control': 'public, max-age=3600' } }
  )
}
