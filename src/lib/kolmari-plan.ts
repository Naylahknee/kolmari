import 'server-only'

import { getSql } from './db'
import { journeyStageLabel, normalizePlan, type KolmariPlan } from './plan-types'

// Re-export the shared model so existing server imports of '@/lib/kolmari-plan'
// keep working. Client components import from '@/lib/plan-types' directly.
export * from './plan-types'

let planTableReady: Promise<void> | null = null

async function ensurePlanTable() {
  if (!planTableReady) {
    planTableReady = (async () => {
      // One-time rename of the legacy table so existing user plans are preserved.
      // Renames only when the old table exists and the new one does not, so fresh
      // installs and already-migrated databases are both no-ops. This is the only
      // remaining reference to the pre-rename table name, kept for data safety.
      await getSql()`
        DO $$
        BEGIN
          IF to_regclass('public.nexit_plans') IS NOT NULL AND to_regclass('public.kolmari_plans') IS NULL THEN
            ALTER TABLE nexit_plans RENAME TO kolmari_plans;
          END IF;
        END
        $$;
      `
      await getSql()`
        CREATE TABLE IF NOT EXISTS kolmari_plans (
          user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          saved_nextination TEXT,
          destination_city TEXT,
          selected_pathway TEXT,
          target_move_date DATE,
          household_members INT CHECK (household_members BETWEEN 1 AND 20),
          journey_stage SMALLINT,
          timeline_stage TEXT NOT NULL DEFAULT 'Explore',
          checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
          budget JSONB NOT NULL DEFAULT '[]'::jsonb,
          documents JSONB NOT NULL DEFAULT '[]'::jsonb,
          notes TEXT,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      // Phase 1 (My Plan overhaul): destination city + budget is now a line-item array.
      await getSql()`ALTER TABLE kolmari_plans ADD COLUMN IF NOT EXISTS destination_city TEXT`
      await getSql()`ALTER TABLE kolmari_plans ALTER COLUMN budget SET DEFAULT '[]'::jsonb`
      await getSql()`ALTER TABLE kolmari_plans ADD COLUMN IF NOT EXISTS journey_stage SMALLINT`
      await getSql()`ALTER TABLE kolmari_plans DROP CONSTRAINT IF EXISTS kolmari_plans_timeline_stage_check`
      await getSql()`
        UPDATE kolmari_plans
        SET journey_stage = CASE timeline_stage
          WHEN 'Assess' THEN 2 WHEN 'Shortlist' THEN 3 WHEN 'Decide' THEN 4
          WHEN 'Prepare' THEN 5 WHEN 'Apply' THEN 6 WHEN 'Move' THEN 7
          WHEN 'Settle' THEN 8 WHEN 'Settle In' THEN 8 ELSE 1 END
        WHERE journey_stage IS NULL
      `
      await getSql()`
        UPDATE kolmari_plans SET timeline_stage = CASE journey_stage
          WHEN 2 THEN 'Assess' WHEN 3 THEN 'Shortlist' WHEN 4 THEN 'Decide'
          WHEN 5 THEN 'Prepare' WHEN 6 THEN 'Apply' WHEN 7 THEN 'Move'
          WHEN 8 THEN 'Settle In' ELSE 'Explore' END
      `
      await getSql()`ALTER TABLE kolmari_plans ALTER COLUMN journey_stage SET DEFAULT 1`
      await getSql()`ALTER TABLE kolmari_plans ALTER COLUMN journey_stage SET NOT NULL`
      await getSql()`
        DO $$
        BEGIN
          BEGIN
            ALTER TABLE kolmari_plans ADD CONSTRAINT kolmari_plans_journey_stage_v2_check CHECK (journey_stage BETWEEN 1 AND 8);
          EXCEPTION WHEN duplicate_object THEN NULL;
          END;
          BEGIN
            ALTER TABLE kolmari_plans ADD CONSTRAINT kolmari_plans_timeline_stage_v2_check CHECK (timeline_stage IN ('Explore','Assess','Shortlist','Decide','Prepare','Apply','Move','Settle In'));
          EXCEPTION WHEN duplicate_object THEN NULL;
          END;
        END
        $$;
      `
    })().catch((error) => { planTableReady = null; throw error })
  }
  await planTableReady
}

export async function getKolmariPlan(userId: number) {
  await ensurePlanTable()
  const rows = await getSql()`SELECT * FROM kolmari_plans WHERE user_id = ${userId} LIMIT 1` as KolmariPlan[]
  return rows[0] ? normalizePlan(rows[0]) : null
}

export async function saveKolmariPlan(plan: KolmariPlan) {
  await ensurePlanTable()
  const stageLabel = journeyStageLabel(plan.journey_stage)
  const rows = await getSql()`
    INSERT INTO kolmari_plans (user_id, saved_nextination, destination_city, selected_pathway, target_move_date, household_members, journey_stage, timeline_stage, checklist, budget, documents, notes, updated_at)
    VALUES (${plan.user_id}, ${plan.saved_nextination}, ${plan.destination_city}, ${plan.selected_pathway}, ${plan.target_move_date}, ${plan.household_members}, ${plan.journey_stage}, ${stageLabel}, ${JSON.stringify(plan.checklist)}::jsonb, ${JSON.stringify(plan.budget)}::jsonb, ${JSON.stringify(plan.documents)}::jsonb, ${plan.notes}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      saved_nextination = EXCLUDED.saved_nextination,
      destination_city = EXCLUDED.destination_city,
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
  ` as KolmariPlan[]
  return normalizePlan(rows[0])
}
