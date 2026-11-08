// Content-freeze test for the hero card (docs/hero-revamp-notes.md).
// Compares the live hero card's text content and hrefs against the captured
// before-revamp fixture (docs/hero-revamp/content-before.json) and fails on any difference.
//
// Usage: node scripts/check-hero-content.mjs [url]   (default http://localhost:3210)
// Requires the dev server to be running. Playwright resolves from the repo if present,
// otherwise from the onco-login workspace (where Playwright is installed locally).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const url = process.argv[2] || 'http://localhost:3210'
const here = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.join(here, '..', 'docs', 'hero-revamp', 'content-before.json')

let chromium
try { ({ chromium } = await import('playwright')) }
catch { ({ chromium } = await import('/Users/apple/onco-analysis/onco-login/node_modules/playwright/index.mjs')) }

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)
const live = await page.evaluate(() => {
  const tb = document.querySelector('.tb')
  if (!tb) throw new Error('.tb hero card not found')
  const norm = s => (s || '').replace(/\s+/g, ' ').trim()
  return {
    text: norm(tb.textContent),
    name: norm(tb.querySelector('h1')?.textContent),
    line: norm(tb.querySelector('.tb-line')?.textContent),
    rows: Array.from(tb.querySelectorAll('.tb-row')).map(r => ({
      dt: norm(r.querySelector('dt')?.textContent),
      val: norm(r.querySelector('.tb-val')?.textContent),
      det: norm(r.querySelector('.tb-det')?.textContent),
    })),
    seal: norm(tb.querySelector('.tb-seal')?.textContent),
    hrefs: Array.from(tb.querySelectorAll('a[href]')).map(a => ({ text: norm(a.textContent), href: a.getAttribute('href') })),
  }
})
await browser.close()

const before = JSON.parse(readFileSync(fixturePath, 'utf8'))
const fail = []
const j = x => JSON.stringify(x)
const cmp = (label, a, b) => { if (j(a) !== j(b)) fail.push(`${label}:\n  before: ${j(a)}\n  after:  ${j(b)}`) }
cmp('name', before.name, live.name)
cmp('line', before.line, live.line)
cmp('rows', before.rows, live.rows)
cmp('seal', before.seal, live.seal)
cmp('hrefs', before.hrefs, live.hrefs)
const fragments = [before.name, before.line, before.seal, ...before.rows.flatMap(r => [r.dt, r.val, r.det]), ...before.hrefs.map(h => h.text)]
for (const frag of fragments) {
  if (frag && !live.text.includes(frag)) fail.push(`fragment missing from card text: "${frag}"`)
}
if (fail.length) {
  console.error('CONTENT FREEZE VIOLATION\n' + fail.join('\n'))
  process.exit(1)
}
console.log('hero content freeze OK — name, tagline, rows, seal text and hrefs identical to the before-revamp fixture')
