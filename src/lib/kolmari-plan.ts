import 'server-only'

import { getSql } from './db'
import { normalizePlan, type NexitPlan } from './plan-types'

// Re-export the shared model so existing server imports of '@/lib/kolmari-plan'
// keep working. Client components import from '@/lib/plan-types' directly.
export * from './plan-types'

let planTableReady: Promise<void> | null = null

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
