import { NextResponse } from 'next/server';

export async function GET() {
  const script = `(function(){
  var scriptTag = document.currentScript;
  if (!scriptTag) return;

  var baseUrl = scriptTag.getAttribute('data-base-url') || window.location.origin;
  var height = scriptTag.getAttribute('data-height') || '760';
  var title = scriptTag.getAttribute('data-title') || 'AI Spend Audit';

  var container = document.createElement('div');
  container.style.width = '100%';
  container.style.maxWidth = '980px';
  container.style.margin = '24px auto';
  container.style.border = '1px solid rgba(148,163,184,0.25)';
  container.style.borderRadius = '12px';
  container.style.overflow = 'hidden';
  container.style.boxShadow = '0 8px 28px rgba(2,6,23,0.18)';
  container.style.background = '#ffffff';

  var header = document.createElement('div');
  header.style.padding = '12px 16px';
  header.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  header.style.fontWeight = '600';
  header.style.fontSize = '14px';
  header.style.borderBottom = '1px solid rgba(148,163,184,0.2)';
  header.style.background = '#f8fafc';
  header.textContent = title;

  var iframe = document.createElement('iframe');
  iframe.src = baseUrl.replace(/\/$/, '') + '/?embed=1';
  iframe.style.width = '100%';
  iframe.style.height = height + 'px';
  iframe.style.border = '0';
  iframe.style.display = 'block';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  container.appendChild(header);
  container.appendChild(iframe);

  scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
})();`;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
