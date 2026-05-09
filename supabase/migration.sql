-- ============================================================
-- Credex AI Spend Audit — Supabase Migration
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Audits table: stores the full audit report as JSONB
CREATE TABLE IF NOT EXISTS audits (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Leads table: stores captured lead data
CREATE TABLE IF NOT EXISTS leads (
  email TEXT PRIMARY KEY,
  audit_id TEXT REFERENCES audits(id) ON DELETE SET NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);

-- 4. Enable Row Level Security (required by Supabase best practices)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Allow the service_role key full access
-- (Our API routes use the service_role key, so this grants them
--  full read/write. No anonymous/public access is allowed.)
CREATE POLICY "Service role full access on audits"
  ON audits
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on leads"
  ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);
