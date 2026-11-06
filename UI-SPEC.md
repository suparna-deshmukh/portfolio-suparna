# Suparna Deshmukh · Portfolio — UI Specification (end to end)

Complete, file-accurate description of every screen, component, animation and state on the site.
Source of truth: the code in this repo (Next.js 16 App Router, TypeScript, hand-rolled CSS).
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

Stack: Next.js 16.4.5 (Turbopack), React 19, TypeScript, no UI framework, no CSS framework.
All motion is CSS + a few rAF/timeout loops, gated by `html.motion-ok` and
`prefers-reduced-motion: reduce` (no-JS and reduced-motion always show final states).

Local only — **no git remote exists; never push.** Dev server: port **3210**
(`python3 dev-daemon.py`), verified with `npx tsc --noEmit` + headless screenshots.

---

## 1. File map

```
app/
  layout.tsx                 fonts, metadata, Header, FloatNav, P99Panel, ViewTransitionResolver,
                             noscript fallbacks (exhibit fit + JS-only controls)
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
  typography.css             P3-1: balance/pretty/hanging-punctuation/tabular-nums
  micro-interactions.css     P3-2: press, underline draw, chip ink-sweep, toast offset, focus ring
  print.css                  P3-4: full-site print stylesheet (chrome off, one column, disclosures open)
  lib/
    site.ts                  ALL home data: EXPERIENCE, CORPORATE, POSITIONS, ACHIEVEMENTS,
                             EDUCATION, NAV_SECTIONS, SOCIALS, LOG, EMAIL/PHONE, URLs,
                             DATA_LEDGERS (data projects), HERO_LINE, CORPORATE_LEDE,
                             METHOD_STEPS, ATTRIBUTION_LEGEND; link() render guard,
                             assertNoDeadLinks() + assertSections() dev assertions
    metrics.ts               METRICS registry: every printed number, once, with source + asOf;
                             m(id) lookup, assertMetrics() dev-time rate check
    timeline.ts              useTimeline: declarative steps, finished first frame,
                             visibility/tab pause, loop?: false (play-once), tl.replay()
    resume.ts                RESUME copy — only home for /resume and the PDF; assertResume()
                             house-style lint (125-char lines, banned symbols, **bold**)
    content.ts               PROJECTS (full case bodies, stats ids), NOW
    posts.ts                 case/post helpers, readMinutes, dev-only assertExcerpts
    hooks.ts                 usePrefersReducedMotion, useVisibleLoop, useInViewOnce,
                             useSectionArrival, useBandPause, istTime, SECTION_EVENT
  components/
    Header.tsx  FloatNav.tsx  PageMotion.tsx  SectionHeader.tsx  SecRef.tsx  CountUp.tsx  MetricTip.tsx
    Proof.tsx  Attribution.tsx  Disclosure.tsx  ProvenanceChip.tsx  YearStrip.tsx  Stamp.tsx
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
| `--fd` (display) | **Fraunces** (self-hosted variable woff2, weights 100–900 declared, `--font-display-var`; no italic — none is used) | section titles, big numbers, name, quotes |
| `--fb` (body) | **Satoshi** (local woff2: 400/500/700) | all body copy, buttons |
| `--fm` (mono) | **DM Mono** (400/500) | labels, metrics, chips, meta, clocks |

* All faces load via `next/font` with `display: swap`; the two local faces use
  `adjustFontFallback` (measured against Arial) so swap causes no layout shift.
  `font-optical-sizing: auto` on `:root` drives Fraunces' opsz axis.
* Licensing: see `LICENSES.md` (all three are OFL 1.1). The static
  `Fraunces-Latin-600*.ttf` / `Satoshi-*.ttf` instances exist only for
  `next/og` (see §19).

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

* Preference: **system** (default), light, dark — stored in `localStorage.theme`,
  resolved to `html[data-theme="light"|"dark"]` by an inline pre-paint script in
  `<head>` (no flash; the static `data-theme="light"` attribute is the no-JS
  fallback). The script also sets `style.colorScheme`. `suppressHydrationWarning`
  on `<html>`. Broadcast via `themechange` event.
* `DEFAULT_THEME`, `NEXT_THEME`, `THEME_COLORS`, `resolveTheme` live in `site.ts`.
* Toggle: cycles system → light → dark (half-filled circle / sun / moon icon).
  Accessible name states the current mode and the next one. While the preference
  is system, a `prefers-color-scheme` change listener re-resolves live. On every
  apply, the `meta[name="theme-color"]` tags (light/dark media variants from
  `viewport`) are updated to `THEME_COLORS`. Uses
  `document.startViewTransition` with a **circle wipe from the click point**
  (550ms, `cubic-bezier(.65,0,.35,1)`,
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

1. **`html.motion-ok`** — added by the inline pre-paint script (layout.tsx) when JS is
   on, the user hasn't requested reduced motion, and the user's Motion control is on.
   Every entrance *pre-state* (hidden/offset) is scoped under `html.motion-ok …`, so
   no-JS, reduced-motion and old browsers always show the final composition.
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
9. **Motion: On/Off (user control, P1-5)** — `app/lib/motion.ts`:
   * `localStorage.motion` (`'on'|'off'`, default on). The pre-paint script adds
     `html.motion-off` for a stored `'off'` and *never* sets `motion-ok`.
   * `html.motion-off` CSS (globals.css): every animation collapses to one instant
     iteration (`duration:1ms, delay:-1ms, iteration-count:1`) and every transition to
     `1ms`, so all loops land on a finished frame and one-shots complete instantly —
     WCAG 2.2.2. JS-driven loops keep running their timers but each step is visually
     finished.
   * Controls: a wave icon button in the header (next to the theme toggle) and a
     "Motion: on/off" pill in the footer; both share `useMotionPref()` (subscribes to
     the `motionchange` event), so they always agree.
   * Coarse pointers get no hero pointer parallax; `onMove` also bails while
     `motion-off` is set.
10. **Lite (adaptive degrade, P1-5)** — `html.lite` is set (a) pre-paint when
    `hardwareConcurrency ≤ 4 || deviceMemory ≤ 4 || connection.saveData`, or (b) by
    `PageMotion` on coarse pointers after 3 long tasks (>50 ms) within the first 5 s.
    Lite hides the hero blobs/grid/grain and freezes the band auras and marquees;
    stamps and entrance transitions are kept.

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
Three drifting glow shapes (52/44/30vw, accent/sage/fg tints) — `radial-gradient`
backgrounds, **no `filter: blur()`** (P1-6, §16.1). A 56px engineering grid
(radial-masked, slow 52s pan), and a pre-baked **noise tile**
`/images/noise-128.webp` (5.3 KB seamless, multiply; dark: screen + invert).
All paused off-screen. (The old flowing "roadmap" curves were removed — the
notes float on their own.)

### 6.2 Letterhead (`HeroLetterhead.tsx`, `hero-left.css`)
* **Name row**: `Suparna Deshmukh` (Fraunces 600, "Suparna" set distinct) + a circular
  **seal**: two concentric rings, circular text `SUPARNA DESHMUKH · PRODUCT · CLASS OF
  27 ·` on a text path, "SD" at center.
* **Positioning line** (`.tb-line`, P2-1): `HERO_LINE` from `site.ts` —
  "I build AI products for messy, high-stakes workflows, and measure what
  changes." (Fraunces 500 17px; 15px ≤520). Static on first paint.
* **Three ruled rows** (`.tb-row`, grid 84px | value | detail; dashed separators):
  | label | value | detail |
  |---|---|---|
  | Currently | **Associate Product Manager intern at RISA Labs** | AI workflows, US healthcare |
  | Building | **AskCart** | guided AI search, personal build |
  | Placements | **Placement Coordinator at BITS Goa** | 240 placed · batch 58% → 85% |
  No "live" highlight styling on any row (removed on request).
* **Foot**: primary btn "See the builds ↓" (`#projects`) + ghost "Let's talk"
  (`#contact`); link line: LinkedIn ↗ · (X hidden until handle added) ·
  GitHub ↗. (The hero phone was removed in P0-4; the number is
  tap-to-reveal on Contact only.)

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
| Campus card | 14/318 | 228w | .9 / −2° | `bits-goa-sketch.webp`, "BITS Pilani, Goa", `EDUCATION.branch` ("Electronics and Communication Engineering"), "Finance minor · Class of 2027" → `#about` |

