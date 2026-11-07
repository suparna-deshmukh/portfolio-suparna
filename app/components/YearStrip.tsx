import { ACHIEVEMENTS, CORPORATE, EDUCATION, POSITIONS } from '../lib/site'

/**
 * "Four years at a glance" (E-3): a compact 2023→2027 strip built entirely from existing
 * site data — study, consulting and internships, positions, honors. Overlaps are visible on
 * purpose. Every item links to its anchor; items without a real date do not render.
 * Mobile (≤640) the lanes stack into a vertical year list via CSS.
 */

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Sept: 9, Oct: 10, Nov: 11, Dec: 12,
}
const START = EDUCATION.from
const SPAN = EDUCATION.classOf - EDUCATION.from

interface Span { label: string; from: number; to: number; href?: string }

function parseWhen(when: string): Span | null {
  const m = when.match(/([A-Z][a-z]{2}) (\d{4})\s*(?:–|-)\s*(?:([A-Z][a-z]{2}) )?(\d{4}|Present)/)
  if (!m) return null
  const startMonth = MONTHS[m[1]]
  const endMonth = MONTHS[m[3] ?? m[1]] ?? 12
  if (!startMonth) return null
  const from = Number(m[2]) + (startMonth - 1) / 12
  const to = m[4] === 'Present' ? EDUCATION.classOf + 0.5 : Number(m[4]) + (endMonth - 1) / 12
  return { label: '', from, to }
}

function x(year: number): string {
  return `${(((year - START) / SPAN) * 100).toFixed(2)}%`
}
const xw = (from: number, to: number) => `calc(min(${x(Math.min(to, START + SPAN))}, 100%) - ${x(from)})`

/** Short codes so the positions lane reads at a glance; overlaps stack into rows. */
const POS_CODES: Record<string, string> = { placement: 'PC', consult: 'DIR', cel: 'CD' }
const CORP_CODES: Record<string, string> = { everyday: 'ED', fedaykin: 'FA', krishe: 'KC' }

function pack(spans: Span[]): { span: Span; row: number }[] {
  const sorted = [...spans].sort((a, b) => a.from - b.from)
  const lastTo: number[] = []
  return sorted.map(sp => {
    let row = lastTo.findIndex(to => sp.from >= to + 0.06) // ~2 months of breathing room for min-width pills
    if (row === -1) { row = lastTo.length; lastTo.push(sp.to) } else lastTo[row] = sp.to
    return { span: sp, row }
  })
}

const laneRows = (packed: { row: number }[]) => (packed.length ? Math.max(...packed.map(p => p.row)) + 1 : 1)

export default function YearStrip() {
  const consulting: Span[] = []
  for (const c of CORPORATE) {
    const p = parseWhen(c.when)
    if (p) consulting.push({ ...p, label: CORP_CODES[c.id] ?? c.name, href: `#corporate-${c.id}` })
  }
  consulting.push({ label: 'RISA', from: 2026 + 6 / 12, to: 2027, href: '#experience-risa' })

  const positions: Span[] = []
  for (const p of POSITIONS) {
    const q = p.when.replace(' – ', ' – ')
    const m = q.match(/([A-Z][a-z]{2}) (\d{4})\s*–\s*(?:([A-Z][a-z]{2}) )?(\d{4}|Present)/)
    if (!m) continue
    const startMonth = MONTHS[m[1]]
    const endMonth = MONTHS[m[3] ?? m[1]] ?? 12
    positions.push({
      label: POS_CODES[p.id] ?? p.title,
      from: Number(m[2]) + (startMonth - 1) / 12,
      to: m[4] === 'Present' ? EDUCATION.classOf + 0.5 : Number(m[4]) + (endMonth - 1) / 12,
      href: '#about-positions',
    })
  }

  const packedPositions = pack(positions)
  const packedConsulting = pack(consulting)
  const consultRows = laneRows(packedConsulting)
  const posRows = laneRows(packedPositions)

  const honors = ACHIEVEMENTS.map(a => ({ year: a.year + 0.4, label: a.name }))

  const years = Array.from({ length: SPAN + 1 }, (_, i) => START + i)

  return (
    <figure className="ys" role="group" aria-label={`Timeline from ${START} to ${EDUCATION.classOf}: study, consulting engagements, positions and honors`}>
      <div className="ys-years" aria-hidden="true"><div>{years.map(y => <span key={y}>{y}</span>)}</div></div>
      <div className="ys-lanes">
        <div className="ys-lane"><i className="ys-lab">Study</i>
          <div className="ys-track"><div className="ys-bar" style={{ left: x(START), width: `calc(${x(EDUCATION.classOf)} - ${x(START)})` }} aria-hidden="true" /></div>
        </div>
        <div className="ys-lane"><i className="ys-lab">Consulting</i>
          <div className="ys-track" style={{ ['--rows' as string]: consultRows }}>
            {packedConsulting.map(({ span: b, row }) => (
              <a key={b.label + row} className="ys-item ys-c" style={{ left: x(b.from), width: xw(b.from, b.to), top: row * 10, height: 9 }}
                href={b.href ?? '#corporate'} title={`${b.label}`}>
                {b.label}
              </a>
            ))}
          </div>
        </div>
        <div className="ys-lane"><i className="ys-lab">Positions</i>
          <div className="ys-track" style={{ ['--rows' as string]: posRows }}>
            {packedPositions.map(({ span: b, row }) => (
              <a key={b.label + row} className="ys-item ys-p" style={{ left: x(b.from), width: xw(b.from, b.to), top: row * 10, height: 9 }}
                href={b.href ?? '#about-positions'} title={b.label}>
                {b.label}
              </a>
            ))}
          </div>
        </div>
        <div className="ys-lane"><i className="ys-lab">Honors</i>
          <div className="ys-track">
            {honors.map(h => (
              <a key={h.label} className="ys-dot" style={{ left: x(h.year) }} href="#about" title={h.label} aria-label={h.label}>
                <i aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}
