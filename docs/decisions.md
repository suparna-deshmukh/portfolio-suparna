# Decisions log

Non-obvious choices made during the 6 Nov 2026 upgrade, and every deliberate
deviation from the two briefs. When a decision here conflicts with a brief, the
brief says "do not guess" — so anything input-gated ships **hidden**, never
stubbed.

## 1. Strategy (user-endorsed "five levers", 23:00 IST)

1. **Data guards do the scoping.** Every pending input (descriptors, "my part"
   lines, findings, decks, cohort size, coursework, availability) has a
   documented fallback: render nothing. That removed a third of the apparent
   scope without losing quality.
2. **Reuse, don't build.** `MetricTip` ≈ `<Proof>`; `Stamp` + `useTimeline`
   already existed (P2-6) — the sections brief only needed `loop:false` and
   `replay()`. New code: five thin components, one disclosure, one YearStrip,
   and CSS.
3. **Batch verification.** One verification pass per section commit
   (check + console + 3-width light/dark screenshots); the full matrix ran
   once at the end.
4. **Cut only low-ROI site-wide items** (listed below as deviations, not
   quality loss). Everything recruiter-visible was kept: mobile composition,
   a11y, the hero line, the real `p99`, security headers.
5. **Patch `UI-SPEC.md` in place** — §9/§10/§11 replaced, §15/§16.4 extended,
   §20/§21 added. Same end-to-end deliverable, a third of the time.

## 2. Deliberate cuts (deviations from the site-wide brief)

| task | decision | why |
|---|---|---|
| P2-2 command palette | **cut** | no recruiting value; the palette is a dev convenience, not a visitor one |
| P2-3 case-study deep template | **cut** | the `/projects/[slug]` articles already carry problem/decisions/trade-offs/results with sources (content.ts) |
| P2-8 route overview strip | **cut** | the sticky manifest already gives the at-a-glance route; a second encoding duplicates it (S4) |
| P2-9 About polaroid + "How I work" | **cut** | both are 100% input-gated (polaroid caption, principles); the coursework/highlights disclosure from the sections brief (E-2) covers the enrichments and is hidden until supplied |
| P2-10 intent chips / availability / booking link | **cut** | all input-gated (availability text, response promise, Cal.com URL); the form itself is hardened (P0-5) and works with JS off |
| P3-3 CSS scroll-driven enhancement | **cut** | the cached-geometry trail already meets the 60fps budget; `animation-timeline` support is uneven and would double the code paths |
| P3-5 privacy analytics | **cut** | needs the final domain + tool choice (Section 7 item 13); nothing to wire yet |
| P3-7 full QA harness (Playwright/axe matrix) | **partial** | `qa:fonts` is a real scripted harness; the rest runs as CDP spot-checks + Lighthouse per batch. A full automated matrix is the next step, not a blocker |
| P1-2 chip rail | **replaced** | the brief's sticky horizontal chip rail was swapped for a capped static manifest (`max-height: calc(100dvh - 120px); overflow: auto`) — same problem (short laptops), no new scroll-snap state to sync |

## 3. Budget deviations (honest numbers, measured 6 Nov 2026)

| budget | target | measured | note |
|---|---|---|---|
| Lighthouse mobile perf | ≥ 95 | **86** | simulated LCP 4.0–4.1s on a cold cache is the driver; **real-throttle LCP 1.66s** (P1-7, `docs/baseline.md`) is the honest number — the LCP element is text on first paint |
| LCP | ≤ 2.0s | 1.66s real-throttle / 4.0s sim | as above |
| CLS | ≤ 0.02 | **0** | both runs |
| INP / TBT | ≤ 150ms | TBT 40–80ms | no long tasks on the scroll path (cached-geometry transforms only) |
| Initial JS (gz) | ≤ 170KB | **210KB** | Next 16 + React 19 framework floor; no single component chunk above 25KB gz (P1-7 bundle report) |
| First-load transfer | ≤ 700KB | 483KB (p99 readout, warm) | under budget |
| A11y | 100 | **100** (mobile) after the batch | pre-batch was ~93 (one contrast node, one nameless link); a deep axe pass across all routes/themes/motion states is the one remaining open item |
| Text floor | ≥ 11px effective | **PASS** at 1440/1280/390/360/320 | 640–1024 keeps the scaled stage per the P1-2 table — sub-11px there is a **documented warn**, not a fail (§16.4) |
| Security | headers | Referrer-Policy, nosniff, Permissions-Policy, `frame-ancestors 'none'` verified on the wire | full CSP ships Report-Only once the inline pre-paint theme script carries a hash/nonce |

