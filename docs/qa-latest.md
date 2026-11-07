# QA report — final pass

Date: 7 Nov 2026 (00:30–01:40 IST) · Build: production build on port 3211 (Turbopack, distDir `.next-build`) · Method: headless Chrome over CDP, fresh profile per run; axe-core 4.10.2; Lighthouse 12.8.2 (mobile, simulated Slow 4G + 4× CPU) plus real-throttle LCP probes; no-JS via script-stripping proxy.

## 1. Viewport matrix (home, light + dark)

| Viewport | Light | Dark |
|---|---|---|
| 320×568, 360×740, 390×844, 430×932 | overflow 0 | overflow 0 |
| 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080, 2560×1440 | overflow −10 (scrollbar gutter, no horizontal scroll) | overflow −10 |

Landscape phone 844×390: overflow 0. Zoom proxies (200 % of 1280 → 640 css px, 400 % → 320): overflow −10 / 0. **No horizontal scroll at any tested width, including 320 and 400 % zoom.**

## 2. Routes

| Route | Overflow | Title |
|---|---|---|
| `/projects/askcart` | 0 | AskCart: Guided AI E-Commerce Search and Chatbot · … |
| `/projects/research-agent` | 0 | Research Agent: An n8n Workflow That Turns Reddit and Hacker News into PRDs · … |
| `/resume` | 0 | Resume · Suparna Deshmukh |
| 404 | 0 | Page not found · Suparna Deshmukh |

## 3. axe-core (5 routes × light + dark)

Final state: **clean on all 10 combinations** (0 violations).

