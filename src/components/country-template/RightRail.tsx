'use client'
import Link from 'next/link'
import { toggleAcc, toggleStep } from './client/behaviours'

/* Converted from the approved index.html mockup. Markup verbatim. */
export function RightRail({}: Record<string, never>) {
  return (
    <aside className="rightcol">
            <div className="card-surface">
              <div className="match">
                <div className="match-top">
                  <div className="ring">
                    <svg width="84" height="84" viewBox="0 0 84 84">
                      <circle cx="42" cy="42" r="36" fill="none" stroke="#f4f6f9" strokeWidth="9" />
                      <circle cx="42" cy="42" r="36" fill="none" stroke="#f3c516" strokeWidth="9" strokeLinecap="round" strokeDasharray="226.2" strokeDashoffset="29.4" />
                    </svg>
                    <div className="ring-n"><div><div className="v">87%</div><div className="l">match</div></div></div>
                  </div>
                  <div>
                    <div className="match-h">Nexit Match</div>
                    <div className="match-t">Excellent match</div>
                    <div className="match-s">Ranked #1 of your 8 countries</div>
                  </div>
                </div>
                <div className="why">
                  <div className="why-row"><span className="lbl">Budget</span><span className="why-bar"><i style={{width: '94%'}}></i></span><span className="v">94</span></div>
                  <div className="why-row"><span className="lbl">Visa access</span><span className="why-bar"><i style={{width: '91%'}}></i></span><span className="v">91</span></div>
                  <div className="why-row"><span className="lbl">Healthcare</span><span className="why-bar"><i style={{width: '84%'}}></i></span><span className="v">84</span></div>
                  <div className="why-row"><span className="lbl">Family fit</span><span className="why-bar"><i className="mid" style={{width: '76%'}}></i></span><span className="v">76</span></div>
                  <div className="why-row"><span className="lbl">Language</span><span className="why-bar"><i className="mid" style={{width: '68%'}}></i></span><span className="v">68</span></div>
                  <div className="why-row"><span className="lbl">Speed</span><span className="why-bar"><i className="low" style={{width: '52%'}}></i></span><span className="v">52</span></div>
                </div>
              </div>
              <div className="match-cta">
                <Link className="gold-button btn-full" href="/nexit-plan">Build my Nexit Plan <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                <button className="btn btn-full">Compare with Spain</button>
              </div>
            </div>

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
          </aside>
  )
}
