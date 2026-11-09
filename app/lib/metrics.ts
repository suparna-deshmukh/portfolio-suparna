// ─────────────────────────────────────────────────────────────────────────────
// The metrics registry: every number printed on the site lives here, exactly
// once, with its source and date. Components and data files read by id —
// no numeric literals in JSX.
//
// Dev-time: assertMetrics() runs on module load (like assertExcerpts). For
// rate metrics with both num and den, the arithmetic must check out to within
// 0.05 percentage points or the dev build throws. Metrics flagged
// `needsReview` are printed as-is with a loud dev warning until the true
// numerator/denominator is supplied.
// ─────────────────────────────────────────────────────────────────────────────

export type MetricUnit = '%' | '$' | 'x' | 'count' | 'hrs'

export interface Metric {
  id: string
  /** exactly what the UI prints */
  shown: string
  num?: number
  den?: number
  /** sample size, when one exists */
  n?: number
  unit: MetricUnit
  /** where the number comes from (engagement / project / evaluation) */
  source: string
  /** when it was true */
  asOf: string
  /** true until Suparna supplies the true numerator/denominator */
  needsReview?: boolean
}

const M = (m: Metric) => m

export const METRICS: Record<string, Metric> = {
  // ── Experience · RISA Labs ──
  'risa-hours': M({ id: 'risa-hours', shown: '350 hrs/wk', num: 350, unit: 'hrs', source: 'RISA Labs: Status Tracking 0→1, 200 users', asOf: 'Nov 2026' }),
  'risa-docs': M({ id: 'risa-docs', shown: '400', num: 400, unit: 'count', source: 'RISA Labs: docs/day via cron pipeline (bots, portal, fax APIs)', asOf: 'Nov 2026' }),
  'risa-coverage': M({ id: 'risa-coverage', shown: '85%', num: 85, unit: '%', source: 'RISA Labs: order matching, coverage-first trade-off', asOf: 'Nov 2026' }),
  'risa-precision': M({ id: 'risa-precision', shown: '96%', num: 96, unit: '%', source: 'RISA Labs: order matching, coverage-first trade-off', asOf: 'Nov 2026' }),
    'risa-vapi': M({ id: 'risa-vapi', shown: '92%', num: 92, unit: '%', source: 'RISA Labs: Vapi calling MVP, 20-user pilot', asOf: 'Oct 2026' }),
  'risa-qc': M({ id: 'risa-qc', shown: '2x', num: 2, unit: 'x', source: 'RISA Labs: unified QC UI throughput', asOf: 'Oct 2026' }),
  'risa-pulse': M({ id: 'risa-pulse', shown: '87%', num: 87, unit: '%', source: 'RISA Labs: Pulse auto-RCA precision', asOf: 'Oct 2026' }),
  'risa-orders': M({ id: 'risa-orders', shown: '2500', num: 2500, unit: 'count', source: 'RISA Labs: orders/day at the unified QC UI', asOf: 'Oct 2026' }),
  'risa-users': M({ id: 'risa-users', shown: '200', num: 200, unit: 'count', source: 'RISA Labs: users served by Status Tracking', asOf: 'Oct 2026' }),
  'risa-tat': M({ id: 'risa-tat', shown: '60%', num: 60, unit: '%', source: 'RISA Labs: RISA Assist, portal filing TAT cut', asOf: 'Nov 2026' }),
  'risa-studio': M({ id: 'risa-studio', shown: '$10K/yr', num: 10, unit: '$', source: 'RISA Labs: Document Studio, Acrobat replacement, 70% step TAT cut', asOf: 'Nov 2026' }),
  'risa-tpo': M({ id: 'risa-tpo', shown: '30%', num: 30, unit: '%', source: 'RISA Labs: time-per-order cut across 4 revamped UI steps', asOf: 'Nov 2026' }),

  // ── Experience · InvestMates ──
  'im-ctr': M({ id: 'im-ctr', shown: '25%', num: 25, n: 4200, unit: '%', source: 'InvestMates — homepage revamp A/B test (p<0.05)', asOf: 'Sep 2025' }),
  'im-sessions': M({ id: 'im-sessions', shown: '10%', num: 10, unit: '%', source: 'InvestMates — homepage revamp, session length', asOf: 'Sep 2025' }),
  'im-dropoff': M({ id: 'im-dropoff', shown: '18%', num: 18, unit: '%', source: 'InvestMates — CleverTap lifecycle campaigns, 3k users', asOf: 'Sep 2025' }),
  'im-d7': M({ id: 'im-d7', shown: '+3 pp', num: 3, unit: 'count', source: 'InvestMates — D7 retention, lifecycle campaigns', asOf: 'Sep 2025' }),

  // ── Experience · Suzlon ──
  'szl-report': M({ id: 'szl-report', shown: '66%', num: 66, unit: '%', source: 'Suzlon — reporting time cut by 20 automated n8n pipelines', asOf: 'Jul 2025' }),
  'szl-pipelines': M({ id: 'szl-pipelines', shown: '20', num: 20, unit: 'count', source: 'Suzlon — data pipelines automated with n8n + AI agents', asOf: 'Jul 2025' }),
  'szl-states': M({ id: 'szl-states', shown: '8-state', num: 8, unit: 'count', source: 'Suzlon — CSR analysis led as team lead', asOf: 'Jul 2025' }),

  // ── Experience · Chimera VC ──
  'ch-pipeline': M({ id: 'ch-pipeline', shown: '$4M', num: 4, unit: '$', source: 'Chimera VC — deal pipeline (10 startups, 7 memos)', asOf: 'May 2025' }),
  'ch-sheets': M({ id: 'ch-sheets', shown: '3', num: 3, unit: 'count', source: 'Chimera VC — term sheets driven', asOf: 'May 2025' }),
  'ch-deals': M({ id: 'ch-deals', shown: '2', num: 2, unit: 'count', source: 'Chimera VC — closed investments', asOf: 'May 2025' }),
  'ch-startups': M({ id: 'ch-startups', shown: '10', num: 10, unit: 'count', source: 'Chimera VC — early-stage gaming startups vetted', asOf: 'May 2025' }),
  'ch-memos': M({ id: 'ch-memos', shown: '7', num: 7, unit: 'count', source: 'Chimera VC — investment memos co-authored', asOf: 'May 2025' }),

  // ── Experience · PrimeWealth ──
  'pw-aum': M({ id: 'pw-aum', shown: '33%', num: 33, unit: '%', source: 'PrimeWealth — AUM lift, US NRI market entry', asOf: 'Mar 2025' }),
  'pw-leads': M({ id: 'pw-leads', shown: '40%', num: 40, unit: '%', source: 'PrimeWealth — inbound leads, market entry strategy', asOf: 'Mar 2025' }),
  'pw-model': M({ id: 'pw-model', shown: '50%', num: 50, unit: '%', source: 'PrimeWealth — AUM growth in persona-segmented scenario model', asOf: 'Mar 2025' }),

  // ── Corporate projects (180 Degrees Consulting engagements) ──
  'ed-raise': M({ id: 'ed-raise', shown: '$2.5M', num: 2.5, unit: '$', source: 'Everyday Diamonds — Series A from All In Capital, deck by 180DC team', asOf: 'Sep 2024' }),
  'ed-stores': M({ id: 'ed-stores', shown: '5', num: 5, unit: 'count', source: 'Everyday Diamonds — 4-year offline expansion roadmap', asOf: 'Sep 2024' }),
  'fa-unit': M({ id: 'fa-unit', shown: '30%', num: 30, unit: '%', source: 'Fedaykin AV — unit economics across specs, ops and annotation costs', asOf: 'Aug 2024' }),
  'fa-clients': M({ id: 'fa-clients', shown: '950', num: 950, unit: 'count', source: 'Fedaykin AV — curated B2B client database', asOf: 'Aug 2024' }),
  'kc-grants': M({ id: 'kc-grants', shown: '₹12.5L', num: 12.5, unit: '$', source: 'KriSHE Carbon — grants enabled via investor deck and biochar model', asOf: 'Aug 2025' }),
  'kc-buyers': M({ id: 'kc-buyers', shown: '20+', num: 20, unit: 'count', source: 'KriSHE Carbon — high-fit carbon market opportunities', asOf: 'Aug 2025' }),

  // ── Positions of responsibility ──
  'pc-placed': M({ id: 'pc-placed', shown: '240', num: 240, unit: 'count', source: 'Placement Coordinator, BITS Goa — 2026 batch, May 2026 onward', asOf: 'Oct 2026' }),
  // A range, not a single rate: 58% at the May 2026 handover to 85% by October 2026.
  // Kept out of the rate assertion on purpose; both endpoints live in `source`.
  'pc-rate': M({ id: 'pc-rate', shown: '58%→85%', unit: '%', source: 'Placement Coordinator, BITS Goa — batch placement percentage, 58% at the May 2026 handover to 85% by October 2026', asOf: 'Oct 2026' }),
  'pc-team': M({ id: 'pc-team', shown: '25', num: 25, unit: 'count', source: 'Placement Coordinator, BITS Goa — team led end-to-end', asOf: 'Oct 2026' }),
  'pc-select': M({ id: 'pc-select', shown: '1 of 8', num: 1, den: 8, unit: 'count', source: 'Placement Coordinator selection, BITS Goa (1,000+ applicants)', asOf: 'May 2026' }),
  'pc-pool': M({ id: 'pc-pool', shown: '1,000+', num: 1000, unit: 'count', source: 'Placement Coordinator selection pool, BITS Goa', asOf: 'May 2026' }),
  'dc-sponsor': M({ id: 'dc-sponsor', shown: '₹17L', num: 17, unit: '$', source: '180 Degrees Consulting — Consultathon sponsorships', asOf: 'Jun 2026' }),
  'dc-reg': M({ id: 'dc-reg', shown: '3,200', num: 3200, unit: 'count', source: '180 Degrees Consulting — Consultathon registrations', asOf: 'Jun 2026' }),
  'dc-rev': M({ id: 'dc-rev', shown: '30%', num: 30, unit: '%', source: '180 Degrees Consulting, BITS Goa — YoY revenue growth, 16 projects', asOf: 'Jun 2026' }),
  'dc-courses': M({ id: 'dc-courses', shown: '50K+', num: 50, unit: 'count', source: '180 Degrees Consulting — PM/consulting course impressions (85% retention)', asOf: 'Jun 2026' }),
  'dc-consultants': M({ id: 'dc-consultants', shown: '45', num: 45, unit: 'count', source: '180 Degrees Consulting, BITS Goa — consultants led as youngest Director', asOf: 'Jun 2026' }),
  'dc-projects': M({ id: 'dc-projects', shown: '16', num: 16, unit: 'count', source: '180 Degrees Consulting, BITS Goa — projects run', asOf: 'Jun 2026' }),
  'cel-founders': M({ id: 'cel-founders', shown: '40+', num: 40, unit: 'count', source: "Center for Entrepreneurial Leadership — Coalescence'24 founders, investors, partners", asOf: 'Jun 2026' }),
  'cel-impr': M({ id: 'cel-impr', shown: '400K+', num: 400, unit: 'count', source: "Center for Entrepreneurial Leadership — Coalescence'24 impressions", asOf: 'Jun 2026' }),
  'cel-rev': M({ id: 'cel-rev', shown: '₹10L+', num: 10, unit: '$', source: "Center for Entrepreneurial Leadership — Coalescence'24 event revenue", asOf: 'Jun 2026' }),
  'cel-team': M({ id: 'cel-team', shown: '20', num: 20, unit: 'count', source: 'Center for Entrepreneurial Leadership — marketing and operations team', asOf: 'Jun 2026' }),

  // ── Honors ──
  'acc-rank': M({ id: 'acc-rank', shown: 'Top 8', num: 8, den: 9000, unit: 'count', source: 'Accenture Strategy Connect ’25 — consulting case, GenAI in supply chain', asOf: '2025' }),
  'acc-of': M({ id: 'acc-of', shown: '9,000+', num: 9000, unit: 'count', source: 'Accenture Strategy Connect ’25 — participants', asOf: '2025' }),
  'iima-rank': M({ id: 'iima-rank', shown: 'Top 5', num: 5, den: 2500, unit: 'count', source: 'IIMA Fintech Frontier ’24 — 0→1 product design and GTM', asOf: '2024' }),
  'iima-of': M({ id: 'iima-of', shown: '2,500+', num: 2500, unit: 'count', source: 'IIMA Fintech Frontier ’24 — participants', asOf: '2024' }),
  'nl-rank': M({ id: 'nl-rank', shown: 'Top 10%', num: 10, unit: '%', source: 'NextLeap PM Fellowship ’26 — guided AI search for Google Photos', asOf: '2026' }),
  'nl-of': M({ id: 'nl-of', shown: '270', num: 270, unit: 'count', source: 'NextLeap PM Fellowship ’26 — participants', asOf: '2026' }),

  // ── Data projects ──
  'd1-auc': M({ id: 'd1-auc', shown: '82%', num: 82, unit: '%', source: 'Content virality — XGBoost classifier AUC, YouTube Trending 200K+ videos', asOf: '2025' }),
  'd1-videos': M({ id: 'd1-videos', shown: '200K+', num: 200, unit: 'count', source: 'Content virality — YouTube Trending dataset size', asOf: '2025' }),
  'd2-users': M({ id: 'd2-users', shown: '50K', num: 50, unit: 'count', source: 'Mutual fund retention — synthetic/AMFI user records', asOf: '2025' }),
  'd3-cac': M({ id: 'd3-cac', shown: '−28%', num: 28, unit: '%', source: 'Growth attribution — simulated CAC, AI channel reallocation, 45K campaigns', asOf: '2025' }),
  'd3-records': M({ id: 'd3-records', shown: '45K', num: 45, unit: 'count', source: 'Growth attribution — neobank campaign records', asOf: '2025' }),
  'd4-records': M({ id: 'd4-records', shown: '100K+', num: 100, unit: 'count', source: 'Loan risk — LendingClub records queried via SQL', asOf: '2025' }),
  'd4-risk': M({ id: 'd4-risk', shown: '5', num: 5, unit: 'count', source: 'Loan risk — risk profiles from RFM-style segmentation', asOf: '2025' }),

  // ── Projects · AskCart ──
  'ac-null': M({ id: 'ac-null', shown: '8%', num: 12, den: 150, n: 150, unit: '%', source: 'AskCart MVP — null search results after guided follow-up', asOf: 'Aug 2026' }),
  'ac-null-before': M({ id: 'ac-null-before', shown: '27.3%', num: 41, den: 150, n: 150, unit: '%', source: 'AskCart MVP — null search results before the guided flow', asOf: 'Aug 2026' }),
  'ac-eval': M({ id: 'ac-eval', shown: '96.5%', num: 109, den: 113, n: 113, unit: '%', source: 'AskCart — eval suite over search, RAG and UX (109 of 113 passed)', asOf: 'Nov 2026' }),
  'ac-follow': M({ id: 'ac-follow', shown: '78.7%', num: 118, den: 150, n: 150, unit: '%', source: 'AskCart MVP — searches resolved within 2 follow-ups', asOf: 'Aug 2026' }),
  'ac-relevance': M({ id: 'ac-relevance', shown: '88%', num: 88, n: 100, unit: '%', source: 'AskCart — top-3 relevance, multilingual embedding fallback, 100-query eval', asOf: 'Aug 2026' }),
  'ac-reviews': M({ id: 'ac-reviews', shown: '94.6K', num: 94600, unit: 'count', source: 'AskCart — reviews mined via agentic extractor (Reddit, App Store, Play Store)', asOf: 'Aug 2026' }),
  'ac-skus': M({ id: 'ac-skus', shown: '54K', num: 54000, unit: 'count', source: 'AskCart MVP — Bayesian-rated SKUs in the catalog', asOf: 'Nov 2026' }),
  'ac-users': M({ id: 'ac-users', shown: '6', num: 6, unit: 'count', source: 'AskCart — user interviews for the guided flow', asOf: 'Aug 2026' }),
  'ac-causes': M({ id: 'ac-causes', shown: '4', num: 4, unit: 'count', source: 'AskCart — root causes of search failure isolated from 94.6K reviews', asOf: 'Aug 2026' }),
  // ── Projects · Insight Extractor ──
  'ie-stages': M({ id: 'ie-stages', shown: '6', num: 6, unit: 'count', source: 'Insight Extractor — SQL pipeline stages behind the review mining', asOf: 'Aug 2026' }),
  'ie-platforms': M({ id: 'ie-platforms', shown: '8', num: 8, unit: 'count', source: 'Insight Extractor — live platform APIs tapped per run (HN, Reddit, App Store, Play Store, GitHub, Google Trends, Product Hunt, YouTube)', asOf: 'Nov 2026' }),
  'ie-records': M({ id: 'ie-records', shown: '187', num: 187, unit: 'count', source: 'Insight Extractor — deep run "flipkart delivery": records fetched across six platforms', asOf: 'Nov 2026' }),
  'ie-buckets': M({ id: 'ie-buckets', shown: '6', num: 6, unit: 'count', source: 'Insight Extractor — insight buckets in the flipkart delivery deep run report', asOf: 'Nov 2026' }),
  'ac-narrow': M({ id: 'ac-narrow', shown: '12', num: 12, unit: 'count', source: 'AskCart evals — SKUs after guided narrowing, missing_context mode', asOf: 'Aug 2026' }),

  // ── Projects · Research Agent ──
  'ra-pain': M({ id: 'ra-pain', shown: '500+', num: 500, unit: 'count', source: 'Research Agent — pain points aggregated per run (Reddit + HN)', asOf: 'Jun 2026' }),
  'ra-nodes': M({ id: 'ra-nodes', shown: '28', num: 28, unit: 'count', source: 'Research Agent — n8n workflow nodes', asOf: 'Jun 2026' }),
  'ra-cut': M({ id: 'ra-cut', shown: '70%', num: 70, unit: '%', source: 'Research Agent — research-to-spec time cut vs manual', asOf: 'Jun 2026' }),
  'ra-mentions': M({ id: 'ra-mentions', shown: '7', num: 7, unit: 'count', source: 'Research Agent board — mentions on the top theme (illustrative sample)', asOf: 'Jun 2026' }),
}

