import 'server-only'

import { getSql } from './db'
import { PLAN_TIERS, type PlanTier } from './profile'
import { isAdminEmail } from './admin'

// ─── Users & plans ──────────────────────────────────────────────────────────

export type AdminUser = {
  id: number
  email: string
  display_name: string | null
  plan: PlanTier
  wizard_status: string
  is_admin: boolean
}

/** All accounts with their profile plan/status, oldest first. */
export async function listUsers(): Promise<AdminUser[]> {
  const rows = (await getSql()`
    SELECT u.id, u.email,
           p.display_name,
           COALESCE(p.plan, 'free') AS plan,
           COALESCE(p.wizard_status, 'not_started') AS wizard_status,
           (u.id = (SELECT MIN(id) FROM users)) AS is_first
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    ORDER BY u.id ASC
  `) as (Omit<AdminUser, 'is_admin'> & { is_first: boolean | string })[]
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    display_name: r.display_name,
    plan: PLAN_TIERS.includes(r.plan) ? r.plan : 'free',
    wizard_status: r.wizard_status,
    is_admin: r.is_first === true || r.is_first === 't' || isAdminEmail(r.email),
  }))
}

/** Set a user's subscription tier. Creates the profile row if absent. */
export async function setUserPlan(userId: number, plan: PlanTier): Promise<void> {
  await getSql()`
    INSERT INTO profiles (user_id, plan)
    VALUES (${userId}, ${plan})
    ON CONFLICT (user_id) DO UPDATE SET plan = EXCLUDED.plan, updated_at = NOW()
  `
}

// ─── Usage overview ─────────────────────────────────────────────────────────

export type AdminOverview = {
  totalUsers: number
  completedProfiles: number
  planCounts: Record<PlanTier, number>
}

export async function getOverview(): Promise<AdminOverview> {
  const rows = (await getSql()`
    SELECT
      (SELECT COUNT(*) FROM users)::int AS total_users,
      (SELECT COUNT(*) FROM profiles WHERE wizard_status = 'completed')::int AS completed_profiles,
      (SELECT COUNT(*) FROM users u LEFT JOIN profiles p ON p.user_id = u.id
         WHERE COALESCE(p.plan, 'free') = 'free')::int AS free_count,
      (SELECT COUNT(*) FROM profiles WHERE plan = 'plus')::int AS plus_count,
      (SELECT COUNT(*) FROM profiles WHERE plan = 'navigator')::int AS navigator_count
  `) as {
    total_users: number; completed_profiles: number
    free_count: number; plus_count: number; navigator_count: number
  }[]
  const r = rows[0]
  return {
    totalUsers: r?.total_users ?? 0,
    completedProfiles: r?.completed_profiles ?? 0,
    planCounts: {
      free: r?.free_count ?? 0,
      plus: r?.plus_count ?? 0,
      navigator: r?.navigator_count ?? 0,
    },
  }
}

// ─── Site settings (content management) ─────────────────────────────────────

export type SiteAnnouncement = { text: string; href?: string | null; linkLabel?: string | null }

let settingsTableReady: Promise<void> | null = null
async function ensureSettingsTable() {
  if (!settingsTableReady) {
    settingsTableReady = (async () => {
      await getSql()`
        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value JSONB,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
    })().catch((error) => { settingsTableReady = null; throw error })
  }
  await settingsTableReady
}

/** Current site-wide announcement, or null when none is published. */
export async function getAnnouncement(): Promise<SiteAnnouncement | null> {
  await ensureSettingsTable()
  const rows = (await getSql()`SELECT value FROM site_settings WHERE key = 'announcement' LIMIT 1`) as { value: SiteAnnouncement | null }[]
  const value = rows[0]?.value
  if (!value || typeof value.text !== 'string' || !value.text.trim()) return null
  return { text: value.text, href: value.href ?? null, linkLabel: value.linkLabel ?? null }
}

/** Publish (or clear, when passed null) the site-wide announcement. */
export async function setAnnouncement(value: SiteAnnouncement | null): Promise<void> {
  await ensureSettingsTable()
  const payload = value && value.text.trim()
    ? JSON.stringify({ text: value.text.trim(), href: value.href?.trim() || null, linkLabel: value.linkLabel?.trim() || null })
    : null
  await getSql()`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('announcement', ${payload}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `
}
