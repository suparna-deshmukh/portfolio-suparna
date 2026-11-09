import Image from 'next/image'

const shots = [
  {
    src: '/images/projects/insight-extractor-report.webp',
    cap: 'A real deep run — “flipkart delivery”: the fixed-format report, tabs for buckets, evidence and the SQL audit, agent console live.',
  },
  {
    src: '/images/projects/insight-extractor-wizard.webp',
    cap: 'The 4-step wizard: one brief — topic, objective, eight platforms, timeframe — then the agent plans the rest.',
  },
]

export default function InsightShots() {
  return (
    <div className="ie-shots">
      {shots.map((s) => (
        <figure key={s.src} className="ie-shot">
          <Image
            src={s.src}
            alt={s.cap}
            width={1200}
            height={690}
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6, border: '1px solid color-mix(in oklab, var(--pa) 25%, transparent)' }}
          />
          <figcaption>{s.cap}</figcaption>
        </figure>
      ))}
    </div>
  )
}
