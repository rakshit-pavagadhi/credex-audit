// ============================================================
// Credex AI Spend Audit — Core Audit Engine
// Evaluates each tool on 4 dimensions and produces recommendations.
// ============================================================

import { ToolEntry, AuditResult, AuditReport } from '@/types';
import { getToolPricing, PRICING_DATA } from './pricing-data';
import { nanoid } from 'nanoid';

/**
 * Cross-tool alternatives mapping.
 * Maps tool categories to cheaper alternatives with similar capability.
 */
const CROSS_TOOL_ALTERNATIVES: Record<string, { toolId: string; planId: string; reason: string }[]> = {
  'cursor': [
    { toolId: 'github-copilot', planId: 'copilot-pro', reason: 'GitHub Copilot Pro offers similar code completion at $10/mo vs $20/mo' },
    { toolId: 'windsurf', planId: 'windsurf-pro', reason: 'Windsurf Pro offers comparable AI coding features at the same price with quota-based usage' },
  ],
  'github-copilot': [
    { toolId: 'windsurf', planId: 'windsurf-free', reason: 'Windsurf Free offers unlimited tab completion at $0/mo' },
  ],
  'windsurf': [
    { toolId: 'github-copilot', planId: 'copilot-pro', reason: 'GitHub Copilot Pro at $10/mo offers strong code completion for lighter usage' },
  ],
  'claude': [
    { toolId: 'chatgpt', planId: 'chatgpt-plus', reason: 'ChatGPT Plus offers similar capabilities at the same price point' },
    { toolId: 'gemini', planId: 'gemini-ai-pro', reason: 'Gemini AI Pro at $20/mo includes Workspace integration and Deep Research' },
  ],
  'chatgpt': [
    { toolId: 'claude', planId: 'claude-pro', reason: 'Claude Pro at $20/mo excels at longer, more nuanced writing and analysis' },
    { toolId: 'gemini', planId: 'gemini-ai-pro', reason: 'Gemini AI Pro at $20/mo bundles Google Workspace AI features' },
  ],
  'gemini': [
    { toolId: 'chatgpt', planId: 'chatgpt-go', reason: 'ChatGPT Go at $8/mo covers basic AI assistant needs at lower cost' },
  ],
};

/**
 * Credex discount percentages by tool category.
 * Credex offers bulk infrastructure credits at discounted rates.
 */
const CREDEX_DISCOUNTS: Record<string, number> = {
  'ide-assistant': 0.25,  // 25% savings through Credex
  'chat-assistant': 0.20, // 20% savings
  'api': 0.30,            // 30% savings on API credits
};

/**
 * Run a full audit on the user's tool entries.
 */
export function runAudit(entries: ToolEntry[], companyName?: string, teamSize?: number, referredBy?: string): AuditReport {
  const results: AuditResult[] = entries.map((entry) => auditSingleTool(entry));

  const totalCurrentSpend = results.reduce((sum, r) => sum + r.currentSpend, 0);
  const totalRecommendedSpend = results.reduce((sum, r) => sum + r.recommendedSpend, 0);
  const totalMonthlySavings = totalCurrentSpend - totalRecommendedSpend;

  return {
    id: nanoid(12),
    createdAt: new Date().toISOString(),
    referralCode: `CRX-${nanoid(6).toUpperCase()}`,
    referredBy,
    entries,
    results,
    totalCurrentSpend,
    totalRecommendedSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    companyName,
    teamSize,
  };
}

/**
 * Audit a single tool entry across four dimensions.
 */
function auditSingleTool(entry: ToolEntry): AuditResult {
  const tool = getToolPricing(entry.toolId);
  if (!tool) {
    return createKeepResult(entry, 'Unknown tool — unable to audit');
  }

  const currentPlan = tool.plans.find((p) => p.id === entry.planId);
  if (!currentPlan) {
    return createKeepResult(entry, 'Unknown plan — unable to audit');
  }

  const currentSpend = entry.monthlySpend;
  const candidates: AuditResult[] = [];

  // ── Dimension 1: Right plan for usage? ──
  // Check if they're on a higher tier than they need
  const downgradeResult = checkDowngrade(entry, tool.plans, currentPlan, currentSpend);
  if (downgradeResult) candidates.push(downgradeResult);

  // ── Dimension 2: Cheaper plan from same vendor ──
  const samePlanResult = checkSameVendorSavings(entry, tool.plans, currentPlan, currentSpend);
  if (samePlanResult) candidates.push(samePlanResult);

  // ── Dimension 3: Cheaper alternative (cross-tool) ──
  const crossToolResult = checkCrossToolAlternative(entry, currentPlan, currentSpend);
  if (crossToolResult) candidates.push(crossToolResult);

  // ── Dimension 4: Credex credits ──
  const credexResult = checkCredexSavings(entry, tool, currentPlan, currentSpend);
  if (credexResult) candidates.push(credexResult);

  // Pick the best recommendation (highest savings)
  if (candidates.length === 0) {
    return createKeepResult(entry, `Your ${tool.name} ${currentPlan.name} plan is well-optimized for your usage.`);
  }

  candidates.sort((a, b) => b.monthlySavings - a.monthlySavings);
  return candidates[0];
}

