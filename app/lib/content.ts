// AUTO-GENERATED from the former Supabase tables, then hand-owned.
// This file is now the single source of truth for site content.
// To change what the site shows, edit the values below and redeploy.

/** Reading annotations shared by essays and case studies. Every string is verbatim from body. */
export interface Annotated {
  /** mark is a substring of text that gets the marker sweep. */
  pull_quote?: { text: string; mark?: string }
  /** Margin notes beside the lines they quote. The first 3 also show on the home sheet and the article header. */
  notes?: { label: string; line: string }[]
  /** Further lines that get the marker sweep as they are read. Keep it to a handful per piece. */
  highlights?: string[]
}

export interface Post extends Annotated {
  id: string
  slug: string
  title: string
  summary: string
  tag: string | null
  body: string | null
  reading_time: string | null
  cover_image_url?: string | null
  hero_image_url?: string | null
  coming_soon?: boolean
  is_published: boolean
  created_at: string
  updated_at?: string
  /** Leads the home Writing desk; otherwise the newest post leads. */
  pinned?: boolean
  /** Short standfirst for pile pages; falls back to summary. */
  dek?: string
}

export interface Project extends Annotated {
  id: string
  slug: string
  title: string
  summary: string
  tags: string[]
  body: string | null
  cover_image_url?: string | null
  diagram_url?: string | null
  live_url?: string | null
  /** Extra destination chips on the case card (Vercel deploy, PRD doc, ...). */
  links?: { label: string; href: string }[]
  /** Case-card stats: values are metric registry ids, so each number lives in one place. */
  stats?: { id: string; label: string; hot?: boolean }[]
  coming_soon?: boolean
  is_published: boolean
  created_at: string
  updated_at?: string
  label?: string
}

export interface Book {
  id: number
  title: string
  author: string
  cover_url: string
  note: string
  display_order: number
  is_active?: boolean
}

export interface NowData {
  id: number
  building: string
  reading: string
  thinking: string
  thinking_2: string
  thinking_3: string
  obsessing: string
  obsessing_label: string
  obsessing_image_url: string
  updated_at: string
}

// Published posts, newest first.
export const POSTS: Post[] = []

