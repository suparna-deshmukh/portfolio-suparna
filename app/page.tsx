import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Corporate from './components/CorporateFiles'
import DataLedger from './components/DataLedger'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PageMotion from './components/PageMotion'
import EndPull from './components/EndPull'

// Proof first: shipped work and work history before the person. Each section is its own sheet.
export default function Home() {
  return (
    <main id="content" className="bands">
      <Hero />
      <Experience />
      <Projects />
      <Corporate />
      <DataLedger />
      <About />
      <Contact footer={<Footer />} />
      <PageMotion />
      <EndPull />
    </main>
  )
}
