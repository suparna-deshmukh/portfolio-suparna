#!/usr/bin/env node
// Generates public/Suparna-Deshmukh-Resume.pdf by printing /resume with headless Chrome.
// Needs a running server (dev daemon on 3210 by default) and macOS Chrome.
// Usage: node scripts/build-resume-pdf.mjs [serverUrl]

import { spawn } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import { dirname } from 'node:path'

const url = (process.argv[2] ?? 'http://localhost:3210').replace(/\/$/, '')
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const out = new URL('../public/Suparna-Deshmukh-Resume.pdf', import.meta.url)
mkdirSync(dirname(out.pathname), { recursive: true })

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  `--user-data-dir=/tmp/resume-pdf-${Date.now()}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--no-pdf-header-footer',
  '--virtual-time-budget=8000',
  `--print-to-pdf=${out.pathname}`,
  `${url}/resume`,
], { stdio: 'inherit' })

chrome.on('close', code => {
  if (code !== 0 || !statSync(out.pathname).size) {
    console.error(`PDF build failed (chrome exit ${code}). Is the server up at ${url}?`)
    process.exit(1)
  }
  console.log(`Wrote ${out.pathname} (${Math.round(statSync(out.pathname).size / 1024)} KB)`)
})
