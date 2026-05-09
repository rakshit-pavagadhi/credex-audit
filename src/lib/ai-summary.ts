// ============================================================
// AI Summary Generation — Google Gemini API with template fallback
// ============================================================

import { AuditReport } from '@/types';

const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Generate a personalized ~150-word summary using Google Gemini.
 * Falls back to a template if the API is unavailable.
 */
export async function generateAISummary(report: AuditReport): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set — using template fallback');
    return generateTemplateSummary(report);
  }

  try {
    const prompt = buildPrompt(report);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.9,
          },
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`);
      return generateTemplateSummary(report);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || text.length < 50) {
      return generateTemplateSummary(report);
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini API failed, using fallback:', error);
    return generateTemplateSummary(report);
  }
}

function buildPrompt(report: AuditReport): string {
  const toolSummaries = report.results
    .map(
      (r) =>
        `- ${r.toolName} (${r.currentPlan}): currently $${r.currentSpend}/mo → recommended: ${r.action === 'keep' ? 'keep' : `${r.recommendedPlan} at $${r.recommendedSpend}/mo (save $${r.monthlySavings}/mo)`}`
    )
    .join('\n');

  return `You are a concise AI spend analyst for Credex, a company that helps startups save on AI tool costs through bulk infrastructure credits.

Write a personalized ~150-word audit summary paragraph for ${report.companyName ? `a company called "${report.companyName}"` : 'this team'}${report.teamSize ? ` with ${report.teamSize} team members` : ''}.

Their current AI tool usage:
${toolSummaries}

Total current monthly spend: $${report.totalCurrentSpend.toFixed(2)}
Potential monthly savings: $${report.totalMonthlySavings.toFixed(2)}
Potential annual savings: $${report.totalAnnualSavings.toFixed(2)}

Rules:
- Be direct and specific. Mention exact dollar amounts.
- If savings are >$500/mo, emphasize the urgency and suggest a Credex consultation.
- If savings are <$100/mo, acknowledge they're mostly optimized but point out any quick wins.
- Don't use bullet points — write a single flowing paragraph.
- Sound like a knowledgeable advisor, not a salesperson.
- Keep it to ~150 words.`;
}

/**
 * Template-based fallback when the AI API is unavailable.
 */
export function generateTemplateSummary(report: AuditReport): string {
  const { totalMonthlySavings, totalAnnualSavings, totalCurrentSpend, results, companyName } = report;
  const teamRef = companyName ? `${companyName}'s team` : 'Your team';
  const toolCount = results.length;
  const savingsTools = results.filter((r) => r.monthlySavings > 0);
  const topSaving = savingsTools.sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  if (totalMonthlySavings < 10) {
    return `${teamRef} is running a tight ship. Across ${toolCount} AI tool${toolCount > 1 ? 's' : ''} totaling $${totalCurrentSpend.toFixed(0)}/mo, your spending is well-optimized for your current usage patterns. There are no significant savings opportunities we can identify at this time. Keep monitoring your usage as your team scales — that's when overspending typically creeps in. Credex can help you lock in volume discounts when that time comes.`;
  }

  if (totalMonthlySavings < 100) {
    return `${teamRef} is spending $${totalCurrentSpend.toFixed(0)}/mo across ${toolCount} AI tools, and we've identified $${totalMonthlySavings.toFixed(0)}/mo in potential savings ($${totalAnnualSavings.toFixed(0)}/year). ${topSaving ? `The biggest opportunity is your ${topSaving.toolName} subscription — ${topSaving.reason.toLowerCase()}` : 'Small optimizations across your stack add up.'} You're not dramatically overspending, but these quick wins are worth capturing. As your team grows, consider Credex credits to prevent costs from scaling linearly with headcount.`;
  }

  return `${teamRef} is spending $${totalCurrentSpend.toFixed(0)}/mo on AI tools, and our audit found $${totalMonthlySavings.toFixed(0)}/mo in savings — that's $${totalAnnualSavings.toFixed(0)} annually going to waste. ${topSaving ? `Your biggest opportunity: ${topSaving.toolName} on ${topSaving.currentPlan} at $${topSaving.currentSpend}/mo could drop to $${topSaving.recommendedSpend}/mo by ${topSaving.action === 'credex' ? 'switching to Credex credits' : topSaving.action === 'switch-tool' ? `switching to ${topSaving.recommendedTool}` : `moving to the ${topSaving.recommendedPlan} plan`}.` : ''} At this spend level, Credex bulk infrastructure credits could save you an additional 20-30% across your entire AI stack. We strongly recommend booking a free consultation to lock in enterprise-grade pricing.`;
}
