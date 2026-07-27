'use client'
import { useEffect } from 'react'
import { UnitsProvider } from './client/UnitsControl'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { TabBar, type TabSlug } from './TabBar'
import { RightRail } from './RightRail'

/* Frame only. The hero and the active tab body are passed in as server-rendered
   nodes so each stays a server component and ships no JavaScript of its own. */
export function CountryTemplate({ slug, active, hero, children }:
  { slug: string; active: TabSlug; hero: React.ReactNode; children: React.ReactNode }) {
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
            {hero}
            <TabBar slug={slug} active={active} />
            <div className="cols">
              <div>{children}</div>
              <RightRail slug={slug} />
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
