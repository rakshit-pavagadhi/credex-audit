// Dynamic OG Image generation for shared audit results
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const savings = searchParams.get('savings') || '0';
  const company = searchParams.get('company') || 'Your Team';
  const tools = searchParams.get('tools') || '0';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050810',
          backgroundImage: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            C
          </div>
          <span style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 700 }}>
            Credex AI Spend Audit
          </span>
        </div>

        <div style={{ color: '#94a3b8', fontSize: '22px', marginBottom: '16px' }}>
          {company} could save
        </div>

        <div
          style={{
            fontSize: '80px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          ${parseInt(savings).toLocaleString()}/yr
        </div>

        <div style={{ color: '#64748b', fontSize: '18px', marginTop: '24px' }}>
          across {tools} AI tool{parseInt(tools) !== 1 ? 's' : ''} · Verified pricing data
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
