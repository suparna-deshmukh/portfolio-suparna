import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <main id="content" className="nfbox">
      <span className="nf-stamp" aria-hidden="true">Return to Sender</span>
      <h1>4<em>0</em>4</h1>
      <p>This route never shipped.</p>
      <div className="acts">
        <Link className="btn" href="/#projects">See what shipped →</Link>
        <Link className="btn ghost" href="/">Back home</Link>
      </div>
    </main>
  )
}
