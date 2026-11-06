# Baseline — 6 Nov 2026 (commit before P0 work)

Method: production build (`NEXT_DIST_DIR=.next-build npm run build`, Next 14.2.35 / React 18),
`next start -p 3211`, Lighthouse 12 mobile (Slow 4G, 4× CPU, simulated throttling,
fresh Chrome profile). Screenshots via `scripts/shot-matrix.mjs` (headless CDP).

## Lighthouse — mobile (simulated Slow 4G / 4× CPU)

| metric | value | target |
|---|---|---|
| Performance | **89** | ≥ 95 |
| Accessibility | **90** | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 1.5 s | — |
| **LCP** | **3.8 s** | ≤ 2.0 s |
| TBT | 10 ms | ≤ 150 ms |
| CLS | 0 | ≤ 0.02 |
| Speed Index | 1.9 s | — |
| TTFB (root) | 10 ms | — |
| Total weight | 444 KiB | ≤ 700 KB first load |

LCP element selector not resolved by the run (follow up in P1-7: verify it is text, not image).

## Lighthouse failing a11y audits (mobile run)

| audit | nodes |
|---|---|
| `color-contrast` | `div.sec > header.sh > div.sh-meta > a.secref` (1) |
| `definition-list` | `dl.ab-stats` ×3 (contains `b`/`span` instead of dt/dd) |
| `label-content-name-mismatch` | header wordmark link, 2 hero exhibit links, 2 social cards (5) |
| `link-name` | 1 hero exhibit link (no discernible name) |

## Bundle (gzipped, from `.next-build`)

| item | value | budget |
|---|---|---|
| Home first-load JS (gzip) | **163 KB** (incl. polyfills) | ≤ 170 KB |
| Article pages JS (gzip) | 145 KB | — |
| All client chunks (gzip) | 243.9 KB | — |
| CSS total (gzip) | 33.4 KB | — |
| Fonts in dist | not measured (see note) | ≤ 120 KB critical |

Chunks > 25 KB gz: framework 43.9, main 33.3, 117-* 31.1, fd9d* 52.5, polyfills 38.5 (all framework-level).
Note: local Satoshi woff2 files did not appear in `.next-build/media` — verify font emission path in P1-8.

## Scroll (1440×900, 4× CPU throttle, timer-driven full-page scroll)

24 steps × 400 px to 8 444 px; no hang, no exceptions. Timer gaps: 18 over 50 ms, max 135 ms
(timer cadence under throttle — not render frames). Authoritative scroll-blocking number:
**Lighthouse TBT 10 ms**. A dedicated CDP `Tracing` run returned no events (headless quirk);
revisit with `Performance.getMetrics` LongTaskCount in P1-6.

## Screenshot matrix (26 shots, `docs/baseline-shots/`)

Home × 11 viewports × light/dark: 1440×900, 1280×800, 1024×768, 768×1024, 430×932,
390×844, 360×740, 320×568, 844×390 (landscape), 1920×1080, 2560×1440.
Articles at 1440×900 light: `/projects/askcart`, `/projects/research-agent`.
Mobile articles at 390×844 light: both. 404: not yet built (P0-6). /resume: not yet built (P0-1/P2-4).

## Known issues carried into the backlog

* LCP 3.8 s on simulated mobile — first-load weight; addressed in P1-6/P1-7 (grain, ink
  filters, blobs, JS diet, font strategy).
* 4 a11y rules failing (table above) → P1-10.
* 10 dead `#` links (1 resume, 4 project, 5 decks) → P0-1.
* 96.7 % with n=113 is arithmetically impossible → P0-2 (needs real numerator/denominator).
* `--settle` was only defined under `.case` — corporate stamps/verdicts dead in real
  browsers (fixed in the round before this brief; kept global in `:root`).
* Dead deps in package.json: `motion`, `lucide-react`, `clsx`, `class-variance-authority`,
  `tailwind-merge` (none imported). `tailwind.css` imports full Tailwind v4 utilities.

## After P1-6 + P1-7 (Next 16.4.5 / React 19.2.9, Turbopack build)

