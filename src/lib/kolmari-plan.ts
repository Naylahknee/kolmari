import 'server-only'

import { getSql } from './db'

export const PLAN_STAGES = ['Explore', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle'] as const
export type PlanStage = (typeof PLAN_STAGES)[number]

export type PlanBudget = { housing: number | null; food: number | null; transport: number | null; healthcare: number | null; other: number | null }

export type NexitPlan = {
  user_id: number
  saved_nextination: string | null
  selected_pathway: string | null
  target_move_date: string | null
  household_members: number | null
  timeline_stage: PlanStage
  checklist: string[]
  budget: PlanBudget
  documents: string[]
  notes: string | null
  updated_at: string | null
}

let planTableReady: Promise<void> | null = null

export function emptyNexitPlan(userId: number): NexitPlan {
  return { user_id: userId, saved_nextination: null, selected_pathway: null, target_move_date: null, household_members: null, timeline_stage: 'Explore', checklist: [], budget: { housing: null, food: null, transport: null, healthcare: null, other: null }, documents: [], notes: null, updated_at: null }
}

async function ensurePlanTable() {
  if (!planTableReady) {
    planTableReady = (async () => {
      await getSql()`
        CREATE TABLE IF NOT EXISTS nexit_plans (
          user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          saved_nextination TEXT,
          selected_pathway TEXT,
          target_move_date DATE,
          household_members INT CHECK (household_members BETWEEN 1 AND 20),
          timeline_stage TEXT NOT NULL DEFAULT 'Explore' CHECK (timeline_stage IN ('Explore','Decide','Prepare','Apply','Move','Settle')),
          checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
          budget JSONB NOT NULL DEFAULT '{"housing":null,"food":null,"transport":null,"healthcare":null,"other":null}'::jsonb,
          documents JSONB NOT NULL DEFAULT '[]'::jsonb,
          notes TEXT,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
    })().catch((error) => { planTableReady = null; throw error })
  }
  await planTableReady
}

function strings(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [] }

function normalizePlan(row: NexitPlan): NexitPlan {
  const budget = typeof row.budget === 'object' && row.budget ? row.budget : emptyNexitPlan(row.user_id).budget
  return { ...emptyNexitPlan(row.user_id), ...row, checklist: strings(row.checklist), documents: strings(row.documents), budget: { ...emptyNexitPlan(row.user_id).budget, ...budget } }
}

export async function getNexitPlan(userId: number) {
  await ensurePlanTable()
  const rows = await getSql()`SELECT * FROM nexit_plans WHERE user_id = ${userId} LIMIT 1` as NexitPlan[]
  return rows[0] ? normalizePlan(rows[0]) : null
}

export async function saveNexitPlan(plan: NexitPlan) {
  await ensurePlanTable()
  const rows = await getSql()`
    INSERT INTO nexit_plans (user_id, saved_nextination, selected_pathway, target_move_date, household_members, timeline_stage, checklist, budget, documents, notes, updated_at)
    VALUES (${plan.user_id}, ${plan.saved_nextination}, ${plan.selected_pathway}, ${plan.target_move_date}, ${plan.household_members}, ${plan.timeline_stage}, ${JSON.stringify(plan.checklist)}::jsonb, ${JSON.stringify(plan.budget)}::jsonb, ${JSON.stringify(plan.documents)}::jsonb, ${plan.notes}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      saved_nextination = EXCLUDED.saved_nextination,
      selected_pathway = EXCLUDED.selected_pathway,
      target_move_date = EXCLUDED.target_move_date,
      household_members = EXCLUDED.household_members,
      timeline_stage = EXCLUDED.timeline_stage,
      checklist = EXCLUDED.checklist,
      budget = EXCLUDED.budget,
      documents = EXCLUDED.documents,
      notes = EXCLUDED.notes,
      updated_at = NOW()
    RETURNING *
  ` as NexitPlan[]
  return normalizePlan(rows[0])
}
