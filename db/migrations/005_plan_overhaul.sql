-- My Plan overhaul, Phase 1: extend the plan schema.
-- Runtime `ensurePlanTable()` in src/lib/kolmari-plan.ts is authoritative; this
-- file mirrors it for `npm run db:migrate` parity. All statements are idempotent
-- (the migration runner re-applies every file on each run). Targets the live
-- `nexit_plans` table (note: 003 defines an unused `kolmari_plans` — pre-existing
-- divergence, intentionally left as-is here).

CREATE TABLE IF NOT EXISTS nexit_plans (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  saved_nextination TEXT,
  destination_city TEXT,
  selected_pathway TEXT,
  target_move_date DATE,
  household_members INT CHECK (household_members BETWEEN 1 AND 20),
  journey_stage SMALLINT NOT NULL DEFAULT 1 CHECK (journey_stage BETWEEN 1 AND 8),
  timeline_stage TEXT NOT NULL DEFAULT 'Explore',
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget JSONB NOT NULL DEFAULT '[]'::jsonb,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Destination city (Workspace Profile) — new in Phase 1.
ALTER TABLE nexit_plans ADD COLUMN IF NOT EXISTS destination_city TEXT;

-- Budget is now a line-item array (one-time vs monthly, baseline vs override).
ALTER TABLE nexit_plans ALTER COLUMN budget SET DEFAULT '[]'::jsonb;
