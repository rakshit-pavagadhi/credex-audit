import { describe, it, expect } from 'vitest';
import { runAudit } from '../src/lib/audit-engine';
import { ToolEntry } from '../src/types';

describe('Audit Engine', () => {
  it('should return a valid report with results for each entry', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-pro', monthlySpend: 20, seats: 1, useCase: 'coding' },
    ];
    const report = runAudit(entries);
    expect(report.id).toBeTruthy();
    expect(report.results).toHaveLength(1);
    expect(report.totalCurrentSpend).toBe(20);
  });

  it('should identify Credex savings for paid plans', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-pro', monthlySpend: 20, seats: 1, useCase: 'coding' },
    ];
    const report = runAudit(entries);
    const result = report.results[0];
    // Should recommend something (either keep, downgrade, switch, or credex)
    expect(result.action).toBeTruthy();
    expect(result.monthlySavings).toBeGreaterThanOrEqual(0);
  });

  it('should handle multiple tool entries', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-ultra', monthlySpend: 200, seats: 1, useCase: 'coding' },
      { toolId: 'chatgpt', planId: 'chatgpt-pro-200', monthlySpend: 200, seats: 1, useCase: 'writing' },
      { toolId: 'claude', planId: 'claude-max-20x', monthlySpend: 200, seats: 1, useCase: 'research' },
    ];
    const report = runAudit(entries);
    expect(report.results).toHaveLength(3);
    expect(report.totalCurrentSpend).toBe(600);
    expect(report.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(report.totalAnnualSavings).toBe(report.totalMonthlySavings * 12);
  });

  it('should suggest downgrade for heavy plan on light use', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-ultra', monthlySpend: 200, seats: 1, useCase: 'writing' },
    ];
    const report = runAudit(entries);
    const result = report.results[0];
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(['downgrade', 'switch-plan', 'credex', 'switch-tool']).toContain(result.action);
  });

  it('should suggest individual plans when team plan has few seats', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-teams', monthlySpend: 80, seats: 2, useCase: 'coding' },
    ];
    const report = runAudit(entries);
    const result = report.results[0];
    // Teams at $40/seat × 2 = $80, vs 2× Pro at $20 = $40
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it('should handle free plan users gracefully', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-hobby', monthlySpend: 0, seats: 1, useCase: 'coding' },
    ];
    const report = runAudit(entries);
    const result = report.results[0];
    expect(result.action).toBe('keep');
    expect(result.monthlySavings).toBe(0);
  });

  it('should calculate correct totals', () => {
    const entries: ToolEntry[] = [
      { toolId: 'chatgpt', planId: 'chatgpt-plus', monthlySpend: 20, seats: 1, useCase: 'writing' },
      { toolId: 'cursor', planId: 'cursor-pro', monthlySpend: 20, seats: 1, useCase: 'coding' },
    ];
    const report = runAudit(entries);
    expect(report.totalCurrentSpend).toBe(40);
    expect(report.totalRecommendedSpend).toBeLessThanOrEqual(40);
    expect(report.totalMonthlySavings).toBe(report.totalCurrentSpend - report.totalRecommendedSpend);
    expect(report.totalAnnualSavings).toBe(report.totalMonthlySavings * 12);
  });

  it('should include company name and team size when provided', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-pro', monthlySpend: 20, seats: 1, useCase: 'coding' },
    ];
    const report = runAudit(entries, 'TestCo', 5);
    expect(report.companyName).toBe('TestCo');
    expect(report.teamSize).toBe(5);
  });

  it('should handle API tools (no downgrade possible)', () => {
    const entries: ToolEntry[] = [
      { toolId: 'openai-api', planId: 'openai-api-payg', monthlySpend: 150, seats: 1, useCase: 'coding' },
    ];
    const report = runAudit(entries);
    const result = report.results[0];
    // API tools should still get Credex savings
    expect(result).toBeTruthy();
  });

  it('should cross-recommend cheaper tools', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', planId: 'cursor-pro', monthlySpend: 20, seats: 1, useCase: 'coding' },
    ];
    const report = runAudit(entries);
    // Should have a recommendation — either Copilot Pro at $10 or Credex savings
    expect(report.results[0].monthlySavings).toBeGreaterThan(0);
  });
});
