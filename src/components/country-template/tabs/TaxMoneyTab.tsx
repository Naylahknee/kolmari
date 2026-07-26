import type { CountryContent } from '@/lib/country-workspace/country-content'

/* Converted from the approved index.html mockup. Markup is verbatim.
   Content is still literal Portugal copy: replace with `content.*` per
   section as the model is extended. See README step 4. */
export function TaxMoneyTab({ slug }: { slug: string }) {
  return (
      <div className="tabpanel" id="p-money">

              {/* 1. ESTIMATOR */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">1</span><h2>What You Would Actually Pay</h2></div>
                  <span className="pill p-new">Estimate, not advice</span>
                </div>
                <p className="lead">Move the slider and pick your situation. Everything below updates live. These are planning estimates built on published rates, not a tax return.</p>

                <div className="calc">
                  <div>
                    <div className="ctrl">
                      <label className="cl" htmlFor="tmIncome"><span className="cn">Annual gross income</span><span className="cv nu" id="tmIncomeOut">EUR 60,000</span></label>
                      <input type="range" id="tmIncome" min="10000" max="200000" step="1000" value="60000" aria-describedby="tmIncomeHelp" />
                      <div className="ticks"><span>10k</span><span>60k</span><span>110k</span><span>160k</span><span>200k</span></div>
                      <p className="ch" id="tmIncomeHelp">Gross, before any tax. Convert US income at roughly 0.92 euro to the dollar.</p>
                    </div>

                    <div className="ctrl">
                      <div className="cl"><span className="cn">How you earn it</span></div>
                      <div className="seg full" role="group" aria-label="Income type">
                        <button data-tmmode="employee" aria-pressed="false">Employed</button>
                        <button data-tmmode="self" aria-pressed="true">Self-employed</button>
                        <button data-tmmode="passive" aria-pressed="false">Pension or passive</button>
                      </div>
                      <p className="ch">Self-employed covers freelancers and remote contractors invoicing from Portugal.</p>
                    </div>

                    <div className="ctrl">
                      <div className="cl"><span className="cn">Tax regime</span></div>
                      <div className="seg full" role="group" aria-label="Tax regime">
                        <button data-tmreg="standard" aria-pressed="true">Standard rates</button>
                        <button data-tmreg="ifici" aria-pressed="false">IFICI flat 20%</button>
                      </div>
                      <p className="ch" id="tmRegHelp">IFICI replaced the old NHR scheme. It applies a flat rate to qualifying professions for up to ten years, and eligibility is narrow.</p>
                    </div>
                  </div>

                  <div>
                    <div className="res">
                      <div className="kpi big"><div className="k">Estimated net, after Portuguese tax</div><div className="v nu" id="tmNet">EUR 0</div><div className="n nu" id="tmNetMo">EUR 0 per month</div></div>
                      <div className="kpi"><div className="k">Income tax (IRS)</div><div className="v nu" id="tmIrs">EUR 0</div><div className="n nu" id="tmIrsRate">0% effective</div></div>
                      <div className="kpi"><div className="k">Social security</div><div className="v nu" id="tmSs">EUR 0</div><div className="n nu" id="tmSsNote">Contribution rate</div></div>
                    </div>

                    <div className="subh" style={{marginTop: '18px'}}>Where your income lands in the bands</div>
                    <div className="brk" id="tmBrk">
                    <span className="brk-seg" data-lo="0" data-hi="8059" style={{flex: '0 0 8.06%', background: '#fbe58a'}}>13%</span>
                    <span className="brk-seg" data-lo="8059" data-hi="12160" style={{flex: '0 0 4.10%', background: '#f7d05a'}}>16.5%</span>
                    <span className="brk-seg" data-lo="12160" data-hi="17233" style={{flex: '0 0 5.07%', background: '#f3c516'}}>22%</span>
                    <span className="brk-seg" data-lo="17233" data-hi="22306" style={{flex: '0 0 5.07%', background: '#e8b90f'}}>25%</span>
                    <span className="brk-seg" data-lo="22306" data-hi="28400" style={{flex: '0 0 6.09%', background: '#dfae0e'}}>32%</span>
                    <span className="brk-seg" data-lo="28400" data-hi="41629" style={{flex: '0 0 13.23%', background: '#d9a00c'}}>35.5%</span>
                    <span className="brk-seg" data-lo="41629" data-hi="44987" style={{flex: '0 0 3.36%', background: '#c99a00'}}>43.5%</span>
                    <span className="brk-seg" data-lo="44987" data-hi="83696" style={{flex: '0 0 38.71%', background: '#b98a00'}}>45%</span>
                    <span className="brk-seg" data-lo="83696" data-hi="100000" style={{flex: '0 0 16.30%', background: '#a87f00'}}>48%</span>
                    </div>
                    <div className="brk-axis">
                    <span style={{flex: '0 0 8.06%'}}>8k</span>
                    <span style={{flex: '0 0 4.10%'}}>12k</span>
                    <span style={{flex: '0 0 5.07%'}}>17k</span>
                    <span style={{flex: '0 0 5.07%'}}>22k</span>
                    <span style={{flex: '0 0 6.09%'}}>28k</span>
                    <span style={{flex: '0 0 13.23%'}}>41k</span>
                    <span style={{flex: '0 0 3.36%'}}>44k</span>
                    <span style={{flex: '0 0 38.71%'}}>83k</span>
                    <span style={{flex: '0 0 16.30%'}}>100k+</span>
                    </div>
                    <p className="brk-you nu" id="tmBrkNote">Highlighted bands are the ones your income passes through.</p>

                    <div className="callout info nu" id="tmUs"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg><span></span></div>
                  </div>
                </div>
                <div className="src"><span>Rates indexed annually and shown for illustration. Confirm current bands with a cross-border accountant before acting on any figure here.</span><span className="sbadge rev">Editorially reviewed</span></div>
              </section>

              {/* 2. TAX RESIDENCY */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">2</span><h2>Tax Residency</h2></div></div>
                <p className="lead">Residency for immigration and residency for tax are two different tests, and confusing them is the most expensive mistake on this page.</p>
                <div className="ladder">
                  <div className="lad"><div className="lad-rail"><span className="lad-dot">1</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-when">Under 183 days</div><div className="lad-t">Non-resident</div><div className="lad-d">Portugal taxes only Portuguese-source income. Your worldwide income stays outside the Portuguese net.</div></div></div>
                  <div className="lad"><div className="lad-rail"><span className="lad-dot">2</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-when">183 days or more</div><div className="lad-t">Tax resident</div><div className="lad-d">Portugal taxes your <b>worldwide income</b>, wherever it is earned or held. Days do not need to be consecutive.</div><div className="lad-tags"><span className="lad-tag">Rolling 12 months</span></div></div></div>
                  <div className="lad"><div className="lad-rail"><span className="lad-dot">3</span><span className="lad-line"></span></div><div className="lad-body"><div className="lad-when">Alternative test</div><div className="lad-t">Habitual residence</div><div className="lad-d">Fewer than 183 days can still make you resident if you keep a home here in a way that implies you intend to live in it.</div></div></div>
                  <div className="lad goal"><div className="lad-rail"><span className="lad-dot"><svg width="13" height="13" strokeWidth="2.6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span></div><div className="lad-body"><div className="lad-when">Either way</div><div className="lad-t">The US still wants a return</div><div className="lad-d">Citizenship-based taxation means you file with the IRS every year regardless of where you live or what Portugal collects.</div><div className="lad-tags"><span className="lad-tag">Every year</span><span className="lad-tag">No exceptions</span></div></div></div>
                </div>
                <div className="callout warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>The arrival-year split matters.</b> Landing in July rather than June can change whether your first calendar year is taxed as resident or non-resident, and with it how a large one-off payment is treated. If you have a bonus, a sale, or an exercise coming, get advice on the date before you book the flight.</span></div>
              </section>

              {/* 3. INCOME TAX */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>Income Tax and Special Regimes</h2></div></div>
                <div className="two">
                  <div>
                    <div className="subh">How Portuguese IRS works</div>
                    <ul className="rd-list">
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Progressive, in nine bands.</b> Each band taxes only the slice of income inside it, exactly like US federal brackets.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>A solidarity surcharge</b> adds 2.5% above roughly EUR 80,000 and 5% above EUR 250,000.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Joint or separate filing</b> for married couples. Joint can help sharply where incomes are uneven.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Deductions</b> for dependents, health, education, housing, and general expenses, most captured automatically through NIF-linked receipts.</li>
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><b>Top rates arrive early.</b> The 45% band starts near EUR 84,000, which is far lower than the equivalent US threshold.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="subh">The IFICI regime, formerly NHR</div>
                    <p className="rd-p">The old Non-Habitual Resident scheme closed to new entrants. Its replacement, <b>IFICI</b>, offers a flat 20% rate on qualifying Portuguese-source employment and self-employment income for up to ten years, and favourable treatment of some foreign income.</p>
                    <p className="rd-p" style={{marginTop: '10px'}}>The catch is eligibility. It targets <b>scientific research, innovation, higher education, and certified startup or investment activity</b> rather than remote work generally. Many arrivals assume they qualify and do not.</p>
                    <div className="callout warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Do not build your budget on IFICI until someone has confirmed you qualify.</b> Toggle it off in the estimator above to see what standard rates actually look like, and treat that as your baseline.</span></div>
                  </div>
                </div>
              </section>

              {/* 4. US OBLIGATIONS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>What the US Still Wants</h2></div></div>
                <p className="lead">The United States is one of very few countries that taxes citizens on worldwide income regardless of residence. Moving does not end your filing obligation, it complicates it.</p>
                <div className="gb-grid">
                  <div className="gb"><div className="h">Annual return</div>
                    <div className="dual-row"><span className="dl">Simplicity</span><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Straightforward"><i></i><i></i><i></i><i></i></span><span className="mlab">Straightforward</span></div>
                    <div className="dual-row"><span className="dl">Cost to you</span><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Usually nothing owed"><i></i><i></i><i></i><i></i></span><span className="mlab">Usually nothing owed</span></div>
                    <div className="b">You file every year. Most expats owe nothing, but the return is not optional.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Filing deadlines shift automatically for those living abroad, with a further extension available on request. Not filing is what creates problems, not owing.</p></div></div>
                  <div className="gb"><div className="h">Foreign Earned Income Exclusion</div>
                    <div className="dual-row"><span className="dl">Simplicity</span><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Straightforward"><i></i><i></i><i></i><i></i></span><span className="mlab">Straightforward</span></div>
                    <div className="dual-row"><span className="dl">Cost to you</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Large relief"><i></i><i></i><i></i><i></i></span><span className="mlab">Large relief</span></div>
                    <div className="b">Excludes roughly the first $130,000 of <b>earned</b> income if you meet a presence test.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">The exclusion applies to wages and self-employment income, never to pensions, dividends, interest, or capital gains. You must meet either the physical presence test or the bona fide residence test, and you have to claim it actively on Form 2555.</p></div></div>
                  <div className="gb"><div className="h">Foreign Tax Credit</div>
                    <div className="dual-row"><span className="dl">Simplicity</span><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Fiddly"><i></i><i></i><i></i><i></i></span><span className="mlab">Fiddly</span></div>
                    <div className="dual-row"><span className="dl">Cost to you</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Large relief"><i></i><i></i><i></i><i></i></span><span className="mlab">Large relief</span></div>
                    <div className="b">Credits Portuguese tax paid against US tax owed. Often better than the exclusion.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Because Portuguese rates commonly exceed US rates at the same income, the credit frequently wipes out the US liability entirely and can build a carryforward. It also works on passive and pension income, where the exclusion does not, which is why retirees usually rely on it instead.</p></div></div>
                  <div className="gb"><div className="h">Self-employment tax</div>
                    <div className="dual-row"><span className="dl">Simplicity</span><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Fiddly"><i></i><i></i><i></i><i></i></span><span className="mlab">Fiddly</span></div>
                    <div className="dual-row"><span className="dl">Cost to you</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Often eliminated"><i></i><i></i><i></i><i></i></span><span className="mlab">Often eliminated</span></div>
                    <div className="b">The US and Portugal have a totalization agreement, which prevents paying into both systems.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Without an agreement, self-employed Americans abroad owe 15.3% US self-employment tax even when the FEIE zeroes their income tax. The totalization agreement means paying into Portuguese social security exempts you, but you need a certificate of coverage as evidence.</p></div></div>
                  <div className="gb"><div className="h">FBAR</div>
                    <div className="dual-row"><span className="dl">Simplicity</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Simple"><i></i><i></i><i></i><i></i></span><span className="mlab">Simple</span></div>
                    <div className="dual-row"><span className="dl">Cost to you</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="No cost, high penalty"><i></i><i></i><i></i><i></i></span><span className="mlab">No cost, high penalty</span></div>
                    <div className="b">Report foreign accounts if the combined peak balance passes $10,000 at any point.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">It is an information report, not a tax, and it is filed separately from your return. The threshold is aggregate across all accounts and it is measured at the highest balance during the year, not on 31 December. Penalties for missing it are severe and wildly out of proportion to the effort of filing.</p></div></div>
                  <div className="gb"><div className="h">State residency<span className="gapflag">Gap</span></div>
                    <div className="dual-row"><span className="dl">Simplicity</span><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="Messy"><i></i><i></i><i></i><i></i></span><span className="mlab">Messy</span></div>
                    <div className="dual-row"><span className="dl">Cost to you</span><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Can be costly"><i></i><i></i><i></i><i></i></span><span className="mlab">Can be costly</span></div>
                    <div className="b">Some states keep taxing you until you clearly cut ties.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">States vary enormously. A few release you on departure, others look for evidence that you have severed domicile: driver licence, voter registration, property, bank accounts, mailing address. Handle this deliberately in the year you leave rather than discovering it two years later.</p></div></div>
                </div>
              </section>

              {/* 5. EVERYDAY TAXES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Everyday and Property Taxes</h2></div></div>
                <table className="tbl">
                  <thead><tr><th>Tax</th><th className="num">Rate</th><th>When it hits you</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>VAT (IVA), standard</td><td className="num">23%</td><td>Built into displayed prices. You never add it at the till</td></tr>
                    <tr><td>VAT, intermediate</td><td className="num">13%</td><td>Restaurant meals, some food, wine</td></tr>
                    <tr><td>VAT, reduced</td><td className="num">6%</td><td>Staple groceries, medicines, transport, books</td></tr>
                    <tr><td>IMI, property</td><td className="num">0.3–0.45%</td><td>Annual, on rateable value, set by your municipality</td></tr>
                    <tr><td>IMT, property transfer</td><td className="num">0–7.5%</td><td>One-off on purchase, sliding with price</td></tr>
                    <tr><td>Stamp duty</td><td className="num">0.8%</td><td>On purchase, and on some financial transactions</td></tr>
                    <tr><td>IUC, vehicle</td><td className="num">Varies</td><td>Annual road tax, by engine size, emissions, and age</td></tr>
                    <tr><td>Capital gains, property</td><td className="num">Partly taxed</td><td>Relief if you reinvest in a main residence in the EU</td></tr>
                  </tbody>
                </table>
                <div className="callout ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><span><b>Sales tax is already in the price.</b> The shelf price is the price you pay, and restaurant bills carry no expected tip on top. After the US, this makes everyday spending feel more predictable than the headline VAT rate suggests.</span></div>
              </section>

              {/* 6. BANKING */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Banking, Currency, and Moving Money</h2></div></div>
                <div className="two">
                  <div>
                    <div className="subh">Opening an account</div>
                    <table className="tbl">
                      <thead><tr><th>Step</th><th className="num">Difficulty</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td>NIF, obtained remotely</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Easy"><i></i><i></i><i></i><i></i></span><span className="mlab">Easy</span></td></tr>
                        <tr><td>Digital account (Revolut, Wise)</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Very easy"><i></i><i></i><i></i><i></i></span><span className="mlab">Very easy</span></td></tr>
                        <tr><td>Traditional bank, in person</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Manageable"><i></i><i></i><i></i><i></i></span><span className="mlab">Manageable</span></td></tr>
                        <tr><td>Traditional bank, from abroad</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Slow"><i></i><i></i><i></i><i></i></span><span className="mlab">Slow</span></td></tr>
                        <tr className="hi"><td>Mortgage as a non-resident</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="Hard"><i></i><i></i><i></i><i></i></span><span className="mlab">Hard</span></td></tr>
                        <tr><td>Credit card with local history</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Slow"><i></i><i></i><i></i><i></i></span><span className="mlab">Slow</span></td></tr>
                      </tbody>
                    </table>
                    <p className="note">Bring passport, NIF, proof of address, and proof of income. Millennium BCP, Santander, Novo Banco, and Caixa Geral all handle foreign clients routinely.</p>
                  </div>
                  <div>
                    <div className="subh">Currency and transfers</div>
                    <ul className="rd-list">
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Multibanco does more than an ATM.</b> Bills, taxes, fines, tickets, top-ups. MB Way puts the same network on your phone and is how people split a restaurant bill.</li>
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><b>Never let your US bank do the conversion.</b> Wire transfers with built-in FX routinely cost 3 to 4%. On a EUR 50,000 transfer that is a EUR 2,000 difference.</li>
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Use a dedicated FX provider</b> for anything large. Wise, Revolut, and specialist brokers quote a visible spread instead of hiding it in the rate.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Credit works differently.</b> Portuguese lending leans on income documentation and existing relationship rather than a score. Your US credit history does not travel.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Keep one US account open.</b> Useful for IRS refunds, US card payments, and anything that refuses a foreign IBAN.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 7. RETIREMENT */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">7</span><h2>Retirement, Pensions, and Social Security</h2></div></div>
                <div className="det-grid">
                  <div className="det"><div className="h">US Social Security abroad</div><div className="b">Benefits are <b>payable into a Portuguese account</b> and are not reduced for living overseas. Portugal may tax them as resident income, and the tax treaty determines which country has the primary claim.</div></div>
                  <div className="det"><div className="h">Totalization agreement</div><div className="b">The US and Portugal have one. It stops you contributing to both systems on the same income and lets you <b>combine credits from both</b> when qualifying for a benefit in either.</div></div>
                  <div className="det"><div className="h">401(k) and IRA</div><div className="b">Distributions are generally taxable in your country of residence once you are resident here. <b>Portugal does not mirror US tax-advantaged status</b>, so the treatment can differ from what you planned around.</div></div>
                  <div className="det"><div className="h">Roth accounts</div><div className="b">The tax-free character is a US concept. Whether Portugal recognises it is not automatic, and this is the single most common unpleasant surprise for retirees. <b>Get this checked specifically.</b></div></div>
                  <div className="det"><div className="h">Portuguese social security</div><div className="b">Employees contribute 11% with the employer adding 23.75%. Self-employed residents pay a rate applied to a portion of income, with an <b>exemption in the first twelve months</b> of activity.</div></div>
                  <div className="det"><div className="h">Qualifying for a Portuguese pension</div><div className="b">Requires a contributions record built over years. Most people arriving mid-career or later will draw primarily on their home system, using totalization to bridge gaps.</div></div>
                </div>
                <div className="callout warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Retirees have the harder tax position, not the easier one.</b> The Foreign Earned Income Exclusion does not touch pensions, dividends, or capital gains, so the foreign tax credit carries the whole load. If your income is mostly passive, model it properly before you commit to a move date.</span></div>
              </section>

              {/* 8. SETUP SEQUENCE */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">8</span><h2>Financial Setup Sequence</h2></div>
                  <span className="acc-count" id="finCount">0 / 8 done</span>
                </div>
                <p className="lead">In order. Each step unlocks the next, and skipping ahead is what causes the delays people blame on bureaucracy.</p>
                <div className="doc-g">
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Get your NIF</span><span className="st-d">Portuguese tax number. Obtainable remotely through a fiscal representative.</span><span className="st-tag">Do this first</span></span></button>
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Open a Portuguese bank account</span><span className="st-d">Millennium BCP, Santander, or a digital bridge like Revolut.</span><span className="st-tag">Needs NIF</span></span></button>
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Move your proof-of-funds balance in</span><span className="st-d">It has to sit in a Portuguese account before your appointment.</span><span className="st-tag">Before filing</span></span></button>
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Register for MB Way</span><span className="st-d">Puts the Multibanco network on your phone. Used for almost everything.</span><span className="st-tag">Week one</span></span></button>
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Get your NISS</span><span className="st-d">Social security number. Required to invoice, employ, or be employed.</span><span className="st-tag">After landing</span></span></button>
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Register on the Portal das Finanças</span><span className="st-d">Your tax portal login. Everything from invoices to filings runs through it.</span><span className="st-tag">After landing</span></span></button>
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">Appoint an accountant if self-employed</span><span className="st-d">A contabilista certificado is effectively mandatory for anything beyond simple filing.</span><span className="st-tag">Before first invoice</span></span></button>
                  <button className="step"><span className="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg></span><span><span className="st-t">File your first US return as a resident abroad</span><span className="st-d">Form 2555 or 1116, plus FBAR if your accounts cross the threshold.</span><span className="st-tag">Next April</span></span></button>
                </div>
                <div className="callout info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg><span><b>Proof of funds is held, not spent.</b> Most routes want savings sitting in a Portuguese account before your appointment. Budget it as locked capital rather than money you can move mid-process. Figures are in <a href="#" style={{textDecoration: 'underline', fontWeight: '700'}}>Cost &amp; Housing, section 8</a>.</span></div>

                <div className="subh" style={{marginTop: '20px'}}>Official portals</div>
                <div className="links">
                  <a className="lnk" href="https://www.portaldasfinancas.gov.pt" target="_blank" rel="noopener noreferrer">Portal das Finanças <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.seg-social.pt" target="_blank" rel="noopener noreferrer">Segurança Social <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.irs.gov/individuals/international-taxpayers" target="_blank" rel="noopener noreferrer">IRS international taxpayers <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://bsaefiling.fincen.treas.gov" target="_blank" rel="noopener noreferrer">FBAR e-filing <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                </div>
                <div className="src"><span>Last verified: January 2026 · Autoridade Tributária, Segurança Social, IRS Publication 54, US-Portugal totalization agreement. Planning information, not tax advice.</span><span className="sbadge">Official source verified</span></div>
              </section>
            </div>
  )
}
