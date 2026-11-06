// Font buffers for next/og (Satori). Local files only — no network at image-render time.
import { readFileSync } from 'node:fs'
import path from 'node:path'

const FONTS = path.join(process.cwd(), 'app', 'fonts')

let cache: Record<string, Buffer> | null = null
export function ogFont(name: string): Buffer {
  cache ??= {
    // TTF, not woff2 — this Next build's bundled fontkit rejects the wOF2 signature.
    // Static 600 instances of the Fraunces variable font (fontkit here also chokes on fvar).
    'fraunces': readFileSync(path.join(FONTS, 'fraunces', 'Fraunces-Latin-600.ttf')),
    'fraunces-italic': readFileSync(path.join(FONTS, 'fraunces', 'Fraunces-Latin-600-Italic.ttf')),
    'satoshi-400': readFileSync(path.join(FONTS, 'fontshare', 'Satoshi-400.ttf')),
    'satoshi-500': readFileSync(path.join(FONTS, 'fontshare', 'Satoshi-500.ttf')),
    'satoshi-700': readFileSync(path.join(FONTS, 'fontshare', 'Satoshi-700.ttf')),
  }
  return cache[name]
}

export const ogFonts = () => [
  { name: 'Fraunces', data: ogFont('fraunces'), weight: 600 as const, style: 'normal' as const },
  { name: 'Fraunces', data: ogFont('fraunces-italic'), weight: 600 as const, style: 'italic' as const },
  { name: 'Satoshi', data: ogFont('satoshi-400'), weight: 400 as const, style: 'normal' as const },
  { name: 'Satoshi', data: ogFont('satoshi-500'), weight: 500 as const, style: 'normal' as const },
  { name: 'Satoshi', data: ogFont('satoshi-700'), weight: 700 as const, style: 'normal' as const },
]

// Stationery palette (matches globals.css light theme — OG images render theme-agnostic)
export const OG_PALETTE = {
  paper: '#F1F4EF',
  surf: '#FAFCF8',
  ink: '#15211A',
  dim: 'rgba(21,33,26,0.68)',
  line: '#C7D4C6',
  pine: '#177E5B',
  pineInk: '#146248',
  blue: '#46708F',
  orange: '#FF8533',
  night: '#100D0A',
  nightFg: '#F4EFE7',
}
