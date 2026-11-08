# POR card 03 (CEL) redesign + equal-height panels — notes

## Extra content used (all from existing repo content, nothing invented)

- Chip: "Ankur Warikoo & UTI on stage" — from the CEL `blurb` in `app/lib/site.ts`
  ("...40+ founders, investors and partners on stage — including Ankur Warikoo and UTI")
  and `app/lib/resume.ts` ("incl. Ankur Warikoo, UTI").
- This is the only extra fact that exists in the repo about Coalescence'24 that is not
  already on the card (the 20-member team and the 40+/400K+/₹10L+ figures are in the
  description and stats). Fewer than 3 available → one chip.

## Equal-height panels (Placement Coordinator ↔ 180DC)

- `#about .ab-panels` was `align-items:start` (each box its own height); now
  `align-items:stretch`. The two panels share one grid row at ≥1100px, so both boxes
  are exactly equal in height in every state. Measured:
  - 1280: 443/443 collapsed, 541/541 expanded
  - 1440: 380/380 collapsed, 478/478 expanded
- Below 1100px the panels stack (one per row), where equal height is not applicable.

## CEL strip: hard-constraint math

Current card height (measured): **120px at both 1280 and 1440** (before-*.png).
The spec's own left-zone typography (eyebrow + 20px title + two 15.5px description
lines) already measures 94px of content; the current 94px content budget leaves room
for exactly one more compact element, not a 28px highlight row. So:

1. **Chip placement** — the highlight chip sits under the stat columns in the right
   zone (not as its own row in the left zone). This is the only placement that keeps
   the card at 120px. Logged deviation from the spec's "highlights row in Zone A".
2. **Zone split** — 50/50 (spec said ~62/38). Measured label widths at 11px mono
   ("FOUNDERS, INVESTORS" 133.8px, "IMPRESSIONS" 77.5px, "EVENT REVENUE" 91.5px)
   plus the 34px "400K+" numeral force a right zone of ~420px at 1280; 38% would
   crush the left zone (description → 3 lines, eyebrow → ellipsis).
3. **Stat columns** — `1.9fr 1.4fr 0.92fr`, 8px padding, 1px ink-14% dividers,
   `align-items:start`; every label starts at the same y and the label block has a
   fixed 30.8px (2-line) min-height, so "FOUNDERS, INVESTORS / AND PARTNERS" no
   longer breaks the row.
4. **Numeral size** — 34px at ≥1440, 30px below (spec: 34px). At 1280 a 34px
   "400K+" leaves <1px of margin in its column; the numeral row reserves a fixed
   34px height in both cases, so the card height is identical at 1280 and 1440.
5. **Vertical padding 9px** (spec: 24px) — forced by the height constraint; with 24px
   padding the same content measures 154px.
6. **Eyebrow 11px / ls .08em** (spec: 11.5px / .14em) — at the spec size it measures
   357px and clips 5px inside the 352px zone (ellipsis). At 11px/.08em it is 314px,
   no clip.
7. **Green treatment** — digits green (`--accText`), suffix (+, K+, L+) ink at 55%,
   per "green for the first digit group or the symbol only (keep it subtle)".

## Motion

- Count-up: reuses `CountUp` (final value server-rendered, `ch`-reserved width → no
  flash, no CLS) with a new optional `ms` prop set to 600ms for the strip stats
  (component default stays 900ms/400ms everywhere else). Suffixes are outside the
  count, so "+", "K+", "L+" stay fixed.
- Hover (pointer devices only): border to green 40%, numerals shift 2px up (150ms),
  no layout change.
- Reduced motion / Motion Off: final values, no hover lift (global motion-off rules).

## Responsive

- 761–1024px: same two-zone layout; the left zone narrows, description takes 3 lines
  and the card is 156px (the old card was 160px at 768 — still shorter than before).
- ≤640px: stacked (eyebrow, title+dates, description, then stats under a dashed rule;
  the chip wraps under the stats). No horizontal scroll at 390 or 360 (docW = vw).
- ≤479px: 24px numerals and 10px labels so the nowrap "400K+" fits the 3-column row
  at 360. The first label can take 3 lines at 360 (32 characters cannot fit in two
  lines inside a third of 276px); blocks stay top-aligned.

## Verification

- `npm run check` clean; no console errors in any run.
- `docs/por-revamp/before-{390,768,1280,1440}.png` and `after-{360,390,768,1280,1440}.png`.
- Heights: strip 120px at 1280 and 1440 (was 120px); panels equal in collapsed and
  expanded states at both widths.
