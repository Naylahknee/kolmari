import { flagSrc } from '@/lib/flags'
import Link from 'next/link'
import {
  ArrowRight, CarFront, Clock3, Coins, Globe2, Landmark, Languages,
  ShieldCheck, Stamp, SunMedium, Users,
} from 'lucide-react'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import { CityCardImage } from '@/components/country-template/CityCardImage'
import { getCountryCenter } from '@/lib/country-geo'
import { getCountryFacts } from '@/lib/country-workspace/country-facts'
import { getCountryCityOverviews } from '@/lib/country-workspace/country-cities'

type DataCountry = { slug: string; name: string; code: string; region: string; city: string }

const toCitySlug = (name: string) =>
  name.toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Fact-card icons, in the same order as the snapshot dataset (Capital,
// Population, Currency, Language, Government, Time zone, Driving, Schengen, EU,
// Climate). A generic Globe stands in past the known order.
const FACT_ICONS = [Landmark, Users, Coins, Languages, Landmark, Clock3, CarFront, ShieldCheck, Globe2, SunMedium] as const
const FACT_LABELS = ['Capital', 'Population', 'Currency', 'Official Language', 'Government', 'Time Zone', 'Driving Side', 'Schengen Area', 'EU Member', 'Climate'] as const

/*
  The paid Overview for every country except Portugal. It renders the SAME
  Kolmari Country Page Standard layout as Portugal — identical section cards,
  numbered heads, snapshot (narrative + locator + climate strip + fact grid),
  and Top Cities — driven entirely by verified reference data. Fields with no
  verified value read "Researching" rather than borrowing another country's
  figures (the data-integrity rule).
*/
export function DataOverviewTab({
  country,
  visaType,
  incomeRequired,
  summary,
}: {
  country: DataCountry
  visaType?: string
  incomeRequired?: number
  summary?: string
}) {
  const facts = getCountryFacts(country.slug)
  const center = getCountryCenter(country.slug)
  const cities = getCountryCityOverviews(country.slug)

  const factRows = facts
    ? facts.snapshot.map((f, i) => [f.label === 'EU Membership' ? 'EU Member' : f.label, f.value, FACT_ICONS[i % FACT_ICONS.length]] as const)
    : FACT_LABELS.map((label, i) => [label, label === 'Capital' ? country.city : 'Researching', FACT_ICONS[i]] as const)

  const winter = facts?.climate.find((c) => c.icon === 'winter')?.value ?? 'Researching'
  const summer = facts?.climate.find((c) => c.icon === 'summer')?.value ?? 'Researching'
  const timeDiff = facts?.climate.find((c) => c.icon === 'timeDifference')?.value ?? 'Researching'
  const hasCities = cities.length > 0

  return (
    <div className="tabpanel on" id="p-overview">
      {/* 1. COUNTRY SNAPSHOT */}
      <section className="card-surface sec">
        <div className="sec-head">
          <div className="sec-title"><span className="sec-num">1</span><h2>Country Snapshot</h2></div>
          <Link className="sec-link" href={`/nextinations/${country.slug}/v2/lifestyle-community`}>Full daily life <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
        </div>
        <div className="snap-top">
          <div className="narrative">
            <p className="eyebrow">What {country.name} is like</p>
            {summary
              ? <p className="body">{summary}</p>
              : <p className="body">Verified daily-life detail for {country.name} appears here as it is confirmed from official sources — never estimated or borrowed from another country.</p>}
          </div>
          <div className="map-col">
            <Link className="map-card" href="/your-world" aria-label={`Open the map of ${country.name}`}>
              <span className="cmap">
                {center
                  ? <CountrySnapshotMap countryName={country.name} countryCode={country.code} lat={center.lat} lng={center.lng} cityName={country.city} alt={`Locator map of ${country.name}`} fallback="locator" />
                  : <span className="map-fallback">Map of {country.name}</span>}
              </span>
              <span className="map-expand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 3H3v6M21 15v6h-6M3 3l7 7M21 21l-7-7" /></svg></span>
              <span className="map-foot">
                <span><span className="t">{country.name}, {country.region}</span><span className="s">Capital · {country.city}</span></span>
                <span className="go">Explore <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" width="11" height="11"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </span>
            </Link>
            <div className="env">
              <div className="env-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M4 6l16 12M20 6L4 18" /></svg><span><span className="l">Average winter</span><span className="v">{winter}</span></span></div>
              <div className="env-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg><span><span className="l">Average summer</span><span className="v">{summer}</span></span></div>
              <div className="env-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><span><span className="l">Time difference</span><span className="v">{timeDiff}</span></span></div>
            </div>
          </div>
        </div>
        <div className="facts">
          {factRows.map(([label, value, Icon]) => (
            <div className="fact" key={label}>
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
              <div><div className="l">{label}</div><div className={`v${value === 'Researching' ? ' soft' : ''}`}>{value}</div></div>
            </div>
          ))}
        </div>
        {facts && <div className="src"><span>Last verified: {facts.disclosure.lastVerified} · {facts.disclosure.sourceNote}</span></div>}
      </section>

      {/* 2. TOP CITIES */}
      {hasCities && (
        <section className="card-surface sec" id="top-cities">
          <div className="sec-head">
            <div className="sec-title"><span className="sec-num">2</span><h2>Top Cities to Live</h2></div>
          </div>
          <div className="cities">
            {cities.map((city) => (
              <article className="city" key={city.id}>
                <div className="city-map">
                  <span className="cmap"><CityCardImage imageSrc={`/api/country-asset?slug=${country.slug}&type=city&city=${toCitySlug(city.cityName)}`} cityName={city.cityName} countryName={country.name} countryCode={country.code} className="city-photo" /></span>
                  <span className="city-flag"><span className="flag sm" role="img" aria-label={country.name}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={flagSrc(country.code)} alt="" /></span></span>
                </div>
                <div className="city-body">
                  <div className="city-name">{city.cityName}</div>
                  {city.region && <div className="city-sub">{city.region}</div>}
                  {city.summary && <div className="city-why">{city.summary}</div>}
                </div>
              </article>
            ))}
          </div>
          <p className="note">Cities shown are the researched entries in {country.name}&rsquo;s dataset.</p>
        </section>
      )}

      {/* 3. WAYS IN */}
      <section className="card-surface sec">
        <div className="sec-head">
          <div className="sec-title"><span className="sec-num">{hasCities ? 3 : 2}</span><h2>Ways In</h2></div>
        </div>
        <div className="ways-in">
          {visaType ? (
            <>
              <p className="wi-route"><Stamp size={16} aria-hidden="true" /> Primary route: <b>{visaType}</b></p>
              {typeof incomeRequired === 'number' && incomeRequired > 0 && (
                <p className="wi-note">Typical income guideline around <b>${incomeRequired.toLocaleString()}/mo</b>. Confirm the current threshold with the official authority before planning around it.</p>
              )}
              <Link href={`/nextinations/${country.slug}/v2/move-there`} className="wi-link">See all pathways <ArrowRight size={13} aria-hidden="true" /></Link>
            </>
          ) : (
            <p className="wi-note">Residency and visa pathways for {country.name} are being verified. We show a route only once it is confirmed against the official immigration authority.</p>
          )}
        </div>
      </section>
    </div>
  )
}
