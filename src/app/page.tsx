'use client';

import { useState, useEffect } from 'react';
import { AuditReport } from '@/types';
import SpendForm from '@/components/SpendForm';
import AuditResults from '@/components/AuditResults';
import { Zap, Shield, Clock, ChevronDown, BarChart3, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  // Animated counter for hero
  useEffect(() => {
    const target = 4200;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedSavings(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const handleAuditComplete = (r: AuditReport) => {
    setReport(r);
    setTimeout(() => {
      document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden grid-pattern relative">
      {/* Background glows */}
      <div className="radial-glow bg-accent-blue" style={{ top: '-200px', left: '-200px' }} />
      <div className="radial-glow bg-accent-violet" style={{ top: '200px', right: '-300px' }} />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Credex</span>
          <span className="text-text-muted text-sm hidden sm:inline ml-1">AI Spend Audit</span>
        </div>
        <a
          href="#audit-form"
          className="btn-primary py-2.5 px-5 text-sm"
        >
          Start Audit
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Free AI spend analysis — no signup required
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Your team is{' '}
            <span className="gradient-text">overspending</span>
            <br />
            on AI tools.
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Most startups waste <span className="text-text-primary font-semibold">$2,000–$8,000/year</span>{' '}
            on AI subscriptions they don&apos;t need. Get a free, instant audit and find out exactly where.
          </p>

          {/* Animated stat */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="glass-card py-3 px-6 inline-flex items-center gap-3">
              <span className="text-text-muted text-sm">Avg. annual savings found:</span>
              <span className="stat-number text-accent-emerald text-3xl">${animatedSavings.toLocaleString()}</span>
            </div>
          </div>

          <a href="#audit-form" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            Audit My AI Spend <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-float">
          <ChevronDown className="w-6 h-6 text-text-muted mx-auto" />
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="relative z-10 px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: '60-Second Audit', desc: 'Add your tools, get results instantly.' },
            { icon: Shield, title: 'No Signup Required', desc: 'Your data stays private. No email needed to view results.' },
            { icon: Zap, title: 'AI-Powered Analysis', desc: 'Personalized recommendations from verified pricing data.' },
          ].map((badge, i) => (
            <div
              key={i}
              className="glass-card p-5 text-center animate-slide-up"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <badge.icon className="w-8 h-8 text-accent-blue mx-auto mb-3" />
              <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-text-muted text-xs">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="relative z-10 px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Tell us what you&apos;re paying for
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Add each AI tool your team uses. We&apos;ll analyze pricing across every plan and surface savings you didn&apos;t know existed.
          </p>
        </div>
        <SpendForm onAuditComplete={handleAuditComplete} />
      </section>

      {/* ── Results (if available) ── */}
      {report && (
        <section id="audit-results" className="relative z-10 px-6 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Your Audit Results
            </h2>
            <p className="text-text-secondary">
              {report.companyName ? `${report.companyName}'s` : 'Your'} personalized AI spend breakdown
            </p>
          </div>
          <AuditResults key={report.id} report={report} />
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How accurate is this audit?',
              a: 'Our pricing data is verified against official vendor pages and updated weekly. The audit logic considers your plan tier, seat count, and usage pattern to provide defensible recommendations. API-based tools receive usage-level analysis.',
            },
            {
              q: 'What is Credex and how does it save me money?',
              a: 'Credex negotiates bulk infrastructure credits with AI vendors (Cursor, Anthropic, OpenAI, etc.) and passes the savings to startups. Think of it as group buying power — you get the same tools at 20-30% less than retail pricing.',
            },
            {
              q: 'Is my data shared with anyone?',
              a: 'No. Your audit data is stored temporarily to generate your shareable link. We don\'t sell your data, and email is only collected if you explicitly opt in. Your audit inputs are never shared with third parties.',
            },
            {
              q: 'Can I share my audit results with my team?',
              a: 'Yes. Each audit gets a unique shareable URL that displays your complete results, including the tool breakdown and savings recommendations. You can copy the link and send it to your team — no signup or email required to view. If you\'d like the results emailed, you can submit your email address on the results page and we\'ll send a formatted link directly.',
            },
            {
              q: 'What should I do after I get my audit results?',
              a: 'Review the recommendations and confidence levels for each tool. For high-confidence suggestions (like switching to a cheaper plan), you can implement them immediately. If you see >$500/month in potential savings, consider booking a free consultation with Credex to discuss bulk infrastructure credits and custom team pricing.',
            },
          ].map((faq, i) => (
            <details key={i} className="glass-card group">
              <summary className="p-5 cursor-pointer list-none flex items-center justify-between font-medium">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border-subtle px-6 py-8 text-center text-text-muted text-sm">
        <p>© {new Date().getFullYear()} Credex · AI Spend Audit · Built for startups tired of overpaying.</p>
        <p className="mt-1 text-xs">
          Pricing data verified May 2026. Not financial advice.
        </p>
      </footer>
    </div>
  );
}
