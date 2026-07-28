'use client'

import { WorkspaceShell } from '@/components/kolmari/workspace-shell'
import type { WizardStatus } from '@/lib/profile'

/**
 * Canonical Kolmari app-shell boundary for the migration.
 * The existing WorkspaceShell remains the implementation during Milestone 1
 * so authentication, route behavior, units state, and responsive chrome stay intact.
 */
export function KolmariAppShell({
  children,
  email,
  wizardStatus,
}: {
  children: React.ReactNode
  email: string
  wizardStatus: WizardStatus
}) {
  return (
    <WorkspaceShell email={email} wizardStatus={wizardStatus}>
      {children}
    </WorkspaceShell>
  )
}
