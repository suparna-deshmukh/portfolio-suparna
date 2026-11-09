/** Real product screenshots for the case studies — one figure per shot, in reading order. */
export interface CaseShot { src: string; cap: string; w: number; h: number }

export const CASE_SHOTS: Record<string, CaseShot[]> = {
  askcart: [
    { src: '/images/projects/askcart-home.webp', w: 1280, h: 800,
      cap: 'The home: one search, one ask — the guided follow-up replaces the dead end.' },
    { src: '/images/projects/askcart-guided.webp', w: 1200, h: 1400,
      cap: '“shaadi gifts” narrows with one question — budget, for whom, occasion, material, style — then the results re-rank.' },
    { src: '/images/projects/askcart-analytics.webp', w: 1280, h: 900,
      cap: 'Live analytics against the study baseline: null results 8.0% vs 27.3%, 78.7% resolved within two follow-ups.' },
  ],
  'insight-extractor': [
    { src: '/images/projects/insight-extractor-report.webp', w: 1200, h: 690,
      cap: 'A real deep run — “flipkart delivery”: the fixed-format report with snapshot, buckets, evidence and trend tabs, agent console live.' },
    { src: '/images/projects/insight-extractor-buckets.webp', w: 1200, h: 690,
      cap: 'The six insight buckets with top quotes and sentiment — usability, logistics, support, product gaps, price, quality.' },
    { src: '/images/projects/insight-extractor-wizard.webp', w: 1200, h: 690,
      cap: 'The 4-step brief: topic, objective, audience, competitors, timeframe — platforms and the ≤3-call Gemini budget up front.' },
  ],
}
