import type { SectionDisclosure } from '@/lib/country-workspace/country-content'
import { getCountryContent } from '@/lib/country-workspace/country-content'

/* Portugal keeps its approved, hand-authored content verbatim (see the
   `portugal` branch below). Every other country renders the data-driven
   version in `WorkStudyTabData`, where markup and design tokens are preserved
   from the approved index.html mockup and only the copy is sourced from
   `content.*`. Data points with no matching field render an honest neutral
   state rather than another country's figures (see AGENTS.md: never fabricate
   country data). */

const STATUS_META: Record<string, { label: string; badge: string }> = {
  official_source_verified: { label: 'Official source verified', badge: 'sbadge' },
  editorially_reviewed: { label: 'Editorially reviewed', badge: 'sbadge rev' },
  placeholder: { label: 'Research in progress', badge: 'sbadge rev' },
  stale: { label: 'Update pending', badge: 'sbadge rev' },
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatVerified(iso: string): string {
  const [y, m] = iso.split('-')
  const mi = Number(m) - 1
  return MONTHS[mi] ? `${MONTHS[mi]} ${y}` : iso
}

function SourceLine({ disclosure }: { disclosure?: SectionDisclosure }) {
  if (!disclosure) return null
  const meta = STATUS_META[disclosure.status] ?? STATUS_META.editorially_reviewed
  return (
    <div className="src">
      <span>Last verified: {formatVerified(disclosure.lastVerified)} · {disclosure.sourceNote}</span>
      <span className={meta.badge}>{meta.label}</span>
    </div>
  )
}

function WorkStudyTabData({ slug }: { slug: string }) {
  const content = getCountryContent(slug)
  if (!content) return null

  const employment = content.employment
  const education = content.education
  const economic = content.economic
  const countryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
      <div className="tabpanel on" id="p-work">

              {/* 1. EMPLOYMENT MARKET */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">1</span><h2>Employment Market</h2></div></div>
                <div className="kpis">
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>Unemployment</div><div className="v">{economic.unemployment?.value ?? 'Not available'}</div><div className="n">{economic.unemployment ? <>{economic.unemployment.source} · {economic.unemployment.period}</> : 'Data not yet available'}</div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>Average wage</div><div className="v">{economic.avgMonthlyWage?.value ?? 'Not available'}</div><div className="n">{economic.avgMonthlyWage ? <>{economic.avgMonthlyWage.source} · {economic.avgMonthlyWage.period}</> : 'Data not yet available'}</div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>Minimum wage</div><div className="v">{economic.minimumWage?.value ?? 'Not available'}</div><div className="n">{economic.minimumWage ? <>{economic.minimumWage.source} · {economic.minimumWage.period}</> : 'Data not yet available'}</div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v6h-6" /></svg>Job growth</div><div className="v">{economic.growingSectors[0] ?? 'Varies'}</div><div className="n">{economic.growingSectors.length > 1 ? economic.growingSectors.slice(1, 3).join(', ') : 'Growing sectors'}</div></div>
                </div>
                {economic.personalInterpretation ? (
                  <div className="callout warn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                    <span>{economic.personalInterpretation}</span>
                  </div>
                ) : null}
                <SourceLine disclosure={economic.disclosure} />
              </section>

              {/* 2. INDUSTRIES AND SALARIES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">2</span><h2>In-Demand Industries and Average Salaries</h2></div></div>
                <p className="lead">{employment.avgSalaryRange}</p>
                <table className="tbl">
                  <thead><tr><th>Industry</th><th className="num">Demand</th><th className="num">Gross monthly</th><th>English viable</th></tr></thead>
                  <tbody>
                    {employment.topSectors.map((sector) => (
                      <tr key={sector}><td>{sector}</td><td className="num">—</td><td className="num">—</td><td>—</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="note">Sector-level demand, salary, and language detail is not yet broken out for {countryName}. The average salary range above summarises pay across sectors.</p>
                <div className="subh" style={{marginTop: '22px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /></svg></span>Sectors adding jobs fastest</div>
                <div className="route-req" style={{borderTop: 'none', paddingTop: '0'}}>
                  {economic.growingSectors.map((sector) => (
                    <span key={sector} className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>{sector}</span>
                  ))}
                </div>
              </section>

              {/* 3. JOB SEARCH AND WORK AUTHORIZATION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>Job Search and Work Authorization</h2></div></div>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg></span>Where people actually search</div>
                    <div className="links">
                      {employment.jobBoards.map((board) => (
                        <a key={board.url} className="lnk" href={board.url} target="_blank" rel="noopener noreferrer">{board.name} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      ))}
                    </div>
                    <p className="note">Public employment portals and professional networks list many roles, including some open to newcomers and non-nationals.</p>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg></span>How you become allowed to work</div>
                    <ul className="rd-list">
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>Work authorization depends on your residence permit or visa route. Most permits that allow residence also allow work, but the specifics vary by pathway — confirm the route that matches your situation.</li>
                    </ul>
                    <div className="callout ok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>
                      <span>On your matched route, work authorization may come with residency. <a href={`/nextinations/${slug}/v2/move-there`} style={{textDecoration: 'underline', fontWeight: '700'}}>See the pathway detail</a>.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. REMOTE WORK AND WORKING CONDITIONS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>Remote Work and Working Conditions</h2></div></div>
                <div className="det-grid">
                  <div className="det"><div className="h">Remote-work environment</div><div className="b">{employment.remoteEnvironment}</div></div>
                  <div className="det"><div className="h">Networking and community</div><div className="b">{employment.networkingGroups}</div></div>
                  <div className="det"><div className="h">Language at work</div><div className="b">{employment.languageExpectation}</div></div>
                  <div className="det"><div className="h">Work culture</div><div className="b">{employment.workCulture}</div></div>
                  <div className="det"><div className="h">Tax position</div><div className="b">Spending enough time in country can make you tax resident on worldwide income. See the Tax &amp; Money tab before you commit.</div></div>
                  <div className="det"><div className="h">Connectivity and coworking</div><div className="b">Broadband quality and coworking supply vary by city and region. Confirm options for your specific destination.</div></div>
                </div>
                <SourceLine disclosure={employment.disclosure} />
              </section>

              {/* 5. UNIVERSITIES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Universities and Study Opportunities</h2></div></div>
                <p className="lead">{education.universities}</p>
                {education.studyPathways ? <p className="note">{education.studyPathways}</p> : null}
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Enrolling in a recognised degree program can itself support a student residence route.</b> For anyone whose income does not clear an income-based visa threshold, a study pathway is often an underused door. Check the pathway detail for {countryName}.</span>
                </div>
                <SourceLine disclosure={education.disclosure} />
              </section>

              {/* 6. TUITION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Tuition Overview</h2></div></div>
                <p className="lead">{education.tuitionRange}</p>
                <p className="note">Living costs are usually the larger line item for most students. See Cost &amp; Housing for city-by-city figures.</p>
              </section>

              {/* 7. FUNDED PROGRAMS */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">7</span><h2>Funded Programs, Scholarships, and Exchanges</h2></div></div>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span>Nexit does not yet track funded programs, scholarships, and exchange routes for {countryName}. Check official government, education-ministry, and national scholarship sources for current openings, stipends, and eligibility windows.</span>
                </div>
              </section>

              {/* 8. CREDENTIAL RECOGNITION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">8</span><h2>Degree and Professional Credential Recognition</h2></div></div>
                <p className="lead">Recognising a degree and being licensed to practise a regulated profession are two separate processes. Most people only need the first.</p>
                <div className="det-grid">
                  <div className="det"><div className="h">Recognition process</div><div className="b">{employment.credentialRecognition}</div></div>
                  <div className="det"><div className="h">Regulated professions</div><div className="b">Regulated fields such as medicine, nursing, law, and teaching typically require registration with the relevant professional body plus local language competence, on top of academic recognition. Budget extra time.</div></div>
                  <div className="det"><div className="h">Documents needed</div><div className="b">Expect to provide your degree certificate and transcript, apostilled and officially translated. Prepare these alongside your visa paperwork so the apostille pipeline is done once.</div></div>
                </div>
                <div className="callout ok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>
                  <span><b>If you work remotely for clients outside your destination country, you generally do not need credential recognition at all.</b> It matters for local employment, further study, and regulated professions only. Do not let it block your timeline if none of those apply.</span>
                </div>
                <SourceLine disclosure={employment.disclosure} />
              </section>
            </div>
  )
}

/* Converted from the approved index.html mockup. Markup is verbatim.
   Content is literal Portugal copy: this approved content is preserved
   as-is for Portugal. All other countries use WorkStudyTabData above. */
export function WorkStudyTab({ slug }: { slug: string }) {
  if (slug !== 'portugal') return <WorkStudyTabData slug={slug} />
  return (
      <div className="tabpanel on" id="p-work">

              {/* 1. EMPLOYMENT MARKET */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">1</span><h2>Employment Market</h2></div></div>
                <div className="kpis">
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>Unemployment</div><div className="v">6.4% <small>national</small></div><div className="n">Youth rate near <b className="warn">20%</b></div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>Average wage</div><div className="v">EUR 1,650 <small>gross / mo</small></div><div className="n">Roughly <b>$21,400</b> gross a year</div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>Minimum wage</div><div className="v">EUR 870 <small>/ mo</small></div><div className="n">Sets the <b>D8 visa threshold</b></div></div>
                  <div className="kpi"><div className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v6h-6" /></svg>Job growth</div><div className="v">Tech <small>and tourism</small></div><div className="n">Manufacturing <b className="warn">flat</b></div></div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>Portugal is a remote-income country, not a local-salary country.</b> A US remote salary stretches two to three times further here. A Portuguese local salary does not support a US-style cost structure, and that gap is the single most important thing to understand before planning a career move rather than an income move.</span>
                </div>
                <div className="src"><span>Last verified: January 2026 · Instituto Nacional de Estatística, Eurostat labour force survey</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 2. INDUSTRIES AND SALARIES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">2</span><h2>In-Demand Industries and Average Salaries</h2></div></div>
                <p className="lead">Gross monthly figures. The <b>English viable</b> column is the one that decides whether a sector is realistically open to you in year one.</p>
                <table className="tbl">
                  <thead><tr><th>Industry</th><th className="num">Demand</th><th className="num">Gross monthly</th><th>English viable</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Software and IT</td><td className="num">High</td><td className="num">EUR 2,200–4,500</td><td>Yes, English is the working language in most teams</td></tr>
                    <tr className="hi"><td>Shared services and BPO</td><td className="num">High</td><td className="num">EUR 1,300–2,200</td><td>Yes, multilingual hiring is the whole model</td></tr>
                    <tr><td>Tourism and hospitality</td><td className="num">High, seasonal</td><td className="num">EUR 900–1,400</td><td>Yes, though pay is at the bottom of the range</td></tr>
                    <tr><td>Renewable energy</td><td className="num">Growing</td><td className="num">EUR 1,900–3,200</td><td>Partly, Portuguese expected for site roles</td></tr>
                    <tr><td>Finance and fintech</td><td className="num">Moderate</td><td className="num">EUR 1,800–3,500</td><td>Partly, depends on the employer</td></tr>
                    <tr><td>International schools</td><td className="num">Moderate</td><td className="num">EUR 1,500–2,600</td><td>Yes, English is usually required</td></tr>
                    <tr><td>Healthcare</td><td className="num">High need</td><td className="num">EUR 1,600–3,000</td><td>No, licensure and Portuguese are mandatory</td></tr>
                    <tr><td>Manufacturing and automotive</td><td className="num">Steady</td><td className="num">EUR 1,100–1,800</td><td>No</td></tr>
                  </tbody>
                </table>
                <div className="subh" style={{marginTop: '22px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /></svg></span>Sectors adding jobs fastest</div>
                <div className="route-req" style={{borderTop: 'none', paddingTop: '0'}}>
                  <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Software and cloud</span>
                  <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Renewable energy</span>
                  <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Shared service centres</span>
                  <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Tourism tech</span>
                  <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Life sciences</span>
                  <span className="req met"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Aerospace and defence</span>
                </div>
              </section>

              {/* 3. JOB SEARCH AND WORK AUTHORIZATION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>Job Search and Work Authorization</h2></div></div>
                <div className="two">
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg></span>Where people actually search</div>
                    <div className="links">
                      <a className="lnk" href="https://www.linkedin.com/jobs" target="_blank" rel="noopener noreferrer">LinkedIn <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      <a className="lnk" href="https://www.net-empregos.com" target="_blank" rel="noopener noreferrer">Net-Empregos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      <a className="lnk" href="https://www.itjobs.pt" target="_blank" rel="noopener noreferrer">ITJobs.pt <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      <a className="lnk" href="https://landing.jobs" target="_blank" rel="noopener noreferrer">Landing.jobs <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      <a className="lnk" href="https://emprego.sapo.pt" target="_blank" rel="noopener noreferrer">Sapo Emprego <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      <a className="lnk" href="https://www.euraxess.pt" target="_blank" rel="noopener noreferrer">EURAXESS Portugal <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                    </div>
                    <p className="note">EURAXESS is the one most people miss. It carries publicly funded research and academic posts across the EU, and many are open to non-EU applicants.</p>
                  </div>
                  <div>
                    <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg></span>How you become allowed to work</div>
                    <ul className="rd-list">
                      <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg><b>Already on a D8 or D7 residence permit.</b> You can work locally without a separate permit. This is the simplest path and you probably already have it.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>D1 work visa.</b> Requires a signed employment contract before you file. The employer carries most of the paperwork.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>D3 Tech Visa.</b> Fast track for highly qualified hires at IAPMEI-certified companies. Detail in section 7.</li>
                      <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>StartUP Visa.</b> For founders, requires incubator approval. Detail in section 7.</li>
                      <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg><b>Job seeker visa.</b> 120 days in country to find work. Workable, but local salaries make it a weak plan for a US household.</li>
                    </ul>
                    <div className="callout ok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>
                      <span>On your matched route, work authorization comes free with residency. <a href="/nextinations/portugal/v2/move-there" style={{textDecoration: 'underline', fontWeight: '700'}}>See the pathway detail</a>.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. REMOTE WORK */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">4</span><h2>Remote Work and Digital Nomad Conditions</h2></div></div>
                <div className="det-grid">
                  <div className="det"><div className="h">Connectivity</div><div className="b">Fibre reaches most of the country. Lisbon and Porto average <b>180 Mbps</b> on fixed broadband, and 500 Mbps to 1 Gbps plans run EUR 30 to 45.</div></div>
                  <div className="det"><div className="h">Time zone overlap</div><div className="b">Portugal is UTC+0, which is <b>eight hours ahead of Sacramento</b>. Your 9am is their 5pm. Expect an early-morning-for-them, late-afternoon-for-you overlap of about three hours.</div></div>
                  <div className="det"><div className="h">Coworking</div><div className="b">Hot desk EUR 100 to 180 a month, dedicated desk EUR 180 to 300. Dense supply in Lisbon, Porto, Ericeira, Lagos, and Funchal.</div></div>
                  <div className="det"><div className="h">Nomad hubs</div><div className="b">Lisbon and Madeira carry the largest concentrations. Madeira&apos;s Ponta do Sol village put the island on the map and the community persists.</div></div>
                  <div className="det"><div className="h">Community</div><div className="b">Large, organised, and English speaking. Easy to plug into, though it can substitute for integration rather than lead to it.</div></div>
                  <div className="det"><div className="h">Tax position</div><div className="b">Past 183 days you become tax resident on <b>worldwide income</b>. Covered under Tax &amp; Money, and worth reading before you commit.</div></div>
                </div>
                <div className="callout warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  <span><b>The eight hour gap is the real constraint for a West Coast client base.</b> It works if your clients accept asynchronous delivery. It does not work if they expect afternoon Pacific calls, since that is your 11pm.</span>
                </div>
              </section>

              {/* 5. UNIVERSITIES */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">5</span><h2>Universities and Study Opportunities</h2></div></div>
                <p className="lead">Portugal has eight universities that appear consistently in international rankings, and a growing catalogue of <b>English-taught masters</b> built specifically to attract international students.</p>
                <table className="tbl">
                  <thead><tr><th>Institution</th><th>City</th><th className="num">English programs</th><th>Known for</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td><a className="tlink" href="https://www.ulisboa.pt/en/" target="_blank" rel="noopener noreferrer">Universidade de Lisboa <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Lisbon</td><td className="num">Extensive</td><td>Largest in the country, broad research base</td></tr>
                    <tr className="hi"><td><a className="tlink" href="https://www.up.pt/portal/en/" target="_blank" rel="noopener noreferrer">Universidade do Porto <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Porto</td><td className="num">Extensive</td><td>Engineering, medicine, strong research output</td></tr>
                    <tr><td><a className="tlink" href="https://tecnico.ulisboa.pt/en/" target="_blank" rel="noopener noreferrer">Instituto Superior Técnico <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Lisbon</td><td className="num">Extensive</td><td>Engineering and computer science, top ranked</td></tr>
                    <tr><td><a className="tlink" href="https://www.unl.pt/en" target="_blank" rel="noopener noreferrer">NOVA University Lisbon <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Lisbon</td><td className="num">Extensive</td><td>Business (Nova SBE), law, public health</td></tr>
                    <tr><td><a className="tlink" href="https://www.uc.pt/en/" target="_blank" rel="noopener noreferrer">Universidade de Coimbra <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Coimbra</td><td className="num">Moderate</td><td>Oldest in Portugal, UNESCO listed campus</td></tr>
                    <tr><td><a className="tlink" href="https://www.uminho.pt/EN" target="_blank" rel="noopener noreferrer">Universidade do Minho <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Braga</td><td className="num">Moderate</td><td>Materials, engineering, low cost of living</td></tr>
                    <tr><td><a className="tlink" href="https://www.ua.pt/en/" target="_blank" rel="noopener noreferrer">Universidade de Aveiro <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Aveiro</td><td className="num">Moderate</td><td>Telecoms, ceramics, industry partnerships</td></tr>
                    <tr><td><a className="tlink" href="https://www.ucp.pt/en" target="_blank" rel="noopener noreferrer">Universidade Católica <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a></td><td>Lisbon, Porto</td><td className="num">Extensive</td><td>Private, business and law, strong network</td></tr>
                  </tbody>
                </table>
                <p className="note">Every institution above links to its English-language site. Program catalogues, entry requirements, and international admissions all live there.</p>
                <div className="subh" style={{marginTop: '20px'}}><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>National portals for searching programs</div>
                <div className="links">
                  <a className="lnk" href="https://www.dges.gov.pt" target="_blank" rel="noopener noreferrer">DGES higher education <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.euraxess.pt" target="_blank" rel="noopener noreferrer">EURAXESS Portugal <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en" target="_blank" rel="noopener noreferrer">Erasmus Mundus catalogue <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                  <a className="lnk" href="https://education.ec.europa.eu/study-in-europe" target="_blank" rel="noopener noreferrer">Study in Europe <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                </div>
                <div className="callout info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>Enrolling in a degree is itself a residency route.</b> The D4 student visa has no income threshold, and time spent on it counts toward the five year citizenship clock. For anyone whose income does not clear the D8 bar, this is the most underused door in the whole system.</span>
                </div>
                <div className="src"><span>Institution links verified: January 2026 · English-language landing pages where available</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 6. TUITION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">6</span><h2>Tuition Overview</h2></div></div>
                <p className="lead">Non-EU students pay more than EU students at public institutions, and still pay a fraction of US rates.</p>
                <table className="tbl">
                  <thead><tr><th>Level</th><th className="num">EU student</th><th className="num">Non-EU student</th><th className="num">US comparison</th></tr></thead>
                  <tbody>
                    <tr><td>Public undergraduate</td><td className="num">EUR 700–1,100 / yr</td><td className="num">EUR 3,000–7,000 / yr</td><td className="num">$28,000 avg</td></tr>
                    <tr className="hi"><td>Public masters</td><td className="num">EUR 1,500–3,000 / yr</td><td className="num">EUR 3,000–9,000 / yr</td><td className="num">$35,000 avg</td></tr>
                    <tr><td>Public PhD</td><td className="num">EUR 2,500–3,500 / yr</td><td className="num">EUR 2,500–5,000 / yr</td><td className="num">Varies, often funded</td></tr>
                    <tr><td>Private university</td><td className="num">EUR 4,000–12,000 / yr</td><td className="num">EUR 4,000–12,000 / yr</td><td className="num">$45,000+ avg</td></tr>
                    <tr><td>Accredited language course</td><td className="num">EUR 1,500–3,500 / yr</td><td className="num">EUR 1,500–3,500 / yr</td><td className="num">n/a</td></tr>
                  </tbody>
                </table>
                <p className="note">Living costs are the larger line item for most students. See Cost &amp; Housing for city-by-city figures.</p>
              </section>

              {/* 7. FUNDED PROGRAMS */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">7</span><h2>Funded Programs, Scholarships, and Exchanges</h2></div>
                  <span className="pill p-new">Most underused</span>
                </div>
                <p className="lead">These routes pay you to be here, and several carry a visa with them. For anyone whose income does not clear a D8 or D7 threshold, this section is the most valuable page in the whole country profile. Open any program for full detail and application windows.</p>

                <table className="tbl">
                  <thead><tr><th>Program</th><th>Who it is for</th><th className="num">What it pays</th><th className="num">Apply</th><th className="num">Country</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>Fulbright Portugal</td><td>US graduates, researchers, English teaching assistants</td><td className="num">Stipend, travel, insurance</td><td className="num">Spring, year ahead</td><td className="num">Portugal</td></tr>
                    <tr className="hi"><td>Erasmus Mundus</td><td>Masters students, any nationality</td><td className="num">Full tuition plus stipend</td><td className="num">Oct to Jan</td><td className="num">Multi-country</td></tr>
                    <tr><td>FCT PhD studentships</td><td>Doctoral candidates, any nationality</td><td className="num">Monthly stipend plus fees</td><td className="num">March</td><td className="num">Portugal</td></tr>
                    <tr><td>Tech Visa (D3)</td><td>Highly qualified hires at certified companies</td><td className="num">Salary plus tax regime</td><td className="num">Employer led</td><td className="num">Portugal</td></tr>
                    <tr><td>StartUP Visa</td><td>Founders relocating an innovative business</td><td className="num">Residency, not funding</td><td className="num">Rolling</td><td className="num">Portugal</td></tr>
                    <tr><td>NALCAP</td><td>US and Canadian graduates teaching English</td><td className="num">EUR 800–1,000 / mo</td><td className="num">Jan to April</td><td className="num">Spain only</td></tr>
                  </tbody>
                </table>

                <div style={{height: '1px', background: 'var(--line)', margin: '20px 0'}}></div>

                {/* Fulbright */}
                <div className="route best">
                  <span className="ic i-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10L12 5 2 10l10 5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Fulbright Portugal</div><div className="route-desc">US government exchange program, administered by the US-Portugal Fulbright Commission</div></div><span className="pill p-best">Best match for US citizens</span></div>
                    <div className="route-meta"><span>9 month grant</span><span>Stipend, travel, insurance</span><span>Study, research, or teaching</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">Fulbright runs several distinct awards to Portugal rather than one. The <b>Study/Research Award</b> funds a self-designed project at a Portuguese host institution. The <b>English Teaching Assistant Award</b> places you in a school or university for a nine month academic year. Two additional funded awards exist through <b>FLAD</b> and the <b>Azores Regional Government</b>. The Commission runs a pre-departure orientation in May, an in-country orientation in Lisbon in the autumn, and a mid-year forum in March.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Grant length</div><div className="v">9 months</div></div>
                        <div className="rd-stat"><div className="l">Award types</div><div className="v">4 tracks</div></div>
                        <div className="rd-stat"><div className="l">Degree needed</div><div className="v">Bachelor&apos;s</div></div>
                        <div className="rd-stat"><div className="l">Housing</div><div className="v">You arrange</div></div>
                      </div>
                      <span className="res-flag yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Carries a visa and a defined legal status for the grant period</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You hold a bachelor&apos;s and want a funded year</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You have a research or teaching project in mind</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You want a soft landing before committing</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You already hold a doctorate, use the Scholar Program instead</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need to move within twelve months</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You are relocating a whole household permanently</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Apply roughly a year ahead.</b> The US Student Program cycle opens in spring for the following academic year.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>If you are enrolled at a US institution</b>, you apply through your campus Fulbright Program Adviser, not directly.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>The grant does not extend.</b> Funding covers nine months only, and any stay either side is on you, including visa and insurance.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>It is a credible bridge.</b> A Fulbright year builds the host institution relationships that make a later D4 or research post realistic.</li>
                      </ul>
                      <div className="links" style={{marginTop: '14px'}}>
                        <a className="lnk" href="https://us.fulbrightonline.org/countries/europe-and-eurasia/portugal" target="_blank" rel="noopener noreferrer">Fulbright US Student, Portugal awards <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                        <a className="lnk" href="https://fulbrightscholars.org" target="_blank" rel="noopener noreferrer">Fulbright Scholar Program <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Erasmus Mundus */}
                <div className="route">
                  <span className="ic i-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Erasmus Mundus Joint Masters</div><div className="route-desc">EU-funded masters delivered jointly by universities in at least three countries</div></div><span className="pill p-pop">Fully funded</span></div>
                    <div className="route-meta"><span>1 to 2 academic years</span><span>Tuition plus monthly stipend</span><span>Apply October to January</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">You do not apply to Erasmus Mundus in general. You pick a specific joint masters from the official catalogue and <b>apply directly to the consortium running it</b>, and the scholarship is awarded to the best-ranked applicants within that programme. Each degree involves at least three institutions in three countries, so you study in more than one place and receive either a joint degree or multiple degrees. Several consortia include Portuguese universities.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Stipend</div><div className="v">EUR 1,100–1,500 / mo</div></div>
                        <div className="rd-stat"><div className="l">Duration</div><div className="v">60–120 ECTS</div></div>
                        <div className="rd-stat"><div className="l">Also covers</div><div className="v">Tuition, travel, visa</div></div>
                        <div className="rd-stat"><div className="l">Apply by</div><div className="v">Oct to Jan</div></div>
                      </div>
                      <span className="res-flag yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Enrollment supports a D4 student visa in the Portuguese leg</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You want a masters with no tuition cost</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You are open to living in more than one country</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Non-EU applicants receive the larger awards</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need to stay in one country for a residency clock</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You are moving with a family that cannot relocate twice</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You already hold an Erasmus Mundus scholarship</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>The catalogue refreshes annually</b>, so a programme that existed last year may not run this year. Check the current list before planning around one.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Deadlines vary by consortium</b>, mostly December and January but some run to March or May.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Moving between countries breaks residency continuity.</b> If citizenship in one country is your goal, weigh that carefully.</li>
                      </ul>
                      <div className="links" style={{marginTop: '14px'}}>
                        <a className="lnk" href="https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters" target="_blank" rel="noopener noreferrer">Erasmus Mundus overview <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                        <a className="lnk" href="https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en" target="_blank" rel="noopener noreferrer">Programme catalogue <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Visa */}
                <div className="route">
                  <span className="ic i-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">Tech Visa (D3)</div><div className="route-desc">Fast-track hiring route for highly qualified staff at IAPMEI-certified companies</div></div><span className="pill p-new">Employer led</span></div>
                    <div className="route-meta"><span>Employer must be certified</span><span>Bachelor&apos;s or 5 years experience</span><span>Carries a tax regime</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">The certification sits with the <b>company, not with you</b>. A Portuguese employer applies to IAPMEI and, once certified, can issue a digital term of responsibility that you present at the consulate to obtain a highly skilled worker visa on a simplified track. Certification lasts two years and is renewable. Your job is to find a certified employer, so ask about Tech Visa status during interviews.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">You need</div><div className="v">Degree or 5 yrs</div></div>
                        <div className="rd-stat"><div className="l">Language</div><div className="v">PT, EN, FR or ES</div></div>
                        <div className="rd-stat"><div className="l">Visa category</div><div className="v">D3</div></div>
                        <div className="rd-stat"><div className="l">Tax regime</div><div className="v">IFICI, 20% flat</div></div>
                      </div>
                      <span className="res-flag yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Full residency route with work rights from day one</span>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>The tax regime is the real prize.</b> Qualifying roles can access a flat 20% rate for up to ten consecutive years, which changes the maths on accepting a lower gross salary.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Certified companies are capped</b> at hiring no more than half their workforce under the scheme, so a small startup may have no slots.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Ask early in the process.</b> An employer who is not certified can apply, but that adds months to your start date.</li>
                      </ul>
                      <div className="links" style={{marginTop: '14px'}}>
                        <a className="lnk" href="https://startupportugal.com/programs/tech-visa/" target="_blank" rel="noopener noreferrer">Tech Visa program <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                        <a className="lnk" href="https://www.iapmei.pt" target="_blank" rel="noopener noreferrer">IAPMEI <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* StartUP Visa */}
                <div className="route">
                  <span className="ic i-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2c3 3 4.5 6.5 4.5 10L12 22l-4.5-10C7.5 8.5 9 5 12 2z" /><circle cx="12" cy="10" r="2" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">StartUP Visa</div><div className="route-desc">Residency route for founders relocating or launching an innovative business</div></div><span className="pill p-cx">Incubator gated</span></div>
                    <div className="route-meta"><span>Incubator approval required</span><span>Max 5 founders per project</span><span>IAPMEI reviews in ~30 days</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">You apply on the IAPMEI platform, and the gate is an <b>accredited incubator</b>: at least one must agree to host your project before IAPMEI will assess it. There are over a hundred certified incubators nationally. The business must be technology or knowledge based, capable of scaling beyond Portugal, and projected to reach roughly EUR 325,000 in annual revenue or assets within five years. If you are relocating rather than founding fresh, the business must have started outside Portugal.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Funds per founder</div><div className="v">~EUR 5,150+</div></div>
                        <div className="rd-stat"><div className="l">Founders allowed</div><div className="v">Up to 5</div></div>
                        <div className="rd-stat"><div className="l">5 year target</div><div className="v">EUR 325k</div></div>
                        <div className="rd-stat"><div className="l">Typical timeline</div><div className="v">3+ months</div></div>
                      </div>
                      <span className="res-flag maybe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>Residency route, but pays nothing. You fund yourself.</span>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Get incubator quotes before you build the application.</b> They charge for services and terms vary widely.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Proof of funds figures track the IAS index</b> and move annually. Verify the current amount before you transfer anything.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Compare against the D2.</b> Both suit founders. StartUP Visa adds incubator structure and credibility, D2 gives you more freedom over the business model.</li>
                      </ul>
                      <div className="links" style={{marginTop: '14px'}}>
                        <a className="lnk" href="https://startupportugal.com/programs/startup-visa/" target="_blank" rel="noopener noreferrer">StartUP Visa program <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{height: '1px', background: 'var(--line)', margin: '22px 0'}}></div>
                <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8h14l-3-3M21 16H7l3 3" /></svg></span>Available in a neighbouring country, not Portugal</div>
                <div className="flagnote">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>
                  <span><b>NALCAP is a Spanish government program and has no Portuguese equivalent.</b> We surface it here because Spain is your second-ranked match at 84%, and this is one of the most accessible funded routes into Europe for a US citizen. Portugal has no comparable national language assistant scheme, so the nearest local alternatives are international school posts and private language academies.</span>
                </div>

                {/* NALCAP */}
                <div className="route">
                  <span className="ic i-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h10M8 4v2M10 6c0 4-3 8-7 9M6 11c1.5 3 4 5 7 6M13 20l4-11 4 11M14.5 16.5h5" /></svg></span>
                  <div className="route-main">
                    <div className="route-top"><div><div className="route-name">NALCAP <span style={{fontSize: '11px', fontWeight: '600', color: 'var(--muted)'}}>· Spain</span></div><div className="route-desc">North American Language and Culture Assistants Program, run by Spain&apos;s Ministry of Education</div></div><span className="pill p-warn">Spain only</span></div>
                    <div className="route-meta"><span>EUR 800 to 1,000 / mo</span><span>14 to 16 hours a week</span><span>Ages 18 to 45</span></div>
                    <button className="more-btn" aria-expanded="false"><span className="ml">More detail</span><svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg></button>
                    <div className="route-detail" hidden>
                      <div className="rd-h">How it works</div>
                      <p className="rd-p">You are placed in a Spanish public school as an <b>auxiliar de conversación</b>, assisting a Spanish teacher rather than running a classroom. Placements run across essentially every region, and the assignment is regional first, with the individual school confirmed later. Roughly 2,500 US and Canadian citizens are placed each year, and around 40,000 have been through the program since it began. The stipend and the hours vary by region.</p>
                      <div className="rd-grid">
                        <div className="rd-stat"><div className="l">Stipend</div><div className="v">EUR 800–1,000 / mo</div></div>
                        <div className="rd-stat"><div className="l">Term</div><div className="v">Roughly Nov to May</div></div>
                        <div className="rd-stat"><div className="l">Hours</div><div className="v">14–16 / week</div></div>
                        <div className="rd-stat"><div className="l">Includes</div><div className="v">Health insurance</div></div>
                      </div>
                      <span className="res-flag yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>Comes with a Spanish long-stay student visa. Does not apply to Portugal.</span>
                      <div className="rd-cols" style={{marginTop: '16px'}}>
                        <div>
                          <div className="rd-h">Good fit if</div>
                          <ul className="rd-list">
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You hold a bachelor&apos;s and are under 45</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You want a low-barrier funded year in Europe</li>
                            <li className="y"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>You are flexible about which region you land in</li>
                          </ul>
                        </div>
                        <div>
                          <div className="rd-h">Poor fit if</div>
                          <ul className="rd-list">
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>Portugal specifically is the goal</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>The stipend must support a family</li>
                            <li className="n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" /></svg>You need a full twelve month contract</li>
                          </ul>
                        </div>
                      </div>
                      <div className="rd-h">Worth knowing</div>
                      <ul className="rd-list">
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Apply the moment it opens.</b> The window runs from late January or early February to around early April, and placements are assigned in application order, so early applicants get better regions.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Flights are not covered</b>, and the stipend is a living allowance rather than a salary.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>You can apply to this and a Fulbright ETA in the same cycle.</b> Many advisers recommend doing exactly that, since the Fulbright is far more competitive.</li>
                        <li className="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg><b>Spanish time on this visa counts toward Spanish residency</b>, not Portuguese. Switching countries later restarts the clock.</li>
                      </ul>
                      <div className="links" style={{marginTop: '14px'}}>
                        <a className="lnk" href="https://www.educacionfpydeportes.gob.es/eeuu/convocatorias-programas/convocatorias-eeuu/nalcap.html" target="_blank" rel="noopener noreferrer">NALCAP official page <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{height: '1px', background: 'var(--line)', margin: '22px 0'}}></div>
                <div className="subh"><span className="sq"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Also worth checking</div>
                <table className="tbl">
                  <thead><tr><th>Funder</th><th>What they fund</th><th className="num">Window</th><th className="num">Link</th></tr></thead>
                  <tbody>
                    <tr className="hi"><td>FCT</td><td>PhD studentships across all scientific domains, open to any nationality. The 2026 call carried 1,600 grants and a EUR 145 million budget.</td><td className="num">March</td><td className="num"><a className="route-src" href="https://www.fct.pt/en/" target="_blank" rel="noopener noreferrer">fct.pt <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9" /></svg></a></td></tr>
                    <tr><td>Calouste Gulbenkian Foundation</td><td>Scholarships and fellowships across research, arts, and higher education, including short residencies</td><td className="num">Rolling</td><td className="num"><a className="route-src" href="https://gulbenkian.pt/en/bolsas-lista/" target="_blank" rel="noopener noreferrer">gulbenkian.pt <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9" /></svg></a></td></tr>
                    <tr><td>EURAXESS Portugal</td><td>Funded research posts and doctoral positions across Portugal and the EU</td><td className="num">Rolling</td><td className="num"><a className="route-src" href="https://www.euraxess.pt" target="_blank" rel="noopener noreferrer">euraxess.pt <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9" /></svg></a></td></tr>
                    <tr><td>Fulbright-Schuman</td><td>Study and research specifically on US-EU relations and EU policy, for US and EU citizens</td><td className="num">Autumn</td><td className="num"><a className="route-src" href="https://fulbrightschuman.eu" target="_blank" rel="noopener noreferrer">fulbrightschuman.eu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-9 9" /></svg></a></td></tr>
                  </tbody>
                </table>
                <div className="src"><span>Links verified: January 2026 · Program terms, stipends, and deadlines change annually, so confirm the current cycle before planning around any figure here</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 8. CREDENTIAL RECOGNITION */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">8</span><h2>Degree and Professional Credential Recognition</h2></div></div>
                <p className="lead">Recognising a degree and being licensed to practise a profession are two separate processes. Most people only need the first.</p>
                <div className="det-grid">
                  <div className="det"><div className="h">Automatic recognition</div><div className="b">Applies where your qualification already matches a listed Portuguese degree. Fastest route, handled by the Directorate-General for Higher Education.</div></div>
                  <div className="det"><div className="h">Level recognition</div><div className="b">Confirms your degree sits at bachelor, masters, or doctorate level without matching a specific programme. <b>Sufficient for most employers</b> and for visa filings.</div></div>
                  <div className="det"><div className="h">Specific recognition</div><div className="b">A full academic comparison against a named Portuguese degree, assessed by a university. Slower, and only needed for regulated professions or further study.</div></div>
                  <div className="det"><div className="h">Regulated professions</div><div className="b">Medicine, nursing, law, architecture, engineering, and teaching all require registration with the professional order, plus <b>Portuguese language competence</b>. Budget a year or more.</div></div>
                  <div className="det"><div className="h">Documents needed</div><div className="b">Degree certificate and transcript, both apostilled and translated by a certified translator. Same apostille pipeline as your visa documents, so do them together.</div></div>
                  <div className="det"><div className="h">Timeline and cost</div><div className="b">Level recognition typically runs one to three months and costs a modest fee. Specific recognition can take six months or more.</div></div>
                </div>
                <div className="callout ok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" /></svg>
                  <span><b>If you are working remotely for non-Portuguese clients, you do not need recognition at all.</b> It matters for local employment, further study, and regulated professions only. Do not let it block your timeline if none of those apply.</span>
                </div>
                <div className="src"><span>Last verified: January 2026 · Direção-Geral do Ensino Superior, NARIC Portugal</span><span className="sbadge">Official source verified</span></div>
              </section>
            </div>
  )
}
