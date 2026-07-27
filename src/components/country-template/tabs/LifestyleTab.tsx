import { getCountryContent } from '@/lib/country-workspace/country-content'

/* Data-driven Lifestyle & Community tab.

   Portugal retains the approved index.html mockup verbatim: its month-by-month
   climate bars, per-city walkability meters, dual-scored inclusion grid, A2
   timeline and euro price tables are REAL Portugal figures held in the editorial
   model. No other country has that structured data, and the shared content model
   (DailyLifeContent / TransportationContent / GreenbookSection) only carries prose
   fields — so those widgets cannot be re-driven per country without fabricating
   numbers. Per AGENTS.md we never fabricate country data.

   Every other country therefore renders an honest layout built strictly from the
   prose fields that exist in `content`. Structured widgets with no backing field
   are omitted rather than shown with Portugal's values. */
export function LifestyleTab({ slug }: { slug: string }) {
  const content = getCountryContent(slug)
  if (!content) return null
  const daily = content.dailyLife
  const transport = content.transportation
  const greenbook = content.greenbook

  if (content.slug === 'portugal') {
    return (
      <div className="tabpanel on" id="p-life">

              {/* 1. THE CULTURE SHIFT */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">1</span><h2>The Culture Shift</h2></div>
                  <a className="sec-link" href="/nextinations/portugal/v2/overview">Lifestyle summary <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
                </div>
                <p className="lead">Not a list of facts about Portugal. A list of the things you currently do automatically that will land differently here.</p>
                <table className="tbl contrast">
                  <thead><tr><th>What you are used to</th><th></th><th>What happens here</th></tr></thead>
                  <tbody>
                    <tr><td>Small talk with strangers is friendly</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Reserve first. Warmth arrives with recognition, not on arrival</td></tr>
                    <tr><td>First names straight away</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Senhor and senhora, and formal <i>você</i> until invited otherwise</td></tr>
                    <tr><td>Handshake, or a wave</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Two kisses, right cheek first. Handshakes between men</td></tr>
                    <tr><td>Dinner at 6 or 7</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Dinner at 8, frequently 9 or later</td></tr>
                    <tr><td>Lunch is a sandwich at your desk</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Lunch is the main meal and it stops the day</td></tr>
                    <tr><td>Large coffee, to go</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>A <i>bica</i> at the counter, under a euro, ninety seconds</td></tr>
                    <tr><td>Tip 18 to 20 percent</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Round up, or five percent. More is unusual</td></tr>
                    <tr><td>Spot a problem, fix the problem</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Spot a problem, complain about it together. Joining in reads as belonging</td></tr>
                    <tr><td>Sunday is for errands</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Sunday is genuinely quiet and much is closed</td></tr>
                    <tr><td>On time is respect</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>On time for work. Exactly on time to a dinner party is awkward</td></tr>
                    <tr><td>Sports allegiance is optional</td><td><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></td><td>Benfica, Sporting, or Porto. Having an answer is social currency</td></tr>
                  </tbody>
                </table>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Saudade</b> is the one word worth learning early. Roughly a longing for something absent, it runs through fado, literature, and ordinary conversation, and it tells you more about the emotional register here than any etiquette rule.</span>
                </div>
              </section>

              {/* 2. CLIMATE */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">2</span><h2>Climate Through the Year</h2></div></div>
                <p className="lead">Lisbon by month. Bars are average daytime high, the strip underneath is relative rainfall. <b style={{color: 'var(--teal-deep)'}}>Teal months</b> are what residents consider the best time to be here.</p>
                <div className="months">
                  <div className="mo">
                    <div className="mo-col"><span className="mo-t">15°</span><span className="mo-bar" style={{height: '25%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '88%'}}></i></div>
                    <div className="mo-l">Jan</div>
                  </div>
                  <div className="mo">
                    <div className="mo-col"><span className="mo-t">16°</span><span className="mo-bar" style={{height: '30%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '80%'}}></i></div>
                    <div className="mo-l">Feb</div>
                  </div>
                  <div className="mo">
                    <div className="mo-col"><span className="mo-t">18°</span><span className="mo-bar" style={{height: '40%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '62%'}}></i></div>
                    <div className="mo-l">Mar</div>
                  </div>
                  <div className="mo best">
                    <div className="mo-col"><span className="mo-t">19°</span><span className="mo-bar" style={{height: '45%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '55%'}}></i></div>
                    <div className="mo-l">Apr</div>
                  </div>
                  <div className="mo best">
                    <div className="mo-col"><span className="mo-t">21°</span><span className="mo-bar" style={{height: '55%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '38%'}}></i></div>
                    <div className="mo-l">May</div>
                  </div>
                  <div className="mo">
                    <div className="mo-col"><span className="mo-t">25°</span><span className="mo-bar" style={{height: '75%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '15%'}}></i></div>
                    <div className="mo-l">Jun</div>
                  </div>
                  <div className="mo hot">
                    <div className="mo-col"><span className="mo-t">28°</span><span className="mo-bar" style={{height: '90%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '4%'}}></i></div>
                    <div className="mo-l">Jul</div>
                  </div>
                  <div className="mo hot">
                    <div className="mo-col"><span className="mo-t">28°</span><span className="mo-bar" style={{height: '90%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '6%'}}></i></div>
                    <div className="mo-l">Aug</div>
                  </div>
                  <div className="mo best">
                    <div className="mo-col"><span className="mo-t">26°</span><span className="mo-bar" style={{height: '80%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '28%'}}></i></div>
                    <div className="mo-l">Sep</div>
                  </div>
                  <div className="mo best">
                    <div className="mo-col"><span className="mo-t">22°</span><span className="mo-bar" style={{height: '60%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '60%'}}></i></div>
                    <div className="mo-l">Oct</div>
                  </div>
                  <div className="mo">
                    <div className="mo-col"><span className="mo-t">18°</span><span className="mo-bar" style={{height: '40%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '85%'}}></i></div>
                    <div className="mo-l">Nov</div>
                  </div>
                  <div className="mo">
                    <div className="mo-col"><span className="mo-t">15°</span><span className="mo-bar" style={{height: '25%'}}></span></div>
                    <div className="mo-rain"><i style={{width: '92%'}}></i></div>
                    <div className="mo-l">Dec</div>
                  </div>
                </div>
                <div className="legend">
                  <span><b style={{color: 'var(--ink)'}}>Bar</b> average high</span>
                  <span><b style={{color: 'var(--ink)'}}>Strip</b> relative rainfall</span>
                  <span><span className="meter" data-scale="pos" data-lvl="4"><i></i><i></i><i></i><i></i></span><span className="mlab">Best months</span></span>
                  <span style={{marginLeft: 'auto'}}>August empties the cities. Many small businesses close for the month.</span>
                </div>

                <div style={{height: '1px', background: 'var(--line)', margin: '20px 0'}}></div>
                <div className="subh">Same country, different climates</div>
                <table className="tbl">
                  <thead><tr><th>Region</th><th className="num">Summer</th><th className="num">Winter</th><th className="num">Rain</th><th className="num">Wildfire risk</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Lisbon and coast</td><td className="num">27–33°C</td><td className="num">9–16°C</td><td className="num">Moderate</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Low"><i></i><i></i><i></i><i></i></span><span className="mlab">Low</span></td></tr>
                    <tr><td>Porto and north</td><td className="num">24–29°C</td><td className="num">6–14°C</td><td className="num">High</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="High"><i></i><i></i><i></i><i></i></span><span className="mlab">High</span></td></tr>
                    <tr><td>Alentejo interior</td><td className="num">33–42°C</td><td className="num">4–14°C</td><td className="num">Low</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="High"><i></i><i></i><i></i><i></i></span><span className="mlab">High</span></td></tr>
                    <tr><td>Algarve</td><td className="num">28–34°C</td><td className="num">11–17°C</td><td className="num">Low</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Moderate"><i></i><i></i><i></i><i></i></span><span className="mlab">Moderate</span></td></tr>
                    <tr><td>Madeira</td><td className="num">23–27°C</td><td className="num">15–20°C</td><td className="num">Moderate</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Lower"><i></i><i></i><i></i><i></i></span><span className="mlab">Lower</span></td></tr>
                    <tr><td>Azores</td><td className="num">22–26°C</td><td className="num">13–18°C</td><td className="num">Very high</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Minimal"><i></i><i></i><i></i><i></i></span><span className="mlab">Minimal</span></td></tr>
                  </tbody>
                </table>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Mild outdoors, cold indoors.</b> The temperatures above understate winter, because central heating is rare and older housing holds damp. This is a housing problem rather than a weather problem, and it is the most common complaint from new arrivals.</span>
                </div>
              </section>

              {/* 3. GETTING AROUND */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">3</span><h2>Getting Around</h2></div>
                  <a className="sec-link" href="/nextinations/portugal/v2/cost-housing">Transport costs <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
                </div>
                <table className="tbl">
                  <thead><tr><th>Place</th><th className="num">Living without a car</th><th className="num">Walkability</th><th>What carries you</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Lisbon</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Easy"><i></i><i></i><i></i><i></i></span><span className="mlab">Easy</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="High"><i></i><i></i><i></i><i></i></span><span className="mlab">High</span></td><td>Metro, trams, buses, ferries, rail to Cascais and Sintra</td></tr>
                    <tr className="hi"><td>Porto</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Easy"><i></i><i></i><i></i><i></i></span><span className="mlab">Easy</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="High"><i></i><i></i><i></i><i></i></span><span className="mlab">High</span></td><td>Metro and buses, compact centre, steep in places</td></tr>
                    <tr><td>Braga, Coimbra</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Mostly"><i></i><i></i><i></i><i></i></span><span className="mlab">Mostly</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="High"><i></i><i></i><i></i><i></i></span><span className="mlab">High</span></td><td>Walkable cores, buses adequate, a car helps at weekends</td></tr>
                    <tr><td>Algarve towns</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Difficult"><i></i><i></i><i></i><i></i></span><span className="mlab">Difficult</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Patchy"><i></i><i></i><i></i><i></i></span><span className="mlab">Patchy</span></td><td>Spread out and seasonal, most residents keep a car</td></tr>
                    <tr><td>Interior, Alentejo</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="No"><i></i><i></i><i></i><i></i></span><span className="mlab">No</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="Low"><i></i><i></i><i></i><i></i></span><span className="mlab">Low</span></td><td>A car is not optional, bus is thin and rail barely reaches</td></tr>
                  </tbody>
                </table>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                      <span><b>Walkability scores hide two things.</b> Hills are relentless in Lisbon and parts of Porto, and <i>calçada portuguesa</i>, the decorative limestone paving, turns slippery in rain and is punishing on ankles, strollers, and wheels. If mobility is part of your daily life, see <a href="/nextinations/portugal/v2/healthcare" style={{textDecoration: 'underline', fontWeight: '700'}}>Healthcare, section 8</a>.</span>
                </div>
              </section>

              {/* 4. THE RHYTHM OF A WEEK */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>Food and the Rhythm of a Week</h2></div></div>
                <p className="lead">When things are actually open. This is the single most disorienting adjustment for anyone arriving from a 24-hour retail culture.</p>
                <div className="hours">
                  <span className="hh"></span><span className="hh">Mon</span><span className="hh">Tue</span><span className="hh">Wed</span><span className="hh">Thu</span><span className="hh">Fri</span><span className="hh">Sat</span><span className="hh">Sun</span>
                  <span className="rl">Supermarkets</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span>
                  <span className="rl">Small shops</span><span className="hcell h-part">Lunch</span><span className="hcell h-part">Lunch</span><span className="hcell h-part">Lunch</span><span className="hcell h-part">Lunch</span><span className="hcell h-part">Lunch</span><span className="hcell h-part">AM</span><span className="hcell h-shut">Closed</span>
                  <span className="rl">Restaurants</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-part">Lunch</span>
                  <span className="rl">Public offices</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-shut">Closed</span><span className="hcell h-shut">Closed</span>
                  <span className="rl">Banks</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-part">AM</span><span className="hcell h-shut">Closed</span><span className="hcell h-shut">Closed</span>
                  <span className="rl">Pharmacies</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-open">Open</span><span className="hcell h-part">Rota</span>
                </div>
                <div className="legend">
                  <span><span className="hcell h-open" style={{width: '38px', height: '18px'}}>Open</span> full day</span>
                  <span><span className="hcell h-part" style={{width: '38px', height: '18px'}}>Lunch</span> closes midday, or mornings only</span>
                  <span><span className="hcell h-shut" style={{width: '38px', height: '18px'}}>Closed</span></span>
                  <span style={{marginLeft: 'auto'}}>Pharmacies run an overnight rota, posted on every closed door</span>
                </div>

                <div style={{height: '1px', background: 'var(--line)', margin: '20px 0'}}></div>
                <div className="two">
                  <div>
                    <div className="subh">Four things that run daily life</div>
                    <ul className="rd-list">
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Multibanco.</b> The ATM network pays bills, taxes, and fines and buys tickets. The MB Way app puts it on your phone. Far more capable than any US equivalent.</li>
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Municipal markets and weekly feiras.</b> Cheaper and better than supermarkets for produce and fish, and where you meet your neighbourhood.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>&quot;Com contribuinte.&quot;</b> Ask for your NIF on every receipt. It links purchases to your tax number and generates deductions at filing.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Couvert.</b> The bread and olives on your table are chargeable. Send them back without awkwardness if you do not want them.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="subh">Eating out, by budget</div>
                    <table className="tbl">
                      <thead><tr><th>Meal</th><th className="num">Typical</th></tr></thead>
                      <tbody>
                        <tr className="hi"><td><i>Prato do dia</i>, fixed lunch</td><td className="num">EUR 8–12</td></tr>
                        <tr><td>Neighbourhood dinner, two courses</td><td className="num">EUR 15–25</td></tr>
                        <tr><td>Bica at the counter</td><td className="num">EUR 0.70–1.00</td></tr>
                        <tr><td>Glass of house wine</td><td className="num">EUR 2–4</td></tr>
                        <tr><td>Tourist-area dinner</td><td className="num">EUR 30–50</td></tr>
                      </tbody>
                    </table>
                    <p className="note">Vegetarian and vegan options expanded fast in cities and remain genuinely difficult in small towns, where the assumption is that everyone eats fish.</p>
                  </div>
                </div>
              </section>

              {/* 5. MAKING FRIENDS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Social Life and Making Friends</h2></div></div>
                <p className="lead">Portuguese social circles are usually formed in school and sustained for decades, so there is less structural need for new friends than an arriving adult has. Warmth follows recognition, and recognition takes repetition. These are the routes that actually produce it.</p>
                <table className="tbl">
                  <thead><tr><th>Route</th><th className="num">How fast</th><th className="num">Reaches locals</th><th>Why it works</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Kids&apos; school and activities</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Medium"><i></i><i></i><i></i><i></i></span><span className="mlab">Medium</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Yes"><i></i><i></i><i></i><i></i></span><span className="mlab">Yes</span></td><td>School creates the repetition for you, automatically</td></tr>
                    <tr className="hi"><td>Portuguese classes</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Fast"><i></i><i></i><i></i><i></i></span><span className="mlab">Fast</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Mixed"><i></i><i></i><i></i><i></i></span><span className="mlab">Mixed</span></td><td>Other learners first, then the doors language opens</td></tr>
                    <tr><td>Sports club or gym</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Medium"><i></i><i></i><i></i><i></i></span><span className="mlab">Medium</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Yes"><i></i><i></i><i></i><i></i></span><span className="mlab">Yes</span></td><td>Fixed schedule, same faces, shared purpose</td></tr>
                    <tr><td>Volunteering or associations</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Medium"><i></i><i></i><i></i><i></i></span><span className="mlab">Medium</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Yes"><i></i><i></i><i></i><i></i></span><span className="mlab">Yes</span></td><td>Coletividades have run for generations and take members</td></tr>
                    <tr><td>Same café every morning</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Slow"><i></i><i></i><i></i><i></i></span><span className="mlab">Slow</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Yes"><i></i><i></i><i></i><i></i></span><span className="mlab">Yes</span></td><td>The slowest route and the one that actually sticks</td></tr>
                    <tr><td>Coworking space</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Fast"><i></i><i></i><i></i><i></i></span><span className="mlab">Fast</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Sometimes"><i></i><i></i><i></i><i></i></span><span className="mlab">Sometimes</span></td><td>Fast, but skews international and transient</td></tr>
                    <tr><td>Expat meetups</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Instant"><i></i><i></i><i></i><i></i></span><span className="mlab">Instant</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="Rarely"><i></i><i></i><i></i><i></i></span><span className="mlab">Rarely</span></td><td>Useful for landing. Not a substitute for local roots</td></tr>
                  </tbody>
                </table>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>The expat bubble is the real risk.</b> It is easy, immediate, English-speaking, and it can absorb your whole social life inside a month. It also churns constantly as people leave. Use it to land, then deliberately build outside it.</span>
                </div>
              </section>

              {/* 6. LANGUAGE */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Language and Integration</h2></div></div>
                <p className="lead">You can land, rent, bank, and function for a year in English. The map below shows exactly where that stops being true.</p>
                <table className="tbl">
                  <thead><tr><th>Situation</th><th className="num">Getting by in English</th><th>Notes</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Cafés, restaurants, shops in cities</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Easy"><i></i><i></i><i></i><i></i></span><span className="mlab">Easy</span></td><td>Widely spoken, especially by younger staff</td></tr>
                    <tr><td>Tech, coworking, international business</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Easy"><i></i><i></i><i></i><i></i></span><span className="mlab">Easy</span></td><td>Often the working language</td></tr>
                    <tr><td>Private healthcare</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Easy"><i></i><i></i><i></i><i></i></span><span className="mlab">Easy</span></td><td>Standard in Lisbon, Porto, Algarve</td></tr>
                    <tr><td>Landlords and estate agents</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Usually"><i></i><i></i><i></i><i></i></span><span className="mlab">Usually</span></td><td>Portuguese-language listings are 15 to 25% cheaper</td></tr>
                    <tr className="hi"><td>Public healthcare admin</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Difficult"><i></i><i></i><i></i><i></i></span><span className="mlab">Difficult</span></td><td>Clinical staff often, reception rarely</td></tr>
                    <tr className="hi"><td>Government offices</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="No"><i></i><i></i><i></i><i></i></span><span className="mlab">No</span></td><td>Assume Portuguese. Bring someone if you can</td></tr>
                    <tr><td>Schools and teachers</td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Difficult"><i></i><i></i><i></i><i></i></span><span className="mlab">Difficult</span></td><td>Varies by school, not something to assume</td></tr>
                    <tr><td>Tradespeople and repairs</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="No"><i></i><i></i><i></i><i></i></span><span className="mlab">No</span></td><td>Plumbers, electricians, builders</td></tr>
                    <tr><td>Anywhere rural</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="No"><i></i><i></i><i></i><i></i></span><span className="mlab">No</span></td><td>The cost saving inland has a language price</td></tr>
                  </tbody>
                </table>
                <div style={{height: '1px', background: 'var(--line)', margin: '20px 0'}}></div>
                <div className="two">
                  <div>
                    <div className="subh">Getting to A2, the citizenship bar</div>
                    <div className="tl">
                      <div className="tl-row"><div className="tl-top"><span className="tl-l">Consistent study to reach A2</span><span className="tl-v">6 to 12 months</span></div><div className="tl-track"><i className="calm" style={{left: '0', width: '20%'}}></i></div></div>
                      <div className="tl-row"><div className="tl-top"><span className="tl-l">Comfortable in a group conversation</span><span className="tl-v">2 to 4 years</span></div><div className="tl-track"><i style={{left: '0', width: '60%'}}></i></div></div>
                      <div className="tl-row"><div className="tl-top"><span className="tl-l">Citizenship eligibility</span><span className="tl-v">Year 5</span></div><div className="tl-track"><i className="risk" style={{left: '0', width: '100%'}}></i></div></div>
                      <div className="tl-scale"><span>Arrival</span><span>Year 2</span><span>Year 4</span><span>Year 5</span></div>
                    </div>
                    <p className="note">A2 is a modest level. The constraint is exam dates and starting late, not difficulty.</p>
                  </div>
                  <div>
                    <div className="subh">Two things that trip people up</div>
                    <ul className="rd-list">
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg><b>Most US material teaches Brazilian Portuguese.</b> Grammar overlaps heavily, pronunciation does not. European Portuguese swallows vowels in ways that make it much harder to hear. Learn the European variant from day one.</li>
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg><b>Free classes exist and nobody finds them.</b> Subsidised Portuguese for residents runs through public adult education channels. Your junta de freguesia knows what is running locally.</li>
                    </ul>
                    <div className="callout ok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>
                      <span><b>Start in month one, not year four.</b> Language is the only requirement on the five year path that cannot be rushed at the end.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. COMMUNITIES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">7</span><h2>Where to Find Your People</h2></div></div>
                <table className="tbl">
                  <thead><tr><th>Area</th><th className="num">International scene</th><th className="num">Local integration</th><th>Character</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Lisbon and Cascais</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Largest"><i></i><i></i><i></i><i></i></span><span className="mlab">Largest</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Harder"><i></i><i></i><i></i><i></i></span><span className="mlab">Harder</span></td><td>Americans, Brazilians, French, tech. Most organised, most English-speaking</td></tr>
                    <tr><td>Algarve</td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Large"><i></i><i></i><i></i><i></i></span><span className="mlab">Large</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="Hardest"><i></i><i></i><i></i><i></i></span><span className="mlab">Hardest</span></td><td>British and northern European, retirement-weighted, long established</td></tr>
                    <tr className="hi"><td>Porto</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Growing"><i></i><i></i><i></i><i></i></span><span className="mlab">Growing</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Easier"><i></i><i></i><i></i><i></i></span><span className="mlab">Easier</span></td><td>Younger, more integrated, much less of a separate bubble</td></tr>
                    <tr><td>Madeira</td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Specific"><i></i><i></i><i></i><i></i></span><span className="mlab">Specific</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Harder"><i></i><i></i><i></i><i></i></span><span className="mlab">Harder</span></td><td>Digital nomad concentration, transient but well networked</td></tr>
                    <tr><td>Central interior</td><td className="num"><span className="meter" data-scale="pos" data-lvl="1" role="img" aria-label="Small"><i></i><i></i><i></i><i></i></span><span className="mlab">Small</span></td><td className="num"><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Necessary"><i></i><i></i><i></i><i></i></span><span className="mlab">Necessary</span></td><td>Rural resettlers and homesteaders, scattered and self-organised</td></tr>
                  </tbody>
                </table>
                <p className="note">The inverse relationship is real. The easier a place is to arrive into, the harder it is to leave the arrival layer.</p>

                <div style={{height: '1px', background: 'var(--line)', margin: '20px 0'}}></div>
                <div className="two">
                  <div>
                    <div className="subh">Local structures nobody uses</div>
                    <ul className="rd-list">
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Junta de freguesia.</b> Your parish council. Runs activities, issues documents, knows what is happening locally. The most underused resource available to a new arrival.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Coletividades.</b> Neighbourhood associations running sport, music, and social events, some for generations. Genuinely open to members.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>CLAIM centres.</b> Local support offices for migrants, offering help with documents and rights in multiple languages.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="subh">Faith communities</div>
                    <p className="rd-p">Culturally Catholic, constitutionally secular, and practice has declined sharply across generations. Religion shapes the calendar more than daily behaviour for most people.</p>
                    <div className="route-req" style={{borderTop: 'none', paddingTop: '10px'}}>
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Catholic, English mass in Lisbon, Cascais, Algarve</span>
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Protestant and evangelical, many Brazilian-led</span>
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Jewish, Lisbon and Porto</span>
                      <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Muslim, Hindu, Sikh, Buddhist, Lisbon</span>
                      <span className="req miss">Thin outside the metros</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. SAFETY & INCLUSION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">8</span><h2>Safety &amp; Inclusion</h2></div></div>
                <div className="gb-head">
                  <div className="eb">Safety &amp; Inclusion</div>
                  <h3>Legal protection and lived experience, scored separately</h3>
                  <p>These are different things and most guides blur them. Where the two bars diverge, the gap is the finding. You never have to disclose anything to read this.</p>
                </div>

                <div className="subh">Baseline safety</div>
                <div className="kpis">
                  <div className="kpi"><div className="k">Global Peace Index</div><div className="v">Top 10 <small>worldwide</small></div><div className="n">Consistently, for over a decade</div></div>
                  <div className="kpi"><div className="k">Violent crime</div><div className="v">Rare</div><div className="n">Walking at night is widely described as comfortable</div></div>
                  <div className="kpi"><div className="k">What you will meet</div><div className="v">Petty theft</div><div className="n">Tourist areas, tram 28, transport hubs, beach car parks</div></div>
                  <div className="kpi"><div className="k">Political stability</div><div className="v">Stable <small>EU democracy</small></div><div className="n">More fragmented politics recently, as across Europe</div></div>
                </div>

                <div className="subh" style={{marginTop: '22px'}}>Identity and lived experience</div>
                <div className="gb-grid">
                  <div className="gb">
                    <div className="h">Racial climate<span className="gapflag">Gap</span></div>
                    <div className="dual-row"><span className="dl">Legal</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong</span></div>
                    <div className="dual-row"><span className="dl">Lived</span><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Mixed"><i></i><i></i><i></i><i></i></span><span className="mlab">Mixed</span></div>
                    <div className="b">Protections are written into law. Enforcement and public reckoning lag well behind them.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Portugal has large, long-established communities with roots in Cape Verde, Angola, Guinea-Bissau, Mozambique, São Tomé, and Brazil, and Lisbon is genuinely multicultural. Alongside that, <b>colonial history is under-examined in public life</b>, and the lingering idea that Portuguese colonialism was gentler than others complicates honest conversation about race. Racism exists, including documented cases involving police, and civil society organisations have been sharply critical of the pace of official response.</p></div>
                  </div>
                  <div className="gb">
                    <div className="h">Black expat experience</div>
                    <div className="dual-row"><span className="dl">Legal</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong</span></div>
                    <div className="dual-row"><span className="dl">Lived</span><span className="meter" data-scale="pos" data-lvl="3" role="img" aria-label="Good in cities"><i></i><i></i><i></i><i></i></span><span className="mlab">Good in cities</span></div>
                    <div className="b">City life reads as comfortable. Rural areas bring visible curiosity rather than hostility.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Most Black Americans report city life as comfortable and markedly less threatening than the US. One recurring observation is worth naming directly: <b>American identity often confers a social pass that Black Portuguese and African-descendant residents do not receive.</b> Being read as a foreigner and being read as a local can produce very different treatment in the same room.</p></div>
                  </div>
                  <div className="gb">
                    <div className="h">LGBTQ+</div>
                    <div className="dual-row"><span className="dl">Legal</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Very strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Very strong</span></div>
                    <div className="dual-row"><span className="dl">Lived</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong in cities"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong in cities</span></div>
                    <div className="b">Marriage since 2010, joint adoption since 2016, gender self-determination since 2018.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Among the stronger legal frameworks in Europe. Lisbon and Porto have visible communities and Pride events, and ILGA Portugal is the main advocacy and support organisation. <b>Rural areas are more socially reserved</b> in practice while remaining fully protected in law.</p></div>
                  </div>
                  <div className="gb">
                    <div className="h">Women&apos;s experience</div>
                    <div className="dual-row"><span className="dl">Legal</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong</span></div>
                    <div className="dual-row"><span className="dl">Lived</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong</span></div>
                    <div className="b">Street harassment is comparatively low and living alone is widely described as comfortable.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Solo travel and solo living are widely reported as comfortable, and the ambient level of street harassment is low by European standards. <b>Domestic violence remains an acknowledged national policy priority</b> rather than a solved problem, and workplace gender gaps persist as they do across Europe.</p></div>
                  </div>
                  <div className="gb">
                    <div className="h">Religious freedom</div>
                    <div className="dual-row"><span className="dl">Legal</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong</span></div>
                    <div className="dual-row"><span className="dl">Lived</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong</span></div>
                    <div className="b">Secular state, culturally Catholic, minority faiths practise openly.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">Constitutionally protected and largely uncontroversial in practice. Religious dress does not attract the level of public debate seen in some neighbouring countries. Outside the metros, non-Catholic congregations thin out quickly, so faith community belongs in your city decision rather than your country decision.</p></div>
                  </div>
                  <div className="gb">
                    <div className="h">Disability access<span className="gapflag">Gap</span></div>
                    <div className="dual-row"><span className="dl">Legal</span><span className="meter" data-scale="pos" data-lvl="4" role="img" aria-label="Strong"><i></i><i></i><i></i><i></i></span><span className="mlab">Strong</span></div>
                    <div className="dual-row"><span className="dl">Lived</span><span className="meter" data-scale="pos" data-lvl="2" role="img" aria-label="Mixed"><i></i><i></i><i></i><i></i></span><span className="mlab">Mixed</span></div>
                    <div className="b">New construction complies. Historic centres largely cannot be retrofitted.</div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden><p className="rd-p">The legal framework and new-build standards are solid. The constraint is the built environment: Lisbon&apos;s hills and calçada cobblestone are genuinely difficult, older buildings frequently have no lift, and specialist services concentrate in Lisbon, Porto, and Coimbra. Full detail sits under Healthcare, section 8.</p></div>
                  </div>
                </div>

                <div className="subh" style={{marginTop: '22px'}}>If something happens</div>
                <div className="two">
                  <div>
                    <div className="kpis" style={{gridTemplateColumns: '1fr'}}>
                      <div className="kpi"><div className="k">Emergency, all services</div><div className="v">112</div><div className="n">Police, ambulance, fire. English support available</div></div>
                      <div className="kpi"><div className="k">Racial discrimination</div><div className="v">CICDR</div><div className="n">cicdr@acm.gov.pt · +351 218 106 100 · online form</div></div>
                      <div className="kpi"><div className="k">Sex, gender identity, orientation</div><div className="v">CIG</div><div className="n">Receives complaints and refers to the competent authority</div></div>
                    </div>
                  </div>
                  <div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">Where to file a police report</div><div className="b">PSP polices urban areas, GNR covers rural and highways. Reports are filed at an <i>esquadra</i> or <i>posto</i>. English is not guaranteed, so bring a Portuguese speaker where you can.</div></div>
                    <div className="det" style={{marginBottom: '9px'}}><div className="h">What enforcement actually looks like</div><div className="b"><b>The gap between complaints and outcomes is wide.</b> Anti-racism organisations have publicly criticised the commission&apos;s throughput and conviction rate. Filing still matters for the record, but set expectations and involve a lawyer for anything serious.</div></div>
                    <div className="det"><div className="h">Organisations worth knowing</div><div className="b"><b>SOS Racismo</b> and <b>Djass</b>, the association of Afro-descendants, are the most active voices on racial justice. <b>ILGA Portugal</b> leads LGBTQ+ advocacy and support.</div></div>
                  </div>
                </div>

                <div className="subh" style={{marginTop: '20px'}}>Support and reporting resources</div>
                <div className="links">
                  <a className="lnk" href="https://help.unhcr.org/portugal/where-to-seek-help/complaints-mechanisms-in-portugal/" target="_blank" rel="noopener noreferrer">Complaint mechanisms guide <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://ilga-portugal.pt" target="_blank" rel="noopener noreferrer">ILGA Portugal <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.portugalresident.com" target="_blank" rel="noopener noreferrer">Portugal Resident news <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.gov.pt" target="_blank" rel="noopener noreferrer">gov.pt services <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                </div>
                <div className="src"><span>Last verified: January 2026 · Global Peace Index, CICDR, Council of Europe ECRI monitoring, ILGA Europe. Community-reported experience is scored separately from legal fact.</span><span className="sbadge rev">Editorially reviewed</span></div>
              </section>
            </div>

    )
  }

  // ─── Every other country: honest, prose-only layout from the content model ──
  // Only fields that exist in DailyLifeContent / TransportationContent /
  // GreenbookSection are rendered. Chart-, meter- and score-based widgets have
  // no backing field and are omitted rather than shown with fabricated values.
  return (
    <div className="tabpanel on" id="p-life">

            {/* 1. THE CULTURE SHIFT */}
            <section className="card-surface sec">
              <div className="sec-head">
                <div className="sec-title"><span className="sec-num">1</span><h2>The Culture Shift</h2></div>
                <a className="sec-link" href={`/nextinations/${slug}/v2/overview`}>Lifestyle summary <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
              </div>
              <p className="lead">The everyday habits and social rhythms that tend to land differently for new arrivals.</p>
              <div className="callout info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                <span><b>Cultural etiquette.</b> {daily.culturalEtiquette}</span>
              </div>
              <div className="callout info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                <span><b>Pace of life.</b> {daily.paceOfLife}</span>
              </div>
            </section>

            {/* 2. CLIMATE */}
            <section className="card-surface sec">
              <div className="sec-head"><div className="sec-title"><span className="sec-num">2</span><h2>Climate Through the Year</h2></div></div>
              <p className="lead">What the weather is like across the year.</p>
              <p className="rd-p">{daily.weather}</p>
            </section>

            {/* 3. GETTING AROUND */}
            <section className="card-surface sec">
              <div className="sec-head">
                <div className="sec-title"><span className="sec-num">3</span><h2>Getting Around</h2></div>
                <a className="sec-link" href={`/nextinations/${slug}/v2/cost-housing`}>Transport costs <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
              </div>
              <table className="tbl">
                <thead><tr><th>Getting around</th><th>What to expect</th></tr></thead>
                <tbody>
                  <tr className="hi"><td>Public transit</td><td>{transport.publicTransit}</td></tr>
                  <tr><td>Walkability</td><td>{transport.walkability}</td></tr>
                  <tr><td>Rail</td><td>{transport.rail}</td></tr>
                  <tr><td>Domestic travel</td><td>{transport.domesticTravel}</td></tr>
                  <tr><td>International connections</td><td>{transport.internationalConnections}</td></tr>
                  <tr><td>Car ownership</td><td>{transport.carOwnership}</td></tr>
                  <tr><td>Rideshare</td><td>{transport.rideshare}</td></tr>
                  <tr><td>Cycling</td><td>{transport.cycling}</td></tr>
                  <tr><td>Accessibility</td><td>{transport.accessibility}</td></tr>
                  <tr><td>Driver&apos;s licence</td><td>{transport.driverLicenseConversion}</td></tr>
                </tbody>
              </table>
            </section>

            {/* 4. THE RHYTHM OF A WEEK */}
            <section className="card-surface sec">
              <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>Food and the Rhythm of a Week</h2></div></div>
              <div className="two">
                <div>
                  <div className="subh">Groceries and daily shopping</div>
                  <p className="rd-p">{daily.groceryShopping}</p>
                </div>
                <div>
                  <div className="subh">Eating out</div>
                  <p className="rd-p">{daily.dining}</p>
                </div>
              </div>
              <div className="callout info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                <span><b>Public holidays.</b> {daily.holidays}</span>
              </div>
            </section>

            {/* 5. MAKING FRIENDS */}
            <section className="card-surface sec">
              <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Social Life and Making Friends</h2></div></div>
              <p className="lead">{greenbook.communityFit}</p>
              <p className="rd-p">{greenbook.culturalBelonging}</p>
            </section>

            {/* 6. COMMUNITIES */}
            <section className="card-surface sec">
              <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Where to Find Your People</h2></div></div>
              <div className="subh">Neighbourhoods and areas</div>
              <p className="rd-p">{greenbook.neighborhoodInsights}</p>
              <div className="subh" style={{marginTop: '16px'}}>Faith communities</div>
              <p className="rd-p">{greenbook.faithCommunities}</p>
            </section>

            {/* 7. SAFETY & INCLUSION */}
            <section className="card-surface sec">
              <div className="sec-head"><div className="sec-title"><span className="sec-num">7</span><h2>Safety &amp; Inclusion</h2></div></div>
              <div className="gb-head">
                <div className="eb">Safety &amp; Inclusion</div>
                <h3>Community-reported experience and available context</h3>
                <p>Legal protection and lived experience are different things. These notes combine editorial research with community-reported experience. You never have to disclose anything to read this.</p>
              </div>

              <div className="subh">Everyday safety</div>
              <div className="kpis" style={{gridTemplateColumns: '1fr'}}>
                <div className="kpi"><div className="k">Safety overview</div><div className="v">Community-reported</div><div className="n">{daily.safety}</div></div>
              </div>

              <div className="subh" style={{marginTop: '22px'}}>Identity and lived experience</div>
              <div className="gb-grid">
                <div className="gb">
                  <div className="h">Black diaspora and community</div>
                  <div className="b">{greenbook.blackDiaspora}</div>
                </div>
                <div className="gb">
                  <div className="h">LGBTQ+</div>
                  <div className="b">{greenbook.lgbtq}</div>
                </div>
                <div className="gb">
                  <div className="h">Women&apos;s experience</div>
                  <div className="b">{greenbook.womenSafety}</div>
                </div>
                <div className="gb">
                  <div className="h">Disability access</div>
                  <div className="b">{greenbook.disabilityAccess}</div>
                </div>
              </div>

              {greenbook.communityOrgs.length > 0 && (
                <>
                  <div className="subh" style={{marginTop: '22px'}}>Community organisations</div>
                  <ul className="rd-list">
                    {greenbook.communityOrgs.map((org) => (
                      <li className="c" key={org.name}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>
                        <b>
                          {org.url ? (
                            <a href={org.url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>{org.name}</a>
                          ) : (
                            org.name
                          )}
                          .
                        </b>{' '}
                        {org.description}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="src"><span>{greenbook.disclaimer}</span><span className="sbadge rev">Editorially reviewed</span></div>
            </section>
          </div>

  )
}