Fixed in this pass (before → after on `/` light):
| Issue | Before | Fix |
|---|---|---|
| `color-contrast` `.acp-card small` (phone mock) | 3.47:1 | `#1F6B4F` in `hero-right.css` (5.9:1 on the always-light screen) |
| `color-contrast` `.cf-legend`, `.secref` (sand band) | 4.38:1 | light `--dimmer` `.62 → .70` in `globals.css` (≈5.6:1) |
| `color-contrast` corporate stamp text | 4.39:1 | `.cf-file --stamp` `#B24A26 → #963A18` (stays a rust ink, passes at the 92 % pressed opacity) |
| `nested-interactive` ×3 `.cfdoc[role=img]` (replay button inside the figure) | serious | `role="img"` moved to a new `.cfdoc-fig` wrapper (paper + stamp); Replay button is a sibling with `stopPropagation` |
| `nested-interactive` `.ys` (YearStrip `role="img"` wrapping links) | serious | `<figure role="group" aria-label>` — named group, not a presentational role |
| `landmark-unique` `disc-body[role=region]` ×6 (all labelled "More detail") | moderate | `role="region"` + `aria-label` dropped from the Disclosure body (the button's `aria-expanded`/`aria-controls` is the APG pattern) |
| `landmark-no-duplicate-banner` + `landmark-one-main` + `region` ×6 (`/resume`) | moderate | resume sheet is now `<main>`; the sheet `<header class="r-hd">` is a `<div>`; print hint moved inside main with a fixed on-paper color (`#5F6F62`, 5.3:1 on the white sheet in both themes) |
| `color-contrast` `.foot-motion` / `.links` (transient) | 1.01:1 | root cause: `content-visibility:auto` with a 1200 px estimate on `#contact` let the footer box escape the band's paint box in the skipped state. `#contact` removed from the `content-visibility` set (last section — little to gain); QA scroll pattern also made user-realistic (iterative to true bottom) |

`/resume` dark additionally had `.r-print-hint` at 2.23:1 on the white sheet after the main-landmark move — fixed with the fixed on-paper color above.

## 4. Keyboard

140 Tab steps on `/`: clean order (skip link → home → resume → motion toggle → theme toggle → sections…), no focus trap, wraps at step 101. Every disclosure, folder tab, method step, replay button and YearStrip item reachable; focus ring 2 px with 3 px offset.

## 5. Scroll trace (4× CPU throttle, rAF deltas)

| Run | Frames | Frames > 50 ms | Max frame |
|---|---|---|---|
| Idle baseline (top of page) | 119 | 0 | 19 ms |
| Full-page scroll, 800 px steps (final build) | 206 | 0 | 29.8 ms |

Budget "no long frames above 50 ms in a scroll trace": **met**.

## 6. Performance

| Metric | Budget | Measured |
|---|---|---|
| LCP (real throttle: 390×844, Slow 4G + 4× CPU, `PerformanceObserver` LCP) | ≤ 2.0 s, text-or-fast-asset | **1.25 s** — LCP element is the hero ID-badge portrait, `priority` (added this pass; it was `loading=lazy` before) |
| CLS (Lighthouse mobile) | ≤ 0.02 | **0** |
| TBT (Lighthouse mobile) | ≤ 150 ms | **20 ms** |
| FCP (Lighthouse mobile) | — | 1.2 s |
| Lighthouse mobile (simulated) | Perf ≥ 95, A11y 100, BP 100, SEO 100 | **88 / 100 / 100 / 100** |

**Documented deviation:** Lighthouse's *simulated* mobile LCP (3.9 s) is a 4× CPU model artifact — the same image's measured load-and-render breakdown totals ~200 ms, and the real-throttle LCP is 1.25 s. This deviation was already recorded in `docs/baseline.md` for the previous build (sim 3.3–3.9 s vs real 1.66 s); the badge `priority` fix improved the real number by ~0.4 s. All other budgets (CLS, TBT, a11y, BP, SEO) are met.

## 7. Links

58 hrefs on `/`: 0 dead (`#`/empty/localhost), no internal 4xx. `assertNoDeadLinks()` + `assertSections()` run at build time (dev assertions).

## 8. No-JS (script-stripping proxy)

1280 / 1024 / 390: no horizontal overflow; all 6 disclosures expanded (SSR); 9 corporate mini-doc rows, 6 offer stamps, YearStrip and hero nameplate all rendered; contact renders the `mailto:` fallback. Evidence: `nojs-*.png`. (Note: the proxy strips `<script>` tags but keeps scripting enabled, so the `<noscript>` style block is inert in that harness; the noscript exhibit-fit scale applies in true no-JS.)

## 9. Print

`printToPDF` of `/` → `fq-print-home.pdf`: chrome removed, one column, bands unpainted, disclosures expanded, papers un-rotated, stamps full opacity. `/resume` keeps its A4 `@page` layout.

## 10. Motion states

Reduced-motion run (1280, dark): all figures on finished frames (`fq-reduced-motion-1280-dark.png`). Motion Off: identical finished frames, zero animation. Idle for 30 s: no animation in Corporate / Data / About sections (play-once policy).

## 11. Console

0 console errors, 0 hydration warnings across all route/theme runs.

## 12. Final matrix + before/after (stamp rust)

Captured on the final build after the a11y pass (motion off, fresh profile):
* `mx-1440-light.png` / `mx-1440-dark.png` — desktop matrix tops (1440×900)
* `mx-390-light.png` / `mx-390-dark.png` — mobile matrix tops (390×844)
* `mx-390-corporate-light.png` — corporate folder-tab accordion at 390
* `corp-files-1440-light.png` — all three corporate files at 1440
* **Stamp before/after:** `corporate-desktop-1440-light.png` (commit `d3a9590`,
  `--stamp: #B24A26`, `--dimmer` `.62`) vs `corp-file-1440-light.png` (final,
  `--stamp: #963A18`, `--dimmer` `.70`). Same composition; only the ink is one
  step deeper so the 92 %-opacity stamp text clears 4.5:1. Dark-mode stamp
  (`#E08A5E`) is unchanged — `corp-file-1440-dark.png`.

## 13. Hero spacing pass (visual QA fix)

User report: letterhead crowded under the header ("0 margin"), exhibit cards
too close. Measured (stage-space, 1366×768, pre-fix): RISA→phone **−3 px
overlap**, RISA→n1 **−36 px**, n1→n2 **−20 px**, n2→n3 **−18 px**,
badge→campus **−42 px**; letterhead top gap only 36 px.

Fixes:
* `.hd-in` padding-top 84 → 108 px; `align-items:start` under
  `(min-width:900px) and (max-height:760px)` so short laptops keep ≥44 px of
  air under the header.
* Exhibit stage 660×540 → 660×580; cards re-anchored (badge 0/20, RISA 206/36,
  phone 400/16, campus 2/349, notes 246/258–362–466); note padding 9/8 → 7/6.
* `ex-calls` SVG re-anchored to the new frame (viewBox 660×580).

Verified post-fix (stage-space, identical at every width): badge→RISA 15.9,
RISA→phone 10.7, badge→campus 12.8, RISA→n1 15.6, n1→n2 10.4, n2→n3 13.4,
campus→n1 10.5, n1→phone 10.3. Letterhead top gap: 60 px @1366×768,
56 px @1280×800, 44 px @1024×768, 114 px @1440×900, 40 px @390 (mobile layout
unchanged).

Evidence: `hero-1366-before.png` vs `hero-1366-after-light.png` /
`hero-1366-after-dark.png`; plus `hero-1440-after-dark.png`,
`hero-390-after-light.png`, `hero-390-after-dark.png`.

Re-verified after rebuild: `npm run check` green (only the expected
`ac-eval` needsReview note); `qa:fonts` PASS at hard viewports (no text below
11 px); horizontal overflow 0 at 320 and 2560; axe-core 0 violations on `/`
light + dark; 0 console errors/warnings. All 7 home sections re-shot at
1440 light+dark and 390 light — no rendering regressions.

## 14. Reviewer screenshot batch + Nov 2026 resume sync (final QA)

Context: reviewer annotated 10 screenshots (hero letterhead, hero exhibit,
experience, gauge, projects, corporate doc, data figures, about, resume) and
supplied the **updated resume, now the single source of truth** for every
number. All ten items fixed, then a full re-verification pass.

### Per-image fixes
1. **Letterhead.** `.tb-line` base padding was 0 — text sat on the card
   border (the "no breathing space" report). Now `14px 26px 2px`
   (`11px 20px 2px` ≤520). "intern" → "Intern". Placements detail
   "240 placed · batch 58% → 85%" → **"Selected 1 of 8 of 1,000+
   students"** (`pc-select`/`pc-pool` — the 240 number was removed from the
   hero per review). Name clamp 56→52px and seal 60→52px so the rotated
   seal clears the nameplate.