/**
 * Dimension 1: Check if user should downgrade to a lower tier.
 */
function checkDowngrade(
  entry: ToolEntry,
  plans: typeof PRICING_DATA[0]['plans'],
  currentPlan: typeof plans[0],
  currentSpend: number
): AuditResult | null {
  const tool = getToolPricing(entry.toolId)!;

  // For API-type tools, can't really downgrade plans
  if (tool.category === 'api') return null;

  // Check for usage level mismatch
  const usageLevels = ['free', 'light', 'standard', 'heavy', 'power'] as const;
  const currentLevelIdx = usageLevels.indexOf(currentPlan.usageLevel);

  // If on a heavy/power plan but use case suggests lighter usage
  const isLightUseCase = entry.useCase === 'writing' || entry.useCase === 'research';
  const suggestedMaxLevel = isLightUseCase ? 2 : 3; // standard or heavy max

  if (currentLevelIdx > suggestedMaxLevel && entry.seats <= 1) {
    // Find the best cheaper plan
    const cheaperPlans = plans
      .filter((p) => {
        const planLevel = usageLevels.indexOf(p.usageLevel);
        return planLevel <= suggestedMaxLevel && planLevel > 0 && p.category === 'individual';
      })
      .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat);

    if (cheaperPlans.length > 0) {
      const recommended = cheaperPlans[cheaperPlans.length - 1]; // highest tier within budget
      const newSpend = recommended.monthlyPricePerSeat * Math.max(1, entry.seats);
      const savings = currentSpend - newSpend;

      if (savings > 0) {
        return {
          toolName: tool.name,
          toolId: entry.toolId,
          currentPlan: currentPlan.name,
          currentSpend,
          seats: entry.seats,
          action: 'downgrade',
          recommendedPlan: recommended.name,
          recommendedTool: tool.name,
          recommendedSpend: newSpend,
          monthlySavings: savings,
          reason: `Your ${entry.useCase} usage doesn't require ${currentPlan.name} — ${recommended.name} covers your needs.`,
          confidence: 'high',
        };
      }
    }
  }

  // Check for team plan with few seats
  if (currentPlan.isPerSeat && entry.seats <= 2) {
    const individualPlans = plans
      .filter((p) => !p.isPerSeat && p.usageLevel !== 'free')
      .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat);

    if (individualPlans.length > 0) {
      const recommended = individualPlans[0];
      const newSpend = recommended.monthlyPricePerSeat * entry.seats;
      const savings = currentSpend - newSpend;

      if (savings > 0) {
        return {
          toolName: tool.name,
          toolId: entry.toolId,
          currentPlan: currentPlan.name,
          currentSpend,
          seats: entry.seats,
          action: 'downgrade',
          recommendedPlan: `${entry.seats}x ${recommended.name} (individual)`,
          recommendedTool: tool.name,
          recommendedSpend: newSpend,
          monthlySavings: savings,
          reason: `With only ${entry.seats} seat(s), individual ${recommended.name} plans are cheaper than ${currentPlan.name} team pricing.`,
          confidence: 'high',
        };
      }
    }
  }

  return null;
}

/**
 * Dimension 2: Check for cheaper same-vendor plan.
 */
