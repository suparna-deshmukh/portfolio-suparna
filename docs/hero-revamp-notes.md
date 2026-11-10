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
17. **First-screen fit revamp (user: right side underused to the margins, both
    elements too small, desk should match the card's height, browser zoom drifted
    the layout on x).** Root causes: (a) card and desk shared one scale factor and
    the desk's fr column + card zoom fed each other through a ResizeObserver,
    oscillating during browser zoom; (b) 108/104px hero padding wasted first-screen
    budget; (c) the desk centered in its column, floating short of the right margin.
    Fix: `.hd-in` padding 84/64; at >=1025 Hero.tsx pins the 5/8 columns to exact px
    (kills the fr feedback loop) and sizes the card (zoom) and desk (scale)
    independently against innerHeight minus 148px. The card's local width is its
    column divided by its zoom, so its height depends on the zoom shipped — the fit
    bisects the largest zoom whose measured (at that zoom) on-screen height fits,
    floored to 0.01 so the section never overflows the viewport. The desk scales to
    exactly the card's height whenever the column width allows, otherwise fills the
    column (width-fit) and always hugs the right content edge (auto left margin on
    `.ex-wrap`, sized to the scaled desk box). No ResizeObserver; resize is
    rAF-debounced and the fit is deterministic, so browser zoom lands on identical
    values. <=1024 stacked behavior unchanged.
    Assumption: when the viewport is wide/short (width-fit: 1512x982, 1920x1080,
    1025x768) the desk is shorter than the card rather than the card being shrunk to
    match — the margins win over the height match, per "stick to the left and right
    margins properly".

## Verification

- `npm run check` (tsc + eslint + resume lint) clean.
- Content-freeze test (`scripts/check-hero-content.mjs`) passes.
- Exhibit checker (`pf-check.js`) at 1440/1280/1024/768/390/320, light + dark:
  no failures, no console warnings.
- Lighthouse mobile: performance 72 → 76, accessibility 97 → 97, TBT 550ms → 410ms,
  CLS 0.002 → 0.
- Fit/margin/zoom-stability check (`sd-fitscreen.js`): at 1512x982, 1440x900,
  1366x768, 1280x800, 1025x768, 1920x1080 the section never exceeds the viewport,
  card flush at the left content edge, desk flush at the right, desk height within
  0.5px of the card's at 1440/1366/1280, no horizontal scroll, no console errors.
  Zoom round-trip 1512x982 -> 1209x786 (~125% browser zoom) -> back lands on
  identical x/width/height/heroS values.
- Lighthouse mobile (dev :3210): performance 75 (vs 76 baseline, within run noise;
  one cold run measured 35/7130ms TBT and repeated immediately at 75/300ms),
  accessibility 97 (unchanged), TBT 300ms (vs 410ms baseline).
- Screenshots: `fitscreen-1512.png`, `fitscreen-1440.png` (both sections fully
  visible at their own size, margins respected).
