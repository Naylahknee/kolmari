import { z } from 'zod'

// A small denylist of the most trivially-guessed passwords. Not exhaustive —
// a durable HIBP/k-anonymity check is the production upgrade path — but it
// blocks the passwords that dominate credential-stuffing lists.
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwerty123', 'iloveyou', 'admin123', 'welcome1', 'letmein1', 'changeme1',
  'passw0rd', 'abc12345', 'football1', 'baseball1', 'sunshine1', 'trustno1',
])

/**
 * Policy for passwords a user is SETTING (signup, password change): at least
 * 10 characters, must mix letters and numbers, and must not be a well-known
 * weak password. bcrypt only hashes the first 72 bytes, so 72 is the ceiling.
 */
export const strongPasswordSchema = z
  .string()
  .min(10, 'Use at least 10 characters.')
  .max(72, 'Use at most 72 characters.')
  .refine((v) => /[a-zA-Z]/.test(v) && /\d/.test(v), 'Include both letters and numbers.')
  .refine((v) => !COMMON_PASSWORDS.has(v.toLowerCase()), 'Choose a less common password.')

export const authSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  // Loose here so existing accounts (created under the old 8-char rule) can
  // still authenticate. New passwords are validated with strongPasswordSchema
  // in the signup branch and the change-password route.
  password: z.string().min(8).max(72),
  mode: z.enum(['login', 'signup']).default('login'),
}).strict()

export const profileUpdateSchema = z.object({
  // Settable manually for testing tier gating until billing exists.
  plan: z.enum(['free', 'plus', 'navigator']).optional(),
  wizard_status: z.enum(['not_started', 'in_progress', 'completed', 'skipped']).optional(),
  display_name: z.string().trim().max(80).nullable().optional(),
  citizenship: z.string().trim().max(80).nullable().optional(),
  current_country: z.string().trim().max(80).nullable().optional(),
  monthly_income: z.number().int().min(0).max(1_000_000).nullable().optional(),
  annual_income: z.number().int().min(0).max(12_000_000).nullable().optional(),
  income_type: z.enum(['Employment', 'Self-employment', 'Pension', 'Investments', 'Mixed', 'Other']).nullable().optional(),
  remote: z.boolean().nullable().optional(),
  occupation: z.string().trim().max(120).nullable().optional(),
  credentials: z.string().trim().max(500).nullable().optional(),
  education: z.enum(['Secondary school', 'Associate degree', 'Bachelor’s degree', 'Master’s degree', 'Doctorate', 'Professional credential', 'Other']).nullable().optional(),
  savings: z.number().int().min(0).max(100_000_000).nullable().optional(),
  household_type: z.enum(['Solo', 'Couple', 'Family', 'Other']).nullable().optional(),
  family_size: z.number().int().min(1).max(12).nullable().optional(),
  spouse: z.boolean().nullable().optional(),
  dependents: z.number().int().min(0).max(19).nullable().optional(),
  ancestry_connections: z.string().trim().max(500).nullable().optional(),
  preferred_regions: z.array(z.enum(['North America', 'Latin America', 'Europe', 'Africa', 'Asia', 'Oceania', 'Open to anywhere'])).max(7).optional(),
  preferred_region: z.string().trim().max(80).nullable().optional(),
  timeline: z.enum(['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Just researching']).nullable().optional(),
  priority: z.enum(['Affordability', 'Safety', 'Career', 'Healthcare & schools', 'Quality of life']).nullable().optional(),
  goals: z.array(z.enum(['Remote Work', 'Employment', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Ancestry', 'Investment'])).max(8).optional(),
  climate: z.enum(['Warm', 'Four seasons', 'Cool', 'No preference']).nullable().optional(),
  onboarding_completed: z.boolean().optional(),
  dashboard_onboarding_completed: z.boolean().optional(),
  wizard_completed: z.boolean().optional(),
  completed_tasks: z.array(z.string().max(80)).max(50).optional(),
  completed_at: z.string().datetime().nullable().optional(),
}).strict()

const nullableMoney = z.number().int().min(0).max(100_000_000).nullable()

const checklistItemSchema = z.object({
  id: z.string().max(64),
  text: z.string().trim().min(1).max(160),
  done: z.boolean(),
  stage: z.enum(['Explore', 'Assess', 'Shortlist', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle In']).nullable(),
  due: z.string().date().nullable(),
}).strict()

const documentItemSchema = z.object({
  id: z.string().max(64),
  name: z.string().trim().min(1).max(160),
  status: z.enum(['not_started', 'in_progress', 'needs_review', 'ready']),
  apostille: z.boolean(),
  translate: z.boolean(),
  due: z.string().date().nullable(),
  note: z.string().trim().max(400).nullable(),
}).strict()

export const nexitPlanUpdateSchema = z.object({
  saved_nextination: z.string().trim().max(100).nullable().optional(),
  selected_pathway: z.string().trim().max(180).nullable().optional(),
  target_move_date: z.string().date().nullable().optional(),
  household_members: z.number().int().min(1).max(20).nullable().optional(),
  journey_stage: z.number().int().min(1).max(8).optional(),
  timeline_stage: z.enum(['Explore', 'Assess', 'Shortlist', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle In']).optional(),
  checklist: z.array(checklistItemSchema).max(200).optional(),
  budget: z.object({ housing: nullableMoney, food: nullableMoney, transport: nullableMoney, healthcare: nullableMoney, other: nullableMoney }).strict().optional(),
  documents: z.array(documentItemSchema).max(200).optional(),
  notes: z.string().max(10_000).nullable().optional(),
}).strict()
