# Suparna Deshmukh · Portfolio — UI Specification (end to end)

Complete, file-accurate description of every screen, component, animation and state on the site.
Source of truth: the code in this repo (Next.js 14 App Router, TypeScript, hand-rolled CSS).
If code and this doc disagree, the code wins — update the doc.

---

## 0. Overview

A single-page portfolio built like a **working PM's bench**: paper sheets, rubber stamps,
ledger rules, file tabs and an ink-pressed stamp language. It is deliberately *not*
a resume — every section is a physical object that animates its own proof.

| # | Section | id | One-line concept |
|---|---------|----|------------------|
| 1 | Hero | `#hero` | Name plate (title block) + annotated exhibit of her life, pinned on a cross-grid |
| 2 | Experience | `#experience` | "The route so far" — sticky route manifest on a dashed road with a driven trail |
| 3 | Projects | `#projects` | Two stacked case-study cards, each with a self-animating "evidence" illustration |
| 4 | Corporate Projects | `#corporate` | Three 180DC-style engagement files, each with a self-stamping mini paper |
| 5 | Data Projects | `#data` | Four ruled ledger cards with one infographic each |
| 6 | About | `#about` | Magazine spread: quote/bio/education left, positions + honors right (25/75) |
| 7 | Contact | `#contact` | "After hours" night desk: warm black, orange threads, form on a light sheet |
| 8 | End | — | Page-corner curl on scroll-out + `p99` load-timing easter egg |

Page order (`app/page.tsx`): Hero → Experience → Projects → Corporate → DataLedger →
About → Contact(+Footer) → PageMotion → EndPull.

Stack: Next.js 14.2, React 18, TypeScript, no UI framework, no CSS framework.
All motion is CSS + a few rAF/timeout loops, gated by `html.motion-ok` and
`prefers-reduced-motion: reduce` (no-JS and reduced-motion always show final states).

Local only — **no git remote exists; never push.** Dev server: port **3210**
(`python3 dev-daemon.py`), verified with `npx tsc --noEmit` + headless screenshots.

---

## 1. File map

```
app/
  layout.tsx                 fonts, metadata, Header, FloatNav, P99Panel, ViewTransitionResolver
  page.tsx                   home section order
  globals.css                tokens, chrome, bands, section header, cases, report/board, ledgers
  hero-left.css              hero title block (name plate + rows)
  hero-right.css             exhibit: objects, notes, callouts
  route.css                  experience: manifest, road, stations
  corporate.css              corporate files + mini-doc + emblems
  about.css                  about spread, panels, honors
  contact.css                contact night desk + form
  endpull.css                page curl
  topnav.css                 float nav pill
  tailwind.css               (utility base only)
  lib/
    site.ts                  ALL home data: EXPERIENCE, CORPORATE, POSITIONS, ACHIEVEMENTS,
                             EDUCATION, NAV_SECTIONS, SOCIALS, LOG, EMAIL/PHONE, URLs,
                             DATA_LEDGERS (data projects)
    metrics.ts               METRICS registry: every printed number, once, with source + asOf;
                             m(id) lookup, assertMetrics() dev-time rate check
    resume.ts                RESUME copy — only home for /resume and the PDF; assertResume()
                             house-style lint (125-char lines, banned symbols, **bold**)
    content.ts               PROJECTS (full case bodies, stats ids), NOW
    posts.ts                 case/post helpers, readMinutes, dev-only assertExcerpts
    hooks.ts                 usePrefersReducedMotion, useVisibleLoop, useInViewOnce,
                             useSectionArrival, useBandPause, istTime, SECTION_EVENT
  components/
    Header.tsx  FloatNav.tsx  PageMotion.tsx  SectionHeader.tsx  SecRef.tsx  CountUp.tsx  MetricTip.tsx
    Hero.tsx  HeroLetterhead.tsx  HeroExhibit.tsx  AskCartPhone.tsx
    Experience.tsx
    Projects.tsx  VisibleCard.tsx  ProjectIndex.tsx  ProjectSignatures.tsx
    AskCartReport.tsx  ResearchBoard.tsx  FitStage.tsx
    CorporateFiles.tsx
    DataLedger.tsx
    About.tsx  AboutExtras.tsx (CurrentlyTicker)
    Contact.tsx  ContactThreads.tsx  SocialCards.tsx  GitHubGraph.tsx  useContributions.ts
    Signature.tsx  Footer.tsx  P99Hint.tsx  P99Panel.tsx
    EndPull.tsx
    Article.tsx  ReplyCard.tsx  PilePage.tsx  Toc.tsx  ViewTransitionLink.tsx  MarkOnRead.tsx
  projects/[slug]/page.tsx   case-study article route (static)
  resume/
    page.tsx                 /resume — one A4 sheet, print-first
  resume.css                 resume sheet type scale + @page A4 print rules
api/
  contact/route.ts           POST /api/contact (mailer)
  github/route.ts            GET /api/github (contribution data for the contact social card)
public/images/…              hero portrait, campus sketch, project covers
```

---

## 2. Design tokens (`app/globals.css`)

### 2.1 Typography

| Token | Font | Notes |
|---|---|---|
| `--fd` (display) | **Fraunces** (Google; 500/600/700 + italic, `--font-clash`) | section titles, big numbers, name, quotes |
| `--fb` (body) | **Satoshi** (local woff2: 400/500/700) | all body copy, buttons |
| `--fm` (mono) | **DM Mono** (400/500) | labels, metrics, chips, meta, clocks |

Type roles: `--t-xl: clamp(40px,4.8vw,64px)`, `--t-l: clamp(30px,3.2vw,42px)`,
`--t-m: 28px`, `--t-s: 22px`, `--t-lead: 17px`, `--t-body: 16.5px` (body line-height 1.6),
`--t-meta: 12.5px`.

### 2.2 Colors

Light (`:root,[data-theme="light"]`)

