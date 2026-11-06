// Site-wide constants and section data that is not part of the posts/projects content.
import { m } from './metrics'
import { PROJECTS } from './content'

export const RESUME_URL = '/Suparna-Deshmukh-Resume.pdf' // generated: scripts/build-resume-pdf.mjs
/** Canonical origin for metadata. Set NEXT_PUBLIC_SITE_URL once a domain exists (Section 7 #13). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3210'
/** Institute address — the form's fallback recipient only; never displayed until a professional address arrives (P0-4). */
export const EMAIL = 'f20230611@goa.bits-pilani.ac.in'
/**
 * The public contact email. Suparna's professional address via NEXT_PUBLIC_CONTACT_EMAIL
 * (Section 7, item 4) — empty until she supplies it, and while empty the site shows no
 * email at all (hidden, not stubbed). The form still works; the API falls back to the
 * institute address server-side only.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ''
/** Display form of the phone, and the tel: target. The number is tap-to-reveal on Contact,
  *  and the raw digits never appear in static HTML (P0-4). */
export const PHONE = '+91 89569 67964'
export const PHONE_TEL = 'tel:+918956967964'
export const GITHUB_USER = 'suparna-deshmukh'

export const SOCIALS = {
  linkedin: 'https://www.linkedin.com/in/suparna-deshmukh/', // TODO: confirm URL
  github: `https://github.com/${GITHUB_USER}`,
  x: '', // TODO: add the X handle; the X card stays hidden until it does
}

/**
 * A link only renders when it has a real destination. Empty or '#' URLs stay hidden until
 * Suparna supplies them (no dead ends on a portfolio). Dev-time, assertNoDeadLinks crawls
 * every href that *will* render and fails on placeholders.
 */
export const link = (href?: string | null) => (href && href.trim() && href.trim() !== '#' ? href.trim() : undefined)

function isRealHref(href: string): boolean {
  if (href.startsWith('/')) return true
  if (!/^https?:\/\//.test(href)) return false
  if (href.includes('example.com')) return false
  if (href.includes('localhost')) return false
  return true
}

export function assertNoDeadLinks() {
  const problems: string[] = []
  const check = (where: string, href?: string | null) => {
    if (!link(href)) return // hidden until supplied — not a dead link
    if (!isRealHref(href as string)) problems.push(`${where} → "${href}"`)
  }
  check('RESUME_URL', RESUME_URL)
  check('SOCIALS.linkedin', SOCIALS.linkedin)
  check('SOCIALS.github', SOCIALS.github)
  check('SOCIALS.x', SOCIALS.x)
  check('CONSULTATHON_URL', CONSULTATHON_URL)
  for (const p of PROJECTS) {
    check(`PROJECTS[${p.slug}].live_url`, p.live_url)
    for (const l of p.links ?? []) check(`PROJECTS[${p.slug}].links`, l.href)
  }
  for (const c of CORPORATE) check(`CORPORATE[${c.id}].deck`, c.deck?.href)
  for (const a of ACHIEVEMENTS) check(`ACHIEVEMENTS[${a.name}].deck`, a.deck?.href)
  if (problems.length) throw new Error(`[dead-links] rendered links without a real destination: ${problems.join('; ')}`)
}
export const PREFILL_EVENT = 'contact:prefill'
export const ASK_OWN_MESSAGE = "Hi Suparna, I'd like to hear about your corporate consulting work."

export const NAV_SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'corporate', label: 'Corporate Projects' },
  { id: 'data', label: 'Data Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export interface LogEntry {
  when: string
  text: string
  link?: { label: string; href: string }
}

