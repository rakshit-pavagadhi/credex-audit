import { ToolPricing } from '@/types';

export const PRICING_DATA: ToolPricing[] = [
  {
    id: 'cursor', name: 'Cursor', vendor: 'Anysphere', category: 'ide-assistant', icon: '⌨️',
    pricingUrl: 'https://cursor.com/pricing', lastVerified: '2026-05-08',
    plans: [
      { id: 'cursor-hobby', name: 'Hobby (Free)', monthlyPricePerSeat: 0, isPerSeat: false, features: ['Limited Agent requests', 'Limited Tab completions'], usageLevel: 'free', category: 'individual' },
      { id: 'cursor-pro', name: 'Pro', monthlyPricePerSeat: 20, isPerSeat: false, features: ['Unlimited Tab completions', '$20 credit pool'], usageLevel: 'standard', category: 'individual' },
      { id: 'cursor-pro-plus', name: 'Pro+', monthlyPricePerSeat: 60, isPerSeat: false, features: ['3x usage credits'], usageLevel: 'heavy', category: 'individual' },
      { id: 'cursor-ultra', name: 'Ultra', monthlyPricePerSeat: 200, isPerSeat: false, features: ['20x usage credits', 'Priority features'], usageLevel: 'power', category: 'individual' },
      { id: 'cursor-teams', name: 'Teams', monthlyPricePerSeat: 40, isPerSeat: true, features: ['Centralized billing', 'Admin dashboard', 'SSO'], usageLevel: 'standard', category: 'team' },
    ],
  },
  {
    id: 'github-copilot', name: 'GitHub Copilot', vendor: 'GitHub / Microsoft', category: 'ide-assistant', icon: '🤖',
    pricingUrl: 'https://github.com/features/copilot#pricing', lastVerified: '2026-05-08',
    plans: [
      { id: 'copilot-free', name: 'Free', monthlyPricePerSeat: 0, isPerSeat: false, features: ['Limited completions and chat'], usageLevel: 'free', category: 'individual' },
      { id: 'copilot-pro', name: 'Pro', monthlyPricePerSeat: 10, isPerSeat: false, features: ['$10 monthly AI credits', 'Chat'], usageLevel: 'standard', category: 'individual' },
      { id: 'copilot-pro-plus', name: 'Pro+', monthlyPricePerSeat: 39, isPerSeat: false, features: ['$39 monthly AI credits'], usageLevel: 'heavy', category: 'individual' },
      { id: 'copilot-business', name: 'Business', monthlyPricePerSeat: 19, isPerSeat: true, features: ['Org management', 'Policy controls'], usageLevel: 'standard', category: 'team' },
      { id: 'copilot-enterprise', name: 'Enterprise', monthlyPricePerSeat: 39, isPerSeat: true, features: ['Codebase personalization'], usageLevel: 'heavy', category: 'enterprise' },
    ],
  },
  {
    id: 'windsurf', name: 'Windsurf', vendor: 'Codeium', category: 'ide-assistant', icon: '🏄',
    pricingUrl: 'https://windsurf.com/pricing', lastVerified: '2026-05-08',
    plans: [
      { id: 'windsurf-free', name: 'Free', monthlyPricePerSeat: 0, isPerSeat: false, features: ['Light usage quota', 'Unlimited tab completion'], usageLevel: 'free', category: 'individual' },
      { id: 'windsurf-pro', name: 'Pro', monthlyPricePerSeat: 20, isPerSeat: false, features: ['Standard quota', 'Full model access'], usageLevel: 'standard', category: 'individual' },
      { id: 'windsurf-max', name: 'Max', monthlyPricePerSeat: 200, isPerSeat: false, features: ['Heavy usage quota'], usageLevel: 'power', category: 'individual' },
      { id: 'windsurf-teams', name: 'Teams', monthlyPricePerSeat: 40, isPerSeat: true, features: ['Centralized billing', 'Admin dashboard'], usageLevel: 'standard', category: 'team' },
    ],
  },
  {
    id: 'claude', name: 'Claude', vendor: 'Anthropic', category: 'chat-assistant', icon: '🧠',
    pricingUrl: 'https://claude.ai/pricing', lastVerified: '2026-05-08',
    plans: [
      { id: 'claude-free', name: 'Free', monthlyPricePerSeat: 0, isPerSeat: false, features: ['Basic access', 'Daily limits'], usageLevel: 'free', category: 'individual' },
      { id: 'claude-pro', name: 'Pro', monthlyPricePerSeat: 20, isPerSeat: false, features: ['5x Free usage', 'Claude Code', 'Memory'], usageLevel: 'standard', category: 'individual' },
      { id: 'claude-max-5x', name: 'Max 5x', monthlyPricePerSeat: 100, isPerSeat: false, features: ['5x Pro usage'], usageLevel: 'heavy', category: 'individual' },
      { id: 'claude-max-20x', name: 'Max 20x', monthlyPricePerSeat: 200, isPerSeat: false, features: ['20x Pro usage'], usageLevel: 'power', category: 'individual' },
      { id: 'claude-team-standard', name: 'Team Standard', monthlyPricePerSeat: 25, isPerSeat: true, features: ['Admin controls', 'Central billing'], usageLevel: 'standard', category: 'team' },
      { id: 'claude-team-premium', name: 'Team Premium', monthlyPricePerSeat: 125, isPerSeat: true, features: ['6.25x Pro usage'], usageLevel: 'heavy', category: 'team' },
    ],
  },
  {
    id: 'chatgpt', name: 'ChatGPT', vendor: 'OpenAI', category: 'chat-assistant', icon: '💬',
    pricingUrl: 'https://openai.com/chatgpt/pricing', lastVerified: '2026-05-08',
    plans: [
      { id: 'chatgpt-free', name: 'Free', monthlyPricePerSeat: 0, isPerSeat: false, features: ['Basic model access'], usageLevel: 'free', category: 'individual' },
      { id: 'chatgpt-go', name: 'Go', monthlyPricePerSeat: 8, isPerSeat: false, features: ['Higher limits', 'Faster models'], usageLevel: 'light', category: 'individual' },
      { id: 'chatgpt-plus', name: 'Plus', monthlyPricePerSeat: 20, isPerSeat: false, features: ['GPT-5.5 access', 'Deep Research'], usageLevel: 'standard', category: 'individual' },
      { id: 'chatgpt-pro-100', name: 'Pro ($100)', monthlyPricePerSeat: 100, isPerSeat: false, features: ['5x Plus limits'], usageLevel: 'heavy', category: 'individual' },
      { id: 'chatgpt-pro-200', name: 'Pro ($200)', monthlyPricePerSeat: 200, isPerSeat: false, features: ['20x Plus limits', '1M context'], usageLevel: 'power', category: 'individual' },
      { id: 'chatgpt-business', name: 'Business', monthlyPricePerSeat: 30, isPerSeat: true, features: ['Shared workspaces', 'Admin controls'], usageLevel: 'standard', category: 'team' },
    ],
  },
  {
    id: 'gemini', name: 'Gemini', vendor: 'Google', category: 'chat-assistant', icon: '✨',
    pricingUrl: 'https://one.google.com/about/ai-premium', lastVerified: '2026-05-08',
    plans: [
      { id: 'gemini-free', name: 'Free', monthlyPricePerSeat: 0, isPerSeat: false, features: ['Flash models', 'Limited Pro access'], usageLevel: 'free', category: 'individual' },
      { id: 'gemini-ai-plus', name: 'AI Plus', monthlyPricePerSeat: 8, isPerSeat: false, features: ['128K context', '200 GB storage'], usageLevel: 'light', category: 'individual' },
      { id: 'gemini-ai-pro', name: 'AI Pro', monthlyPricePerSeat: 20, isPerSeat: false, features: ['Flagship models', 'Deep Research', 'Workspace'], usageLevel: 'standard', category: 'individual' },
      { id: 'gemini-ai-ultra', name: 'AI Ultra', monthlyPricePerSeat: 250, isPerSeat: false, features: ['Highest limits', 'Deep Think', '30 TB'], usageLevel: 'power', category: 'individual' },
    ],
  },
  {
    id: 'openai-api', name: 'OpenAI API', vendor: 'OpenAI', category: 'api', icon: '🔌',
    pricingUrl: 'https://openai.com/api/pricing/', lastVerified: '2026-05-08',
    plans: [
      { id: 'openai-api-payg', name: 'Pay-as-you-go', monthlyPricePerSeat: 0, isPerSeat: false, features: ['GPT-4.1: $2/$8 per 1M tok', 'GPT-4o: $2.50/$10', 'Batch API: 50% off'], usageLevel: 'standard', category: 'individual' },
    ],
  },
  {
    id: 'anthropic-api', name: 'Anthropic API', vendor: 'Anthropic', category: 'api', icon: '🔗',
    pricingUrl: 'https://www.anthropic.com/pricing', lastVerified: '2026-05-08',
    plans: [
      { id: 'anthropic-api-payg', name: 'Pay-as-you-go', monthlyPricePerSeat: 0, isPerSeat: false, features: ['Opus 4.6: $5/$25 per 1M tok', 'Sonnet 4.6: $3/$15', 'Haiku 4.5: $1/$5'], usageLevel: 'standard', category: 'individual' },
    ],
  },
];

export function getToolPricing(toolId: string): ToolPricing | undefined {
  return PRICING_DATA.find((t) => t.id === toolId);
}

export function getToolsByCategory() {
  return {
    'IDE Assistants': PRICING_DATA.filter((t) => t.category === 'ide-assistant'),
    'Chat Assistants': PRICING_DATA.filter((t) => t.category === 'chat-assistant'),
    'API Direct': PRICING_DATA.filter((t) => t.category === 'api'),
  };
}

export function getPlan(toolId: string, planId: string) {
  const tool = getToolPricing(toolId);
  return tool?.plans.find((p) => p.id === planId);
}
