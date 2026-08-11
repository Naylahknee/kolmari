import 'server-only'

import { getSql } from './db'
import { ensureProfilesTable } from './profile'
import { DEFAULT_LAYOUT, parseLayout, type DashboardLayout } from './dashboard-layout'

/**
 * Per-user dashboard layout persistence.
 *
 * Kept in its own column with its own read/write helpers rather than folded into
 * `saveProfile`, so saving the profile form never clobbers the layout and the
 * existing profile API contract is untouched.
 */

let columnReady: Promise<void> | null = null

async function ensureColumn() {
  if (!columnReady) {
    columnReady = (async () => {
      await ensureProfilesTable()
      await getSql()`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dashboard_layout JSONB`
    })().catch((error) => { columnReady = null; throw error })
  }
  await columnReady
}

/** The user's saved layout, or the shipped default when they have not customized it. */
export async function getDashboardLayout(userId: number): Promise<DashboardLayout> {
  try {
    await ensureColumn()
    const rows = await getSql()`
      SELECT dashboard_layout FROM profiles WHERE user_id = ${userId} LIMIT 1
    ` as { dashboard_layout: unknown }[]
    const stored = rows[0]?.dashboard_layout
    if (stored === null || stored === undefined) return DEFAULT_LAYOUT
    return parseLayout(typeof stored === 'string' ? JSON.parse(stored) : stored)
  } catch {
    // A layout preference must never take the dashboard down.
    return DEFAULT_LAYOUT
  }
}

export async function saveDashboardLayout(userId: number, layout: DashboardLayout): Promise<void> {
  await ensureColumn()
  await getSql()`
    UPDATE profiles SET dashboard_layout = ${JSON.stringify(layout)}::jsonb WHERE user_id = ${userId}
  `
}

/** Clear the customization so the user falls back to the shipped default. */
export async function resetDashboardLayout(userId: number): Promise<void> {
  await ensureColumn()
  await getSql()`UPDATE profiles SET dashboard_layout = NULL WHERE user_id = ${userId}`
}
