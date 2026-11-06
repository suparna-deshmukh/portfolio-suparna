'use client'

import { EXPERIENCE, GITHUB_USER, RESUME_URL, SOCIALS, link } from '../lib/site'
import type { ContributionDay } from './GitHubGraph'
import { useContributions } from './useContributions'

const MINI_WEEKS = 20
const DAYS_IN_WEEK = 7

const ICONS = {
  linkedin: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  github: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>,
  x: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
}

const NAME = 'Suparna Deshmukh'
const SHORT_NAME = 'Suparna D.' // fits the resume paper; LinkedIn keeps the full name
const X_NAME = 'Suparna' // X display name: confirm handle
const stripScheme = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const X_HANDLE = SOCIALS.x.split('/').filter(Boolean).pop() ?? ''
const CURRENT = EXPERIENCE[0]
const ROLE_LINE = `${CURRENT.roles[0].title} at ${CURRENT.name} · Placement Coordinator at BITS Goa · ${CURRENT.city}`

const linkProps = { target: '_blank', rel: 'noopener noreferrer' } as const

/** Last MINI_WEEKS weeks as 7-row columns (Sunday first), padded where a week is partial. */
function miniWeeks(weeks: ContributionDay[][]): (ContributionDay | null)[][] {
  return weeks.slice(-MINI_WEEKS).map(week =>
    Array.from({ length: DAYS_IN_WEEK }, (_, row) => week.find(d => new Date(d.date + 'T00:00:00').getDay() === row) ?? null),
  )
}

function GitHubCard() {
  const gh = useContributions()
  const cols = gh.status === 'ready' ? miniWeeks(gh.data.weeks) : null
  return (
    <a className="pc pc-gh" href={SOCIALS.github} {...linkProps}>
      <span className="pc-top">
        <span className="pc-ico">{ICONS.github}</span>
        <span className="pc-id"><b>GitHub</b><small>{GITHUB_USER}</small></span>
        <span className="pc-arr" aria-hidden="true">↗</span>
      </span>
      {gh.status !== 'failed' && (
        <span className={`pc-mini${cols ? ' on' : ''}`} aria-hidden="true">
          {cols
            ? cols.flatMap((col, c) => col.map((day, r) => <i key={`${c}-${r}`} data-l={day ? day.level : -1} style={{ ['--c' as string]: c }} />))
            : Array.from({ length: MINI_WEEKS * DAYS_IN_WEEK }, (_, k) => <i key={k} data-l={0} />)}
        </span>
      )}
      <span className="pc-act">
        {gh.status === 'ready'
          ? <><span className="num">{gh.data.total}</span> contributions in the last year</>
          : gh.status === 'failed' ? 'See my activity on GitHub' : 'Loading contributions…'}
      </span>
    </a>
  )
}

/** Profile cards that preview each destination with real data: LinkedIn (wide), X, GitHub and the resume envelope. */
export default function SocialCards() {
  return (
    <div className="pcs">
      <a className="pc pc-li" href={SOCIALS.linkedin} {...linkProps} aria-label={`Connect with ${NAME} on LinkedIn, opens in a new tab`}>
        <span className="pc-logo">{ICONS.linkedin}</span>
        <span className="pc-id">
          <b>{NAME}</b>
          <span className="pc-role">{ROLE_LINE}</span>
          <small>{stripScheme(SOCIALS.linkedin)}</small>
        </span>
        <span className="pc-cta">Connect <span className="pc-arr" aria-hidden="true">↗</span></span>
      </a>

      {SOCIALS.x && (
        <a className="pc pc-x" href={SOCIALS.x} {...linkProps} aria-label={`Follow @${X_HANDLE} on X, opens in a new tab`}>
          <span className="pc-top">
            <span className="pc-av" aria-hidden="true">{X_NAME[0]}</span>
            <span className="pc-id"><b>{X_NAME}</b><small>@{X_HANDLE}</small></span>
            <span className="pc-xlogo">{ICONS.x}</span>
          </span>
          <span className="pc-url">{stripScheme(SOCIALS.x)}</span>
          <span className="pc-follow">Follow on X</span>
        </a>
      )}

      <GitHubCard />

      {link(RESUME_URL) && (
      <a className="pc pc-cv" href={RESUME_URL} aria-label="Read my resume (PDF download)">
        <span className="cv-stage" aria-hidden="true">
          <span className="cv-back" />
          <span className="cv-paper">
            <b>{SHORT_NAME}</b>
            <i /><i /><i className="s" /><i /><i className="s" />
          </span>
          <span className="cv-front" />
        </span>
        <span className="pc-id"><b>Resume</b><small>PDF · one page</small></span>
        <span className="pc-act">Download my resume <span className="pc-arr" aria-hidden="true">↓</span></span>
      </a>
      )}
    </div>
  )
}