2. **Hero exhibit.** Stage 660×580→610; campus card re-anchored 349→393 /
   216w; g2 callout re-anchored (no more overlap with the RISA card). RISA
   card now shows **four op metrics** (350 hrs/wk big + 200 users · 400
   docs/day · 85% coverage / 96% precision). The AskCart phone loop was
   verified to be e-commerce content only (sneaker SKUs, ₹ price bands,
   "no results → guided re-run") — **no trips/travel content exists**;
   reviewer misread.
3. **Experience manifest.** 4-col → 3-col grid with metric stacked over
   year in the right column — the metric/sector collision is gone.
   `.rt-node` `z-index:4` — the trail no longer paints over the station
   circles.
4. **RISA featured card.** Was 997px tall. Padding 28/30→22/26, hero
   58→50px, tighter li rhythm; the 7 resume bullets are punchy and fully
   inline (nothing in a dropdown).
5. **AskCart gauge.** Track now red 0–40 / amber 40–75 (new `--warn` token)
   / green 75–100; mark at 96.5%.
6. **Projects.** `ProjectIndex` tab strip deleted (file, import, refs,
   prop, call).
7. **Corporate mini-docs.** Rows are now **plain deliverable lines** — the
   "thing → BUILT" verdict pattern is gone (review: don't print a thing and
   then a verdict at it). Everyday doc type "Term sheet" → "Series A
   deck"; rows: profitability/pricing model · 4-year roadmap, 5 stores ·
   Series A deck ($2.5M raise). No truncation anywhere.
