import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { DM_Mono, Fraunces } from 'next/font/google'
import './tailwind.css'
import './globals.css'
import Header from './components/Header'
import FloatNav from './components/FloatNav'
import P99Panel from './components/P99Panel'
import { ViewTransitionResolver } from './components/ViewTransitionLink'

const clash = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-clash',
  display: 'swap',
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Suparna Deshmukh · AI Product Manager',
  description: 'Associate Product Manager at RISA Labs. Case studies on AI search, agentic research and GTM, data ledgers, and product work across five industries.',
  openGraph: {
    title: 'Suparna Deshmukh · AI Product Manager',
    description: 'Associate Product Manager at RISA Labs. Case studies on AI search, agentic research and GTM, data ledgers, and product work across five industries.',
    type: 'website',
  },
}

// Sets the theme before first paint (light by default) so there is no flash, and adds motion-ok
// only when JS runs and motion is allowed, so every motion pre-state is opt-in.
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'light'}catch(e){}try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${clash.variable} ${satoshi.variable} ${dmMono.variable}`}>
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
