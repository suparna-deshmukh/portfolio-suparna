# Hero revamp — assumptions and deviations

Per the brief: content frozen except user-authorized changes; these are logged here.

## Implementation assumptions

1. **Name size.** The spec's `clamp(60px, 8.5vw, 108px)` cannot fit "Deshmukh" (461px
   at 108px in Fraunces) inside the 5fr column (307–452px content at 1024–1440).
   Implemented `clamp(52px, 6.6vw, 108px)`; 108px is still reachable on very wide
   screens. Measured Fraunces widths: 108px → 461px, 95px → 405px.
2. **White text on green** uses the site's on-green token `var(--accInk)`.
3. **Grain, crop-marks, inner frame** are pure pseudo-elements plus one empty
   `<i class="tb-grain">` (inline `feTurbulence` data URI, ~4%, multiply).
4. **Baseline gradient on "Suparna":** `background-clip:text` was dropped — a headless
   Chromium raster artifact smears ~26px above the line. Replaced with a masked
   `::after` duplicate (`content:"Suparna"`, mask gradient).
5. **Seal overlap** with the card corner: 24px desktop, 16px ≤640.
6. **Underline draw** 300ms starting at 250ms (section 6 governs; section 3's
   "400ms after the tagline" is superseded).
7. **Card width +15% biased left** at ≥1024 (user, post-spec): the card runs 115% of
   its 5fr column, biased left so the name keeps breathing room from the left
   hairline and the page margin absorbs the overhang.
8. **Tilt** (≤1.5/2deg) and highlight attach via `requestIdleCallback` after the
   entrance; `hero-left.css` is part of the page's single CSS bundle (no new
   render-blocking asset).

## Post-revamp user changes (all verified)

9. **Seal "SD" → filled green dot** (same colour as the former SD), ring text
   shortened to `SUPARNA DESHMUKH · PRODUCT ·` ("CLASS OF 27" removed per user).
   Content fixture `seal` field updated; content-freeze test updated accordingly.
10. **Card widened, then shifted ~6% further left** (user): the shift is
    `margin-left: max(calc(100% * -.145), calc((100vw - 1440px) * -.5 - var(--pad) + 14px))`
    at ≥1440, and `margin-left: calc(var(--pad) * -1 + 14px)` at 1024–1439. The cap
    keeps the crop marks ≥2px inside the viewport edge when the page has no side
    margin to absorb the overhang (at 1440 the column only leaves 22px of left
    margin, so the full 6-point shift physically cannot fit there; it kicks in fully
    from ~1481px where the centered 1440px container provides the margin).
    A single `max(calc(), max(...))` nested form was dropped by the CSS minifier,
    hence the media-query split.
11. **Exhibit:** "Director, 180DC" header on the 180DC card; InvestmentMates card
    added under RISA at half height; IIMA case-comp note; $2.5M figure moved into
    the 180DC card; `05 · POR` and `06 · ACHIEVEMENTS` sections.
12. **POR order:** Placement Coordinator note above the 180DC card (desktop and
    mobile grid rows 4/5).
13. **Hover lift on the three notes** (`.ex-note--pc / --acc / --iima`): same −3px
    lift as the `.ex-ob` cards. To keep the checker's 16px minimum under hover +
    parallax + static rotation, +3px margins were added on `.ex-note--pc` (vs the
    05 label), `.ex-por` (vs the note) and `.ex-note--iima` (vs the Accenture note).
    Checker: min gap 16.3–17.0px at all widths/themes, square-dev 1.9%, no console
    output.
14. **Corporate projects points** animate with the exact same stagger as the data
    projects points (`.cf-points li`, 90ms + 45ms per item, triggered by the
    existing per-card `.in` reveal).
15. **180DC chip** text: "Best Consultant" → "Awarded Best Consultant as a sophomore"
    (user).
16. **Positions lines (About):** Placement Coordinator line now "Leading campus
    placements and corporate outreach for the 2026 batch, end-to-end, with a
    25-member team."; 180DC line now "Led 45 consultants across 16 projects, driving
    30% YoY revenue growth." (verbs per user, phrasing aligned to the resume).

## Verification

- `npm run check` (tsc + eslint + resume lint) clean.
- Content-freeze test (`scripts/check-hero-content.mjs`) passes.
- Exhibit checker (`pf-check.js`) at 1440/1280/1024/768/390/320, light + dark:
  no failures, no console warnings.
- Lighthouse mobile: performance 72 → 76, accessibility 97 → 97, TBT 550ms → 410ms,
  CLS 0.002 → 0.