| token | value | token | value |
|---|---|---|---|
| `--bg` | `#F1F4EF` | `--line` | `rgba(21,33,26,.09)` |
| `--surf` | `#FAFCF8` | `--lineS` | `rgba(21,33,26,.16)` |
| `--surf2` | `#E3EAE0` | `--lineF` | `rgba(21,33,26,.04)` |
| `--fg` | `#15211A` | `--tint` | `rgba(21,33,26,.05)` |
| `--dim` | `rgba(21,33,26,.72)` | `--press` | `rgba(21,33,26,.10)` |
| `--dimmer` | `rgba(21,33,26,.62)` | `--acc` | `#177E5B` (pine green) |
| | | `--accInk` | `#F4FAF7` | `--accText` | `#146248` |
| `--err` | `#B3261E` | `--focus` | `#146248` |

Dark (`[data-theme="dark"]`)

| token | value | token | value |
|---|---|---|---|
| `--bg` | `#0E1512` | `--line` | `rgba(236,243,238,.08)` |
| `--surf` | `#161F1A` | `--lineS` | `rgba(236,243,238,.15)` |
| `--surf2` | `#1F2B24` | `--tint` | `rgba(236,243,238,.07)` |
| `--fg` | `#ECF3EE` | `--acc` | `#4FD3A0` (mint) |
| `--dim` | `rgba(236,243,238,.78)` | `--accText` | `#4FD3A0` |
| `--dimmer` | `#9FB2A6` | `--err` | `#FF8A6B` |

Per-band palettes (override tokens on the band element):

* **Projects band** — light: `--bg:#E4EBE2` (bone/clay), dark: `--bg:#0F1713`.
  The band background crossfades between three tints as the stacked cards change
  (`@property --pjbg/--pjacc`, transition .6s): `tm` green `#DCEAE0` / accent `#177E5B`,
  `fl` blue-grey `#E2EAEF` / `#46708F`, `vx` sage `#E0EBE4` / `#5FA98C`.
* **Corporate band** — `.band-sand`: `--bg: var(--surf2)` (one step darker than the page).
* **Contact band** — `.band-night`, fixed in both themes: bg `#0D1411` (dark theme `#0A0F0C`),
  `--surf:#1C1712`, `--fg:#F4EFE7`, **`--acc:#FF8533`** (after-hours orange). The form card
  inside re-scopes to light tokens (a light sheet on the dark desk).
* **GitHub graph** (contact social card): contribution greens `--gh0…--gh4`
  light `#E1E8DF → #1F8460`; dark = accent-alpha ramp.

Shared: `--accSoft` (acc 10%), `--accB` (acc 30%), `--glow` (two soft accent shadows)
defined on `*` for cheap reuse. Selection = accent bg / `--accInk` text.
Scrollbar: 10px, thumb `--lineS` with 3px `--bg` border.

### 2.3 Space, radius, motion

| token | value |
|---|---|
| `--pad` | `clamp(20px,5vw,64px)` (page inline padding; `.wrap` max-width 1440px) |
| `--sec` | `clamp(80px,10vw,128px)` |
| `--s-sec` | `clamp(64px,7vw,96px)` (section bottom) |
| `--s-head` | `clamp(20px,2vw,28px)` |
| `--r` / `--rS` | 14px / 8px |
| `--ease` | `cubic-bezier(.16,1,.3,1)` (fast-out slow-in) |
| `--settle` | `linear(0,.34 8%,.76 16%,.97 26%,1.035 35%,1.01 47%,1)` — springy overshoot; used for **every stamp slam and verdict** (global; previously broken when scoped to `.case` only) |

`html{scroll-behavior:smooth;scroll-padding-top:64px}` (56px ≤760px; smooth off under
prefers-reduced-motion). `:focus-visible{outline:2px solid var(--focus);offset 3px}`.

### 2.4 Themes

* `html[data-theme="light"|"dark"]`, persisted to `localStorage.theme`, broadcast via
  `themechange` event. Default light.
* Toggle: 16px sun/moon button in header. Uses `document.startViewTransition` with a
  **circle wipe from the click point** (550ms, `cubic-bezier(.65,0,.35,1)`,
  `pseudoElement:'::view-transition-new(root)'`); falls back to instant apply when
  unsupported or reduced motion.

---

## 3. Global chrome

### 3.1 Skip link & scrollbar
`.skip` off-screen until focused ("Skip to content").

### 3.2 Header (`Header.tsx`)
Fixed top bar; transparent until 80px scroll (a 1px sentinel + IntersectionObserver —
no scroll listener) → `.scrolled` (bg `--navBg`, blur, `--navShadow`, border).

* Left: wordmark — full "Suparna Deshmukh" (Fraunces) on wide screens, "SD" monogram
  below. Links to `/`.
* Right cluster:
  * **Location pill**: `Bengaluru · --:-- IST` — live IST clock (30s tick,
    `suppressHydrationWarning`), pulsing presence dot, mono digits.
  * **Resume ↗** — `RESUME_URL` (currently `#` — TODO).
  * **Let's talk** — pill button → `#contact` (or `/#contact` on other routes).
  * **Theme toggle** (above).

### 3.3 FloatNav (`FloatNav.tsx`, `topnav.css`)
Fixed bottom-center pill, home route only.

* One line-icon per section, drawn from the site's own objects: experience = route
  manifest card, projects = shipped box, corporate = ring binder, data = database
  cylinder, about = ID badge, contact = paper plane.
* Sliding indicator: a fixed-width pill moved with `translateX + scaleX` (transform
  only, no reflow), opacity fade when no active section.
* Thin per-section **reading progress** line across the pill (rAF-throttled).
* Active section comes from the shared `sectionchange` event (see §4.4).
* Phones (≤640px): auto-hides on scroll down, reappears on scroll up or section change
  (stays visible 1200ms after a change). Phones in landscape (viewport height ≤500px):
  hidden entirely.

### 3.4 Footer (`Footer.tsx`)
`© 2026 Suparna Deshmukh` + **P99Hint**: `p 9 9` keycaps — "see how fast this page
loaded" — opens `P99Panel` (same as pressing `p99` on the keyboard: load/perf readout).

---

## 4. Motion system (how all animation is governed)

1. **`html.motion-ok`** — added by `PageMotion` when JS is on and the user hasn't
   requested reduced motion. Every entrance *pre-state* (hidden/offset) is scoped under
   `html.motion-ok …`, so no-JS, reduced-motion and old browsers always show the final
   composition.
2. **`useVisibleLoop(ref, start, stop, enabled)`** — starts/stops a JS loop as the
   element crosses the viewport (IO threshold .05) and as the tab hides; also toggles
   `.paused` on the host, which pauses the associated CSS loops.
