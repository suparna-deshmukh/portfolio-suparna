import ReplyCard from './ReplyCard'
import PilePage from './PilePage'
import type { PileItem } from '../lib/posts'

interface EndDeskProps { heading: string; title: string; quote: string; pile: PileItem[] }

/** Where an article ends: back on the desk, with a reply card on the left and what to read next on the right. */
export default function EndDesk({ heading, title, quote, pile }: EndDeskProps) {
  const count = pile.length
  return (
    <div className="enddesk an">
      <ReplyCard heading={heading} title={title} quote={quote} />
      {count > 0 && (
        <aside className="rail" aria-label="Next on the desk">
          <p className="rl"><span>Next on the desk</span><i>{count} {count === 1 ? 'page' : 'pages'}</i></p>
          <div className="pile" style={{ ['--n' as string]: pile.length }}>{pile.map((p, i) => <PilePage key={p.slug} item={p} index={i} />)}</div>
        </aside>
      )}
    </div>
  )
}
