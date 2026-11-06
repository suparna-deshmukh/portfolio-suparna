import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// 180×180 apple touch icon: the ink plate with the SD monogram.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const fonts = [
    { name: 'Fraunces', data: readFileSync(path.join(process.cwd(), 'app/fonts/fraunces/Fraunces-Latin-600.ttf')), weight: 600 as const },
  ]
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#15211A' }}>
        <div style={{ display: 'flex' }}>
          <span style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 76, lineHeight: 1, color: '#F1F4EF', letterSpacing: '-0.02em' }}>SD</span>
        </div>
        <div style={{ display: 'flex', marginTop: 10 }}>
          <div style={{ width: 12, height: 12, background: '#FF8533' }} />
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
