'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import type { WizardStatus } from '@/lib/profile'
import { UnitsProvider } from '@/components/country-template/client/UnitsControl'
import { TopBar } from '@/components/country-template/TopBar'
import { Sidebar } from '@/components/country-template/Sidebar'
import { AnnouncementBar } from '@/components/kolmari/announcement-bar'
import { FullWidthWorkspaceStyles } from '@/components/kolmari/full-width-workspace-styles'
import {
  activityForPath,
  WORKSPACE_ACTIVITY_EVENT,
  WORKSPACE_ACTIVITY_STORAGE_KEY,
} from '@/lib/workspace-activity'

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
  useEffect(() => {
    const activity = activityForPath(pathname)
    if (!activity) return
    window.localStorage.setItem(WORKSPACE_ACTIVITY_STORAGE_KEY, JSON.stringify(activity))
    window.dispatchEvent(new Event(WORKSPACE_ACTIVITY_EVENT))
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
        <FullWidthWorkspaceStyles />
        <AnnouncementBar />
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
