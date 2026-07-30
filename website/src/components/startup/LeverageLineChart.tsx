'use client';

import { motion, useReducedMotion } from 'motion/react';
import styles from './LeverageLineChart.module.css';

/**
 * The diagnostic's chart — the page's ONE chart, and the only place a chart
 * earns its place: it plots the visitor's own computed ratio.
 *
 * It used to also render a "hero" variant (two abstract lines above the fold)
 * and, before that, "concept" and "cta" variants — the same picture four times
 * down one page, none of it responding to anything the visitor did. Those are
 * gone. The hero now leads with real tool logos and attributed numbers, and
 * the framework section explains itself in words plus its three ratio bands.
 *
 * The zone bands and the marker share ONE ratio→Y mapping (`ratioToY`) and one
 * pair of thresholds (RATIO_BELOW_MAX / RATIO_AT_MAX) — these must match
 * LeverageDiagnostic.tsx's own verdict thresholds exactly, or the marker can
 * visually land in a zone that contradicts its own verdict.
 */

interface Props {
  leverageRatio?: number;
  className?: string;
}

const W = 720;
const H = 300;
const PAD = { top: 36, right: 30, bottom: 44, left: 54 };

// Exported so LeverageDiagnostic.tsx's verdict logic reads from this ONE
// definition instead of duplicating the same numbers in two files.
export const RATIO_BELOW_MAX = 0.8;
export const RATIO_AT_MAX = 1.2;
const RATIO_MIN = 0;
const RATIO_MAX = 3.0;
const Y_TICKS = [0, 1, 2, 3];

const plotTop = PAD.top;
const plotBottom = H - PAD.bottom;
const plotWidth = W - PAD.left - PAD.right;

/** One shared mapping from Leverage Ratio to a Y coordinate — used by both the
 *  zone bands and the marker so they can never disagree. */
function ratioToY(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, RATIO_MIN), RATIO_MAX);
  const frac = (clamped - RATIO_MIN) / (RATIO_MAX - RATIO_MIN);
  return plotBottom - frac * (plotBottom - plotTop);
}

const yBelowAtBoundary = ratioToY(RATIO_BELOW_MAX);
const yAtAboveBoundary = ratioToY(RATIO_AT_MAX);

const headcountPath = `M ${PAD.left} ${plotBottom} C ${PAD.left + 120} ${plotBottom - 40}, ${PAD.left + 300} ${plotBottom - 100}, ${W - PAD.right} ${PAD.top + 60}`;
const outputTrapPath = `M ${PAD.left} ${plotBottom} C ${PAD.left + 100} ${plotBottom - 60}, ${PAD.left + 220} ${plotBottom - 110}, ${PAD.left + 340} ${plotBottom - 120} C ${PAD.left + 420} ${plotBottom - 125}, ${PAD.left + 520} ${plotBottom - 115}, ${W - PAD.right} ${PAD.top + 80}`;
const outputBreakoutPath = `M ${PAD.left + 340} ${plotBottom - 120} C ${PAD.left + 420} ${plotBottom - 160}, ${PAD.left + 520} ${plotBottom - 200}, ${W - PAD.right} ${PAD.top + 10}`;

const markerX = PAD.left + 340;

export default function LeverageLineChart({ leverageRatio = 1.0, className }: Props) {
  const reduced = useReducedMotion();
  const markerY = ratioToY(leverageRatio);
  const spring = reduced
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 140, damping: 22 } as const);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.svg} ${className || ''}`}
      aria-label="Your position on the Leverage Line"
    >
      {/* Gridlines + Y-axis ticks — real ratio values, the same scale the
          marker and the zone bands are computed from. */}
      {Y_TICKS.map((tick) => (
        <g key={tick}>
          <line x1={PAD.left} y1={ratioToY(tick)} x2={W - PAD.right} y2={ratioToY(tick)} className={styles.gridLine} />
          <text x={PAD.left - 10} y={ratioToY(tick) + 4} className={styles.tickLabel} textAnchor="end">{tick}x</text>
        </g>
      ))}

      {/* Axes */}
      <line x1={PAD.left} y1={PAD.top - 10} x2={PAD.left} y2={plotBottom + 6} className={styles.axisLine} strokeWidth="1.5" />
      <line x1={PAD.left - 6} y1={plotBottom} x2={W - PAD.right + 10} y2={plotBottom} className={styles.axisLine} strokeWidth="1.5" />
      <text x={PAD.left - 8} y={PAD.top - 14} className={styles.axisLabel} textAnchor="start">Output</text>
      <text x={W - PAD.right + 8} y={plotBottom + 16} className={styles.axisLabel} textAnchor="end">Headcount →</text>

      {/* Zone bands, derived from the SAME ratioToY() as the marker */}
      <rect x={PAD.left} y={yBelowAtBoundary} width={plotWidth} height={plotBottom - yBelowAtBoundary} className={styles.zoneBelow} rx="2" />
      <text x={PAD.left + 10} y={yBelowAtBoundary + 18} className={styles.zoneLabelBelow}>BELOW THE LINE</text>
      <text x={PAD.left + 10} y={yBelowAtBoundary + 32} className={styles.zoneSubLabelBelow}>The 1:1 Trap</text>

      <rect x={PAD.left} y={yAtAboveBoundary} width={plotWidth} height={yBelowAtBoundary - yAtAboveBoundary} className={styles.zoneAt} rx="2" />
      <text x={PAD.left + 10} y={yAtAboveBoundary + 18} className={styles.zoneLabelAt}>AT THE LINE</text>
      <text x={PAD.left + 10} y={yAtAboveBoundary + 32} className={styles.zoneSubLabelAt}>Ratio = 1.0</text>

      <rect x={PAD.left} y={PAD.top} width={plotWidth} height={yAtAboveBoundary - PAD.top} className={styles.zoneAbove} rx="2" />
      <text x={PAD.left + 10} y={PAD.top + 16} className={styles.zoneLabelAbove}>ABOVE THE LINE</text>
      <text x={PAD.left + 10} y={PAD.top + 30} className={styles.zoneSubLabelAbove}>Systems-Scaled</text>

      {/* Illustrative trajectories: headcount, output-if-nothing-changes, and
          output once a system absorbs the repeatable share. */}
      <path d={headcountPath} className={styles.lineHeadcount} />
      <path d={outputTrapPath} className={styles.lineOutputTrap} />
      <path d={outputBreakoutPath} className={styles.lineOutputBreakout} />

      {/* The marker — the only element driven by the visitor's own numbers. */}
      <g>
        {/* Vertical guide ties the marker to the axis, so its movement reads
            as "your position", not decoration. */}
        <motion.line
          x1={markerX}
          x2={markerX}
          y1={plotTop}
          className={styles.guideLine}
          animate={{ y2: markerY }}
          transition={spring}
        />
        <motion.circle cx={markerX} className={styles.marker} r="8" animate={{ cy: markerY }} transition={spring} />
        <motion.circle cx={markerX} className={styles.markerRing} r="14" strokeWidth="2" animate={{ cy: markerY }} transition={spring} />
        <motion.rect
          x={markerX + 18}
          width="100"
          height="24"
          rx="4"
          className={styles.markerLabelBg}
          animate={{ y: markerY - 14 }}
          transition={spring}
        />
        <motion.text x={markerX + 28} className={styles.markerLabelText} animate={{ y: markerY + 2 }} transition={spring}>
          YOU ARE HERE
        </motion.text>
      </g>
    </svg>
  );
}
