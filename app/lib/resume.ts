import { EMAIL, PHONE, SOCIALS } from './site'

/**
 * The single home for resume copy — what `/resume` renders and what
 * scripts/build-resume-pdf.mjs prints to public/Suparna-Deshmukh-Resume.pdf.
 * House style (enforced by assertResume in dev and scripts/check-resume.mjs):
 *   - each bullet reads problem, then action, then result
 *   - fewest bullets that carry the proof; professional language
 *   - max 125 characters per printed line (a bullet may wrap once, i.e. <= 250)
 *   - bold the important words with **…**
 *   - write "and", never "&"; no plus signs, equals signs or em dashes
 *     ("over 500", not "500+")
 * Contact lines are exempt from the symbol rules (phone numbers need the +).
 */

export interface Entry { name: string; role: string; when: string; place: string; bullets: string[] }

export const RESUME = {
  name: 'Suparna Deshmukh',
  standfirst: 'Associate Product Manager · BITS Pilani, Goa Campus · Class of 2027',
  contact: [PHONE, EMAIL, SOCIALS.linkedin, SOCIALS.github].filter(Boolean),
  education: {
    school: 'BITS Pilani, Goa Campus',
    when: 'Aug 2023 – May 2027',
    lines: [
      'B.E. (Hons.) in Electronics and Communication Engineering, Minor in Finance',
      'CGPA 7.35/10 · Finance GPA 8.8/10',
    ],
  },
  experience: [
    {
      name: 'RISA Labs', role: 'Associate Product Manager Intern', when: 'Jul 2026 – Present', place: 'Bengaluru · AI Workflows for US Healthcare',
      bullets: [
        'Owned **Status Tracking** 0→1: SQL analysis of 90,000 orders, user research, PRDs (v0 and v1), HLD and dev-testing; **200 users save 250 hrs/wk**',
        'Built an **AI cron pipeline for 400 docs/day** via bots, portal and fax APIs; order matching at **85% coverage, 96% precision** (coverage-first trade-off)',
        "Inquiry calls took **12% of a user's day**, so built a **voice agent MVP on Vapi** from 4 months of data, checklists and configs: **92% success rate** in a 20-user pilot",
        'QC reviewers juggled **4 tools**, so prototyped, iterated and shipped a **unified UI**: **92 SUS (16 reviewers), 2x throughput, 42% faster fixes** on 2,500 orders/day',
        "Portal filing took **17% of a user's day**, so co-launched a **low-latency AI extension** on the Chrome Store, parsing HTML to autofill: **TAT cut 60%**",
        'Replaced Acrobat via **platform APIs** to fetch and process clinical docs by diagnosis across workflows: **saved $10K/yr, step TAT cut 70%**',
        'PMs hand-traced KPI drops, so built a **RAG, BigQuery auto-RCA tool** for my team to flag **15 drops/day** at **87% precision**, **64% RCA coverage**',
        'Prioritized a **Kanban roadmap** with Engineering, UX, GTM and Legal to revamp **4 UI steps** via user interviews and Amplitude: **time per order cut 11%**',
      ],
    },
    {
      name: 'InvestMates', role: 'Product Manager (Part-time)', when: 'Jul 2025 – Sep 2025', place: 'Seattle, US (Remote) · AI Wealth Management for NRIs',
      bullets: [
        'Owned **E2E onboarding** (risk, goal and portfolio import) from PRD to launch in Jira: **completion up 17%, portfolio up 22%, TTFV cut 15%**',
        'Portfolio import was buried, so A/B tested and added it as a homepage checkpoint (4,200 users, p < 0.05): **CTR up 25%, session length up 10%**',
        'Segmented **6,000 users into 10 activation drop-off cohorts**, ran **CleverTap email and push campaigns**: **drop-offs cut 18%, D7 retention up 3 pp**',
      ],
    },
    {
      name: 'Suzlon Group', role: 'Summer Intern (SPOC)', when: 'May 2025 – Jul 2025', place: 'Pune · Leading Renewable Energy Provider',
      bullets: [
        'Led **5 interns** on an 8-state CSR analysis; presented Power BI KPI dashboards and PPTs to leadership, **shaping spending for 2.3M beneficiaries**',
        'Reporting data sat in **email inboxes**, so automated it with **n8n, AI agents and IMAP parsing**: **reporting time cut 66%** over **10 workflows**',
      ],
    },
    {
      name: 'Chimera VC', role: 'Investment Analyst Intern', when: 'Mar 2025 – May 2025', place: 'Singapore (Remote) · Gaming Venture Capital',
      bullets: [
        'Wrote **7 investment memos**, leading to **$4M invested in 6 deals**',
        'Analyzed **10 B2C gaming startups** on benchmarks, traction and LTV/CAC; owned end-to-end due diligence and deal flow in a lean team of 4',
      ],
    },
    {
      name: 'PrimeWealth', role: 'GTM Intern', when: 'Dec 2024 – Mar 2025', place: 'Pune (Remote) · Wealth Management, US Expansion',
      bullets: [
        'Built the US market entry strategy: identified NRI pain points, sized SAM and SOM, mapped channels and content; **AUM up 16%, inbound leads up 40%**',
      ],
    },
  ] satisfies Entry[],
  projects: [
    {
      name: 'AskCart', role: 'Guided AI E-Commerce Search and Chatbot', when: '', place: 'Next.js, SQL, Python, RAG, ML, REST APIs',
      bullets: [
        'Mined **94,600 reviews** from **8 sources** with the Insight Extractor, a 6-stage SQL pipeline and K-means validation; isolated **4 root causes**',
        'Interviewed 6 users; built a Vercel-deployed guided follow-up MVP over 54,000 Bayesian-rated SKUs: **null results down 27.3% to 8%** (150 sessions)',
        'Devised an **ML semantic fallback** using **multilingual-e5-small** embeddings for vague-query similarity search: **top-3 relevance 88%** (100 queries)',
        'Built a RAG chatbot on **Gemini** LLM intent parsing and embedding search; AI evals for search, RAG and UX passed **96%** (113 cases)',
        'Integrated **click and event analytics** with properties and a funnel dashboard: **78.7% of searches resolved in 2 follow-ups** (150 sessions)',
      ],
    },
    {
      name: 'Insight Extractor', role: 'Agentic User Research Engine for PMs', when: '', place: 'Next.js, SQL, Gemini, Qwen, Redis, REST APIs',
      bullets: [
        'Engineered an **agentic tool** mining Reddit, HN, App Store, Play Store, GitHub, YouTube, Product Hunt and Trends at **82% rerun stability**',
        'Integrated a **6-stage pipeline** of LLM planning, scraping, SQL cleaning, labelling, analysis and reporting: **95% noise cut at 86% label accuracy**',
        'Capped web-version runs at **3 LLM calls** to control cost, with health-ranked API fallbacks, auto-recovery and run limits: **98% run success**',
      ],
    },
  ] satisfies Entry[],
  corporate: [
    {
      name: 'Everyday Diamonds', role: 'Team Lead of 10 · GTM and Series A', when: 'Aug 2024 – Sep 2024', place: 'Bengaluru · 180 Degrees Consulting',
      bullets: [
        'Modeled **pricing, profitability and projections**, a **4-year offline roadmap** and a **Series A deck** pitched to investors, raising **$2.5M** from All In Capital',
      ],
    },
    {
      name: 'Fedaykin AV', role: 'GTM Strategy Consultant', when: 'Jul 2024 – Aug 2024', place: 'Goa · Independent engagement',
      bullets: [
        'GTM strategy from market research; pricing optimization lifted **unit economics 30%**; curated a 950-client B2B database with bottom-up sizing',
      ],
    },
    {
      name: 'Kri' + 'SHE Carbon', role: 'Team Lead · GTM and Fundraising', when: 'Jul 2025 – Aug 2025', place: 'Gurugram · 180 Degrees Consulting',
      bullets: [
        'Investor deck and projections; a biochar model with impact metrics enabled **₹12.5L in grants**; identified over 20 high-fit opportunities',
      ],
    },
  ] satisfies Entry[],
  positions: [
    {
      name: 'BITS Goa', role: 'Placement Coordinator', when: 'May 2026 – Present', place: '',
      bullets: [
        'Selected **1 of 8** from over 1,000 students to lead campus placements and recruiter outreach, managing a **25-member team** end to end',
        'Drove the **2026 batch** placement cycle since May: placed **240 students**, lifting the placement percentage from **58% to 85%** by November',
        'Architected **Project SYNERGY**, a phased plan to centralize placement and internship drives across **3 BITS campuses**; secured admin approval',
        'Built **CampusMail AI**, an agentic outreach CRM on Flask, Supabase Postgres and Google Auth for a 15-person team: **3,700 emails, 4 campaigns**',
      ],
    },
    {
      name: '180 Degrees Consulting, BITS Goa', role: 'Director', when: 'May 2025 – Jun 2026', place: '',
      bullets: [
        'Youngest Director to lead **54 consultants** on **16 client projects**, driving **30% YoY revenue growth**; awarded Best Consultant as a sophomore',
        'Spearheaded **Consultathon**, BITS Goa\u2019s flagship case competition: **₹17L in sponsorships**, **3,200 registrations** via targeted outreach',
      ],
    },
    {
      name: 'Center for Entrepreneurial Leadership, BITS Goa', role: 'Creative Director', when: 'May 2025 – Jun 2026', place: '',
      bullets: [
        "Led a 20-member team for Coalescence '24: **over 40 founders and investors** incl. Ankur Warikoo, UTI; **400K impressions, over ₹10L revenue**",
      ],
    },
  ] satisfies Entry[],
  achievements: [
    "Top 8 of over 9,000 participants, Accenture Strategy Connect '25 (consulting case: GenAI in supply chain in India)",
    "Top 5 of over 2,500 participants, IIMA Fintech Frontier '24 (0→1 product design and GTM strategy)",
    "Top 10% of 270, NextLeap Product Management Fellowship '26 (guided AI search for Google Photos)",
  ],
  skills: [
    'Programming and AI: Python, SQL, JavaScript, Next.js, APIs, HLD, RAG, AI agents, n8n, MCP, agent skills, LLM evals, Claude Code, GitHub',
    'Product and analytics: Amplitude, Mixpanel, CleverTap, BigQuery, Firebase, Metabase, Power BI, Excel, Jira, Figma, A/B testing',
  ],
}

