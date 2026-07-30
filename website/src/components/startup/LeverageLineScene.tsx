'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import styles from './LeverageLineScene.module.css';

/**
 * The Leverage Line scene — a full-bleed band directly under the hero, and the
 * first appearance of the page's recurring motif, shown BEFORE the framework
 * names it so the next section pays it off (spec §7 Section 1, §8).
 *
 * WHY IT'S A BAND, NOT A STRETCHED CHART. "Full width" cannot mean scaling the
 * SVG edge to edge: an SVG's font-size is in viewBox units, so a 520-wide
 * viewBox across a 1920px screen renders its 13px labels at 48px. Instead the
 * BACKGROUND goes edge to edge and the width is filled with real content — the
 * explanation, the arithmetic and the narration on the left, the chart on the
 * right — which also uses the dead space that sat beside the old boxed chart.
 *
 * IT PLAYS AS A NARRATED SCENE. Four beats, 1200ms apart (a 3.6s run, then a
 * hold and replay), each with a plain-English line:
 *
 *   1. the headcount line draws      "you hired"
 *   2. the revenue line draws        "revenue grew at the same rate"
 *   3. THE ARITHMETIC APPEARS        30% ÷ 30% = 1.0×, the Leverage Ratio
 *   4. the third line forks upward   what one system changes
 *
 * Beat 3 was explicitly asked for: show the actual maths. The whole page is
 * built on the Leverage Ratio and the chart had never shown it being computed.
 * It lives in the left column as real HTML rather than SVG text, so it is
 * properly legible and can't collide with a curve.
 *
 * The two locked lines come from one compound-growth function given the SAME
 * target, so their paths are byte-for-byte identical — "they grow at the same
 * rate" is true by construction, not by eye. That shared path is drawn twice,
 * solid amber under dashed grey, so the dashes reveal amber through the gaps
 * and it reads as two things on one trajectory.
 *
 * Geometry note: the viewBox is sized so it renders near 1:1 in its column
 * (~640-790px). Don't change W or any font-size without recomputing
 * fontSize × (renderedPx / W) — that ratio, not taste, is what made earlier
 * versions look amateurish at 8.6px.
 */

type LineKey = 'locked' | 'breakout';
type Point = { x: number; y: number };

const LINE_CAPTIONS: Record<LineKey, string> = {
  locked: 'Headcount and revenue, locked together — every extra unit of output cost you another person. This is the 1:1 Trap.',
  breakout: 'The same team, with one system absorbing the repeatable work — output keeps compounding, payroll doesn’t.',
};

/* Sized so the SVG renders at ~1:1 inside its column (~624px on the site's
   standard 1200px container), which keeps 13px labels at ~13px on screen.
   Recompute fontSize × (renderedPx / W) before changing W or any font-size —
   that ratio, not taste, is what once rendered these labels at 8.6px. */
const W = 620;
const H = 370;
const PAD = { top: 36, right: 28, bottom: 42, left: 50 };
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

