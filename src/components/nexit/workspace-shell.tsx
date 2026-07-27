'use client'

import { usePathname } from 'next/navigation'
import { AppShell } from './app-shell'
import type { WizardStatus } from '@/lib/profile'

export function WorkspaceShell({
  children,
  email,
  wizardStatus,
}: {
  children: React.ReactNode
  email: string
  wizardStatus: WizardStatus
}) {
  const pathname = usePathname()
  const usesCountryTemplate =
    /^\/nextinations\/[^/]+\/v2(?:\/|$)/.test(pathname) ||
    pathname === '/nextinations/portugal' ||
    pathname.startsWith('/nextinations/portugal/')

  if (usesCountryTemplate) return children

  return (
    <AppShell email={email} wizardStatus={wizardStatus}>
      {children}
    </AppShell>
  )
}
