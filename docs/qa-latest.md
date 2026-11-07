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
