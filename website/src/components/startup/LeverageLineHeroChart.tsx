'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import styles from './LeverageLineChart.module.css';

/**
 * The hero's Leverage Line chart — the first appearance of the page's one
 * recurring visual motif, shown BEFORE the framework names it, so the next
 * section pays it off. That staging is straight out of the redesign spec
 * (src/specs/ai-growth-systems-for-startups-redesign.md, §7 Section 1 and §8
 * Visual Strategy), which treats this chart as the page's leitmotif.
 *
 * It shares LeverageLineChart.module.css on purpose: one place decides that
 * headcount is amber, the trapped trajectory is grey and dashed, and the
 * systems-scaled trajectory is green. Two files drawing the same metaphor in
 * different colours is how the old build ended up illegible.
 *
 * The lines are NOT hand-tuned bezier curves. They're generated from a real
 * compound-growth formula (`compoundFrac`) parameterised by a target growth %,
 * and the headcount and revenue lines are passed the SAME target — so they
 * produce byte-for-byte identical paths. "These two grow at the same rate" is
 * therefore true by construction, not by me eyeballing two similar squiggles.
 */

type LineKey = 'headcount' | 'trap' | 'breakout';
type Point = { x: number; y: number };

const LINE_CAPTIONS: Record<LineKey, string> = {
  headcount: 'Headcount — climbs every time a function hits capacity and the answer is another hire.',
  trap: 'Revenue, trapped — grows at the exact same rate as headcount. No leverage. This is the 1:1 Trap.',
  breakout: 'Revenue, systems-scaled — pulls ahead of headcount once the repeatable work runs on AI, not people.',
};
const DEFAULT_CAPTION = 'Hover a line to see what it means.';

const W = 720;
const H = 300;
const PAD = { top: 36, right: 30, bottom: 44, left: 54 };
const plotTop = PAD.top;
const plotBottom = H - PAD.bottom;
const plotWidth = W - PAD.left - PAD.right;

/* Illustrative shape constants. These describe how convex the compounding
   LOOKS; they are not a claimed real-world growth rate. */
const MAX_PCT = 60;
const TICKS = [0, 20, 40, 60];
const STEPS = 12;
const SHAPE_RATE = 0.08;
const TARGET_PCT = 30;          // both lines reach the SAME 30% — the proof
const BRANCH_FRACTION = 0.55;   // where the breakout forks off the trapped curve
const BREAKOUT_STEPS = 10;
const BREAKOUT_SHAPE_RATE = 0.11;
const BREAKOUT_EXTRA_PCT = 32;

function growthToY(pct: number): number {
  const clamped = Math.min(Math.max(pct, 0), MAX_PCT);
  return plotBottom - (clamped / MAX_PCT) * (plotBottom - plotTop);
}

/** Fraction of the way from 0 to target at step `t`, along a compounding
 *  curve — normalised so it always lands exactly on 1.0 at the final step,
 *  whatever shape rate is chosen. */
function compoundFrac(t: number, steps: number, rate: number): number {
  return (Math.pow(1 + rate, t) - 1) / (Math.pow(1 + rate, steps) - 1);
}

function trappedPoints(): Point[] {
  const pts: Point[] = [];
  for (let t = 0; t <= STEPS; t++) {
    const pct = compoundFrac(t, STEPS, SHAPE_RATE) * TARGET_PCT;
    pts.push({ x: PAD.left + plotWidth * (t / STEPS), y: growthToY(pct) });
  }
  return pts;
}

function breakoutPoints(trapped: Point[]): Point[] {
  const branchIndex = Math.round(STEPS * BRANCH_FRACTION);
  const branchPct = compoundFrac(branchIndex, STEPS, SHAPE_RATE) * TARGET_PCT;
  const branch = trapped[branchIndex];
  const endX = W - PAD.right;
  const pts: Point[] = [branch];
  for (let t = 1; t <= BREAKOUT_STEPS; t++) {
    const pct = branchPct + compoundFrac(t, BREAKOUT_STEPS, BREAKOUT_SHAPE_RATE) * BREAKOUT_EXTRA_PCT;
    pts.push({ x: branch.x + (endX - branch.x) * (t / BREAKOUT_STEPS), y: growthToY(pct) });
  }
  return pts;
}

/** Points → smooth SVG path via quadratic-through-midpoints. Cheap smoothing,
 *  no spline library needed. */
