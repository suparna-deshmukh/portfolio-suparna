import type { Metadata } from 'next'
import '../resume.css'
import { RESUME, type Entry } from '../lib/resume'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Suparna Deshmukh — resume, one A4 page.',
}

/** `**bold**` markers in the resume copy become <strong>. */
function rich(text: string) {
  return text.split(/\*\*/).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))
}

function EntryBlock({ e }: { e: Entry }) {
  return (
    <div className="r-entry">
      <div className="r-ehd">
        <b>{e.name}</b>
        <span>{e.role}</span>
        {e.place && <i>{e.place}</i>}
        <em>{e.when}</em>
      </div>
      <ul>
        {e.bullets.map(b => <li key={b}>{rich(b)}</li>)}
      </ul>
    </div>
  )
}

export default function ResumePage() {
  const r = RESUME
  return (
    <div className="rpage" id="content">
      <div className="r-sheet">
        <header className="r-hd">
          <h1>{r.name}</h1>
          <p className="r-stand">{r.standfirst}</p>
          <p className="r-contact">{r.contact.join('   ·   ')}</p>
        </header>

        <section className="r-sec">
          <h2>Education</h2>
          <div className="r-ehd">
            <b>{r.education.school}</b>
            <em>{r.education.when}</em>
          </div>
          {r.education.lines.map(l => <p className="r-edu" key={l}>{l}</p>)}
        </section>

        <section className="r-sec">
          <h2>Work Experience</h2>
          {r.experience.map(e => <EntryBlock key={e.name} e={e} />)}
        </section>

        <section className="r-sec">
          <h2>Personal Projects</h2>
          {r.projects.map(e => <EntryBlock key={e.name} e={e} />)}
        </section>

        <section className="r-sec">
          <h2>Corporate Projects</h2>
          {r.corporate.map(e => <EntryBlock key={e.name} e={e} />)}
        </section>

        <section className="r-sec">
          <h2>Positions of Responsibility</h2>
          {r.positions.map(e => <EntryBlock key={e.name} e={e} />)}
        </section>

        <section className="r-sec">
          <h2>Achievements</h2>
          <ul className="r-plain">
            {r.achievements.map(a => <li key={a}>{rich(a)}</li>)}
          </ul>
        </section>

        <section className="r-sec r-skills">
          <h2>Skills</h2>
          {r.skills.map(s => <p key={s}>{rich(s)}</p>)}
        </section>
      </div>
      <p className="r-print-hint">Print or save as PDF — it fits exactly one A4 page.</p>
    </div>
  )
}
