import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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

  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  const lineHeight = 16;
  let y = page.getHeight() - margin;

  const drawText = (text: string, opts?: { bold?: boolean; size?: number; color?: [number, number, number] }) => {
    page.drawText(text, {
      x: margin,
      y,
      size: opts?.size ?? 11,
      font: opts?.bold ? boldFont : font,
      color: opts?.color ? rgb(opts.color[0], opts.color[1], opts.color[2]) : rgb(0.1, 0.1, 0.1),
    });
    y -= lineHeight;
  };

  const ensureSpace = (requiredLines: number) => {
    if (y - requiredLines * lineHeight < margin) {
      y = page.getHeight() - margin;
      page = pdf.addPage([595.28, 841.89]);
    }
  };

  drawText('Credex AI Spend Audit Report', { bold: true, size: 18 });
  drawText(`Audit ID: ${report.id}`);
  drawText(`Generated: ${new Date(report.createdAt).toLocaleString()}`);
  if (report.companyName) drawText(`Company: ${report.companyName}`);
  if (report.teamSize) drawText(`Team Size: ${report.teamSize}`);
  y -= 8;

  drawText('Summary', { bold: true, size: 14 });
  drawText(`Total Current Spend: $${report.totalCurrentSpend.toFixed(2)}/mo`);
  drawText(`Total Recommended Spend: $${report.totalRecommendedSpend.toFixed(2)}/mo`);
  drawText(`Potential Monthly Savings: $${report.totalMonthlySavings.toFixed(2)}`);
  drawText(`Potential Annual Savings: $${report.totalAnnualSavings.toFixed(2)}`);

  y -= 10;
  drawText('Per-Tool Breakdown', { bold: true, size: 14 });

  for (const result of report.results) {
    ensureSpace(8);
    drawText(`${result.toolName} (${result.currentPlan})`, { bold: true });
    drawText(`Current: $${result.currentSpend.toFixed(2)}/mo`);
    drawText(`Action: ${result.action}`);
    drawText(`Recommended: ${result.recommendedTool} - ${result.recommendedPlan}`);
    drawText(`Savings: $${result.monthlySavings.toFixed(2)}/mo`);
    drawText(`Reason: ${result.reason}`);
    drawText(`Confidence: ${result.confidence}`);
    y -= 6;
  }

  if (report.aiSummary) {
    ensureSpace(6);
    drawText('AI Summary', { bold: true, size: 14 });
    const summaryChunks = chunkText(report.aiSummary, 90);
    for (const chunk of summaryChunks) {
      ensureSpace(1);
      drawText(chunk);
    }
  }

  const bytes = await pdf.save();

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="credex-audit-${report.id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

function chunkText(text: string, maxLen: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLen) {
      if (current) chunks.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}
