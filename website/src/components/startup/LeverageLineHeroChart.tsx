'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import styles from './LeverageLineHeroChart.module.css';

/**
 * The hero's Leverage Line chart — the first appearance of the page's one
 * recurring visual motif, shown BEFORE the framework names it, so the next
 * section pays it off (redesign spec §7 Section 1, §8 Visual Strategy).
 *
 * Geometry is deliberate, and was measured rather than eyeballed — three
 * rounds of "this looks unprofessional" traced to arithmetic, not taste:
 *
 *   1. TEXT SIZE. The old 720×300 viewBox rendered ~616px wide, a scale of
 *      0.86, so 10-11px labels landed at 8.6-9.4px on screen — genuinely
 *      illegible. The viewBox is now 520 wide, so it renders ABOVE 1:1 and
 *      12-13px type lands at ~14px. Never set a font-size in this file
 *      without multiplying by (rendered width / 520) first.
 *   2. VERTICAL WASTE. The Y axis used to top out at 60% while the curves
 *      only reached 30%, so half the plot was permanently empty. The axis now
 *      ends at 50% and the breakout reaches ~39%, so the curves fill it.
 *   3. ASPECT. 720×300 was 2.40 — a wide, flat sliver in a tall box. Now
 *      520×320 (1.63), which fills its panel instead of floating in it.
 *
 * The lines are generated from a compound-growth formula, not hand-drawn
 * beziers: headcount and revenue are passed the SAME target %, so they
 * produce one identical path. Rather than stack two invisible coincident
 * lines, that shared path is drawn twice — solid amber underneath, dashed
 * grey over the top — so it reads as two things locked to one trajectory,
 * which is the entire point of the 1:1 Trap.
 */

type LineKey = 'locked' | 'breakout';
type Point = { x: number; y: number };

const LINE_CAPTIONS: Record<LineKey, string> = {
  locked: 'Headcount and revenue, locked together — every new unit of output cost you a new person. This is the 1:1 Trap.',
  breakout: 'The same team, with one system absorbing the repeatable work — output keeps compounding, payroll doesn’t.',
};
const DEFAULT_CAPTION = 'Hover either line to see what it means.';

/* — Geometry. See note 1 above before changing W. — */
const W = 520;
const H = 320;
const PAD = { top: 34, right: 26, bottom: 38, left: 46 };
const plotTop = PAD.top;
const plotBottom = H - PAD.bottom;
const plotWidth = W - PAD.left - PAD.right;

const MAX_PCT = 50;
const TICKS = [0, 10, 20, 30, 40, 50];
const STEPS = 12;
const SHAPE_RATE = 0.08;
const TARGET_PCT = 30;          // both locked lines land here — the "same rate" proof
const BRANCH_FRACTION = 0.42;   // where the breakout forks off
const BREAKOUT_STEPS = 10;
const BREAKOUT_SHAPE_RATE = 0.11;
const BREAKOUT_EXTRA_PCT = 30;

function growthToY(pct: number): number {
  const clamped = Math.min(Math.max(pct, 0), MAX_PCT);
  return plotBottom - (clamped / MAX_PCT) * (plotBottom - plotTop);
}

/** Fraction of the way from 0 to target at step t, along a compounding curve,
 *  normalised to land exactly on 1.0 at the final step whatever rate is used. */
function compoundFrac(t: number, steps: number, rate: number): number {
  return (Math.pow(1 + rate, t) - 1) / (Math.pow(1 + rate, steps) - 1);
}

function lockedPoints(): Point[] {
  const pts: Point[] = [];
  for (let t = 0; t <= STEPS; t++) {
    const pct = compoundFrac(t, STEPS, SHAPE_RATE) * TARGET_PCT;
    pts.push({ x: PAD.left + plotWidth * (t / STEPS), y: growthToY(pct) });
  }
  return pts;
}

function breakoutPoints(locked: Point[]): Point[] {
  const branchIndex = Math.round(STEPS * BRANCH_FRACTION);
  const branchPct = compoundFrac(branchIndex, STEPS, SHAPE_RATE) * TARGET_PCT;
  const branch = locked[branchIndex];
  const endX = W - PAD.right;
  const pts: Point[] = [branch];
  for (let t = 1; t <= BREAKOUT_STEPS; t++) {
    const pct = branchPct + compoundFrac(t, BREAKOUT_STEPS, BREAKOUT_SHAPE_RATE) * BREAKOUT_EXTRA_PCT;
    pts.push({ x: branch.x + (endX - branch.x) * (t / BREAKOUT_STEPS), y: growthToY(pct) });
  }
  return pts;
}

/** Points → smooth path via quadratic-through-midpoints. No spline library. */
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

