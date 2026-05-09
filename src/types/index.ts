// ============================================================
// Credex AI Spend Audit — Core TypeScript Types
// ============================================================

/** Supported AI tools in the audit */
export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'openai-api'
  | 'anthropic-api'
  | 'gemini'
  | 'windsurf';

/** Primary use-case categories for AI tools */
export type UseCase =
  | 'coding'
  | 'writing'
  | 'research'
  | 'data-analysis'
  | 'customer-support'
  | 'mixed';

/** A single plan tier offered by a tool */
export interface PlanTier {
  id: string;
  name: string;
  monthlyPricePerSeat: number;
  isPerSeat: boolean;
  features: string[];
  usageLevel: 'free' | 'light' | 'standard' | 'heavy' | 'power';
  category: 'individual' | 'team' | 'enterprise';
}

/** Full pricing info for a tool */
export interface ToolPricing {
  id: ToolId;
  name: string;
  vendor: string;
  category: 'ide-assistant' | 'chat-assistant' | 'api';
  icon: string;
  plans: PlanTier[];
  pricingUrl: string;
  lastVerified: string;
}

/** User input for a single tool in the form */
export interface ToolEntry {
  toolId: ToolId;
  planId: string;
  monthlySpend: number;
  seats: number;
  useCase: UseCase;
}

/** Audit recommendation action types */
export type AuditAction =
  | 'keep'
  | 'downgrade'
  | 'switch-plan'
  | 'switch-tool'
  | 'credex'
  | 'optimize';

/** Audit result for a single tool */
export interface AuditResult {
  toolName: string;
  toolId: ToolId;
  currentPlan: string;
  currentSpend: number;
  seats: number;
  action: AuditAction;
  recommendedPlan: string;
  recommendedTool: string;
  recommendedSpend: number;
  monthlySavings: number;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

/** Full audit output */
export interface AuditReport {
  id: string;
  createdAt: string;
  referralCode: string;
  referredBy?: string;
  entries: ToolEntry[];
  results: AuditResult[];
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  companyName?: string;
  teamSize?: number;
}

/** Lead capture form data */
export interface LeadData {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  referredBy?: string;
  perkEligible?: boolean;
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
