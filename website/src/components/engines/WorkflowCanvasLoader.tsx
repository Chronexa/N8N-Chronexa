'use client';

import dynamic from 'next/dynamic';
import type { CSSProperties, ComponentProps } from 'react';
import type WorkflowCanvas from './WorkflowCanvas';

// ─── Skeleton shown while the XYFlow bundle is loading ───────────────────────
// Mirrors the WorkflowCanvas layout exactly (same grid, same node positions)
// so there is zero layout shift when the real canvas mounts.

const cardStyle: CSSProperties = {
  width: 255,
  height: 130,
  borderRadius: 10,
  background: 'rgba(103,176,53,0.04)',
  border: '1.5px solid rgba(103,176,53,0.08)',
  position: 'absolute',
  animation: 'skeletonPulse 2s ease-in-out infinite',
};

// Mirrors SALES_FLOW_POSITIONS: row 0 (y=0) at x=0,315,630 — row 1 (y=210) same.
// The skeleton is intentionally engine-agnostic — the 3+3 grid works for any
// 6-node engine, and the fallback never loads long enough for shape to matter.
const NODE_POSITIONS = [
  { x: 0,   y: 0   },
  { x: 315, y: 0   },
  { x: 630, y: 0   },
  { x: 0,   y: 210 },
  { x: 315, y: 210 },
  { x: 630, y: 210 },
];

// Output panel skeleton line widths (%) — 5 lines mimicking the real output list.
const OUTPUT_WIDTHS = [65, 55, 70, 45, 60];

function SkeletonCanvas() {
  return (
    <div style={{
      height: 'clamp(580px, calc(100vh - 72px), 860px)',
      background: '#0A0B0A',
      borderRadius: 14,
      border: '1px solid rgba(255,255,255,0.07)',
      display: 'grid',
      // Must exactly match .workspace in WorkflowCanvas.module.css
      gridTemplateColumns: '1fr 284px',
      overflow: 'hidden',
      boxShadow: '0 40px 120px -40px rgba(0,0,0,0.85)',
    }}>
      {/* ── Canvas area ── */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.055)' }}>
        {/* Keyframes injected once — scoped to this skeleton only */}
        <style>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 0.35; }
            50%       { opacity: 0.85; }
          }
        `}</style>

        {/* Node grid — centred in the canvas area, matching real fitView position */}
        <div style={{
          position: 'absolute',
          // Grid bounding box: width = 630+255=885, height = 210+130=340
          // Centre it: offset left by half-width, up by half-height
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translate(-62px, 0px)',
        }}>
          {NODE_POSITIONS.map((pos, i) => (
            <div
              key={i}
              style={{
                ...cardStyle,
                left: pos.x,
                top: pos.y,
                // Stagger pulse so cards don't all flash in sync
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Output panel ── */}
      <div style={{
        background: 'rgba(10,11,10,0.68)',
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* "LIVE OUTPUT" label skeleton */}
        <div style={{
          height: 10,
          width: 72,
          borderRadius: 4,
          background: 'rgba(103,176,53,0.07)',
          animation: 'skeletonPulse 2s ease-in-out infinite',
        }} />
        {/* Divider gap */}
        <div style={{ height: 8 }} />
        {/* Output line skeletons — staggered, varying widths */}
        {OUTPUT_WIDTHS.map((w, i) => (
          <div key={i} style={{
            height: 11,
            width: `${w}%`,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.04)',
            animation: `skeletonPulse 2s ease-in-out ${i * 0.12}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Dynamic import — SSR disabled (XYFlow is browser-only) ──────────────────

const WorkflowCanvasLazy = dynamic(() => import('./WorkflowCanvas'), {
  ssr: false,
  loading: () => <SkeletonCanvas />,
});

export default function WorkflowCanvasLoader(
  props: ComponentProps<typeof WorkflowCanvas>,
) {
  return <WorkflowCanvasLazy {...props} />;
}