function checkSameVendorSavings(
  entry: ToolEntry,
  plans: typeof PRICING_DATA[0]['plans'],
  currentPlan: typeof plans[0],
  currentSpend: number
): AuditResult | null {
  const tool = getToolPricing(entry.toolId)!;
  if (tool.category === 'api') return null;

  // Find plans cheaper than current that still provide adequate features
  const cheaperPlans = plans.filter((p) => {
    const pCost = p.isPerSeat ? p.monthlyPricePerSeat * entry.seats : p.monthlyPricePerSeat;
    return pCost < currentSpend && p.usageLevel !== 'free' && p.id !== currentPlan.id;
  });

  if (cheaperPlans.length === 0) return null;

  // Pick the one that's closest to current (best features for less money)
  const best = cheaperPlans.sort((a, b) => {
    const aCost = a.isPerSeat ? a.monthlyPricePerSeat * entry.seats : a.monthlyPricePerSeat;
    const bCost = b.isPerSeat ? b.monthlyPricePerSeat * entry.seats : b.monthlyPricePerSeat;
    return bCost - aCost;
  })[0];

  const newSpend = best.isPerSeat ? best.monthlyPricePerSeat * entry.seats : best.monthlyPricePerSeat;
  const savings = currentSpend - newSpend;

  if (savings <= 0) return null;

  return {
    toolName: tool.name,
    toolId: entry.toolId,
    currentPlan: currentPlan.name,
    currentSpend,
    seats: entry.seats,
    action: 'switch-plan',
    recommendedPlan: best.name,
    recommendedTool: tool.name,
    recommendedSpend: newSpend,
    monthlySavings: savings,
    reason: `${tool.name} ${best.name} at $${newSpend}/mo offers sufficient features for ${entry.useCase} use.`,
    confidence: 'medium',
  };
}

/**
 * Dimension 3: Check cross-tool alternatives.
 */
function checkCrossToolAlternative(
  entry: ToolEntry,
  currentPlan: typeof PRICING_DATA[0]['plans'][0],
  currentSpend: number
): AuditResult | null {
  const tool = getToolPricing(entry.toolId)!;
  const alternatives = CROSS_TOOL_ALTERNATIVES[entry.toolId];
  if (!alternatives) return null;

  for (const alt of alternatives) {
    const altTool = getToolPricing(alt.toolId);
    if (!altTool) continue;

    const altPlan = altTool.plans.find((p) => p.id === alt.planId);
    if (!altPlan) continue;

    const altCost = altPlan.isPerSeat ? altPlan.monthlyPricePerSeat * entry.seats : altPlan.monthlyPricePerSeat;
    const savings = currentSpend - altCost;

    if (savings > 0) {
      return {
        toolName: tool.name,
        toolId: entry.toolId,
        currentPlan: currentPlan.name,
        currentSpend,
        seats: entry.seats,
        action: 'switch-tool',
        recommendedPlan: altPlan.name,
        recommendedTool: altTool.name,
        recommendedSpend: altCost,
        monthlySavings: savings,
        reason: alt.reason,
        confidence: 'medium',
      };
    }
  }

  return null;
}

/**
 * Dimension 4: Check Credex bulk credit savings.
 */
function checkCredexSavings(
  entry: ToolEntry,
  tool: typeof PRICING_DATA[0],
  currentPlan: typeof PRICING_DATA[0]['plans'][0],
  currentSpend: number
): AuditResult | null {
  if (currentSpend <= 0) return null;

  const discount = CREDEX_DISCOUNTS[tool.category] || 0.20;
  const savings = Math.round(currentSpend * discount * 100) / 100;
  const newSpend = Math.round((currentSpend - savings) * 100) / 100;

  if (savings < 5) return null; // Not worth flagging for tiny amounts

  return {
    toolName: tool.name,
    toolId: entry.toolId,
    currentPlan: currentPlan.name,
    currentSpend,
    seats: entry.seats,
    action: 'credex',
    recommendedPlan: `${currentPlan.name} via Credex`,
    recommendedTool: `${tool.name} (Credex Credits)`,
    recommendedSpend: newSpend,
    monthlySavings: savings,
    reason: `Save ${Math.round(discount * 100)}% on ${tool.name} through Credex bulk infrastructure credits — same access, lower cost.`,
    confidence: 'high',
  };
}

/** Helper to create a "keep current" result */
function createKeepResult(entry: ToolEntry, reason: string): AuditResult {
  const tool = getToolPricing(entry.toolId);
  const plan = tool?.plans.find((p) => p.id === entry.planId);
  return {
    toolName: tool?.name || entry.toolId,
    toolId: entry.toolId,
    currentPlan: plan?.name || entry.planId,
    currentSpend: entry.monthlySpend,
    seats: entry.seats,
    action: 'keep',
    recommendedPlan: plan?.name || entry.planId,
    recommendedTool: tool?.name || entry.toolId,
    recommendedSpend: entry.monthlySpend,
    monthlySavings: 0,
    reason,
    confidence: 'high',
  };
}
