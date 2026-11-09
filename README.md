# Suparna Deshmukh · Portfolio

A PM's physical bench: paper, stamps, ledgers and a route manifest.
One scrolling page — two case studies (AskCart, research agent), corporate
project files, data ledgers, experience, about, contact.

## Stack

Next.js (App Router) + TypeScript + hand-rolled CSS. No UI kit, no animation
libraries — motion is hand-rolled and gated behind `html.motion-ok`
(see `UI-SPEC.md`). Fonts are self-hosted (`next/font/local`) except DM Mono.
Contact form is a hardened API route (`app/api/contact`) using Resend when
`RESEND_API_KEY` is set; in dev, submissions are written to
`.contact-outbox.jsonl` instead.

## System design

- **Rendering**: Next.js 15 (App Router, TypeScript). Every page except the contact
  route is fully static — the site deploys as static assets + one serverless function.
- **Layout**: one scrolling "bench" page (`app/page.tsx`) — case studies
  (AskCart, research agent), corporate project files, data ledgers, experience,
  about, contact — plus a resume page (`app/resume`) with a copy-lint in CI.
- **Styling**: hand-rolled CSS (no UI kit, no animation libraries); all motion is
  hand-rolled and gated behind `html.motion-ok` (see `UI-SPEC.md`); fonts
  self-hosted via `next/font/local` except DM Mono.
- **Contact**: the contact form posts to the hardened `app/api/contact` route,
  which delivers through the owner-provided Resend API (credentials in
  `RESEND_API_KEY`; public address in `NEXT_PUBLIC_CONTACT_EMAIL`). The route
  validates + rate-limits submissions server-side; in dev, submissions land in
  `.contact-outbox.jsonl` instead of being sent.
- **Data guard**: the site renders no personal email until `NEXT_PUBLIC_CONTACT_EMAIL`
  is set; all personal details are owned by the site config (`app/lib/site.ts`).
- **Build discipline**: `npm run build` outputs to an isolated `.next-build`
  directory (the dev server keeps its own `.next`); `npm run check` = tsc + lint
  + resume copy lint, all green in CI.

## Run it

```bash
npm install
npm run dev        # dev server (the daemon uses port 3210)
npm run check      # tsc --noEmit + next lint + resume copy lint
npm run build      # production build into .next-build (isolated, see below)
npm run start      # serves the .next-build output
```

Environment (see `.env.example`):
- `NEXT_PUBLIC_SITE_URL` — canonical origin (set when a domain exists).
- `NEXT_PUBLIC_CONTACT_EMAIL` — the public contact address. Until it is set,
  the site deliberately shows no email (data guard, brief P0-4).
- `RESEND_API_KEY` — contact form delivery (dev fallback: local outbox file).

## Dev loop

```bash
python3 dev-daemon.py        # restarts `next dev` on port 3210 if it dies
npx tsc --noEmit             # after every change
node scripts/shot-matrix.mjs http://localhost:3210/ out/ 1440x900light:home 390x844dark:home
```

Screenshots need a fresh Chrome profile per run (stale profiles serve old
chunks). `scripts/check-resume.mjs` enforces the resume copy rules;
`scripts/build-resume-pdf.mjs` regenerates `public/Suparna-Deshmukh-Resume.pdf`
from the same data as `/resume` — rerun it whenever `app/lib/resume.ts`
changes. Data assertions (dead links, metric arithmetic) run at compile time
in dev: the dev server throws if they fail.

## House rules

1. **Never push.** No remote exists; local commits only, one commit per task,
   message format `P1-3: what changed`.
2. **Never run `npm run build` while the dev daemon runs** — builds write to
   `.next-build` (via `NEXT_DIST_DIR`) so this is now structurally safe, but
   keep the convention.
3. **Code wins over docs.** Update `UI-SPEC.md` in the same commit as any
   behavior change.
4. **No fabrication.** Anything pending input from Suparna ships hidden behind
   an empty-data guard. Placeholder text on the live page is a defect.
5. **Preserve the identity.** Stationery and stamp language, Fraunces /
   Satoshi / DM Mono, pine green accent, night-desk contact band, section
   order, `html.motion-ok` gating. No animation libraries, scroll hijackers,
   UI kits, custom cursors or audio.
6. **Every animation** needs a finished static first frame, a reduced-motion
   fallback, and off-screen pause, and may only animate `transform`/`opacity`
   (plus registered custom properties).

## Layout

- `app/` — routes; `app/components/` — all UI; `app/lib/` — data and guards
  (`site.ts`, `content.ts`, `metrics.ts`, `resume.ts`, `hooks.ts`).
- `UI-SPEC.md` — the end-to-end spec (read first).
- `LICENSES.md` — font licenses (all OFL 1.1).
- `docs/baseline.md` — baseline metrics captured before the upgrade work.
