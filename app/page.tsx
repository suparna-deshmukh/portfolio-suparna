import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Corporate from './components/CorporateFiles'
import DataLedger from './components/DataLedger'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PageMotion from './components/PageMotion'
import { LazyEndPull } from './components/lazy'
import { SITE_URL, SOCIALS, CONTACT_EMAIL } from './lib/site'

// Proof first: shipped work and work history before the person. Each section is its own sheet.
export default function Home() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Suparna Deshmukh',
    jobTitle: 'Associate Product Manager Intern',
    worksFor: { '@type': 'Organization', name: 'RISA Labs' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'BITS Pilani, Goa Campus' },
    url: SITE_URL,
    sameAs: [SOCIALS.linkedin, SOCIALS.github].filter(Boolean),
    ...(CONTACT_EMAIL ? { email: `mailto:${CONTACT_EMAIL}` } : {}),
  }
  return (
    <main id="content" className="bands">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <Experience />
      <Projects />
      <Corporate />
      <DataLedger />
      <About />
      <Contact footer={<Footer />} />
      <PageMotion />
      <LazyEndPull />
    </main>
  )
}