3. **`useInViewOnce(ref, threshold)`** — one-shot reveal flag (booleans → classes).
4. **`useSectionArrival`** — (a) marks each `main section[id]` `data-arrived` when its
   top is 15% inside the viewport (section headers draw in exactly then); (b) broadcasts
   `sectionchange` for the section crossing the reading line (rootMargin −40%/−55%) —
   drives FloatNav + the experience manifest's active row.
5. **`useBandPause`** — `.paused` on `main > section.band` while off-screen
   (`animation-play-state:paused` for all band background loops).
6. **`CountUp`** — numbers count up on first in-view (tabular-nums; the 96.7 gauge uses
   registered `@property --tra/--trb` counters instead).
7. **View transitions** — theme circle wipe (§2.4) and case-card title/media
   (`view-transition-name: case-title-*` / `case-media-*` via `ViewTransitionLink`).
8. **`prefers-reduced-motion: reduce`** — smooth scroll off, all loops disabled, every
   animated figure has an explicit static fallback (stamps visible, verdicts shown,
   gauges full, marquee static).

---

## 5. Section header system (`SectionHeader.tsx`)

Shared by all sections: a 1px rule that **draws left→right** on arrival, a heading, and
a right-aligned fact column.

* Variants: `xl` (700, `--t-xl`, line-height .95), `serif` (Fraunces 600,
  clamp 32–46px), `md` (`--t-l`, max 16ch), `sm` (clamp 26–32px).
* Optional `pre` kicker line above (body font, .36em).
* Heading words **rise from a clip** (`.m > .w`), 60ms stagger, capped at the first 4
  words — only when `motion-ok` and not yet `data-arrived`.
* Right column: default `meta` = `[bold fact, context line]` in mono uppercase; or an
  `aside` node (currently: corporate aggregates, projects pip, About's currently-ticker).
* **SecRef chip** — `#section-id` + link icon, straddling the top rule
  (`translateY(-50%)`, bg `--bg` to break the line). Click: copies
  `origin/#id` to clipboard, updates the hash, shows toast "Link to X copied"
  (+ `aria-live` sr-only twin).

Current labels: Experience · **Projects** · **Corporate Projects** · **Data Projects** ·
About · Contact (nav + headers + toasts all share these strings from `NAV_SECTIONS`).

---

## 6. Hero (`#hero`)

Grid: left letterhead (`.hd-left`), right exhibit (`.hd-right`).

### 6.1 Background (`.hbg`)
Three drifting glow blobs (52/40/48vw, accent/sage tints), a 56px engineering grid
(radial-masked, slow 52s pan), and SVG-turbulence **grain** (multiply; dark: screen +
invert). All paused off-screen. (The old flowing "roadmap" curves were removed — the
notes float on their own.)

### 6.2 Letterhead (`HeroLetterhead.tsx`, `hero-left.css`)
* **Name row**: `Suparna Deshmukh` (Fraunces 600, "Suparna" set distinct) + a circular
  **seal**: two concentric rings, circular text `SUPARNA DESHMUKH · PRODUCT · CLASS OF
  27 ·` on a text path, "SD" at center.
* **Three ruled rows** (`.tb-row`, grid 84px | value | detail; dashed separators):
  | label | value | detail |
  |---|---|---|
  | Currently | **Associate Product Manager intern at RISA Labs** | AI workflows, US healthcare |
  | Building | **AskCart** | guided AI search, personal build |
  | Placements | **Placement Coordinator at BITS Goa** | 240 placed · batch 58% → 85% |
  No "live" highlight styling on any row (removed on request).
* **Foot**: primary btn "See the builds ↓" (`#projects`) + ghost "Let's talk"
  (`#contact`); link line: `+91 89569 67964` · LinkedIn ↗ · (X hidden until handle
  added) · GitHub ↗.

### 6.3 Exhibit (`HeroExhibit.tsx`, `hero-right.css`)
A 660×540 stage (`.ex-wrap`, aspect-locked) scaled by `--s = min(width/660, 1.15)`.
**Pointer parallax**: `pointermove` over the column writes `--mx/--my` (rAF); every
object transforms `rotate(var(--rot)) translate3d(--mx·d·12px, --my·d·8px, 0)`,
`d` = per-object depth; hover lifts `translate:0 -5px`; each object "settles" in
(`exIn`, staggered under `motion-ok`).

Objects (all links):

| object | pos (x/y) | size | depth/rot | content → target |
|---|---|---|---|---|
| ID badge | 0/44 | 172w | 1.15 / −5° | photo `suparna-portrait.webp` (144×136, clip slot, barcode strip), name, "Associate Product Manager", "RISA Labs · Bengaluru" → `#about` |
| AskCart phone | 386/16 | 248×474 | .7 / 2.5° | dark phone frame + island; **live loop** `AskCartPhone`: status bar, app header, typing caret in the search field, a guided-question card ("What's the budget?" chips) then a result list where the old "no results" becomes a guided re-run → `/projects/askcart` |
| RISA stat card | 206/148 | 168w | 1.45 / 3° | accent top bar, "RISA Labs / APM intern · now", **500 hrs/wk** (27px), "saved across 200 users · Status Tracking 0→1", "118 payers · 75% coverage / 96% precision" → `#experience-risa` |
| Campus card | 14/340 | 228w | .9 / −2° | `bits-goa-sketch.webp`, "BITS Pilani, Goa", "Electronics & Communication Engineering", "Finance minor · Class of 2027" → `#about` |

**Pinned notes** (`.ex-note`, taped `::before` tape tab, same parallax/hover/settle as
objects — deliberately *not* static):

| note | pos | depth/rot | num | label |
|---|---|---|---|---|
| n1 | 252/318 | 1.25 / −2° | **Top 8** | of 9,000+ · Accenture Strategy '25 |
| n2 | 252/396 | 1.05 / 1.6° | **Placement Coordinator** | BITS Goa · 2026 batch |
| n3 | 252/472 | 1.35 / −1.2° | **$2.5M** | Series A · 180DC, Everyday Diamonds |

**Callouts** (SVG, dimension-drawing style): `01 · THE PERSON`, `02 · BITS PILANI, GOA`,
`03 · RISA LABS`, `04 · ASKCart` — leader line + endpoint dot to each object.

`useVisibleLoop` on the hero pauses the phone loop + background off-screen.

---

## 7. Experience — "The route so far" (`Experience.tsx`, `route.css`)

Band background: **ledger paper** — horizontal rule every 28px + a double vertical rule
at 72% width. Header: `xl`, title "The route so far.", meta `5 stops · 5 sectors ·
2024 to now` / "Two product teams, then internships across energy, gaming VC and
wealth".

Layout `.rt`: `grid: [minmax(270,340)px | 1fr]`, gap clamp(24,3vw,48).

### 7.1 Route manifest (left, sticky `top:96px`)
Paper card (border, soft shadow; dark: 1px ring). Header: compass icon, "ROUTE
MANIFEST", "5 stops". Body: group divider rows — **Product** / **Industry** (small caps
+ trailing hairline) — then one row per company (`<a href="#experience-{id}">`, grid
`auto | 1fr | auto | auto`, `align-items:center`):