8. **Data figures.** Heatmap: dormant-row label on a leader line, wk0/wk8
   axis centered under columns. Bars: ranked 1–5 with channel labels,
   baseline axis aligned to bar bottoms. Donut: legend beside the ring
   ("P1 · 34%" pairs), old bottom caption removed. ≤640 SVG label fonts
   step up (17px axis/legend, 20px mid) — ≥11px effective at 320.
9. **About.** `.ab-panels` `align-items:start` — panels keep natural height
   (the empty stretch is gone). YearStrip: short codes (PC/DIR/CD,
   ED/FA/KC, RISA), `pack()` row-packing with ~1 month breathing room,
   honors as labelled dots, year headers `space-between` (were running
   together).
10. **Resume page.** Synced to the new resume: RISA 7 bullets
    (350 hrs/200 users · 400 docs/day · 85%/96% · 92% Vapi · 2x/40%/2500
    orders · Pulse 87%/60% · RISA Assist −60% TAT · Document Studio
    $10K/yr + 70% step TAT · 4 UI steps −30%), InvestMates sessions 10%,
    Chimera $4M pipeline (was $5M), AskCart "96.5% pass (113)" / "78.7%
    resolved in 2 follow-ups (150)". `EDUCATION.grades` surfaced in About
    (CGPA 7.35/10 · Finance GPA 8.8/10). **PDF still exactly one A4 page**
    (92 KB, re-generated). `/resume` at ≤720px now reflows
    (`width:auto; max-width:210mm`) — horizontal overflow at 320 was 237px,
    now 0.

### Resume number changes (site-wide, all via `METRICS`)
`risa-hours` 500→350 · `risa-docs` added (400) · `risa-coverage` 75→85 ·
`risa-payers` removed (no longer in resume) · `im-sessions` 20→10 ·
`ch-pipeline` $5M→$4M · `ac-eval` 96.7→**96.5% = 109/113, needsReview
retired** (confirmed numerator, assertion now verifies) · `pc-pool`
(1,000+) + `pc-select` (1 of 8) added.

### Follow-up fixes (this final session)
* **Corporate doc play-once hold** 4150→1200 ms. The old hold was the
  loop's rest phase; with play-once it left a settled doc sitting 4.15 s
  before the re-write — and a screenshot caught the 0.38 s blank window
  (rows cleared, none re-injected yet), which read as a rendering bug. DOM
  probes at t+1s/7s/30 s in **both motion states** confirm rows are
  `.inj`/opacity 1 and the stamp is slammed; the finished frame is stable.
* **Corporate order.** The array (Everyday, Fedaykin, KriSHE) didn't match
  the documented newest-first order. Reordered to **KriSHE '25 → Everyday
  '24 → Fedaykin '24** (brief C-3/C-8 default; the spec already said
  newest-first) and renumbered `no` 1–3 to follow display order.
* **Stamp wording wired.** The doc stamp sub now renders `c.stamp` (the
  approved outcome phrase in data: "Series A aided" / "Pricing audit done"
  / "Grants pursued") instead of the doc type word; the now-unused
  `doc.stampWord` field was deleted from the schema.
* **No infinite loops in the five sections (X-6 DoD).** Emblem micro
  animations (diamond glow/shine/sparks, AV lane/scan/car/blips, sprout
  dots), the Director tile-dot hover loop and the spike-chart peak pulse
  were all `infinite`. Now one-shot on first view (iteration `1`), resting
  on the finished frame; hover/focus is a transform-only lift
  (`scale(1.08) rotate(-2deg)`, `motion-ok` gated). `infinite` count in
  `corporate.css` and `about.css`: **0** (remaining `infinite` rules are
  site-wide ambient band backgrounds, frozen by Motion Off).

