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
