-- 🌍 Add new safety columns to your existing countries table
ALTER TABLE countries ADD COLUMN IF NOT EXISTS flag_url TEXT;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS official_name TEXT;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS languages TEXT[];
ALTER TABLE countries ADD COLUMN IF NOT EXISTS currency_code TEXT;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS driving_side TEXT;

-- 🛡️ Create the brand new safety profile table for your dynamic shield graphic
CREATE TABLE IF NOT EXISTS city_safety_profiles (
  id SERIAL PRIMARY KEY,
  country_id INT REFERENCES countries(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  personal_safety_score DECIMAL(5,2), -- Powers the left side of the shield
  property_safety_score DECIMAL(5,2), -- Powers the right side of the shield
  safety_tier TEXT,                   -- "high", "nuanced_petty_theft", etc.
  safety_preview_text TEXT,           -- The short text for the right sidebar panel
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 💬 Create the table to hold real-time expat community notes
CREATE TABLE IF NOT EXISTS community_notes (
  id SERIAL PRIMARY KEY,
  country_id INT REFERENCES countries(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  username TEXT NOT NULL,
  message VARCHAR(280) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
