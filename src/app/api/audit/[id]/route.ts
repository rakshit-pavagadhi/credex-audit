// GET /api/audit/[id] — Fetch a stored audit report
import { NextRequest, NextResponse } from 'next/server';
import { getAudit } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await getAudit(id);
  if (!report) {
    return NextResponse.json({ success: false, error: 'Audit not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: report });
}
