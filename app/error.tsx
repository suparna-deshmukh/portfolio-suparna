'use client'

import Link from 'next/link'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="content" className="nfbox">
      <span className="nf-stamp" aria-hidden="true">Void</span>
      <h1>5<em>0</em>0</h1>
      <p>The sheet tore itself. {process.env.NODE_ENV !== 'production' && error.digest ? <code>({error.digest})</code> : null}</p>
      <div className="acts">
        <button className="btn" type="button" onClick={reset}>Try again</button>
        <Link className="btn ghost" href="/">Back home</Link>
      </div>
    </main>
  )
}
