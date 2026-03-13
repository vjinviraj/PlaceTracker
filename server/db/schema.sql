--this is just for reference.

--applications
CREATE TABLE IF NOT EXISTS applications(
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied',
  date_applied DATE,
  link TEXT,
  notes TEXT,
  resume_label TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(clerk_user_id);

--roadmap
CREATE TABLE IF NOT EXISTS roadmap_categories(
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  emoji TEXT DEFAULT '📁',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_roadmap_cats_user ON roadmap_categories(clerk_user_id);

CREATE TABLE IF NOT EXISTS roadmap_topics(
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES roadmap_categories(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_roadmap_topics_user ON roadmap_topics(clerk_user_id);

--calendar

CREATE TABLE IF NOT EXISTS calendar_events(
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  type TEXT DEFAULT 'other',
  date DATE NOT NULL,
  time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_events_user ON calendar_events(clerk_user_id);