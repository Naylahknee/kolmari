import { redirect } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { KolmariAppShell } from '@/components/layout/kolmari-app-shell'
import { getProfile } from '@/lib/profile'
import '@/styles/workspace-chrome.css'

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  if (profile.wizard_status === 'not_started') redirect('/welcome')
  if (profile.wizard_status === 'in_progress') redirect('/profile-wizard')
  return (
    <KolmariAppShell email={user.email} wizardStatus={profile.wizard_status}>
      {children}
    </KolmariAppShell>
  )
}