* **S# / NOW** chip (mono, border; `NOW` for the current role),
* **name** (14px semibold) with the **sector chip on its own line** (8.5px mono,
  dashed border, `width:100%` wrap — this is the fix that stopped the metric from
  overlapping the sector on RISA Labs / PrimeWealth),
* **metric** (mono, tabular) + **years** (dim),
* **caption** line under (the metricCaption, 12px).

Active row (station crossing the reading line) gets `.on` (accent tint). Hovering a row
shows the **flight card** (`.float`, z-8): summary / big metric / caption, follows the
pointer, clamped to the manifest width, mouse-only (`hover:hover`).

### 7.2 The road (right)
`.rt-stops`, `padding-left:74px`; dashed vertical spine at x=23px.
* **`.rt-trail`** — accent gradient line, `scaleY` from scroll progress
  (transform-origin top). Geometry is **cached** (measured once + on resize, height
  clamped ≤4000px) and the per-frame handler only writes transforms — this is the
  fix for the scroll glitch (1.1MP page bloat from ResizeObserver feedback).
* **`.rt-train`** — glowing dot riding the trail tip (2.4s pulse ring).

### 7.3 Stations
One per company, newest first (RISA = `NOW`). Entrance: staggered rise
(90ms apart); `.in` (reading line) reveals the rest.

* **Node** (48px circle on the spine): `S1…S4` or `NOW`; inner dashed ring; the `NOW`
  node gets a pulsing outer ring (`rtNow` 2.2s).
* **Card** (paper, hover lifts 3px):
  * head: h3 (26px Fraunces) + right-aligned uppercase summary; dashed rule below.
  * body: 2-col `[1.25fr | 1fr]`. Left: dates (mono caps), role h4 (18px),
    **`.rt-big`** — the role's hero number (46px, accent, tabular) with an underline
    that draws on `.in`, label under, then a `how` paragraph. Right: **`.rt-out`** —
    2–4 result rows (104px bold number + label, ruled).
  * foot: `<details>` "All N results" (chevron rotates) → bullets
    (`strong` lead + rest).
* **Featured station (RISA only)** — `c.featured`: bigger card (28/30px padding),
  3px accent ring + accent-tinted border, 54px node, 31px h3, **"★ Standout role"**
  flag chip, 58px hero number, and **all bullets inline** (`.rt-out-full`, ruled list)
  instead of the dropdown.

Data (`site.ts EXPERIENCE`, source = resume): RISA Labs (Healthcare AI, product,
featured; 500 hrs/wk hero; 75/96, 92%, 2x, 87% results; 8 bullets), InvestMates
(FinTech·Wealth, product; 25%), Suzlon Group (Renewable Energy; 66%), Chimera VC
(Venture Capital; $5M), PrimeWealth (Wealth Management; 33%).

---

## 8. Projects — "What I've built." (`Projects.tsx`)

Band with its **own palette** that crossfades with the card in front
(`data-current="tm|fl"` set by `VisibleCard`; `@property` color transitions, .6s).
Background: 96px vertical hairlines fading out by 60% height; a 220px **scan line**
sweeps the top edge (6s loop, compositor-only transform); a 120%×70% radial glow in
the front card's accent drifts ±12%. Header `md`: "What I've built." + fact column
("2 personal case studies" / "Corporate projects right below") + 3-dot pip.

### 8.1 Case cards (`.case case-tm | case-fl`, stacked via `VisibleCard`)
Two full cards: **AskCart** (`tm`, green) and **Research Agent** (`fl`, blue-grey).
Each card:

* **ProjectIndex** — "01 / 02 / Corporate projects" with the current one bolded.
* h3: project name (links to `/projects/{slug}`, view-transition named) + optional tag
  chip + small subtitle.
* **Stats** (CountUp; `hot` stat in accent):
  * AskCart — "From the MVP": **8%** null results (down from 27.3%, n=150) · **96.7%**
    RAG eval pass (n=113) · **78.7%** resolved within 2 follow-ups (hot).
  * Research — "One run": **500+** pain points (hot) · **28** nodes · **70%**
    research-to-spec cut.
* Summary paragraph, stack line, then foot: **"Read the case study →"** (btn,
  ViewTransitionLink), live host (when set), and `case-link` chips — currently
  **Live on Vercel ↗** / **Read the PRD ↗** (both `href="#"` — TODO: real URLs).
* `.media` — the animated evidence illustration (below). `.shade` gradient at the base.
* Research card carries a `SortingDots` signature (the dots that sort themselves).
* `tm-field` on AskCart: two animated field lines.

### 8.2 AskCartReport (560×440 `FitStage`) — the benchmark animation
An ink-pressed **search quality report** (SVG `feTurbulence` displacement filter gives
stamps their rough edge). First frame = finished report; loop replays from the first
failure while in view.

* Header: "AskCart / Search quality report · MVP evals" + "eval suite · n=113 / every
  mode caught".
* Three failure-mode rows (132px chip | tool/agent lines | verdict stamp):
  | mode | tool | agent | verdict |
  |---|---|---|---|
  | `vague_intent` | results: 0 | asks 1 follow-up question | CAUGHT |
  | `hinglish_query` | "sneekrs red" | embedding fallback · top-3 hit | CAUGHT |
  | `missing_context` | filters: none | guided narrowing → 12 SKUs | CAUGHT |
