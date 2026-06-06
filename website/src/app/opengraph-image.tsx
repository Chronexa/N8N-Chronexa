import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Chronexa — AI Automation Built Around Your Workflows';

// Dynamically generated social/SERP preview image (replaces the missing og.png).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0B0A',
          padding: 72,
          fontFamily: 'sans-serif',
          backgroundImage:
            'radial-gradient(circle at 80% 15%, rgba(103,176,53,0.22) 0%, transparent 45%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 700, color: '#fff' }}>
          Chronexa<span style={{ color: '#67B035' }}>.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
            AI Automation Built Around Your Workflows
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#9aa19a', marginTop: 28, maxWidth: 900 }}>
            Custom n8n &amp; AI systems for B2B enterprises — deployed on your stack in 30–60 days.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: '#67B035', display: 'flex' }} />
          <div style={{ fontSize: 28, color: '#67B035', fontWeight: 600 }}>chronexa.io</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