export const PROJECTS: Project[] = [
  {
    "id": "s-p1",
    "slug": "askcart",
    "title": "AskCart: Guided AI E-Commerce Search and Chatbot",
    "summary": "A guided follow-up search MVP over 54K Bayesian-rated SKUs that cut null results from 27.3% to 8%, with a RAG chatbot that passes evals at 96.5%.",
    "tags": ["Next.js", "SQL", "Python", "ML", "Gemini API"],
    "body": "## The problem\nAskCart started from a simple observation: e-commerce search fails silently. When the catalog returns nothing, the shopper doesn't file a ticket — they just leave. I wanted to see how often that happens and what the queries actually look like, so I started with the only dataset that would tell me the truth: reviews.\n\n## Mining 94,600 reviews for signal\nI built an agentic extractor on the Reddit, App Store and Play Store APIs and fed it into a 6-stage SQL pipeline. Across 94.6K reviews it isolated four root causes of search failure: vague intent, missing filter context, spelling and slang drift, and catalog gaps that no query could ever fix. Each cause got its own treatment instead of one generic \"no results\" page.\n\n## Ask, don't guess\nThe product decision was to replace the dead end with a guided follow-up: a Vercel-deployed MVP over 54K Bayesian-rated SKUs that asks one narrow question at a time — budget, use case, must-have feature — and re-runs the search with the answer. On 150 real search sessions, null results fell from 27.3% to 8%.\n\n## When the model is the fallback\nA lot of the remaining misses were Hinglish: \"sneekrs red\", \"waterproof for monsoon\". I built an ML semantic fallback using multilingual embeddings for similarity search, so vague or code-mixed queries still resolve. On a 100-query eval set, top-3 relevance hit 88%.\n\n## Evals before launch\nOn top of search I built a RAG chatbot on LLM intent parsing and embedding search. I wrote AI evals for search, RAG and UX before the first demo; the suite passes at 96.5% (n=113) and now guards every prompt and index change. User-level click and event analytics with properties show 78.7% of searches resolve within 2 follow-ups (n=150).\n\n## What shipped\nNext.js front end, SQL pipeline, Python + ML fallback, Gemini API for the chat. What I'd do differently: instrument the funnel from day one, and budget the embeddings before it budgets me.",
    "cover_image_url": "/images/projects/askcart-cover.webp",
    "links": [{ "label": "Live on Vercel", href: "#" }, { "label": "Read the PRD", href: "#" }],
    "stats": [
      { "id": "ac-null", "label": "null results, down from 27.3% (n=150)" },
      { "id": "ac-eval", "label": "RAG eval pass rate (n=113)" },
      { "id": "ac-follow", "label": "resolved within 2 follow-ups", "hot": true }
    ],
    "is_published": true,
    "created_at": "2026-08-20T10:00:00+00:00",
    "pull_quote": { "text": "When the catalog returns nothing, the shopper doesn't file a ticket — they just leave.", "mark": "they just leave" },
    "notes": [
      { "label": "The dataset", "line": "I started with the only dataset that would tell me the truth: reviews." },
      { "label": "The fix", "line": "null results fell from 27.3% to 8%" },
      { "label": "The guardrail", "line": "the suite passes at 96.5% (n=113)" }
    ],
    "highlights": [ "Each cause got its own treatment instead of one generic \"no results\" page." ]
  },
  {
    "id": "s-p3",
    "slug": "insight-extractor",
    "title": "Insight Extractor: Agentic User Insight Engine",
    "summary": "A Gemini-planned research agent: one brief in, eight live platforms tapped in parallel, signal bucketed by LLM + SQL, and a fixed-format User Insights Report out — on a strict ≤3 Gemini-calls-per-run budget.",
    "tags": ["Next.js", "TypeScript", "Gemini", "LLM agents", "REST APIs"],
    "body": "## Why\nPM work dies in the gap between “I need user signal” and eight open tabs of Hacker News, Reddit and app-store reviews. A manual sweep takes days, and most of it is dedup work.\n\n## The mechanism\nA four-step wizard captures the brief: topic, objective, audience, competitors, timeframe. Gemini plans the research from that brief — per-platform keywords, app hints, timeframes — then parallel fetchers hit the live APIs (Hacker News, Reddit, App Store, Play Store, GitHub, Google Trends, Product Hunt, YouTube). SQL stages clean and deduplicate the corpus, an LLM pass labels each record into insight buckets with sentiment, and the output is a fixed-format User Insights Report — snapshot, buckets, evidence, trend, competitor comparison, methodology — as shareable markdown.\n\n## Budget and guardrails\nStrictly ≤3 Gemini calls per run (plan → label → synthesize). The key pool rotates on quota failure with per-key daily caps, a per-user run window limits agent runs (default 5 per rolling 5 hours), and all shared state — budget, identity, windows — lives in one store: local JSON for single-instance, Redis for multi-instance Vercel, so the free-tier quota is enforced platform-wide, never per instance.\n\n## Modes\nRapid Scan (~1 minute, one Gemini call) for a fast pass; Standard; Deep Dive (~3–6 minutes, hundreds of records, full corpus labeling); and Raw Data, which skips synthesis and hands over the CSV.\n\n## Where it runs\nDeployed as a serverless app; the real run captured in the screenshots (“flipkart delivery”, deep mode) pulled 187 records across six platforms, dropped the irrelevant, and returned six buckets plus a full report in about 3.5 minutes.",
    "cover_image_url": "/images/projects/insight-extractor-cover.webp",
    "links": [],
    "stats": [
      { "id": "ie-platforms", "label": "live platforms tapped per run", "hot": true },
      { "id": "ie-records", "label": "records pulled in a deep run" },
      { "id": "ie-buckets", "label": "insight buckets per report" }
    ],
    "is_published": true,
    "created_at": "2026-08-18T10:00:00+00:00",
    "pull_quote": { "text": "A fixed-format User Insights Report — on a strict ≤3 Gemini-calls-per-run budget.", "mark": "≤3 Gemini-calls-per-run" },
    "notes": [
      { "label": "The brief", "line": "topic, objective, audience, competitors, timeframe" },
      { "label": "The engine", "line": "Gemini plans; live APIs run in parallel; SQL + LLM bucket the signal" },
      { "label": "The output", "line": "a report a PM can finish in four minutes" }
    ],
    "highlights": [ "Eight live platforms tapped in parallel from one brief", "A shared platform-wide Gemini budget, enforced across instances" ]
  },
  {
    "id": "s-p2",
    "slug": "research-agent",
    "title": "Research Agent: An n8n Workflow That Turns Reddit and Hacker News into PRDs",
    "summary": "A 28-node agentic workflow that scrapes Reddit and HN for 500+ pain points per run, clusters them by theme and drafts PRDs and user stories.",
    "tags": ["n8n", "Ollama (Llama 3)", "Python", "REST APIs"],
    "body": "## Why I built it\nAs a PM I kept doing the same thing by hand: reading threads, noting complaints, finding the pattern, drafting the spec. I wanted that loop to run itself — give it a topic, get back a prioritized pile of pain points and a first draft of the work.\n\n## The 28-node workflow\nThe agent is a 28-node n8n workflow with auto subreddit discovery. From a topic input it scrapes Reddit and Hacker News via their APIs, aggregates 500+ pain points per run, and hands them to an LLM pipeline on Ollama (Llama 3) that classifies feedback by theme, flags competitor mentions and generates PRDs and user stories.\n\n## From pain points to PRD\nThe output is a ranked theme list with quotes attached, then a PRD skeleton: problem statement, affected users, proposed solution and open questions. For a new product area, research-to-spec time dropped by 70% versus doing it by hand.\n\n## Scheduled, not one-shot\nIt runs on a schedule with a form-based UI, keyword expansion and history logging, so last week's themes and this week's themes are diffable. The history log is the part I use most — trends are visible only across runs.\n\n## What I'd change\nI'd add citations back into every generated claim, and I'd make the theme taxonomy a human-editable artifact instead of a prompt. The LLM is good at drafting; it's worse at knowing what it doesn't know.",
    "cover_image_url": "/images/projects/research-agent-cover.webp",
    "links": [{ "label": "Live on Vercel", href: "#" }, { "label": "Read the PRD", href: "#" }],
    "stats": [
      { "id": "ra-pain", "label": "pain points aggregated", "hot": true },
      { "id": "ra-nodes", "label": "nodes in the workflow" },
      { "id": "ra-cut", "label": "research-to-spec time cut" }
    ],
    "is_published": true,
    "created_at": "2026-06-15T10:00:00+00:00",
    "pull_quote": { "text": "I wanted that loop to run itself — give it a topic, get back a prioritized pile of pain points and a first draft of the work.", "mark": "run itself" },
    "notes": [
      { "label": "The scale", "line": "aggregates 500+ pain points per run" },
      { "label": "The payoff", "line": "research-to-spec time dropped by 70%" },
      { "label": "The blind spot", "line": "it's worse at knowing what it doesn't know" }
    ],
    "highlights": [ "The history log is the part I use most — trends are visible only across runs." ]
  }
]

// Single 'now' record.
export const NOW: NowData = {
  "id": 1,
  "building": "Status Tracking at RISA Labs",
  "reading": "",
  "thinking": "Where do AI agents stop being tools and start needing trust?",
  "thinking_2": "Coverage vs precision :\nIn regulated ops, which one do you buy with the other — and who decides?",
  "thinking_3": "",
  "obsessing": "NRI portfolio construction",
  "obsessing_label": "Markets: NRI portfolios",
  "obsessing_image_url": "/images/now/obsessing.png",
  "updated_at": "2026-10-25T09:00:00+00:00"
}
