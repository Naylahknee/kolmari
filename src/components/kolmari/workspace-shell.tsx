'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import type { WizardStatus } from '@/lib/profile'
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
  const usesCountryTemplate =
    /^\/nextinations\/[^/]+\/v2(?:\/|$)/.test(pathname) ||
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
