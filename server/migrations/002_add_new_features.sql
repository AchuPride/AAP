-- ================================================================
-- Add OGBV Advanced Reporting Fields and Features Schema
-- ================================================================

-- Add advanced fields to cases table
ALTER TABLE cases ADD COLUMN IF NOT EXISTS incident_category VARCHAR(100);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS platform_involved VARCHAR(100);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS anonymous_toggle BOOLEAN DEFAULT TRUE;

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  logo_url    VARCHAR(255),
  description TEXT NOT NULL,
  website_url VARCHAR(255),
  contact_info VARCHAR(255),
  category    VARCHAR(50) NOT NULL, -- 'ngo' | 'government' | 'legal' | 'human_rights' | 'community'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Create news & awareness table
CREATE TABLE IF NOT EXISTS news (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  content     TEXT NOT NULL,
  category    VARCHAR(50) NOT NULL, -- 'campaign' | 'news' | 'update' | 'alert' | 'success_story'
  image_url   VARCHAR(255),
  author_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials & survivor feedback table
CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  author_name VARCHAR(100) DEFAULT 'Anonymous Survivor',
  feedback    TEXT NOT NULL,
  category    VARCHAR(50) NOT NULL, -- 'survivor' | 'partner' | 'community'
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
