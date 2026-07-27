CREATE TABLE IF NOT EXISTS kolmari_plans (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  saved_destination TEXT,
  selected_pathway TEXT,
  target_move_date DATE,
  household_members INT CHECK (household_members BETWEEN 1 AND 20),
  timeline_stage TEXT NOT NULL DEFAULT 'Explore' CHECK (timeline_stage IN ('Explore','Decide','Prepare','Apply','Move','Settle')),
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget JSONB NOT NULL DEFAULT '{"housing":null,"food":null,"transport":null,"healthcare":null,"other":null}'::jsonb,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
