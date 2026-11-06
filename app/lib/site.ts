// Site-wide constants and section data that is not part of the posts/projects content.

export const RESUME_URL = '#' // TODO: paste the resume link (Drive/website)
export const EMAIL = 'f20230611@goa.bits-pilani.ac.in'
export const PHONE = '+91 89569 67964'
export const GITHUB_USER = 'suparna-deshmukh'

export const SOCIALS = {
  linkedin: 'https://www.linkedin.com/in/suparna-deshmukh/', // TODO: confirm URL
  github: `https://github.com/${GITHUB_USER}`,
  x: '', // TODO: add the X handle; the X card stays hidden until it does
}

export const PREFILL_EVENT = 'contact:prefill'
export const ASK_OWN_MESSAGE = "Hi Suparna, I'd like to hear about your corporate consulting work."

export const NAV_SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'data', label: 'Data' },
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
export interface Stat { value: string; label: string }
interface RoleBase { title: string; meta: string; bullets: Bullet[] }
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
  roles: Role[]
}

// Bullet copy is from the resume (source of truth for numbers).
export const EXPERIENCE: Company[] = [
  {
    id: 'risa', name: 'RISA Labs', monogram: 'RL', city: 'Bengaluru', years: "'26 to now", metric: '500 hrs/wk', metricCaption: 'saved across 200 users by Status Tracking', summary: 'Associate Product Manager Intern · AI Workflows for US Healthcare', sector: 'Healthcare AI', group: 'product',
    roles: [
      { title: 'Associate Product Manager Intern', meta: 'Jul 2026 to Present · Healthcare AI · Bengaluru',
        hero: { value: '500 hrs/wk', label: 'saved across 200 users' },
        how: 'by owning Status Tracking 0→1: 90k-order SQL analysis, user research, user stories, PRDs (v0 to v1), HLD and dev-testing.',
        results: [
          { value: '75% / 96%', label: 'coverage / precision across 118 payers' },
          { value: '92%', label: 'accuracy on the Vapi calling MVP' },
          { value: '2x', label: 'QC throughput on the unified UI' },
          { value: '87%', label: 'precision on Pulse auto-RCA' },
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
    id: 'investmates', name: 'InvestMates', monogram: 'IM', city: 'Seattle (Remote)', years: "'25", metric: '25%', metricCaption: 'homepage CTR lift from the revamp A/B test', summary: 'Product Manager (Part-time) · AI Wealth Management for NRIs', sector: 'FinTech · Wealth', group: 'product',
    roles: [{ title: 'Product Manager (Part-time)', meta: 'Jul 2025 to Sept 2025 · FinTech · Seattle (Remote)',
      hero: { value: '25%', label: 'homepage CTR lift' },
      how: 'by authoring PRDs for the homepage revamp and AI portfolio health, A/B tested (n=4200, p<0.05).',
      results: [
        { value: '20%', label: 'longer sessions' },
        { value: '18%', label: 'drop-offs cut by lifecycle campaigns' },
        { value: '+3 pp', label: 'D7 retention' },
      ],
      bullets: [
        { lead: 'Lifted homepage CTR 25%, sessions 20%', rest: ' by authoring PRDs for the homepage revamp and AI portfolio health, ran A/B test (n=4200, p<0.05).' },
        { lead: 'Cut drop-offs 18%, D7 retention up 3 pp', rest: ' by running cohort CleverTap lifecycle email and notification campaigns for 3k users on user funnel data.' },
      ] }],
  },
  {
    id: 'suzlon', name: 'Suzlon Group', monogram: 'SZ', city: 'Pune', years: "'25", metric: '66%', metricCaption: 'reporting time cut by automated pipelines', summary: 'Summer Intern (Team Lead) · Renewable Energy', sector: 'Renewable Energy', group: 'industry',
    roles: [
      { title: 'Summer Intern (Team Lead)', meta: 'May 2025 to Jul 2025 · Renewable energy · Pune',
        hero: { value: '66%', label: 'reporting time cut' },
        how: 'by automating 20 data pipelines with n8n, AI agents and IMAP email parsing.',
        results: [
          { value: '8-state', label: 'CSR analysis led as team lead' },
          { value: '20', label: 'data pipelines automated' },
        ],
        bullets: [
          { lead: 'Led 5 interns on an 8-state CSR analysis', rest: ' with Excel and VBA; built and presented Power BI KPI dashboards and PPTs to leadership.' },
          { lead: 'Automated 20 data pipelines with n8n', rest: ' integrating AI agents and IMAP email parsing to build CSVs and PPTs; cut reporting time by 66%.' },
        ] },
    ],
  },
  {
    id: 'chimera', name: 'Chimera VC', monogram: 'CV', city: 'Singapore (Remote)', years: "'25", metric: '$5M', metricCaption: 'pipeline built · 3 term sheets · 2 investments', summary: 'Investment Analyst Intern · Gaming Venture Capital', sector: 'Venture Capital', group: 'industry',
    roles: [
      { title: 'Investment Analyst Intern', meta: 'Mar 2025 to May 2025 · Gaming venture capital · Singapore (Remote)',
        hero: { value: '$5M', label: 'pipeline built' },
        how: 'by vetting 10 early-stage startups on benchmarks, traction and CAC/LTV, co-authoring 7 memos.',
        results: [
          { value: '3', label: 'term sheets driven' },
          { value: '2', label: 'closed investments' },
        ],
        bullets: [
          { lead: 'Vetted 10 early-stage gaming startups', rest: ' on benchmarks, traction and CAC/LTV; co-authored 7 memos and sourced 2 leads.' },
          { lead: 'Drove 3 term sheets and 2 closed investments', rest: ' — key to the team’s $5M pipeline; shaped 4 additional deals through early-stage analysis.' },
          { lead: 'Owned end-to-end due diligence', rest: ' and deal-flow management on Notion, running core workflows in a lean team of 4.' },
        ] },
    ],
  },
  {
    id: 'primewealth', name: 'PrimeWealth', monogram: 'PW', city: 'Pune (Remote)', years: "'24 to '25", metric: '33%', metricCaption: 'AUM lift, US NRI market entry', summary: 'GTM Intern · Wealth Management, US Expansion', sector: 'Wealth Management', group: 'industry',
    roles: [
      { title: 'GTM Intern', meta: 'Dec 2024 to Mar 2025 · Wealth management, US expansion · Pune (Remote)',
        hero: { value: '33%', label: 'AUM lift' },
        how: 'by identifying US NRI pain points, sizing SAM/SOM and refining PMF for market entry.',
        results: [
          { value: '40%', label: 'inbound leads up' },
          { value: '50%', label: 'AUM growth in the scenario model' },
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
  points: string[]
  chips: Stat[]
  ask: string
}

export const CORPORATE: Corporate[] = [
  {
    id: 'everyday', name: 'Everyday Diamonds', role: 'Team Lead · GTM and Series A Fundraising', context: '180 Degrees Consulting engagement · Bengaluru',
    where: 'Bengaluru', when: 'Aug 2024 – Sept 2024', stamp: '$2.5M raised',
    proof: { value: '$2.5M', label: 'Series A raised from All In Capital, first store launched', gauge: 100 },
    points: [
      'Modeled profitability, pricing and financial projections; built the 4-year expansion roadmap and the Series A deck that aided a $2.5M raise from All In Capital.',
      'Formulated the offline expansion strategy for 5 stores across India — and the first one launched in Bengaluru.',
    ],
    chips: [{ value: '$2.5M', label: 'Series A, All In Capital' }, { value: '5', label: 'store expansion roadmap' }],
    ask: "Hi Suparna, I'd like to hear about the Everyday Diamonds Series A work.",
  },
  {
    id: 'fedaykin', name: 'Fedaykin AV', role: 'GTM Strategy Consultant', context: 'Independent consulting engagement',
    where: 'Remote', when: 'Jul 2024 – Aug 2024', stamp: '30% unit economics',
    proof: { value: '30%', label: 'unit economics improved across specs, ops and annotation costs', gauge: 30 },
    points: [
      'Formulated the GTM strategy via market research, competitor analysis and a refined product-market fit for stronger positioning.',
      'Optimized the pricing strategy across technical specs, operations and annotation costs, improving unit economics by 30%.',
      'Curated a database of 950 potential AV clients and ran a bottom-up B2B market sizing to inform a scalable business model.',
    ],
    chips: [{ value: '30%', label: 'unit economics' }, { value: '950', label: 'client database' }],
    ask: "Hi Suparna, I'd like to hear about the Fedaykin AV GTM strategy work.",
  },
  {
    id: 'kri' + 'she', name: 'KriSHE Carbon', role: 'Team Lead · GTM and Fundraising', context: '180 Degrees Consulting engagement · Gurugram',
    where: 'Gurugram', when: 'Jul 2025 – Aug 2025', stamp: '₹12.5L grants',
    proof: { value: '₹12.5L', label: 'in grants enabled via the deck and biochar model', gauge: 100 },
    points: [
      'Built the investor pitch deck and financial projections; a scalable biochar model and impact metrics enabled ₹12.5L in grants.',
      'Ran carbon market and buyer research; developed the positioning and sales narrative, identifying 20+ high-fit opportunities.',
    ],
    chips: [{ value: '₹12.5L', label: 'grants enabled' }, { value: '20+', label: 'high-fit opportunities' }],
    ask: "Hi Suparna, I'd like to hear about the KriSHE Carbon fundraising work.",
  },
]

export const CORPORATE_AGG: Stat[] = [
  { value: '$2.5M', label: 'Series A raised' },
  { value: '₹12.5L', label: 'grants enabled' },
  { value: '30%', label: 'unit economics' },
]

// ── About page: education, skills, honors ──

export const EDUCATION = {
  school: 'BITS Pilani, Goa Campus',
  degree: 'B.E. (Hons.) Electronics and Communication Engineering',
  minor: 'Minor in Finance',
  when: 'Aug 2023 – May 2027',
  classYear: 'Class of 2027',
}

export const ACHIEVEMENTS: { rank: string; of: string; name: string; note: string; crest: { text: string; color: string } }[] = [
  { rank: 'Top 8', of: '9,000+', name: "Accenture Strategy Connect '25", note: 'GenAI in supply chain, India', crest: { text: 'A', color: '#E2401B' } },
  { rank: 'Top 5', of: '2,500+', name: "IIMA Fintech Frontier '24", note: '0→1 product design and GTM', crest: { text: 'IIM', color: '#1F4E8C' } },
  { rank: 'Top 10%', of: '270', name: "NextLeap PM Fellowship '26", note: 'Guided AI search for Google Photos', crest: { text: 'N', color: '#0E9F8A' } },
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
    team: { count: 25, label: 'team led end-to-end' },
    stats: [
      { value: '58%→85%', label: 'batch placement in 5 months' },
      { value: '240', label: 'students placed' },
      { value: '25', label: 'team led end-to-end' },
    ],
    chips: [{ text: '1 of 8 selected' }, { text: 'Project SYNERGY approved · 3 campuses' }],
  },
  {
    id: 'consult', org: '180 Degrees Consulting', title: 'Director', when: 'May 2025 – Jun 2026',
    blurb: 'Youngest Director: 45 consultants across 16 projects, driving 30% YoY revenue growth. Awarded “Best Consultant” as a sophomore.',
    team: { count: 16, label: 'projects run across 45 consultants' },
    stats: [
      { value: '₹17L', label: 'Consultathon sponsorships' },
      { value: '3,200', label: 'Consultathon registrations' },
      { value: '30%', label: 'YoY revenue growth' },
      { value: '50K+', label: 'course impressions, 85% retention' },
    ],
    chips: [{ text: 'Best Consultant' }, { text: 'Consultathon — sponsored by Uplearn by Upstox, NextLeap, The MBA Edge & more · on Unstop', href: CONSULTATHON_URL }],
  },
  {
    id: 'cel', org: 'Center for Entrepreneurial Leadership', title: 'Creative Director', when: 'May 2025 – Jun 2026',
    blurb: "Coalescence'24: secured 40+ founders, investors and partners — including Ankur Warikoo and UTI. Led a 20-member team across marketing and operations; 400K+ impressions and ₹10L+ revenue.",
    team: { count: 20, label: 'team across marketing and operations' },
    stats: [
      { value: '40+', label: 'founders and investors' },
      { value: '400K+', label: 'impressions' },
      { value: '₹10L+', label: 'event revenue' },
    ],
    chips: [],
  },
]
