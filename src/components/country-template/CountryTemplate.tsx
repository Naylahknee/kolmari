'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UnitsProvider } from './client/UnitsControl'
import { AnnouncementBar } from '@/components/kolmari/announcement-bar'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { CountryHero } from './CountryHero'
import { TabBar, type TabSlug } from './TabBar'
import { RightRail, type RailMatch } from './RightRail'

type TemplateCountry = { slug: string; name: string; code: string; city: string; region: string }
type LatLng = { lat: number; lng: number }

/* Frame only. The active tab body is passed in as children so each tab can
   stay a server component and ship no JavaScript of its own.

   `rich` is true only for Portugal (the fully verified dataset), which renders
   the approved hero metrics and rail. Every other country renders the same
   frame with honest, data-driven content and a real map. */
export function CountryTemplate({ slug, active, fromQuiz = false, country, center = null, visaType, rich = false, match = null, children }:
  {
    slug: string
    active: TabSlug
    fromQuiz?: boolean
    country: TemplateCountry
    center?: LatLng | null
    visaType?: string
    rich?: boolean
    match?: RailMatch | null
    children: React.ReactNode
  }) {
  const router = useRouter()
  const go = (s: string) => router.push(`/nextinations/${slug}/v2/${s}`)
  const toggleRail = () => document.body.classList.toggle('rail-collapsed')
  useEffect(() => {
    if (window.innerWidth <= 900) document.body.classList.remove('rail-collapsed')
  }, [])

  return (
    <UnitsProvider>
      <div className="country-template-root">
        <AnnouncementBar />
        <TopBar onToggleRail={toggleRail} />
        <div className="shell">
          <button type="button" className="rail-backdrop" onClick={toggleRail} aria-label="Close navigation" />
          <Sidebar />
          <main className="main">
            <CountryHero go={go} fromQuiz={fromQuiz} country={country} center={center} visaType={visaType} rich={rich} />
            <TabBar slug={slug} active={active} />
            <div className="cols">
              <div>{children}</div>
              <RightRail rich={rich} country={country} match={match} />
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
