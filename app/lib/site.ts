// Site-wide constants and section data that is not part of the posts/projects content.
import { m } from './metrics'
import { PROJECTS } from './content'

export const RESUME_URL = '/Suparna-Deshmukh-Resume.pdf' // generated: scripts/build-resume-pdf.mjs
/** Canonical origin for metadata. Set NEXT_PUBLIC_SITE_URL once a domain exists (Section 7 #13). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3210'

/** Theme preference cycle (P1-9): system -> light -> dark. Stored in localStorage 'theme'. */
export type ThemePref = 'system' | 'light' | 'dark'
export const DEFAULT_THEME: ThemePref = 'system'
export const NEXT_THEME: Record<ThemePref, ThemePref> = { system: 'light', light: 'dark', dark: 'system' }
export const THEME_COLORS: Record<'light' | 'dark', string> = { light: '#F1F4EF', dark: '#0E1512' }
export function resolveTheme(pref: ThemePref, systemDark: boolean): 'light' | 'dark' {
  return pref === 'system' ? (systemDark ? 'dark' : 'light') : pref
}
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

/* P2-1: the one-sentence positioning line under the hero nameplate (option A from the
   improvement brief). Every clause is provable from the page: AI products (RISA, AskCart),
   high-stakes (US healthcare), measurement (evals, placement readings). */
