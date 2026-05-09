'use client';

import { AuditReport } from '@/types';
import { getToolPricing } from '@/lib/pricing-data';
import { useState, Fragment } from 'react';
import {
  TrendingDown,
  ArrowRight,
  Copy,
  Check,
  Share2,
  Mail,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  FileDown,
} from 'lucide-react';

interface AuditResultsProps {
  report: AuditReport;
}

const ACTION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  keep: { label: 'Keep', color: 'text-accent-emerald', bg: 'bg-accent-emerald/10' },
  downgrade: { label: 'Downgrade', color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
  'switch-plan': { label: 'Switch Plan', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  'switch-tool': { label: 'Switch Tool', color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
  credex: { label: 'Credex Credits', color: 'text-accent-rose', bg: 'bg-accent-rose/10' },
  optimize: { label: 'Optimize', color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
};

export default function AuditResults({ report }: AuditResultsProps) {
  const [copied, setCopied] = useState(false);
  const [emailForm, setEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [leadCompanyName, setLeadCompanyName] = useState(report.companyName ?? '');
  const [leadRole, setLeadRole] = useState('');
  const [leadTeamSize, setLeadTeamSize] = useState(report.teamSize ? String(report.teamSize) : '');
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/audit/${report.id}`
    : `/audit/${report.id}`;
  const referralShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${encodeURIComponent(report.referralCode)}`
    : `/?ref=${encodeURIComponent(report.referralCode)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [emailError, setEmailError] = useState('');

  const handleEmailSubmit = async () => {
    if (!email) return;
    setEmailLoading(true);
    setEmailError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId: report.id,
          email,
          companyName: leadCompanyName || undefined,
          role: leadRole || undefined,
          teamSize: leadTeamSize ? parseInt(leadTeamSize, 10) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send report.');
      }
      setEmailSent(true);
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setEmailLoading(false);
    }
  };

  const isHighSavings = report.totalMonthlySavings >= 500;
  const isLowOrOptimized = report.totalMonthlySavings < 100;
  const inferredTeamSize = report.teamSize ?? Math.max(report.entries.reduce((sum, e) => sum + e.seats, 0), 1);
  const spendPerDeveloper = report.totalCurrentSpend / inferredTeamSize;
  const peerAveragePerDeveloper = inferredTeamSize <= 10 ? 90 : inferredTeamSize <= 50 ? 120 : 160;
  const benchmarkDelta = spendPerDeveloper - peerAveragePerDeveloper;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* ── Savings Summary Banner ── */}
      <div className="glass-card p-8 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-text-secondary text-sm uppercase tracking-wider mb-2">Your potential savings</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div>
            <p className="stat-number text-accent-emerald text-5xl sm:text-6xl">
              ${report.totalMonthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-text-muted text-sm mt-1">per month</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-border-subtle" />
          <div>
            <p className="stat-number gradient-text text-5xl sm:text-6xl">
              ${report.totalAnnualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-text-muted text-sm mt-1">per year</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-text-secondary text-sm">
          <TrendingDown className="w-4 h-4 text-accent-emerald" />
          From ${report.totalCurrentSpend.toLocaleString()}/mo → ${report.totalRecommendedSpend.toLocaleString()}/mo
        </div>
      </div>

      {/* ── Benchmark Mode ── */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="text-lg font-bold mb-2">Benchmark Mode</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          Your AI spend per developer is <span className="font-semibold text-text-primary">${spendPerDeveloper.toFixed(0)}/mo</span>.
          Companies around your size average <span className="font-semibold text-text-primary">${peerAveragePerDeveloper}/mo</span>.
          {benchmarkDelta > 0
            ? ` You're about $${benchmarkDelta.toFixed(0)}/dev above benchmark.`
            : ` You're about $${Math.abs(benchmarkDelta).toFixed(0)}/dev below benchmark.`}
        </p>
      </div>

      {/* ── Pivot Table ── */}
      <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-border-subtle">
          <h2 className="text-xl font-bold">Audit Breakdown</h2>
          <p className="text-text-muted text-sm mt-1">Tool-by-tool analysis with actionable recommendations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left p-4 text-text-muted font-medium uppercase text-xs tracking-wider">Tool</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase text-xs tracking-wider">Current</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase text-xs tracking-wider">Action</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase text-xs tracking-wider">Recommended</th>
                <th className="text-right p-4 text-text-muted font-medium uppercase text-xs tracking-wider">Savings</th>
                <th className="w-10 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {report.results.map((result, idx) => {
                const actionStyle = ACTION_LABELS[result.action] || ACTION_LABELS.keep;
                const isExpanded = expandedRow === idx;
                return (
                    <Fragment key={idx}>
                      <tr
                        className="border-b border-border-subtle/50 hover:bg-bg-card-hover transition-colors cursor-pointer"
                        onClick={() => setExpandedRow(isExpanded ? null : idx)}
                      >
                        <td className="p-4">
                        <div className="font-medium text-text-primary">{result.toolName}</div>
                        <div className="text-text-muted text-xs">{result.currentPlan} · {result.seats} seat(s)</div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-semibold">${result.currentSpend}/mo</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${actionStyle.color} ${actionStyle.bg}`}>
                          {actionStyle.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-text-primary text-sm">{result.recommendedTool}</div>
                        <div className="text-text-muted text-xs">{result.recommendedPlan}</div>
                      </td>
                      <td className="p-4 text-right">
                        {result.monthlySavings > 0 ? (
                          <span className="savings-badge">-${result.monthlySavings}/mo</span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-text-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-text-muted" />
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${idx}-detail`} className="border-b border-border-subtle/50">
                        <td colSpan={6} className="p-4 bg-bg-secondary/50">
                          <p className="text-text-secondary text-sm">{result.reason}</p>
                          <p className="text-text-muted text-xs mt-2">
                            Confidence: <span className={
                              result.confidence === 'high' ? 'text-accent-emerald' :
                              result.confidence === 'medium' ? 'text-accent-amber' :
                              'text-text-muted'
                            }>{result.confidence}</span>
                          </p>
                          {(() => {
                            const tool = getToolPricing(result.toolId);
                            return tool ? (
                              <p className="text-text-muted text-xs mt-2">
                                Source: <a href={tool.pricingUrl} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline inline-flex items-center gap-1">
                                  {tool.vendor} pricing <ExternalLink className="w-3 h-3" />
                                </a> · Verified {tool.lastVerified}
                              </p>
                            ) : null;
                          })()}
                        </td>
                      </tr>
                    )}
                    </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── AI Summary ── */}
      {report.aiSummary && (
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent-violet" />
            <h3 className="font-bold text-lg">AI-Generated Summary</h3>
            <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full">Powered by Gemini</span>
          </div>
          <p className="text-text-secondary leading-relaxed text-[15px]">{report.aiSummary}</p>
        </div>
      )}

      {/* ── Honest Low-Savings State ── */}
      {isLowOrOptimized && (
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-xl font-bold mb-2">You&apos;re spending well.</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            This audit found limited immediate savings, which usually means your current stack is already right-sized.
            Keep your setup as-is for now, and we&apos;ll notify you when new pricing changes or optimization opportunities apply.
          </p>
        </div>
      )}

      {/* ── Credex CTA (high savings) ── */}
      {isHighSavings && (
        <div
          className="relative overflow-hidden rounded-2xl p-8 text-center animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            animationDelay: '0.4s',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-violet/5" />
          <div className="relative z-10">
            <Shield className="w-10 h-10 text-accent-blue mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              You could save <span className="gradient-text">${report.totalAnnualSavings.toLocaleString()}/year</span> with Credex
            </h3>
            <p className="text-text-secondary max-w-lg mx-auto mb-6">
              At your spend level, Credex bulk infrastructure credits can unlock enterprise-grade pricing across your entire AI stack.
              Book a free 15-minute consultation to see your custom savings breakdown.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Book a Free Consultation <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* ── Share + Email ── */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <h3 className="font-semibold mb-2">Referral Program</h3>
          <p className="text-text-muted text-sm mb-3">
            Share your referral link. When a referred team completes an audit, both of you get a perk from the Credex team.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <code className="text-xs bg-bg-secondary px-3 py-2 rounded-lg text-text-muted break-all">{referralShareUrl}</code>
            <span className="text-xs text-accent-blue font-mono">Code: {report.referralCode}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-accent-blue" />
            <div>
              <h3 className="font-semibold">Share Your Results</h3>
              <p className="text-text-muted text-sm">Unique URL for your audit report</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-bg-secondary px-3 py-2 rounded-lg text-text-muted max-w-xs truncate">
              {shareUrl}
            </code>
            <a
              href={`/api/audit/${report.id}/pdf`}
              className="btn-secondary flex items-center gap-1.5 py-2 px-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileDown className="w-4 h-4" /> PDF
            </a>
            <button onClick={handleCopy} className="btn-secondary flex items-center gap-1.5 py-2 px-3">
              {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Email capture */}
        <div className="mt-6 pt-6 border-t border-border-subtle">
          {!emailForm && !emailSent ? (
            <button
              onClick={() => setEmailForm(true)}
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              <Mail className="w-4 h-4" /> {isLowOrOptimized ? 'Notify Me When New Optimizations Apply' : 'Get Report via Email'}
            </button>
          ) : emailSent ? (
            <div className="text-center">
              <Check className="w-8 h-8 text-accent-emerald mx-auto mb-2" />
              <p className="text-accent-emerald font-medium">
                {isLowOrOptimized ? `You'll get optimization alerts at ${email}.` : `Report sent to ${email}!`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              {isLowOrOptimized && (
                <p className="text-text-muted text-sm text-center">
                  Join the waitlist for pricing updates and new optimization opportunities tailored to your stack.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Company name (optional)"
                  value={leadCompanyName}
                  onChange={(e) => setLeadCompanyName(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Role (optional)"
                  value={leadRole}
                  onChange={(e) => setLeadRole(e.target.value)}
                />
              </div>
              <input
                type="number"
                min="1"
                className="input-field"
                placeholder="Team size (optional)"
                value={leadTeamSize}
                onChange={(e) => setLeadTeamSize(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                />
                <button
                  onClick={handleEmailSubmit}
                  disabled={emailLoading || !email}
                  className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                >
                  {emailLoading ? 'Sending...' : <>{isLowOrOptimized ? 'Notify Me' : 'Send'} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
              {emailError && (
                <p className="text-accent-rose text-sm text-center font-medium bg-accent-rose/10 py-2 px-3 rounded-lg border border-accent-rose/20">
                  {emailError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
