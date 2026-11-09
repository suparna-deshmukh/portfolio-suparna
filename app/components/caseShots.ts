/** Real product screenshots for the case studies — one figure per shot, in reading order. */
export interface CaseShot { src: string; cap: string; w: number; h: number }

/** Shot order follows the user journey, not the file order. */
export const CASE_SHOTS: Record<string, CaseShot[]> = {
  askcart: [
    { src: '/images/projects/askcart-home.webp', w: 1280, h: 800,
      cap: 'The home: one search, one ask — the guided follow-up replaces the dead end.' },
    { src: '/images/projects/askcart-guided.webp', w: 1200, h: 852,
      cap: 'The misspelled query “Shadhi Gift” still lands: one question — budget, for whom, occasion, material, style — narrows it and the results re-rank.' },
    { src: '/images/projects/askcart-analytics.webp', w: 1280, h: 900,
      cap: 'Live analytics against the study baseline: null results 8.0% vs 27.3%, 78.7% resolved within two follow-ups.' },
  ],
  'insight-extractor': [
    { src: '/images/projects/insight-extractor-wizard.webp', w: 1200, h: 690,
      cap: 'The run starts with the 4-step brief: topic, objective, audience, competitors, timeframe — platforms and the ≤3-call Gemini budget up front.' },
    { src: '/images/projects/insight-extractor-report.webp', w: 1200, h: 690,
      cap: 'What comes out: the fixed-format report from a real deep run (“flipkart delivery”) — snapshot, tabs for buckets, evidence and trend, agent console live.' },
    { src: '/images/projects/insight-extractor-buckets.webp', w: 1200, h: 690,
      cap: 'Then digging in: the six insight buckets with top quotes and sentiment — usability, logistics, support, product gaps, price, quality.' },
  ],
}