* Gauge row: "Eval pass rate **96.7** GREEN" — counter via registered
  `--tra/--trb` (96|7); a 420px track with red→amber→green zones, the surface cover
  wipes away and a 3px **mark slides to 96.7%**.
* Round double-ring stamp "**96.7 GREEN**" (mix-blend multiply, ink filter) **slams in**
  (`trSlam` .5s, scale 2.4→1, `--settle`) + paper **shake** (.38s).
* Timing: rows inject at 400/1750/3100ms (label → +520ms agent line → +1040ms verdict
  slam), gauge 4500, stamp 5500, shake 550ms, **loop 9500ms**.
* Interaction: hover tilts the paper 3D (perspective 900, ±3°); hovering a row
  **replays just that row**.

### 8.3 ResearchBoard (`FitStage`)
A **Filtr-style board**: dotted paper, six sticky notes from real threads (source
icons: call/phone, slack/grid, jira/check-square; tags Reddit / HN / Reddit #182;
texts: "battery dies after a year", "still no fast charging", "replaced the pack
twice", "subscription charged twice", "auto-renew trap, again", "size chart is wrong").

Cycle: **scattered** (rotated random-ish positions) → **threaded** (lines drawn between
related notes, 2100ms) → **sorted** (notes slide into three theme piles; right side
ranks themes with bars, count-up "**7 mentions**", result stamp, 4700ms) → loop.
First hold 2600ms; count-up 600ms; pauses while hovered.

---

## 9. Corporate Projects (`CorporateFiles.tsx`, `corporate.css`)

`band-sand`. Header `xl`: "Corporate projects.", aside: "3 engagements" / "Two as team
lead via 180 Degrees Consulting, one independent" + aggregate chips
($2.5M Series A raised · ₹12.5L grants enabled · 30% unit economics).

Three files (`ol.cf-files`, 20px gap). Each `.cf-file`: grid
`[minmax(218,242)px | 1fr]`, gap 10/30, paper card, hover lift. Entrance: chips stagger
in (.55/.68/.81s) when `.in` (IO .25).

### 9.1 The mini-doc (left) — AskCart-report DNA at file scale
Self-animating paper (`.cfdoc-paper`, 13/14/16 padding, border, shadow; hover lifts):

* **hd**: 30px emblem + doc type + "file 0N · Company" (mono caps).
* **3 rows** — label (12.5px) fades/slides in (`.inj`), then the **verdict chip** slams
  (9.5px mono, 1.5px border, rotate −5°, scale 1.5→1, `--settle`):
  | file | doc | rows (verdicts) |
  |---|---|---|
  | Everyday Diamonds | **Term sheet** | Pricing & unit model → SIGNED · Series A deck v3 → SHARED · First store, Bengaluru → LAUNCHED |
  | Fedaykin AV | **Pricing audit** | Competitor benchmarks → DONE · Annotation cost audit → −30% · 950-client B2B sizing → SIZED |
  | KriSHE Carbon | **Grant review** | Investor deck & model → PITCHED · Biochar impact metrics → VERIFIED · 20+ high-fit buyers → MAPPED |
* **gauge**: 100×54 arc (`stroke-dasharray: var(--g) 100`, fills over 1.1s on `.g`),
  then the **CountUp proof number** (25px accent) + label (9.5px).
* **Stamp** — hangs off the paper's bottom-right edge (right 6 / bottom −15), double
  border + offset outline, rotate −6°: proof value + word
  (**$2.5M / SERIES A**, **30% / UNIT ECONOMICS**, **₹12.5L / GRANTS**). Slams with
  `cfSlam` (scale 2.1→1, .55s `--settle`) + paper shake (.38s). Visible without
  `motion-ok` (base opacity .92).
* Loop: rows 380/1500/2620 (+460ms verdicts), gauge 3750, stamp 4650, shake 450ms,
  **loop 8800ms**; first frame finished; `useVisibleLoop`; reduced-motion → static
  finished doc.

### 9.2 Emblems (30px in doc headers; full-size animations)
* **Diamond** (Everyday): outline brilliant-cut + glow pulse (3.2s), clipped shine
  sweeps (2, staggered; 1.5s on hover), two sparks (3.2s cycle).
* **AV lane** (Fedaykin): dashed lanes scroll (1.15s), two scan arcs ripple (2.4s,
  staggered .4), car bobs (2.4s; 1.2s on hover), two blips pop (2.4s cycle, staggered).
* **Sprout** (KriSHE): soil, stem grows (scaleY), two leaves unfurl (.7s @ .7/.9s), bud
  pops, four dots rise and fade (3.4s cycle).

### 9.3 Main side (right)
h3 (26px) + meta line (`role · when · where`), context line (mono caps), points list
(ruled, 14.5px, accent dash), then foot: result chips (staggered) + **deck chip**
(doc icon, label, ↗; hover accent) + **"Ask me about it →"** ghost btn — dispatches
`contact:prefill` with a role-specific question (see §12.3).

**Claim wording (P0-3):** stamps and proof labels use verifiable, project-level
outcome verbs ("Series A aided", "unit economics lifted via pricing", "grants
enabled") so nothing reads larger than Suparna's role. A `myPart?: string` field
renders a "My part" line (`.cf-mypart`, accented left rule) directly under the
context line — currently undefined on all three files, hidden until Suparna
supplies her one-liners (Section 7 item 5).

| file | stamp | proof (gauge) | points | chips | deck |
|---|---|---|---|---|---|
| Everyday Diamonds (Bengaluru, Aug–Sep '24) | Series A aided | $2.5M (100) "Series A aided, All In Capital — first store launched" | 2 | $2.5M Series A, All In Capital · 5 store expansion roadmap | Series A deck (hidden until URL) |
| Fedaykin AV (Remote, Jul–Aug '24) | Unit economics +30% | 30% (30) "unit economics lifted via pricing, across specs, ops and annotation costs" | 3 | 30% unit economics · 950 client database | Project report (hidden until URL) |
| KriSHE Carbon (Gurugram, Jul–Aug '25) | ₹12.5L grants enabled | ₹12.5L (100) "in grants enabled via the deck and biochar model" | 2 | ₹12.5L grants enabled · 20+ high-fit opportunities | — |

Mobile ≤640: one column, doc capped 300px.

---

## 10. Data Projects (`DataLedger.tsx`)

Data lives in `site.ts` as `DATA_LEDGERS` (title, where, two points, result, tech);
headline figures are read from the `METRICS` registry by id (`resultMetric`).

Header `sm`: "Four ledgers, one method." + "4 data projects · SQL + Python" / "From
viral videos to loan books". `.dl-grid` = 2×2 (18px gap; 1-col mobile).

Each **ledger card**: ruled paper (rule every 32px), **red margin line** at 26px
(light `#B24A26` / dark `#E08A5E`), file number top-right (mono), padding-left 44px.
Head: h3 (19.5px Fraunces) + `where` line; one **infographic** (`.dl-vis`, 300×64 SVG,
animates in on `.in`, all with hover states); two points; bottom-right **result
figure** (Fraunces) + resLabel; tech line.

| # | project | where | result | infographic |
|---|---|---|---|---|
| 01 | Content Virality Prediction & Segmentation | YouTube Trending · 200K+ videos | 82% AUC | spike line + area fill (trend spike) |
| 02 | Mutual Fund Activation & Retention | Synthetic/AMFI · 50K users | 50K | 90-day **cohort heatmap** (rows [1,.92,.97,.9,1,.95]; row hover isolates; 2 dormant cells get pulsing rings) |
| 03 | Growth Attribution & CAC Optimization | Neobank · 45K campaigns | −28% | 5 **channel bars** with labels (hover highlights) |
| 04 | Loan Risk Segmentation & Default Prediction | LendingClub · 100K+ records | 100K+ | 5-segment **risk donut** + legend (hover thickens segment) |

---

## 11. About — "The person behind the work." (`About.tsx`, `about.css`)

Background: slow **aurora** — two blurred 46vw blobs (accent + sage) drifting 16/19s.
Header `serif`, meta ["Associate Product Manager intern at RISA Labs", "Bengaluru"],
aside = **CurrentlyTicker**: rotating fact line (APM intern · AI workflows for US
healthcare · Placement Coordinator at BITS Goa · Consultathon: ₹17L sponsorships,
3,200 registrations · Building AskCart).

### 11.1 The spread (`.ab-spread`)
A shadowed sheet: **25/75** — left `minmax(0,1fr)`, right `minmax(0,3fr)`
(`--pageX:32px` inner padding; page-edge gradients; folio labels "Suparna Deshmukh"
/ "Bengaluru" bottom corners). Mobile ≤1024: one column, reading order
quote → bio → positions → education.

**Left page**
* **Pull quote** (Fraunces 30–38px, accent opening quote): "The best product decisions
  come from people, not dashboards."
* **Bio** (2 paragraphs, 60px drop cap on "I"): ECE + Finance minor at BITS Goa;
  drifted into product because the questions were never only about the tech; now APM at
  RISA Labs; outside work leads campus placements and a 45-consultant practice.
* **Education diploma card** (`.ab-edu`): 56px building crest (SVG), "Education" label,
  **BITS Pilani, Goa Campus**, "B.E. (Hons.) Electronics and Communication
  Engineering", meta line **plain text** (no pills): "Minor in Finance — Class of
  2027". No grades anywhere.

**Right page** — "Positions of responsibility / 3 roles · BITS Goa"

`.ab-panels`: **2 columns** on desktop (placement + director side by side), CEL card
spans full width below.

1. **Placement Coordinator** (BITS Goa · May 2026 – Present) — featured (accent border
   + 3px inset bar). Blurb (1 of 8 out of 1,000+; 25-member team). Then:
   * **TeamDots (25)** — 8px dots light up one by one (30ms stagger; hover pulse),
     "25 · team led end-to-end".
   * **OfferStamps** — the placement ledger: **six rubber-stamped "OFFER" marks**
     (8.5px mono, 1.5px border, alternating tilt −2.2°/+1.6°) that **slam in** one by
     one (scale 1.5→1, `--settle`, 140ms stagger) — caption "1 stamp = 40 students ·
     240 placed". (Replaces the earlier batch-rate bar and 24-tile grid.)
   * Stats: 58%→85% batch placement in 5 months · 240 students placed · 25 team.
   * Chips: "1 of 8 selected" · "Project SYNERGY approved · 3 campuses".
2. **Director** (180 Degrees Consulting · May 2025 – Jun 2026). Blurb (youngest
   Director; 45 consultants; 16 projects; 30% YoY; Best Consultant sophomore). Then:
   * **Project shelf (16)** — compact 8×2 board of 12px tiles filling in (42ms
     stagger), "16 projects · 45 consultants". (Shortened on request.)
   * **SponsorMarquee** — Uplearn by Upstox · NextLeap · Unstop · The MBA Edge,
     24s loop with faded mask.
   * Stats: ₹17L Consultathon sponsorships · 3,200 registrations · 30% YoY revenue
     growth · 50K+ course impressions (85% retention).
   * Chips: "Best Consultant" · "Consultathon — sponsored by … · on Unstop ↗"
     (real Unstop link).
3. **Creative Director** (Center for Entrepreneurial Leadership · May 2025 – Jun 2026)
   — full width, short: Coalescence'24 blurb (40+ founders/investors incl. Ankur
   Warikoo & UTI), TeamDots (20), stats 40+ / 400K+ / ₹10L+.

**Honors** (`.ab-honors`) — label "Honors / case competitions and fellowships"; three
cards (18px padding, 54px crests — double ring + monogram: **A** `#E2401B`,
**IIM** `#1F4E8C`, **N** `#0E9F8A`): rank (19.5px, "Top 8 *of 9,000+*"), name, note,
and a **deck chip** (Case deck ↗ / Case deck ↗ / Project deck ↗ — `href="#"` TODOs).
Hover: lift + crest tilt (−6°). Mobile: 1 column, crest left / text right.

---

## 12. Contact — "Let's talk." (`Contact.tsx`, `contact.css`)

`band-night`: warm black desk, orange accent, drifting **threads** SVG (two warm
curves, 9s alternate drift; paused off-screen). Header label "Contact", title
"Let's talk.".

### 12.1 Left (direct lines)
* **Email (P0-4):** renders only when `NEXT_PUBLIC_CONTACT_EMAIL` is set
  (`CONTACT_EMAIL` in `site.ts`) — mailto link + **Copy email** button ("Copied"
  state, 1.6s, sr-only live region) + a `<noscript>` mailto fallback. Until the
  professional address arrives the block shows the neutral line "Email me via the
  form — I reply to everything." (hidden, not stubbed — the form still works and
  the API falls back to the institute address server-side only).
* **Phone (P0-4):** tap-to-reveal. Static HTML shows `Show number · Bengaluru, IN`
  (a plain mono button, `.phone-reveal`); clicking swaps in the `tel:` link
  `+91 89569 67964`. The raw digits never appear in the initial SSR HTML, and the
  phone number is gone from the hero (`HeroLetterhead` no longer imports `PHONE`).
* "It's --:-- in Bengaluru right now." (30s tick).
* **SocialCards**: LinkedIn + GitHub cards; the GitHub card renders a live
  **contribution graph** (`GitHubGraph`, data from `/api/github`).
* Handwritten **Signature** flourish.

### 12.2 Form (light sheet on the dark desk)
Fields: Name (grid 2-col with Email) + Message textarea, plus a **honeypot**
(`.hp`, visually hidden, `tabIndex=-1`, `autocomplete=off`; filling it returns a
silent success and nothing is sent or logged). Validation (inline, on submit;
first invalid field focused) lives in `app/lib/contact-form.ts` — the **API
re-validates with the same module** so client and server can never disagree:
name non-empty, email regex, message ≥10 chars.

Submit → `POST /api/contact` with `{ name, email, message, hp, started }`
(`started` = epoch ms when the form appeared). Server-side (P0-5,
`app/api/contact/route.ts`): 10 KB body cap → parse → honeypot → **per-IP token
bucket** (sha256-hashed IP, 5/hour, 429 + `Retry-After`) → validation → **≥2.5 s
fill time** → Resend via `RESEND_API_KEY` with an 8 s timeout. Response contract:
`200 {ok:true}` · `400 {ok:false, code:'invalid', fields?|error}` · `429 {ok:false,
code:'rate'}` + Retry-After · `502 {ok:false, code:'provider'}` · `500 {ok:false,
code:'unknown'}`. No stack traces in responses; logs carry metadata only, never
the message body. Without a key: production returns 502, dev appends to
`.contact-outbox.jsonl` (gitignored) so local form mail is inspectable.

UI states: idle → **Sending…** (disabled) → **sent** (✓ card: preview of first 5
words + "I'll get back to you here." / "I'll reply from …" + "Until then
LinkedIn ↗ / X ↗") or **failed** (message preserved, rate-specific line when
`code:'rate'`; actions: **Try again**, **Copy message** (clipboard, "Copied" for
1.6 s), and a **prefilled `mailto:` fallback** — rendered only when
`CONTACT_EMAIL` is set).

### 12.3 Prefill
* `contact:prefill` CustomEvent — every "Ask me about it" button (corporate) and
  `ASK_OWN_MESSAGE` dispatch one; the textarea is only prefilled when empty, then
  focused after 450ms (0ms reduced-motion).
* URL: `?re=<title>&q=<line>` from article **ReplyCard**s ("Re: Title\n> line\n\n"),
  quote capped at 280 chars.

### 12.4 Footer
P99Hint (`p 9 9` keys easter egg — `P99Panel` load-timing readout) + "© 2026 Suparna
Deshmukh".

---

## 13. Case-study article pages (`/projects/[slug]`)

Static per slug (`generateStaticParams`). `Article` component: kind chip "Case
study", back link ("Projects" → `/#projects`), title (name) + subtitle, read minutes,
meta (tags · live link), cover image, markdown body with **annotations** (pull quote
with marked phrase, 3 labelled notes, highlights) — dev-only `assertExcerpts` fails
the build if an excerpt isn't a verbatim substring of the body. Ends with a **reply
card** (role-specific question → prefill `/#contact?re=…&q=…`) and a **pile** of the
other case study + lead. Both current cases: AskCart (94.6K reviews mined → 4 root
causes → guided follow-up → semantic fallback → evals 96.7%) and Research Agent
(28-node n8n workflow, 500+ pain points/run, 70% research-to-spec cut).

---

## 14. End of page (`EndPull.tsx`, `endpull.css`)

Scrolling past the footer starts a **page-corner curl** (spring-driven, semi-implicit
Euler: snap k=520/c=34, return k=260/c=28; curl size from scroll overshoot
`SCROLL_CURL .62`, extra wheel peels the rest `EXTRA_PULL 240`, resistance .55;
idle 240ms in the zone → page springs back; 1200ms progress flash). Pure visual
portal, `z` above everything.

---

## 15. Responsive behavior (summary)

| bp | what changes |
|---|---|
| 1024 | About spread on/off (2-col → stacked single page, 2-col bio columns ≤1024) |
| 900 | corporate body grid collapses (doc over text) |
| 760 | scroll-padding 56px; About single-column order (quote→bio→positions→edu); stats 2-col; honors 1-col (crest left); About bio 1-col |
| 640 | FloatNav phone behaviors (auto-hide on scroll down); corporate files 1-col, doc max 300px; header compacts |
| 500 (height) | FloatNav hidden on landscape phones |
| 390 | header wordmark → "SD" monogram; hero exhibit scales via `--s` |

`.wrap` max 1440; section padding `--s-sec`.

---

## 16. Accessibility & performance notes

* Skip link; semantic `section/h2/h3` landmarks; `aria-current` on the active
  manifest row; `role="img"` + descriptive `aria-label` on every animated figure
  (report, board, docs, tiles, stamps, phone loop).
* sr-only `aria-live` regions: email copied, message sent, "Link to X copied".
* `prefers-reduced-motion`: smooth scroll off, `motion-ok` never set, every loop
  disabled, all figures show final states, theme wipe skipped.
* No scroll listeners where avoidable (sentinel IO for header, cached geometry +
  transforms for the route trail, rAF-throttled pointer handlers).
* `.paused` class stops all off-screen CSS loops (bands, hero, contact threads).
* Fonts: Fraunces + DM Mono (Google, swap), Satoshi local woff2 (swap).

---

## 17. Metrics registry & hover proof

`app/lib/metrics.ts` is the single home for every number printed on the site:

* `METRICS` — `Record<id, Metric>`; each `Metric` has `shown` (exactly what the UI
  prints), optional `num`/`den` (when it is a rate), optional `n` (sample size),
  `unit`, `source` and `asOf`.
* `m(id)` — lookup; throws in dev on an unknown id.
* `assertMetrics()` — runs at module load in dev: for rate metrics carrying both
  `num` and `den` (unit `'%'`), `num/den` must equal `shown` within 0.05 pp or the
  dev build throws. Range values (e.g. `pc-rate` "58%→85%") carry no `num`/`den`.
  Metrics flagged `needsReview` (currently `ac-eval`, 96.7% with n=113 — true
  numerator pending from Suparna) print a loud dev-console warning and stay as-is
  until confirmed.

Consumers read by id — no stat literal in components:
* `site.ts`: EXPERIENCE `metric`/`hero`/`results`, CORPORATE `stamp`/`proof`/`chips`,
  `CORPORATE_AGG`, `ACHIEVEMENTS` rank/of, `POSITIONS` stats/team, `DATA_LEDGERS`.
* `content.ts` `PROJECTS[*].stats` (ids); `Projects.tsx` resolves via `m()`.
* `AskCartReport` (`SCORE`, `n`, narrowed-SKU line), `ResearchBoard` (`TOP_MENTIONS`),
  `HeroExhibit` (RISA card, Top 8 and $2.5M notes), `HeroLetterhead` (placements row).

**`MetricTip`** (`components/MetricTip.tsx`, `.mtip` in globals.css): a hover and
focus bubble above a headline stat showing `n=… · as of …` (bold) and the source
(dim, mono 11px). Tabbable (`tabIndex 0`) so the proof is keyboard reachable; the
same text is carried in the wrapper `aria-label`, the bubble is `aria-hidden`.
`focusable={false}` where the stat sits inside a link or a `role="img"` figure
(hero RISA card, corporate mini-doc proof) — the proof then travels in the
container's `aria-label` instead. Applied to: hero exhibit (`risa-hours`,
`acc-rank`, `ed-raise`), Experience `.rt-big` (via `role.heroMetric`), project case
stats (via `stats[].id`), corporate proof (via `proofMetric`), data-ledger results
(via `resultMetric`), About `.ab-stats` (via `Stat.metric`).

---

### 17.1 `/resume` and the generated PDF (P0-1)

`app/resume/page.tsx` renders `RESUME` from `app/lib/resume.ts` as a clean A4
sheet: white, high contrast, 8.3pt/1.16 Satoshi, mono section labels, pine accent
on headings and bullet markers. The sheet fits exactly one A4 page — verified
with headless Chrome `--print-to-pdf`.

* House style enforced by `assertResume()` (dev, at module load) and
  `scripts/check-resume.mjs`: each bullet reads problem, then action, then
  result; max 125 characters per printed line (a bullet may wrap once, i.e.
  <= 250 chars); key words bolded with `**…**`; "and" never "&"; no plus signs,
  equals signs or em dashes ("over 500", not "500+"). Contact lines are exempt
  from the symbol rules.
* `RESUME_URL` = `/Suparna-Deshmukh-Resume.pdf`, generated by
  `node scripts/build-resume-pdf.mjs` (headless Chrome `--print-to-pdf` against
  the running server; `CHROME_PATH` overrides the macOS default). Regenerate
  whenever `resume.ts` changes so the page and the PDF never disagree.
* Print rules (`resume.css` `@media print`): site chrome (`.hdr`, `.fnav`,
  `.p99`, skip link) hidden; `@page { size: A4; margin: 0 }`; the sheet's own
  8.5mm/11mm padding sets the printed margins.

## 18. Content sources & TODOs

All home copy/numbers live in `app/lib/site.ts` (resume is the source of truth for
numbers); case bodies in `app/lib/content.ts`. Known placeholders:

| item | where | status |
|---|---|---|
| Resume | `RESUME_URL` → `/Suparna-Deshmukh-Resume.pdf` | done — served from `public/`, generated from `/resume`; header + social card use a download icon |
| Professional email | `NEXT_PUBLIC_CONTACT_EMAIL` (env, `.env.example` documents it) | hidden — pending Suparna (Section 7 #4); site shows no email until set. `/resume` + the generated PDF intentionally keep the institute address (faithful resume artifact) |
| Phone display | `PHONE` / `PHONE_TEL` in `site.ts` | done — tap-to-reveal on Contact only; hero phone removed; raw digits absent from home static HTML (verified: 0 hits) |
| "My part" lines | `CORPORATE[*].myPart` | hidden — pending Suparna's one-liners (P0-3) |
| 96.7% eval numerator | `METRICS['ac-eval']` (`needsReview`) | as-is + dev warning — pending Suparna |
| LinkedIn URL | `SOCIALS.linkedin` | set — **confirm** |
| X handle | `SOCIALS.x` | empty (card hidden until set) |
| Vercel live + PRD links | `PROJECTS[*].links` | hidden until supplied (render guard `link()`); 4 pending |
| Deck links | `CORPORATE[*].deck` (Everyday: Series A deck, Fedaykin: Project report), `ACHIEVEMENTS[*].deck` (Accenture, IIM, NextLeap) | hidden until supplied (render guard `link()`). Plan: when PPTs arrive, extract slide 1 → `public/images/decks/*.webp` and render a clickable thumbnail that opens the deck URL |
| GitHub user | `GITHUB_USER = 'suparna-deshmukh'` | verify |

Dead-link guard (P0-1): `link(href)` in `site.ts` returns `undefined` for empty
or `#` URLs, so chips/cards with pending URLs render nothing (no dead ends).
`assertNoDeadLinks()` (dev, module load) crawls every href that *will* render
(resume, socials, Unstop, project links and live URLs, corporate and achievement
decks) and throws on a placeholder destination.

Dev loop: `python3 dev-daemon.py` (port 3210) → `npx tsc --noEmit` → headless CDP
screenshots (fresh Chrome profile per run — stale profile cache can serve old chunks)
→ PIL slices → review → `git add -A && git commit` (local commits only, **no remote**).
NEVER `npm run build` while the daemon runs (corrupts `.next`).
