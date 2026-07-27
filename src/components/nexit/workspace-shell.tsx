'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import type { WizardStatus } from '@/lib/profile'
import { usesResearchPage } from '@/lib/countries'
import { UnitsProvider } from '@/components/country-template/client/UnitsControl'
import { TopBar } from '@/components/country-template/TopBar'
import { Sidebar } from '@/components/country-template/Sidebar'

export function WorkspaceShell({
  children,
}: {
  children: React.ReactNode
  email: string
  wizardStatus: WizardStatus
}) {
  const pathname = usePathname()
  useEffect(() => {
    if (window.innerWidth <= 900) document.body.classList.remove('rail-collapsed')
  }, [pathname])
  // CountryTemplate pages (Portugal and any non-research country) bring their
  // own chrome, so the shell passes them through. Discoverable research pages
  // use the shared workspace chrome below so they keep the sidebar and their
  // Tailwind layout renders correctly.
  const v2Match = pathname.match(/^\/nextinations\/([^/]+)\/v2(?:\/|$)/)
  const usesCountryTemplate =
    (v2Match ? !usesResearchPage(v2Match[1]) : false) ||
    pathname === '/nextinations/portugal' ||
    pathname.startsWith('/nextinations/portugal/')

  if (usesCountryTemplate) return children

  return <NewWorkspaceChrome>{children}</NewWorkspaceChrome>
}

function NewWorkspaceChrome({ children }: { children: React.ReactNode }) {
  const toggleRail = () => document.body.classList.toggle('rail-collapsed')

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
