'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import styles from './LeverageLineHeroChart.module.css';

/**
 * The hero's Leverage Line chart — the first appearance of the page's one
 * recurring visual motif, shown BEFORE the framework names it, so the next
 * section pays it off (redesign spec §7 Section 1, §8 Visual Strategy).
 *
 * It plays as a NARRATED SCENE, not a static drawing, because a static chart
 * left the founder to work out the point on their own. Four beats, 1200ms
 * apart (a 3.6s run, inside the 3-5s brief), each with a plain-English line:
 *
 *   1. the headcount line draws     — "you hired"
 *   2. the revenue line draws       — "revenue grew at the same rate"
 *   3. THE MATH APPEARS             — 30% ÷ 30% = 1.0×, the Leverage Ratio
 *   4. the third line forks upward  — what one system changes
 *
 * Beat 3 is the important one and was explicitly asked for: show the actual
 * arithmetic. The whole page is built on the Leverage Ratio, and this chart
 * previously never showed it being computed. The run then holds and replays,
 * so the section is alive rather than frozen after one pass.
 *
 * Geometry is measured, not eyeballed — three rounds of "this looks
 * unprofessional" traced to arithmetic rather than taste:
 *
 *   1. TEXT SIZE. SVG font-size is in viewBox units, so what a reader sees is
 *      fontSize × (renderedPx / viewBoxWidth). The old 720-wide viewBox in a
 *      616px panel meant scale 0.86 and 10-11px labels displaying at 8.6-9.4px.
 *      At 520 wide it renders slightly above 1:1. Never change W or a
 *      font-size here without recomputing the effective size.
 *   2. VERTICAL WASTE. The axis used to top out at 60% while the curves only
 *      reached 30%, so half the plot was permanently empty. It ends at 50% now.
 *   3. ASPECT. 720×300 was 2.40 — a flat sliver in a tall card. Now 1.63.
 *
 * The two locked lines are generated from one compound-growth function with
 * the SAME target, so their paths are byte-for-byte identical — "they grow at
 * the same rate" is true by construction, not by eye. That shared path is
 * drawn twice, solid amber under dashed grey, so the dashes reveal amber
 * through the gaps and it reads as two things on one trajectory.
 */

type LineKey = 'locked' | 'breakout';
type Point = { x: number; y: number };

const LINE_CAPTIONS: Record<LineKey, string> = {
  locked: 'Headcount and revenue, locked together — every extra unit of output cost you another person. This is the 1:1 Trap.',
  breakout: 'The same team, with one system absorbing the repeatable work — output keeps compounding, payroll doesn’t.',
};

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
const BRANCH_FRACTION = 0.42;
const BREAKOUT_STEPS = 10;
const BREAKOUT_SHAPE_RATE = 0.11;
const BREAKOUT_EXTRA_PCT = 30;

/* Four beats, 1200ms apart → a 3.6s run, then a hold before it replays. */
const BEATS: { text: string }[] = [
  { text: `You hired. Headcount went up ${TARGET_PCT}% last quarter.` },
  { text: `Revenue went up ${TARGET_PCT}% too — the exact same rate.` },
  { text: 'Divide one by the other and you get 1.0. That’s the 1:1 Trap: growth you bought with payroll.' },
  { text: 'Now the same team, with one system doing the repeatable work. Output keeps climbing. Payroll doesn’t.' },
];
const LAST = BEATS.length - 1;
const BEAT_MS = 1200;
const HOLD_MS = 3600;

function growthToY(pct: number): number {
  const clamped = Math.min(Math.max(pct, 0), MAX_PCT);
  return plotBottom - (clamped / MAX_PCT) * (plotBottom - plotTop);
}

/** Fraction of the way from 0 to target at step t along a compounding curve,
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

/* The maths callout sits in the plot's empty upper-left quadrant — the curves
   all live in the lower-right, so nothing collides. Verified numerically. */
const MATH_X = PAD.left + 14;
const MATH_Y = plotTop + 16;
const MATH_W = 186;
const MATH_H = 54;

