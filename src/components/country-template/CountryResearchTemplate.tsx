'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Building2, FileSearch, MapPinned } from 'lucide-react'
import { UnitsProvider } from './client/UnitsControl'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { TabBar, type TabSlug } from './TabBar'

// Structural shape shared by both country registries (CountryDetail and
// DiscoverableCountry) so any non-Portugal country can render here.
type ResearchCountry = { slug: string; name: string; code: string; city: string; region: string }

/*
  The Portugal country page (`CountryTemplate`) is the canonical template:
  top bar, collapsible sidebar, hero band, 8-tab bar, main + right rail.

  Every other country renders that SAME frame here, but its content is driven
  by real data and honest research states — never Portugal's hardcoded facts.
  This keeps the app visually consistent while respecting the no-fabrication
  rule: destinations without a verified dataset show a clear "research in
  progress" state instead of borrowed figures.
*/

const TAB_META: Record<TabSlug, { title: string; intro: (name: string) => string }> = {
  'overview': { title: 'Overview', intro: (n) => `A neutral starting point for researching ${n} — no figures are shown until they are verified from official sources.` },
  'move-there': { title: 'Move There · Pathways', intro: (n) => `Confirm which residence and visa pathways currently apply to your situation in ${n} with the official immigration authority.` },
  'cost-housing': { title: 'Cost & Housing', intro: (n) => `Build your own cost picture for ${n} from current listings and the Cost Calculator — we don't preload unverified rents.` },
  'work-study': { title: 'Work & Study', intro: (n) => `Research work authorization, remote-work rules, and study routes for ${n} before committing to a plan.` },
  'healthcare': { title: 'Healthcare', intro: (n) => `Check public and private healthcare access, insurance requirements, and coverage for newcomers in ${n}.` },
  'family-schools': { title: 'Family & Schools', intro: (n) => `Look into schooling options, family visas, and day-to-day logistics for households moving to ${n}.` },
  'lifestyle-community': { title: 'Lifestyle & Community', intro: (n) => `Use Greenbook prompts and community sources to understand daily life and belonging in ${n}.` },
  'tax-money': { title: 'Tax & Money', intro: (n) => `Verify tax residency rules, banking access, and any treaties that apply to your income in ${n}.` },
}

function ResearchHero({ country }: { country: ResearchCountry }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="scrim" />
      <div className="hero-body">
        <div className="hero-eyebrow">{country.region} · {country.city}</div>
        <h1 className="hero-name">
          <span className="flag hero-flag" role="img" aria-label={`Flag of ${country.name}`}>
            {/* flag image; hidden gracefully if the CDN asset is unavailable */}
            <img src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`} alt="" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </span>
          {country.name}
        </h1>
        <p className="hero-blurb">
          Detailed facts, costs, and visa guidance for {country.name} are being verified. Kolmari does not
          preload unverified figures or present editorial popularity as personal eligibility. Start your
          research below with official sources and your own inputs.
        </p>
        <div className="badges">
          <span className="badge-h">Research in progress</span>
        </div>
      </div>
      <div className="metrics">
        {[
          ['Cost vs your budget', 'Research needed'],
          ['Your best route', 'Verify eligibility'],
          ['Time to residency', 'Not yet verified'],
          ['Path to citizenship', 'Not yet verified'],
        ].map(([label, value]) => (
          <div className="metric" key={label} aria-disabled="true">
            <span className="m-l">{label}</span>
            <span className="m-v" style={{ fontSize: '15px' }}>{value}</span>
            <span className="m-n">Verified data not available yet</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ResearchBody({ country, active }: { country: ResearchCountry; active: TabSlug }) {
  const meta = TAB_META[active]
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{meta.title}</p>
        <h2 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Researching {country.name}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{meta.intro(country.name)}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            [MapPinned, 'Places to compare', `Research ${country.city} and other cities before choosing a neighborhood.`],
            [FileSearch, 'Residency Pathways', 'Confirm current eligibility and document requirements with official authorities.'],
            [Building2, 'Cost and housing', 'Enter your own verified rent and monthly expenses in the Cost Calculator.'],
            [BookOpen, 'Community context', 'Use Greenbook prompts to investigate daily life and belonging at city level.'],
          ].map(([Icon, title, copy]) => {
            const CardIcon = Icon as typeof MapPinned
            return (
              <article key={title as string} className="card-surface p-5">
                <CardIcon size={20} className="text-gold-deep" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-navy">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{copy as string}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-card border border-line bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-navy">Research status</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          This section for {country.name} is being verified. Until then, use official sources and your own
          inputs rather than assumed figures.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/pathways" className="gold-button">Review Pathways <ArrowRight size={15} /></Link>
          <Link href="/cost-calculator" className="inline-flex min-h-11 items-center rounded-[var(--radius-btn)] border border-line px-5 text-sm font-bold text-navy">Open Cost Calculator</Link>
        </div>
      </section>
    </div>
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

export function CountryResearchTemplate({ country, active }: { country: ResearchCountry; active: TabSlug }) {
  const toggleRail = () => document.body.classList.toggle('rail-collapsed')
  useEffect(() => {
    if (window.innerWidth <= 900) document.body.classList.remove('rail-collapsed')
  }, [])

  return (
    <UnitsProvider>
      <div className="country-template-root">
        <TopBar onToggleRail={toggleRail} />
        <div className="shell">
          <button type="button" className="rail-backdrop" onClick={toggleRail} aria-label="Close navigation" />
          <Sidebar />
          <main className="main">
            <ResearchHero country={country} />
            <TabBar slug={country.slug} active={active} />
            <div className="cols">
              <div><ResearchBody country={country} active={active} /></div>
              <ResearchRail country={country} />
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