const LOCKED = lockedPoints();
const LOCKED_PATH = smoothPath(LOCKED);
const BREAKOUT = breakoutPoints(LOCKED);
const BREAKOUT_PATH = smoothPath(BREAKOUT);
const LOCKED_END = LOCKED[STEPS];
const BREAKOUT_END = BREAKOUT[BREAKOUT.length - 1];
const BRANCH = LOCKED[Math.round(STEPS * BRANCH_FRACTION)];

export default function LeverageLineHeroChart({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<LineKey | null>(null);

  const drawIn = !reduced;
  const dim = (key: LineKey) => (hovered && hovered !== key ? 0.25 : 1);

  return (
    <div ref={containerRef} className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        aria-label="Revenue and headcount growing at the same rate, and what one system changes"
      >
        {/* Gridlines + Y ticks on a real % scale */}
        {TICKS.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} y1={growthToY(tick)} x2={W - PAD.right} y2={growthToY(tick)} className={styles.gridLine} />
            <text x={PAD.left - 9} y={growthToY(tick) + 4} className={styles.tickLabel} textAnchor="end">{tick}%</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={PAD.left} y1={plotTop - 8} x2={PAD.left} y2={plotBottom} className={styles.axisLine} />
        <line x1={PAD.left} y1={plotBottom} x2={W - PAD.right + 8} y2={plotBottom} className={styles.axisLine} />
        <text x={PAD.left - 9} y={plotTop - 14} className={styles.axisLabel} textAnchor="start">Growth</text>
        <text x={W - PAD.right + 8} y={plotBottom + 20} className={styles.axisLabel} textAnchor="end">Time →</text>

        {/* The locked pair: ONE generated path, drawn twice. Solid amber
            underneath, dashed grey on top, so the dashes reveal amber through
            the gaps — two things sharing a single trajectory. */}
        <motion.g style={{ opacity: dim('locked') }}>
          <motion.path
            d={LOCKED_PATH}
            className={styles.lineHeadcount}
            initial={drawIn ? { pathLength: 0 } : false}
            animate={drawIn ? { pathLength: inView ? 1 : 0 } : undefined}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d={LOCKED_PATH}
            className={styles.lineRevenue}
            initial={drawIn ? { pathLength: 0 } : false}
            animate={drawIn ? { pathLength: inView ? 1 : 0 } : undefined}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.g>

        {/* Labels for the locked pair, straddling the line end (which lands
            exactly on the 30% gridline — both grew 30%). */}
        <g style={{ opacity: dim('locked') }}>
          <text x={LOCKED_END.x} y={LOCKED_END.y - 14} className={styles.labelHeadcount} textAnchor="end">
            Headcount +{TARGET_PCT}%
          </text>
          <text x={LOCKED_END.x} y={LOCKED_END.y + 20} className={styles.labelRevenue} textAnchor="end">
            Revenue +{TARGET_PCT}%
          </text>
        </g>

        {/* The fork: a marker where the two futures separate. */}
        <motion.circle
          cx={BRANCH.x}
          cy={BRANCH.y}
          r="3.5"
          className={styles.branchDot}
          initial={drawIn ? { opacity: 0 } : false}
          animate={drawIn ? { opacity: 1 } : undefined}
          transition={{ duration: 0.3, delay: 1.5 }}
        />

        {/* What a system does to the same picture — its own delayed beat, so
            the trap registers first. */}
        <motion.g style={{ opacity: dim('breakout') }}>
          <motion.path
            d={BREAKOUT_PATH}
            className={styles.lineBreakout}
            initial={drawIn ? { pathLength: 0 } : false}
            animate={drawIn ? { pathLength: inView ? 1 : 0 } : undefined}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.7 }}
          />
          <motion.text
            x={BREAKOUT_END.x}
            y={BREAKOUT_END.y - 16}
            className={styles.labelBreakout}
            textAnchor="end"
            initial={drawIn ? { opacity: 0 } : false}
            animate={drawIn ? { opacity: 1 } : undefined}
            transition={{ duration: 0.4, delay: 2.5 }}
          >
            Same team, one system
          </motion.text>
        </motion.g>

        {/* Wide invisible hit-areas — nobody should need pixel precision to
            hover a 3px line. Last, so they capture the pointer. */}
        <path d={LOCKED_PATH} className={styles.hit} onMouseEnter={() => setHovered('locked')} onMouseLeave={() => setHovered(null)} />
        <path d={BREAKOUT_PATH} className={styles.hit} onMouseEnter={() => setHovered('breakout')} onMouseLeave={() => setHovered(null)} />
      </svg>

      <p className={styles.caption} aria-live="polite">
        {hovered ? LINE_CAPTIONS[hovered] : DEFAULT_CAPTION}
      </p>
    </div>
  );
}
