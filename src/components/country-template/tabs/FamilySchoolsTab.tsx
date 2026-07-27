import type { CountryContent } from '@/lib/country-workspace/country-content'

/* Converted from the approved index.html mockup. Markup is verbatim.
   Content is still literal Portugal copy: replace with `content.*` per
   section as the model is extended. See README step 4. */
export function FamilySchoolsTab({ slug }: { slug: string }) {
  return (
      <div className="tabpanel on" id="p-family">

              {/* 1. OVERVIEW */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">1</span><h2>Family-Friendliness Overview</h2></div></div>
                <div className="kpis">
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l8 3.6v6.1c0 4.6-3.3 8.7-8 10.3-4.7-1.6-8-5.7-8-10.3V5.6z" /></svg>Child safety</div><div className="v">Very high</div><div className="n">Global Peace Index rank <b>#6</b></div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2" /><path d="M2 20a7 7 0 0114 0" /></svg>Childcare 0 to 3</div><div className="v">Free <small>Creche Feliz</small></div><div className="n">Waitlists are the real constraint</div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10L12 5 2 10l10 5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>Pre-school 3 to 6</div><div className="v">Universal <small>and free</small></div><div className="n">Law 22/2025 guarantees a place</div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>International school</div><div className="v">EUR 9k–25k <small>/ yr</small></div><div className="n">The one large family expense</div></div>
                </div>
                <div className="two" style={{marginTop: '18px'}}>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span>What works well</div>
                    <ul className="rd-list">
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Children are included, not segregated.</b> Kids are welcome in restaurants at 9pm, at family gatherings, at public events. There is no separate children&apos;s world here.</li>
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Independence comes earlier.</b> Walking to school alone, playing unsupervised outside, and taking public transport at an age that would raise eyebrows in the US.</li>
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Childcare cost is close to zero</b> under six, which reverses the largest single expense many US families carry.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg></span>What to plan around</div>
                    <ul className="rd-list">
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg><b>Creche places, not creche cost.</b> Free does not mean available. Urban waitlists are long and you join them before you arrive.</li>
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg><b>Extracurriculars are club-based, not school-based.</b> There is no US-style school sports infrastructure, so activities are arranged through municipal and neighbourhood clubs.</li>
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg><b>Teenagers have the hardest transition.</b> Language acquisition and social entry both get significantly harder after about age twelve. Section 5 covers this.</li>
                    </ul>
                  </div>
                </div>
                <div className="src"><span>Last verified: January 2026 · Direção-Geral de Estatísticas da Educação e Ciência, Eurydice Portugal, Segurança Social</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 2. CHILDCARE */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">2</span><h2>Childcare and Early Years</h2></div></div>
                <p className="lead">Portugal made early childcare free in stages, and the change is larger than most relocation guides reflect. The bottleneck has moved from price to availability.</p>
                <table className="tbl">
                  <thead><tr><th>Stage</th><th className="num">Ages</th><th className="num">Cost to you</th><th>How it works</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Creche</td><td className="num">0 to 3</td><td className="num">Free</td><td>The <b>Creche Feliz</b> programme covers fees at social sector, private opted-in providers, and registered childminders. The state pays the provider directly, around EUR 474 a month per child.</td></tr>
                    <tr><td>Ama (childminder)</td><td className="num">0 to 3</td><td className="num">Free if registered</td><td>Social Security registered childminders are covered by the same programme. Often easier to find than a creche place.</td></tr>
                    <tr className="hi"><td>Jardim de infância</td><td className="num">3 to 6</td><td className="num">Free</td><td>Universal pre-school was written into law in 2025. The state is obliged to provide a place in the year your child turns three.</td></tr>
                    <tr><td>Private bilingual creche</td><td className="num">0 to 6</td><td className="num">EUR 400–900 / mo</td><td>Chosen for English-language continuity rather than cost. Not covered by the free scheme if outside the network.</td></tr>
                    <tr><td>Babysitting</td><td className="num">Any</td><td className="num">EUR 6–12 / hr</td><td>Informal, arranged through networks and neighbourhood groups.</td></tr>
                  </tbody>
                </table>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Free is not the same as available.</b> Demand rose sharply once fees disappeared, and urban creche places go quickly. Join waitlists at several providers as soon as you have an address, and treat a confirmed place as a factor in choosing your neighbourhood rather than an afterthought.</span>
                </div>
                <div className="subh" style={{marginTop: '20px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>What you need first</div>
                <ul className="rd-list">
                  <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>A NISS for your child.</b> The social security number, obtained at Segurança Social. Public childcare and the free scheme both run through it.</li>
                  <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Proof of address.</b> Placement is catchment-based, so where you live decides which providers you can access.</li>
                  <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Vaccination record.</b> The boletim de vacinas, transferred from your US records and reviewed at your health centre.</li>
                </ul>
              </section>

              {/* 3. SYSTEM AND ENROLLMENT */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>School System and Enrollment</h2></div></div>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10L12 5 2 10l10 5z" /></svg></span>How the system is structured</div>
                    <div className="ladder">
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">1</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-when">Ages 3 to 6</div><div className="lad-t">Pré-escolar</div><div className="lad-d">Pre-school. Universal and free, not compulsory.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">2</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-when">Ages 6 to 10</div><div className="lad-t">Ensino básico, 1º ciclo</div><div className="lad-d">Years 1 to 4. One main teacher, closest to US elementary.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">3</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-when">Ages 10 to 12</div><div className="lad-t">Ensino básico, 2º ciclo</div><div className="lad-d">Years 5 and 6. Subject teachers begin.</div></div></div>
                      <div className="lad"><div className="lad-rail"><span className="lad-dot">4</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-when">Ages 12 to 15</div><div className="lad-t">Ensino básico, 3º ciclo</div><div className="lad-d">Years 7 to 9, ending in national exams.</div></div></div>
                      <div className="lad goal"><div className="lad-rail"><span className="lad-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" width="13" height="13"><path d="M20 6L9 17l-5-5" /></svg></span></div><div className="lad-body"><div className="lad-when">Ages 15 to 18</div><div className="lad-t">Ensino secundário</div><div className="lad-d">Years 10 to 12. Streamed into academic or vocational tracks, ending in national exams that determine university access.</div><div className="lad-tags"><span className="lad-tag">Compulsory to 18</span></div></div></div>
                    </div>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h6" /></svg></span>Enrollment windows</div>
                    <p className="rd-p">Public enrollment runs <b>exclusively online through the Portal das Matrículas</b>, in four separate windows by year group. Missing your window means applying late and taking whatever place remains.</p>
                    <table className="tbl" style={{marginTop: '12px'}}>
                      <thead><tr><th>Year group</th><th className="num">Window</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td>Pre-school and year 1</td><td className="num">Late April to early June</td></tr>
                        <tr><td>Years 6 to 9, and year 11</td><td className="num">Mid to late June</td></tr>
                        <tr><td>Years 2 to 5</td><td className="num">Early to mid July</td></tr>
                        <tr><td>Years 10 and 12</td><td className="num">Mid to late July</td></tr>
                      </tbody>
                    </table>
                    <p className="note">Dates shift slightly each year by ministerial order. Confirm the current calendar before you plan a move date around it.</p>
                    <div className="subh" style={{marginTop: '18px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Documents to have ready</div>
                    <div className="route-req" style={{borderTop: 'none', paddingTop: '0'}}>
                      <span className="req miss">Child&apos;s residence permit or visa</span><span className="req miss">NIF</span><span className="req miss">NISS</span><span className="req miss">Número de utente</span><span className="req miss">Proof of address</span><span className="req miss">Vaccination record</span><span className="req miss">Prior school transcripts, translated</span>
                    </div>
                  </div>
                </div>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Placement is by catchment area, or by a parent&apos;s workplace.</b> This is the single biggest reason to research neighbourhoods before signing a lease. Your address chooses your school before you do.</span>
                </div>
              </section>

              {/* 4. CHOOSING A SCHOOL */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>Choosing a School</h2></div></div>
                <p className="lead">Four routes, and the choice usually comes down to your child&apos;s age and how permanent the move is. Open any option for detail.</p>
                <table className="tbl">
                  <thead><tr><th>Option</th><th className="num">Annual cost</th><th className="num">Language</th><th className="num">Best for</th><th>Return to US education</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Public school</td><td className="num">Free</td><td className="num">Portuguese</td><td className="num">Under 10, permanent move</td><td>Difficult, requires transcript conversion</td></tr>
                    <tr><td>Private Portuguese</td><td className="num">EUR 3,000–8,000</td><td className="num">Portuguese</td><td className="num">Smaller classes, still integrating</td><td>Difficult</td></tr>
                    <tr className="hi"><td>International school</td><td className="num">EUR 9,000–25,000</td><td className="num">English, IB or national</td><td className="num">Teens, uncertain timeline</td><td>Straightforward</td></tr>
                    <tr><td>Ensino doméstico</td><td className="num">Free plus materials</td><td className="num">Your choice</td><td className="num">Continuity, flexibility</td><td>Straightforward if documented</td></tr>
                  </tbody>
                </table>

                <div style={{height: '1px', background: 'var(--line)', margin: '20px 0'}}></div>

                <div className="route">
                  <span className="ic i-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V8l8-4 8 4v13" /><path d="M9 21v-6h6v6" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Public school</div><div className="route-desc">Free, taught in Portuguese, placement by catchment area</div></div><span className="pill p-best">Fastest integration</span></div>
                    <div className="route-meta"><span>No tuition</span><span>Language support available</span><span>Enroll via Portal das Matrículas</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">Your child is placed at the school serving your address, or optionally the one serving a parent&apos;s workplace. Newly arrived children are entitled to <b>Português Língua Não Materna</b> support, additional Portuguese instruction delivered alongside the regular timetable. Quality of that support varies enormously by school and is worth asking about specifically.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Tuition</div><div className="v">Free</div></div>
                        <div className="rd-stat"><div className="l">Books and meals</div><div className="v">Subsidised</div></div>
                        <div className="rd-stat"><div className="l">School day</div><div className="v">Approx 9 to 5</div></div>
                        <div className="rd-stat"><div className="l">Year runs</div><div className="v">Sept to June</div></div>
                      </div>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Your child is under about ten</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You intend to stay long term</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You want your family embedded locally</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Your child is mid-secondary</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You may return to the US within a few years</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Your child has an active support plan</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">What to ask the school</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>How many hours of PLNM support per week</b>, and delivered by whom.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>How many other newly arrived children</b> are in the year group. Being the only one is much harder.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Whether the school runs AEC</b>, the after-school enrichment activities, and until what time.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="route">
                  <span className="ic i-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V10h14v11M12 3l9 5H3z" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Private Portuguese school (colégio)</div><div className="route-desc">Smaller classes, Portuguese curriculum, often religious foundation</div></div></div>
                    <div className="route-meta"><span>EUR 3,000 to 8,000 / yr</span><span>Taught in Portuguese</span><span>Widely available</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">A middle option that is frequently overlooked. You get smaller class sizes, more attentive pastoral care, and often stronger English instruction, while your child still integrates into Portuguese-language education at <b>roughly a third of international school cost</b>. Many are Catholic foundations, though practice varies from nominal to devout.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Tuition</div><div className="v">EUR 3k–8k / yr</div></div>
                        <div className="rd-stat"><div className="l">Class size</div><div className="v">Smaller</div></div>
                        <div className="rd-stat"><div className="l">Language</div><div className="v">Portuguese</div></div>
                        <div className="rd-stat"><div className="l">Entry</div><div className="v">Direct application</div></div>
                      </div>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Not bound by catchment.</b> You apply directly, so this decouples your school choice from your rental decision.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Ask about religious instruction</b> and whether it is opt-out, if that matters to your family.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Language support is less formalised</b> than in the public PLNM framework. Ask what they actually do for a non-Portuguese speaker.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="route">
                  <span className="ic i-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">International school</div><div className="route-desc">English-medium, IB or national curriculum, concentrated in a few areas</div></div><span className="pill p-cx">Largest expense</span></div>
                    <div className="route-meta"><span>EUR 9,000 to 25,000 / yr</span><span>Lisbon, Cascais, Porto, Algarve</span><span>Assessment and waitlists</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">International schools cluster tightly: the <b>Cascais and Carcavelos corridor</b> west of Lisbon holds the largest concentration, with further options in Porto and the Algarve. Curricula include International Baccalaureate, British, American, French, and German. Entry usually involves assessment and a waitlist, and the strongest schools fill a year ahead.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Tuition</div><div className="v">EUR 9k–25k / yr</div></div>
                        <div className="rd-stat"><div className="l">Plus</div><div className="v">Enrollment fees</div></div>
                        <div className="rd-stat"><div className="l">Curricula</div><div className="v">IB, UK, US, FR, DE</div></div>
                        <div className="rd-stat"><div className="l">Apply</div><div className="v">A year ahead</div></div>
                      </div>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Your child is a teenager</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>The move may not be permanent</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>US or UK university is the target</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>The tuition breaks your budget maths</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You want to live outside the main corridors</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Local integration is the point of the move</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>School location dictates where you live.</b> Two children at a Cascais school effectively decides your neighbourhood and your commute.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Two children at EUR 18,000 each</b> is EUR 36,000 a year, which erases most of the cost advantage of moving here. Run that number before anything else.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Ask about the leaver rate.</b> High international school turnover means your child&apos;s friends cycle out annually, which is its own kind of hard.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="route">
                  <span className="ic i-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M9 21v-8h6v8" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Ensino doméstico (homeschooling)</div><div className="route-desc">Legally recognised, registered with a host school, assessed annually</div></div><span className="pill p-new">Legal and structured</span></div>
                    <div className="route-meta"><span>Free plus materials</span><span>Registered with a host school</span><span>Annual assessment</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">Portugal recognises home education in law rather than tolerating it. You register your child with a <b>host school</b> (escola de matrícula), agree a plan, and the child sits an annual assessment against the national curriculum to progress. A parent or a designated tutor must hold a qualification at or above the level being taught. There is also <b>ensino individual</b>, a related route where tutoring is delivered by a qualified teacher rather than a parent.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Cost</div><div className="v">Materials only</div></div>
                        <div className="rd-stat"><div className="l">Registration</div><div className="v">Host school</div></div>
                        <div className="rd-stat"><div className="l">Assessment</div><div className="v">Annual</div></div>
                        <div className="rd-stat"><div className="l">Curriculum</div><div className="v">National, assessed</div></div>
                      </div>
                      <span className="res-flag yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Satisfies compulsory education. Your child stays legally enrolled.</span>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>The assessment is in Portuguese</b> and against the Portuguese curriculum, which is the practical constraint most arriving families underestimate.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Host school relationships vary.</b> Some are supportive partners, others treat it as an administrative burden. Choosing the right one matters more than the paperwork.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Socialisation is on you.</b> Without the school structure, municipal clubs and activity groups in section 8 become the main route to friendships.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>There is an active community</b> of home-educating families, concentrated around Lisbon, the Algarve, and the central interior.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. QUALITY AND LANGUAGE */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>School Quality and the Language Transition</h2></div></div>
                <p className="lead">Portugal&apos;s schools improved markedly over two decades and then dipped post-pandemic, like most of the OECD. Averages matter less than the specific school, and the specific school is decided by your address.</p>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /></svg></span>Judging a school</div>
                    <ul className="rd-list">
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>National rankings are published annually</b> based on year 9 and year 12 exam results. Useful as a filter, misleading as a verdict, since they track intake as much as teaching.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Visit in person.</b> Facilities in older public schools vary sharply between neighbouring parishes.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Ask about teacher turnover.</b> Placement rules move staff frequently, and a school that keeps its teachers is telling you something.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h10M8 4v2M10 6c0 4-3 8-7 9M6 11c1.5 3 4 5 7 6M13 20l4-11 4 11M14.5 16.5h5" /></svg></span>How hard the language transition is, by age</div>
                    <table className="tbl">
                      <thead><tr><th>Child&apos;s age</th><th className="num">Difficulty</th><th className="num">Typical fluency</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td>Under 6</td><td className="num"><span className="meter" data-lvl="1"><i></i><i></i><i></i><i></i></span><span className="mlab">Minimal</span></td><td className="num">Under a year</td></tr>
                        <tr><td>6 to 9</td><td className="num"><span className="meter" data-lvl="2"><i></i><i></i><i></i><i></i></span><span className="mlab">Moderate</span></td><td className="num">1 to 2 years</td></tr>
                        <tr><td>10 to 12</td><td className="num"><span className="meter" data-lvl="3"><i></i><i></i><i></i><i></i></span><span className="mlab">Hard</span></td><td className="num">2 to 3 years</td></tr>
                        <tr className="hi"><td>13 and over</td><td className="num"><span className="meter" data-lvl="4"><i></i><i></i><i></i><i></i></span><span className="mlab">Very hard</span></td><td className="num">Often incomplete</td></tr>
                      </tbody>
                    </table>
                    <p className="note">Difficulty here means academic and social difficulty combined. A twelve year old can learn the language and still struggle to enter established friendship groups.</p>
                  </div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Age is the single strongest predictor of how this goes.</b> Under ten, public school is usually the right answer and integration follows quickly. Over thirteen, an English-medium option protects both academic progress and mental health during the transition, and the cost is worth taking seriously in your budget rather than resenting later.</span>
                </div>
              </section>

              {/* 6. SPECIAL EDUCATION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Special Education and Disability Accommodations</h2></div></div>
                <p className="lead">Portugal replaced its old categorical special-education model with an inclusive framework in 2018. On paper it is progressive. In practice, resourcing is uneven and the transition from a US plan is not automatic.</p>
                <div className="det-grid">
                  <div className="det"><div className="h">The legal framework</div><div className="b">Decreto-Lei 54/2018 sets out <b>measures of support for learning and inclusion</b> in three tiers: universal, selective, and additional. There is no separate diagnosis-gated track, support is scaled to need within mainstream school.</div></div>
                  <div className="det"><div className="h">Who assesses</div><div className="b">Every school has a multidisciplinary team, the <b>EMAEI</b>, which evaluates need and decides which tier of measures applies. Parents are formally part of that process.</div></div>
                  <div className="det"><div className="h">The plan document</div><div className="b">Children on additional measures receive a <b>Programa Educativo Individual</b>, the closest equivalent to a US IEP, reviewed regularly and signed by the family.</div></div>
                  <div className="det"><div className="h">Resource centres</div><div className="b">Centros de Recurso para a Inclusão provide therapies and specialist input to schools under contract. Availability is much stronger in cities than in the interior.</div></div>
                  <div className="det"><div className="h">Your US plan does not transfer</div><div className="b"><b>An IEP or 504 has no legal standing here.</b> Bring the documentation, translated, as evidence, but expect a fresh local assessment and a gap of months before supports are in place.</div></div>
                  <div className="det"><div className="h">Assessment language</div><div className="b">Evaluation is conducted in Portuguese. English-language psychological and educational assessment exists privately, mostly in Lisbon, and is often worth paying for to avoid a language artefact in the results.</div></div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Start this before you arrive, not after.</b> Get current evaluations translated, contact prospective schools directly to ask what their EMAEI has actually delivered for similar children, and budget for private therapy during the gap. Families who wait until enrollment routinely lose a school year to the process.</span>
                </div>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                      <span>For the adult disability certificate, benefits, and physical accessibility, see <a href="/nextinations/portugal/v2/healthcare" style={{textDecoration: 'underline', fontWeight: '700'}}>Healthcare, section 8</a>.</span>
                </div>
              </section>

              {/* 7. BENEFITS AND VISAS */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">7</span><h2>Family Benefits, Parental Leave, and Visa Considerations</h2></div>
                  <a className="sec-link" href="/nextinations/portugal/v2/move-there">See the pathways <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
                </div>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg></span>What you can claim</div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Abono de família</div><div className="b">Monthly child benefit, income tested and paid per child. Requires the child to be resident and registered with Social Security.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Parental leave</div><div className="b">Initial parental leave of 120 or 150 days, shareable between parents, with a <b>mandatory period reserved for fathers</b>. Extended and part-time options follow. Requires a contributions record.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Tax relief</div><div className="b">Dependents reduce your Portuguese income tax liability, and education, health, and childcare expenses are partly deductible against it.</div></div>
                    <div className="det"><div className="h">Free childcare and pre-school</div><div className="b">Covered in section 2, and worth counting as a benefit rather than an absence of cost. For two children it is worth thousands a year.</div></div>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg></span>What a family adds to your filing</div>
                    <table className="tbl">
                      <thead><tr><th>Household member</th><th className="num">Adds to income requirement</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td>Main applicant</td><td className="num">100% of threshold</td></tr>
                        <tr><td>Spouse or partner</td><td className="num">+50%</td></tr>
                        <tr><td>Each dependent child</td><td className="num">+30%</td></tr>
                      </tbody>
                    </table>
                    <p className="note">Applied to the route threshold in Move There. A couple with two children needs materially more than a solo applicant on the same visa.</p>
                    <ul className="rd-list" style={{marginTop: '14px'}}>
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Dependents are included on your application.</b> They do not file separately, and their permits mirror yours.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Every dependent needs their own document set</b>, including apostilled birth certificates. This multiplies the apostille timeline, not the effort per document.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Family reunification exists</b> if one parent goes ahead alone, but it adds months and a second process. Filing together is usually faster.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Shared custody needs documented consent</b> from the other parent to remove a child from the US. Start this early, it is the item most likely to derail a timeline.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 8. YOUTH ACTIVITIES AND PETS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">8</span><h2>Youth Activities and Household Pets</h2></div></div>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg></span>Activities outside school</div>
                    <p className="rd-p">Extracurriculars run through <b>municipal programmes and neighbourhood clubs</b> rather than schools. That is the structural difference from the US, and it means you have to go find them rather than have them handed to you at enrollment.</p>
                    <table className="tbl" style={{marginTop: '12px'}}>
                      <thead><tr><th>Activity</th><th className="num">Typical cost</th></tr></thead>
                      <tbody>
                        <tr><td>Municipal sport and swimming</td><td className="num">EUR 15–40 / mo</td></tr>
                        <tr className="hi"><td>Football club</td><td className="num">EUR 20–60 / mo</td></tr>
                        <tr><td>Surf school, coastal areas</td><td className="num">EUR 40–90 / mo</td></tr>
                        <tr><td>Music and conservatory</td><td className="num">EUR 40–120 / mo</td></tr>
                        <tr><td>Escuteiros (scouts)</td><td className="num">Nominal</td></tr>
                        <tr><td>Colónias de férias (summer camp)</td><td className="num">EUR 50–200 / week</td></tr>
                      </tbody>
                    </table>
                    <p className="note">Your local junta de freguesia publishes what is running in your parish. It is the first place to ask and the one most newcomers never visit.</p>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 5.5a2 2 0 11-4 0 2 2 0 014 0zM18 5.5a2 2 0 11-4 0 2 2 0 014 0zM6 11a2 2 0 11-4 0 2 2 0 014 0zM22 11a2 2 0 11-4 0 2 2 0 014 0z" /><path d="M12 11c-2.8 0-5 2.6-5 5.5 0 2 1.3 3 3 3 .9 0 1.4-.5 2-.5s1.1.5 2 .5c1.7 0 3-1 3-3 0-2.9-2.2-5.5-5-5.5z" /></svg></span>Bringing pets</div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">The sequence<span className="dtag ap">Start 4 months out</span></div><div className="b"><b>Microchip first, then rabies vaccination.</b> That order is mandatory. A vaccination given before the chip does not count and has to be repeated, which is the most common and most expensive mistake.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Waiting period</div><div className="b">Rabies vaccination must be at least <b>21 days</b> before travel. Then a USDA-accredited vet issues an EU health certificate, endorsed by USDA APHIS, valid for a short window before departure.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Quarantine</div><div className="b">None for cats and dogs arriving from the US with correct paperwork.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Cost and transport</div><div className="b">Roughly <b>$1,000 to $2,500</b> depending on size and route. Small animals travel in cabin, larger ones as cargo, and airlines impose summer heat embargoes that can force a seasonal change to your move date.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Once you arrive</div><div className="b">Vet care is inexpensive, with consultations around EUR 30 to 50. Portugal is broadly dog-friendly, though many beaches restrict dogs in summer.</div></div>
                    <div className="det"><div className="h">The rental problem</div><div className="b"><b>Many landlords refuse pets</b>, especially in furnished city apartments. This narrows an already tight rental market, so declare it upfront rather than discovering it at signing.</div></div>
                  </div>
                </div>
                <div className="subh" style={{marginTop: '20px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Official portals</div>
                <div className="links">
                  <a className="lnk" href="https://portaldasmatriculas.edu.gov.pt" target="_blank" rel="noopener noreferrer">Portal das Matrículas <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.seg-social.pt" target="_blank" rel="noopener noreferrer">Segurança Social <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://eurydice.eacea.ec.europa.eu/national-education-systems/portugal/access" target="_blank" rel="noopener noreferrer">Eurydice education system <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.aphis.usda.gov/pet-travel" target="_blank" rel="noopener noreferrer">USDA APHIS pet travel <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                </div>
                <div className="src"><span>Last verified: January 2026 · Eurydice Portugal, Segurança Social, Decreto-Lei 54/2018, USDA APHIS</span><span className="sbadge">Official source verified</span></div>
              </section>
            </div>
  )
}
