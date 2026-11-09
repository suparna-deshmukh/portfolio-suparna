import { PROJECTS } from '../lib/content'
import SectionHeader from './SectionHeader'
import CountUp from './CountUp'
import MetricTip from './MetricTip'
import { m } from '../lib/metrics'
import { link } from '../lib/site'
import { LazyAskCartReport, LazyResearchBoard } from './lazy'
import InsightShots from './InsightShots'
import ViewTransitionLink from './ViewTransitionLink'
import VisibleCard from './VisibleCard'
import { SortingDots } from './ProjectSignatures'

const liveHost = (url?: string | null) => (url ? url.replace(/^https?:\/\//, '') : '')

interface Stat { id?: string; value: string; label: string; hot?: boolean }

interface CaseProps {
  variant: 'tm' | 'fl' | 'vx'
  id: string
  index: number
  slug: string
  title: string
  summary: string
  liveUrl?: string | null
  links?: { label: string; href: string }[]
  stack: string
  tag?: string
  statsLabel?: string
  stats: Stat[]
  media: React.ReactNode
  signature?: React.ReactNode
}

function Case({ variant, id, index, slug, title, summary, liveUrl, links, stack, tag, statsLabel, stats, media, signature }: CaseProps) {
  const [name, sub] = title.split(': ')
  const href = `/projects/${slug}`
  return (
    <VisibleCard id={id} className={`case case-${variant}`} tint={variant} style={{ ['--ci' as string]: index }}>
      {signature}
      {variant === 'tm' && <span className="tm-field" aria-hidden="true"><i className="h" /><i className="d" /></span>}
      <div className="copy">
        <h3 style={{ viewTransitionName: `case-title-${slug}` }}>
          <ViewTransitionLink href={href}>{name}</ViewTransitionLink>
          {tag && <span className="tag">{tag}</span>}
          <small>{sub}</small>
        </h3>
        {statsLabel && <p className="lab stats-lab">{statsLabel}</p>}
        <div className="stats">
          {stats.map(s => (
            <div key={s.label}>
              {s.id
                ? <MetricTip id={s.id}><CountUp text={s.value} className={s.hot ? 'hot' : undefined} /></MetricTip>
                : <CountUp text={s.value} className={s.hot ? 'hot' : undefined} />}
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <p>{summary}</p>
        <p className="stack-ln">{stack}</p>
        <div className="ft">
          <ViewTransitionLink href={href} className="btn">Read the case study →</ViewTransitionLink>
          {liveUrl && <a href={liveUrl} target="_blank" rel="noopener noreferrer">{liveHost(liveUrl)} ↗</a>}
          {(links ?? []).filter(l => link(l.href)).map(l => (
            <a key={l.label} className="case-link" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span></a>
          ))}
        </div>
      </div>
      <div className="media" style={{ viewTransitionName: `case-media-${slug}` }}>{media}</div>
      <span className="shade" aria-hidden="true" />
    </VisibleCard>
  )
}

export default function Projects() {
  const askcart = PROJECTS.find(p => p.slug === 'askcart')
  const insight = PROJECTS.find(p => p.slug === 'insight-extractor')
  const research = PROJECTS.find(p => p.slug === 'research-agent')
  const shipped = [askcart, insight, research].filter(Boolean)
  const meta: [string, string] = [`${shipped.length} personal case studies`, 'Review mining, guided search, agentic research']

  return (
    <section className="band" id="projects" data-current="tm">
      <i className="pj-scan" aria-hidden="true" />
      <div className="sec wrap">
        <SectionHeader
          id="projects"
          label="Projects"
          variant="md"
          title="What I've built."
          meta={meta}
          aside={<>
            <b>{meta[0]}</b><span>{meta[1]}</span>
            <span className="pj-pip" aria-hidden="true"><i /><i /><i /></span>
          </>}
        />
        <div className="pj stack">
          {askcart && (
            <Case
              variant="tm"
              id="projects-askcart"
              index={0}
              slug={askcart.slug}
              title={askcart.title}
              summary="E-commerce search fails silently: when the catalog returns nothing, the shopper leaves. AskCart asks one narrow question instead — and the dead end becomes a conversation."
              liveUrl={askcart.live_url}
              links={askcart.links}
              stack="Next.js · SQL · Python · ML · Gemini API"
              statsLabel="From the MVP"
              stats={(askcart.stats ?? []).map(s => ({ id: s.id, value: m(s.id).shown, label: s.label, hot: s.hot }))}
              media={<LazyAskCartReport />}
            />
          )}
          {insight && (
            <Case
              variant="fl"
              id="projects-insight"
              index={1}
              slug={insight.slug}
              title={insight.title}
              summary="Reviews are the only dataset that will tell you why a search failed. The extractor mines 94.6K of them from three stores and resolves the noise into four root causes, each with its own treatment."
              liveUrl={insight.live_url}
              links={insight.links}
              stack="Python · SQL · LLM agents · REST APIs"
              statsLabel="One run"
              stats={(insight.stats ?? []).map(st => ({ id: st.id, value: m(st.id).shown, label: st.label, hot: st.hot }))}
              media={<InsightShots />}
            />
          )}
          {research && (
            <Case
              variant="vx"
              id="projects-research"
              index={2}
              slug={research.slug}
              title={research.title}
              summary="Give it a topic: it mines Reddit and Hacker News, clusters the pain points, and hands back a ranked list plus a first draft of the PRD."
              liveUrl={research.live_url}
              links={research.links}
              stack="n8n · Ollama (Llama 3) · Python · REST APIs"
              statsLabel="One run"
              stats={(research.stats ?? []).map(s => ({ id: s.id, value: m(s.id).shown, label: s.label, hot: s.hot }))}
              media={<LazyResearchBoard />}
              signature={<SortingDots />}
            />
          )}
        </div>
      </div>
    </section>
  )
}
