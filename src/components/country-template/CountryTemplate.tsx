'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Heart, Lock, ShieldCheck } from 'lucide-react'
import { UnitsProvider } from './client/UnitsControl'
import { AnnouncementBar } from '@/components/kolmari/announcement-bar'
import { FullWidthWorkspaceStyles } from '@/components/kolmari/full-width-workspace-styles'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { CountryHero, type CountryHeroData, type HeroArtwork, type HeroStatusChip } from './CountryHero'
import { TabBar, type TabSlug } from './TabBar'
import { RightRail, type RailMatch } from './RightRail'

type TemplateCountry = { slug: string; name: string; code: string; city: string; region: string }
type LatLng = { lat: number; lng: number }
const SAVED_KEY = 'kolmari:saved-nextinations'

function readSaved(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : []
  } catch { return [] }
}

function WhyExplore({ country, rich, paid }: { country: TemplateCountry; rich: boolean; paid: boolean }) {
  const [saved, setSaved] = useState(false)
  const [interested, setInterested] = useState(false)
  useEffect(() => { setSaved(readSaved().includes(country.slug)) }, [country.slug])

  function toggleSaved() {
    const current = readSaved()
    const next = current.includes(country.slug) ? current.filter((slug) => slug !== country.slug) : [...new Set([...current, country.slug])]
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('kolmari:saved-nextinations-changed'))
    setSaved(next.includes(country.slug))
  }

  const copy = rich
    ? 'Mild Atlantic climate, costs below the Western European average, and five legal routes open to non-EU nationals. Lisbon and Porto carry the infrastructure, while the Algarve and Alentejo trade pace for price.'
    : `Your research workspace for ${country.name}. Figures appear here only once they are verified from official sources — never estimated or borrowed from another country.`

  return (
    <section className="why-explore-row">
      <div><h2>Why explore {country.name}</h2><p>{copy}</p></div>
      {paid && <div className="why-actions">
        <button type="button" onClick={toggleSaved} aria-pressed={saved}><Heart size={15} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save'}</button>
        <button type="button" onClick={() => setInterested((value) => !value)} aria-pressed={interested}><Heart size={15} fill={interested ? 'currentColor' : 'none'} />Interested</button>
      </div>}
    </section>
  )
}

function UpgradeOverlay({ countryName }: { countryName: string }) {
  const items = [
    `Your personalized ${countryName} fit`,
    'Visa pathways matched to your profile',
    'Realistic cost of living and housing',
    'Safety, belonging, and accessibility insights',
    'Your step-by-step relocation timeline',
    'Save, shortlist, and compare destinations',
  ]
  return (
    <div className="country-upgrade-card">
      <div className="country-upgrade-band">
        <span><img src="/brand/favicon-48.png" alt="" /></span><span><Lock size={23} /></span><span><ShieldCheck size={23} /></span>
      </div>
      <div className="country-upgrade-body">
        <h2>See whether {countryName} truly works for your life</h2>
        <p>Go beyond the highlights. See how {countryName} aligns with your legal options, budget, priorities, identity, and relocation timeline.</p>
        <div className="country-upgrade-list">{items.map((item) => <div key={item}><span>✓</span>{item}</div>)}</div>
        <a href="/coming-soon?feature=flutter" className="country-upgrade-button">Unlock {countryName} with Kolmari Flutter — from $19/month</a>
        <small>Included with Kolmari Flutter</small>
      </div>
    </div>
  )
}

export function CountryTemplate({ slug, active, fromQuiz = false, country, center = null, visaType, rich = false, match = null, data = null, heroArtwork = null, statusChips = [], paid = true, children }:
  { slug: string; active: TabSlug; fromQuiz?: boolean; country: TemplateCountry; center?: LatLng | null; visaType?: string; rich?: boolean; match?: RailMatch | null; data?: CountryHeroData | null; heroArtwork?: HeroArtwork | null; statusChips?: HeroStatusChip[]; paid?: boolean; children: React.ReactNode }) {
  const router = useRouter()
  const go = (s: string) => router.push(`/nextinations/${slug}/v2/${s}`)
  const toggleRail = () => document.body.classList.toggle('rail-collapsed')
  useEffect(() => { if (window.innerWidth <= 900) document.body.classList.remove('rail-collapsed') }, [])
  const overviewMode = active === 'overview'

  return (
    <UnitsProvider>
      <div className="country-template-root" data-plan={paid ? 'pro' : 'free'}>
        <FullWidthWorkspaceStyles />
        <AnnouncementBar />
        <TopBar onToggleRail={toggleRail} />
        <div className="shell">
          <button type="button" className="rail-backdrop" onClick={toggleRail} aria-label="Close navigation" />
          <Sidebar />
          <main className="main">
            <div className="country-page-card">
              <CountryHero go={go} fromQuiz={fromQuiz} country={country} center={center} visaType={visaType} rich={rich} data={data} heroArtwork={heroArtwork} statusChips={statusChips} paid={paid} />
              {paid && <TabBar slug={slug} active={active} />}
              <WhyExplore country={country} rich={rich} paid={paid} />
              {paid ? (
                <div className={`cols${overviewMode ? ' overview-cols' : ''}`}><div>{children}</div><RightRail rich={rich} country={country} match={match} overviewMode={overviewMode} /></div>
              ) : (
                <div className="country-gated-zone">
                  <div className="country-gated-blur" aria-hidden="true"><div className="cols"><div>{children}</div><RightRail rich={rich} country={country} match={match} overviewMode /></div></div>
                  <UpgradeOverlay countryName={country.name} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
