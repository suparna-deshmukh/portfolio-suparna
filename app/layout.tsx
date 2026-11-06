import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { DM_Mono } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import FloatNav from './components/FloatNav'
import P99Panel from './components/P99Panel'
import { ViewTransitionResolver } from './components/ViewTransitionLink'
import { SITE_URL } from './lib/site'

// Display face is self-hosted (no build-time network dependency). No italic face is used
// anywhere, so only the normal variable axis is shipped (P1-8).
const display = localFont({
  src: [
    { path: './fonts/fraunces/Fraunces-Latin-Variable-Normal.woff2', weight: '100 900' },
  ],
  variable: '--font-display-var',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

const satoshi = localFont({
  src: [
    { path: './fonts/fontshare/Satoshi-400.woff2', weight: '400' },
    { path: './fonts/fontshare/Satoshi-500.woff2', weight: '500' },
    { path: './fonts/fontshare/Satoshi-700.woff2', weight: '600 700' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })

const SITE_DESCRIPTION = 'Associate Product Manager at RISA Labs. Case studies on AI search, agentic research and GTM, data ledgers, and product work across five industries.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Suparna Deshmukh · AI Product Manager', template: '%s · Suparna Deshmukh' },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Suparna Deshmukh · AI Product Manager',
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: 'Suparna Deshmukh · Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suparna Deshmukh · AI Product Manager',
    description: SITE_DESCRIPTION,
  },
  icons: { icon: '/icon.svg', apple: '/apple-icon' },
  appleWebApp: { capable: true, title: 'Suparna Deshmukh' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1F4EF' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1512' },
  ],
}

// Pre-paint: resolves the stored preference (default: system) before first paint so there is never
// a flash, sets color-scheme, and marks motion-off. motion-ok is added only when JS runs and motion
// is allowed, so every motion pre-state stays opt-in (P1-9, P1-5).
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t;if(localStorage.getItem('motion')==='off'){d.classList.add('motion-off');return}if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-ok')}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${display.variable} ${satoshi.variable} ${dmMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#content">Skip to content</a>
        <Header />
        <FloatNav />
        {children}
        <P99Panel />
        <ViewTransitionResolver />
      </body>
    </html>
  )
}