const BEATS = [
  `You hired. Headcount went up ${TARGET_PCT}% last quarter.`,
  `Revenue went up ${TARGET_PCT}% too — the exact same rate.`,
  'Divide one by the other and you get 1.0. That’s the 1:1 Trap: growth you bought with payroll.',
  'Now the same team, with one system doing the repeatable work. Output keeps climbing. Payroll doesn’t.',
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

export default function LeverageLineScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState<LineKey | null>(null);

  /* Reduced motion is derived at render, not held in state: those users just
     see the finished frame. It also keeps setState out of the effect body. */
  const shownBeat = reduced ? LAST : beat;

  useEffect(() => {
    if (reduced || !inView) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    // One timer in flight at a time; every setState sits inside a callback.
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
    // `cycle` is advanced BY this loop; including it would restart the run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  const dim = (key: LineKey) => (hovered && hovered !== key ? 0.25 : 1);
  const draw = (reached: boolean) => ({
    animate: { pathLength: reached ? 1 : 0 },
    // Forward draws over ~1s; the reset at the top of a new cycle is instant so
    // the replay doesn't read as the lines un-drawing themselves.
    transition: { duration: reached ? 1 : 0, ease: [0.16, 1, 0.3, 1] as const },
  });
  const labelIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.35, delay: reduced ? 0 : 0.9 } };

  return (
    <section className={`section-muted ${styles.band}`} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* ── Left: what it means, the maths, and the running commentary ── */}
          <div className={styles.explain}>
            <p className={styles.kicker}>What this chart shows</p>
            <p className={styles.intro}>
              Revenue up {TARGET_PCT}% last quarter. Headcount up {TARGET_PCT}% too. That&apos;s not
              leverage — that&apos;s paying for growth with people.
            </p>

            {/* Beat 3: the arithmetic, as real HTML so it's properly legible
                and can never collide with a curve. Space is reserved so the
                column doesn't jump when it appears. */}
            <div className={styles.mathCard} data-on={shownBeat >= 2 ? 'true' : undefined}>
              <span className={styles.mathEq}>{TARGET_PCT}% ÷ {TARGET_PCT}% = 1.0×</span>
              <span className={styles.mathNote}>Leverage Ratio — the 1:1 Trap</span>
            </div>

            <div className={styles.narration}>
              <div className={styles.beatDots} aria-hidden="true">
                {BEATS.map((b, i) => (
                  <span key={b} className={styles.beatDot} data-on={i <= shownBeat ? 'true' : undefined} />
                ))}
              </div>
              <p className={styles.narrationText} aria-live="polite">
                {hovered ? LINE_CAPTIONS[hovered] : BEATS[shownBeat]}
              </p>
            </div>
          </div>

          {/* ── Right: the chart itself ─────────────────────────────────── */}
          <div className={styles.chartCol}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svg}
              aria-label="Revenue and headcount growing at the same rate, and what one system changes"
            >
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={PAD.left} y1={growthToY(tick)} x2={W - PAD.right} y2={growthToY(tick)} className={styles.gridLine} />
                  <text x={PAD.left - 10} y={growthToY(tick) + 4} className={styles.tickLabel} textAnchor="end">{tick}%</text>
                </g>
              ))}

              <line x1={PAD.left} y1={plotTop - 10} x2={PAD.left} y2={plotBottom} className={styles.axisLine} />
              <line x1={PAD.left} y1={plotBottom} x2={W - PAD.right + 10} y2={plotBottom} className={styles.axisLine} />
              <text x={PAD.left - 10} y={plotTop - 16} className={styles.axisLabel} textAnchor="start">Growth</text>
              <text x={W - PAD.right + 10} y={plotBottom + 22} className={styles.axisLabel} textAnchor="end">Time →</text>

              {/* Keyed to the cycle so a replay starts from a clean frame. */}
              <g key={cycle}>
                <g style={{ opacity: dim('locked') }}>
                  <motion.path d={LOCKED_PATH} className={styles.lineHeadcount} initial={{ pathLength: 0 }} {...draw(shownBeat >= 0)} />
                  <motion.text x={LOCKED_END.x} y={LOCKED_END.y - 15} className={styles.labelHeadcount} textAnchor="end" {...labelIn}>
                    Headcount +{TARGET_PCT}%
                  </motion.text>

                  {shownBeat >= 1 && (
                    <>
                      <motion.path d={LOCKED_PATH} className={styles.lineRevenue} initial={{ pathLength: 0 }} {...draw(true)} />
                      <motion.text x={LOCKED_END.x} y={LOCKED_END.y + 22} className={styles.labelRevenue} textAnchor="end" {...labelIn}>
                        Revenue +{TARGET_PCT}%
                      </motion.text>
                    </>
                  )}
                </g>

                {shownBeat >= 3 && (
                  <>
                    <motion.circle
                      cx={BRANCH.x}
                      cy={BRANCH.y}
                      r="4"
                      className={styles.branchDot}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <g style={{ opacity: dim('breakout') }}>
                      <motion.path d={BREAKOUT_PATH} className={styles.lineBreakout} initial={{ pathLength: 0 }} {...draw(true)} />
                      <motion.text x={BREAKOUT_END.x} y={BREAKOUT_END.y - 17} className={styles.labelBreakout} textAnchor="end" {...labelIn}>
                        Same team, one system
                      </motion.text>
                    </g>
                  </>
                )}
              </g>

              {/* Wide invisible hit-areas — nobody should need pixel precision
                  to hover a 3px line. Last, so they capture the pointer. */}
              <path d={LOCKED_PATH} className={styles.hit} onMouseEnter={() => setHovered('locked')} onMouseLeave={() => setHovered(null)} />
              {shownBeat >= 3 && (
                <path d={BREAKOUT_PATH} className={styles.hit} onMouseEnter={() => setHovered('breakout')} onMouseLeave={() => setHovered(null)} />
              )}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