const BANNED = ['+', '=', '—', '&']
const LINE_LIMIT = 125

function bulletStrings(): string[] {
  const out: string[] = []
  for (const group of [RESUME.experience, RESUME.projects, RESUME.corporate, RESUME.positions]) {
    for (const e of group) out.push(...e.bullets, e.name, e.role, e.when, e.place)
  }
  out.push(...RESUME.achievements, ...RESUME.skills, ...RESUME.education.lines, RESUME.standfirst, RESUME.education.school)
  return out
}

export function assertResume() {
  for (const s of bulletStrings()) {
    if (!s) continue
    for (const b of BANNED) {
      if (s.includes(b)) throw new Error(`[resume] banned symbol "${b}" in: "${s.slice(0, 70)}"` + (b === '+' ? ' — write "over N"' : b === '=' ? ' — spell it out' : b === '&' ? ' — write "and"' : ' — use "to" or a colon'))
    }
    const plain = s.replace(/\*\*/g, '')
    if (plain.length > LINE_LIMIT * 2) throw new Error(`[resume] line over ${LINE_LIMIT * 2} chars (two ${LINE_LIMIT}-char lines): "${plain.slice(0, 70)}…"`)
  }
  const unbalanced = bulletStrings().find(s => (s.match(/\*\*/g)?.length ?? 0) % 2 !== 0)
  if (unbalanced) throw new Error(`[resume] unbalanced ** markers in: "${unbalanced.slice(0, 70)}"`)
}

if (process.env.NODE_ENV !== 'production') assertResume()
