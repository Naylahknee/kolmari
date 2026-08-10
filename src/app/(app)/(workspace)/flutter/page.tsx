import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'
import { daysUntil, formatShortDate, getKolmariPlan, nextBestAction, type KolmariPlan } from '@/lib/kolmari-plan'
import { COUNTRIES } from '@/lib/countries'
import { rankNextinations } from '@/lib/userProfile'
import { FlutterMode, type ProtocolItem } from '@/components/kolmari/flutter-mode'
import { FlutterGate, type QuizResult } from '@/components/kolmari/flutter-gate'

export const metadata: Metadata = {
  title: 'Flutter Mode | Kolmari',
  description: 'The execution phase — work your requirements, track your application, and prepare to land.',
}

function protocolItems(plan: KolmariPlan | null, today: Date): ProtocolItem[] {
  if (!plan) return []
  return plan.checklist.slice(0, 6).map((item) => {
    const overdue = !item.done && item.due !== null && (daysUntil(item.due, today) ?? 0) < 0
    return {
      id: item.id,
      text: item.text,
      state: item.done ? 'done' : overdue ? 'overdue' : 'open',
      meta: [item.stage ?? null, item.due ? `Due ${formatShortDate(item.due)}` : null].filter(Boolean).join(' · ') || 'No stage set',
    }
  })
}

export default async function FlutterModePage() {
  const user = await requireCurrentUser()
  const [profile, plan] = await Promise.all([getProfile(user.id), getKolmariPlan(user.id)])
  const ranked = profile.wizard_status === 'completed' ? rankNextinations(profile) : []

  if (!isPaid(profile)) {
    const countries = ranked.length ? ranked.map((item) => item.country) : COUNTRIES.slice(0, 4)
    const results: QuizResult[] = countries.slice(0, 4).map((country, index) => ({
      slug: country.slug,
      name: country.name,
      region: country.region,
      code: country.code,
      unlocked: index === 0,
    }))
    return <FlutterGate results={results} />
  }

  const today = new Date()
  const action = plan ? nextBestAction(plan) : null

  return (
    <FlutterMode
      initial={profile}
      destination={plan?.saved_nextination ?? null}
      action={action}
      actionDue={action?.dueDate ? formatShortDate(action.dueDate) : null}
      protocolItems={protocolItems(plan, today)}
    />
  )
}