### Verification (final state)
* `npm run check` green (tsc + eslint + resume house style, 30 bullets).
* `qa:fonts` PASS on `/` at all matrix widths; `/resume` exempt (see
  deviation).
* Horizontal overflow at 320: 0 on `/`, `/projects/askcart`, `/resume`
  (was 237 on `/resume`).
* Console: 0 errors on `/`, `/projects/askcart`,
  `/projects/research-agent`, `/resume` (motion on, sections scrolled
  through).
* Corporate DOM probe (motion off and on): rows `inj`/opacity 1 at
  t+1 s, t+7 s, t+30 s; stamps `slammed`; off-screen file `paused`.
* PDF: one A4 page, 92 KB, regenerated from the final `/resume`.

Evidence: `fin-corp1440-light/dark.png`, `fin-corp390-light.png`,
`fin-about1440-light.png`, `fin-data1440-light.png`, `fin-resume1440.png`,
`cp-corp-off.png`, `cp-corp-on-rest.png`, `ls-hero-320.png`,
`ls-exp-320.png` (in `/tmp`; the earlier `ls-corp-everyday-1440.png` with
"missing rows" was the pre-fix build caught in the blank window —
superseded by `cp-corp-*`).

### Deviations
* **`/resume` is exempt from the 11 px floor.** It renders a print-faithful
  A4 artifact (8.3 pt body is standard on paper); inflating the type broke
  the one-page fit, and recruiters print this sheet.
* **Corporate emblem hover** is a transition lift rather than a re-run of
  the emblem choreography — transform-only, and the emblems' one-shot
  play is not retriggerable by CSS alone.

## 15. Punch pass (Corporate / POR / Data) — final QA

Context: the punch-pass brief (one big number per object, subtle looped
HTML-label figures, punchier copy, mobile) on top of the user's screenshot
round. **Process note:** the prod server found at the start of this pass was
serving a stale intermediate build (corporate doc rows, manila tabs and hero
notes were all older than the committed code); everything below was verified
against fresh `npm run build` + restart cycles on the final worktree.

### What changed in this pass
* **POR** — one panel anatomy: one-line eyebrow (`0N · ORG`, ellipsis +
  `title`), 24px role + dates row, 48/40px hero figure (Placement `58% → 85%`
  counts 58→85; Director ₹17L + 24px "3,200 registrations"), ≤90-char line,
  ≤2 chips, `Details` closed by default. OfferStamps + TeamDots deleted:
  Placement = 10px track, 58→85% segment fill + round **240 PLACED** stamp
  slam (−6°, `--settle`) + one 180ms card nudge; Director = single 16-tile
  row (14px, 40ms stagger, caption "16 projects · 45 consultants"). CEL is a
  one-row strip (40+ / 400K+ / ₹10L+ with labels). Sponsors: static line in
  details, no marquee. Nothing loops in POR; hover/focus/click replays one
  visual.
* **Corporate** — order Everyday → Fedaykin → KriSHE (per owner); manila tab
  "FILE 0N ·" prefix removed (now "via · year"); right column = eyebrow
  chip, h3 + mono meta, **big proof** (52/40px CountUp + chip label +
  attribution), one `Rich` line, one non-duplicate chip, `Details`
  (`points.slice(1)`), deck chip hidden while empty, "Ask me about it →".
  Mini-doc: gauge arcs and "file 0N" sub-line gone, stamp padding fixed
  (clears the last row at 320), loop restored (8800ms, rows 380/1500/2620,
  stamp 4650, pause off-screen, replay on hover/focus/tap/button).