// "Log" tile in About. Newest first. Only published facts.
export const LOG: LogEntry[] = [
  { when: 'Now', text: 'Associate Product Manager Intern at RISA Labs. AI workflows for US healthcare.' },
  { when: "Jul '26", text: 'Started at RISA Labs. Owning Status Tracking 0→1 for 200 users.' },
  { when: "May '26", text: 'As Placement Coordinator at BITS Goa, placed 240 students; batch percentage 58% to 85%.' },
  { when: "May '25", text: 'Youngest Director at 180 Degrees Consulting. 45 consultants across 16 projects, 30% YoY revenue.' },
]

export interface Bullet { lead: string; rest: string }
/** One proof figure: the number and what it measures. */
export interface Stat { value: string; label: string; /** metric registry id behind the figure; components attach a hover proof when present */ metric?: string }
interface RoleBase { title: string; meta: string; bullets: Bullet[]; /** metric registry id for the headline figure */ heroMetric?: string }
/**
 * A role with its proof pulled out of the bullets: `hero` is the headline, `how` is the verbatim `rest`
 * of the hero bullet, `results` are the other figures. Every number comes from a bullet. A `pending`
 * role has no published figures yet and renders its bullets only.
 */
export type Role = RoleBase & ({ pending: true } | { pending?: false; hero: Stat; how: string; results: Stat[] })

export interface Company {
  id: string
  name: string
  monogram: string
  city: string
  years: string
  metric: string
  metricCaption: string
  summary: string
  /** the sector the role sat in, shown on the route manifest */
  sector: string
  /** product = the two product roles, industry = the rotations page */
  group?: 'product' | 'industry'
  /** standout role: rendered larger, with the full results list inline (no dropdown) */
  featured?: boolean
  roles: Role[]
}

