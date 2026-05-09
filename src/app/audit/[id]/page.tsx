'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuditReport } from '@/types';
import AuditResults from '@/components/AuditResults';
import { BarChart3, Loader2, AlertCircle } from 'lucide-react';

export default function AuditPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`/api/audit/${id}`);
        const data = await res.json();
        if (data.success) {
          setReport(data.data);
        } else {
          setError(data.error || 'Audit not found.');
        }
      } catch {
        setError('Failed to load audit. Please check the URL.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAudit();
  }, [id]);

  return (
    <div className="min-h-screen w-full overflow-hidden grid-pattern relative">
      {/* Background glows */}
      <div className="radial-glow bg-accent-blue" style={{ top: '-200px', left: '-200px' }} />
      <div className="radial-glow bg-accent-violet" style={{ top: '200px', right: '-300px' }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Credex</span>
          <span className="text-text-muted text-sm hidden sm:inline ml-1">AI Spend Audit</span>
        </Link>
        <Link href="/" className="btn-primary py-2.5 px-5 text-sm">
          Run Your Own Audit
        </Link>
      </nav>

      {/* Content */}
      <section className="relative z-10 px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-accent-blue animate-spin mb-4" />
            <p className="text-text-secondary">Loading your audit results...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32">
            <AlertCircle className="w-10 h-10 text-accent-rose mb-4" />
            <h2 className="text-xl font-bold mb-2">Audit Not Found</h2>
            <p className="text-text-secondary mb-6">{error}</p>
            <Link href="/" className="btn-primary">
              Run a New Audit
            </Link>
          </div>
        ) : report ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                {report.companyName ? `${report.companyName}'s` : 'Your'} AI Spend Audit
              </h1>
              <p className="text-text-secondary">
                Generated {new Date(report.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <AuditResults report={report} />
          </>
        ) : null}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-subtle px-6 py-8 text-center text-text-muted text-sm">
        <p>© {new Date().getFullYear()} Credex · AI Spend Audit · Built for startups tired of overpaying.</p>
      </footer>
    </div>
  );
}
