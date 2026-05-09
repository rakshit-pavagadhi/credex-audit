// POST /api/audit — Run audit engine, store results, return report
import { NextRequest, NextResponse } from 'next/server';
import { ToolEntry } from '@/types';
import { runAudit } from '@/lib/audit-engine';
import { generateAISummary } from '@/lib/ai-summary';
import { saveAudit } from '@/lib/store';

// Simple rate-limiting
const ipCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 3600000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const record = ipCounts.get(ip);
    if (record && now < record.resetAt) {
      if (record.count >= RATE_LIMIT) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
      }
      record.count++;
    } else {
      ipCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    }

    const body = await request.json();
    const { entries, companyName, teamSize, referredBy, honeypot } = body as {
      entries: ToolEntry[];
      companyName?: string;
      teamSize?: number;
      referredBy?: string;
      honeypot?: string;
    };

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }

    // Validation
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one tool entry is required.' }, { status: 400 });
    }

    if (entries.length > 20) {
      return NextResponse.json({ success: false, error: 'Maximum 20 tool entries allowed.' }, { status: 400 });
    }

    for (const entry of entries) {
      if (!entry.toolId || !entry.planId || entry.monthlySpend < 0 || entry.seats < 1) {
        return NextResponse.json({ success: false, error: 'Invalid tool entry data.' }, { status: 400 });
      }
    }

    // Run audit
    const report = runAudit(entries, companyName, teamSize, referredBy);

    // Generate AI summary (non-blocking, with fallback)
    try {
      report.aiSummary = await generateAISummary(report);
    } catch {
      // Summary generation failed — report still valid without it
      console.error('AI summary generation failed');
    }

    // Store the report
    await saveAudit(report);

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
