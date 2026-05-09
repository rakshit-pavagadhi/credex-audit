// ============================================================
// In-memory store for audit reports (Supabase-ready interface)
// In production, swap to Supabase client.
// ============================================================

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { AuditReport, LeadData } from '@/types';

// Use a local JSON file to persist data across Next.js dev server restarts
const DB_FILE = path.join(process.cwd(), '.local-db.json');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null;

interface DbSchema {
  audits: Record<string, AuditReport>;
  leads: Record<string, LeadData>;
}

function readDb(): DbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read local DB', e);
  }
  return { audits: {}, leads: {} };
}

function writeDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write local DB', e);
  }
}

export async function saveAudit(report: AuditReport): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from('audits')
      .upsert({ id: report.id, data: report }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveAudit failed, falling back to local DB', error);
    } else {
      return;
    }
  }

  const db = readDb();
  db.audits[report.id] = report;
  writeDb(db);
}

export async function getAudit(id: string): Promise<AuditReport | undefined> {
  if (supabase) {
    const { data, error } = await supabase
      .from('audits')
      .select('data')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase getAudit failed, falling back to local DB', error);
    } else {
      return data?.data as AuditReport | undefined;
    }
  }

  const db = readDb();
  return db.audits[id];
}

export async function saveLead(lead: LeadData): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from('leads')
      .upsert(
        {
          email: lead.email,
          audit_id: lead.auditId,
          data: lead,
        },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Supabase saveLead failed, falling back to local DB', error);
    } else {
      return;
    }
  }

  const db = readDb();
  db.leads[lead.email] = lead;
  writeDb(db);
}

export async function getLead(email: string): Promise<LeadData | undefined> {
  if (supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('data')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Supabase getLead failed, falling back to local DB', error);
    } else {
      return data?.data as LeadData | undefined;
    }
  }

  const db = readDb();
  return db.leads[email];
}

export async function getLeadByAuditId(auditId: string): Promise<LeadData | undefined> {
  if (supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('data')
      .eq('audit_id', auditId)
      .maybeSingle();

    if (error) {
      console.error('Supabase getLeadByAuditId failed, falling back to local DB', error);
    } else {
      return data?.data as LeadData | undefined;
    }
  }

  const db = readDb();
  return Object.values(db.leads).find((lead) => lead.auditId === auditId);
}