**Pinned notes** (`.ex-note`, taped `::before` tape tab, same parallax/hover/settle as
objects — deliberately *not* static):

| note | pos | depth/rot | num | label |
|---|---|---|---|---|
| n1 | 252/318 | 1.25 / −2° | **Top 8** | of 9,000+ · Accenture Strategy '25 |
| n2 | 252/396 | 1.05 / 1.6° | **Placement Coordinator** | BITS Goa · 2026 batch |
| n3 | 252/472 | 1.35 / −1.2° | **$2.5M** | Series A · 180DC, Everyday Diamonds |

**Callouts** (SVG, dimension-drawing style): `01 · THE PERSON`, `02 · BITS PILANI, GOA`,
`03 · RISA LABS`, `04 · ASKCart` — leader line + endpoint dot to each object.

**Mobile desk (P1-1, ≤640).** The exhibit stops scaling (`transform:none`) and
becomes a flex column: badge + RISA card side by side (equal height), the phone
at native 248×474 centered, the three notes in `.ex-notes` — a horizontal
scroll-snap strip (`scroll-snap-type:x mandatory`, 158px cards, next card
peeks) — then the campus card full width. Callouts and parallax are off;
`display:contents` on `.ex-notes` keeps the desktop layout untouched.

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
An ink-pressed **search quality report**. First frame = finished report; a declarative
`useTimeline` (P2-6, §16.3) replays it from the first failure while in view. Stamp and
verdict ink edges come from the shared baked masks in `stamp.css` — no live filters.

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
* Round double-ring `<Stamp shape="round" tone="ok">` "**96.7 GREEN**" (mix-blend
  multiply, baked rough-ink mask) **slams in** (`stampSlam` .5s, `--settle`) + paper
  **shake** (.55s) while the cycle runs.
* Timing (timeline steps): rows at 400/1750/3100ms (inject → +520ms agent line →
  +1040ms verdict), gauge 4500, stamp 5500, **loop 9500ms**, first-view hold
  `LOOP_MS − STAMP_AT`.
* Interaction: hover tilts the paper 3D (perspective 900, ±3°); hovering a row
  **replays just that row**.

