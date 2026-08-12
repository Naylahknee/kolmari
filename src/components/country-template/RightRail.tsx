'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { toggleAcc, toggleStep } from './client/behaviours'

export type RailMatch = {
  score: number
  rank: number
  total: number
  reasons: string[]
  tradeoff?: string
  visaFit?: number | null
  budgetFit?: number | null
  safetyFit?: number | null
}

function matchLabel(score: number): string {
  if (score >= 85) return 'Excellent match'
  if (score >= 70) return 'Strong match'
  if (score >= 55) return 'Good match'
  return 'Fair match'
}

function FitBar({ label, value }: { label: string; value?: number | null }) {
  return (
    <div className="read-fit-row">
      <div><span>{label}</span><b>{value == null ? 'Researching' : `${value}%`}</b></div>
      <div className="read-fit-track"><i style={{ width: `${value ?? 0}%` }} /></div>
    </div>
  )
}

function OverviewReadCard({ match, name }: { match: RailMatch; name: string }) {
  const [open, setOpen] = useState(true)
  const verdict = match.reasons[0] ?? matchLabel(match.score)
  return (
    <section className="your-read-panel">
      <button type="button" className="your-read-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="your-read-icon">✓</span>
        <span className="your-read-title">
          <span>YOUR READ ON {name.toUpperCase()}</span>
          <b>{match.score}% <small>match · rank #{match.rank} of {match.total}</small></b>
        </span>
        <ChevronDown size={17} className={open ? 'rotate-180' : ''} />
      </button>
      <p className="your-read-verdict">{verdict}</p>
      {open && (
        <div className="your-read-body">
          <div className="read-blocker">
            <span>What is holding it back</span>
            <b>{match.tradeoff ?? 'No additional blocker has been identified from your current profile.'}</b>
            <p>{match.tradeoff ?? 'Complete more of your profile and planning inputs to sharpen this read.'}</p>
            <Link href="/command-center" className="read-action">Work on this next</Link>
          </div>
          <div className="read-fit-bars">
            <FitBar label="Visa fit" value={match.visaFit} />
            <FitBar label="Budget fit" value={match.budgetFit} />
            <FitBar label="Safety fit" value={match.safetyFit} />
          </div>
          <Link className="read-report-link" href={`/nextinations/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/v2/overview`}>Open full {name} report →</Link>
        </div>
      )}
    </section>
  )
}

function NoMatchCard({ name }: { name: string }) {
  return (
    <div className="card-surface" style={{ padding: 20 }}>
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Match Score</p>
      <p className="mt-2 text-sm leading-6 text-muted">Your personalized Match Score for {name} unlocks once your Profile is complete and this destination is scored against it. We never show an estimated score.</p>
      <Link href="/profile-wizard" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-btn)] bg-navy px-5 text-sm font-bold text-white transition hover:bg-navy-deep">Complete your Profile <span>→</span></Link>
    </div>
  )
}

function StandardMatchCard({ match }: { match: RailMatch }) {
  return (
    <div className="card-surface match-standard-card" style={{ padding: 20 }}>
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Match Score</p>
      <p className="mt-2 text-2xl font-extrabold text-navy">{match.score}%</p>
      <p className="text-sm font-bold text-navy">{matchLabel(match.score)}</p>
      <p className="mt-1 text-xs text-muted">Ranked #{match.rank} of your {match.total} countries</p>
    </div>
  )
}

export function RightRail({ rich = false, country, match = null, overviewMode = false }: { rich?: boolean; country?: { name: string; city: string }; match?: RailMatch | null; overviewMode?: boolean }) {
  const name = country?.name ?? 'this country'
  const city = country?.city

  return (
    <aside className="rightcol">
      {match ? (overviewMode ? <OverviewReadCard match={match} name={name} /> : <StandardMatchCard match={match} />) : <NoMatchCard name={name} />}

      {rich ? (
        <>
          <div className="card-surface">
            <button className="acc-head" aria-expanded="true" onClick={(e) => toggleAcc(e.currentTarget)}>
              <span className="ttl"><span className="k">Start here</span><span className="n2">Recommended first actions</span></span>
              <span className="acc-count">0 / 6</span>
              <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="acc-body">
              <button className="step" onClick={(e) => toggleStep(e.currentTarget)}><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Confirm your visa eligibility</span><span className="st-d">Check your income against the D8 threshold with current numbers</span><span className="st-tag">15 min</span></span></button>
              <button className="step" onClick={(e) => toggleStep(e.currentTarget)}><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Get a Portuguese NIF</span><span className="st-d">Tax number, required before banking or renting. Can be done remotely.</span><span className="st-tag">1 to 2 weeks</span></span></button>
              <button className="step" onClick={(e) => toggleStep(e.currentTarget)}><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Open a Portuguese bank account</span><span className="st-d">Millennium BCP or Santander, or bridge with Revolut first</span><span className="st-tag">Needs NIF</span></span></button>
              <button className="step" onClick={(e) => toggleStep(e.currentTarget)}><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Book your consulate appointment</span><span className="st-d">This is the bottleneck. Book before your documents are ready.</span><span className="st-tag">Do this early</span></span></button>
              <button className="step" onClick={(e) => toggleStep(e.currentTarget)}><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Gather and apostille documents</span><span className="st-d">Background check, birth and marriage certificates, translations</span><span className="st-tag">6 to 10 weeks</span></span></button>
              <button className="step" onClick={(e) => toggleStep(e.currentTarget)}><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Scout neighborhoods</span><span className="st-d">Belém, Príncipe Real, or Mouraria if Lisbon. Porto if budget matters more.</span><span className="st-tag">Ongoing</span></span></button>
            </div>
          </div>

          <div className="card-surface">
            <button className="acc-head" aria-expanded="false" onClick={(e) => toggleAcc(e.currentTarget)}>
              <span className="ttl"><span className="k">Before you commit</span><span className="n2">What could go wrong</span></span>
              <span className="acc-count">4</span>
              <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="acc-body" hidden>
              <ul className="watch">
                <li><span><b>Appointment backlogs</b> are the top cause of blown timelines. Everything else waits on this.</span></li>
                <li><span><b>Income thresholds move.</b> They track minimum wage and reset annually.</span></li>
                <li><span><b>Rental market is tight.</b> Landlords often want a Portuguese guarantor or a year up front.</span></li>
                <li><span><b>Tax regimes change.</b> Do not build the move around a benefit that may not exist when you land.</span></li>
              </ul>
            </div>
          </div>
        </>
      ) : !overviewMode ? (
        <div className="card-surface" style={{ padding: 20 }}>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Start your research</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-muted">
            <li>Confirm which residence pathways currently apply to you with the official authority.</li>
            <li>Compare cities and neighborhoods{city ? `, starting with ${city}` : ''}.</li>
            <li>Build a real budget in the Cost Calculator from current listings.</li>
            <li>Save {name} to your shortlist when you want to compare or plan around it.</li>
          </ul>
          <Link href="/command-center" className="gold-button btn-full" style={{ marginTop: 16 }}>Build My Kolmari Plan →</Link>
        </div>
      ) : null}
    </aside>
  )
}
