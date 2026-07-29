import type { Metadata } from 'next'
import { MoveChecklist } from '@/components/kolmari/checklist'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export const metadata: Metadata = {
  title: 'Flutter Mode | Kolmari',
  description: 'Prepare for lift-off — work through your move-readiness checklist step by step.',
}

/**
 * Flutter Mode — the execution / preparation phase ("flexing your wings before
 * lift-off"). Distinct from My Plan (the planning workspace): this is the
 * move-readiness checklist you work through, with progress that saves as you go.
 *
 * Route: /flutter
 */
export default async function FlutterModePage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  return <MoveChecklist initial={profile} />
}
