#!/usr/bin/env node
// Resume house-style lint (P0-1 / P2-4): loads app/lib/resume.ts in development mode,
// which runs assertResume() at module load — banned symbols (+, =, —, &), the 125-char
// line limit (a bullet may wrap once, i.e. <= 250 chars), and balanced **bold** markers.
// Exits non-zero on any violation.
// Usage: node scripts/check-resume.mjs

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
process.env.NODE_ENV = 'development'
const { createJiti } = require('jiti')

const file = new URL('../app/lib/resume.ts', import.meta.url).pathname
const jiti = createJiti(file)
const { RESUME } = jiti(file)

const bullets = [
  ...RESUME.experience.flatMap(e => e.bullets),
  ...RESUME.projects.flatMap(e => e.bullets),
  ...RESUME.corporate.flatMap(e => e.bullets),
  ...RESUME.positions.flatMap(e => e.bullets),
  ...RESUME.achievements,
]
const chars = bullets.join(' ').replace(/\*\*/g, '').length
console.log(`resume house style OK — ${bullets.length} bullets, ${chars} chars (~${Math.ceil(chars / 125)} printed lines at 125 chars/line)`)
