import Link from 'next/link'
import Image from 'next/image'
import type { CountryDetail } from '@/lib/countries'
import type { CountryFacts } from '@/lib/country-workspace/country-facts'

/* Data-driven country hero. Every value comes from the country's own verified
   record (COUNTRIES) and snapshot facts — no hardcoded single-country copy and
   no personalized figures (Match Score requires a completed profile, so it is
   not shown here). Server component: navigation uses Link, not a router. */

function snapshotValue(facts: CountryFacts | null, label: string) {
  return facts?.snapshot.find((fact) => fact.label === label)?.value ?? null
}

function currencySymbol(facts: CountryFacts | null) {
  const currency = snapshotValue(facts, 'Currency') ?? ''
  const code = currency.match(/\(([A-Z]{3})\)/)?.[1] ?? ''
  return { EUR: '€', USD: '$', GBP: '£' }[code] ?? (code ? `${code} ` : '')
}

export function CountryHero({ slug, country, facts }:
  { slug: string; country: CountryDetail; facts: CountryFacts | null }) {
  const capital = snapshotValue(facts, 'Capital') ?? country.city
  const schengen = snapshotValue(facts, 'Schengen Area') === 'Yes'
  const eu = snapshotValue(facts, 'EU Membership') === 'Member'
  const climate = snapshotValue(facts, 'Climate')
  const symbol = currencySymbol(facts)
  const href = (section: string) => `/nextinations/${slug}/v2/${section}`

  return (
    <section className="hero">
      <div className="hero-bg"></div><div className="scrim"></div>
      <div className="hero-body">
        <div className="hero-eyebrow">Explore this Nextination · {country.region}</div>
        <h1 className="hero-name">
          <span className="flag hero-flag" role="img" aria-label={`Flag of ${country.name}`}>
            <Image src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`} alt="" width={54} height={36} unoptimized />
          </span>
          {country.name}
        </h1>
        <p className="hero-blurb">{country.summary}</p>
        <div className="badges">
          {schengen && (
            <span className="badge-h b-sch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg> Schengen Area</span>
          )}
          {eu && (
            <span className="badge-h b-eu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 6.6l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor" stroke="none" /></svg> EU Member</span>
          )}
          {climate && (
            <span className="badge-h b-nato"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg> {climate}</span>
          )}
        </div>
      </div>
      <div className="metrics">
        <Link className="metric" href={href('move-there')} aria-label="Best route. Opens Move There.">
          <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" /></svg> Best route to research</span>
          <span className="m-v">{country.visaType}</span>
          <span className="m-n">confirm eligibility with official authorities</span>
        </Link>
        <Link className="metric" href={href('move-there')} aria-label="Typical income guide. Opens Move There.">
          <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg> Typical income guide</span>
          <span className="m-v">{symbol}{country.incomeRequired.toLocaleString()} <small>/ mo</small></span>
          <span className="m-n">editorial guide · verify current thresholds</span>
        </Link>
        <Link className="metric" href={href('cost-housing')} aria-label="Cost level. Opens Cost and Housing.">
          <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></svg> Cost level</span>
          <span className="m-v">{country.cost === '$' ? 'Lower' : 'Moderate'} <small>{country.cost}</small></span>
          <span className="m-n">enter your own figures in the Cost Calculator</span>
        </Link>
        <Link className="metric" href={href('lifestyle-community')} aria-label="Safety context. Opens Lifestyle and Community.">
          <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l8 3.6v6.1c0 4.6-3.3 8.7-8 10.3-4.7-1.6-8-5.7-8-10.3V5.6z" /></svg> Safety context</span>
          <span className="m-v">{country.safety}</span>
          <span className="m-n">capital · {capital}</span>
        </Link>
      </div>
    </section>
  )
}
