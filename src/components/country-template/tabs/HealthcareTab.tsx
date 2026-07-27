import type { CountryContent } from '@/lib/country-workspace/country-content'

/* Converted from the approved index.html mockup. Markup is verbatim.
   Content is still literal Portugal copy: replace with `content.*` per
   section as the model is extended. See README step 4. */
export function HealthcareTab({ slug }: { slug: string }) {
  return (
      <div className="tabpanel on" id="p-health">

              {/* 1. SYSTEM OVERVIEW */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">1</span><h2>Healthcare System Overview</h2></div></div>
                <div className="kpis">
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 00-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 000-7.8z" /></svg>Life expectancy</div><div className="v">82.4 <small>years</small></div><div className="n">Above the <b>EU average</b></div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2" /><path d="M2 20a7 7 0 0114 0" /></svg>Coverage</div><div className="v">Universal <small>SNS</small></div><div className="n">Tax funded, open to <b>legal residents</b></div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>Private insurance</div><div className="v">EUR 40–90 <small>/ person / mo</small></div><div className="n">Rises sharply <b className="warn">after 60</b></div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Family doctor</div><div className="v">Not guaranteed</div><div className="n">Over a million residents <b className="warn">unassigned</b></div></div>
                </div>
                <div className="two" style={{marginTop: '18px'}}>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V8l8-4 8 4v13" /><path d="M12 9v6M9 12h6" /></svg></span>How the two tiers work together</div>
                    <p className="rd-p">Portugal runs a tax-funded national health service alongside a cheap, fast private sector. <b>Most residents use both.</b> The SNS handles your family doctor, chronic conditions, emergencies, and anything expensive. Private handles anything you do not want to wait for: a dermatology appointment, an MRI, a routine specialist visit.</p>
                    <p className="rd-p" style={{marginTop: '10px'}}>The practical consequence is that private insurance here is not a replacement for public cover the way it is in the US. It is a queue-jumping layer on top of a system you are already entitled to use.</p>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg></span>The honest weak point</div>
                    <p className="rd-p">Portugal&apos;s health outcomes are good and its costs are low. The pressure point is <b>access, not quality</b>. Family doctor shortages are real and regionally uneven, and public specialist waits can run months. Emergency and serious care are reliable. Routine and elective care is where people reach for the private tier.</p>
                  </div>
                </div>
                <div className="src"><span>Last verified: January 2026 · OECD Health at a Glance, Serviço Nacional de Saúde, Eurostat</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 2. PUBLIC */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">2</span><h2>Public Healthcare (SNS)</h2></div></div>
                <p className="lead">The Serviço Nacional de Saúde is funded through general taxation rather than payroll contributions, so you are covered by residency rather than by employment.</p>
                <div className="det-grid">
                  <div className="det"><div className="h">What it covers</div><div className="b">Primary care, specialist referrals, hospital treatment, surgery, maternity, chronic disease management, and emergency care. <b>Coverage is broad, not partial.</b></div></div>
                  <div className="det"><div className="h">What you pay</div><div className="b">Most user fees were abolished. A charge still applies if you use an emergency department <b>without a referral</b> and the case is not urgent, which is the mechanism used to discourage walk-ins.</div></div>
                  <div className="det"><div className="h">Your entry point</div><div className="b">A centro de saúde or USF, your local health unit. Everything routes through here: referrals, prescriptions, sick notes, vaccinations.</div></div>
                  <div className="det"><div className="h">Dental and optical</div><div className="b"><b>Largely excluded.</b> Limited voucher schemes exist for some groups, but most residents pay privately. Budget for it separately.</div></div>
                  <div className="det"><div className="h">Maximum response times</div><div className="b">The SNS publishes guaranteed maximum waiting times by urgency level. They are a legal standard rather than a promise, but they give you grounds to escalate.</div></div>
                  <div className="det"><div className="h">Regional variation</div><div className="b">Lisbon, Porto, and Coimbra concentrate the specialists and teaching hospitals. Interior and island regions run thinner, and complex cases get transferred.</div></div>
                </div>
              </section>

              {/* 3. PRIVATE */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>Private Healthcare and Insurance</h2></div></div>
                <p className="lead">Private care in Portugal is inexpensive by US standards even without insurance. Many residents skip insurance entirely and simply pay cash for the few things they want quickly.</p>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg></span>Insurance by age</div>
                    <table className="tbl">
                      <thead><tr><th>Age band</th><th className="num">Per person / month</th><th className="num">Notes</th></tr></thead>
                      <tbody>
                        <tr><td>Under 30</td><td className="num">EUR 25–45</td><td className="num">Cheapest band</td></tr>
                        <tr className="hi"><td>30 to 45</td><td className="num">EUR 35–60</td><td className="num">Most common</td></tr>
                        <tr><td>45 to 60</td><td className="num">EUR 55–95</td><td className="num">Rising</td></tr>
                        <tr><td>60 to 70</td><td className="num">EUR 95–180</td><td className="num">Steep</td></tr>
                        <tr><td>Over 70</td><td className="num">Often declined</td><td className="num">New policies restricted</td></tr>
                      </tbody>
                    </table>
                    <div className="callout warn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                      <span><b>Buy before you need it.</b> Pre-existing conditions are commonly excluded, and most insurers will not write a new policy past a certain age. If private cover matters to your plan, take it out in year one rather than year five.</span>
                    </div>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg></span>Paying out of pocket</div>
                    <table className="tbl">
                      <thead><tr><th>Service</th><th className="num">Cash price</th><th className="num">US comparison</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td>GP consultation</td><td className="num">EUR 50–70</td><td className="num">$150–300</td></tr>
                        <tr><td>Specialist consultation</td><td className="num">EUR 60–90</td><td className="num">$250–500</td></tr>
                        <tr><td>Blood panel</td><td className="num">EUR 30–70</td><td className="num">$150–500</td></tr>
                        <tr><td>MRI scan</td><td className="num">EUR 150–350</td><td className="num">$1,000–3,000</td></tr>
                        <tr><td>Dental cleaning</td><td className="num">EUR 40–70</td><td className="num">$120–250</td></tr>
                        <tr><td>Therapy session</td><td className="num">EUR 50–80</td><td className="num">$120–250</td></tr>
                      </tbody>
                    </table>
                    <div className="subh" style={{marginTop: '18px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V8l8-4 8 4v13" /></svg></span>Main private hospital groups</div>
                    <div className="route-req" style={{borderTop: 'none', paddingTop: '0'}}>
                      <span className="req miss">CUF</span><span className="req miss">Lusíadas Saúde</span><span className="req miss">Hospital da Luz</span><span className="req miss">Trofa Saúde</span><span className="req miss">Médis network</span><span className="req miss">Multicare network</span>
                    </div>
                    <p className="note">Insurers operate networks. Check that your preferred hospital group is in-network before you buy, especially outside Lisbon and Porto.</p>
                  </div>
                </div>
              </section>

              {/* 4. ELIGIBILITY AND REGISTRATION */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">4</span><h2>Eligibility and Health Registration Requirements</h2></div>
                  <a className="sec-link" href="/nextinations/portugal/v2/move-there">See the residency steps <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
                </div>
                <p className="lead">Access follows residency, and the sequence matters. Skipping a step leaves you paying privately for longer than you need to.</p>
                <div className="ladder">
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">1</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Before you file</div>
                      <div className="lad-t">Private insurance for the first year</div>
                      <div className="lad-d">Mandatory for the visa application. Must be valid in Portugal and include repatriation. This is a filing cost, not optional, and it is what covers you during the gap before SNS access.</div>
                      <div className="lad-tags"><span className="lad-tag">Visa requirement</span><span className="lad-tag">Repatriation cover</span></div>
                    </div>
                  </div>
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">2</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">After you land</div>
                      <div className="lad-t">Register your address</div>
                      <div className="lad-d">At the junta de freguesia. You need this before the health centre will register you, so it is worth doing in your first fortnight.</div>
                      <div className="lad-tags"><span className="lad-tag">Junta de freguesia</span></div>
                    </div>
                  </div>
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">3</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Once you hold residency</div>
                      <div className="lad-t">Get your número de utente</div>
                      <div className="lad-d">Your SNS patient number, issued at your local centro de saúde. Bring your residence permit, NIF, address proof, and passport. <b>This number is what unlocks the public system.</b></div>
                      <div className="lad-tags"><span className="lad-tag">Residence permit</span><span className="lad-tag">NIF</span><span className="lad-tag">Address proof</span></div>
                    </div>
                  </div>
                  <div className="lad">
                    <div className="lad-rail"><span className="lad-dot">4</span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Same visit or later</div>
                      <div className="lad-t">Request a family doctor</div>
                      <div className="lad-d">Assignment depends on capacity in your parish. In pressured areas you may be waitlisted, and until then you use the health centre&apos;s open consultation instead of a named doctor.</div>
                      <div className="lad-tags"><span className="lad-tag">May waitlist</span><span className="lad-tag">Varies by parish</span></div>
                    </div>
                  </div>
                  <div className="lad goal">
                    <div className="lad-rail"><span className="lad-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" width="13" height="13"><path d="M20 6L9 17l-5-5" /></svg></span><span className="lad-line"></span></div>
                    <div className="lad-body">
                      <div className="lad-when">Ongoing</div>
                      <div className="lad-t">Decide whether to keep private cover</div>
                      <div className="lad-d">Many residents keep a cheap private policy alongside SNS purely to skip specialist queues. Others drop it and pay cash for the two or three things a year they want quickly.</div>
                      <div className="lad-tags"><span className="lad-tag">Optional</span><span className="lad-tag">Both is common</span></div>
                    </div>
                  </div>
                </div>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Emergency care does not wait for paperwork.</b> Emergency departments treat anyone who needs urgent care regardless of status. The registration sequence governs routine and ongoing care, not a crisis.</span>
                </div>
              </section>

              {/* 5. ACCESS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Access to Primary Care, Specialists, and Emergency Care</h2></div></div>
                <p className="lead">Two different kinds of waiting happen here, and they are not comparable. <b>Same-day care</b> is time spent in a department. <b>Scheduled care</b> is how far out the next available date sits. They are grouped separately below.</p>
                <table className="tbl">
                  <thead><tr><th>Service</th><th className="num">Typical wait</th><th className="num">Wait level</th><th>If that is too slow</th></tr></thead>
                  <tbody>
                    <tr className="grp"><td colSpan={4}>Same-day care <b>· time spent waiting on the day</b></td></tr>
                    <tr><td>Emergency, urgent triage</td><td className="num">Immediate to 1 hour</td><td className="num"><span className="meter" data-lvl="1" role="img" aria-label="Minimal wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Minimal</span></td><td>Nothing to do. Urgent cases are seen first by design.</td></tr>
                    <tr><td>Emergency, non-urgent triage</td><td className="num">3 to 8 hours</td><td className="num"><span className="meter" data-lvl="3" role="img" aria-label="Long wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Long</span></td><td>Call SNS 24 first. Their triage routes you correctly and removes the non-referred fee.</td></tr>
                    <tr><td>Pharmacy consultation</td><td className="num">Walk in</td><td className="num"><span className="meter" data-lvl="1" role="img" aria-label="Minimal wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Minimal</span></td><td>Pharmacists here handle minor conditions directly. Use them before an ED.</td></tr>

                    <tr className="grp"><td colSpan={4}>Scheduled care <b>· how far out the next appointment sits</b></td></tr>
                    <tr><td>Private specialist</td><td className="num">2 to 10 days</td><td className="num"><span className="meter" data-lvl="1" role="img" aria-label="Short wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Short</span></td><td>Already the fast option. Book direct, no referral needed, EUR 60 to 90.</td></tr>
                    <tr><td>SNS family doctor</td><td className="num">3 days to 3 weeks</td><td className="num"><span className="meter" data-lvl="2" role="img" aria-label="Moderate wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Moderate</span></td><td>Use your health centre&apos;s open consultation for anything that cannot wait.</td></tr>
                    <tr className="hi"><td>SNS specialist referral</td><td className="num">1 to 6 months</td><td className="num"><span className="meter" data-lvl="4" role="img" aria-label="Very long wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Very long</span></td><td>This is the main reason people carry private cover. The same consult privately costs EUR 60 to 90.</td></tr>

                    <tr className="grp"><td colSpan={4}>Planned procedures <b>· non-urgent surgery and treatment</b></td></tr>
                    <tr className="hi"><td>SNS elective surgery</td><td className="num">3 to 12 months</td><td className="num"><span className="meter" data-lvl="4" role="img" aria-label="Very long wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Very long</span></td><td>Check the published maximum response time for your procedure. Exceeding it gives you grounds to escalate or transfer.</td></tr>
                    <tr><td>Diagnostic imaging (MRI, CT)</td><td className="num">2 weeks to 4 months</td><td className="num"><span className="meter" data-lvl="3" role="img" aria-label="Long wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Long</span></td><td>Paying privately costs EUR 150 to 350 and usually takes under a week.</td></tr>
                  </tbody>
                </table>
                <div className="legend">
                  <span><b style={{color: 'var(--ink)'}}>Wait level:</b></span>
                  <span><span className="meter" data-lvl="1" role="img" aria-label="Minimal wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Minimal</span></span>
                  <span><span className="meter" data-lvl="2" role="img" aria-label="Moderate wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Moderate</span></span>
                  <span><span className="meter" data-lvl="3" role="img" aria-label="Long wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Long</span></span>
                  <span><span className="meter" data-lvl="4" role="img" aria-label="Very long wait"><i></i><i></i><i></i><i></i></span><span className="mlab">Very long</span></span>
                  <span style={{marginLeft: 'auto'}}>Relative to what the same care costs in wait time elsewhere in Western Europe</span>
                </div>

                <div className="two" style={{marginTop: '22px'}}>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l8 3.6v6.1c0 4.6-3.3 8.7-8 10.3-4.7-1.6-8-5.7-8-10.3V5.6z" /></svg></span>How emergency triage works</div>
                    <p className="rd-p">Portuguese emergency departments use the <b>Manchester triage system</b>, which assigns a colour band on arrival and treats strictly by clinical urgency rather than arrival order. Red and orange are seen immediately or within minutes. Green and blue can wait many hours behind more urgent cases, which is why non-urgent walk-ins carry a fee.</p>
                    <p className="rd-p" style={{marginTop: '10px'}}>If you are unsure whether something is urgent, call the national health line first. They triage over the phone, can direct you to the right level of care, and their advice removes the non-referred fee.</p>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.1 9.5a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" /></svg></span>Numbers worth saving now</div>
                    <div className="kpis" style={{gridTemplateColumns: '1fr'}}>
                      <div className="kpi"><div className="k">Emergency, all services</div><div className="v">112</div><div className="n">Ambulance, fire, police. Works EU-wide, English available.</div></div>
                      <div className="kpi"><div className="k">SNS 24 health line</div><div className="v">808 24 24 24</div><div className="n">Free nurse triage and advice, English support available.</div></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. PRESCRIPTIONS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Prescription Medication</h2></div></div>
                <div className="det-grid">
                  <div className="det"><div className="h">How prescribing works</div><div className="b">Prescriptions are electronic and tied to your utente number. You receive a code by SMS and collect at any pharmacy, so there is no paper to lose and no pharmacy lock-in.</div></div>
                  <div className="det"><div className="h">Cost</div><div className="b">Prices are state regulated and subsidised by therapeutic class. Generic substitution is standard. Most common medications cost <b>a fraction of US prices</b>, often single-digit euros.</div></div>
                  <div className="det"><div className="h">Pharmacies</div><div className="b">Marked by a green cross. Pharmacists have real clinical authority here and will advise on minor conditions rather than sending you to a doctor.</div></div>
                  <div className="det"><div className="h">Out of hours</div><div className="b">Every area operates a rota of farmácias de serviço open overnight. The rota is posted on the door of every closed pharmacy.</div></div>
                  <div className="det"><div className="h">What differs from the US</div><div className="b">Some medications sold over the counter in the US require a prescription here, and the reverse is also true. <b>Brand names frequently differ</b>, so travel with the generic molecule name, not the US brand.</div></div>
                  <div className="det"><div className="h">Controlled medications</div><div className="b">Stimulants and some psychiatric medications face tighter restrictions and occasional supply gaps. Verify availability <b>before</b> you commit if you depend on a specific one.</div></div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Bring a documented supply and a doctor&apos;s letter.</b> Carry medications in original labelled packaging with a letter listing the generic names and dosages. It clears customs questions and gives your first Portuguese doctor something to prescribe against before your records transfer.</span>
                </div>
              </section>

              {/* 7. MENTAL HEALTH */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">7</span><h2>Mental Health Services</h2></div></div>
                <p className="lead">This is the weakest part of an otherwise solid system, and it is worth planning around rather than discovering later.</p>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V8l8-4 8 4v13" /></svg></span>Public provision</div>
                    <ul className="rd-list">
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>Referral runs through your family doctor, which is a bottleneck if you have not been assigned one.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>Psychiatry is more available than psychology. Talk therapy through the SNS is <b>limited and slow</b>.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>Services are English-capable in major hospitals, much less so elsewhere.</li>
                    </ul>
                    <div className="subh" style={{marginTop: '20px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg></span>Private provision</div>
                    <ul className="rd-list">
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Sessions run <b>EUR 50 to 80</b>, well below US rates, and you can book directly without a referral.</li>
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>English-speaking therapists are concentrated in Lisbon, Cascais, and the Algarve.</li>
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Insurance often caps therapy at a small number of sessions a year, so read that clause specifically.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 00-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 000-7.8z" /></svg></span>Planning ahead</div>
                    <p className="rd-p">Relocation is itself a significant stressor, and the first year abroad is when people most often need support and least often have it arranged. If you are already in care, the practical move is to <b>keep your current provider for telehealth continuity</b> across the transition, then build local care in parallel rather than switching cold.</p>
                    <p className="rd-p" style={{marginTop: '10px'}}>If you take psychiatric medication, confirm availability and local naming before you move. That check belongs in section 6, and it is the single most common gap people hit.</p>
                    <div className="callout info">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                      <span><b>In a crisis in Portugal, call 112</b>, or the SNS 24 line on <b>808 24 24 24</b> for urgent advice and triage. Both operate around the clock and both have English support.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. ACCESSIBILITY */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">8</span><h2>Accessibility and Disability Services</h2></div></div>
                <p className="lead">Legal protections are solid and modern infrastructure is compliant. The gap is the built environment, which in historic centres was not designed for it and often cannot be retrofitted.</p>
                <div className="det-grid">
                  <div className="det"><div className="h">The key document</div><div className="b">The <b>atestado médico de incapacidade multiuso</b>, a multi-purpose disability certificate issued after a medical board assessment. It gates tax relief, parking permits, benefits, and service access. Apply early, the boards run slow.</div></div>
                  <div className="det"><div className="h">What it unlocks</div><div className="b">Income tax relief, VAT exemption on adapted vehicles, disability parking, priority queuing, and eligibility for support allowances depending on assessed percentage.</div></div>
                  <div className="det"><div className="h">Built environment</div><div className="b">New construction meets accessibility standards. <b>Historic centres do not.</b> Lisbon&apos;s hills and calçada cobblestone are genuinely difficult for wheelchairs, walkers, and unsteady gait.</div></div>
                  <div className="det"><div className="h">Transport</div><div className="b">Lisbon metro is partially step-free, and newer stations are fully accessible while older ones are not. Buses are largely low-floor. Intercity rail requires advance assistance booking.</div></div>
                  <div className="det"><div className="h">Schools and children</div><div className="b">Public schools have a legal duty to include and provide support, with quality varying by school and municipality. Detail sits under Family &amp; Schools.</div></div>
                  <div className="det"><div className="h">City versus interior</div><div className="b">Specialist rehabilitation, assistive technology, and disability services concentrate in Lisbon, Porto, and Coimbra. <b>The interior cost saving comes with a services trade-off.</b></div></div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Visit before you sign a lease if mobility matters.</b> Listings rarely mention that a building has no lift, that the entrance has three steps, or that the street is a 12% gradient of polished stone. In older Portuguese housing stock all three are common, and none of it shows in photographs.</span>
                </div>
                <div className="subh" style={{marginTop: '20px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Official portals</div>
                <div className="links">
                  <a className="lnk" href="https://www.sns.gov.pt" target="_blank" rel="noopener noreferrer">SNS portal <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.sns24.gov.pt" target="_blank" rel="noopener noreferrer">SNS 24 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.seg-social.pt" target="_blank" rel="noopener noreferrer">Segurança Social <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.infarmed.pt" target="_blank" rel="noopener noreferrer">INFARMED medicines <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                </div>
                <div className="src"><span>Last verified: January 2026 · SNS, INFARMED, Instituto Nacional para a Reabilitação. This is planning information, not medical advice.</span><span className="sbadge rev">Editorially reviewed</span></div>
              </section>
            </div>
  )
}
