import Link from 'next/link'
import { flagSrc } from '@/lib/flags'
import { countryFacts } from '@/lib/country-facts'
import { MetricButton } from './MetricButton'
import { HeroAutoGenerate } from './HeroAutoGenerate'
import { focalToObjectPosition } from '@/lib/country-visuals/schema'

export type HeroArtwork = { src: string; focalPoint: { x: number; y: number } }
export type HeroStatusChip = { label: string; tone?: 'gold' | 'good' | 'muted' }

type HeroCountry = { slug: string; name: string; code: string; city: string; region: string }
type LatLng = { lat: number; lng: number }

export type CountryHeroData = {
  primaryVisaRoute: string | null
  monthlyCostUsd: number | null
  timeToResidency: string | null
  pathToCitizenship: string | null
  sources: Record<string, string>
}

function HeroBackdrop({ code, artwork }: { code: string; artwork?: HeroArtwork | null }) {
  const flag = code ? flagSrc(code) : null
  if (artwork) {
    return (
      <div
        className="hero-bg hero-bg-artwork"
        aria-hidden="true"
        style={{ backgroundImage: `url("${artwork.src}")`, backgroundPosition: focalToObjectPosition(artwork.focalPoint) }}
      />
    )
  }
  return flag
    ? <div className="hero-bg hero-bg-flag" aria-hidden="true" style={{ backgroundImage: `url("${flag}")` }} />
    : <div className="hero-bg hero-bg-empty" aria-hidden="true" />
}

const MetricIcons = {
  cost: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>,
  route: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" /></svg>,
  time: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  citizenship: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="10" r="2.6" /><path d="M8.5 17c.9-1.8 2-2.6 3.5-2.6s2.6.8 3.5 2.6" /></svg>,
}

function splitMetric(value: string): [string, string | null] {
  const slash = value.indexOf('/')
  if (slash > 0) return [value.slice(0, slash).trim(), value.slice(slash).trim()]
  const space = value.indexOf(' ')
  if (space > 0) return [value.slice(0, space), value.slice(space + 1)]
  return [value, null]
}

function DataMetric({ label, icon, value, note, onOpen, openLabel }: {
  label: string
  icon: React.ReactNode
  value: string | null
  note?: string | null
  onOpen?: () => void
  openLabel?: string
}) {
  const [figure, unit] = value ? splitMetric(value) : [null, null]
  return <MetricButton label={label} icon={icon} value={figure} unit={unit ?? undefined} note={note ?? undefined} onOpen={onOpen} openLabel={openLabel} />
}

function MembershipBadges({ country, rich }: { country: HeroCountry; rich: boolean }) {
  const facts = rich ? { schengen: true, eu: true, nato: true } : countryFacts(country.slug)
  if (!facts || !(facts.schengen || facts.eu || facts.nato)) return null
  return (
    <div className="badges">
      {facts.schengen && <span className="badge-h">Schengen Area</span>}
      {facts.eu && <span className="badge-h">EU Member</span>}
      {facts.nato && <span className="badge-h">NATO Member</span>}
    </div>
  )
}

export function CountryHero({
  go,
  fromQuiz = false,
  country,
  visaType,
  rich = false,
  data = null,
  heroArtwork = null,
  paid = true,
}: {
  go: (s: string) => void
  fromQuiz?: boolean
  country: HeroCountry
  center?: LatLng | null
  visaType?: string
  rich?: boolean
  data?: CountryHeroData | null
  heroArtwork?: HeroArtwork | null
  statusChips?: HeroStatusChip[]
  paid?: boolean
}) {
  const portugal = rich || country.slug === 'portugal'
  const place = portugal ? 'Western Europe · Atlantic coast' : `${country.region} · ${country.city}`

  return (
    <section className="country-hero-wrap">
      <div className="hero">
        <HeroBackdrop code={country.code} artwork={heroArtwork} />
        {!heroArtwork && <HeroAutoGenerate slug={country.slug} />}
        <div className="hero-scrim" aria-hidden="true" />
        <Link href="/your-world" className="hero-back-pill">← All destinations</Link>
        <div className="hero-body">
          {fromQuiz && paid && <p className="hero-quizpill">Your top Destination from the Match Quiz</p>}
          <div className="hero-title-row">
            <span className="hero-flag-tile"><img src={flagSrc(country.code)} alt="" /></span>
            <div>
              <h1 className="hero-name">{country.name}</h1>
              {paid && <p className="hero-place">{place}</p>}
            </div>
          </div>
          {paid && <MembershipBadges country={country} rich={portugal} />}
        </div>
      </div>

      {paid && (
        <div className="metrics hero-stat-strip">
          {portugal ? (
            <>
              <MetricButton label="Cost vs your budget" onOpen={() => go('cost-housing')} openLabel="Cost against your budget. Opens Cost and Housing." icon={MetricIcons.cost} value="$2,365" unit="/ mo" note={<>couple in Lisbon · <b>34% under</b> budget</>} />
              <MetricButton label="Your best route" onOpen={() => go('move-there')} openLabel="Your best route. Opens Move There." icon={MetricIcons.route} value="D8" unit="digital nomad" note={<><b>You qualify</b> · 2 items outstanding</>} />
              <MetricButton label="Time to residency" onOpen={() => go('move-there')} openLabel="Time to residency. Opens Move There." icon={MetricIcons.time} value="4" unit="to 7 months" note={<>filing to landing · <b className="warn">consulate backlog</b></>} />
              <MetricButton label="Path to citizenship" onOpen={() => go('move-there')} openLabel="Path to citizenship. Opens Move There." icon={MetricIcons.citizenship} value="5" unit="years" note={<>fastest tier in the EU · needs <b>A2</b></>} />
            </>
          ) : (
            <>
              <DataMetric label="Cost vs your budget" onOpen={() => go('cost-housing')} openLabel="Cost against your budget. Opens Cost and Housing." icon={MetricIcons.cost} value={data?.monthlyCostUsd != null ? `$${data.monthlyCostUsd.toLocaleString()}/mo` : null} note={data?.sources?.monthlyCostUsd ?? null} />
              <DataMetric label="Your best route" onOpen={() => go('move-there')} openLabel="Your best route. Opens Move There." icon={MetricIcons.route} value={data?.primaryVisaRoute ?? visaType ?? null} note={data?.sources?.primaryVisaRoute ?? 'Confirm your eligibility with the official authority'} />
              <DataMetric label="Time to residency" onOpen={() => go('move-there')} openLabel="Time to residency. Opens Move There." icon={MetricIcons.time} value={data?.timeToResidency ?? null} note={data?.sources?.timeToResidency ?? null} />
              <DataMetric label="Path to citizenship" onOpen={() => go('move-there')} openLabel="Path to citizenship. Opens Move There." icon={MetricIcons.citizenship} value={data?.pathToCitizenship ?? null} note={data?.sources?.pathToCitizenship ?? null} />
            </>
          )}
        </div>
      )}
    </section>
  )
}
