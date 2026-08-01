import 'server-only'

import { isAdminEmail } from './admin'
import { getSql } from './db'

export const WIZARD_STATUSES = ['not_started', 'in_progress', 'completed', 'skipped'] as const
export type WizardStatus = (typeof WIZARD_STATUSES)[number]

// Subscription tier. Maps to the landing pricing: free = Explorer, plus = Plus,
// navigator = Navigator. There is no billing yet — everyone is 'free' and the
// column is settable manually for testing until checkout is built.
export const PLAN_TIERS = ['free', 'plus', 'navigator'] as const
export type PlanTier = (typeof PLAN_TIERS)[number]

export const PATHWAY_GOALS = [
  'Remote Work',
  'Employment',
  'Entrepreneurship',
  'Passive Income / Retirement',
  'Education',
  'Family Reunification',
  'Ancestry',
  'Investment',
] as const
export type PathwayGoal = (typeof PATHWAY_GOALS)[number]

export type RelocationProfile = {
  user_id: number
  plan: PlanTier
  wizard_status: WizardStatus
  display_name: string | null
  citizenship: string | null
  current_country: string | null
  monthly_income: number | null
  annual_income: number | null
  income_type: string | null
  remote: boolean | null
  occupation: string | null
  credentials: string | null
  education: string | null
  savings: number | null
  household_type: string | null
  family_size: number | null
  spouse: boolean | null
  dependents: number | null
  ancestry_connections: string | null
  preferred_regions: string[]
  preferred_region: string | null
  timeline: string | null
  priority: string | null
  goals: PathwayGoal[]
  climate: string | null
  onboarding_completed: boolean
  wizard_completed: boolean
  completed_tasks: string[]
  completed_at: string | null
}

let profilesTableReady: Promise<void> | null = null

export function emptyProfile(userId: number): RelocationProfile {
  return {
    user_id: userId,
    plan: 'free',
    wizard_status: 'not_started',
    display_name: null,
    citizenship: null,
    current_country: null,
    monthly_income: null,
    annual_income: null,
    income_type: null,
    remote: null,
    occupation: null,
    credentials: null,
    education: null,
    savings: null,
    household_type: null,
    family_size: null,
    spouse: null,
    dependents: null,
    ancestry_connections: null,
    preferred_regions: [],
    preferred_region: null,
    timeline: null,
    priority: null,
    goals: [],
    climate: null,
    onboarding_completed: false,
    wizard_completed: false,
    completed_tasks: [],
    completed_at: null,
  }
}

export function hasCompletedProfile(profile: RelocationProfile) {
  return profile.wizard_status === 'completed'
}

/** True when the profile's plan is at least `min` in the tier order. */
export function hasPlan(profile: RelocationProfile, min: PlanTier) {
  return PLAN_TIERS.indexOf(profile.plan) >= PLAN_TIERS.indexOf(min)
}

/** True for any paid tier (Plus or Navigator). */
export function isPaid(profile: RelocationProfile) {
  return profile.plan !== 'free'
}

