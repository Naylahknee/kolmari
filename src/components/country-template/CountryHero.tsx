import { flagSrc } from '@/lib/flags'
import { countryFacts } from '@/lib/country-facts'
import { CountryOutline } from './CountryOutline'
import { HeroAutoGenerate } from './HeroAutoGenerate'
import { focalToObjectPosition } from '@/lib/country-visuals/schema'

export type HeroArtwork = { src: string; focalPoint: { x: number; y: number } }
export type HeroStatusChip = { label: string; tone?: 'gold' | 'good' | 'muted' }

/** Required hero status indicators (Country Design System) — compact, real-data
 *  chips. Renders nothing when there are none, never fabricated. */
function HeroStatus({ chips }: { chips?: HeroStatusChip[] }) {
  if (!chips || chips.length === 0) return null
  return (
    <div className="hero-status">
      {chips.map((c, i) => (
        <span key={i} className={`hero-chip${c.tone ? ` hc-${c.tone}` : ''}`}>{c.label}</span>
      ))}
    </div>
  )
}

/* The country page hero.

   For Portugal (`rich`) it renders the approved, verified mockup content. For
   every other country it renders the same frame driven by the country record,
   with honest "being verified" metrics rather than borrowed figures.

   The hero backdrop is the country's supplied flag-and-map artwork when we have
   it (Portugal). Countries without artwork fall back to the branded navy
   gradient with their own outline sitting on the far right — never a map and
   never a borrowed silhouette. */

type HeroCountry = { slug: string; name: string; code: string; city: string; region: string }
type LatLng = { lat: number; lng: number }
// Verified figures for the hero metric panels (all optional; null → honest
// "being verified" state). Sourced values come from the country_data table.
export type CountryHeroData = {
  primaryVisaRoute: string | null
  monthlyCostUsd: number | null
  timeToResidency: string | null
  pathToCitizenship: string | null
  sources: Record<string, string>
}

/** Hero backdrop, resolved from the Country Visual Asset record.
 *  Fallback hierarchy: approved hero artwork → branded navy gradient with the
 *  country's own outline on the far right. Never a map, never borrowed artwork. */
function HeroBackdrop({ code, artwork }: { code: string; artwork?: HeroArtwork | null }) {
  if (artwork) {
    return (
      <div
        className="hero-bg hero-bg-artwork"
        aria-hidden="true"
        style={{ backgroundImage: `url("${artwork.src}")`, backgroundPosition: focalToObjectPosition(artwork.focalPoint) }}
      />
    )
  }
  const flag = code ? flagSrc(code) : null
  return (
    <>
      {flag
        ? <div className="hero-bg hero-bg-flag" aria-hidden="true" style={{ backgroundImage: `url("${flag}")` }} />
        : <div className="hero-bg" aria-hidden="true" />}
      <div className="hero-flag-shape" aria-hidden="true">
        <CountryOutline code={code} fill="rgba(0,0,0,0.32)" style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  )
}