* **Data** — `.dl-slot` rebuild: fixed 82px stage (66px chart + 16px caption),
  identical across all four cards; shapes as HTML divs / fixed-size SVG,
  **all labels HTML 11–12px** (no scaled SVG text); per-slot `useTimeline`
  8500ms loop, `initialHoldMs: 0` (starts on scroll-in, loops in view);
  heatmap column fade-in + dormant ring/pulse, bars scaleY stagger + count-up
  values + accent pulse, spike draw/area/peak, donut segment draw + legend
  slide + centre count. Row/bar/legend isolation via `tabindex`+`aria-label`
  + `data-a`; slots are `role="img"` with finished-state labels.
  **Illustrative** tag moved from the card's top-right corner into the slot's
  caption row (quiet dashed 11px, bug H). Result figures 36px accent.
* **Projects** — AskCart report + Research board: `initialHoldMs: 0` /
  `FIRST_HOLD_MS = 0` — animations start on scroll-in and keep looping in
  view (no hover needed); Research band palette → green `--pa-fl` (matches
  the agentic extractor).
* **Hero** — RISA card 2×3 op-metric grid (400 docs/day, 92% Vapi, 2x QC,
  87% auto-RCA, 60% portal TAT, $10K/yr Doc Studio); n1 re-anchored 258→282
  for the taller card; aria-labels colon-separated (no em dashes).
* **Experience** — RISA renders as a standard card (featured treatment
  retired): 7 punchy result rows + always-present "All 8 results" dropdown
  (the 350 hero lives only in the hero figure).

### Verification (final build, this session)
* `npm run check` (tsc + eslint + resume lint): **green**.
* Console: **0 errors** in every screenshot run (1440/1024 light, 390/320
  dark/light, reduced-motion run).
* `node scripts/qa-fonts.mjs --routes /`: **PASS** at 1440→320 (no effective
  text < 11px).
* No-JS: disclosures SSR closed + `<noscript>` expands `.disc-body`;
  corporate files fully expanded.
* Reduced motion (`--force-prefers-reduced-motion`, 1440×4000 full page):
  every figure on its finished frame — track segment filled + 240 PLACED
  stamp, tile row filled, data cells/bars/line/donut/legend fully painted,
  corporate files at opacity 1. Crops: `rm-about.png`, `rm-corpdata.png`.
* Served-HTML asserts: no "Term sheet" row, no "FILE 0N" tab, corporate
  order everyday→fedaykin→krishe, `RISA Labs:` colon, 4× "Illustrative".
* 320: no horizontal scroll (resume reflow verified in §14; about/corporate/
  data re-shot this pass, no clipped text).

### Screenshots (in /tmp/qa11/)
`fin-1440-light-{hero,about,corporate,data}.png`, `fin-390-dark-{...}.png`,
`fin1024-1024-light-{about,corporate,data}.png` (punch build), `fin2-1440-light-
{data,corporate}.png` + `fin2-390-dark-#data.png` (after tab + Illustrative-tag
fixes), `hero3-1440-light-#hero.png` (final hero), `rm-1440.png` + crops
(reduced motion), `done-390-dark-*` half-scale crops used for the 390 layout
check.

### Deviations
* Data figure slots are **82px**, not the brief's 72px (the 6-row heatmap
  needs 66px of chart).
* Donut centre shows only "5" — "segments" would overflow the 43px hole at
  the 11px floor; the caption "5 risk profiles" carries it.
* Corporate mini-doc keeps plain deliverable rows (no verdict chips) per the
  reviewer's "don't say things and then built"; the punch pass's "verdict
  words stay as in data" holds trivially — the data has none.
* "Pause on hover" (brief) is implemented as **replay on hover** on the
  mini-doc, matching the project boards' engine.
* Bar value labels count up once on first view, not on every loop cycle.
* Hero pinned notes unchanged in code ("Top 8 / Accenture", "Placement
  Coordinator / 2026 batch", "$2.5M / Everyday") — the "1 of 8" hero variant
  seen in an earlier stale server render was never committed; "1 of 8" lives
  on the POR panel (chip + details), which satisfies the reviewer's request
  without a third encoding of the same fact.
* `RISA Labs —` em dashes removed from new copy (metrics sources, aria-labels);
  pre-existing em dashes in the About bio and OG images predate this pass.
