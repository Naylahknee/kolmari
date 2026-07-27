'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UnitsProvider } from './client/UnitsControl'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { CountryHero } from './CountryHero'
import { TabBar, type TabSlug } from './TabBar'
import { RightRail } from './RightRail'

/* Frame only. The active tab body is passed in as children so each tab can
   stay a server component and ship no JavaScript of its own. */
export function CountryTemplate({ slug, active, fromQuiz = false, children }:
  { slug: string; active: TabSlug; fromQuiz?: boolean; children: React.ReactNode }) {
  const router = useRouter()
  const go = (s: string) => router.push(`/nextinations/${slug}/v2/${s}`)
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
            <CountryHero go={go} fromQuiz={fromQuiz} />
            <TabBar slug={slug} active={active} />
            <div className="cols">
              <div>{children}</div>
              <RightRail />
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
