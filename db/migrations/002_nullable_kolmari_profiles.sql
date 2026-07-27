ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wizard_status TEXT NOT NULL DEFAULT 'not_started';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS citizenship TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS annual_income INT CHECK (annual_income >= 0);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS income_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credentials TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS savings INT CHECK (savings >= 0);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS household_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spouse BOOLEAN;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dependents INT CHECK (dependents BETWEEN 0 AND 19);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ancestry_connections TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_regions JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

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
  ALTER COLUMN climate DROP DEFAULT;

UPDATE profiles
SET wizard_status = CASE
  WHEN wizard_completed THEN 'completed'
  WHEN onboarding_completed THEN 'in_progress'
  ELSE wizard_status
END
WHERE wizard_status = 'not_started';

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
  AND onboarding_completed = FALSE;
