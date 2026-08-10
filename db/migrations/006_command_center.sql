-- Command Center — multi-destination household planning board.
-- Mirrors the runtime ensureTables() in src/lib/command-center.ts for
-- `npm run db:migrate` parity. Scoped to the signed-in user (user_id); distinct
-- from the single-destination nexit_plans + 8-stage Tracker.

CREATE TABLE IF NOT EXISTS cc_destination (
  id         TEXT PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  position   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_dest_user ON cc_destination(user_id);

CREATE TABLE IF NOT EXISTS cc_checklist_item (
  id             TEXT PRIMARY KEY,
  destination_id TEXT NOT NULL REFERENCES cc_destination(id) ON DELETE CASCADE,
  category       TEXT NOT NULL,
  text           TEXT NOT NULL,
  checked        BOOLEAN NOT NULL DEFAULT FALSE,
  is_default     BOOLEAN NOT NULL DEFAULT FALSE,
  position       INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_item_dest ON cc_checklist_item(destination_id, category);

CREATE TABLE IF NOT EXISTS cc_note (
  id             TEXT PRIMARY KEY,
  destination_id TEXT NOT NULL REFERENCES cc_destination(id) ON DELETE CASCADE,
  category       TEXT NOT NULL,
  body           TEXT NOT NULL DEFAULT '',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (destination_id, category)
);

CREATE TABLE IF NOT EXISTS cc_member (
  id         TEXT PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  age        INT,
  needs      TEXT NOT NULL DEFAULT '',
  position   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_member_user ON cc_member(user_id);

CREATE TABLE IF NOT EXISTS cc_member_note (
  id             TEXT PRIMARY KEY,
  member_id      TEXT NOT NULL REFERENCES cc_member(id) ON DELETE CASCADE,
  destination_id TEXT NOT NULL REFERENCES cc_destination(id) ON DELETE CASCADE,
  body           TEXT NOT NULL DEFAULT '',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (member_id, destination_id)
);
