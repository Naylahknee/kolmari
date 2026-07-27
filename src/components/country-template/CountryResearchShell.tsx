'use client'
import { useEffect } from 'react'
import { UnitsProvider } from './client/UnitsControl'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

/* Chrome for country research pages that do not use the full CountryTemplate
   (hero + tabs + right rail). It uses the shared workspace chrome — the same
   top bar and collapsible sidebar as Dashboard, Pathways, and other Tailwind
   workspace pages — so the research page keeps the sidebar menu while its
   own Tailwind layout renders unchanged. It deliberately avoids the
   `country-template-root` frame, whose CSS reset would clobber that layout. */
export function CountryResearchShell({ children }: { children: React.ReactNode }) {
  const toggleRail = () => document.body.classList.toggle('rail-collapsed')
  useEffect(() => {
    if (window.innerWidth <= 900) document.body.classList.remove('rail-collapsed')
  }, [])

  return (
    <UnitsProvider>
      <div>
        <TopBar onToggleRail={toggleRail} />
        <div className="shell">
          <button type="button" className="rail-backdrop" onClick={toggleRail} aria-label="Close navigation" />
          <Sidebar />
          <main className="main workspace-main">{children}</main>
        </div>
      </div>
    </UnitsProvider>
  )
}