// Bullet copy is from the resume (source of truth for numbers).
export const EXPERIENCE: Company[] = [
  {
    id: 'risa', name: 'RISA Labs', monogram: 'RL', city: 'Bengaluru', years: "'26 to now", metric: m('risa-hours').shown, metricCaption: 'saved across 200 users by Status Tracking', summary: 'Associate Product Manager Intern · AI Workflows for US Healthcare', sector: 'Healthcare AI', group: 'product', featured: true,
    roles: [
      { title: 'Associate Product Manager Intern', meta: 'Jul 2026 to Present · Healthcare AI · Bengaluru',
        heroMetric: 'risa-hours',
        hero: { value: m('risa-hours').shown, label: 'saved across 200 users' },
        how: 'by owning Status Tracking 0→1: 90k-order SQL analysis, user research, user stories, PRDs (v0 to v1), HLD and dev-testing.',
        results: [
          { value: `${m('risa-coverage').shown} / ${m('risa-precision').shown}`, label: 'coverage / precision across 118 payers', metric: 'risa-precision' },
          { value: m('risa-vapi').shown, label: 'accuracy on the Vapi calling MVP', metric: 'risa-vapi' },
          { value: m('risa-qc').shown, label: 'QC throughput on the unified UI', metric: 'risa-qc' },
          { value: m('risa-pulse').shown, label: 'precision on Pulse auto-RCA', metric: 'risa-pulse' },
        ],
        bullets: [
          { lead: '200 users save 500 hrs/wk', rest: ' by owning Status Tracking 0→1: 90k-order SQL analysis, user research, user stories, PRDs (v0 to v1), HLD and dev-testing.' },
          { lead: '118 payers on a live 30-minute sync', rest: ' — docs pulled via portal APIs, bots and a fax API, then categorized and order-matched with a coverage-first trade-off: 75% coverage at 96% precision.' },
          { lead: '92% accuracy on inquiry calls', rest: ' by building an agentic calling MVP on Vapi from 4 months of data, call checklists and configs; a 20-user pilot sped up testing.' },
          { lead: '2x QC throughput, 40% faster error fixes', rest: ' — user interviews found QC juggling 4 platforms; prototyped and shipped a unified UI. 2500 orders/day.' },
          { lead: '87% precision on auto-RCA', rest: ' — built Pulse, a RAG tool-calling auto-RCA tool with chatbot, eval-tested; flags 15 metric drops/day, 60% RCA coverage.' },
          { lead: '60% fewer filing clicks', rest: ' — launched RISA Assist on the Chrome Store, a low-latency AI extension that parses portal HTML and auto-fills answers.' },
          { lead: 'Saved $10K/yr, 60% step TAT cut', rest: ' — shipped Document Studio on standard APIs to fetch and process clinical docs; replaced Acrobat.' },
          { lead: '30% time-per-order cut', rest: ' — revamped 4 key order UI steps for edge cases with tech, design and compliance via user research and Amplitude.' },
        ] },
    ],
  },
  {
    id: 'investmates', name: 'InvestMates', monogram: 'IM', city: 'Seattle (Remote)', years: "'25", metric: m('im-ctr').shown, metricCaption: 'homepage CTR lift from the revamp A/B test', summary: 'Product Manager (Part-time) · AI Wealth Management for NRIs', sector: 'FinTech · Wealth', group: 'product',
    roles: [{ title: 'Product Manager (Part-time)', meta: 'Jul 2025 to Sept 2025 · FinTech · Seattle (Remote)',
      heroMetric: 'im-ctr',
      hero: { value: m('im-ctr').shown, label: 'homepage CTR lift' },
      how: 'by authoring PRDs for the homepage revamp and AI portfolio health, A/B tested (n=4200, p<0.05).',
      results: [
        { value: m('im-sessions').shown, label: 'longer sessions', metric: 'im-sessions' },
        { value: m('im-dropoff').shown, label: 'drop-offs cut by lifecycle campaigns', metric: 'im-dropoff' },
        { value: m('im-d7').shown, label: 'D7 retention', metric: 'im-d7' },
      ],
      bullets: [
        { lead: 'Lifted homepage CTR 25%, sessions 20%', rest: ' by authoring PRDs for the homepage revamp and AI portfolio health, ran A/B test (n=4200, p<0.05).' },
        { lead: 'Cut drop-offs 18%, D7 retention up 3 pp', rest: ' by running cohort CleverTap lifecycle email and notification campaigns for 3k users on user funnel data.' },
      ] }],
  },
  {
    id: 'suzlon', name: 'Suzlon Group', monogram: 'SZ', city: 'Pune', years: "'25", metric: m('szl-report').shown, metricCaption: 'reporting time cut by automated pipelines', summary: 'Summer Intern (Team Lead) · Renewable Energy', sector: 'Renewable Energy', group: 'industry',
      roles: [
        { title: 'Summer Intern (Team Lead)', meta: 'May 2025 to Jul 2025 · Renewable energy · Pune',
        heroMetric: 'szl-report',
        hero: { value: m('szl-report').shown, label: 'reporting time cut' },
        how: 'by automating 20 data pipelines with n8n, AI agents and IMAP email parsing.',
        results: [
          { value: m('szl-states').shown, label: 'CSR analysis led as team lead', metric: 'szl-states' },
          { value: m('szl-pipelines').shown, label: 'data pipelines automated', metric: 'szl-pipelines' },
        ],
        bullets: [
          { lead: 'Led 5 interns on an 8-state CSR analysis', rest: ' with Excel and VBA; built and presented Power BI KPI dashboards and PPTs to leadership.' },
          { lead: 'Automated 20 data pipelines with n8n', rest: ' integrating AI agents and IMAP email parsing to build CSVs and PPTs; cut reporting time by 66%.' },
        ] },
    ],
  },
  {
    id: 'chimera', name: 'Chimera VC', monogram: 'CV', city: 'Singapore (Remote)', years: "'25", metric: m('ch-pipeline').shown, metricCaption: 'pipeline built · 3 term sheets · 2 investments', summary: 'Investment Analyst Intern · Gaming Venture Capital', sector: 'Venture Capital', group: 'industry',
      roles: [
        { title: 'Investment Analyst Intern', meta: 'Mar 2025 to May 2025 · Gaming venture capital · Singapore (Remote)',
        heroMetric: 'ch-pipeline',
        hero: { value: m('ch-pipeline').shown, label: 'pipeline built' },
        how: 'by vetting 10 early-stage startups on benchmarks, traction and CAC/LTV, co-authoring 7 memos.',
        results: [
          { value: m('ch-sheets').shown, label: 'term sheets driven', metric: 'ch-sheets' },
          { value: m('ch-deals').shown, label: 'closed investments', metric: 'ch-deals' },
        ],
        bullets: [
          { lead: 'Vetted 10 early-stage gaming startups', rest: ' on benchmarks, traction and CAC/LTV; co-authored 7 memos and sourced 2 leads.' },
          { lead: 'Drove 3 term sheets and 2 closed investments', rest: ' — key to the team’s $5M pipeline; shaped 4 additional deals through early-stage analysis.' },
          { lead: 'Owned end-to-end due diligence', rest: ' and deal-flow management on Notion, running core workflows in a lean team of 4.' },
        ] },
    ],
  },
  {
    id: 'primewealth', name: 'PrimeWealth', monogram: 'PW', city: 'Pune (Remote)', years: "'24 to '25", metric: m('pw-aum').shown, metricCaption: 'AUM lift, US NRI market entry', summary: 'GTM Intern · Wealth Management, US Expansion', sector: 'Wealth Management', group: 'industry',
      roles: [
        { title: 'GTM Intern', meta: 'Dec 2024 to Mar 2025 · Wealth management, US expansion · Pune (Remote)',
        heroMetric: 'pw-aum',
        hero: { value: m('pw-aum').shown, label: 'AUM lift' },
        how: 'by identifying US NRI pain points, sizing SAM/SOM and refining PMF for market entry.',
        results: [
          { value: m('pw-leads').shown, label: 'inbound leads up', metric: 'pw-leads' },
          { value: m('pw-model').shown, label: 'AUM growth in the scenario model', metric: 'pw-model' },
        ],
        bullets: [
          { lead: 'Helped lift AUM 33%', rest: ' by identifying US NRI pain points, sizing SAM/SOM, refining PMF and building the market entry strategy.' },
          { lead: 'Inbound leads up 40%', rest: ' from a customer-centric GTM strategy: mapped acquisition channels, content strategy and targeting criteria.' },
          { lead: 'Persona-segmented scenario model', rest: ' simulating the optimal client mix; go-live recommendations drove 50% AUM growth in simulation.' },
        ] },
    ],
  },
]

