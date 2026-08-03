import Link from 'next/link'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import { CityCardImage } from '@/components/country-template/CityCardImage'
import { getCountryVisualAssets } from '@/lib/country-visuals/data'

/* Converted from the approved index.html mockup. Markup is verbatim.
   Content is still literal Portugal copy: replace with `content.*` per
   section as the model is extended. See README step 4. */
export function OverviewTab({ slug }: { slug: string }) {
  const assets = getCountryVisualAssets(slug)
  const snap = assets?.snapshotMap
  return (
      <div className="tabpanel on" id="p-overview">

              {/* 1. COUNTRY SNAPSHOT */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">1</span><h2>Country Snapshot</h2></div>
                  <Link className="sec-link" href={`/nextinations/${slug}/v2/lifestyle-community`}>Full daily life <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                </div>
                <div className="snap-top">
                  <div className="narrative">
                    <p className="eyebrow">What Portugal is like</p>
                    <p className="body">Portugal sits on the Atlantic edge of Western Europe with a mild climate, a long coastline, and costs that still run below the EU average. It became a magnet for remote workers and retirees because it solved three problems at once: it is affordable, English is widely spoken in cities, and it wrote residency law that non-EU nationals can actually qualify for.</p>
                    <p className="body"><b>Lisbon and Porto carry the infrastructure</b>, the international schools, and the expat density. The Algarve trades winter quiet for summer tourism. The Alentejo and the interior are where your money goes twice as far, if you can live 40 minutes from a hospital.</p>
                    <div className="pull"><b>The honest tradeoff:</b> everyone else figured this out too. Lisbon rents have climbed steeply since 2019, and the bureaucracy runs on its own clock regardless of how prepared you are.</div>
                  </div>
                  <div className="map-col">
                    <Link className="map-card" href="/destinations/regions/europe?focus=portugal" aria-label="Open the interactive map of Portugal">
                      <span className="cmap">
                        {snap
                          ? <CountrySnapshotMap countryName="Portugal" countryCode="PT" lat={snap.center[1]} lng={snap.center[0]} cityName={snap.capital?.name} alt="Locator map of Portugal" fallback="locator" />
                          : <span className="map-fallback">Map of Portugal</span>}
                      </span>
                      <span className="map-expand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 3H3v6M21 15v6h-6M3 3l7 7M21 21l-7-7" /></svg></span>
                      <span className="map-foot">
                        <span><span className="t">Portugal, Western Europe</span><span className="s">Atlantic coast · borders Spain</span></span>
                        <span className="go">Explore <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" width="11" height="11"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                      </span>
                    </Link>
                    <div className="env">
                      <div className="env-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M4 6l16 12M20 6L4 18" /></svg><span><span className="l">Average winter</span><span className="v">16°C</span></span><span className="r">mild,<br />often wet</span></div>
                      <div className="env-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg><span><span className="l">Average summer</span><span className="v">28°C</span></span><span className="r">dry,<br />sea breeze</span></div>
                      <div className="env-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><span><span className="l">Time difference</span><span className="v">+8 hrs</span></span><span className="r">from<br />Sacramento</span></div>
                    </div>
                  </div>
                </div>
                <div className="facts">
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" /></svg><div><div className="l">Capital</div><div className="v">Lisbon</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2" /><path d="M2 20a7 7 0 0114 0M16 5.5a3 3 0 010 5.6M17.5 20a5.5 5.5 0 00-1-3.2" /></svg><div><div className="l">Population</div><div className="v">10.6 million</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M15 9.5a3.5 3.5 0 100 5M9 12h3" /></svg><div><div className="l">Currency</div><div className="v">Euro (EUR)</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h10M8 4v2M10 6c0 4-3 8-7 9M6 11c1.5 3 4 5 7 6M13 20l4-11 4 11M14.5 16.5h5" /></svg><div><div className="l">Language</div><div className="v">Portuguese</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M4 21V10h16v11M12 3l9 5H3z" /></svg><div><div className="l">Government</div><div className="v">Republic</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><div><div className="l">Time zone</div><div className="v">GMT (UTC+0)</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 16V9l2-4h12l2 4v7M4 16h16M4 16v2M20 16v2" /><circle cx="8" cy="13" r="1.2" /><circle cx="16" cy="13" r="1.2" /></svg><div><div className="l">Driving side</div><div className="v">Right</div></div></div>
                  <div className="fact yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l8 3.6v6.1c0 4.6-3.3 8.7-8 10.3-4.7-1.6-8-5.7-8-10.3V5.6z" /><path d="M9 12l2 2 4-4" /></svg><div><div className="l">Schengen Area</div><div className="v">Yes</div></div></div>
                  <div className="fact yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg><div><div className="l">EU member</div><div className="v">Yes</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg><div><div className="l">Climate</div><div className="v">Mediterranean</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 2v6M15 2v6M6 8h12v2a6 6 0 01-12 0zM12 16v6" /></svg><div><div className="l">Plug type</div><div className="v">Type C / F</div></div></div>
                  <div className="fact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L4 14h7l-2 8 9-12h-7z" /></svg><div><div className="l">Electricity</div><div className="v">230V · 50Hz</div></div></div>
                </div>
                <div className="src"><span>Last verified: January 2026 · World Bank, Eurostat, Instituto Nacional de Estatística</span><span className="sbadge">Official source verified</span></div>
              </section>

              {/* 2. TOP CITIES */}
              <section className="card-surface sec" id="top-cities">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">2</span><h2>Top Cities to Live</h2></div>
                  <Link className="sec-link" href={`/nextinations/${slug}/v2/overview#top-cities`}>View all cities <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                </div>
                <div className="cities">
                  <article className="city">
                    <div className="city-map">
                      <span className="cmap"><CityCardImage imageSrc="/images/countries/portugal/cities/lisbon.webp" cityName="Lisbon" countryName="Portugal" countryCode="PT" className="city-photo" /></span>
                      <span className="city-flag"><span className="flag sm" role="img" aria-label="Portugal"><svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="360" height="600" fill="#006600" /><rect x="360" width="540" height="600" fill="#DA291C" /><g transform="translate(360 300)" fill="none" stroke="#FFE900" strokeWidth="15"><circle r="108" /><ellipse rx="108" ry="42" /><ellipse rx="42" ry="108" /><ellipse rx="108" ry="42" transform="rotate(38)" /><ellipse rx="108" ry="42" transform="rotate(-38)" /><path d="M-108 0H108" /></g><g transform="translate(360 300)"><path d="M-52-70h104v78c0 44-38 68-52 76-14-8-52-32-52-76z" fill="#DA291C" stroke="#fff" strokeWidth="13" /><path d="M-31-46h62v54c0 28-22 44-31 50-9-6-31-22-31-50z" fill="#fff" /><g fill="#003399"><rect x="-9" y="-38" width="18" height="26" rx="3" /><rect x="-9" y="12" width="18" height="26" rx="3" /><rect x="-34" y="-13" width="18" height="26" rx="3" /><rect x="16" y="-13" width="18" height="26" rx="3" /></g></g></svg><img src="https://flagcdn.com/pt.svg" alt="" /></span></span><span className="city-tag">Most infrastructure</span>
                    </div>
                    <div className="city-body">
                      <div className="city-name">Lisbon</div><div className="city-sub">Lisboa region · Coastal capital</div>
                      <div className="city-rows">
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2" /><path d="M2 20a7 7 0 0114 0" /></svg>Population</span><span className="val">548,000</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></svg>Average rent</span><span className="val">EUR 750–1,400</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 4l-2 6h4l-2 10" /><circle cx="12" cy="12" r="9" /></svg>Walk score</span><span className="val">84 / 100</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h6" /></svg>Data status</span><span className="val soft">Verified</span></div>
                      </div>
                      <div className="city-why">Pick this if you need international schools, consulate access, and a real expat network from day one.</div>
                      <Link className="city-cta" href={`/nextinations/${slug}/v2/overview#top-cities`}>View Lisbon details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                    </div>
                  </article>
                  <article className="city">
                    <div className="city-map">
                      <span className="cmap"><CityCardImage imageSrc="/images/countries/portugal/cities/porto.webp" cityName="Porto" countryName="Portugal" countryCode="PT" className="city-photo" /></span>
                      <span className="city-flag"><span className="flag sm" role="img" aria-label="Portugal"><svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="360" height="600" fill="#006600" /><rect x="360" width="540" height="600" fill="#DA291C" /><g transform="translate(360 300)" fill="none" stroke="#FFE900" strokeWidth="15"><circle r="108" /><ellipse rx="108" ry="42" /><ellipse rx="42" ry="108" /><ellipse rx="108" ry="42" transform="rotate(38)" /><ellipse rx="108" ry="42" transform="rotate(-38)" /><path d="M-108 0H108" /></g><g transform="translate(360 300)"><path d="M-52-70h104v78c0 44-38 68-52 76-14-8-52-32-52-76z" fill="#DA291C" stroke="#fff" strokeWidth="13" /><path d="M-31-46h62v54c0 28-22 44-31 50-9-6-31-22-31-50z" fill="#fff" /><g fill="#003399"><rect x="-9" y="-38" width="18" height="26" rx="3" /><rect x="-9" y="12" width="18" height="26" rx="3" /><rect x="-34" y="-13" width="18" height="26" rx="3" /><rect x="16" y="-13" width="18" height="26" rx="3" /></g></g></svg><img src="https://flagcdn.com/pt.svg" alt="" /></span></span><span className="city-tag">Best value</span>
                    </div>
                    <div className="city-body">
                      <div className="city-name">Porto</div><div className="city-sub">Norte region · River city</div>
                      <div className="city-rows">
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2" /><path d="M2 20a7 7 0 0114 0" /></svg>Population</span><span className="val">231,000</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></svg>Average rent</span><span className="val">EUR 550–900</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 4l-2 6h4l-2 10" /><circle cx="12" cy="12" r="9" /></svg>Walk score</span><span className="val">79 / 100</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h6" /></svg>Data status</span><span className="val soft">Verified</span></div>
                      </div>
                      <div className="city-why">Real city amenities at roughly two thirds of Lisbon cost. Colder, wetter, slower social entry.</div>
                      <Link className="city-cta" href={`/nextinations/${slug}/v2/overview#top-cities`}>View Porto details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                    </div>
                  </article>
                  <article className="city">
                    <div className="city-map">
                      <span className="cmap"><CityCardImage imageSrc="/images/countries/portugal/cities/funchal.webp" cityName="Funchal" countryName="Portugal" countryCode="PT" className="city-photo" /></span>
                      <span className="city-flag"><span className="flag sm" role="img" aria-label="Portugal"><svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="360" height="600" fill="#006600" /><rect x="360" width="540" height="600" fill="#DA291C" /><g transform="translate(360 300)" fill="none" stroke="#FFE900" strokeWidth="15"><circle r="108" /><ellipse rx="108" ry="42" /><ellipse rx="42" ry="108" /><ellipse rx="108" ry="42" transform="rotate(38)" /><ellipse rx="108" ry="42" transform="rotate(-38)" /><path d="M-108 0H108" /></g><g transform="translate(360 300)"><path d="M-52-70h104v78c0 44-38 68-52 76-14-8-52-32-52-76z" fill="#DA291C" stroke="#fff" strokeWidth="13" /><path d="M-31-46h62v54c0 28-22 44-31 50-9-6-31-22-31-50z" fill="#fff" /><g fill="#003399"><rect x="-9" y="-38" width="18" height="26" rx="3" /><rect x="-9" y="12" width="18" height="26" rx="3" /><rect x="-34" y="-13" width="18" height="26" rx="3" /><rect x="16" y="-13" width="18" height="26" rx="3" /></g></g></svg><img src="https://flagcdn.com/pt.svg" alt="" /></span></span><span className="city-tag">Island living</span>
                    </div>
                    <div className="city-body">
                      <div className="city-name">Funchal</div><div className="city-sub">Madeira · Atlantic island</div>
                      <div className="city-rows">
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2" /><path d="M2 20a7 7 0 0114 0" /></svg>Population</span><span className="val">105,000</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></svg>Average rent</span><span className="val">EUR 600–950</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 4l-2 6h4l-2 10" /><circle cx="12" cy="12" r="9" /></svg>Walk score</span><span className="val">71 / 100</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h6" /></svg>Data status</span><span className="val soft">Verified</span></div>
                      </div>
                      <div className="city-why">Mild year round with an established nomad scene. Mainland travel means a flight, healthcare is thinner.</div>
                      <Link className="city-cta" href={`/nextinations/${slug}/v2/overview#top-cities`}>View Funchal details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                    </div>
                  </article>
                  <article className="city">
                    <div className="city-map">
                      <span className="cmap"><CityCardImage imageSrc="/images/countries/portugal/cities/braga.webp" cityName="Braga" countryName="Portugal" countryCode="PT" className="city-photo" /></span>
                      <span className="city-flag"><span className="flag sm" role="img" aria-label="Portugal"><svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="360" height="600" fill="#006600" /><rect x="360" width="540" height="600" fill="#DA291C" /><g transform="translate(360 300)" fill="none" stroke="#FFE900" strokeWidth="15"><circle r="108" /><ellipse rx="108" ry="42" /><ellipse rx="42" ry="108" /><ellipse rx="108" ry="42" transform="rotate(38)" /><ellipse rx="108" ry="42" transform="rotate(-38)" /><path d="M-108 0H108" /></g><g transform="translate(360 300)"><path d="M-52-70h104v78c0 44-38 68-52 76-14-8-52-32-52-76z" fill="#DA291C" stroke="#fff" strokeWidth="13" /><path d="M-31-46h62v54c0 28-22 44-31 50-9-6-31-22-31-50z" fill="#fff" /><g fill="#003399"><rect x="-9" y="-38" width="18" height="26" rx="3" /><rect x="-9" y="12" width="18" height="26" rx="3" /><rect x="-34" y="-13" width="18" height="26" rx="3" /><rect x="16" y="-13" width="18" height="26" rx="3" /></g></g></svg><img src="https://flagcdn.com/pt.svg" alt="" /></span></span><span className="city-tag">Lowest cost</span>
                    </div>
                    <div className="city-body">
                      <div className="city-name">Braga</div><div className="city-sub">Norte region · University town</div>
                      <div className="city-rows">
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2" /><path d="M2 20a7 7 0 0114 0" /></svg>Population</span><span className="val">193,000</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></svg>Average rent</span><span className="val">EUR 400–700</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 4l-2 6h4l-2 10" /><circle cx="12" cy="12" r="9" /></svg>Walk score</span><span className="val">76 / 100</span></div>
                        <div className="city-row"><span className="k"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h6" /></svg>Data status</span><span className="val soft">Researching</span></div>
                      </div>
                      <div className="city-why">Cheapest of the four with a young university population. Expect to need Portuguese much sooner.</div>
                      <Link className="city-cta" href={`/nextinations/${slug}/v2/overview#top-cities`}>View Braga details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                    </div>
                  </article>
                </div>
                <p className="note">City order reflects your stated priorities: affordability first, then family infrastructure.</p>
              </section>

              {/* 3. WHY PEOPLE MOVE */}
              <section className="card-surface sec">
                <div className="sec-head"><div className="sec-title"><span className="sec-num">3</span><h2>Why People Move to Portugal</h2></div></div>
                <div className="reasons">
                  <article className="reason r1"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5a2.6 2.6 0 00-2.5-1.5c-1.4 0-2.5.8-2.5 2s1.1 2 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.6 2.6 0 01-2.5-1.5M12 6v12" /></svg></span><h3>Affordable living</h3><p>Costs run below the Western European average, especially outside Lisbon.</p></article>
                  <article className="reason r2"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg></span><h3>Great weather</h3><p>Temperate Atlantic climate. Lisbon averages close to 300 sunny days a year.</p></article>
                  <article className="reason r3"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20a7 7 0 0114 0M15 20a5.5 5.5 0 016-4.8" /></svg></span><h3>Welcoming community</h3><p>Long multicultural history and diaspora ties, with large established expat networks.</p></article>
                  <article className="reason r4"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V8l8-4 8 4v13" /><path d="M12 9v6M9 12h6" /></svg></span><h3>Quality healthcare</h3><p>SNS gives universal coverage to legal residents, with a fast, cheap private tier alongside.</p></article>
                  <article className="reason r5"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12.5a10 10 0 0114 0M8.5 16a5.5 5.5 0 017 0M12 19.5h.01" /></svg></span><h3>Remote work friendly</h3><p>One of Europe&apos;s most active nomad hubs, with coworking in every major city.</p></article>
                  <article className="reason r6"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V10h14v11M12 3l9 5H3z" /><path d="M9 21v-5h6v5" /></svg></span><h3>Rich culture</h3><p>Reserved but warm social norms, deep food traditions, and late, long evenings.</p></article>
                </div>
              </section>

              {/* 4. LIFESTYLE SUMMARY */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">4</span><h2>General Lifestyle Summary</h2></div>
                  <Link className="sec-link" href={`/nextinations/${slug}/v2/lifestyle-community`}>Full daily life detail <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                </div>
                <div className="life">
                  <div>
                    <p className="eyebrow">What a normal weekday looks like</p>
                    <div className="day">
                      <div className="day-row"><span className="day-time">Morning</span><span className="day-txt">Coffee standing at the counter for under two euros. <b>Shops open late</b>, usually 9:30 or 10, and small businesses still close for lunch.</span></div>
                      <div className="day-row"><span className="day-time">Midday</span><span className="day-txt">Lunch is the real meal. Most restaurants run a fixed price <b>prato do dia</b> between 8 and 12 euros, and the pace slows for an hour or more.</span></div>
                      <div className="day-row"><span className="day-time">Afternoon</span><span className="day-txt">Bureaucracy happens now or not at all. Government offices are appointment-only and rarely open past 4.</span></div>
                      <div className="day-row"><span className="day-time">Evening</span><span className="day-txt">Dinner starts at 8 and often later. <b>Socializing runs late</b> and is built around long tables rather than short drinks.</span></div>
                      <div className="day-row"><span className="day-time">Weekend</span><span className="day-txt">Beach, market, or an interior day trip. Sunday is genuinely quiet and a lot stays closed.</span></div>
                    </div>
                    <div className="surprise">
                      <p className="eyebrow">What surprises people</p>
                      <ul>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Homes are cold in winter.</b> Central heating is rare and older stock holds damp, so indoor comfort is worse than the temperature suggests.</span></li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>Everything runs on the NIF.</b> Your tax number gates renting, banking, phone contracts, and utilities.</span></li>
                        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg><span><b>English gets you in, not through.</b> Cities are easy. Healthcare admin, landlords, and anywhere rural expect Portuguese.</span></li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow">Lifestyle at a glance</p>
                    <div className="gauge">
                      <div><div className="g-top"><span className="g-l">Pace of life</span><span className="g-v">Slow and unhurried</span></div><div className="g-track"><i style={{width: '82%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Getting by in English</span><span className="g-v">Easy in cities</span></div><div className="g-track"><i style={{width: '78%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Walkability</span><span className="g-v">High, but very hilly</span></div><div className="g-track"><i style={{width: '80%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Outdoor access</span><span className="g-v">Coast and trails year round</span></div><div className="g-track"><i style={{width: '88%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Making local friends</span><span className="g-v">Slow, warm once inside</span></div><div className="g-track"><i className="warn" style={{width: '52%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Indoor winter comfort</span><span className="g-v">Poor insulation, damp</span></div><div className="g-track"><i className="warn" style={{width: '34%'}}></i></div></div>
                      <div><div className="g-top"><span className="g-l">Admin and bureaucracy</span><span className="g-v">Slow, appointment-gated</span></div><div className="g-track"><i className="warn" style={{width: '30%'}}></i></div></div>
                    </div>
                    <p className="note">Scores are editorial assessments, not survey data. They are directional and built for comparison between countries.</p>
                  </div>
                </div>
                <div className="src"><span>Last verified: January 2026 · Editorial synthesis of resident-reported conditions</span><span className="sbadge rev">Editorially reviewed</span></div>
              </section>

              {/* 5. WAYS IN */}
              <section className="card-surface sec">
                <div className="sec-head">
                  <div className="sec-title"><span className="sec-num">5</span><h2>Your Ways In</h2></div>
                  <Link className="sec-link" href={`/nextinations/${slug}/v2/move-there`}>See all pathways <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                </div>
                <p className="note" style={{margin: '0 0 14px', color: 'var(--muted)'}}>Five routes you qualify for, across three different strategies. A visa is one way in, not the only one.</p>
                <div className="chips">
                  <button className="chip"><span className="ic i-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg></span><span><span className="t">D8 digital nomad</span><span className="d">Best match · 1 to 2 months</span></span></button>
                  <button className="chip"><span className="ic i-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1z" /></svg></span><span><span className="t">D7 passive income</span><span className="d">Popular · 2 to 4 months</span></span></button>
                  <button className="chip"><span className="ic i-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg></span><span><span className="t">D2 entrepreneur</span><span className="d">Complex · 3 to 6 months</span></span></button>
                  <button className="chip"><span className="ic i-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-6h6v6" /></svg></span><span><span className="t">Buy property</span><span className="d">No longer a visa route</span></span></button>
                  <button className="chip"><span className="ic i-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016-4.6" /></svg></span><span><span className="t">Co-living &amp; shared</span><span className="d">EUR 480 to 900 / mo</span></span></button>
                  <button className="chip"><span className="ic i-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg></span><span><span className="t">Housing co-ops</span><span className="d">Cooperativa de habitação</span></span></button>
                </div>
              </section>
            </div>
  )
}