export const HERO_LINE = 'I build AI products for messy, high-stakes workflows, and measure what changes.'

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
          { value: `${m('risa-coverage').shown} / ${m('risa-precision').shown}`, label: 'order matching, coverage-first trade-off', metric: 'risa-precision' },
          { value: m('risa-vapi').shown, label: 'accuracy on the Vapi calling MVP', metric: 'risa-vapi' },
          { value: m('risa-qc').shown, label: 'QC throughput on the unified UI', metric: 'risa-qc' },
          { value: m('risa-pulse').shown, label: 'precision on Pulse auto-RCA', metric: 'risa-pulse' },
        ],
        bullets: [
          { lead: 'Status Tracking 0→1, owned end to end', rest: ' — 90k-order SQL analysis, user research, PRDs v0 to v1, HLD, dev-testing; 200 users save 350 hrs/wk.' },
          { lead: '400 docs/day on a cron pipeline', rest: ' — bots, portal and fax APIs; order matching at 85% coverage, 96% precision, a coverage-first trade-off.' },
          { lead: '92% accuracy on inquiry calls', rest: ' — agentic calling MVP on Vapi from 4 months of data; call checklists and configs, a 20-user pilot.' },
          { lead: '2x QC throughput, 40% faster fixes', rest: ' — interviews found QC juggling 4 platforms; prototyped and shipped a unified UI, 2500 orders/day.' },
          { lead: '87% precision on auto-RCA', rest: ' — built Pulse, a RAG tool-calling auto-RCA with chatbot; flags 15 metric drops/day, 60% coverage.' },
          { lead: '60% faster portal filing', rest: ' — launched RISA Assist on the Chrome Store; parses portal HTML, auto-fills answers.' },
          { lead: '$10K/yr saved, 70% step TAT cut', rest: ' — Document Studio on standard APIs fetches and processes clinical docs; replaced Acrobat.' },
          { lead: '30% time-per-order cut', rest: ' — revamped 4 key UI steps for edge cases with tech, design and compliance, from user research and Amplitude.' },
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
        { lead: 'Lifted homepage CTR 25%, sessions 10%', rest: ' — authoring PRDs for the homepage revamp and AI portfolio health, A/B tested (n=4200, p<0.05).' },
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
          { lead: 'Co-authored 7 investment memos', rest: ' behind the $4M pipeline; enabled 3 term sheets and 2 investments.' },
          { lead: 'Vetted 10 early-stage gaming startups', rest: ' on benchmarks, traction and CAC/LTV; owned end-to-end due diligence.' },
          { lead: 'Ran deal flow in a lean team of 4', rest: ' — pipeline, term sheets and closed investments tracked end to end.' },
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

export type Attribution = 'led' | 'built' | 'contributed' | 'supported'
/** Wording ladder legend, shown once per section (Appendix B of the sections brief). */
export const ATTRIBUTION_LEGEND = 'led — I owned it end to end · built — I produced the artifact · contributed — part of a team effort · supported — I assisted the owner'

export interface CorporateRow { label: string; attribution: Attribution; evidence?: string }
export interface Corporate {
  id: string
  no: number
  name: string
  /** one line on what the client does — hidden until supplied (input C1) */
  descriptor?: string
  engagement: { via: '180DC' | 'independent'; role: string }
  when: string
  where: string
  /** Ask / My part / Outcome lines — hidden until supplied in Suparna's words (inputs C3) */
  askLine?: string
  myPart?: string
  outcome?: string
  /** exactly three deliverable lines — plain artifact statements, no verdict words */
  rows: CorporateRow[]
  /** the one number the file is remembered for. No gauge for money values (C-2). */
  proof: { value: string; label: string }
  proofMetric?: string
  /** attribution for the headline number */
  proofAttribution: Attribution
  doc: { type: string }
  /** the rubber stamp — never a claim larger than her role (input C6) */
  stamp: string
  deck?: { label: string; href?: string; thumb?: string }
  points: string[]
  chips: (Stat & { attribution: Attribution })[]
  ask: string
}

export const CORPORATE: Corporate[] = [
  {
    id: 'kri' + 'she', no: 1, name: 'KriSHE Carbon',
    engagement: { via: '180DC', role: 'Team Lead · GTM and Fundraising' },
    when: 'Jul 2025 – Aug 2025', where: 'Gurugram',
    rows: [
      { label: 'Investor deck and model', attribution: 'built' },
      { label: 'Biochar impact metrics', attribution: 'built' },
      { label: '20+ high-fit buyers', attribution: 'led' },
    ],
    proof: { value: m('kc-grants').shown, label: 'in grants the deck and biochar model pursued, with the client team' },
    proofMetric: 'kc-grants',
    proofAttribution: 'built',
    doc: { type: 'Grant review' },
    stamp: 'Grants pursued',
    points: [
      'Built the investor pitch deck and financial projections; a scalable biochar model and impact metrics enabled ₹12.5L in grants.',
      'Ran carbon market and buyer research; developed the positioning and sales narrative, identifying 20+ high-fit opportunities.',
    ],
    chips: [
      { value: m('kc-grants').shown, label: 'grants pursued, with the client team', metric: 'kc-grants', attribution: 'built' },
      { value: m('kc-buyers').shown, label: 'high-fit opportunities', metric: 'kc-buyers', attribution: 'led' },
    ],
    ask: "Hi Suparna, I'd like to hear about the KriSHE Carbon fundraising work.",
  },
  {
    id: 'everyday', no: 2, name: 'Everyday Diamonds',
    engagement: { via: '180DC', role: 'Team Lead · GTM and Series A Fundraising' },
    when: 'Aug 2024 – Sept 2024', where: 'Bengaluru',
    rows: [
      { label: 'Profitability, pricing and projections model', attribution: 'built' },
      { label: '4-year expansion roadmap, 5 stores', attribution: 'led' },
      { label: 'Series A deck ($2.5M raise)', attribution: 'built' },
    ],
    proof: { value: m('ed-raise').shown, label: 'Series A the deck aided, All In Capital; first store launched' },
    proofMetric: 'ed-raise',
    proofAttribution: 'built',
    doc: { type: 'Series A deck' },
    stamp: 'Series A aided',
    deck: { label: 'Series A deck', href: '' },
    points: [
      'Modeled profitability, pricing and financial projections; built the 4-year expansion roadmap and the Series A deck that aided a $2.5M raise from All In Capital.',
      'Formulated the offline expansion strategy for 5 stores across India — and the first one launched in Bengaluru.',
    ],
    chips: [
      { value: m('ed-raise').shown, label: 'Series A, All In Capital', metric: 'ed-raise', attribution: 'built' },
      { value: m('ed-stores').shown, label: 'store expansion roadmap', metric: 'ed-stores', attribution: 'led' },
    ],
    ask: "Hi Suparna, I'd like to hear about the Everyday Diamonds file: the pricing model, the 4-year expansion roadmap and how the Series A deck aided the $2.5M raise.",
  },
  {
    id: 'fedaykin', no: 3, name: 'Fedaykin AV',
    engagement: { via: 'independent', role: 'GTM Strategy Consultant' },
    when: 'Jul 2024 – Aug 2024', where: 'Remote',
    rows: [
      { label: 'Competitor benchmarks', attribution: 'built' },
      { label: 'Pricing and unit-economics model', attribution: 'built' },
      { label: '950-client B2B sizing', attribution: 'led' },
    ],
    proof: { value: m('fa-unit').shown, label: 'unit economics lift found by the pricing audit, across specs, ops and annotation costs — modeled, basis pending confirmation' },
    proofMetric: 'fa-unit',
    proofAttribution: 'built',
    doc: { type: 'Pricing audit' },
    stamp: 'Pricing audit done',
    deck: { label: 'Project report', href: '' },
    points: [
      'Formulated the GTM strategy via market research, competitor analysis and a refined product-market fit for stronger positioning.',
      'Optimized the pricing strategy across technical specs, operations and annotation costs, improving unit economics by 30%.',
      'Curated a database of 950 potential AV clients and ran a bottom-up B2B market sizing to inform a scalable business model.',
    ],
    chips: [
      { value: m('fa-unit').shown, label: 'unit economics (pricing audit)', metric: 'fa-unit', attribution: 'built' },
      { value: m('fa-clients').shown, label: 'client database', metric: 'fa-clients', attribution: 'led' },
    ],
    ask: "Hi Suparna, I'd like to hear about the Fedaykin AV GTM strategy work.",
  },
]

/** The single header sentence that replaces the aggregate chips (C-4). */
export const CORPORATE_LEDE = 'Three client engagements: two 180 Degrees Consulting team leads and one independent file. Every file ends in a deck, and every number on it is one I can defend.'

export const CORPORATE_AGG: Stat[] = [
  { value: m('ed-raise').shown, label: 'Series A raised', metric: 'ed-raise' },
  { value: m('kc-grants').shown, label: 'grants enabled', metric: 'kc-grants' },
  { value: m('fa-unit').shown, label: 'unit economics', metric: 'fa-unit' },
]

// ── About page: education, skills, honors ──

export const EDUCATION = {
  school: 'BITS Pilani, Goa Campus',
  degree: 'B.E. (Hons.) Electronics and Communication Engineering',
  branch: 'Electronics and Communication Engineering',
  minor: 'Minor in Finance',
  when: 'Aug 2023 – May 2027',
  classYear: 'Class of 2027',
  classOf: 2027,
  from: 2023,
  grades: 'CGPA 7.35/10 · Finance GPA 8.8/10',
}

export interface Honor {
  rank: string
  of: string
  name: string
  note: string
  organiser: string
  year: number
  crest: { text: string; color: string }
  deck?: { label: string; href?: string }
}
export const ACHIEVEMENTS: Honor[] = [
  { rank: m('acc-rank').shown, of: m('acc-of').shown, name: "Accenture Strategy Connect '25", note: 'GenAI in supply chain, India', organiser: 'Accenture', year: 2025, crest: { text: 'A', color: '#E2401B' }, deck: { label: 'Case deck', href: '' } },
  { rank: m('iima-rank').shown, of: m('iima-of').shown, name: "IIMA Fintech Frontier '24", note: '0→1 product design and GTM', organiser: 'Indian Institute of Management Ahmedabad', year: 2024, crest: { text: 'IIM', color: '#1F4E8C' }, deck: { label: 'Case deck', href: '' } },
  { rank: m('nl-rank').shown, of: m('nl-of').shown, name: "NextLeap PM Fellowship '26", note: 'Guided AI search for Google Photos', organiser: 'NextLeap', year: 2026, crest: { text: 'N', color: '#0E9F8A' }, deck: { label: 'Project deck', href: '' } },
]

export const CONSULTATHON_URL = 'https://unstop.com/competitions/consultathon-50-bits-pilani-k-k-birla-goa-campus-1674892'

export interface Position {
  id: string
  no: number
  org: string
  title: string
  when: string
  current?: boolean
  /** one line: selection and team size (the scope) */
  blurb: string
  /** the one headline figure for the panel (R-1 default) */
  headline: { metric: string; label: string }
  /** static sponsor line — replaces the marquee (R-4) */
  sponsors?: string[]
  /** one plain line for Project SYNERGY (R-5) */
  noteLine?: string
  /** secondary stats, shown in the More detail disclosure only (R-2) */
  stats: Stat[]
  chips: { text: string; href?: string; metric?: string }[]
}

/** Positions of responsibility, as the highlights of the college years. */
export const POSITIONS: Position[] = [
  {
    id: 'placement', no: 1, org: 'BITS Goa', title: 'Placement Coordinator', when: 'May 2026 – Present', current: true,
    blurb: 'Selected 1 of 8 out of 1,000+ students. Leads campus placements and corporate outreach for the 2026 batch, end-to-end, with a 25-member team.',
    headline: { metric: 'pc-rate', label: 'batch placement, May to October 2026' },
    noteLine: 'Project SYNERGY: a phased proposal to centralize placement and internship drives across the three BITS campuses — approved.',
    stats: [
      { value: m('pc-placed').shown, label: 'students placed', metric: 'pc-placed' },
      { value: m('pc-team').shown, label: 'team led end-to-end', metric: 'pc-team' },
    ],
    chips: [
      { text: '1 of 8 selected', metric: 'pc-select' },
      { text: 'Project SYNERGY approved · 3 campuses' },
    ],
  },
  {
    id: 'consult', no: 2, org: '180 Degrees Consulting', title: 'Director', when: 'May 2025 – Jun 2026',
    blurb: '45 consultants across 16 projects, 30% YoY revenue growth (club year over prior year). Awarded “Best Consultant” as a sophomore.',
    headline: { metric: 'dc-sponsor', label: 'Consultathon sponsorships, 3,200 registrations' },
    sponsors: ['Uplearn by Upstox', 'NextLeap', 'Unstop', 'The MBA Edge'],
    stats: [
      { value: m('dc-reg').shown, label: 'Consultathon registrations', metric: 'dc-reg' },
      { value: m('dc-rev').shown, label: 'club YoY revenue growth', metric: 'dc-rev' },
      { value: m('dc-courses').shown, label: 'course impressions · 85% retention', metric: 'dc-courses' },
    ],
    chips: [{ text: 'Best Consultant' }, { text: 'Consultathon on Unstop', href: CONSULTATHON_URL }],
  },
  {
    id: 'cel', no: 3, org: 'Center for Entrepreneurial Leadership', title: 'Creative Director', when: 'May 2025 – Jun 2026',
    blurb: "Coalescence'24: 40+ founders, investors and partners on stage — including Ankur Warikoo and UTI. Led a 20-member team across marketing and operations.",
    headline: { metric: 'cel-impr', label: "Coalescence'24 impressions" },
    stats: [
      { value: m('cel-founders').shown, label: 'founders, investors and partners secured', metric: 'cel-founders' },
      { value: m('cel-rev').shown, label: 'event revenue', metric: 'cel-rev' },
      { value: m('cel-team').shown, label: 'team across marketing and operations', metric: 'cel-team' },
    ],
    chips: [],
  },
]

// ── Data projects: the four ledger cards. Headline figures read from the metrics registry;
//    the pointer text stays verbatim from the resume. Sections brief D-1: provenance,
//    result kind (outcome / modeled / measured / scale) and figure status are asserted. ──
export type Provenance = 'public' | 'synthetic' | 'client'
export type ResultKind = 'outcome' | 'modeled' | 'measured' | 'scale'
export interface DataLedger {
  n: string
  rank: number
  title: string
  where: string
  /** where the data came from; undefined until confirmed → chip hidden, figure tagged Illustrative (D2) */
  provenance?: Provenance
  /** the one-sentence finding (input D1) — hidden until supplied */
  finding?: string
  points: string[]
  result: string
  /** metric registry id behind the result figure (hover proof) */
  resultMetric: string
  resLabel: string
  /** drives the label: Result / Modeled / Scale (D-1) */
  kind: ResultKind
  figure: { type: 'spike' | 'heatmap' | 'bars' | 'donut'; status: 'real' | 'illustrative' }
  tech: string
  links?: { repo?: string; notebook?: string }
  detail?: { method?: string[]; informs?: string; limits?: string }
}
export const DATA_LEDGERS: DataLedger[] = [
  {
    n: '02',
    rank: 1,
    title: 'Mutual Fund Activation & Retention',
    where: `Synthetic/AMFI investment data · ${m('d2-users').shown} users`,
    provenance: 'synthetic',
    points: [
      'Queried investment data via SQL; segmented 50K users by activation stages and constructed detailed 90-day retention cohort views.',
      'Identified dormant user personas using RFM analysis; proposed re-engagement features backed by cohort-driven insights.',
    ],
    result: m('d2-users').shown,
    resultMetric: 'd2-users',
    resLabel: 'users segmented into 90-day retention cohorts',
    kind: 'scale',
    figure: { type: 'heatmap', status: 'illustrative' },
    tech: 'SQL · Python · Excel',
  },
  {
    n: '03',
    rank: 2,
    title: 'Growth Attribution & CAC Optimization',
    where: `Neobank fintech · ${m('d3-records').shown} campaign records`,
    provenance: undefined, // source not yet confirmed (input D2)
    points: [
      'Trained XGBoost on 45K neobank campaign records; used SHAP to attribute conversions across 5 digital and direct channels.',
      'Identified the top acquisition signals per channel; built an AI reallocation model reducing simulated CAC by 28% across the channel mix.',
    ],
    result: m('d3-cac').shown,
    resultMetric: 'd3-cac',
    resLabel: 'simulated CAC under AI reallocation of the channel mix',
    kind: 'modeled',
    figure: { type: 'bars', status: 'illustrative' },
    tech: 'Python · scikit-learn · SHAP · SQL',
  },
  {
    n: '01',
    rank: 3,
    title: 'Content Virality Prediction & Segmentation',
    where: `YouTube Trending dataset · ${m('d1-videos').shown} videos`,
    provenance: 'public',
    points: [
      'Built NLP features from titles and tags; applied K-means to segment 200K+ videos into archetypes by views and engagement.',
      'Trained an XGBoost classifier predicting trending content at 82% AUC; surfaced the key drivers for content decisions via SHAP.',
    ],
    result: `${m('d1-auc').shown} AUC`,
    resultMetric: 'd1-auc',
    resLabel: 'trending-content classifier',
    kind: 'outcome',
    figure: { type: 'spike', status: 'illustrative' },
    tech: 'SQL · Python · scikit-learn · XGBoost',
  },
  {
    n: '04',
    rank: 4,
    title: 'Loan Risk Segmentation & Default Prediction',
    where: `LendingClub dataset · ${m('d4-records').shown} loan records`,
    provenance: 'public',
    points: [
      'Queried 100K+ loan records via SQL; segmented users into 5 risk profiles using structured RFM-style feature analysis.',
      'Built a logistic regression model to predict defaults; mapped risk segments to product features and targeted UX interventions.',
    ],
    result: m('d4-records').shown,
    resultMetric: 'd4-records',
    resLabel: 'records segmented into 5 risk profiles',
    kind: 'scale',
    figure: { type: 'donut', status: 'illustrative' },
    tech: 'SQL · Python · scikit-learn',
  },
]
/** The method strip (D-3): the four labelled steps shared by every card. */
export const METHOD_STEPS = ['Question', 'Data', 'Analysis', 'Result']

/** Sections-brief assertions (X-1): dev-only, throws on indefensible data. */
export function assertSections() {
  const problems: string[] = []
  for (const c of CORPORATE) {
    if (c.rows.length !== 3) problems.push(`CORPORATE[${c.id}]: expected exactly 3 rows`)
    for (const r of c.rows) {
      if (!r.attribution) problems.push(`CORPORATE[${c.id}].row "${r.label}": missing attribution`)
    }
    if (c.proofMetric) {
      const mt = m(c.proofMetric)
      if (mt.num != null && mt.den != null && Math.abs(mt.num / mt.den * 100 - parseFloat(mt.shown)) >= 0.05) {
        problems.push(`CORPORATE[${c.id}].proof: ${mt.num}/${mt.den} does not reproduce ${mt.shown}`)
      }
    }
    if (c.deck?.href && !link(c.deck.href)) problems.push(`CORPORATE[${c.id}].deck: dead href`)
  }
  for (const d of DATA_LEDGERS) {
    if (!d.kind) problems.push(`DATA_LEDGERS[${d.n}]: missing result kind`)
    if (d.provenance === undefined && d.figure.status !== 'illustrative') {
      problems.push(`DATA_LEDGERS[${d.n}]: unconfirmed provenance must use an illustrative figure`)
    }
  }
  for (const p of POSITIONS) {
    if (!p.headline?.metric) problems.push(`POSITIONS[${p.id}]: missing headline metric`)
  }
  for (const a of ACHIEVEMENTS) {
    if (!a.rank || !a.organiser) problems.push(`ACHIEVEMENTS[${a.name}]: missing result or organiser`)
    if (a.deck?.href && !link(a.deck.href)) problems.push(`ACHIEVEMENTS[${a.name}].deck: dead href`)
  }
  if (problems.length) throw new Error(`[sections] ${problems.join('; ')}`)
}

if (process.env.NODE_ENV !== "production") { assertNoDeadLinks(); assertSections() }
