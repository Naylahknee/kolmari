-- Subscription tier for feature gating (free = Explorer, plus = Plus,
-- navigator = Navigator). Defaults to 'free'; no billing yet — set manually
-- for testing until checkout is built.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';
