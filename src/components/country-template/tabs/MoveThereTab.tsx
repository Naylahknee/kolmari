import Link from 'next/link'
import type { CountryContent } from '@/lib/country-workspace/country-content'

/* Converted from the approved index.html mockup. Markup is verbatim.
   Content is still literal Portugal copy: replace with `content.*` per
   section as the model is extended. See README step 4. */
export function MoveThereTab({}: Record<string, never>) {
  return (
      <div className="tabpanel on" id="p-move">

              {/* 1. WAYS IN */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">1</span><h2>Ways In</h2></div>
                </div>
                <p className="lead">Five legal routes are open to you. They differ mainly in <b>what income they ask you to prove</b> and how long the paperwork takes. All five land you in the same place: a residence permit that starts the five year clock toward permanent residency or citizenship.</p>
                <table className="tbl">
                  <thead><tr><th>Route</th><th>Best for</th><th className="num">Income needed</th><th className="num">Processing</th><th>Where it leads</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>D8 Digital Nomad</td><td>Remote employees and freelancers earning outside Portugal</td><td className="num">EUR 3,480 / mo</td><td className="num">1 to 2 months</td><td>Residency, then citizenship at year 5</td></tr>
                    <tr><td>D7 Passive Income</td><td>Retirees, rental income, dividends, pensions, royalties</td><td className="num">EUR 870 / mo</td><td className="num">2 to 4 months</td><td>Residency, then citizenship at year 5</td></tr>
                    <tr><td>D2 Entrepreneur</td><td>Founders relocating or starting a Portuguese business</td><td className="num">Business plan</td><td className="num">3 to 6 months</td><td>Residency, then citizenship at year 5</td></tr>
                    <tr><td>D4 Student</td><td>Degree, research program, or accredited language course</td><td className="num">No threshold</td><td className="num">2 to 3 months</td><td>Counts toward the year 5 clock</td></tr>
                    <tr><td>Job Seeker</td><td>Coming to find local work before committing</td><td className="num">Proof of funds</td><td className="num">1 to 2 months</td><td>Converts to a work permit</td></tr>
                  </tbody>
                </table>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Routes can stack.</b> Buying property or joining a housing cooperative does not grant residency on its own, but it can strengthen a D7 or D2 filing by settling the accommodation requirement. Those options are covered under Cost &amp; Housing.</span>
                </div>
              </section>

              {/* 2. VISA PATHWAYS */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">2</span><h2>Visa Pathways</h2></div>
                  <span className="pill p-best">3 you qualify for</span>
                </div>
                <p className="lead">Checked against your intake profile. Requirements marked in green are already satisfied by what you told us.</p>

                <div className="route best">
                  <span className="ic i-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M3 9h18" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Digital Nomad Visa (D8)</div><div className="route-desc">For remote workers and freelancers with income from outside Portugal</div></div><span className="pill p-best">Best match</span></div>
                    <div className="route-meta">
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>1 to 2 months</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>EUR 3,480 / mo minimum</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3" /><path d="M2 20a7 7 0 0114 0" /></svg>Spouse and children included</span>
                    </div>
                    <div className="route-req">
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Income threshold cleared</span>
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Remote income confirmed</span>
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Clean record</span>
                      <span className="req miss">Needs: 12 month lease</span>
                      <span className="req miss">Needs: health insurance</span>
                    </div>
                    <a className="route-src" href="https://www.gov.pt/guias/migrantes-vistos-e-autorizacoes-para-entrar-e-viver-em-portugal" target="_blank" rel="noopener noreferrer">gov.pt visa guidance <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  </div>
                </div>

                <div className="route">
                  <span className="ic i-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1z" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Passive Income Visa (D7)</div><div className="route-desc">For retirees and anyone living on rental income, dividends, pensions, or royalties</div></div><span className="pill p-pop">Popular</span></div>
                    <div className="route-meta">
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>2 to 4 months</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>EUR 870 / mo passive</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /></svg>Lowest bar of any route</span>
                    </div>
                    <div className="route-req">
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Clean record</span>
                      <span className="req miss">Needs: passive income proof</span>
                      <span className="req miss">Needs: 12 month lease</span>
                    </div>
                    <a className="route-src" href="https://www.gov.pt/guias/migrantes-vistos-e-autorizacoes-para-entrar-e-viver-em-portugal" target="_blank" rel="noopener noreferrer">gov.pt visa guidance <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  </div>
                </div>

                <div className="route">
                  <span className="ic i-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Entrepreneur Visa (D2)</div><div className="route-desc">For founders relocating a business or starting one in Portugal</div></div><span className="pill p-cx">Complex</span></div>
                    <div className="route-meta">
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>3 to 6 months</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 9h8M8 13h5" /></svg>Business plan required</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 9v4M12 17h.01" /></svg>Highest refusal rate</span>
                    </div>
                    <div className="route-req">
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Self-employed income</span>
                      <span className="req miss">Needs: business plan</span>
                      <span className="req miss">Needs: Portuguese counsel</span>
                    </div>
                    <a className="route-src" href="https://www.gov.pt/guias/migrantes-vistos-e-autorizacoes-para-entrar-e-viver-em-portugal" target="_blank" rel="noopener noreferrer">gov.pt visa guidance <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  </div>
                </div>

                <div className="route">
                  <span className="ic i-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10L12 5 2 10l10 5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Student &amp; Research Visa (D4)</div><div className="route-desc">Degree program, research placement, or an accredited language course</div></div><span className="pill p-new">Overlooked</span></div>
                    <div className="route-meta">
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>2 to 3 months</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /></svg>No income threshold</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Counts toward year 5</span>
                    </div>
                    <div className="route-req">
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Prior degree on file</span>
                      <span className="req miss">Needs: enrollment letter</span>
                    </div>
                    <a className="route-src" href="https://www.dges.gov.pt/en" target="_blank" rel="noopener noreferrer">Enrolment and visa detail <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 011-1h5" /></svg></a>
                  </div>
                </div>

                <div className="route">
                  <span className="ic i-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Job Seeker Visa</div><div className="route-desc">120 days in country to find work, extendable once by 60 days</div></div><span className="pill p-warn">Time limited</span></div>
                    <div className="route-meta">
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>1 to 2 months</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 9v4M12 17h.01" /></svg>Local salaries are low</span>
                    </div>
                    <div className="route-req">
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Proof of funds</span>
                      <span className="req miss">Needs: return ticket</span>
                    </div>
                    <a className="route-src" href="https://www.gov.pt/guias/migrantes-vistos-e-autorizacoes-para-entrar-e-viver-em-portugal" target="_blank" rel="noopener noreferrer">gov.pt visa guidance <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 011-1h5" /></svg></a>
                  </div>
                </div>
                <div className="src"><span>Last verified: January 2026 · gov.pt, AIMA, Portuguese consular network</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 3. SHORT-STAY AND LONG-STAY */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>Short-Stay and Long-Stay Options</h2></div></div>
                <p className="lead">Two entirely different legal tracks. The mistake most people make is arriving on the short-stay track and assuming they can convert once they are inside.</p>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14" /></svg></span>Short stay (visitor)</div>
                    <div className="entry">
                      <div className="entry-head">
                        <span className="entry-eb">Short-stay entry, before any residency filing</span>
                        <span className="pp-pick">
                          <label htmlFor="ppSel">Your passport</label>
                          <select id="ppSel">
                            <option value="us" selected>United States</option>
                            <option value="gb">United Kingdom</option>
                            <option value="ca">Canada</option>
                            <option value="br">Brazil</option>
                            <option value="za">South Africa</option>
                            <option value="in">India</option>
                            <option value="ng">Nigeria</option>
                          </select>
                        </span>
                      </div>
                      <div className="entry-body">
                        <span className="ebadge" id="ppBadge">Visa-free</span>
                        <span className="entry-main"><span className="entry-t" id="ppDays">90 days</span><span className="entry-d" id="ppNote"></span></span>
                      </div>
                      <div className="entry-foot">
                        <span id="ppSrc">Source: Passport Index dataset &middot; sample data, verify before travel</span>
                        <a href="https://www.passportindex.org/travel-visa-checker/" target="_blank" rel="noopener noreferrer">Check any destination on Passport Index <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      </div>
                    </div>

                    <div className="subh" style={{marginTop: '6px'}}>Your other matched countries, same passport</div>
                    <table className="tbl" id="ppTable">
                      <thead><tr><th>Destination</th><th className="num">Entry</th><th className="num">Stay</th></tr></thead>
                      <tbody></tbody>
                    </table>
                    <p className="note">Short-stay entry only. None of this grants the right to live, work, or register as a resident. That is what the pathways in section 2 are for.</p>

                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Schengen 90 / 180 rule</div><div className="b">A US passport enters visa-free for up to <b>90 days in any rolling 180 day period</b>, counted across the entire Schengen area, not just Portugal. Leaving to Spain does not reset it.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">What you cannot do</div><div className="b">No local employment, no residency registration, no access to public healthcare. You are a tourist for legal purposes regardless of how you spend the time.</div></div>
                    <div className="det"><div className="h">Best use</div><div className="b">A scouting trip. Visit the cities on your shortlist, walk neighborhoods, and meet a lawyer or accountant before committing to a filing.</div></div>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Long stay (national visa)</div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">The D-series visa</div><div className="b">Applied for at a Portuguese consulate <b>in your home country</b>, not on arrival. Issued as a four month, two entry visa whose only job is to get you into Portugal for your residence appointment.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">What happens next</div><div className="b">You enter, attend your AIMA appointment, and receive a <b>two year residence permit</b>. The visa itself expires and stops mattering.</div></div>
                    <div className="det"><div className="h">Best use</div><div className="b">Any move you intend to last longer than three months. This is the only track that leads anywhere.</div></div>
                  </div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>You generally cannot switch tracks from inside the country.</b> Arriving as a visitor and then applying for residency is not a supported path for most routes. Plan the consulate filing before you fly.</span>
                </div>
              </section>

              {/* 4. RESIDENCY LADDER */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>Temporary Residency, Permanent Residency, and Citizenship</h2></div></div>
                <p className="lead">Portugal has one of the shortest naturalization clocks in the EU. Here is the full ladder from filing to passport.</p>
                <div className="ladder">
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">1</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Month 0</div>
                      <div className="lad-t">National visa issued</div>
                      <div className="lad-d">Granted by the consulate in your home country. Valid four months, two entries. Its only purpose is entry plus your residence appointment.</div>
                      <div className="lad-tags"><span className="lad-tag">Filed abroad</span><span className="lad-tag">4 month validity</span></div>
                    </div>
                  </div>
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">2</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Month 1 to 9</div>
                      <div className="lad-t">Temporary residence permit</div>
                      <div className="lad-d">Issued at your AIMA appointment after biometrics. Valid <b>two years</b>. Gives you the right to live, work, enroll in schools, and register with the public health service.</div>
                      <div className="lad-tags"><span className="lad-tag">2 year card</span><span className="lad-tag">Work rights</span><span className="lad-tag">SNS access</span></div>
                    </div>
                  </div>
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">3</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Year 2</div>
                      <div className="lad-t">First renewal</div>
                      <div className="lad-d">Renewed for a further <b>three years</b>. You must show you actually lived here: absences over six consecutive months or eight non-consecutive months can break the chain.</div>
                      <div className="lad-tags"><span className="lad-tag">3 year renewal</span><span className="lad-tag">Presence tested</span></div>
                    </div>
                  </div>
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">4</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Year 5</div>
                      <div className="lad-t">Permanent residency</div>
                      <div className="lad-d">Open-ended right to remain, renewed administratively every five years. Requires <b>A2 level Portuguese</b> and a clean record. You keep your existing nationality and give up nothing.</div>
                      <div className="lad-tags"><span className="lad-tag">A2 Portuguese</span><span className="lad-tag">No income test</span></div>
                    </div>
                  </div>
                  <div className="lad goal">
                    <div className="lad-rail"><span className="lad-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" width="13" height="13"><path d="M20 6L9 17l-5-5" /></svg></span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Year 5 and after</div>
                      <div className="lad-t">Citizenship</div>
                      <div className="lad-d">Available at the same five year mark. Requires A2 Portuguese, a clean record, and a genuine connection to the country. <b>Portugal permits dual citizenship</b>, and the US does not require you to renounce, so you can hold both.</div>
                      <div className="lad-tags"><span className="lad-tag">Dual allowed</span><span className="lad-tag">EU passport</span><span className="lad-tag">Processing 12 to 24 months</span></div>
                    </div>
                  </div>
                </div>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Start Portuguese in year one, not year four.</b> A2 is a modest level, but the certified exam has limited sitting dates and the requirement is the single most common reason people reach year five and cannot file.</span>
                </div>
                <div className="src"><span>Last verified: January 2026 · Nationality Law, AIMA residence guidance</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 5. ENTRY AND IMMIGRATION REQUIREMENTS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Entry and Immigration Requirements</h2></div></div>
                <p className="lead">These apply across every D-series route. Route-specific extras are listed on the pathway cards in section 2.</p>
                <div className="det-grid">
                  <div className="det"><div className="h">Passport validity</div><div className="b">Valid for at least <b>three months beyond</b> your intended stay and issued within the last ten years. Two blank pages required.</div></div>
                  <div className="det"><div className="h">Criminal record certificate</div><div className="b">FBI identity history summary, <b>apostilled</b> and issued within the last three months. You also authorize a Portuguese record check.</div></div>
                  <div className="det"><div className="h">Health insurance</div><div className="b">Private cover valid in Portugal for the <b>full first year</b>, including repatriation. Budget it as a filing cost, not an optional extra.</div></div>
                  <div className="det"><div className="h">Proof of accommodation</div><div className="b">A <b>twelve month lease</b>, property deed, or a formal accommodation letter. Short-term rental bookings are usually refused.</div></div>
                  <div className="det"><div className="h">Proof of income</div><div className="b">Three to six months of statements plus contracts or client invoices showing the income is <b>stable and recurring</b>, not a one-time balance.</div></div>
                  <div className="det"><div className="h">Proof of funds</div><div className="b">Savings in a Portuguese account, commonly around <b>twelve times the minimum wage</b> for the main applicant, plus a percentage per dependent.</div></div>
                  <div className="det"><div className="h">NIF (tax number)</div><div className="b">Required before you can rent, bank, or file. Obtainable remotely through a fiscal representative. <b>Nothing else moves until you have it.</b></div></div>
                  <div className="det"><div className="h">Biometrics</div><div className="b">Fingerprints and photo captured at your AIMA appointment after arrival. Cannot be completed in advance or remotely.</div></div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Income thresholds move every year.</b> They track the Portuguese minimum wage and reset in January, so a figure you saw last year is probably low. Verify before you file.</span>
                </div>
              </section>

              {/* 6. REQUIRED DOCUMENTS */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">6</span><h2>Required Documents</h2></div>
                  <span className="acc-count" id="docCount">0 / 13 gathered</span>
                </div>
                <p className="lead">Tap to track what you have. <span className="dtag ap">Apostille</span> means it needs a Hague apostille from the issuing state. <span className="dtag tr">Translate</span> means certified Portuguese translation.</p>
                <div className="doc-cols">
                  <div>
                    <div className="doc-g" style={{marginBottom: '10px'}}>
                      <div className="gh"><span>Identity</span></div>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Passport plus copies of every page</span><span className="st-d">Valid 3 months beyond stay, under 10 years old</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Two passport photos</span><span className="st-d">ICAO standard, taken within 6 months</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Birth certificate<span className="dtag ap">Apostille</span><span className="dtag tr">Translate</span></span><span className="st-d">Long form, state issued</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Marriage certificate<span className="dtag ap">Apostille</span><span className="dtag tr">Translate</span></span><span className="st-d">Only if filing with a spouse</span></span></button>
                    </div>
                    <div className="doc-g">
                      <div className="gh"><span>Legal</span></div>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">FBI background check<span className="dtag ap">Apostille</span><span className="dtag tr">Translate</span></span><span className="st-d">Longest lead time of anything on this list</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Portuguese criminal check consent</span><span className="st-d">Signed form authorizing the local check</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Completed visa application form</span><span className="st-d">Route-specific, signed by every applicant</span></span></button>
                    </div>
                  </div>
                  <div>
                    <div className="doc-g" style={{marginBottom: '10px'}}>
                      <div className="gh"><span>Financial</span></div>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Bank statements, 3 to 6 months</span><span className="st-d">Showing recurring income, not a single deposit</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Employment or client contracts</span><span className="st-d">Proof the income continues after you move</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Most recent tax return</span><span className="st-d">Full return, all schedules</span></span></button>
                    </div>
                    <div className="doc-g">
                      <div className="gh"><span>Portugal specific</span></div>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">NIF certificate</span><span className="st-d">Obtain first, everything else depends on it</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Portuguese bank account proof</span><span className="st-d">Statement showing your proof-of-funds balance</span></span></button>
                      <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Twelve month lease or deed</span><span className="st-d">Registered with the tax authority</span></span></button>
                    </div>
                  </div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Apostilles expire in practice.</b> Most consulates want documents issued within the last three to six months, so gathering too early is as much of a problem as gathering too late.</span>
                </div>
              </section>

              {/* 7. PROCESSING TIMES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">7</span><h2>Processing Times</h2></div></div>
                <p className="lead">Ranges reflect current reported waits on the D8 route. The two amber stages are queues you do not control, and they are where timelines break.</p>
                <div className="tl">
                  <div className="tl-row"><div className="tl-top"><span className="tl-l">Gather and apostille documents</span><span className="tl-v">6 to 10 weeks</span></div><div className="tl-track"><i className="calm" style={{left: '0', width: '22%'}}></i></div></div>
                  <div className="tl-row"><div className="tl-top"><span className="tl-l">Consulate appointment wait</span><span className="tl-v">2 to 12 weeks</span></div><div className="tl-track"><i className="risk" style={{left: '18%', width: '26%'}}></i></div></div>
                  <div className="tl-row"><div className="tl-top"><span className="tl-l">Visa decision</span><span className="tl-v">2 to 8 weeks</span></div><div className="tl-track"><i style={{left: '40%', width: '18%'}}></i></div></div>
                  <div className="tl-row"><div className="tl-top"><span className="tl-l">Travel and arrival</span><span className="tl-v">1 week</span></div><div className="tl-track"><i className="calm" style={{left: '57%', width: '4%'}}></i></div></div>
                  <div className="tl-row"><div className="tl-top"><span className="tl-l">AIMA residence appointment</span><span className="tl-v">3 to 9 months</span></div><div className="tl-track"><i className="risk" style={{left: '60%', width: '34%'}}></i></div></div>
                  <div className="tl-row"><div className="tl-top"><span className="tl-l">Residence card issued</span><span className="tl-v">2 to 6 weeks</span></div><div className="tl-track"><i style={{left: '88%', width: '12%'}}></i></div></div>
                  <div className="tl-scale"><span>Today</span><span>6 months</span><span>12 months</span><span>18 months</span></div>
                </div>
                <div className="tl-total">
                  <span><span className="k">Filing to boots on the ground</span><br /><span className="v">4 to 7 months</span></span>
                  <span><span className="k">Filing to residence card in hand</span><br /><span className="v">9 to 18 months</span></span>
                  <span><span className="k">Landing to citizenship eligibility</span><br /><span className="v">5 years</span></span>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Book the consulate appointment before your documents are ready.</b> The queue is the constraint, not the paperwork. You can reschedule an appointment, but you cannot shorten the wait.</span>
                </div>
                <div className="src"><span>Last verified: January 2026 · Consular reported waits, AIMA scheduling data</span><span className="sbadge rev">Editorially reviewed</span></div>
              </section>

              {/* 8. RELOCATION STEPS */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">8</span><h2>Relocation Steps and Requirements</h2></div>
                  <Link className="sec-link" href="/nexit-plan">Open in my Nexit Plan <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                </div>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Before you file</div>
                    <div className="ladder">
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">1</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Get your NIF</div><div className="lad-d">Remotely through a fiscal representative. Everything downstream depends on this.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">2</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Open a Portuguese bank account</div><div className="lad-d">Millennium BCP or Santander. Move your proof-of-funds balance in and leave it there.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">3</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Book the consulate appointment</div><div className="lad-d">Do this before the documents are ready. The queue is the bottleneck.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">4</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Secure a twelve month lease</div><div className="lad-d">Registered with the tax authority. Short-term bookings are usually refused.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">5</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Buy health insurance</div><div className="lad-d">Full first year, valid in Portugal, including repatriation cover.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">6</span></div><div className="lad-body"><div className="lad-t">File at the consulate</div><div className="lad-d">Every applicant attends in person, children included.</div></div></div>
                    </div>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V8l8-5 8 5v13" /></svg></span>After you land</div>
                    <div className="ladder">
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">1</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Enter within the visa window</div><div className="lad-d">Four months, two entries. Missing it voids the filing.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">2</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Attend your AIMA appointment</div><div className="lad-d">Biometrics and document verification. This is the long queue.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">3</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Register your address</div><div className="lad-d">At the local junta de freguesia. Needed for most other registrations.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">4</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Register with your health center</div><div className="lad-d">Gets you an SNS number and a family doctor assignment.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">5</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-t">Get a social security number</div><div className="lad-d">Required if you will invoice, employ, or be employed locally.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">6</span></div><div className="lad-body"><div className="lad-t">Exchange your driver license</div><div className="lad-d">There is a deadline after residency starts. Miss it and you retest.</div></div></div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
  )
}
