import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { isAdminUser } from '@/lib/admin'
import { getAnnouncement, getOverview, listUsers } from '@/lib/admin-data'
import { AdminClient } from '@/components/kolmari/admin/admin-client'

export const metadata: Metadata = { title: 'Admin | Kolmari' }

export default async function AdminPage() {
  const user = await requireCurrentUser()
  if (!(await isAdminUser(user))) notFound()

  const [users, overview, announcement] = await Promise.all([listUsers(), getOverview(), getAnnouncement()])
  return <AdminClient users={users} overview={overview} announcement={announcement} currentUserId={user.id} />
}
