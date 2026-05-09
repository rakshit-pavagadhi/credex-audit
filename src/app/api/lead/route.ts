// POST /api/lead — Capture lead email and send transactional email
import { NextRequest, NextResponse } from 'next/server';
import { getAudit, saveLead } from '@/lib/store';
import { LeadData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditId, email, companyName, role, teamSize, honeypot } = body as LeadData & { honeypot?: string };

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!auditId) {
      return NextResponse.json({ success: false, error: 'Audit ID is required.' }, { status: 400 });
    }

    const audit = await getAudit(auditId);
    const isHighSavings = (audit?.totalMonthlySavings ?? 0) >= 500;
    const perkEligible = Boolean(audit?.referredBy);

    // Save lead
    await saveLead({
      auditId,
      email,
      companyName,
      role,
      teamSize,
      referredBy: audit?.referredBy,
      perkEligible,
    });

    // Send transactional email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const host = request.headers.get('host');
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const dynamicBaseUrl = host ? `${protocol}://${host}` : 'https://credex-audit.vercel.app';
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || dynamicBaseUrl;
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Credex Audit <onboarding@resend.dev>',
            to: [email],
            subject: 'Your AI Spend Audit Report is Ready',
            html: `
              <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0e1a; color: #e2e8f0;">
                <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">Your AI Spend Audit is Ready 🎯</h1>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
                  Hi${companyName ? ` ${companyName} team` : ''},
                </p>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
                  Your personalized AI spend audit has been generated. View your full report with savings recommendations:
                </p>
                <a href="${baseUrl}/audit/${auditId}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View Your Report →
                </a>
                ${isHighSavings ? `
                <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-top: 8px;">
                  Based on your savings profile, the Credex team may reach out with tailored options to help you capture more of these savings.
                </p>
                ` : ''}
                ${perkEligible ? `
                <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-top: 8px;">
                  Referral perk unlocked: both you and the person who shared this audit are now eligible for a Credex perk.
                </p>
                ` : ''}
                <p style="color: #64748b; font-size: 14px; margin-top: 32px;">
                  — The Credex Team
                </p>
              </div>
            `,
          }),
        });
        
        if (!resendRes.ok) {
          const err = await resendRes.text();
          console.error('Resend API error:', err);
          return NextResponse.json({ success: false, error: 'Email service error. If testing, ensure you use the verified email address.' }, { status: 400 });
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, data: { message: 'Lead captured successfully.' } });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
