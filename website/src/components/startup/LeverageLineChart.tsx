'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * LeverageLineChart — the recurring visual motif for the entire page.
 *
 * Renders in four states:
 *   "hero"      → two lines draw themselves on load, ending nearly overlapping (animated)
 *   "concept"   → annotated with 3 zones: Below / At / Above the line
 *   "diagnostic"→ accepts leverageRatio prop, renders a "YOU ARE HERE" marker
 *   "cta"       → open-ended upward green line, bookending the story
 */

type ChartVariant = 'hero' | 'concept' | 'diagnostic' | 'cta';

interface Props {
  variant: ChartVariant;
  leverageRatio?: number; // only used in "diagnostic" variant
  className?: string;
}

export default function LeverageLineChart({ variant, leverageRatio = 1.0, className }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (variant !== 'hero') {
      setDrawn(true);
      return;
    }
    // Intersection observer — draw once when hero enters viewport
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [variant]);

  const W = 720;
  const H = 300;
  const pad = { top: 36, right: 30, bottom: 44, left: 54 };

  // Paths
  // Headcount line — always rises roughly linearly
  const headcountPath = `M ${pad.left} ${H - pad.bottom} C ${pad.left + 120} ${H - pad.bottom - 40}, ${pad.left + 300} ${H - pad.bottom - 100}, ${W - pad.right} ${pad.top + 60}`;

  // Output line — rises then flattens (the 1:1 trap)
  const outputTrapPath = `M ${pad.left} ${H - pad.bottom} C ${pad.left + 100} ${H - pad.bottom - 60}, ${pad.left + 220} ${H - pad.bottom - 110}, ${pad.left + 340} ${H - pad.bottom - 120} C ${pad.left + 420} ${H - pad.bottom - 125}, ${pad.left + 520} ${H - pad.bottom - 115}, ${W - pad.right} ${pad.top + 80}`;

  // Output line — breakout trajectory (above the line)
  const outputBreakoutPath = `M ${pad.left + 340} ${H - pad.bottom - 120} C ${pad.left + 420} ${H - pad.bottom - 160}, ${pad.left + 520} ${H - pad.bottom - 200}, ${W - pad.right} ${pad.top + 10}`;

  const lineLen = 900; // approximate path length for dash animation

  // Diagnostic: compute Y position for the marker
  const clampedRatio = Math.min(Math.max(leverageRatio, 0.2), 3.0);
  const markerX = pad.left + 340; // fixed at the "decision point"
  // Map ratio: 0.2 → near bottom of output range, 3.0 → near top
  const markerY = H - pad.bottom - 50 - ((clampedRatio - 0.2) / 2.8) * (H - pad.top - pad.bottom - 60);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="The Leverage Line chart"
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((frac) => (
        <line
          key={frac}
          x1={pad.left}
          y1={pad.top + frac * (H - pad.top - pad.bottom)}
          x2={W - pad.right}
          y2={pad.top + frac * (H - pad.top - pad.bottom)}
          stroke="var(--border-light)"
          strokeDasharray="3 6"
        />
      ))}

      {/* Axes */}
      <line x1={pad.left} y1={pad.top - 10} x2={pad.left} y2={H - pad.bottom + 6} stroke="var(--border-light-strong)" strokeWidth="1.5" />
      <line x1={pad.left - 6} y1={H - pad.bottom} x2={W - pad.right + 10} y2={H - pad.bottom} stroke="var(--border-light-strong)" strokeWidth="1.5" />

      {/* Axis labels */}
      <text x={pad.left - 8} y={pad.top - 14} fill="var(--text-muted-light)" fontSize="10" fontWeight="600" textAnchor="start" fontFamily="var(--font-sans)">Output</text>
      <text x={W - pad.right + 8} y={H - pad.bottom + 16} fill="var(--text-muted-light)" fontSize="10" fontWeight="600" textAnchor="end" fontFamily="var(--font-sans)">Headcount →</text>

      {/* --- CONCEPT & DIAGNOSTIC: Zone shading --- */}
      {(variant === 'concept' || variant === 'diagnostic') && (
        <>
          {/* Below the line zone (amber tint) */}
          <rect x={pad.left} y={H - pad.bottom - 60} width={W - pad.left - pad.right} height={60} fill="var(--accent-amber-soft)" rx="2" />
          <text x={pad.left + 8} y={H - pad.bottom - 42} fill="var(--accent-amber)" fontSize="10" fontWeight="700" fontFamily="var(--font-sans)">BELOW THE LINE — The 1:1 Trap</text>

          {/* At the line zone (neutral) */}
          <rect x={pad.left} y={H - pad.bottom - 130} width={W - pad.left - pad.right} height={70} fill="var(--border-light)" opacity="0.3" rx="2" />
          <text x={pad.left + 8} y={H - pad.bottom - 112} fill="var(--text-muted-light)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">AT THE LINE — Ratio ≈ 1.0</text>

          {/* Above the line zone (green tint) */}
          <rect x={pad.left} y={pad.top} width={W - pad.left - pad.right} height={H - pad.bottom - 130 - pad.top} fill="var(--brand-green-soft)" rx="2" />
          <text x={pad.left + 8} y={pad.top + 16} fill="var(--brand-green-ink)" fontSize="10" fontWeight="700" fontFamily="var(--font-sans)">ABOVE THE LINE — Systems-Scaled</text>
        </>
      )}

      {/* --- Headcount line (amber/red) --- */}
      <path
        d={headcountPath}
        stroke="var(--accent-amber)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={variant === 'hero' ? {
          strokeDasharray: lineLen,
          strokeDashoffset: drawn ? 0 : lineLen,
          transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
        } : undefined}
      />
      {variant !== 'cta' && (
        <text x={W - pad.right - 4} y={pad.top + 56} fill="var(--accent-amber)" fontSize="11" fontWeight="700" textAnchor="end" fontFamily="var(--font-sans)">Headcount</text>
      )}

      {/* --- Output line: trapped trajectory (flattening) --- */}
      {variant !== 'cta' && (
        <>
          <path
            d={outputTrapPath}
            stroke="var(--brand-green-ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={variant === 'hero' ? {
              strokeDasharray: lineLen,
              strokeDashoffset: drawn ? 0 : lineLen,
              transition: 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            } : undefined}
          />
          <text x={W - pad.right - 4} y={pad.top + 78} fill="var(--text-muted-light)" fontSize="11" fontWeight="600" textAnchor="end" fontFamily="var(--font-sans)">Output (trapped)</text>
        </>
      )}

      {/* --- Breakout trajectory (only concept, diagnostic, cta) --- */}
      {variant !== 'hero' && (
        <path
          d={variant === 'cta'
            ? `M ${pad.left} ${H - pad.bottom} C ${pad.left + 200} ${H - pad.bottom - 80}, ${pad.left + 400} ${H - pad.bottom - 180}, ${W - pad.right} ${pad.top + 10}`
            : outputBreakoutPath}
          stroke="var(--brand-green-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={variant === 'cta' ? '8 6' : 'none'}
        />
      )}
      {(variant === 'concept' || variant === 'diagnostic') && (
        <text x={W - pad.right - 4} y={pad.top + 8} fill="var(--brand-green-ink)" fontSize="11" fontWeight="800" textAnchor="end" fontFamily="var(--font-sans)">Output (systems-scaled)</text>
      )}

      {/* --- DIAGNOSTIC: "YOU ARE HERE" marker --- */}
      {variant === 'diagnostic' && (
        <g>
          <circle cx={markerX} cy={markerY} r="8" fill="var(--brand-green-ink)" />
          <circle cx={markerX} cy={markerY} r="14" fill="none" stroke="var(--brand-green-ink)" strokeWidth="2" opacity="0.4" />
          <rect x={markerX + 18} y={markerY - 14} width="100" height="24" rx="4" fill="var(--brand-green-ink)" />
          <text x={markerX + 28} y={markerY + 2} fill="white" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">YOU ARE HERE</text>
        </g>
      )}

      {/* --- CTA: open arrow at end --- */}
      {variant === 'cta' && (
        <>
          <polygon points={`${W - pad.right - 2},${pad.top + 10} ${W - pad.right - 14},${pad.top + 2} ${W - pad.right - 14},${pad.top + 18}`} fill="var(--brand-green-ink)" />
          <text x={W / 2} y={H - 8} fill="var(--text-muted-light)" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">Your trajectory starts here →</text>
        </>
      )}
    </svg>
  );
}
