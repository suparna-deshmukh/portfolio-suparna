// Screenshot matrix runner over CDP. Reusable for QA (P3-7).
// Usage: node scripts/shot-matrix.mjs <url> <outDir> [viewportSpecs...]
//   viewportSpec: WxHxtheme:shotName  e.g. 1440x900light:home, 390x844dark:home
import { mkdirSync, writeFileSync } from 'node:fs'

const [,, url, outDir, ...specs] = process.argv
mkdirSync(outDir, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
import { spawn } from 'node:child_process'
const prof = `/tmp/cdp-matrix-${Date.now()}`
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=9237`, `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 4000))

const list = await (await fetch('http://127.0.0.1:9237/json/new?' + url, { method: 'PUT' })).json()
const ws = new WebSocket(list.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
const send = (method, params = {}) => new Promise(res => { const myId = ++id; pending.set(myId, res); ws.send(JSON.stringify({ id: myId, method, params })) })
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id) } }
await new Promise(r => ws.onopen = r)
await send('Page.enable')

for (const spec of specs) {
  const [vp, name] = spec.split(':')
  const [w, h, theme] = vp.match(/^(\d+)x(\d+)(light|dark)$/).slice(1)
  await send('Runtime.evaluate', { expression: `localStorage.setItem('theme','${theme}')`, awaitPromise: true })
  await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: +w < 600 })
  await send('Page.navigate', { url })
  await new Promise(r => setTimeout(r, 6000))
  let shot = null, ok = false
  for (let i = 0; i < 3 && !ok; i++) {
    shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    if (shot?.data) ok = true
    else await new Promise(r => setTimeout(r, 1500))
  }
  if (!ok) { console.log('FAILED', spec); continue }
  writeFileSync(`${outDir}/${w}x${h}-${theme}-${name}.png`, Buffer.from(shot.data, 'base64'))
  console.log('shot', `${w}x${h}-${theme}-${name}`)
}
ws.close()
chrome.kill()