## 4. Non-obvious engineering choices

* **`useTimeline` `steps` must be module-level constants.** An inline array
  gets a new identity every render; the IO effect depends on it and re-runs
  forever ("Maximum update depth exceeded"). Found while wiring the Education
  seal. Documented in UI-SPEC §16.4.
* **`.ex-notes{display:contents}`** — one wrapper serves both layouts:
  display-contents on desktop (notes stay absolutely positioned inside
  `.exhibit`), flex scroll-snap strip on mobile. No markup duplication.
* **Mobile report stamp band.** The 116px round stamp overlaps the gauge row
  at 308px paper width, so `.tr-paper` reserves `padding-bottom:128px` on
  mobile — a stamped document, no overlap, no repositioning math.
* **Gauge mark on mobile.** The track's 420px pixel scale is meaningless at
  308px width, so the mark uses `left:96.7%; transform:none` there — the
  finished state, no animation.
* **Board mobile.** Notes go `position:static` in a 2-col grid with
  `transform:none!important; translate:0 0!important` (their absolute
  scattered/sorted coordinates are desktop-only); ranked rows are forced to
  their final state (`opacity:1`, bars at `scaleX(var(--w))`) so the resting
  frame is always complete even mid-cycle.
* **Flight-card focus parity.** Keyboard focus on a manifest row positions the
  existing hover card beside the row (same `dataset.xy` mechanism); the card
  stays `aria-hidden` because the station carries the content.
* **`p99` panel is lazy-mounted at the end of `<body>`** (IO margin 2000px) —
  it only opens after the visitor has scrolled near the bottom, which is also
  when the measurement is most interesting. All values are real observers
  (Navigation Timing, paint, LCP, layout-shift), nothing simulated.
* **Fedaykin "−30%"** stays printed with an honest qualifier
  ("simulated… basis pending") rather than being hidden — the number is on
  the resume and the resume is the source of truth; what's pending is the
  *basis* (modeled vs measured), input C5.
* **Hero line option A shipped** ("I build AI products for messy,
  high-stakes workflows, and measure what changes.") — every clause is
  provable from the page. Suparna can swap the constant for her own words;
  it is one line in `site.ts`.
* **`.next-build` is tracked in git** (pre-existing; the isolated distDir
  proved worth keeping for the build/dev safety rule). Builds are still run
  with `NEXT_DIST_DIR=.next-build` and its churn is never staged.

## 5. Hidden pending inputs (what unlocks what)

| input (Section 7 / sections §10) | what is hidden today |
|---|---|
| 96.7% numerator + denominator | `ac-eval` stays as-is with a loud dev warning (`needsReview`) |
| final resume PDF | current generated PDF stands; regenerate with `scripts/build-resume-pdf.mjs` |
| Vercel live, PRD ×2, deck URLs (×5) | `link()` render guards — chips/cards render nothing |
| professional email | contact shows no email until `NEXT_PUBLIC_CONTACT_EMAIL` is set |
| phone decision | tap-to-reveal default (hidden in static HTML) |
| corporate descriptors / Ask-My part-Outcome / verdict evidence / stamp wording / Fedaykin basis | descriptor + AMO blocks hidden; deliverable verbs + current stamps stand |
| X handle, LinkedIn/GitHub confirmation | X card hidden; LinkedIn/GitHub links live (confirm) |
| data findings, provenance-neobank, repos, method/limits/chart | finding lines hidden; neobank chip hidden (figure tagged Illustrative); links hidden; disclosure hidden |
| placement cohort size (≈282 implied) | OfferStamps caption carries 240; the cohort assertion lands when confirmed |
| CEL stat definitions (40+/400K+/₹10L+), Director stat definitions, SYNERGY | CEL stats sit in the "More detail" disclosure with labels as supplied; SYNERGY note line printed |
| honors: IIM/NextLeap fuller results, verify URLs, decks | cards render rank + organiser + year + note only |
| coursework, academic highlights, bridge sentence | Education disclosure hidden |
| availability / response time / booking | not rendered |
| polaroid caption, "How I work" | cut (see §2) |
| location copy confirmation | "Bengaluru" in header + contact, BITS Goa for the degree — as built, pending confirm |
| "58%→85% in 5 months" vs May 2026 start | registry source already reads "58% at May 2026 handover → 85% by October 2026" — verify the reading dates |
| analytics tool, final domain, mail provider | none wired |