### 8.3 ResearchBoard (`FitStage`)
A **Filtr-style board**: dotted paper, six sticky notes from real threads (source
icons: call/phone, slack/grid, jira/check-square; tags Reddit / HN / Reddit #182;
texts: "battery dies after a year", "still no fast charging", "replaced the pack
twice", "subscription charged twice", "auto-renew trap, again", "size chart is wrong").

Cycle (timeline steps): **thread** (scattered, rotated positions) → **sorted** at
2100ms (notes slide into three theme piles; right side ranks themes with bars, count-up
"**7 mentions**", **FIX FIRST** stamp at +1100ms) → **loop 6800ms**. First hold 2600ms;
count-up 600ms. Hover overrides the display to the scattered state while the loop keeps
its schedule in the background; leaving restores the current cycle phase.

---

## 9. Corporate Projects (`CorporateFiles.tsx`, `corporate.css`)

`band-sand`. Header `xl`: "Corporate projects." plus:
* **Lede sentence** (`.cf-lede`, `CORPORATE_LEDE` in `site.ts`): one sentence
  covering all three engagements and their outcomes. The old aggregate chip
  row ($2.5M raised · ₹12.5L enabled · 30% unit economics) is gone — one
  number, one encoding (S4).
* **Attribution legend** (`.cf-legend`, `ATTRIBUTION_LEGEND`):
  "led — … · built — … · contributed — … · supported — …".

**Skim row + file tabs (C-3).** `.cf-tabs` — one folder tab (`.cf-tab`) per
file: client name, engagement chip, one proof. Clicking scrolls to and opens
the file (deep link `#corporate-<id>`; a matching hash opens that file).
First file starts open. ≤900px the tabs wrap and the files become a stacked
accordion (first open). All three files stay in the DOM at all times and are
fully expanded with JS off.

Each file is an `<article className="cf-file">` in `ol.cf-files`, ordered by
`rank` (newest first: KriSHE '25 → Everyday '24 → Fedaykin '24), two-column
grid `[minmax(218,242)px | 1fr]`, with a **manila file tab** (`.cf-filetab`,
clip-path trapezoid: "FILE 0N · year") along the top edge.

### 9.1 Main-side anatomy (C-1) — identical across all three files
1. **Eyebrow** (`.cf-eyebrow`): engagement chip (`.cf-via` — "180 DC · team
   lead" or "Independent" via `.cf-via.ind`), dates, place.
2. **Title** h3 + one-line **descriptor** of what the client does
   (`descriptor?` — hidden until supplied, C1).
3. **Ask / My part / Outcome** (`.cf-amo`): three short labelled lines; each
   block hidden when empty (all pending — C3).
4. **Proof row**: `<Proof>` chips with `<Attribution>` markers, max 3.
5. **Evidence**: `<DeckThumb>` only when a deck URL exists (none yet; the
   KriSHE file will show none).
6. **Actions**: "Ask me about it →" (`contact:prefill` with a file-specific
   question, see §12.3) + a `Details` `<Disclosure>` holding the `points`
   list.

### 9.2 The mini-doc (left) — play-once, finished frame (C-2)
Self-contained paper (`.cfdoc-paper`) with the 30px emblem, doc type,
"file 0N · Company", three `label → verdict` rows, and a hanging
`<Stamp shape="rect">` (double border + offset outline, rotate −6°, slams with
the shared `stampSlam` + paper shake).

* **Verdict vocabulary.** Rows use *deliverable verbs* — `BUILT`, `DRAFTED`,
  `PITCHED`, `SIZED`, `MAPPED`, `SHARED`, `DONE` (current set: Everyday
  BUILT/DRAFTED/BUILT · Fedaykin DONE/BUILT/SIZED · KriSHE
  PITCHED/BUILT/MAPPED). *Outcome words* (`SIGNED`, `LAUNCHED`, `VERIFIED`, a percentage)
  are allowed only when the row carries `evidence` (≥20 chars) and
  `attribution` in data — currently none does, so every visible verdict is a
  deliverable verb. `assertSections()` enforces this in dev.
* **Attribution marker** (`.cfdoc-rowattr`): the row's verb prints small next
  to the verdict.
* **No gauges for money.** The old 100×54 arcs are gone: a gauge may exist
  only for a true ratio with a stated denominator. The proof number (CountUp,
  25px accent) stands alone, with an `<Attribution>` below it
  (`.cfdoc-attr`).
* **Stamps** say what she can defend (C-4): `$2.5M / SERIES A AIDED`,
  `30% / PRICING AUDIT DONE`, `₹12.5L / GRANTS PURSUED`. Fedaykin's −30%
  basis (modeled vs measured, against which baseline) is pending; until
  confirmed the chip keeps the number with an honest qualifier.
* **Motion.** The doc plays **once** on entering view (`useTimeline` with
  `{ loop: false }`): rows 380/1500/2620 ms, verdicts +460 ms, proof 3750 ms,
  stamp 4650 ms, shake 450 ms — then it rests on the finished frame. Replay
  on hover, focus, tap, or the **Replay** button (`.cfdoc-replay`, top-right,
  revealed on hover/focus, 44px hit area). Reduced motion / Motion Off:
  finished frame only, no replay.

### 9.3 Emblems
30px header marks only (diamond / AV lane / sprout); they animate once on
first view and on hover/focus, static otherwise. The unused full-size emblem
CSS and keyframes were deleted (C-5).

### 9.4 Data and claims
* `CORPORATE` uses the typed schema from §20 (`engagement`, `rows` with
  `attribution`/`evidence`, `proof`, `chips`, `points`, `deck`,
  `askPrefill`, `rank`).
* `assertSections()` (dev, module load): an outcome-word verdict needs
  evidence + attribution; visible deck hrefs may not be `#`/empty; rate
  proofs must reproduce `shown` within 0.05.
* The header sub-line states which engagement is independent (Fedaykin) and
  which go through 180 Degrees Consulting (Everyday, KriSHE).

| file (display order) | engagement | stamp | proof line |
|---|---|---|---|
| KriSHE Carbon (no 3, Jul–Aug '25, Gurugram) | 180 DC · team lead | ₹12.5L / GRANTS PURSUED | ₹12.5L grants pursued via deck and biochar model |
| Everyday Diamonds (no 1, Aug–Sep '24, Bengaluru) | 180 DC · team lead | $2.5M / SERIES A AIDED | $2.5M Series A aided, All In Capital |
| Fedaykin AV (no 2, Jul–Aug '24, Remote) | Independent | 30% / PRICING AUDIT DONE | 30% annotation-cost reduction found (basis pending) |

**Mobile ≤640 (C-7).** File tab stays on top; doc (max 300px, centered)
first, then Ask / My part / Outcome, proof, deck, actions; verdict chips and
stamp text ≥ 11px; accordion with the first file open.

---

## 10. Data Projects (`DataLedger.tsx`)

Data lives in `site.ts` as `DATA_LEDGERS` — the typed schema from §20:
`provenance?`, `finding?`, `points`, `result`/`resultMetric`/`resLabel`,
`kind` (`outcome | modeled | measured | scale`), `figure { type, status }`,
`tech`, `links?`, `detail?`; headline figures read from the `METRICS`
registry by id (`resultMetric`). Order is by `rank`
(PM relevance, D-6): Mutual Fund → Growth Attribution → Content Virality →
Loan Risk.

Header `sm`: "Four ledgers, one method." + **method strip** (`.dl-msteps`,
`METHOD_STEPS` = Question · Data · Analysis · Result): four labelled steps
shared by every card. Hovering (or keyboard-focusing) a step dims the
non-matching blocks in every card (`.dl-grid[data-hl]`, focus parity) — the
"one method" claim made visible (D-3). `.dl-grid` = 2×2 (18px gap; 1 column
mobile).

Each **ledger card** (`.dl-card`): ruled paper (rule every 32px), **red
margin line** at 26px, file number top-right, padding-left 44px (36px ≤640).
Anatomy (D-2), identical for all four:
1. **Head**: h3 (19.5px Fraunces) + `where` line + **ProvenanceChip**
   (`Public data` / `Synthetic data` / `Client data` / `Illustrative`, 11px
   mono, distinct outline).
2. **Finding line** (Fraunces 17–19px) — the "so what", leading with the
   insight; hidden until supplied (all four pending — D1).
3. **Figure** (`.dl-vis`): the same four visual ideas (spike line, cohort
   heatmap, channel bars, risk donut) rebuilt as `width:100%` SVGs with a
   `viewBox` — no more 300px graphics scaling down to ~80% on phones; label
   text ≥ 11px effective at 320–1440 (D-5). All four are currently
   `status: 'illustrative'` and carry a corner **Illustrative** tag; their
   hard-coded arrays stay out of any claim until real exports from the
   notebooks arrive (D4). Hover isolations (heatmap rows, bars, donut
   segments) have focus/tap equivalents.
4. **Question and Approach**: two short labelled lines (replace the two
   generic points); hidden until supplied.
5. **Result block**: `<Proof>` with qualifier; the label is driven by
   `kind` — **Result** (`outcome`, e.g. 82% AUC), **Modeled** (`modeled`,
   e.g. the −28% CAC simulation), **Scale** (`scale` — dataset sizes are no
   longer labelled "Result").
6. **Tech chips** (SQL, Python, …).
7. **Links row**: `Repo ↗` / `Notebook ↗` via `link()` — hidden until
   supplied (D5).
8. **`Method and limits`** `<Disclosure>`: method bullets, one real chart
   (≤15 KB SVG with text alternative), "what this would inform at a product
   company", limits — hidden while empty (D6).

| file | project (display order) | provenance chip | result (kind) | figure (status) |
|---|---|---|---|---|
| 02 | Mutual Fund Activation & Retention (rank 1) | Synthetic data (AMFI-style) | 50K users (Scale) | cohort heatmap (illustrative) |
| 03 | Growth Attribution & CAC Optimization (rank 2) | — (chip hidden, pending D2) | −28% CAC (Modeled) | channel bars (illustrative) |
| 01 | Content Virality Prediction & Segmentation (rank 3) | Public data (YouTube Trending) | 82% AUC (Result) | spike line (illustrative) |
| 04 | Loan Risk Segmentation & Default Prediction (rank 4) | Public data (LendingClub) | 100K+ records (Scale) | risk donut (illustrative) |

`assertSections()` (dev, see §20): `kind` is mandatory; an unconfirmed
provenance must use an `illustrative` figure; visible links may not be `#`.

**Mobile ≤640 (D-7).** One column; figure full width; links row wraps;
disclosure full width; all text ≥ 11px at 320.

---

## 11. About — "The person behind the work." (`About.tsx`, `about.css`)

Background: slow **aurora** — two 46vw radial-gradient blobs (accent + sage)
drifting 16/19s. Header `serif`, meta ["Associate Product Manager intern at
RISA Labs", "Bengaluru"], aside = **CurrentlyTicker**: rotating fact line
(APM intern · AI workflows for US healthcare · Placement Coordinator at BITS
Goa · Consultathon: ₹17L sponsorships, 3,200 registrations · Building
AskCart).

### 11.1 The spread (`.ab-spread`)
A shadowed sheet: **25/75** — left `minmax(0,1fr)`, right `minmax(0,3fr)`
(`--pageX:32px` inner padding; page-edge gradients; folio labels "Suparna
Deshmukh" / "Bengaluru" bottom corners). ≤1024: one column; **mobile/tablet
reading order is quote → bio → Education → positions → honors** (E-4: the
credential surfaces early in recruiter scan order).

**Left page**
* **Pull quote** (Fraunces 30–38px, accent opening quote): "The best product
  decisions come from people, not dashboards."
* **Bio** (2 paragraphs, 60px drop cap on "I"): ECE + Finance minor at BITS
  Goa; drifted into product because the questions were never only about the
  tech; now APM at RISA Labs; outside work leads campus placements and a
  45-consultant practice.
* **Education card** (`.ab-edu`, `id="education"`) — a credential, not a
  diploma (E-1): 56px building crest (custom drawing, never the institute's
  official logo), "Education" label, **BITS Pilani, Goa Campus**, "B.E.
  (Hons.) Electronics and Communication Engineering" (one `EDUCATION`
  constant, shared with the hero campus card and the JSON-LD — E-5; "and",
  never "&"), "Minor in Finance" on its own line (em dash removed), a
  programme dates line (`2023 – 2027`, shown only when confirmed — E1), and
  a round **CLASS OF 2027 seal** — `<Stamp shape="round" tone="ink">` that
  presses once on first view (`useTimeline`, `loop: false`; reduced motion /
  Motion Off: already pressed). No grades anywhere (existing decision).
* **Coursework and academic highlights** `<Disclosure>` (E-2): up to three
  groups of index-card tags (`Engineering core` / `Finance minor` /
  `Product-relevant`) + `Academic highlights` + a one-line bridge sentence —
  all hidden while empty (nothing supplied yet).
* **YearStrip** (E-3, `.ys`): "Four years at a glance" — a compact 2023–2027
  strip built **entirely from `site.ts` data**: lane 1 Study (continuous
  bar), lane 2 Consulting (KriSHE '25, Everyday '24, Fedaykin '24 from
  `CORPORATE`), lane 3 Positions (the three `POSITIONS`), lane 4 Honors (the
  three `ACHIEVEMENTS`). Items are anchors linking to their sections;
  overlaps are visible (honest workload). Keyboard navigable; ≤640 it stacks
  into a vertical year list.

**Right page** — "Positions of responsibility / 3 roles · BITS Goa"

`.ab-panels`: the three `.ab-panel` `<article>`s in one panel anatomy
(R-1), identical across panels:
1. **Eyebrow** (`.ab-eyebrow`): `POSITION 0N`, organisation, dates, `NOW`
   chip (`.ab-now`) when current.
2. **Role title** h3.
3. **Scope line** (`.ab-scope`, one line).
4. **Headline `<Proof>`** (`.ab-headline`) — one number with qualifier, read
   from `METRICS` (R-1 defaults): Placement = `pc-rate` 58% → 85% batch
   placement; Director = `dc-sponsor` ₹17L Consultathon sponsorships; CEL =
   the main Coalescence '24 reach figure (its labels pending — R4).
5. **What I did**: up to 3 lines (`didLines?`, with `<Attribution>`) — hidden
   while empty (R2).
6. **One signature visual (R-2)** — Placement: **OfferStamps** (below);
   Director: **16-tile project shelf** (`.ab-tiles`, fill-in stagger,
   caption "16 projects · 45 consultants"); Creative Director: none.
   TeamDots were removed — a number is never encoded as dots *and* printed as
   a stat in the first screenful (S4).
7. **Chips** (`.ab-chips`): max 2 (e.g. "1 of 8 selected", "Project
   SYNERGY"), plus the `.ab-note` one-line plain explanation for SYNERGY
   (R5).
8. **`More detail` `<Disclosure>`** (`.ab-disc`): secondary stats as the
   `.ab-stats` grid (number + labelled line, each number a `MetricTip`), the
   sponsor line, team structure (pending R8).

* **OfferStamps (R-3)**: the placement ledger — `<Stamp shape="offer"
  tone="ok">` "OFFER" marks, **one per 40 students**: count =
  `floor(placed / 40)`, plus a **partial stamp** (`.ab-offer.partial`, half
  height) when `placed` is not a multiple of 40 — currently exactly 6 × 40 =
  240. The stamps are decorative (`role="img"` wrapper; the caption carries
  the information: "1 stamp = 40 students · 240 placed", count from
  `METRICS`). Cohort check: 85% with 240 placed implies ≈ 282 — to be stored
  in `METRICS` and asserted once Suparna confirms the true cohort (R1).
* **Sponsors (R-4)**: static text (`.ab-sponsors`): "Consultathon sponsors:
  Uplearn by Upstox, NextLeap, Unstop, The MBA Edge" — the 24s marquee was
  removed (WCAG 2.2.2). The real Unstop link chip remains.

**Honors** (`.ab-honors`) — rebuilt for credibility (R-6): three cards,
strongest first. Each: neutral monogram crest (double ring + monogram; no
recreation of any organisation's logo), **result line** (Fraunces 19.5px,
from `METRICS` — e.g. "Top 8 *of 9,000+*"), competition name, **organiser
and year** (now stated on all three), one line on what it was, `My team and
role` when supplied. Evidence: `<DeckThumb>` when a deck exists (none yet —
the deck chips render nothing while `href` is empty); optional `Verify ↗`
link to the organiser's results page (pending). Hover: lift + crest tilt
(−6°), with focus parity. IIM and NextLeap render only the fields they have
today (rank + organiser + year + note) — no fabricated detail (R6).

| card | result | organiser · year |
|---|---|---|
| Accenture Strategy Connect '25 | Top 8 of 9,000+ | Accenture · 2025 |
| IIMA Fintech Frontier '24 | (rank from `iima-rank`; fuller wording pending R6) | IIM Ahmedabad · 2024 |
| NextLeap PM Fellowship '26 | (from `nl-rank`; pending R6) | NextLeap · 2026 |

**Right-page responsive (R-7).** ≥1280: panels side by side only when each
is ≥ 360px wide, otherwise stacked; CEL full width below. 1024–1279: single
column. ≤1024: one page, panels full width, honors in a single column
(crest left, text right). ≤640: headline 36px, OfferStamps wrap into rows of
three, disclosure full width, all text ≥ 11px.

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
| 1280 | About panels side by side only when each is ≥ 360px wide (R-7) |
| 1024 | About spread → one page; bio 2 columns; header drops the location pill |
| 900 | corporate: tab row wraps, files → stacked accordion (first open); route manifest becomes static; hero grid → one column |
| 760 | scroll-padding 56px (56px phone header); FloatNav phone behaviors |
| 640 | **Mobile composition (P1-1)** — see below; header compacts: Resume text hidden (icon kept), "Let's talk" and the theme toggle stay |
| 500 (height) | FloatNav hidden on landscape phones |
| 390 | header wordmark → "SD" monogram |
| 320 | verified: no horizontal scroll anywhere; all visible text ≥ 11px effective (`qa:fonts`) |

**Mobile composition (P1-1, ≤640)**
* **Hero desk** (`hero-right.css`): the exhibit stops using `--s` scaling and
  becomes a purpose-built vertical desk — ID badge and RISA stat card side by
  side (equal height), the AskCart phone at native 248×474 centered (no
  scaled-down text; phone-mock labels raised to the 11px floor), the pinned
  notes as a **horizontal scroll-snap strip** with a peek of the next card
  (`.ex-notes`, `scroll-snap-type:x mandatory`), the campus card last;
  callouts (`.ex-calls`) and pointer parallax are off; the one-time settle-in
  still plays.
* **FitStage un-scale** (`globals.css`): the fixed-size case figures reflow
  instead of shrinking. `.fit`/`.stage` become fluid; the AskCart report
  stacks its rows (chip full width, verdict right) and reserves a 128px band
  under the gauge for the 116px proof stamp; the research board becomes a
  2-column notes grid with the ranked themes stacked below (bars forced to
  their final widths, thread overlay hidden, caption static). Same timeline
  engine, same loop timings, same finished first frame.
* **Corporate** (C-7): accordion mode, doc max 300px centered.
* **Data** (D-7): one column, figure full width, links wrap, disclosure full
  width.

* **Manifest cap (P1-2):** at ≥901px the sticky `.rt-man` gets
  `max-height:calc(100dvh - 120px); overflow:auto` so it never exceeds a
  short laptop viewport (700px-tall screens). A sticky horizontal chip rail
  was the brief's option; the capped static manifest is the shipped, simpler
  deviation (documented).
* **44px hit areas (P1-3):** `.disc-btn`, `.dl-mstep`, `.cfdoc-replay`,
  `.ys-item`, `.ys-dot`, `.secref`, `.themebtn` get an invisible `::after`
  target (`inset:-14px`) — visuals unchanged; FloatNav links get an extended
  target. The route **flight card now also appears on keyboard focus** of a
  manifest row (focus parity; the card stays `aria-hidden` — the station
  carries the content).

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
* Fonts: all three faces are local woff2 via `next/font/local` — Fraunces
  (variable, `adjustFontFallback: Arial`), Satoshi 400/500/700, DM Mono 400/500
  (latin + wider subsets, `app/fonts/dmmono/`). All `display: swap`. No
  build-time network font fetches.
* **Browser support** (last 2 of Chrome/Edge/Firefox/Safari, iOS Safari 16.4+):
  * `--settle` falls back to `cubic-bezier(.34,1.56,.64,1)` where
    `linear()` timing is unparseable, via
    `@supports (transition-timing-function: linear(0, 1))`.
  * `100dvh` (resume page) is preceded by a `100vh` fallback.
  * `@property` registrations (`--pjbg/--pjacc/--tra/--trb`): base rules already
    carry the concrete values (e.g. `#projects` sets `--pjbg:var(--pj-tm)`), so
    without registration the states render correctly and only the *interpolation*
    (color fades, count-up) degrades to instant — a finished first frame either way.
  * `:has()` usage (section-header grid, contact form state, About layout) is
    supported by every browser in the matrix (Firefox 121+, Safari 15.4+);
    unparseable `:has()` rules are simply dropped, and each has a plain fallback
    layout.
  * `document.startViewTransition` is feature-detected in `Header` and
    `ViewTransitionLink`; fallback is instant apply / CSS-only transition.

### 16.1 Rendering diet (P1-6)

* **Grain:** no live `feTurbulence` anywhere in the background layer. One seamless
  128 px WebP noise tile (`public/images/noise-128.webp`, ~5.3 KB) is tiled at
  `background-size:128px` on `#writing::before`, `.hbg-grain` and `.tr-paper::after`
  (opacity .5/.5/.6 light; .08/.12/.12 dark with `filter:invert(1)`).
* **Blobs:** every `filter:blur()` element is a `radial-gradient(closest-side, …,
  transparent 70–72%)` background instead — hero glows g1–g3, the About aurora
  `::before/::after`. Animation is transform-only as before.
* **Containment:** `main>section.band{contain:layout style}` (deliberately not
  `paint` — band auras overflow the box). `content-visibility:auto` +
  `contain-intrinsic-size:auto 1200px` on `#about #corporate #data #contact` only.
  `#hero` (LCP) and `#experience` (trail needs live geometry) stay fully rendered;
  `#projects` left out because the stacked-card view transitions need live layout.
  Anchor jumps, hash scrolling and the route trail were verified after adding it.
* **LCP first-paint rule:** the H1 land (`tbLand`) and exhibit settle (`exIn`)
  keyframes carry **translate only, no opacity** — the name plate and desk objects
  are visible in the very first frame.

### 16.2 JS and loading strategy (P1-7)

* **LazyMount** (`app/components/LazyMount.tsx`): IntersectionObserver-gated mount
  using `useInViewOnce(ref, threshold, rootMargin)`. `app/components/lazy.tsx`
  exports module-level `next/dynamic` (`ssr:false`) wrappers: `LazyAskCartReport`
  and `LazyResearchBoard` (800 px margin — they are the case-card media),
  `LazyEndPull` (800 px), `LazyP99Panel` (2000 px). Static figures render their
  final frame via CSS before the component mounts (see §4).
* **Images:** `next/image` with explicit width/height everywhere — hero portrait,
  campus card (`priority`; it is the real-throttle LCP asset, 1.66 s on a
  real-throttle run) and article covers. `COVER_SIZE` in `Article.tsx` must match
  the real files: askcart 1200×690, research-agent 480×288, null-results
  1200×675.
* **Fonts:** the committed `Fraunces-Latin-Variable-Normal.woff2` (67,388 B) is the
  per-table-compressed source of truth — do **not** regenerate it through
  fontTools' whole-stream woff2 writer (measured 77,412 B) and do not axis-instance
  it (gvar deltas are retained when only the range is clipped; measured 77,444 B).
  The static 600 TTFs (normal + italic) exist only for the icon/OG routes.
* **Budgets:** see `docs/baseline.md`, "After P1-6 + P1-7" — real-throttle LCP
  1.66 s (target met); simulated LCP 3.3–3.9 s (documented deviation); eager JS
  210.3 KB gz vs 170 KB budget (framework floor of the mandated Next 16 / React 19
  upgrade; every app chunk ≤ 25 KB gz).
* `ANALYZE=1` in `next.config.mjs` toggles `@next/bundle-analyzer`; Turbopack
  ignores it (warning only) — use `next analyze` for a webpack report.
* **Dead code, flagged not removed:** `GitHubGraph.tsx` (SocialCards draws its own
  mini grid via `useContributions`; only the type import survives).

### 16.3 Stamp system & timeline engine (P2-6)

One shared stamp + one declarative timeline replaced the per-component timeout
machinery (`trSlam`/`cfSlam`/`fbSlam` deleted).

**`<Stamp />` (`app/components/Stamp.tsx`, `app/stamp.css`)**
* Props: `label`, `sub?`, `tone` (`ok|warn|bad|ink` → `--acc|--paText|--err|--fg`),
  `shape` (`round|rect|offer`), `size` (`sm|md|lg`), `rot` (deg), `slammed` (boolean),
  `decorative`, `className`, `style`.
* Shapes: `round` = 116px double-ring proof stamp (ring in CSS, 30px numeral);
  `rect` = double-ruled plate (2px border + 2px offset outline, 4px radius, `--surf`
  plate); `offer` = thin 1.5px single-rule chip.
* Ink edge: **baked** rough masks (static SVG data-URI with `feDisplacementMap`,
  rasterised once) — `round` circle, `rect`/`offer` rect. No live `feTurbulence` on
  DOM. `.ink-rect`/`.ink-round` utility classes let non-Stamp elements (the `.vd` and
  `.cfdoc-vd` row verdicts) share the same mask.
* One slam: `stampSlam` (scale 2.3→1, `--settle`, .5s) under `html.motion-ok` when
  `.slammed`; base state opacity .92 so the finished frame stands without motion.
  `.stamp.timeline` stamps are hidden until their step fires while a cycle runs
  (`html.motion-ok .stamp.timeline:not(.slammed){opacity:0}`) — in the static first
  frame, reduced motion and Motion Off they are always shown.
* `mix-blend-mode:multiply` in light, normal in dark.

**`useTimeline` (`app/lib/timeline.ts`)**
```ts
const tl = useTimeline(hostRef, steps /* {at, name}[] */, loopMs,
  { initialHoldMs })
tl.has('row1.vrd')  // boolean → drives class names
tl.inCycle          // true only while a replay cycle is running
```
* First frame is the finished state (all steps fired). Each visible cycle clears the
  baseline and re-fires steps at their absolute offsets; the next cycle is scheduled
  at `loopMs` (no chained timeouts — one `later()` batch per cycle).
* Handles: off-screen pause + tab-hidden pause (`.paused` on host, like
  `useVisibleLoop`), reduced motion and Motion Off (final frame, no timers), and a
  pre-cycle hold so the finished state breathes before the first replay.
* Call sites: `AskCartReport` (5500ms stamp, 9500ms loop), `CorporateDoc` ×3
  (4650ms, 8800ms), `ResearchBoard` (thread/sorted/fbstamp, 6800ms, hover overrides
  the display without stopping the schedule).
* Paper shake is tied to the cycle, not the static frame: `.st.shake` is applied only
  while `inCycle && has('stamp')`, so the finished first frame never shakes.

### 16.4 Text-size floor and QA harness (P1-4)

Hard rule: **no visible text under 11px effective** — font-size × cumulative
transform scale × (for SVG text) viewBox ratio — at the hard viewports
1440, 1280, 390, 360, 320; informational text should be ≥ 12px.

`scripts/qa-fonts.mjs` (`npm run qa-fonts`) audits the rendered DOM over
CDP (fresh Chrome profile, motion forced off): it walks every text node
(including SVG `<text>`), computes the effective size, and skips
`aria-hidden` subtrees, `display:none` / `visibility:hidden`, `opacity:0`
and zero-size boxes. It first scrolls the page in 600px steps to mount the
IO-gated figures, then polls for them. `--hard` selects the fail widths;
`QA_W` filters the matrix (default: all of 1440→320).

Contract:
* Base sizes that would dip under the floor once scaled are raised in CSS
  (phone-mock labels 9.5→11px; `.rt-div` 11px; `.ab-team` 11px; `.fb-note`
  13.5px/74px so its 0.82 sort scale clears 11.07px; the four `dl-vis`
  SVG label viewBoxes rebuilt so their labels clear the floor at 320).
* The 640–1024 band keeps the scaled stage per the P1-2 table; sub-11px
  text there is a **documented warn**, not a hard fail, until a tablet
  composition lands.
* `useTimeline` `steps` arrays must be **module-level constants**: an inline
  array gets a new identity every render, which re-triggers the IO effect
  into an infinite update loop (found while wiring the Education seal).

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
`npm run check` = `tsc --noEmit` + `eslint .` (flat config, `eslint.config.mjs` from
`eslint-config-next` 16) + `scripts/check-resume.mjs` (needs devDependency `jiti`
to load the TS resume data). `next lint` does not exist in Next 16.
Builds are isolated from dev: `npm run build` sets `NEXT_DIST_DIR=.next-build`
(next.config reads it), so the dev server's `.next` can never be corrupted.
Repo hygiene (P1-12): no UI-kit or animation dependencies — `motion`,
`lucide-react`, `clsx`, `class-variance-authority`, `tailwind-merge`,
`tw-animate-css`, Tailwind/Postcss were removed; the only runtime deps are
`next`, `react`, `react-dom`, `react-markdown` + `remark-gfm` (case-study
articles), `resend` (contact mail), and `jiti` (dev, resume lint).

## 19. Metadata, sharing & discoverability (P0-6)

All routing-level metadata lives in `app/layout.tsx` and per-route files;
no component-level metadata.

**Base metadata** (`app/layout.tsx`)
* `metadataBase`: `SITE_URL` from `site.ts` (`NEXT_PUBLIC_SITE_URL`, default
  `http://localhost:3210`).
* Title: default `Suparna Deshmukh · AI Product Manager`,
  template `%s · Suparna Deshmukh`. Route titles supply only the first half
  (e.g. not-found is `Page not found`, which renders as
  `Page not found · Suparna Deshmukh` — do not repeat the name in the route title).
* Description, Open Graph (`type: website`), Twitter card, `icons`,
  `appleWebApp`, `viewport` with `themeColor` per color scheme.

**OG images** (`next/og`, satori)
* `app/opengraph-image.tsx` — site card: paper letterhead, name plate, the
  three hero proof rows, pressed SD seal. 1200×630.
* `app/projects/[slug]/opengraph-image.tsx` — per-case card: tint wash by
  slug (CASE_STYLE), `CASE STUDY — NN` label, name, subtitle, tag row,
  hot-stat stamp box. `params` is a **Promise** in Next 15+/16 — the page, its
`generateMetadata` and this OG image all `await` it.
* Fonts: satori in this Next 16 build cannot parse woff2 or variable-font
  fvar tables, so **static TTF instances** live in `app/fonts/`
  (`fraunces/Fraunces-Latin-600.ttf`, `fraunces/Fraunces-Latin-600-Italic.ttf`,
  `fontshare/Satoshi-{400,500,700}.ttf`). Buffers are read once and cached in
  `app/lib/og-fonts.ts` (which also holds `OG_PALETTE`). The woff2 files next
  door are what the site itself loads; the TTFs exist only for OG rendering.
* `new ImageResponse` streams are lazy: rendering only starts when the body
  is consumed. Verify OG output by consuming the response, not by status.

**Icons / app**
* `app/icon.svg` — SD monogram, dark-adaptive via `prefers-color-scheme`
  inside the SVG.
* `app/apple-icon.tsx` — 180×180, Fraunces 600 (static TTF, `weight: 600 as const`).
* `app/manifest.ts` — served at `/manifest.webmanifest` (the `<link>` tag is
  the source of truth; the `/manifest` path 404s by design).

**SEO plumbing**
* `app/sitemap.ts` — `/`, `/resume`, both case studies (with `created_at`).
* `app/robots.ts` — allows all, points at the sitemap.
* JSON-LD: `Person` on home (`jobTitle`, `worksFor` RISA Labs,
  `alumniOf` BITS Pilani Goa, `sameAs` LinkedIn+GitHub, `email` only when
  `CONTACT_EMAIL` is set); `Article` on each case study. Both rendered in
  `page.tsx` via `dangerouslySetInnerHTML` over `JSON.stringify`.

**Error pages in site language**
* `app/not-found.tsx` — blank sheet + slammed `RETURN TO SENDER` ink stamp,
  clear path home + Contact link (`.nf-stamp` in `globals.css`).
* `app/error.tsx` (client) — `VOID` stamp + "Reset" button.

---

## 20. Sections-brief building blocks (`Proof`, `Attribution`, `Disclosure`, `ProvenanceChip`, `YearStrip`)

The sections upgrade brief (Corporate / Data / Education / Positions /
Honors) landed with six shared pieces; later site-wide versions replace
them without rewrites (same names, same props).

* **`<Proof>`** (`components/Proof.tsx`) — a wrapper over `MetricTip`: a big
  figure plus a qualifier (denominator, baseline, period, sample size)
  revealed on hover, focus and tap — keyboard reachable, `aria-describedby`;
  reads from `METRICS` by id when one exists.
* **`<Attribution>`** (`components/Attribution.tsx`) — a small mono glyph +
  word beside outcomes: `led`, `built`, `contributed`, `supported`; ≥ 11px;
  never color alone. The legend prints once per section
  (`ATTRIBUTION_LEGEND`).
* **`<Disclosure>`** (`components/Disclosure.tsx`) — accessible expand /
  collapse: button with `aria-expanded` / `aria-controls`, region labelled;
  the body always stays in the DOM (collapsed with
  `grid-template-rows: 0fr → 1fr`, no layout JS; Motion Off kills the
  transition); **SSR renders expanded** so no-JS and crawlers see
  everything; state persists per instance in `sessionStorage`.
* **`<ProvenanceChip>`** (`components/ProvenanceChip.tsx`) — `Public data` /
  `Synthetic data` / `Client data` / `Illustrative`, 11px mono, distinct
  outline; renders nothing without a value.
* **`<YearStrip>`** (`components/YearStrip.tsx`) — the four-lane 2023–2027
  strip (§11.1), built only from `site.ts` data, clamped so items never
  overflow the track, each item an anchor into its section.
* **`assertSections()`** (`site.ts`, dev, module load — runs alongside
  `assertNoDeadLinks()`): throws when a corporate file has ≠3 rows, a row
  lacks `attribution`, an **outcome-word verdict** (regex: starts with a
  number/`+`, or `SIGNED|LAUNCHED|VERIFIED`) lacks ≥20 chars of `evidence`,
  a rate proof does not reproduce `shown` within 0.05, a visible deck href
  is dead, a data ledger lacks `kind`, an unconfirmed provenance carries a
  `real`-status figure, a position lacks a headline metric, or an honor
  lacks its result or organiser.

**Wording ladder** (sections brief, Appendix B). Owned end to end →
`led` / ran / owned; produced the artifact herself → `built` / drafted /
modeled / wrote; part of a team effort → `contributed to` / worked on;
assisted the owner → `supported` / helped prepare. Banned on the live page
unless she personally owns the outcome: "raised", "enabled", "secured".
Pattern for client/team outcomes: *[verb she can defend] + [artifact].
[client or team outcome, attributed.]*

**Motion policy for these sections (X-6).** No endless loops in §9–§11:
corporate mini-docs, the Education seal and the tile shelf play **once** on
entering view (`useTimeline` with `loop: false`) and rest on the finished
frame; replay on hover, focus, tap, or the Replay button (44px). Reduced
motion / Motion Off: finished frame only. (The hero case figures keep their
site-wide loops, off-screen paused — that is the site-wide brief's policy,
not the sections brief's.)

---

## 21. Site-wide batch (P1-1 / P1-2 / P1-3 / P1-10 / P2-1 / P2-5 / P3-6)

* **P2-1 · hero positioning line.** `HERO_LINE` in `site.ts` (option A from
  the brief): "I build AI products for messy, high-stakes workflows, and
  measure what changes." — rendered as `.tb-line` under the nameplate
  (Fraunces 17px; 15px ≤520). Every clause is provable from the page.
* **P1-1 · mobile compositions.** Hero desk and FitStage un-scale — §15.
  Hero phone-mock text raised to the 11px floor at native size; phone link
  gained an `aria-label` ("AskCart — guided AI search, personal build").
* **P1-2 · manifest cap.** §15.
* **P1-3 · touch targets + hover parity.** §15 (44px hit areas, flight-card
  focus parity).
* **P1-10 · a11y quicks.** The `p99` keyguard ignores form fields and
  modifier keys; About stats use a plain `.ab-stats` div (invalid `dl`
  children removed); a minimal `@media (forced-colors:active)` block keeps
  the paper legible when the OS flattens the palette (underlined links, 1px
  `CanvasText` borders on the main surfaces); `.acp-app small` contrast
  raised (Lighthouse `color-contrast`). Post-fix Lighthouse mobile:
  **accessibility 100, best practices 100, SEO 100**; the remaining
  documented gap is performance (simulated LCP — see §16.2) and a deep
  axe pass across all routes.
* **P2-5 · honest p99.** `P99Panel` reports **TTFB, FCP, LCP, CLS and
  transferred KB** — all real browser measurements (Navigation Timing,
  `paint`, `largest-contentful-paint`, `layout-shift` observers with
  `buffered: true`); nothing simulated. The keyguard and the panel render
  nothing until opened.
* **P3-6 · security headers.** `next.config.mjs` `headers()`:
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`,
  `Content-Security-Policy: frame-ancestors 'none'` (verified on the wire).
  A full CSP ships Report-Only first, once the inline pre-paint theme
  script carries a hash or nonce.

---

## 22. P3 polish (typography, micro-interactions, print & no-JS)

### 22.1 Typography (`app/typography.css`, P3-1)
* `text-wrap: balance` on h1–h4; `text-wrap: pretty` on paragraphs and list items;
  `orphans:3; widows:3` in `.prose`.
* `hanging-punctuation: first` on the About pull quote (`.ab-pq`) — progressive
  enhancement, no layout impact where unsupported.
* `font-variant-numeric: tabular-nums` where figures align in columns: `.ab-stats b`,
  `.ex-note-num`, `.fb-rw .n`, `.cfdoc-gz b`.
* Fraunces ships without italic — there is no italic usage to reconcile.

### 22.2 Micro-interaction catalogue (`app/micro-interactions.css`, P3-2)
Defined once, applied everywhere; every effect gated on `html.motion-ok`, so with
Motion Off or no JS the state changes instantly but nothing is lost:
* **press** — `.cf-tab` and `.themebtn` dip 1px on `:active` (`.btn` keeps its own press).
* **link underline draw** — `.tb-links a::after` accent bar draws left→right on hover
  and `:focus-visible`; the static underline always remains, so links stay
  distinguishable without hover.
* **chip ink-spread** — `.cf-tab` hover tint sweeps in from the left
  (`background-size: 0% → 100%`). The corporate.css hover rule deliberately sets only
  `transform`/`border-color` so the sweep survives the cascade.
* **copy feedback** — the SecRef toast is the single copy-feedback voice; below 900px
  it sits 108px above the bottom edge so it never collides with the phone FloatNav pill.
* **one focus ring** — `outline-offset: 3px` on exhibit objects and form fields, matching
  the global 2px `var(--focus)` ring.

### 22.3 Print (`app/print.css`, P3-4)
The whole site prints as clean one-column content:
* Chrome removed: header, FloatNav, skip link, p99 panel/hint, hero callouts, route
  trail/train, EndPull page curl, SecRef chips.
* Bands, cards and papers lose backgrounds, shadows and rotation (`.cfdoc`, `.rcard`,
  `.ex-ob`, `.ab-panel`, `.dl-card` un-rotate); the exhibit and FitStage figures un-scale.
* Disclosures print expanded (`.disc-body{display:block; grid-row:span 99}`); stamps
  print at full opacity with `mix-blend-mode:normal`.
* Verified: `printToPDF` of `/` → `docs/qa-shots/fq-print-home.pdf`; the resume route
  keeps its A4 `@page` rules (it is the print-first page).

### 22.4 No-JS fallbacks (P3-4)
* All content renders from SSR: disclosures expanded, every figure on its finished
  frame, no spinners.
* `<noscript><style>` in `layout.tsx`: at ≥640px the hero exhibit gets a static
  `scale(.74)` (the JS fit pass never runs) and JS-only controls are removed
  (`.themebtn`, the `p99` hint chip) so nothing dead renders.
* Contact degrades to a `mailto:` link (`noscript` in `Contact.tsx`).
* Verified through a script-stripping proxy at 1280/1024/390: no horizontal overflow,
  all disclosures expanded, corporate rows/stamps, YearStrip and hero all rendered
  (`docs/qa-shots/nojs-*.png`).
