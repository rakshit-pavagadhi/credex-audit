'use client';

import { useState } from 'react';
import { PRICING_DATA } from '@/lib/pricing-data';
import { ToolEntry, UseCase, ToolId, AuditReport } from '@/types';
import { Plus, Trash2, ArrowRight, Loader2, Building2 } from 'lucide-react';

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: '💻 Coding' },
  { value: 'writing', label: '✍️ Writing' },
  { value: 'research', label: '🔬 Research' },
  { value: 'data-analysis', label: '📊 Data Analysis' },
  { value: 'customer-support', label: '🎧 Customer Support' },
  { value: 'mixed', label: '🔀 Mixed / General' },
];

interface SpendFormProps {
  onAuditComplete: (report: AuditReport) => void;
}

interface FormEntry {
  id: string;
  toolId: ToolId | '';
  planId: string;
  monthlySpend: string;
  seats: string;
  useCase: UseCase;
}

function createEmptyEntry(): FormEntry {
  return {
    id: crypto.randomUUID(),
    toolId: '',
    planId: '',
    monthlySpend: '',
    seats: '1',
    useCase: 'coding',
  };
}

export default function SpendForm({ onAuditComplete }: SpendFormProps) {
  const [entries, setEntries] = useState<FormEntry[]>([createEmptyEntry()]);
  const [companyName, setCompanyName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [referredBy] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('ref') || '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addEntry = () => {
    if (entries.length >= 12) return;
    setEntries([...entries, createEmptyEntry()]);
  };

  const removeEntry = (id: string) => {
    if (entries.length <= 1) return;
    setEntries(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof FormEntry, value: string) => {
    setEntries(
      entries.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e, [field]: value };
        // Auto-fill spend when tool and plan are selected
        if (field === 'planId' || field === 'toolId') {
          const toolId = field === 'toolId' ? value : e.toolId;
          const planId = field === 'planId' ? value : e.planId;
          if (toolId && planId) {
            const tool = PRICING_DATA.find((t) => t.id === toolId);
            const plan = tool?.plans.find((p) => p.id === planId);
            if (plan) {
              const seats = parseInt(e.seats) || 1;
              updated.monthlySpend = String(plan.monthlyPricePerSeat * (plan.isPerSeat ? seats : 1));
            }
          }
          if (field === 'toolId') {
            updated.planId = '';
            updated.monthlySpend = '';
          }
        }
        return updated;
      })
    );
  };

  const getPlansForTool = (toolId: string) => {
    const tool = PRICING_DATA.find((t) => t.id === toolId);
    return tool?.plans || [];
  };

  const handleSubmit = async () => {
    setError('');

    // Validate
    const validEntries = entries.filter((e) => e.toolId && e.planId);
    if (validEntries.length === 0) {
      setError('Please add at least one tool with a plan selected.');
      return;
    }

    setLoading(true);

    try {
      const toolEntries: ToolEntry[] = validEntries.map((e) => ({
        toolId: e.toolId as ToolId,
        planId: e.planId,
        monthlySpend: parseFloat(e.monthlySpend) || 0,
        seats: parseInt(e.seats) || 1,
        useCase: e.useCase,
      }));

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: toolEntries,
          companyName: companyName || undefined,
          teamSize: teamSize ? parseInt(teamSize) : undefined,
          referredBy: referredBy || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      onAuditComplete(data.data);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalSpend = entries.reduce((sum, e) => sum + (parseFloat(e.monthlySpend) || 0), 0);

  return (
    <div id="audit-form" className="w-full max-w-4xl mx-auto">
      {/* Company info */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-5 h-5 text-accent-blue" />
          <h3 className="text-lg font-semibold">Company Info <span className="text-text-muted text-sm font-normal">(optional)</span></h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Company Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Team Size</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 12"
              min="1"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tool entries */}
      <div className="space-y-4 mb-6">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="glass-card p-6" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <h3 className="font-semibold text-sm">AI Tool</h3>
              </div>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-text-muted hover:text-accent-rose transition-colors p-1"
                  title="Remove tool"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Tool selector */}
              <div className="lg:col-span-1">
                <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Tool</label>
                <select
                  className="input-field"
                  value={entry.toolId}
                  onChange={(e) => updateEntry(entry.id, 'toolId', e.target.value)}
                >
                  <option value="">Select tool...</option>
                  <optgroup label="IDE Assistants">
                    {PRICING_DATA.filter((t) => t.category === 'ide-assistant').map((t) => (
                      <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Chat Assistants">
                    {PRICING_DATA.filter((t) => t.category === 'chat-assistant').map((t) => (
                      <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="API Direct">
                    {PRICING_DATA.filter((t) => t.category === 'api').map((t) => (
                      <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Plan selector */}
              <div className="lg:col-span-1">
                <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Plan</label>
                <select
                  className="input-field"
                  value={entry.planId}
                  onChange={(e) => updateEntry(entry.id, 'planId', e.target.value)}
                  disabled={!entry.toolId}
                >
                  <option value="">Select plan...</option>
                  {getPlansForTool(entry.toolId).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.monthlyPricePerSeat > 0 ? `($${p.monthlyPricePerSeat}/mo${p.isPerSeat ? '/seat' : ''})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly spend */}
              <div>
                <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Monthly Spend</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                  <input
                    type="number"
                    className="input-field pl-7"
                    placeholder="0"
                    min="0"
                    value={entry.monthlySpend}
                    onChange={(e) => updateEntry(entry.id, 'monthlySpend', e.target.value)}
                  />
                </div>
              </div>

              {/* Seats */}
              <div>
                <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Seats</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="1"
                  min="1"
                  value={entry.seats}
                  onChange={(e) => updateEntry(entry.id, 'seats', e.target.value)}
                />
              </div>

              {/* Use case */}
              <div>
                <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Use Case</label>
                <select
                  className="input-field"
                  value={entry.useCase}
                  onChange={(e) => updateEntry(entry.id, 'useCase', e.target.value)}
                >
                  {USE_CASES.map((uc) => (
                    <option key={uc.value} value={uc.value}>{uc.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add tool button */}
      <button
        onClick={addEntry}
        disabled={entries.length >= 12}
        className="btn-secondary w-full flex items-center justify-center gap-2 mb-8"
      >
        <Plus className="w-4 h-4" /> Add Another Tool
      </button>

      {/* Summary + Submit */}
      <div className="glass-card p-6 animate-pulse-glow">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-text-secondary text-sm">Current monthly AI spend</p>
            <p className="stat-number gradient-text">${totalSpend.toLocaleString()}</p>
            <p className="text-text-muted text-xs mt-1">across {entries.filter(e => e.toolId).length} tool(s)</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || entries.every(e => !e.toolId)}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                Get Your Free Audit <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-accent-rose text-sm mt-4 text-center">{error}</p>
        )}
      </div>

      {/* Honeypot (hidden) */}
      <input type="text" name="honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
    </div>
  );
}
