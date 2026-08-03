import Link from 'next/link'
import {
  ArrowRight, CarFront, Clock3, Coins, Globe2, Landmark, Languages,
  MapPinned, ShieldCheck, Snowflake, Stamp, Sun, SunMedium, Users,
} from 'lucide-react'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import { CityCardImage } from '@/components/country-template/CityCardImage'
import { getCountryCenter } from '@/lib/country-geo'
import { getCountryFacts } from '@/lib/country-workspace/country-facts'
import { getCountryCityOverviews } from '@/lib/country-workspace/country-cities'
import { cityAssetPath } from '@/lib/country-visuals/schema'

type DataCountry = { slug: string; name: string; code: string; city: string; region: string }

const toCitySlug = (name: string) =>
  name.toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const FACT_ICONS = [Landmark, Users, Coins, Languages, Landmark, Clock3, CarFront, ShieldCheck, Globe2, SunMedium] as const
const FACT_LABELS = ['Capital', 'Population', 'Currency', 'Official Language', 'Government', 'Time Zone', 'Driving Side', 'Schengen Area', 'EU Member', 'Climate'] as const

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-7 place-items-center rounded-full bg-navy-deep text-xs font-bold text-white">{number}</span>
      <h2 className="text-xl font-bold text-navy">{title}</h2>
    </div>
  )
}

/*
  The paid Overview for every country except Portugal. Same rich frame, driven
  entirely by verified reference data (getCountryFacts) with real maps. Where a
  country has no verified dataset yet, each field reads "Researching" rather than
  borrowing another country's figures — the data-integrity rule.
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
    ? facts.snapshot.map((f, i) => [f.label === 'EU Membership' ? 'EU Member' : f.label, f.value, FACT_ICONS[i]] as const)
    : FACT_LABELS.map((label, i) => [label, label === 'Capital' ? country.city : 'Researching', FACT_ICONS[i]] as const)

  const winterTemp = facts?.climate.find((c) => c.icon === 'winter')?.value ?? 'Researching'
  const summerTemp = facts?.climate.find((c) => c.icon === 'summer')?.value ?? 'Researching'
  const timeDiff = facts?.climate.find((c) => c.icon === 'timeDifference')?.value ?? 'Researching'

  return (
    <div className="space-y-5">
      {/* 1. COUNTRY SNAPSHOT */}
      <section className="card-surface p-5 sm:p-6">
        <SectionTitle number="1" title="Country Snapshot" />
        {summary && <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{summary}</p>}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <dl className="grid grid-cols-1 gap-x-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white px-4 sm:grid-cols-2">
            {factRows.map(([label, value, Icon]) => (
              <div key={label} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                <Icon size={18} strokeWidth={2.25} className="shrink-0 text-navy" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] text-muted">{label}</dt>
                  <dd className={`text-sm font-bold ${value === 'Researching' ? 'text-muted' : 'text-navy'}`}>{value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div>
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas">
              {center ? (
                <CountrySnapshotMap countryName={country.name} countryCode={country.code} lat={center.lat} lng={center.lng} alt={`Locator map showing ${country.name}`} fallback="locator" />
              ) : (
                <div className="grid min-h-56 place-items-center gap-2 text-muted">
                  <MapPinned size={28} className="text-gold-deep" aria-hidden="true" /> Country map unavailable
                </div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-[var(--radius-field)] border border-line bg-white">
              {[
                ['Average winter', winterTemp, Snowflake],
                ['Average summer', summerTemp, Sun],
                ['Time difference', timeDiff, Clock3],
              ].map(([label, value, Icon]) => {
                const IconC = Icon as typeof Snowflake
                return (
                  <div key={String(label)} className="flex min-h-24 items-center gap-3 px-3 py-3 text-left">
                    <IconC size={20} strokeWidth={2.25} className="shrink-0 text-gold-deep" aria-hidden="true" />
                    <div>
                      <p className="text-[10px] leading-4 text-muted">{String(label)}</p>
                      <p className={`text-base font-bold ${value === 'Researching' ? 'text-muted' : 'text-navy'}`}>{String(value)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {facts && (
          <p className="mt-4 text-[11px] text-muted">
            Last verified: {facts.disclosure.lastVerified} · {facts.disclosure.sourceNote}
          </p>
        )}
      </section>

      {/* 2. BASIC VISA */}
      <section className="card-surface p-5 sm:p-6">
        <SectionTitle number="2" title="Ways In" />
        <div className="mt-4 text-sm leading-6">
          {visaType ? (
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-4">
              <p className="flex items-center gap-2 font-bold text-navy">
                <Stamp size={16} className="text-gold-deep" aria-hidden="true" /> Primary route: {visaType}
              </p>
              {typeof incomeRequired === 'number' && incomeRequired > 0 && (
                <p className="mt-1 text-muted">
                  Typical income guideline around <b>${incomeRequired.toLocaleString()}/mo</b>. Confirm the
                  current threshold with the official authority before planning around it.
                </p>
              )}
              <Link href={`/nextinations/${country.slug}/v2/move-there`} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">
                See all pathways <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <p className="text-muted">
              Residency and visa pathways for {country.name} are being verified. We show a route only once it is
              confirmed against the official immigration authority.
            </p>
          )}
        </div>
      </section>

      {/* 3. TOP CITIES */}
      {cities.length > 0 && (
        <section className="card-surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <SectionTitle number="3" title="Cities in the Dataset" />
          </div>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-3">
            {cities.map((city) => (
              <article key={city.id} className="min-w-[220px] snap-start overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile">
                <CityCardImage
                  imageSrc={cityAssetPath(country.slug, toCitySlug(city.cityName))}
                  cityName={city.cityName}
                  countryName={country.name}
                  countryCode={country.code}
                  className="aspect-[16/9] min-h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-navy">{city.cityName}</h3>
                  {city.region && <p className="mt-0.5 text-[11px] text-muted">{city.region}</p>}
                  <p className="mt-3 text-[12px] leading-5 text-muted">{city.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
