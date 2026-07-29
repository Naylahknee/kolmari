'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Building2, FileSearch, Lock, MapPinned, Sparkles } from 'lucide-react'
import { UnitsProvider } from './client/UnitsControl'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { TabBar, type TabSlug } from './TabBar'

// Structural shape shared by both country registries (CountryDetail and
// DiscoverableCountry) so any non-Portugal country can render here.
type ResearchCountry = { slug: string; name: string; code: string; city: string; region: string }
type Plan = 'free' | 'plus' | 'navigator'
type LatLng = { lat: number; lng: number }

/*
  The standard country page for every country except Portugal. One consistent,
  high-end layout: a real Mapbox hero (no SVG shapes), an overview every visitor
  can see (free), and an expanded research workspace gated to paid plans.
  Content stays honest — countries without verified data show research states,
  never borrowed figures.
*/

const TAB_INTRO: Record<TabSlug, string> = {
  'overview': 'A neutral starting point — no figures are shown until they are verified from official sources.',
  'move-there': 'Confirm which residence and visa pathways currently apply to your situation with the official immigration authority.',
  'cost-housing': "Build your own cost picture from current listings and the Cost Calculator — we don't preload unverified rents.",
  'work-study': 'Research work authorization, remote-work rules, and study routes before committing to a plan.',
  'healthcare': 'Check public and private healthcare access, insurance requirements, and coverage for newcomers.',
  'family-schools': 'Look into schooling options, family visas, and day-to-day logistics for households.',
  'lifestyle-community': 'Use Greenbook prompts and community sources to understand daily life and belonging.',
  'tax-money': 'Verify tax residency rules, banking access, and any treaties that apply to your income.',
}

const TAB_TITLE: Record<TabSlug, string> = {
  'overview': 'Overview',
  'move-there': 'Move There · Pathways',
  'cost-housing': 'Cost & Housing',
  'work-study': 'Work & Study',
  'healthcare': 'Healthcare',
  'family-schools': 'Family & Schools',
  'lifestyle-community': 'Lifestyle & Community',
  'tax-money': 'Tax & Money',
}

/** Real Mapbox map banner with the country name overlaid (falls back to a navy band). */
function MapHero({ country, center }: { country: ResearchCountry; center: LatLng | null }) {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-line bg-navy-deep shadow-shell">
      {center ? (
        <CountrySnapshotMap countryName={country.name} lat={center.lat} lng={center.lng} alt={`Map of ${country.name}`} />
      ) : (
        <div className="hero-grid aspect-[16/9] min-h-56 w-full bg-navy-deep" aria-hidden="true" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,57,0)_25%,rgba(13,27,57,0.88)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gold">{country.region} · {country.city}</div>
        <h1 className="mt-2 flex items-center gap-3 text-3xl font-extrabold sm:text-4xl">
          <img
            src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
            alt=""
            className="h-7 w-10 rounded-sm object-cover shadow"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          {country.name}
        </h1>
      </div>
    </section>
  )
}

function OverviewCards({ country }: { country: ResearchCountry }) {
  const cards: [typeof MapPinned, string, string][] = [
    [MapPinned, 'Places to compare', `Research ${country.city} and other cities before choosing a neighborhood.`],
    [FileSearch, 'Residency Pathways', 'Confirm current eligibility and document requirements with official authorities.'],
    [Building2, 'Cost and housing', 'Enter your own verified rent and monthly expenses in the Cost Calculator.'],
    [BookOpen, 'Community context', 'Use Greenbook prompts to investigate daily life and belonging at city level.'],
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map(([Icon, title, copy]) => (
        <article key={title} className="card-surface p-5">
          <Icon size={20} className="text-gold-deep" aria-hidden="true" />
          <h3 className="mt-4 font-bold text-navy">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
        </article>
      ))}
    </div>
  )
}

