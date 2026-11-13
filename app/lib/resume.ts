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
        'Owned **Status Tracking** 0→1: 90,000-order SQL analysis, user research, PRDs (v0 and v1), HLD and dev-testing; **200 users save 250 hrs/wk**',
        'Designed a **cron pipeline for 400 docs/day** via bots, portal and fax APIs; order matching at **85% coverage, 96% precision** (coverage-first trade-off)',
        'Built an **agentic calling MVP on Vapi** for inquiry calls from 4 months of data, call checklists and configs; 20-user pilot, **92% accuracy**',
        'Shipped a **unified QC UI** after user interviews found QC juggling 4 platforms: **2x throughput, 40% faster error fixes**, 2,500 orders/day',
        'Built **Pulse**, a RAG tool-calling auto-RCA tool with a chatbot, eval-tested: flags 15 metric drops/day at **87% precision**, 60% RCA coverage',
        'Launched **RISA Assist** on the Chrome Store: parses portal HTML and auto-fills answers, cutting **portal filing TAT 60%**',
        'Shipped **Document Studio** on standard APIs to fetch and process clinical docs; replaced Acrobat, **saved $10K/yr, step TAT cut 70%**; revamped 4 key order UI steps with tech, design and compliance, **time-per-order cut 10%**',
      ],
    },
    {
      name: 'InvestMates', role: 'Product Manager (Part-time)', when: 'Jul 2025 – Sep 2025', place: 'Seattle, US (Remote) · AI Wealth Management for NRIs',
      bullets: [
        'Owned **E2E onboarding** (risk, goal and portfolio import) from PRD to launch in Jira: **completion up 19%, portfolio up 22%, TTFV cut 15%**',
        'Portfolio import was buried, so A/B tested it as a homepage checkpoint (sample 4,200, p < 0.05): **homepage CTR up 25%, sessions up 10%**',
        'Ran CleverTap lifecycle email and notification campaigns for 3,000 users on funnel data: **drop-offs cut 18%, D7 retention up 3 pp**',
      ],
    },
    {
      name: 'Suzlon Group', role: 'Summer Intern (Team Lead)', when: 'May 2025 – Jul 2025', place: 'Pune · Renewable Energy',
      bullets: [
        'Led 5 interns on an 8-state CSR analysis and presented Power BI KPI dashboards to leadership',
        'Automated **10 workflows** with n8n, AI agents and IMAP email parsing to build CSVs and PPTs: **reporting time cut 66%**',
      ],
    },
    {
      name: 'Chimera VC', role: 'Investment Analyst Intern', when: 'Mar 2025 – May 2025', place: 'Singapore (Remote) · Gaming Venture Capital',
      bullets: [
        'Evaluated 10 early-stage gaming startups; co-authored **7 memos** for the **$4M pipeline**, enabling **3 term sheets, 2 investments**',
        'Drove **3 term sheets and 2 closed investments**; owned end-to-end due diligence and deal flow in a lean team of 4',
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
        'Mined **94,600 reviews** via an agentic extractor (Amazon, Play, Trustpilot, App Store and Reddit) and a 6-stage SQL pipeline; isolated **4 root causes**',
        'Interviewed 6 users; built a Vercel-deployed guided follow-up MVP over 54,000 Bayesian-rated SKUs: **null results down 27.3% to 8%** (150 sessions)',
        'Embedding fallback for vague queries (**top-3 88%**); RAG chatbot AI evals **96.5% pass (113)**; **78.7% resolved in 2 follow-ups (150)**',
      ],
    },
    {
      name: 'Research Agent', role: 'An n8n workflow that turns Reddit and Hacker News into PRDs', when: '', place: 'n8n, Ollama (Llama 3), Python, REST APIs',
      bullets: [
        'Built a **28-node agentic workflow** (auto subreddit discovery, LLM theme classification) that aggregates **over 500 pain points per run**',
        'Deployed on a schedule with a form-based UI, keyword expansion and history logging: **research-to-spec time cut 70%**',
      ],
    },
  ] satisfies Entry[],
  corporate: [
    {
      name: 'Everyday Diamonds', role: 'Team Lead of 10 · GTM and Series A', when: 'Aug 2024 – Sep 2024', place: 'Bengaluru · 180 Degrees Consulting',
      bullets: [
        'Modeled profitability, pricing and projections; expansion roadmap and Series A deck aided a **$2.5M raise** (All In Capital); first store launched',
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
        'Selected 1 of 8 from over 1,000 students; leading 2026 batch placements with a **25-member team**',
        'Placed **240 students** since May 2026, lifting batch placement from **58% to 85%**; **Project SYNERGY** 3-campus centralization proposal approved',
      ],
    },
    {
      name: '180 Degrees Consulting, BITS Goa', role: 'Director', when: 'May 2025 – Jun 2026', place: '',
      bullets: [
        'Youngest Director to lead **45 consultants across 16 projects**, driving **30% YoY revenue growth**; awarded Best Consultant as a sophomore',
        'Spearheaded Consultathon, BITS Goa\u2019s flagship case competition: **₹17L in sponsorships**, 3,200 registrations; PM and consulting courses to 50,000 impressions',
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
    'Programming and AI: Python, SQL, JavaScript, Next.js, APIs, HLD, RAG, AI agents, MCP, LLM evals, Claude Code, GitHub',
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