/** The arrow affordance every hero metric panel carries. */
const MetricArrow = (
  <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/**
 * Split a metric into the large figure and its small unit, matching the approved
 * hero standard ("$2,365 / mo", "D8 digital nomad", "4 to 7 months", "5 years").
 * Splits at the slash when there is one, otherwise after the first token.
 */
function splitMetric(value: string): [string, string | null] {
  const slash = value.indexOf('/')
  if (slash > 0) return [value.slice(0, slash).trim(), value.slice(slash).trim()]
  const space = value.indexOf(' ')
  if (space > 0) return [value.slice(0, space), value.slice(space + 1)]
  return [value, null]
}

/** Honest metric card for a country without a verified metric dataset. */
function VerifyingMetric({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="metric" aria-disabled="true">
      <span className="m-l">{icon} {label}</span>
      {/* Standard .m-v typography — the muted treatment is a class, not an
          inline font-size, so every hero sizes identically. */}
      <span className="m-v m-v-pending">Being verified</span>
      <span className="m-n">Pending an official source</span>
    </div>
  )
}

/**
 * Metric card that shows a verified value + its note/source, or the honest
 * "being verified" state when the value is null. Renders the same clickable
 * panel as the approved standard, so every country page behaves alike.
 */
function DataMetric({ label, icon, value, note, onOpen, openLabel }: {
  label: string
  icon: React.ReactNode
  value: string | null
  note?: string | null
  onOpen?: () => void
  openLabel?: string
}) {
  if (!value) return <VerifyingMetric label={label} icon={icon} />
  const [figure, unit] = splitMetric(value)
  return (
    <button className="metric" onClick={onOpen} aria-label={openLabel ?? label}>
      {MetricArrow}
      <span className="m-l">{icon} {label}</span>
      <span className="m-v">{figure}{unit ? <> <small>{unit}</small></> : null}</span>
      {note && <span className="m-n">{note}</span>}
    </button>
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
  statusChips = [],
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
}) {
  if (rich) {
    return (
      <section className="hero">
        <HeroBackdrop code="PT" artwork={heroArtwork} />
        {!heroArtwork && <HeroAutoGenerate slug={country.slug} />}
        <div className="hero-body">
          {fromQuiz && (
            <p className="hero-quizpill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 3l2.1 4.9 5.4.5-4.1 3.6 1.2 5.3L12 14.6 7.4 17.3l1.2-5.3L4.5 8.4l5.4-.5z" /></svg>
              Your top Destination from the Match Quiz
            </p>
          )}
          <div className="hero-eyebrow">Western Europe · Atlantic coast</div>
          {/* No inline flag icon here: the Portugal flag artwork is already the
              hero backdrop, so a second small flag would be redundant. */}
          <h1 className="hero-name">Portugal</h1>
          <p className="hero-blurb">Mild Atlantic climate, costs below the Western European average, and five legal routes open to non-EU nationals. Lisbon and Porto carry the infrastructure, while the Algarve and Alentejo trade pace for price.</p>
          <div className="badges">
            <span className="badge-h b-sch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg> Schengen Area</span>
            <span className="badge-h b-eu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 6.6l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor" stroke="none" /></svg> EU Member</span>
            <span className="badge-h b-nato"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l8 3.6v6.1c0 4.6-3.3 8.7-8 10.3-4.7-1.6-8-5.7-8-10.3V5.6z" /><path d="M12 7v10M7.5 12h9" /></svg> NATO Member</span>
          </div>
          <HeroStatus chips={statusChips} />
        </div>
        <div className="metrics">
          <button className="metric" onClick={() => go('cost-housing')} aria-label="Cost against your budget. Opens Cost and Housing.">
            <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg> Cost vs your budget</span>
            <span className="m-v">$2,365 <small>/ mo</small></span>
            <span className="m-n">couple in Lisbon · <b>34% under</b> budget</span>
          </button>
          <button className="metric" onClick={() => go('move-there')} aria-label="Your best route. Opens Move There.">
            <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" /></svg> Your best route</span>
            <span className="m-v">D8 <small>digital nomad</small></span>
            <span className="m-n"><b>You qualify</b> · 2 items outstanding</span>
          </button>
          <button className="metric" onClick={() => go('move-there')} aria-label="Time to residency. Opens Move There.">
            <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg> Time to residency</span>
            <span className="m-v">4 <small>to 7 months</small></span>
            <span className="m-n">filing to landing · <b className="warn">consulate backlog</b></span>
          </button>
          <button className="metric" onClick={() => go('move-there')} aria-label="Path to citizenship. Opens Move There.">
            <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            <span className="m-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="10" r="2.6" /><path d="M8.5 17c.9-1.8 2-2.6 3.5-2.6s2.6.8 3.5 2.6" /></svg> Path to citizenship</span>
            <span className="m-v">5 <small>years</small></span>
            <span className="m-n">fastest tier in the EU · needs <b>A2</b></span>
          </button>
        </div>
      </section>
    )
  }

  // Data-driven hero for every non-Portugal country. Real map, real name / flag
  // / region from the record, and honest metrics (the only verified figure we
  // may have is the visa route for the five mapped countries).
  return (
    <section className="hero">
      <HeroBackdrop code={country.code} artwork={heroArtwork} />
      {!heroArtwork && <HeroAutoGenerate slug={country.slug} />}
      <div className="hero-body">
        {fromQuiz && (
          <p className="hero-quizpill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 3l2.1 4.9 5.4.5-4.1 3.6 1.2 5.3L12 14.6 7.4 17.3l1.2-5.3L4.5 8.4l5.4-.5z" /></svg>
            Your top Destination from the Match Quiz
          </p>
        )}
        <div className="hero-eyebrow">{country.region} · {country.city}</div>
        {/* No inline flag beside the name — the flag is already the hero backdrop. */}
        <h1 className="hero-name">{country.name}</h1>
        <p className="hero-blurb">
          Your research workspace for {country.name}. Figures appear here only once they are verified from
          official sources — never estimated or borrowed from another country.
        </p>
        {(() => {
          const facts = countryFacts(country.slug)
          if (!facts || !(facts.schengen || facts.eu || facts.nato)) return null
          return (
            <div className="badges">
              {facts.schengen && <span className="badge-h b-sch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg> Schengen Area</span>}
              {facts.eu && <span className="badge-h b-eu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 6.6l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor" stroke="none" /></svg> EU Member</span>}
              {facts.nato && <span className="badge-h b-nato"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l8 3.6v6.1c0 4.6-3.3 8.7-8 10.3-4.7-1.6-8-5.7-8-10.3V5.6z" /><path d="M12 7v10M7.5 12h9" /></svg> NATO Member</span>}
            </div>
          )
        })()}
        <HeroStatus chips={statusChips} />
      </div>
      {/* Same four categories, order and spacing as the Portugal hero — with
          per-country verified figures, or an honest "being verified" state. */}
      <div className="metrics">
        <DataMetric
          label="Cost vs your budget"
          onOpen={() => go('cost-housing')}
          openLabel="Cost against your budget. Opens Cost and Housing."
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>}
          value={data?.monthlyCostUsd != null ? `$${data.monthlyCostUsd.toLocaleString()}/mo` : null}
          note={data?.sources?.monthlyCostUsd ?? null}
        />
        <DataMetric
          label="Your best route"
          onOpen={() => go('move-there')}
          openLabel="Your best route. Opens Move There."
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" /></svg>}
          value={data?.primaryVisaRoute ?? visaType ?? null}
          note={data?.sources?.primaryVisaRoute ?? 'Confirm your eligibility with the official authority'}
        />
        <DataMetric
          label="Time to residency"
          onOpen={() => go('move-there')}
          openLabel="Time to residency. Opens Move There."
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>}
          value={data?.timeToResidency ?? null}
          note={data?.sources?.timeToResidency ?? null}
        />
        <DataMetric
          label="Path to citizenship"
          onOpen={() => go('move-there')}
          openLabel="Path to citizenship. Opens Move There."
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="10" r="2.6" /><path d="M8.5 17c.9-1.8 2-2.6 3.5-2.6s2.6.8 3.5 2.6" /></svg>}
          value={data?.pathToCitizenship ?? null}
          note={data?.sources?.pathToCitizenship ?? null}
        />
      </div>
    </section>
  )
}
