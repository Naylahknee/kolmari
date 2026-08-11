import { AccountTabs } from '@/components/kolmari/account-tabs'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { getDashboardLayout } from '@/lib/dashboard-layout-store'

const VALID = ['profile', 'dashboard', 'billing', 'notifications', 'help'] as const
type Tab = (typeof VALID)[number]

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireCurrentUser()
  const raw = (await searchParams).tab
  const tab: Tab = raw && (VALID as readonly string[]).includes(raw) ? (raw as Tab) : 'profile'
  const [profile, layout] = await Promise.all([getProfile(user.id), getDashboardLayout(user.id)])
  return <AccountTabs email={user.email} initial={profile} initialTab={tab} dashboardLayout={layout} />
}
