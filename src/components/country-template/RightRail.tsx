'use client'
import Link from 'next/link'
import { toggleAcc, toggleStep } from './client/behaviours'

export type RailMatch = { score: number; rank: number; total: number; reasons: string[] }

// Ring circumference for r=36 (2πr), used to draw the arc from a real score.
const RING_CIRCUMFERENCE = 226.2

function matchLabel(score: number): string {
  if (score >= 85) return 'Excellent match'
  if (score >= 70) return 'Strong match'
  if (score >= 55) return 'Good match'
  return 'Fair match'
}

/** Real Match Score card — driven entirely by the user's profile ranking. */
function MatchCard({ match }: { match: RailMatch }) {
  const offset = Math.max(0, Math.min(RING_CIRCUMFERENCE, RING_CIRCUMFERENCE * (1 - match.score / 100)))
  return (
    <div className="card-surface">
      <div className="match">
        <div className="match-top">
          <div className="ring">
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r="36" fill="none" stroke="#f4f6f9" strokeWidth="9" />
              <circle cx="42" cy="42" r="36" fill="none" stroke="#f3c516" strokeWidth="9" strokeLinecap="round" strokeDasharray={String(RING_CIRCUMFERENCE)} strokeDashoffset={String(offset)} />
            </svg>
            <div className="ring-n"><div><div className="v">{match.score}%</div><div className="l">match</div></div></div>
          </div>
          <div>
            <div className="match-h">Match Score</div>
            <div className="match-t">{matchLabel(match.score)}</div>
            <div className="match-s">Ranked #{match.rank} of your {match.total} countries</div>
          </div>
        </div>
        {match.reasons.length > 0 && (
          <ul className="mt-3 space-y-2 border-t border-line pt-3 text-sm leading-6 text-navy/80">
            {match.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="15" height="15" className="mt-1 shrink-0 text-gold-deep"><path d="M20 6L9 17l-5-5" /></svg>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="match-cta">
        <Link className="gold-button btn-full" href="/my-plan">Build My Kolmari Plan <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
        <Link className="btn btn-full" href="/destinations">Compare destinations</Link>
      </div>
    </div>
  )
}

/** Honest "no score yet" card when the profile is incomplete or the country isn't scored. */
function NoMatchCard({ name }: { name: string }) {
  return (
    <div className="card-surface" style={{ padding: 20 }}>
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Match Score</p>
      <p className="mt-2 text-sm leading-6 text-muted">
        Your personalized Match Score for {name} unlocks once your Profile is complete and this destination
        is scored against it. We never show an estimated score.
      </p>
      <Link href="/profile-wizard" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-btn)] bg-navy px-5 text-sm font-bold text-white transition hover:bg-navy-deep">
        Complete your Profile
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </Link>
    </div>
  )
}

/* The right rail. The Match Score card is now driven by the user's real profile
   ranking for any country (or an honest empty state when unscored). Portugal
   (`rich`) additionally renders its verified first-actions and risk notes. */
export function RightRail({ rich = false, country, match = null }: { rich?: boolean; country?: { name: string; city: string }; match?: RailMatch | null }) {
  const name = country?.name ?? 'this country'
  const city = country?.city

  return (
    <aside className="rightcol">
      {match ? <MatchCard match={match} /> : <NoMatchCard name={name} />}

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
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Appointment backlogs</b> are the top cause of blown timelines. Everything else waits on this.</span></li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Income thresholds move.</b> They track minimum wage and reset annually.</span></li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Rental market is tight.</b> Landlords often want a Portuguese guarantor or a year up front.</span></li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Tax regimes change.</b> Do not build the move around a benefit that may not exist when you land.</span></li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="card-surface" style={{ padding: 20 }}>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Start your research</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-muted">
            <li>Confirm which residence pathways currently apply to you with the official authority.</li>
            <li>Compare cities and neighborhoods{city ? `, starting with ${city}` : ''}.</li>
            <li>Build a real budget in the Cost Calculator from current listings.</li>
            <li>Save {name} to your shortlist when you want to compare or plan around it.</li>
          </ul>
          <Link href="/my-plan" className="gold-button btn-full" style={{ marginTop: 16 }}>
            Build My Kolmari Plan
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      )}
    </aside>
  )
}
