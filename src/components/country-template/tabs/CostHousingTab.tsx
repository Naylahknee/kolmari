import Link from 'next/link'
import type { CountryContent } from '@/lib/country-workspace/country-content'

/* Converted from the approved index.html mockup. Markup is verbatim.
   Content is still literal Portugal copy: replace with `content.*` per
   section as the model is extended. See README step 4. */
export function CostHousingTab({ slug }: { slug: string }) {
  return (
      <div className="tabpanel" id="p-cost">

              {/* 1. COST OF LIVING */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">1</span><h2>Cost of Living</h2></div>
                  <div className="seg" role="group" aria-label="Household size">
                    <button data-mode="solo" aria-pressed="false">Solo</button>
                    <button data-mode="couple" aria-pressed="true">Couple</button>
                    <button data-mode="family" aria-pressed="false">Family of 4</button>
                  </div>
                </div>
                <div className="kpis">
                  <div className="kpi">
                    <div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>Monthly total</div>
                    <div className="v"><span className="nu" data-hh data-solo="$1,635" data-couple="$2,365" data-family="$3,565">$2,365</span> <small>/ mo</small></div>
                    <div className="n"><span className="nu" data-hh data-solo="Solo mover" data-couple="Couple" data-family="Family of four">Couple</span> in Lisbon</div>
                  </div>
                  <div className="kpi">
                    <div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v6h-6" /></svg>Against your budget</div>
                    <div className="v"><span className="nu" data-hh data-solo="54%" data-couple="34%" data-family="1%">34%</span> <small>under</small></div>
                    <div className="n">You stated <b>$3,600 / mo</b> available</div>
                  </div>
                  <div className="kpi">
                    <div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>Against US median</div>
                    <div className="v">48% <small>lower</small></div>
                    <div className="n">Same household, US metro average</div>
                  </div>
                  <div className="kpi">
                    <div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M15 9.5a3.5 3.5 0 100 5M9 12h3" /></svg>Currency</div>
                    <div className="v">EUR <small>euro</small></div>
                    <div className="n">Figures converted at <b>1.08 USD</b></div>
                  </div>
                </div>

                <div className="callout ok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>
                  <span>Your stated income leaves roughly <b><span className="nu" data-hh data-solo="$1,965" data-couple="$1,235" data-family="$35">$1,235</span> per month of cushion</b> against the high estimate for this household size. Planning guide only, not a guarantee.</span>
                </div>

                <div className="bars">
                  <div className="bcol" data-solo="700" data-couple="950" data-family="1350"><span className="bval nu">$950</span><span className="bar" style={{height: '68%', background: '#c99a00'}}></span><span className="blab">Housing</span></div>
                  <div className="bcol" data-solo="320" data-couple="480" data-family="780"><span className="bval nu">$480</span><span className="bar" style={{height: '34%', background: '#dfae0e'}}></span><span className="blab">Food</span></div>
                  <div className="bcol" data-solo="120" data-couple="170" data-family="260"><span className="bval nu">$170</span><span className="bar" style={{height: '12%', background: '#f3c516'}}></span><span className="blab">Transport</span></div>
                  <div className="bcol" data-solo="70" data-couple="120" data-family="210"><span className="bval nu">$120</span><span className="bar" style={{height: '9%', background: '#f7d05a'}}></span><span className="blab">Healthcare</span></div>
                  <div className="bcol" data-solo="140" data-couple="210" data-family="300"><span className="bval nu">$210</span><span className="bar" style={{height: '15%', background: '#f3c516'}}></span><span className="blab">Leisure</span></div>
                  <div className="bcol" data-solo="65" data-couple="95" data-family="145"><span className="bval nu">$95</span><span className="bar" style={{height: '7%', background: '#a87f00'}}></span><span className="blab">Utilities</span></div>
                  <div className="bcol" data-solo="220" data-couple="340" data-family="520"><span className="bval nu">$340</span><span className="bar" style={{height: '24%', background: '#fae19b'}}></span><span className="blab">Other</span></div>
                </div>
                <p className="note">Housing is the only category that moves dramatically by city. Everything else stays within about 15% nationwide.</p>
                <div className="src"><span>Last verified: January 2026 · Instituto Nacional de Estatística, Eurostat HICP, resident-reported budgets</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 2. TYPICAL MONTHLY BUDGET */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">2</span><h2>Typical Monthly Budget</h2></div>
                  <Link className="sec-link" href="/cost-calculator">Open cost calculator <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                </div>
                <p className="lead">Line items for a couple in Lisbon. Ranges reflect the gap between careful and comfortable, not between poverty and luxury.</p>
                <table className="tbl">
                  <thead><tr><th>Category</th><th>What it covers</th><th className="num">Low</th><th className="num">High</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Housing</td><td>2 bed rental, central parish, unfurnished</td><td className="num">EUR 800</td><td className="num">EUR 1,600</td></tr>
                    <tr><td>Food</td><td>Groceries plus eating out twice a week</td><td className="num">EUR 350</td><td className="num">EUR 560</td></tr>
                    <tr><td>Utilities</td><td>Electricity, water, gas, building charges</td><td className="num">EUR 70</td><td className="num">EUR 130</td></tr>
                    <tr><td>Internet and mobile</td><td>Fibre plus two mobile lines</td><td className="num">EUR 45</td><td className="num">EUR 75</td></tr>
                    <tr><td>Transport</td><td>Two monthly transit passes, occasional rideshare</td><td className="num">EUR 90</td><td className="num">EUR 190</td></tr>
                    <tr><td>Healthcare</td><td>Private insurance for two, plus copays</td><td className="num">EUR 80</td><td className="num">EUR 180</td></tr>
                    <tr><td>Leisure</td><td>Gym, culture, weekend trips</td><td className="num">EUR 130</td><td className="num">EUR 280</td></tr>
                    <tr><td>Other</td><td>Household goods, clothing, personal, buffer</td><td className="num">EUR 200</td><td className="num">EUR 420</td></tr>
                  </tbody>
                </table>

                <div className="divider" style={{height: '1px', background: 'var(--line)', margin: '22px 0'}}></div>
                <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V9l8-5 8 5v12" /></svg></span>Same life, different city</div>
                <table className="tbl">
                  <thead><tr><th>City</th><th>Character</th><th className="num">2 bed rent</th><th className="num">Monthly total</th><th className="num">vs Lisbon</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Lisbon</td><td>Capital, most expat infrastructure</td><td className="num">EUR 1,600</td><td className="num">$2,365</td><td className="num">baseline</td></tr>
                    <tr><td>Porto</td><td>Smaller, colder, cheaper, still a real city</td><td className="num">EUR 1,150</td><td className="num">$1,950</td><td className="num">18% less</td></tr>
                    <tr><td>Funchal</td><td>Island, mild year round, nomad scene</td><td className="num">EUR 1,050</td><td className="num">$1,870</td><td className="num">21% less</td></tr>
                    <tr><td>Algarve (Lagos)</td><td>Coastal, seasonal price swings</td><td className="num">EUR 1,300</td><td className="num">$2,150</td><td className="num">9% less</td></tr>
                    <tr><td>Braga</td><td>University town, very low cost</td><td className="num">EUR 750</td><td className="num">$1,550</td><td className="num">34% less</td></tr>
                    <tr><td>Évora (Alentejo)</td><td>Interior, slow, hot summers</td><td className="num">EUR 680</td><td className="num">$1,480</td><td className="num">37% less</td></tr>
                  </tbody>
                </table>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Moving inland is the largest single lever you have.</b> Évora costs 37% less than Lisbon, but healthcare, international schools, and consular services all get further away. Weigh it against the Healthcare and Family tabs before committing.</span>
                </div>
              </section>

              {/* 3. RENT AND HOUSING AVAILABILITY */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>Rent and Housing Availability</h2></div></div>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V9l8-5 8 5v12" /></svg></span>Monthly rental ranges</div>
                    <table className="tbl">
                      <thead><tr><th>City</th><th className="num">Studio / 1 bed</th><th className="num">2 bed</th><th className="num">3 bed</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td>Lisbon</td><td className="num">750–1,400</td><td className="num">1,200–2,000</td><td className="num">1,800–3,000</td></tr>
                        <tr><td>Porto</td><td className="num">600–950</td><td className="num">900–1,450</td><td className="num">1,300–2,100</td></tr>
                        <tr><td>Funchal</td><td className="num">550–900</td><td className="num">850–1,300</td><td className="num">1,200–1,800</td></tr>
                        <tr><td>Lagos</td><td className="num">700–1,200</td><td className="num">1,000–1,700</td><td className="num">1,500–2,400</td></tr>
                        <tr><td>Braga</td><td className="num">400–700</td><td className="num">600–950</td><td className="num">850–1,300</td></tr>
                        <tr><td>Évora</td><td className="num">350–600</td><td className="num">550–850</td><td className="num">750–1,150</td></tr>
                      </tbody>
                    </table>
                    <p className="note">All figures in EUR per month, unfurnished, excluding utilities.</p>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /></svg></span>How hard it is to find a place</div>
                    <div className="avail">
                      <div><div className="g-top"><span className="g-l">Lisbon</span><span className="g-v">Very tight, moves in days</span></div><div className="g-track"><i className="warn" style={{width: '22%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Lagos and the Algarve</span><span className="g-v">Tight, heavy summer swings</span></div><div className="g-track"><i className="warn" style={{width: '32%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Porto</span><span className="g-v">Competitive but workable</span></div><div className="g-track"><i className="warn" style={{width: '46%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Funchal</span><span className="g-v">Moderate, nomad demand rising</span></div><div className="g-track"><i style={{width: '58%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Braga</span><span className="g-v">Open outside term start</span></div><div className="g-track"><i style={{width: '74%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Interior and Alentejo</span><span className="g-v">Plenty of stock, slower listings</span></div><div className="g-track"><i style={{width: '88%'}}></i></div></div>
                    </div>
                    <div className="subh" style={{marginTop: '20px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Where people search</div>
                    <div className="route-req" style={{borderTop: 'none', paddingTop: '0'}}>
                      <span className="req miss">Idealista</span><span className="req miss">Imovirtual</span><span className="req miss">Casa Sapo</span><span className="req miss">OLX</span><span className="req miss">Facebook housing groups</span><span className="req miss">Local agency windows</span>
                    </div>
                    <p className="note">Portuguese-language listings are consistently cheaper than English-facing expat listings for the same property.</p>
                  </div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Signing from abroad is the hardest part of the whole move.</b> Most landlords will not hold a property for a tenant who cannot view it, and your visa filing needs a twelve month lease. Budget for a short-term rental bridge or plan a scouting trip.</span>
                </div>
              </section>

              {/* 4. RENTING REQUIREMENTS AND DEPOSITS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>Renting Requirements and Deposits</h2></div></div>
                <p className="lead">What a landlord will ask for, and what you are entitled to in return.</p>
                <div className="det-grid">
                  <div className="det"><div className="h">Deposit<span className="dtag ap">Upfront</span></div><div className="b">Typically <b>two months</b> deposit plus the first month in advance. Three months is common for foreign tenants without Portuguese income history.</div></div>
                  <div className="det"><div className="h">Guarantor (fiador)</div><div className="b">Many landlords ask for a Portuguese guarantor. If you cannot provide one, the usual substitute is <b>six to twelve months rent paid up front</b>, which is legal and common.</div></div>
                  <div className="det"><div className="h">Lease duration</div><div className="b">Minimum one year is standard, and your visa filing needs a <b>twelve month lease</b> anyway. Three and five year terms are available and give stronger protection.</div></div>
                  <div className="det"><div className="h">Documents landlords ask for</div><div className="b">NIF, passport, proof of income or employment contract, and often the previous three bank statements. The NIF is non-negotiable.</div></div>
                  <div className="det"><div className="h">Furnished vs unfurnished</div><div className="b">City apartments are frequently furnished, which suits a first year. Unfurnished usually means <b>no appliances and no light fixtures</b>, not just no sofa.</div></div>
                  <div className="det"><div className="h">Agency fees</div><div className="b">Paid by the landlord in most cases. If an agency asks you for a finder&apos;s fee on a standard rental, treat that as a warning sign.</div></div>
                  <div className="det"><div className="h">Tenant rights</div><div className="b">Rent increases are capped annually by a published coefficient. Eviction requires a court process. Your rights are stronger than in most US states.</div></div>
                  <div className="det"><div className="h">Contract registration</div><div className="b">The landlord must register the lease with the tax authority. <b>Insist on this.</b> An unregistered lease will not support your residency application.</div></div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>An unregistered lease is the most common filing failure.</b> Some landlords prefer to keep rentals off the books. That saves them tax and costs you your visa. Ask before you pay a deposit, not after.</span>
                </div>
                <div className="src"><span>Last verified: January 2026 · Novo Regime do Arrendamento Urbano, Autoridade Tributária guidance</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 5. SHARED LIVING AND ALTERNATIVES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Shared Living and Housing Alternatives</h2></div></div>
                <p className="lead">A twelve month lease is not the only way to have somewhere to live. These options cost less and commit you to less, but only two of the five will satisfy a residency filing on their own. Open any option for full detail.</p>

                <table className="tbl">
                  <thead><tr><th>Option</th><th className="num">Monthly cost</th><th className="num">Commitment</th><th className="num">Deposit or buy-in</th><th>Proof of address for filing</th></tr></thead>
                  <tbody>
                    <tr><td>Co-living house</td><td className="num">EUR 600–900</td><td className="num">1 month</td><td className="num">1 month</td><td>Not accepted alone</td></tr>
                    <tr><td>Room in a shared flat</td><td className="num">EUR 400–700</td><td className="num">6–12 months</td><td className="num">1–2 months</td><td>Only if you are named on the lease</td></tr>
                    <tr className="hi"><td>Village revival program</td><td className="num">EUR 150–400</td><td className="num">1–3 years</td><td className="num">Varies</td><td>Usually accepted</td></tr>
                    <tr className="hi"><td>Housing cooperative</td><td className="num">Below market</td><td className="num">Indefinite</td><td className="num">EUR 5k–40k share</td><td>Usually accepted</td></tr>
                    <tr><td>Intentional community</td><td className="num">Varies widely</td><td className="num">Open ended</td><td className="num">EUR 0–100k+</td><td>Rarely accepted</td></tr>
                  </tbody>
                </table>

                <div style={{height: '1px', background: 'var(--line)', margin: '20px 0'}}></div>

                {/* co-living */}
                <div className="route">
                  <span className="ic i-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20a7 7 0 0114 0M15 20a5.5 5.5 0 016-4.8" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Co-living houses</div><div className="route-desc">Private room, shared kitchen and workspace, bills and wifi included</div></div><span className="pill p-pop">Easiest landing</span></div>
                    <div className="route-meta"><span>EUR 600 to 900 / mo</span><span>1 month minimum</span><span>Lisbon, Porto, Ericeira, Lagos</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">An operator leases or owns a building and rents private bedrooms, with the kitchen, lounge, and usually a coworking room shared. Pricing is <b>all inclusive</b>: electricity, water, fibre, cleaning of common areas, and often a weekly events calendar. Agreements are membership style and roll month to month rather than running as a Portuguese tenancy.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">All in</div><div className="v">EUR 600–900</div></div>
                        <div className="rd-stat"><div className="l">Minimum stay</div><div className="v">1 month</div></div>
                        <div className="rd-stat"><div className="l">Deposit</div><div className="v">1 month</div></div>
                        <div className="rd-stat"><div className="l">Notice to leave</div><div className="v">30 days</div></div>
                      </div>
                      <span className="res-flag no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Not accepted as proof of address for a residency filing</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You are testing a city before committing</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You are arriving without a local network</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You need to land before a lease is signed</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You are moving with children</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need quiet for calls or deep work</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>This address has to support your filing</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">What to ask before you book</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Is there a cap on &quot;bills included&quot;?</b> Winter heating is where operators quietly add charges.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Can you get a written accommodation declaration?</b> Some operators will provide one, which helps even when the contract itself will not.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>What is the average length of stay?</b> A house full of one-week guests is a hostel with better furniture.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Video tour the actual room</b>, not the listing photos of the common areas.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* shared flat */}
                <div className="route">
                  <span className="ic i-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Room in a shared flat</div><div className="route-desc">The standard local arrangement, found through Idealista or Facebook groups</div></div><span className="pill p-best">Cheapest option</span></div>
                    <div className="route-meta"><span>EUR 400 to 700 / mo</span><span>Deposit 1 to 2 months</span><span>Every city</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">Two versions exist and they are not equivalent. In the first, <b>the landlord rents rooms individually</b> and you sign your own contract. In the second, an existing tenant sublets you a room and your relationship is with them, not the owner. The first is far safer and is the only one that can help your residency filing.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Rent</div><div className="v">EUR 400–700</div></div>
                        <div className="rd-stat"><div className="l">Typical term</div><div className="v">6–12 months</div></div>
                        <div className="rd-stat"><div className="l">Deposit</div><div className="v">1–2 months</div></div>
                        <div className="rd-stat"><div className="l">Notice</div><div className="v">30–60 days</div></div>
                      </div>
                      <span className="res-flag maybe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>Accepted only if you are named on a registered lease</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Cost is your first constraint</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You want daily Portuguese practice</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You are moving solo</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You are moving as a couple or family</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need the lease registered quickly</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You cannot view before signing</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">What to ask before you sign</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Am I on the contract, or subletting?</b> If subletting, you have no protection and no usable address.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Is the lease registered with the tax authority?</b> Ask for the registration proof, not a promise.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Who holds the deposit and how is it returned?</b> Get it in writing with a return timeline.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Search in Portuguese.</b> The same room is routinely 15 to 25% cheaper on Portuguese-language listings than on expat-facing ones.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* village revival */}
                <div className="route">
                  <span className="ic i-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M9 21v-8h6v8" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Village revival programs</div><div className="route-desc">Municipalities subsidising rent to bring residents to depopulating interior towns</div></div><span className="pill p-new">Underused</span></div>
                    <div className="route-meta"><span>EUR 150 to 400 / mo</span><span>Commitment terms apply</span><span>Interior and mountain regions</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">Individual municipalities, not the national government, offer renovated municipal housing at below-market rent, renovation grants, or business incentives to people who commit to living there. <b>There is no single national program</b>, so terms differ from one câmara municipal to the next and you apply locally. Many require you to register as a resident and some require you to work or open a business in the area.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Rent</div><div className="v">EUR 150–400</div></div>
                        <div className="rd-stat"><div className="l">Commitment</div><div className="v">1–3 years</div></div>
                        <div className="rd-stat"><div className="l">Deposit</div><div className="v">Varies by council</div></div>
                        <div className="rd-stat"><div className="l">Early exit</div><div className="v">Clawback possible</div></div>
                      </div>
                      <span className="res-flag yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Usually accepted, these are genuine registered leases</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Your income is fully remote</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Cost is the priority over convenience</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You will commit to learning Portuguese</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need a hospital or specialist nearby</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need international schooling</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You expect an English-speaking environment</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">What to verify before you apply</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>What happens if you leave early?</b> Some programs claw back the subsidy or renovation grant.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Test the internet at the address</b>, not the town average. Fibre coverage in the interior is uneven street by street.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Measure the drive</b> to the nearest hospital, secondary school, and airport before you accept.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Confirm the lease is registered</b> so it supports your residency filing.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* cooperative */}
                <div className="route">
                  <span className="ic i-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Cooperativa de habitação</div><div className="route-desc">Members collectively own the building and pay cost-based charges instead of market rent</div></div><span className="pill p-best">Cost stable</span></div>
                    <div className="route-meta"><span>Membership share required</span><span>Waitlists are long</span><span>Mostly Lisbon and Porto metro</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">A legally recognised cooperative under Portuguese law. Members buy a share, the cooperative develops or holds the building, and members pay <b>cost-based housing charges rather than market rent</b>. Because the charge covers maintenance and debt service instead of a landlord&apos;s return, housing cost stops tracking the rental market. That decoupling is the entire point, and it is why waitlists are long.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Share buy-in</div><div className="v">EUR 5k–40k+</div></div>
                        <div className="rd-stat"><div className="l">Monthly charge</div><div className="v">Below market</div></div>
                        <div className="rd-stat"><div className="l">Waitlist</div><div className="v">2–8 years</div></div>
                        <div className="rd-stat"><div className="l">Exit</div><div className="v">Share sold back</div></div>
                      </div>
                      <span className="res-flag yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Usually accepted where you hold a registered occupancy title</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You intend to stay permanently</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You want housing cost that stops rising</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You can wait years for a place</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You are moving within twelve months</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You may leave within five years</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need the capital to stay liquid</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">Before you transfer any money</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Read the statutes.</b> They govern everything, including whether non-residents and foreign nationals can be members at all.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Ask how the share is valued on exit</b> and how long repayment takes. Some return the nominal value years later, not the market value.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Confirm the cooperative is properly registered</b> and ask to see recent accounts and the maintenance reserve.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Have a Portuguese lawyer review</b> before signing. This is a capital commitment, not a lease.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* intentional communities */}
                <div className="route">
                  <span className="ic i-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M4 7l8-5 8 5" /><path d="M4 7v10l8 5 8-5V7" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Intentional communities and ecovillages</div><div className="route-desc">Shared land and infrastructure with agreed governance, usually after a trial residency</div></div><span className="pill p-cx">Vet carefully</span></div>
                    <div className="route-meta"><span>Trial stay 1 to 3 months</span><span>Buy-in varies widely</span><span>Alentejo, Beira interior</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">Private groups sharing land, buildings, and infrastructure under an agreed governance structure. The legal form varies enormously: some are registered associations or cooperatives, some are companies, and some are <b>informal arrangements with no legal wrapper at all</b>. That variation is the risk. Most ask for a trial residency of one to three months before offering membership.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Trial stay</div><div className="v">1–3 months</div></div>
                        <div className="rd-stat"><div className="l">Buy-in</div><div className="v">EUR 0–100k+</div></div>
                        <div className="rd-stat"><div className="l">Legal form</div><div className="v">Varies widely</div></div>
                        <div className="rd-stat"><div className="l">Exit terms</div><div className="v">Often unwritten</div></div>
                      </div>
                      <span className="res-flag no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Rarely accepted, most cannot issue a registrable individual lease</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You share the community&apos;s stated values</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Your residency is already settled</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You want shared land and infrastructure</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Your filing depends on this address</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You value privacy and autonomy</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You may need your capital back quickly</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">Vetting checklist</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Whose name is on the land title?</b> If the answer is one founder rather than an entity, you are a guest, not a member.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Get exit terms and capital return in writing</b> before transferring anything. This is where these arrangements most often go wrong.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Do the trial stay in winter.</b> Rural Portugal in February is a different proposition from rural Portugal in July.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Ask how decisions are made and who can be removed</b>, and by what process.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Talk to people who left</b>, not only people who stayed. Ask the community for those names and note how they react.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Sequence matters more than price here.</b> If your residency filing is still open, choose an option that produces a registered lease. Once the residence card is in hand, the cheaper and more communal options open up without putting your status at risk.</span>
                </div>
                <div className="src"><span>Last verified: January 2026 · Código Cooperativo, municipal housing programs, operator-published terms</span><span className="sbadge rev">Editorially reviewed</span></div>
              </section>

              {/* 6. HOME OWNERSHIP */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Home Ownership and Buying Rules</h2></div></div>
                <div className="callout info" style={{marginTop: '0', marginBottom: '16px'}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Buying property does not grant residency.</b> The golden visa route closed to residential real estate. Buy because you want the home, not because you want the paperwork. See Move There for the routes that actually lead to residency.</span>
                </div>
                <div className="det-grid">
                  <div className="det"><div className="h">Who can buy</div><div className="b">Anyone. <b>No nationality restriction</b>, no residency requirement, no minimum spend, no approval process.</div></div>
                  <div className="det"><div className="h">Order of operations</div><div className="b">NIF, then bank account, then purchase. That sequence does not bend, and the NIF can take a week or two to obtain remotely.</div></div>
                  <div className="det"><div className="h">Closing costs</div><div className="b">Budget <b>7 to 10% on top</b> of the price: IMT transfer tax, stamp duty, notary, land registry, and legal fees.</div></div>
                  <div className="det"><div className="h">Mortgages for non-residents</div><div className="b">Expect <b>60 to 70% loan to value</b> and a higher rate than a resident would get. Residents can often reach 80 to 90%.</div></div>
                  <div className="det"><div className="h">Annual property tax (IMI)</div><div className="b">Roughly 0.3% to 0.45% of the rateable value each year, set by the municipality. Substantially lower than typical US property tax.</div></div>
                  <div className="det"><div className="h">Short-term rental licensing</div><div className="b">Alojamento Local licences are <b>restricted or frozen</b> in parts of Lisbon and Porto. Do not assume you can offset the mortgage with tourist lets.</div></div>
                  <div className="det"><div className="h">Surveys and legal check</div><div className="b">Instruct an independent lawyer. Verify the caderneta predial, licence of use, and that no debts attach to the property, since they follow the property.</div></div>
                  <div className="det"><div className="h">Selling later</div><div className="b">Capital gains apply, with relief if you reinvest in another main residence in the EU. Non-residents are taxed differently, so plan before you buy.</div></div>
                </div>
                <div className="divider" style={{height: '1px', background: 'var(--line)', margin: '22px 0'}}></div>
                <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg></span>Typical purchase prices</div>
                <table className="tbl">
                  <thead><tr><th>Area</th><th className="num">2 bed apartment</th><th className="num">Price per m²</th><th className="num">Closing costs at 8.5%</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Lisbon central</td><td className="num">EUR 480,000</td><td className="num">EUR 5,600</td><td className="num">EUR 40,800</td></tr>
                    <tr><td>Lisbon outer</td><td className="num">EUR 295,000</td><td className="num">EUR 3,300</td><td className="num">EUR 25,100</td></tr>
                    <tr><td>Porto</td><td className="num">EUR 310,000</td><td className="num">EUR 3,400</td><td className="num">EUR 26,400</td></tr>
                    <tr><td>Braga</td><td className="num">EUR 185,000</td><td className="num">EUR 1,900</td><td className="num">EUR 15,700</td></tr>
                    <tr><td>Interior village</td><td className="num">EUR 95,000</td><td className="num">EUR 850</td><td className="num">EUR 8,100</td></tr>
                  </tbody>
                </table>
                <div className="src"><span>Last verified: January 2026 · Confidencial Imobiliário, Autoridade Tributária, IMT schedules</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 7. UTILITIES, INTERNET, TRANSPORT */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">7</span><h2>Utilities, Internet, and Transportation Costs</h2></div></div>
                <p className="lead">Running costs for a couple in a 2 bed apartment. Service quality and walkability are covered under Lifestyle &amp; Community, this section is the money only.</p>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg></span>Utilities and connectivity</div>
                    <table className="tbl">
                      <thead><tr><th>Service</th><th>Notes</th><th className="num">Monthly</th></tr></thead>
                      <tbody>
                        <tr><td>Electricity</td><td>Doubles in winter without central heating</td><td className="num">EUR 45–110</td></tr>
                        <tr><td>Water</td><td>Billed by the municipality</td><td className="num">EUR 20–35</td></tr>
                        <tr><td>Gas</td><td>Bottled or piped depending on the building</td><td className="num">EUR 15–35</td></tr>
                        <tr><td>Building charge</td><td>Condomínio, shared upkeep</td><td className="num">EUR 20–60</td></tr>
                        <tr className="hi"><td>Fibre internet</td><td>500 Mbps to 1 Gbps, widely available</td><td className="num">EUR 30–45</td></tr>
                        <tr><td>Mobile, per line</td><td>Generous data, cheap by US standards</td><td className="num">EUR 10–20</td></tr>
                      </tbody>
                    </table>
                    <div className="callout warn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                      <span><b>Winter electricity is the surprise line item.</b> Central heating is rare, so most households run portable heaters and dehumidifiers from December through March. Budget double.</span>
                    </div>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 16V9l2-4h12l2 4v7M4 16h16" /><circle cx="8" cy="13" r="1.2" /><circle cx="16" cy="13" r="1.2" /></svg></span>Getting around</div>
                    <table className="tbl">
                      <thead><tr><th>Mode</th><th>Notes</th><th className="num">Cost</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td>Monthly transit pass</td><td>Metro, bus, tram, capped fare in most metros</td><td className="num">EUR 40 / mo</td></tr>
                        <tr><td>Single fare</td><td>Cheaper with a rechargeable card</td><td className="num">EUR 1.65</td></tr>
                        <tr><td>Intercity rail</td><td>Lisbon to Porto, booked ahead</td><td className="num">EUR 25–45</td></tr>
                        <tr><td>Rideshare</td><td>Bolt and Uber, cross-town trip</td><td className="num">EUR 7–14</td></tr>
                        <tr><td>Fuel</td><td>Per litre, roughly triple US prices per gallon</td><td className="num">EUR 1.75</td></tr>
                        <tr><td>Car ownership</td><td>Insurance, tax, tolls, parking, for one car</td><td className="num">EUR 180–320 / mo</td></tr>
                      </tbody>
                    </table>
                    <div className="callout ok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>
                      <span><b>Lisbon and Porto are genuinely car-free livable.</b> Dropping a car saves roughly EUR 200 a month and is the easiest large cut available if you choose a city over the interior.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. UPFRONT MOVING COSTS */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">8</span><h2>Common Upfront Moving Costs</h2></div>
                  <a className="sec-link" href="#">See the filing steps <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
                </div>
                <p className="lead">The one-time number is what most people underestimate. This is what you need saved <b>before</b> you file, not after you land.</p>
                <table className="tbl">
                  <thead><tr><th>Cost</th><th>What it covers</th><th className="num">Typical</th></tr></thead>
                  <tbody>
                    <tr><td>Visa fees and legalisation</td><td>Consulate fees, apostilles, certified translations</td><td className="num">$1,100</td></tr>
                    <tr><td>Immigration lawyer</td><td>Optional, flat fee for a D8 filing</td><td className="num">$2,200</td></tr>
                    <tr><td>Flights, two adults</td><td>One way, off peak</td><td className="num">$1,300</td></tr>
                    <tr className="hi"><td>Rental deposit and first month</td><td>Two to three months up front is standard</td><td className="num">$4,800</td></tr>
                    <tr><td>Shipping or replacing goods</td><td>Most people replace rather than ship</td><td className="num">$2,500</td></tr>
                    <tr><td>First year health insurance</td><td>Required for the filing, two adults</td><td className="num">$1,900</td></tr>
                    <tr><td>Proof of funds held in account</td><td>Not spent, but must sit in a Portuguese account</td><td className="num">$11,400</td></tr>
                    <tr><td>Pet relocation, if applicable</td><td>Vet, microchip, EU certificate, cabin or cargo</td><td className="num">$1,200</td></tr>
                  </tbody>
                </table>
                <div className="tl-total">
                  <span><span className="k">Cash actually spent</span><br /><span className="v">$15,000</span></span>
                  <span><span className="k">Plus funds that must be held</span><br /><span className="v">$11,400</span></span>
                  <span><span className="k">Six month landing runway</span><br /><span className="v">$14,200</span></span>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Plan for roughly $29,000 available at filing</b> for a couple on the D8 route, of which about half is spent and half is held as proof of funds. The runway matters because your residence card can take months to arrive and some work and banking options stay closed until it does.</span>
                </div>
                <div className="src"><span>Last verified: January 2026 · Consular fee schedules, resident-reported relocation budgets</span><span className="sbadge rev">Editorially reviewed</span></div>
              </section>
            </div>
  )
}