/** Read a metric by id; throws in dev on a bad id so typos surface immediately. */
export function m(id: string): Metric {
  const hit = METRICS[id]
  if (!hit) {
    if (process.env.NODE_ENV !== 'production') throw new Error(`[metrics] unknown metric id "${id}"`)
    return { id, shown: '', unit: 'count', source: '', asOf: '' }
  }
  return hit
}

/** Dev-time: rates must reconcile; needsReview metrics warn loudly. */
export function assertMetrics(all: Metric[] = Object.values(METRICS)) {
  for (const mt of all) {
    if (mt.num != null && mt.den != null && mt.unit === '%') {
      const calc = (mt.num / mt.den) * 100
      const shown = parseFloat(mt.shown)
      if (Number.isNaN(shown)) throw new Error(`[metrics] ${mt.id}: shown "${mt.shown}" is not a number`)
      if (Math.abs(calc - shown) >= 0.05) {
        throw new Error(`[metrics] ${mt.id}: ${mt.num}/${mt.den} = ${calc.toFixed(2)}% but shown ${mt.shown}%`)
      }
    }
    if (mt.needsReview && process.env.NODE_ENV !== 'production') {
      console.warn(`[metrics] ${mt.id} ("${mt.shown}") is flagged needsReview — ${mt.source}. Confirm the numerator/denominator before publishing.`)
    }
  }
}

if (process.env.NODE_ENV !== 'production') assertMetrics()