Lighthouse 12 mobile, simulated Slow 4G / 4× CPU, fresh profile. Measured twice on 6 Nov
(machine load 3.6–4.6 — sim numbers vary ±0.5 s with it).

| metric | baseline | after | target |
|---|---|---|---|
| Performance | 89 | 88–93 (load-dependent) | ≥ 95 |
| **LCP (sim)** | **3.8 s** | **3.3–3.9 s** | ≤ 2.0 s — **documented deviation** |
| FCP | 1.5 s | 1.2 s | — |
| TBT | 10 ms | 10–20 ms | ≤ 150 ms ✓ |
| CLS | 0 | 0 | ≤ 0.02 ✓ |
| Speed Index | 1.9 s | 1.5 s | — |
| Total weight | 444 KiB | 459 KiB | ≤ 700 KB ✓ |
| Home JS (gz, eager) | 163 KB | 210.3 KB (3 framework chunks 69.8/44.2/38.5) | ≤ 170 KB — **deviation** |

**LCP deviation (real vs simulated).** Real-throttle CDP probe (390×844 @3x, 1.6 Mbps,
150 ms RTT, 4× CPU): LCP = campus image, **1.66 s** (H1 text paints at 1.23 s). The real
world meets the 2.0 s target. The simulated model serialises the whole first load
(~459 KiB of fonts + JS + images over 1.6 Mbps) and lands the H1 repaint at 3.3–3.9 s.
LCP element is text ("Suparna Deshmukh", H1) in sim and the 228×137 campus image
(`priority`) in real throttle — both are first-painted, opacity-free (tbLand/exIn
animations carry translate only; see hero-left.css / hero-right.css).

**Font work (P1-7).** The committed 67,388 B `Fraunces-Latin-Variable-Normal.woff2` is
already per-table compressed (brotli, generated outside fontTools). Re-saving it through
fontTools' whole-stream woff2 writer yields 77,412 B — the committed file stays.
Instancing `wght` to 500–700 (fontTools 4.60.2 `varLib.instancer`) did not shrink the
file (gvar deltas are retained when only the axis range is clipped; 77,444 B) and was
reverted. Removed dead variable-italic sources (`Fraunces-Latin-Variable-Italic.{ttf,woff2}`,
220 KB, referenced by nothing). Built font set in `.next-build/static/media`:
Fraunces 66.8 KB, Satoshi 400/500/700 25.5/25.6/25.3 KB, DM Mono 5.7 KB ×2, two 8.7 KB
OG faces.

**JS budget deviation.** The mandated P1-12 platform upgrade (Next 14.2 → 16.4.5,
React 18 → 19.2.9) raises the framework floor: 210.3 KB eager gz vs 170 KB budget
(+47 KB). Every app-level chunk stays ≤ 25 KB gz. `@next/bundle-analyzer` is wired
behind `ANALYZE=1` but Turbopack ignores it (prints a warning); use `next analyze`
after a webpack build if a report is needed. `GitHubGraph.tsx` is dead code (only its
type is imported by SocialCards) — kept, flagged.

**Rendering diet (P1-6).** Three live `feTurbulence` data-URIs → one 5.3 KB seamless
noise tile `public/images/noise-128.webp` (verified tileable, seed 7, 16 px seam
crossfade). All `filter: blur()` blobs → `radial-gradient` backgrounds (hero g1–g3,
about aurora). `contain: layout style` on `main>section.band`; `content-visibility: auto`
(+ `contain-intrinsic-size: auto 1200px`) on `#about #corporate #data #contact` only —
hero excluded (LCP), experience excluded (trail needs live geometry). Verified: all
sections render, anchor jumps land, route-trail geometry intact (shots /tmp/p16-*.png).

**Lazy mount (P1-7).** `LazyMount` (IO-gated, `useInViewOnce` with rootMargin) wraps
`AskCartReport`, `ResearchBoard`, `EndPull`, `P99Panel` via module-level
`next/dynamic(ssr:false)` in `app/components/lazy.tsx` (mount margins 800/2000 px).
`next/image` with explicit dimensions on hero portrait, campus card (`priority` — the
real-throttle LCP asset) and article covers; `COVER_SIZE` map corrected to the real
files (askcart 1200×690, research-agent 480×288, null-results 1200×675).