export default function LeverageLineHeroChart({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState<LineKey | null>(null);

  /* Reduced motion is derived at render, not held in state: those users simply
     see the finished frame. Keeping it out of the effect also avoids calling
     setState synchronously in an effect body, which cascades renders. */
  const shownBeat = reduced ? LAST : beat;

  useEffect(() => {
    if (reduced || !inView) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    // One timer in flight at a time; every setState is inside a callback.
    const step = (b: number, c: number) => {
      timer = setTimeout(() => {
        if (cancelled) return;
        if (b === LAST) {
          setCycle(c + 1);
          setBeat(0);
          step(0, c + 1);
        } else {
          setBeat(b + 1);
          step(b + 1, c);
        }
      }, b === LAST ? HOLD_MS : BEAT_MS);
    };
    step(0, cycle);
    return () => { cancelled = true; clearTimeout(timer); };
    // `cycle` is intentionally omitted: it's advanced BY this loop, and
    // including it would tear down and restart the run on every cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  const dim = (key: LineKey) => (hovered && hovered !== key ? 0.25 : 1);
  const draw = (reached: boolean) => ({
    animate: { pathLength: reached ? 1 : 0 },
    // Forward draws over ~1s; the reset at the start of a new cycle is instant
    // so the replay doesn't read as the lines un-drawing themselves.
    transition: { duration: reached ? 1 : 0, ease: [0.16, 1, 0.3, 1] as const },
  });

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

        {/* Everything below is keyed to the cycle so a replay starts clean. */}
        <g key={cycle}>
          {/* Beat 1 — headcount */}
          <g style={{ opacity: dim('locked') }}>
            <motion.path
              d={LOCKED_PATH}
              className={styles.lineHeadcount}
              initial={{ pathLength: 0 }}
              {...draw(shownBeat >= 0)}
            />
            {shownBeat >= 0 && (
              <motion.text
                x={LOCKED_END.x}
                y={LOCKED_END.y - 14}
                className={styles.labelHeadcount}
                textAnchor="end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: reduced ? 0 : 0.9 }}
              >
                Headcount +{TARGET_PCT}%
              </motion.text>
            )}

            {/* Beat 2 — revenue, on the identical path */}
            {shownBeat >= 1 && (
              <>
                <motion.path
                  d={LOCKED_PATH}
                  className={styles.lineRevenue}
                  initial={{ pathLength: 0 }}
                  {...draw(true)}
                />
                <motion.text
                  x={LOCKED_END.x}
                  y={LOCKED_END.y + 20}
                  className={styles.labelRevenue}
                  textAnchor="end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: reduced ? 0 : 0.9 }}
                >
                  Revenue +{TARGET_PCT}%
                </motion.text>
              </>
            )}
          </g>

          {/* Beat 3 — the arithmetic, stated outright */}
          {shownBeat >= 2 && (
            <motion.g
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <rect x={MATH_X} y={MATH_Y} width={MATH_W} height={MATH_H} rx="8" className={styles.mathBox} />
              <text x={MATH_X + 14} y={MATH_Y + 24} className={styles.mathEq}>
                {TARGET_PCT}% ÷ {TARGET_PCT}% = 1.0×
              </text>
              <text x={MATH_X + 14} y={MATH_Y + 42} className={styles.mathNote}>
                Leverage Ratio — the 1:1 Trap
              </text>
            </motion.g>
          )}

          {/* The fork, where the two futures separate */}
          {shownBeat >= 3 && (
            <motion.circle
              cx={BRANCH.x}
              cy={BRANCH.y}
              r="3.5"
              className={styles.branchDot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Beat 4 — what a system does to the same picture */}
          {shownBeat >= 3 && (
            <g style={{ opacity: dim('breakout') }}>
              <motion.path
                d={BREAKOUT_PATH}
                className={styles.lineBreakout}
                initial={{ pathLength: 0 }}
                {...draw(true)}
              />
              <motion.text
                x={BREAKOUT_END.x}
                y={BREAKOUT_END.y - 16}
                className={styles.labelBreakout}
                textAnchor="end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: reduced ? 0 : 0.9 }}
              >
                Same team, one system
              </motion.text>
            </g>
          )}
        </g>

        {/* Wide invisible hit-areas — nobody should need pixel precision to
            hover a 3px line. Last, so they capture the pointer. */}
        <path d={LOCKED_PATH} className={styles.hit} onMouseEnter={() => setHovered('locked')} onMouseLeave={() => setHovered(null)} />
        {shownBeat >= 3 && (
          <path d={BREAKOUT_PATH} className={styles.hit} onMouseEnter={() => setHovered('breakout')} onMouseLeave={() => setHovered(null)} />
        )}
      </svg>

      {/* Narration: what is happening, in plain words. Hovering a line
          overrides it with that line's explanation. */}
      <div className={styles.narration}>
        <div className={styles.beatDots} aria-hidden="true">
          {BEATS.map((b, i) => (
            <span key={b.text} className={styles.beatDot} data-on={i <= shownBeat ? 'true' : undefined} />
          ))}
        </div>
        <p className={styles.narrationText} aria-live="polite">
          {hovered ? LINE_CAPTIONS[hovered] : BEATS[shownBeat]?.text}
        </p>
      </div>
    </div>
  );
}
