'use client';

/**
 * FlowingEdge — custom XYFlow edge with a travelling dot animation.
 *
 * Visual states:
 *   inactive — dim white base path; single slow dot
 *   active   — bright green overlay + two data packets travelling in sequence
 *   done     — soft green overlay; marks edges that have already been traversed
 */

import { getSmoothStepPath, type EdgeProps } from '@xyflow/react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FlowingEdgeData = {
  active?: boolean;
  done?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_STROKE         = 'rgba(255,255,255,0.28)'; // raised from 0.14 — pipeline structure readable on load
const BASE_STROKE_WIDTH   = 1.5;
const DONE_STROKE         = 'rgba(103,176,53,0.22)';  // traversed edges stay softly lit green
const ACTIVE_STROKE       = 'rgba(103,176,53,0.5)';
const ACTIVE_STROKE_WIDTH = 2;
const DOT_FILL            = '#67B035';
const DOT_RADIUS          = 3.5;
const DOT_DUR             = '1.4s';
const PACKET_GAP          = '0.55s'; // second packet trails 0.55s behind first

// ─── Component ────────────────────────────────────────────────────────────────

export function FlowingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}: EdgeProps) {
  const isActive = (data as FlowingEdgeData)?.active ?? false;
  const isDone   = (data as FlowingEdgeData)?.done   ?? false;

  const pathId   = `edge-path-${id}`;
  const filterId = `edgeGlow-${id}`;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      {/* ── SVG defs: glow filter (unique per edge) ── */}
      <defs>
        <filter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Base path — always visible ── */}
      <path
        id={pathId}
        d={edgePath}
        fill="none"
        stroke={BASE_STROKE}
        strokeWidth={BASE_STROKE_WIDTH}
        style={{ ...style, stroke: BASE_STROKE, strokeWidth: BASE_STROKE_WIDTH }}
      />

      {/* ── Done overlay — stays after the edge has been traversed ── */}
      {isDone && (
        <path
          d={edgePath}
          fill="none"
          stroke={DONE_STROKE}
          strokeWidth={ACTIVE_STROKE_WIDTH}
          style={{ pointerEvents: 'none' }}
          markerEnd={markerEnd}
        />
      )}

      {/* ── Active overlay — bright green while the step is processing ── */}
      {isActive && (
        <path
          d={edgePath}
          fill="none"
          stroke={ACTIVE_STROKE}
          strokeWidth={ACTIVE_STROKE_WIDTH}
          style={{ pointerEvents: 'none' }}
          markerEnd={markerEnd}
        />
      )}

      {/* ── First travelling dot ── */}
      <circle
        r={isActive ? DOT_RADIUS : 2}
        fill={isActive ? DOT_FILL : 'rgba(255, 255, 255, 0.4)'}
        filter={isActive ? `url(#${filterId})` : undefined}
        style={{ pointerEvents: 'none' }}
      >
        <animateMotion
          dur={isActive ? DOT_DUR : '3s'}
          repeatCount="indefinite"
          keyTimes="0;1"
          calcMode="spline"
          keySplines="0.4 0 0.6 1"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>

      {/* ── Second data packet — active edges only, trails 0.55s behind first ── */}
      {isActive && (
        <circle
          r={DOT_RADIUS}
          fill={DOT_FILL}
          filter={`url(#${filterId})`}
          style={{ pointerEvents: 'none' }}
        >
          <animateMotion
            dur={DOT_DUR}
            begin={PACKET_GAP}
            repeatCount="indefinite"
            keyTimes="0;1"
            calcMode="spline"
            keySplines="0.4 0 0.6 1"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}
