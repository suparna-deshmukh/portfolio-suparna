// Bundle report: gzipped JS per route (from static HTML references) + total CSS + fonts.
// Usage: node scripts/bundle-report.mjs [distDir]
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const dist = process.argv[2] ?? '.next-build'
const kb = b => (b / 1024).toFixed(1)

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else yield p
  }
}

const staticChunks = join(dist, 'static/chunks')
const chunkGz = {}
for (const f of walk(staticChunks)) {
  if (f.endsWith('.js')) chunkGz[f.split('/').pop()] = gzipSync(readFileSync(f)).length
}

// map route html files
const appServer = join(dist, 'server/app')
const routes = new Map()
for (const f of walk(appServer)) {
  if (!f.endsWith('.html')) continue
  const html = readFileSync(f, 'utf8')
  const chunks = [...html.matchAll(/\/_next\/static\/chunks\/([^"']+\.js)/g)].map(m => m[1].split('/').pop())
  const css = [...html.matchAll(/\/_next\/static\/css\/([^"']+\.css)/g)].map(m => m[1].split('/').pop())
  const total = [...new Set(chunks)].reduce((s, c) => s + (chunkGz[c] ?? 0), 0)
  const rel = f.slice(appServer.length + 1, -5).replace(/\/page$/, '')
  routes.set(rel === '/' ? '/' : rel, { total, css: [...new Set(css)] })
}

let cssBytes = 0
const cssDir = join(dist, 'static/css')
if (existsSync(cssDir)) for (const f of walk(cssDir)) if (f.endsWith('.css')) cssBytes += gzipSync(readFileSync(f)).length

let fontBytes = 0
const fontDir = join(dist, 'media')
if (existsSync(fontDir)) for (const f of walk(fontDir)) {
  if (/\.(woff2?|ttf)$/.test(f)) fontBytes += statSync(f).size
}

console.log('route JS (gzip):')
for (const [r, v] of [...routes].sort()) console.log(`  ${r.padEnd(28)} ${kb(v.total)} KB`)
console.log(`  css total (gzip): ${kb(cssBytes)} KB`)
console.log(`  fonts (raw): ${kb(fontBytes)} KB`)
const all = Object.values(chunkGz).reduce((a, b) => a + b, 0)
console.log(`  all client chunks (gzip): ${kb(all)} KB`)
const big = Object.entries(chunkGz).filter(([, s]) => s > 25 * 1024).map(([n, s]) => `    ${n} ${kb(s)} KB`)
console.log(big.length ? `chunks > 25KB gz:\n${big.join('\n')}` : '  no chunk above 25KB gz')