// ── Corporate practice: the consulting files, separate from personal builds ──

export interface Corporate {
  id: string
  name: string
  role: string
  context: string
  where: string
  when: string
  /** the rubber stamp: the one number the file is remembered for */
  stamp: string
  /** the proof panel: the big number, what it measured, and how far the gauge fills (0-100) */
  proof: { value: string; label: string; gauge: number }
  /** metric registry id for the proof figure, for the hover proof */
  proofMetric?: string
  /**
   * One line, in Suparna's words: what *she* did on this engagement (P0-3). Renders only
   * when present — the copy is pending from her, and until then the claim wording below
   * is kept verifiable at the project level ("aided", "enabled").
   */
  myPart?: string
  /** the animated mini-doc beside the file: its paper type, the rows that get stamped, the stamp's word */
  doc: { type: string; stampWord: string; rows: { label: string; verdict: string }[] }
  /** the deck / report this engagement produced */
  deck?: { label: string; href: string }
  points: string[]
  chips: Stat[]
  ask: string
}

export const CORPORATE: Corporate[] = [
  {
    id: 'everyday', name: 'Everyday Diamonds', role: 'Team Lead · GTM and Series A Fundraising', context: '180 Degrees Consulting engagement · Bengaluru',
    where: 'Bengaluru', when: 'Aug 2024 – Sept 2024', stamp: 'Series A aided',
    proof: { value: m('ed-raise').shown, label: 'Series A aided, All In Capital — first store launched', gauge: 100 },
    proofMetric: 'ed-raise',
    doc: { type: 'Term sheet', stampWord: 'Series A', rows: [
      { label: 'Profitability & pricing model', verdict: 'BUILT' },
      { label: 'Series A deck', verdict: 'SHARED' },
      { label: 'First store, Bengaluru', verdict: 'LAUNCHED' },
    ] },
    deck: { label: 'Series A deck', href: '#' },
    points: [
      'Modeled profitability, pricing and financial projections; built the 4-year expansion roadmap and the Series A deck that aided a $2.5M raise from All In Capital.',
      'Formulated the offline expansion strategy for 5 stores across India — and the first one launched in Bengaluru.',
    ],
    chips: [{ value: m('ed-raise').shown, label: 'Series A, All In Capital', metric: 'ed-raise' }, { value: m('ed-stores').shown, label: 'store expansion roadmap', metric: 'ed-stores' }],
    ask: "Hi Suparna, I'd like to hear about the Everyday Diamonds Series A work.",
  },
  {
    id: 'fedaykin', name: 'Fedaykin AV', role: 'GTM Strategy Consultant', context: 'Independent consulting engagement',
    where: 'Remote', when: 'Jul 2024 – Aug 2024', stamp: 'Unit economics +30%',
    proof: { value: m('fa-unit').shown, label: 'unit economics lifted via pricing, across specs, ops and annotation costs', gauge: 30 },
    proofMetric: 'fa-unit',
    doc: { type: 'Pricing audit', stampWord: 'Unit economics', rows: [
      { label: 'Competitor benchmarks', verdict: 'DONE' },
      { label: 'Unit economics via pricing', verdict: '+30%' },
      { label: '950-client B2B sizing', verdict: 'SIZED' },
    ] },
    deck: { label: 'Project report', href: '#' },
    points: [
      'Formulated the GTM strategy via market research, competitor analysis and a refined product-market fit for stronger positioning.',
      'Optimized the pricing strategy across technical specs, operations and annotation costs, improving unit economics by 30%.',
      'Curated a database of 950 potential AV clients and ran a bottom-up B2B market sizing to inform a scalable business model.',
    ],
    chips: [{ value: m('fa-unit').shown, label: 'unit economics', metric: 'fa-unit' }, { value: m('fa-clients').shown, label: 'client database', metric: 'fa-clients' }],
    ask: "Hi Suparna, I'd like to hear about the Fedaykin AV GTM strategy work.",
  },
  {
    id: 'kri' + 'she', name: 'KriSHE Carbon', role: 'Team Lead · GTM and Fundraising', context: '180 Degrees Consulting engagement · Gurugram',
    where: 'Gurugram', when: 'Jul 2025 – Aug 2025', stamp: `${m('kc-grants').shown} grants enabled`,
    proof: { value: m('kc-grants').shown, label: 'in grants enabled via the deck and biochar model', gauge: 100 },
    proofMetric: 'kc-grants',
    doc: { type: 'Grant review', stampWord: 'Grants', rows: [
      { label: 'Investor deck & model', verdict: 'PITCHED' },
      { label: 'Biochar impact metrics', verdict: 'VERIFIED' },
      { label: '20+ high-fit buyers', verdict: 'MAPPED' },
    ] },
    points: [
      'Built the investor pitch deck and financial projections; a scalable biochar model and impact metrics enabled ₹12.5L in grants.',
      'Ran carbon market and buyer research; developed the positioning and sales narrative, identifying 20+ high-fit opportunities.',
    ],
    chips: [{ value: m('kc-grants').shown, label: 'grants enabled', metric: 'kc-grants' }, { value: m('kc-buyers').shown, label: 'high-fit opportunities', metric: 'kc-buyers' }],
    ask: "Hi Suparna, I'd like to hear about the KriSHE Carbon fundraising work.",
  },
]

