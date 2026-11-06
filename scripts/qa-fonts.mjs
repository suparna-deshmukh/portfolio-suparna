#!/usr/bin/env node
/**
 * qa-fonts — effective text-size floor audit (P1-4).
 *
 * Walks every text node in the rendered DOM (including SVG <text>) at each matrix
 * viewport and computes the *effective* size the reader sees:
 *   effective = computed font-size × cumulative CSS transform scale of the element
 *   and, for SVG text, × (svg clientWidth / viewBox width).
 *
 * Rules:
 *   - hard fail: effective < FLOOR (11px) at any "hard" viewport
 *   - warn:      11px <= effective < INFO (12px) — informational text should be >= 12px
 *   - skipped:   [aria-hidden] subtrees, display:none / visibility:hidden, opacity 0,
 *                zero-size boxes
 *
 * Usage:
 *   node scripts/qa-fonts.mjs [--hard 1440,1280] [--routes /,/resume] [host]
 *
 * host defaults to http://localhost:3211 (prod). Motion is forced off so every
 * animated figure sits in its finished first frame.
 */
import { spawn } from 'node:child_process'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const FLOOR = 11
const INFO = 12
const WIDTHS = (process.env.QA_W ? process.env.QA_W.split(',').map(Number) : [1440, 1280, 1024, 768, 640, 430, 390, 360, 320])

const args = process.argv.slice(2)
let host = 'http://localhost:3211'
let hard = '1440,1280'
let routes = ['/']
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--hard') hard = args[++i]
  else if (a === '--routes') routes = args[++i].split(',')
  else if (a.startsWith('http')) host = a
  else routes.push(a)
}
const hardSet = new Set(hard.split(',').map(s => Number(s.trim())))
const heights = { 1440: 900, 1280: 800, 1024: 768, 768: 1024, 640: 900, 430: 932, 390: 844, 360: 740, 320: 568 }

const prof = `/tmp/cdp-qa-fonts-${Date.now()}`
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9248', `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 4000))
const list = await (await fetch('http://127.0.0.1:9248/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(list.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
const send = (method, params = {}) => new Promise(res => { const myId = ++id; pending.set(myId, res); ws.send(JSON.stringify({ id: myId, method, params })) })
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } }
await new Promise(r => ws.onopen = r)
await send('Page.enable')
await send('Runtime.enable')
const sleep = ms => new Promise(r => setTimeout(r, ms))
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result?.result?.value

const MEASURE = `(() => {
  const FLOOR = ${FLOOR}, INFO = ${INFO}
  const out = []
  let scanned = 0
  const scaleOf = (el) => {
    let s = 1, n = el
    while (n && n.nodeType === 1) {
      const t = getComputedStyle(n).transform
      if (t && t !== 'none') {
        const m = t.match(/matrix\\(([^)]+)\\)/)
        if (m) { const p = m[1].split(',').map(parseFloat); s *= Math.hypot(p[0], p[2]) }
      }
      n = n.parentElement
    }
    return s
  }
  const walk = (node) => {
    const el = node.parentElement
    if (!el) return
    if (el.closest('[aria-hidden="true"]')) return
    const st = getComputedStyle(el)
    if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') return
    const r = el.getBoundingClientRect()
    if (r.width < 0.5 || r.height < 0.5) return
    let fs = parseFloat(st.fontSize), extra = scaleOf(el)
    if (el.tagName === 'text') {
      const svg = el.ownerSVGElement
      const vb = svg && svg.viewBox && svg.viewBox.baseVal
      if (vb && vb.width && svg.clientWidth) extra *= svg.clientWidth / vb.width
    }
    const eff = fs * extra
    if (eff < FLOOR) { out.push({t: node.textContent.trim().slice(0,42), tag: el.tagName.toLowerCase(), cls: String(typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '').slice(0,48), fs: +fs.toFixed(1), x: +extra.toFixed(3), eff: +eff.toFixed(2), ALL: 1}) } else if (eff < INFO) {
      const cls = String(typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '').slice(0, 48)
      out.push({ t: node.textContent.trim().slice(0, 42), tag: el.tagName.toLowerCase(), cls, fs: +fs.toFixed(1), x: +extra.toFixed(3), eff: +eff.toFixed(2) })
    }
  }
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  while ((n = tw.nextNode())) if (n.nodeValue.trim()) { scanned++; walk(n) }
  return { scanned, items: out }
})()`

const scrollTo = async () => {
  const total = await ev(`document.body.scrollHeight`) || 0
  const step = 600
  for (let y = 0; y <= total; y += step) {
    await ev(`window.scrollTo(0, ${y})`)
    await sleep(110)
  }
  // lazy-mounted figures (IO-gated) need a moment to render; poll for them
  for (let i = 0; i < 20; i++) {
    const n = Number(await ev(`document.querySelectorAll('.tr-row, .fb-note, .cfdoc').length`)) || 0
    if (n >= 4) break
    await ev(`document.getElementById('projects')?.scrollIntoView({block:'center'})`)
    await sleep(400)
  }
  await ev(`window.scrollTo(0, 0)`)
  await sleep(700)
}

let hardFails = 0
const report = []
for (const route of routes) {
  for (const w of WIDTHS) {
    await ev(`localStorage.setItem('theme','light'); localStorage.setItem('motion','off')`)
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: heights[w], deviceScaleFactor: 1, mobile: w < 640 })
    await send('Page.navigate', { url: `${host}${route}` })
    await sleep(3200)
    await ev(`document.fonts.ready.then(1)`)
    await scrollTo()
    const res = (await ev(MEASURE)) || { scanned: 0, items: [] }
    const items = res.items || []
    const hard = items.filter(i => i.eff < FLOOR)
    const warn = items.filter(i => i.eff >= FLOOR && i.eff < INFO)
    if (hardSet.has(w)) hardFails += hard.length
    report.push({ route, w, scanned: res.scanned, hard: hard.length, warn: warn.length, worst: [...items].sort((a, b) => a.eff - b.eff).slice(0, 6) })
  }
}
ws.close(); chrome.kill()

console.log('\nqa:fonts — effective text size audit (floor 11px, informational 12px)')
console.log('hard viewports:', [...hardSet].join(', '))
for (const r of report) {
  const mark = hardSet.has(r.w) && r.hard ? 'FAIL' : (r.hard ? 'WARN' : (r.warn ? 'warn' : 'ok  '))
  console.log(`\n${mark}  ${r.route} @ ${r.w}px — scanned:${r.scanned} hard:${r.hard} warn:${r.warn}`)
  for (const v of r.worst) console.log(`   ${v.eff.toFixed(2)}px  <${v.tag}> "${v.t}"  [${v.cls}]`)
}
console.log(`\n${hardFails ? `FAIL: ${hardFails} text node(s) below ${FLOOR}px at hard viewports` : 'PASS: no text below the 11px floor at hard viewports'}`)
process.exit(hardFails ? 1 : 0)