async function ensureProfilesTable() {
  if (!profilesTableReady) {
    profilesTableReady = (async () => {
      const sql = getSql()
      await sql`
        CREATE TABLE IF NOT EXISTS profiles (
          user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          plan TEXT NOT NULL DEFAULT 'free',
          wizard_status TEXT NOT NULL DEFAULT 'not_started',
          display_name TEXT,
          citizenship TEXT,
          current_country TEXT,
          monthly_income INT CHECK (monthly_income >= 0),
          annual_income INT CHECK (annual_income >= 0),
          income_type TEXT,
          remote BOOLEAN,
          occupation TEXT,
          credentials TEXT,
          education TEXT,
          savings INT CHECK (savings >= 0),
          household_type TEXT,
          family_size INT CHECK (family_size BETWEEN 1 AND 12),
          spouse BOOLEAN,
          dependents INT CHECK (dependents BETWEEN 0 AND 19),
          ancestry_connections TEXT,
          preferred_regions JSONB NOT NULL DEFAULT '[]'::jsonb,
          preferred_region TEXT,
          timeline TEXT,
          priority TEXT,
          goals JSONB NOT NULL DEFAULT '[]'::jsonb,
          climate TEXT,
          onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
          wizard_completed BOOLEAN NOT NULL DEFAULT FALSE,
          completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
          completed_at TIMESTAMPTZ,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wizard_status TEXT NOT NULL DEFAULT 'not_started'`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS citizenship TEXT`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS annual_income INT CHECK (annual_income >= 0)`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS income_type TEXT`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation TEXT`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credentials TEXT`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education TEXT`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS savings INT CHECK (savings >= 0)`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS household_type TEXT`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spouse BOOLEAN`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dependents INT CHECK (dependents BETWEEN 0 AND 19)`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ancestry_connections TEXT`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_regions JSONB NOT NULL DEFAULT '[]'::jsonb`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals JSONB NOT NULL DEFAULT '[]'::jsonb`
      await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ`
      await sql`
        ALTER TABLE profiles
          ALTER COLUMN display_name DROP NOT NULL,
          ALTER COLUMN display_name DROP DEFAULT,
          ALTER COLUMN current_country DROP NOT NULL,
          ALTER COLUMN current_country DROP DEFAULT,
          ALTER COLUMN timeline DROP NOT NULL,
          ALTER COLUMN timeline DROP DEFAULT,
          ALTER COLUMN priority DROP NOT NULL,
          ALTER COLUMN priority DROP DEFAULT,
          ALTER COLUMN monthly_income DROP NOT NULL,
          ALTER COLUMN monthly_income DROP DEFAULT,
          ALTER COLUMN remote DROP NOT NULL,
          ALTER COLUMN remote DROP DEFAULT,
          ALTER COLUMN family_size DROP NOT NULL,
          ALTER COLUMN family_size DROP DEFAULT,
          ALTER COLUMN preferred_region DROP NOT NULL,
          ALTER COLUMN preferred_region DROP DEFAULT,
          ALTER COLUMN climate DROP NOT NULL,
          ALTER COLUMN climate DROP DEFAULT
      `
      await sql`
        UPDATE profiles
        SET wizard_status = CASE
          WHEN wizard_completed THEN 'completed'
          WHEN onboarding_completed THEN 'in_progress'
          ELSE wizard_status
        END
        WHERE wizard_status = 'not_started'
      `
      await sql`
        UPDATE profiles
        SET monthly_income = NULL,
            remote = NULL,
            family_size = NULL,
            preferred_region = NULL,
            climate = NULL,
            timeline = NULL,
            priority = NULL
        WHERE wizard_status = 'not_started'
          AND wizard_completed = FALSE
          AND onboarding_completed = FALSE
      `
    })().catch((error) => {
      profilesTableReady = null
      throw error
    })
  }

  await profilesTableReady
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function normalizeProfile(row: RelocationProfile): RelocationProfile {
  return {
    ...emptyProfile(row.user_id),
    ...row,
    plan: PLAN_TIERS.includes(row.plan) ? row.plan : 'free',
    wizard_status: WIZARD_STATUSES.includes(row.wizard_status) ? row.wizard_status : 'not_started',
    preferred_regions: asStringArray(row.preferred_regions),
    goals: asStringArray(row.goals).filter((goal): goal is PathwayGoal => PATHWAY_GOALS.includes(goal as PathwayGoal)),
    completed_tasks: asStringArray(row.completed_tasks),
  }
}

export async function getProfile(userId: number) {
  await ensureProfilesTable()
  const rows = await getSql()`
    SELECT p.*, u.email AS __email,
           (u.id = (SELECT MIN(id) FROM users)) AS __is_first
    FROM profiles p JOIN users u ON u.id = p.user_id
    WHERE p.user_id = ${userId} LIMIT 1
  ` as (RelocationProfile & { __email?: string; __is_first?: boolean | string })[]
  if (!rows[0]) return emptyProfile(userId)
  const { __email: email, __is_first: isFirstRaw, ...row } = rows[0]
  const profile = normalizeProfile(row as RelocationProfile)
  // Admins see the whole site ungated: promote to the top plan on load so every
  // existing isPaid/plan gate opens. No gate logic or real-user data changes.
  // The first registered account (the owner) is always an admin with zero
  // config; ADMIN_EMAILS grants access to any additional admins.
  const isFirst = isFirstRaw === true || isFirstRaw === 't'
  if (isFirst || isAdminEmail(email)) profile.plan = 'navigator'
  return profile
}

export async function saveProfile(profile: RelocationProfile) {
  await ensureProfilesTable()
  const completedTasks = JSON.stringify(profile.completed_tasks)
  const preferredRegions = JSON.stringify(profile.preferred_regions)
  const goals = JSON.stringify(profile.goals)
  const wizardCompleted = profile.wizard_status === 'completed'
  const rows = await getSql()`
    INSERT INTO profiles (
      user_id, plan, wizard_status, display_name, citizenship, current_country,
      monthly_income, annual_income, income_type, remote, occupation, credentials,
      education, savings, household_type, family_size, spouse, dependents,
      ancestry_connections, preferred_regions, preferred_region, timeline, priority,
      goals, climate, onboarding_completed, wizard_completed, completed_tasks,
      completed_at, updated_at
    ) VALUES (
      ${profile.user_id}, ${profile.plan}, ${profile.wizard_status}, ${profile.display_name}, ${profile.citizenship}, ${profile.current_country},
      ${profile.monthly_income}, ${profile.annual_income}, ${profile.income_type}, ${profile.remote}, ${profile.occupation}, ${profile.credentials},
      ${profile.education}, ${profile.savings}, ${profile.household_type}, ${profile.family_size}, ${profile.spouse}, ${profile.dependents},
      ${profile.ancestry_connections}, ${preferredRegions}::jsonb, ${profile.preferred_region}, ${profile.timeline}, ${profile.priority},
      ${goals}::jsonb, ${profile.climate}, ${wizardCompleted}, ${wizardCompleted}, ${completedTasks}::jsonb,
      ${profile.completed_at}, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan = EXCLUDED.plan,
      wizard_status = EXCLUDED.wizard_status,
      display_name = EXCLUDED.display_name,
      citizenship = EXCLUDED.citizenship,
      current_country = EXCLUDED.current_country,
      monthly_income = EXCLUDED.monthly_income,
      annual_income = EXCLUDED.annual_income,
      income_type = EXCLUDED.income_type,
      remote = EXCLUDED.remote,
      occupation = EXCLUDED.occupation,
      credentials = EXCLUDED.credentials,
      education = EXCLUDED.education,
      savings = EXCLUDED.savings,
      household_type = EXCLUDED.household_type,
      family_size = EXCLUDED.family_size,
      spouse = EXCLUDED.spouse,
      dependents = EXCLUDED.dependents,
      ancestry_connections = EXCLUDED.ancestry_connections,
      preferred_regions = EXCLUDED.preferred_regions,
      preferred_region = EXCLUDED.preferred_region,
      timeline = EXCLUDED.timeline,
      priority = EXCLUDED.priority,
      goals = EXCLUDED.goals,
      climate = EXCLUDED.climate,
      onboarding_completed = EXCLUDED.onboarding_completed,
      wizard_completed = EXCLUDED.wizard_completed,
      completed_tasks = EXCLUDED.completed_tasks,
      completed_at = EXCLUDED.completed_at,
      updated_at = NOW()
    RETURNING *
  ` as RelocationProfile[]
  return normalizeProfile(rows[0])
}
