import { describe, it, expect } from 'vitest';
import { PRICING_DATA, getToolPricing, getPlan } from '../src/lib/pricing-data';

describe('Pricing Data', () => {
  it('should have all 8 required tools', () => {
    const requiredTools = [
      'cursor', 'github-copilot', 'claude', 'chatgpt',
      'openai-api', 'anthropic-api', 'gemini', 'windsurf',
    ];
    for (const toolId of requiredTools) {
      const tool = getToolPricing(toolId);
      expect(tool, `Missing tool: ${toolId}`).toBeTruthy();
    }
  });

  it('should have valid pricing URLs for all tools', () => {
    for (const tool of PRICING_DATA) {
      expect(tool.pricingUrl).toMatch(/^https?:\/\//);
    }
  });

  it('should have non-negative prices for all plans', () => {
    for (const tool of PRICING_DATA) {
      for (const plan of tool.plans) {
        expect(plan.monthlyPricePerSeat).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('should have at least one plan per tool', () => {
    for (const tool of PRICING_DATA) {
      expect(tool.plans.length).toBeGreaterThan(0);
    }
  });

  it('should have unique plan IDs within each tool', () => {
    for (const tool of PRICING_DATA) {
      const ids = tool.plans.map((p) => p.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    }
  });

  it('should return correct plan with getPlan', () => {
    const plan = getPlan('cursor', 'cursor-pro');
    expect(plan).toBeTruthy();
    expect(plan?.name).toBe('Pro');
    expect(plan?.monthlyPricePerSeat).toBe(20);
  });

  it('should have lastVerified dates for all tools', () => {
    for (const tool of PRICING_DATA) {
      expect(tool.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('should have valid categories for all tools', () => {
    const validCategories = ['ide-assistant', 'chat-assistant', 'api'];
    for (const tool of PRICING_DATA) {
      expect(validCategories).toContain(tool.category);
    }
  });
});