/** The paid-only expanded workspace. */
function ExpandedWorkspace({ country }: { country: ResearchCountry }) {
  return (
    <section className="rounded-card border border-line bg-white p-6 shadow-card">
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold-deep">
        <Sparkles size={13} aria-hidden="true" /> Expanded view
      </span>
      <h2 className="mt-3 text-lg font-bold text-navy">Your expanded research workspace for {country.name}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        Compare cities side by side, save destinations, track documents and budget in your Move Plan, and layer
        Greenbook insights as they are verified. Figures appear only when they are sourced — never estimated.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link href="/cost-calculator" className="flex items-center justify-between rounded-[var(--radius-field)] border border-line px-4 py-3 text-sm font-semibold text-navy transition hover:border-gold">
          Build a {country.name} budget <ArrowRight size={15} className="text-gold-deep" />
        </Link>
        <Link href="/pathways" className="flex items-center justify-between rounded-[var(--radius-field)] border border-line px-4 py-3 text-sm font-semibold text-navy transition hover:border-gold">
          Review Pathways for your Profile <ArrowRight size={15} className="text-gold-deep" />
        </Link>
        <Link href="/nexit-plan" className="flex items-center justify-between rounded-[var(--radius-field)] border border-line px-4 py-3 text-sm font-semibold text-navy transition hover:border-gold">
          Add {country.name} to a Move Plan <ArrowRight size={15} className="text-gold-deep" />
        </Link>
        <Link href="/greenbook" className="flex items-center justify-between rounded-[var(--radius-field)] border border-line px-4 py-3 text-sm font-semibold text-navy transition hover:border-gold">
          Open Greenbook insights <ArrowRight size={15} className="text-gold-deep" />
        </Link>
      </div>
    </section>
  )
}

/** Free-plan lock that stands in for the expanded workspace. */
function UpgradeLock({ country }: { country: ResearchCountry }) {
  return (
    <section className="relative overflow-hidden rounded-card border border-gold/40 bg-gold-soft/30 p-6">
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-white px-2.5 py-1 text-xs font-bold text-gold-deep">
        <Lock size={13} aria-hidden="true" /> Plus feature
      </span>
      <h2 className="mt-3 text-lg font-bold text-navy">Unlock the expanded view for {country.name}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-navy/80">
        Plus adds side-by-side city comparison, the full research workspace, documents and budget tracking, and
        full Greenbook insights. Explorer stays free forever.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/#pricing" className="gold-button">Upgrade to Plus <ArrowRight size={15} /></Link>
        <Link href="/cost-calculator" className="inline-flex min-h-11 items-center rounded-[var(--radius-btn)] border border-line bg-white px-5 text-sm font-bold text-navy">Open Cost Calculator</Link>
      </div>
    </section>
  )
}

function ResearchRail({ country }: { country: ResearchCountry }) {
  return (
    <aside className="rightcol">
      <div className="card-surface p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Match Score</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Your personalized Match Score for {country.name} unlocks once your Profile is complete and this
          destination has verified data. We never show an estimated score.
        </p>
        <Link href="/profile-wizard" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-btn)] bg-navy px-5 text-sm font-bold text-white transition hover:bg-navy-deep">
          Complete your Profile <ArrowRight size={15} />
        </Link>
      </div>

      <div className="card-surface p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Start your research</p>
        <ul className="mt-3 space-y-3 text-sm leading-6 text-muted">
          <li>Confirm which residence pathways currently apply to you with the official authority.</li>
          <li>Compare cities and neighborhoods, starting with {country.city}.</li>
          <li>Build a real budget in the Cost Calculator from current listings.</li>
          <li>Save {country.name} to your shortlist when you want to compare or plan around it.</li>
        </ul>
      </div>
    </aside>
  )
}

export function CountryResearchTemplate({
  country,
  active,
  center,
  plan,
}: {
  country: ResearchCountry
  active: TabSlug
  center: LatLng | null
  plan: Plan
}) {
  const toggleRail = () => document.body.classList.toggle('rail-collapsed')
  useEffect(() => {
    if (window.innerWidth <= 900) document.body.classList.remove('rail-collapsed')
  }, [])
  const paid = plan !== 'free'

  return (
    <UnitsProvider>
      <div className="country-template-root">
        <TopBar onToggleRail={toggleRail} />
        <div className="shell">
          <button type="button" className="rail-backdrop" onClick={toggleRail} aria-label="Close navigation" />
          <Sidebar />
          <main className="main">
            <MapHero country={country} center={center} />
            <TabBar slug={country.slug} active={active} />
            <div className="cols">
              <div className="space-y-6">
                <section>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{TAB_TITLE[active]}</p>
                  <h2 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Researching {country.name}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{TAB_INTRO[active]}</p>
                  <div className="mt-6"><OverviewCards country={country} /></div>
                </section>

                {paid ? <ExpandedWorkspace country={country} /> : <UpgradeLock country={country} />}
              </div>
              <ResearchRail country={country} />
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
