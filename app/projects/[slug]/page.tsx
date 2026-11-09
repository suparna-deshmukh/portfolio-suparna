import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Article from '../../components/Article'
import { CASE_SHOTS } from '../../components/caseShots'
import { getCaseStudies as published, getLead, postToPile, projectToPile, readMinutes } from '../../lib/posts'
import { link, SITE_URL } from '../../lib/site'

const MAX_OTHER_CASES = 2

export function generateStaticParams() {
  return published().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = published().find(p => p.slug === slug)
  if (!project) return {}
  const title = `${project.title} · Suparna Deshmukh`
  return {
    title,
    description: project.summary,
    openGraph: { title, description: project.summary, type: 'article', images: project.cover_image_url ? [project.cover_image_url] : undefined },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = published().find(p => p.slug === slug)
  if (!project || !project.body) notFound()
  const [name, subtitle] = project.title.split(': ')
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.summary,
    author: { '@type': 'Person', name: 'Suparna Deshmukh' },
    datePublished: project.created_at,
    mainEntityOfPage: `${SITE_URL}/projects/${project.slug}`,
  }
  // Next on the desk: other case studies newest first, then the lead essay, then the draft.
  const lead = getLead()
  const pile = [
    ...published().filter(p => p.slug !== project.slug).slice(0, MAX_OTHER_CASES).map(projectToPile),
    ...(lead ? [postToPile(lead)] : []),
  ]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Article
      kind="Case study"
      slug={project.slug}
      annot={project}
      reply={`Questions about how ${name} was built?`}
      pile={pile}
      backHref="/#projects"
      backLabel="Projects"
      title={name}
      subtitle={subtitle ?? project.summary}
      minutes={readMinutes(project.body)}
      cover={project.cover_image_url}
      shots={CASE_SHOTS[project.slug]}
      body={project.body}
      meta={
        <>
          <span>{project.tags.join(' · ')}</span>
          {link(project.live_url) && <a href={link(project.live_url)!} target="_blank" rel="noopener noreferrer">{project.live_url!.replace(/^https?:\/\//, '')} ↗</a>}
        </>
      }
    />
    </>
  )
}
