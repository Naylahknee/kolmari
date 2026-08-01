import 'server-only'

import { getSql } from './db'
import { journeyStageLabel, normalizePlan, type NexitPlan } from './plan-types'

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
          journey_stage SMALLINT,
          timeline_stage TEXT NOT NULL DEFAULT 'Explore',
          checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
          budget JSONB NOT NULL DEFAULT '{"housing":null,"food":null,"transport":null,"healthcare":null,"other":null}'::jsonb,
          documents JSONB NOT NULL DEFAULT '[]'::jsonb,
          notes TEXT,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await getSql()`ALTER TABLE nexit_plans ADD COLUMN IF NOT EXISTS journey_stage SMALLINT`
      await getSql()`ALTER TABLE nexit_plans DROP CONSTRAINT IF EXISTS nexit_plans_timeline_stage_check`
      await getSql()`
        UPDATE nexit_plans
        SET journey_stage = CASE timeline_stage
          WHEN 'Assess' THEN 2 WHEN 'Shortlist' THEN 3 WHEN 'Decide' THEN 4
          WHEN 'Prepare' THEN 5 WHEN 'Apply' THEN 6 WHEN 'Move' THEN 7
          WHEN 'Settle' THEN 8 WHEN 'Settle In' THEN 8 ELSE 1 END
        WHERE journey_stage IS NULL
      `
      await getSql()`
        UPDATE nexit_plans SET timeline_stage = CASE journey_stage
          WHEN 2 THEN 'Assess' WHEN 3 THEN 'Shortlist' WHEN 4 THEN 'Decide'
          WHEN 5 THEN 'Prepare' WHEN 6 THEN 'Apply' WHEN 7 THEN 'Move'
          WHEN 8 THEN 'Settle In' ELSE 'Explore' END
      `
      await getSql()`ALTER TABLE nexit_plans ALTER COLUMN journey_stage SET DEFAULT 1`
      await getSql()`ALTER TABLE nexit_plans ALTER COLUMN journey_stage SET NOT NULL`
      await getSql()`
        DO $$
        BEGIN
          BEGIN
            ALTER TABLE nexit_plans ADD CONSTRAINT nexit_plans_journey_stage_v2_check CHECK (journey_stage BETWEEN 1 AND 8);
          EXCEPTION WHEN duplicate_object THEN NULL;
          END;
          BEGIN
            ALTER TABLE nexit_plans ADD CONSTRAINT nexit_plans_timeline_stage_v2_check CHECK (timeline_stage IN ('Explore','Assess','Shortlist','Decide','Prepare','Apply','Move','Settle In'));
          EXCEPTION WHEN duplicate_object THEN NULL;
          END;
        END
        $$;
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
  const stageLabel = journeyStageLabel(plan.journey_stage)
  const rows = await getSql()`
    INSERT INTO nexit_plans (user_id, saved_nextination, selected_pathway, target_move_date, household_members, journey_stage, timeline_stage, checklist, budget, documents, notes, updated_at)
    VALUES (${plan.user_id}, ${plan.saved_nextination}, ${plan.selected_pathway}, ${plan.target_move_date}, ${plan.household_members}, ${plan.journey_stage}, ${stageLabel}, ${JSON.stringify(plan.checklist)}::jsonb, ${JSON.stringify(plan.budget)}::jsonb, ${JSON.stringify(plan.documents)}::jsonb, ${plan.notes}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      saved_nextination = EXCLUDED.saved_nextination,
      selected_pathway = EXCLUDED.selected_pathway,
      target_move_date = EXCLUDED.target_move_date,
      household_members = EXCLUDED.household_members,
      journey_stage = EXCLUDED.journey_stage,
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
