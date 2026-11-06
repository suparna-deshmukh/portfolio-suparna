import type { MetadataRoute } from 'next'
import { getCaseStudies } from './lib/posts'
import { SITE_URL } from './lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = getCaseStudies().map(p => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.created_at),
  }))
  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/resume`, lastModified: new Date() },
    ...caseStudies,
  ]
}
