import { redirect } from 'next/navigation'

export default async function KolmariPlanPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams
  const planTab = typeof params.tab === 'string' ? params.tab : 'overview'
  redirect(`/command-center?tab=my-plan&planTab=${encodeURIComponent(planTab)}`)
}
