-- ================================================================
-- GBV Anonymous Reporting Platform — Full Database Schema
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ROLES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) UNIQUE NOT NULL,  -- 'admin' | 'officer'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name) VALUES ('admin'), ('officer')
ON CONFLICT (name) DO NOTHING;

-- ─── USERS (staff only — no anonymous users stored) ─────────────
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(100) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  full_name       VARCHAR(200) NOT NULL,
  role_id         INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  is_active       BOOLEAN DEFAULT TRUE,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CASES ──────────────────────────────────────────────────────
CREATE TYPE case_status AS ENUM (
  'submitted',
  'under_review',
  'assigned',
  'investigating',
  'resolved',
  'closed'
);

CREATE TYPE violence_type AS ENUM (
  'physical',
  'sexual',
  'psychological',
  'economic',
  'stalking',
  'online_harassment',
  'other'
);

CREATE TABLE IF NOT EXISTS cases (
  id                  SERIAL PRIMARY KEY,
  case_token          VARCHAR(32) UNIQUE NOT NULL,   -- crypto-random, shown to reporter
  violence_type       violence_type NOT NULL,
  description         TEXT NOT NULL,
  location            VARCHAR(500),                  -- general area only, no specific address
  incident_date       DATE NOT NULL,
  status              case_status DEFAULT 'submitted',
  assigned_officer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_priority         BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CASE EVIDENCE (file metadata only) ─────────────────────────
CREATE TABLE IF NOT EXISTS case_evidence (
  id            SERIAL PRIMARY KEY,
  case_id       INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  filename      VARCHAR(255) NOT NULL,     -- stored name (UUID-based, no original name)
  mime_type     VARCHAR(100) NOT NULL,
  size_bytes    INTEGER NOT NULL,
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CASE UPDATES / TIMELINE ────────────────────────────────────
CREATE TYPE update_type AS ENUM (
  'status_change',
  'assignment',
  'note',
  'evidence_added'
);

CREATE TABLE IF NOT EXISTS case_updates (
  id              SERIAL PRIMARY KEY,
  case_id         INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  updated_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,  -- NULL = system
  update_type     update_type NOT NULL DEFAULT 'note',
  old_status      case_status,
  new_status      case_status,
  note            TEXT,                     -- internal notes, not shown to anonymous user
  public_message  TEXT,                     -- shown to token holder
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUDIT LOG ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          SERIAL PRIMARY KEY,
  actor_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  resource    VARCHAR(100),
  resource_id VARCHAR(100),
  metadata    JSONB,
  ip_hash     VARCHAR(64),   -- one-way hash only, never raw IP
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cases_token         ON cases(case_token);
CREATE INDEX IF NOT EXISTS idx_cases_status        ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_officer       ON cases(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_cases_created       ON cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_updates_case   ON case_updates(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor         ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_created       ON audit_logs(created_at DESC);

-- ─── updated_at trigger ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
