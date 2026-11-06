import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ReadingProgress from './ReadingProgress'
import Toc from './Toc'
import Footer from './Footer'
import MarkOnRead from './MarkOnRead'
import EndDesk from './EndDesk'
import ViewTransitionLink from './ViewTransitionLink'
import { annotatedParagraph, NOTE_ARROW } from './annotate'
import Image from 'next/image'
import type { Annotated } from '../lib/content'
import { LEAD_NOTES, sectionOf, sections, slugify, type PileItem } from '../lib/posts'

const TOC_MIN_HEADINGS = 4
/** Intrinsic sizes of the cover files in public/, so the figure reserves its height before the image loads. */
const COVER_SIZE: Record<string, [number, number]> = {
  '/images/projects/askcart-cover.webp': [1200, 690],
  '/images/projects/research-agent-cover.webp': [480, 288],
  '/images/blog/null-results-cover.webp': [1200, 675],
}

interface ArticleProps {
  kind: 'Case study' | 'Blog'
  slug: string
  backHref: string
  backLabel: string
  title: string
  subtitle: string
  meta: React.ReactNode
  minutes: number
  cover?: string | null
  body: string
  annot: Annotated
  reply: string
  pile: PileItem[]
}

const headingText = (children: React.ReactNode): string =>
  Array.isArray(children) ? children.map(headingText).join('') : typeof children === 'string' || typeof children === 'number' ? String(children) : ''

/**
 * Essays and case studies as one annotated manuscript: header and body on a single paper on the desk,
 * margin notes beside the lines they quote, a section rail, and an ending that stays on the desk.
 * Paper, title, rail bars and notes carry the view-transition names the home sheet and pile pages use.
 */
export default function Article({ kind, slug, backHref, backLabel, title, subtitle, meta, minutes, cover, body, annot, reply, pile }: ArticleProps) {
  const toc = sections(body)
  const hasToc = toc.length >= TOC_MIN_HEADINGS
  const isCase = kind === 'Case study'
  const quote = annot.pull_quote
  const [before, after] = quote?.mark ? quote.text.split(quote.mark) : [quote?.text ?? '', '']
  const [coverW, coverH] = (cover && COVER_SIZE[cover]) || []

  return (
    <main id="content" className={`ms${hasToc ? ' has-rail' : ''}`}>
      <ReadingProgress minutes={minutes} />
      <MarkOnRead />
      <div className="ms-desk">
        {hasToc && <Toc items={toc} slug={slug} minutes={minutes} />}
        <article className="paper" style={{ viewTransitionName: `post-paper-${slug}` }}>
          <header className="ms-hd">
            <div className="top">
              <p className="backs">
                <ViewTransitionLink className="back" href={backHref}>← {backLabel}</ViewTransitionLink>
                {!isCase && <ViewTransitionLink className="back" href="/writing">All blogs</ViewTransitionLink>}
              </p>
              <p className="kind"><b>{kind}</b>{meta}<span>{minutes} min read</span></p>
              <h1 style={{ viewTransitionName: `${isCase ? 'case' : 'post'}-title-${slug}` }}>{title}</h1>
              {subtitle && <p className="sub">{subtitle}</p>}
            </div>
            {cover && (
              <figure className="fig" style={isCase ? { viewTransitionName: `case-media-${slug}` } : undefined}>
                <Image src={cover} alt="" width={coverW} height={coverH} sizes="(max-width: 900px) 100vw, 900px" style={{ width: '100%', height: 'auto' }} />
              </figure>
            )}
            {(quote || annot.notes?.length) && (
              <aside className="hnotes" aria-label="Margin notes" style={{ viewTransitionName: `post-notes-${slug}` }}>
                {quote && (
                  <div className="hn">
                    {NOTE_ARROW}<b>Pull quote</b>
                    <p>{before}{quote.mark && <mark>{quote.mark}</mark>}{after}</p>
                  </div>
                )}
                {annot.notes?.slice(0, LEAD_NOTES).map(n => {
                  const at = sectionOf(body, n.line)
                  return (
                    <div key={n.label} className="hn">
                      {NOTE_ARROW}<b>{n.label}</b>
                      <p>{n.line}</p>
                      {at && <a href={`#${at.id}`}>Read it in {at.label} ↓</a>}
                    </div>
                  )
                })}
              </aside>
            )}
          </header>
          <div className="ms-body">
            <div className="prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: annotatedParagraph(body, annot),
                  h2: ({ children }) => <h2 id={slugify(headingText(children))}>{children}</h2>,
                  table: ({ children }) => <div className="tw" tabIndex={0} role="region" aria-label="Table, scrolls sideways"><table>{children}</table></div>,
                  img: ({ src, alt }) => <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} loading="lazy" />,
                  a: ({ href, children }) => <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{children}</a>,
                }}
              >
                {body}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
      <EndDesk heading={reply} title={title} quote={quote?.text ?? subtitle} pile={pile} />
      <Footer />
    </main>
  )
}