function smoothPath(points: Point[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}, ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

const TRAPPED = trappedPoints();
const TRAPPED_PATH = smoothPath(TRAPPED);
const BREAKOUT = breakoutPoints(TRAPPED);
const BREAKOUT_PATH = smoothPath(BREAKOUT);
const END = TRAPPED[STEPS];
const BREAKOUT_END = BREAKOUT[BREAKOUT.length - 1];

export default function LeverageLineHeroChart({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<LineKey | null>(null);

  // Draws itself once on scroll-in, then idles — per the spec, this is the one
  // place on the page a scroll-triggered reveal is warranted.
  const drawIn = !reduced;
  const dim = (key: LineKey) => (hovered && hovered !== key ? 0.3 : 1);

  return (
    <div ref={containerRef}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.svg} ${className || ''}`}
        aria-label="Revenue and headcount growing at the same rate — the Leverage Line"
      >
        {/* Gridlines + Y ticks on a real % scale */}
        {TICKS.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} y1={growthToY(tick)} x2={W - PAD.right} y2={growthToY(tick)} className={styles.gridLine} />
            <text x={PAD.left - 10} y={growthToY(tick) + 4} className={styles.tickLabel} textAnchor="end">{tick}%</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top - 10} x2={PAD.left} y2={plotBottom + 6} className={styles.axisLine} strokeWidth="1.5" />
        <line x1={PAD.left - 6} y1={plotBottom} x2={W - PAD.right + 10} y2={plotBottom} className={styles.axisLine} strokeWidth="1.5" />
        <text x={PAD.left - 8} y={PAD.top - 14} className={styles.axisLabel} textAnchor="start">Growth %</text>
        <text x={W - PAD.right + 8} y={plotBottom + 16} className={styles.axisLabel} textAnchor="end">Time →</text>

        {/* Headcount and trapped-revenue: the SAME generated path, drawn in two
            styles. Their overlap is the whole point. */}
        <motion.path
          d={TRAPPED_PATH}
          className={styles.lineHeadcount}
          style={{ opacity: dim('headcount') }}
          initial={drawIn ? { pathLength: 0 } : false}
          animate={drawIn ? { pathLength: inView ? 1 : 0 } : undefined}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <text x={END.x - 4} y={END.y - 20} className={styles.lineLabelHeadcount} textAnchor="end" style={{ opacity: dim('headcount') }}>
          Headcount +{TARGET_PCT}%
        </text>

        <motion.path
          d={TRAPPED_PATH}
          className={styles.lineOutputTrap}
          style={{ opacity: dim('trap') }}
          initial={drawIn ? { pathLength: 0 } : false}
          animate={drawIn ? { pathLength: inView ? 1 : 0 } : undefined}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
        <text x={END.x - 4} y={END.y + 20} className={styles.lineLabelTrap} textAnchor="end" style={{ opacity: dim('trap') }}>
          Revenue +{TARGET_PCT}%
        </text>

        {/* The third line: what a system does to the same picture. Its own
            delayed beat, so the trap registers first. */}
        <motion.path
          d={BREAKOUT_PATH}
          className={styles.lineOutputBreakout}
          style={{ opacity: dim('breakout') }}
          initial={drawIn ? { pathLength: 0 } : false}
          animate={drawIn ? { pathLength: inView ? 1 : 0 } : undefined}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.9 }}
        />
        <motion.text
          x={BREAKOUT_END.x - 4}
          y={BREAKOUT_END.y - 10}
          className={styles.lineLabelBreakout}
          textAnchor="end"
          initial={drawIn ? { opacity: 0 } : false}
          animate={drawIn ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: 2.8 }}
        >
          Same team. One system doing the repeatable 60%.
        </motion.text>

        {/* Wide invisible hit-areas — a visitor shouldn't need pixel precision
            to hover a 2.5px line. Drawn last so they capture the pointer. */}
        <path d={TRAPPED_PATH} stroke="transparent" strokeWidth={22} fill="none" style={{ cursor: 'pointer' }} onMouseEnter={() => setHovered('headcount')} onMouseLeave={() => setHovered(null)} />
        <path d={BREAKOUT_PATH} stroke="transparent" strokeWidth={22} fill="none" style={{ cursor: 'pointer' }} onMouseEnter={() => setHovered('breakout')} onMouseLeave={() => setHovered(null)} />
      </svg>

      <p className={styles.caption} aria-live="polite">
        {hovered ? LINE_CAPTIONS[hovered] : DEFAULT_CAPTION}
      </p>
    </div>
  );
}