export const CORPORATE_AGG: Stat[] = [
  { value: m('ed-raise').shown, label: 'Series A raised', metric: 'ed-raise' },
  { value: m('kc-grants').shown, label: 'grants enabled', metric: 'kc-grants' },
  { value: m('fa-unit').shown, label: 'unit economics', metric: 'fa-unit' },
]

// ── About page: education, skills, honors ──

export const EDUCATION = {
  school: 'BITS Pilani, Goa Campus',
  degree: 'B.E. (Hons.) Electronics and Communication Engineering',
  minor: 'Minor in Finance',
  when: 'Aug 2023 – May 2027',
  classYear: 'Class of 2027',
}

export const ACHIEVEMENTS: { rank: string; of: string; name: string; note: string; crest: { text: string; color: string }; deck?: { label: string; href: string } }[] = [
  { rank: m('acc-rank').shown, of: m('acc-of').shown, name: "Accenture Strategy Connect '25", note: 'GenAI in supply chain, India', crest: { text: 'A', color: '#E2401B' }, deck: { label: 'Case deck', href: '#' } },
  { rank: m('iima-rank').shown, of: m('iima-of').shown, name: "IIMA Fintech Frontier '24", note: '0→1 product design and GTM', crest: { text: 'IIM', color: '#1F4E8C' }, deck: { label: 'Case deck', href: '#' } },
  { rank: m('nl-rank').shown, of: m('nl-of').shown, name: "NextLeap PM Fellowship '26", note: 'Guided AI search for Google Photos', crest: { text: 'N', color: '#0E9F8A' }, deck: { label: 'Project deck', href: '#' } },
]

