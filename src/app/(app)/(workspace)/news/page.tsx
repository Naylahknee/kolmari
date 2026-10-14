import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { getKolmariPlan } from '@/lib/kolmari-plan'
import { NewsFeed } from '@/components/kolmari/news/news-feed'

export const metadata: Metadata = {
  title: 'News & Guides | Kolmari',
  description: 'Visa and fee changes, new routes, guides, events and Kolmari updates.',
}

export default async function NewsPage() {
  const user = await requireCurrentUser()
  const plan = await getKolmariPlan(user.id)
  return <NewsFeed savedDestination={plan?.saved_nextination ?? null} />
}
