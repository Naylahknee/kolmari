'use client'
import { useEffect } from 'react'
import { UnitsProvider } from './client/UnitsControl'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

/* Chrome for country research pages that do not use the full CountryTemplate
   (hero + tabs + right rail). It provides the same workspace frame — top bar
   and collapsible sidebar — so every country page keeps the sidebar menu. */
export function CountryResearchShell({ children }: { children: React.ReactNode }) {
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
          <main className="main">{children}</main>
        </div>
      </div>
    </UnitsProvider>
  )
}