export const CONSULTATHON_URL = 'https://unstop.com/competitions/consultathon-50-bits-pilani-k-k-birla-goa-campus-1674892'

export interface Position {
  id: string
  org: string
  title: string
  when: string
  blurb: string
  /** the people behind the role, shown as a team that lights up */
  team?: { count: number; label: string }
  stats: Stat[]
  chips: { text: string; href?: string }[]
}

/** Positions of responsibility, as the highlights of the college years. */
export const POSITIONS: Position[] = [
  {
    id: 'placement', org: 'BITS Goa', title: 'Placement Coordinator', when: 'May 2026 – Present',
    blurb: 'Selected 1 of 8 out of 1,000+ students. Leads campus placements and corporate outreach for the 2026 batch, end-to-end, with a 25-member team.',
    team: { count: m('pc-team').num ?? 25, label: 'team led end-to-end' },
    stats: [
      { value: m('pc-rate').shown, label: 'batch placement in 5 months', metric: 'pc-rate' },
      { value: m('pc-placed').shown, label: 'students placed', metric: 'pc-placed' },
      { value: m('pc-team').shown, label: 'team led end-to-end', metric: 'pc-team' },
    ],
    chips: [{ text: '1 of 8 selected' }, { text: 'Project SYNERGY approved · 3 campuses' }],
  },
  {
    id: 'consult', org: '180 Degrees Consulting', title: 'Director', when: 'May 2025 – Jun 2026',
    blurb: 'Youngest Director: 45 consultants across 16 projects, driving 30% YoY revenue growth. Awarded “Best Consultant” as a sophomore.',
    team: { count: m('dc-projects').num ?? 16, label: 'projects run across 45 consultants' },
    stats: [
      { value: m('dc-sponsor').shown, label: 'Consultathon sponsorships', metric: 'dc-sponsor' },
      { value: m('dc-reg').shown, label: 'Consultathon registrations', metric: 'dc-reg' },
      { value: m('dc-rev').shown, label: 'YoY revenue growth', metric: 'dc-rev' },
      { value: m('dc-courses').shown, label: 'course impressions, 85% retention', metric: 'dc-courses' },
    ],
    chips: [{ text: 'Best Consultant' }, { text: 'Consultathon — sponsored by Uplearn by Upstox, NextLeap, The MBA Edge & more · on Unstop', href: CONSULTATHON_URL }],
  },
  {
    id: 'cel', org: 'Center for Entrepreneurial Leadership', title: 'Creative Director', when: 'May 2025 – Jun 2026',
    blurb: "Coalescence'24: secured 40+ founders, investors and partners — including Ankur Warikoo and UTI. Led a 20-member team across marketing and operations; 400K+ impressions and ₹10L+ revenue.",
    team: { count: m('cel-team').num ?? 20, label: 'team across marketing and operations' },
    stats: [
      { value: m('cel-founders').shown, label: 'founders and investors', metric: 'cel-founders' },
      { value: m('cel-impr').shown, label: 'impressions', metric: 'cel-impr' },
      { value: m('cel-rev').shown, label: 'event revenue', metric: 'cel-rev' },
    ],
    chips: [],
  },
]

// ── Data projects: the four ledger cards. Headline figures read from the metrics registry;
//    the pointer text stays verbatim from the resume. ──
export interface DataLedger {
  n: string
  title: string
  where: string
  points: string[]
  result: string
  /** metric registry id behind the result figure (hover proof) */
  resultMetric: string
  resLabel: string
  tech: string
}
export const DATA_LEDGERS: DataLedger[] = [
  {
    n: '01',
    title: 'Content Virality Prediction & Segmentation',
    where: `YouTube Trending dataset · ${m('d1-videos').shown} videos`,
    points: [
      'Built NLP features from titles and tags; applied K-means to segment 200K+ videos into archetypes by views and engagement.',
      'Trained an XGBoost classifier predicting trending content at 82% AUC; surfaced the key drivers for content decisions via SHAP.',
    ],
    result: `${m('d1-auc').shown} AUC`,
    resultMetric: 'd1-auc',
    resLabel: 'trending-content classifier',
    tech: 'SQL · Python · scikit-learn · XGBoost',
  },
  {
    n: '02',
    title: 'Mutual Fund Activation & Retention',
    where: `Synthetic/AMFI investment data · ${m('d2-users').shown} users`,
    points: [
      'Queried investment data via SQL; segmented 50K users by activation stages and constructed detailed 90-day retention cohort views.',
      'Identified dormant user personas using RFM analysis; proposed re-engagement features backed by cohort-driven insights.',
    ],
    result: m('d2-users').shown,
    resultMetric: 'd2-users',
    resLabel: 'users · 90-day retention cohorts',
    tech: 'SQL · Python · Excel',
  },
  {
    n: '03',
    title: 'Growth Attribution & CAC Optimization',
    where: `Neobank fintech · ${m('d3-records').shown} campaign records`,
    points: [
      'Trained XGBoost on 45K neobank campaign records; used SHAP to attribute conversions across 5 digital and direct channels.',
      'Identified the top acquisition signals per channel; built an AI reallocation model reducing simulated CAC by 28% across the channel mix.',
    ],
    result: m('d3-cac').shown,
    resultMetric: 'd3-cac',
    resLabel: 'simulated CAC, AI reallocation',
    tech: 'Python · scikit-learn · SHAP · SQL',
  },
  {
    n: '04',
    title: 'Loan Risk Segmentation & Default Prediction',
    where: `LendingClub dataset · ${m('d4-records').shown} loan records`,
    points: [
      'Queried 100K+ loan records via SQL; segmented users into 5 risk profiles using structured RFM-style feature analysis.',
      'Built a logistic regression model to predict defaults; mapped risk segments to product features and targeted UX interventions.',
    ],
    result: m('d4-records').shown,
    resultMetric: 'd4-records',
    resLabel: 'records → 5 risk profiles',
    tech: 'SQL · Python · scikit-learn',
  },
]

if (process.env.NODE_ENV !== "production") assertNoDeadLinks()
