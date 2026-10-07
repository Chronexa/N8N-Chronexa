'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

/**
 * Auto-advancing tab behaviour for the solution-page hero demos.
 *
 * Same contract as the homepage players (WorkShipped, StackDiagram): the demo
 * plays itself so the hero has motion before anyone touches it, but the moment
 * the visitor picks a tab they own it for good — auto-advance never resumes and
 * starts yanking the panel out from under them. It also pauses on hover, on
 * keyboard focus and while off screen, and does not run at all for visitors who
 * have asked for reduced motion.
 */
export function useAutoCycle(count: number, intervalMs = 7000) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [takenOver, setTakenOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: '-80px' });

  const running = !reduce && !takenOver && !paused && inView;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setActive((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [running, count, intervalMs]);

  /** A deliberate choice by the visitor. Stops the carousel permanently. */
  const pick = (i: number) => {
    setTakenOver(true);
    setActive(i);
  };

  const holdProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return { ref, active, pick, running, reduce: !!reduce, intervalMs, holdProps };
}

/** Shared entrance for a panel swapping in. Matches the homepage easing. */
export const panelMotion = (reduce: boolean) => ({
  initial: reduce ? false : { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: reduce ? undefined : { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
});

/** Staggered entrance for rows inside a panel, so the run reads as work. */
export const rowMotion = (reduce: boolean, i: number) => ({
  initial: reduce ? false : { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, delay: reduce ? 0 : 0.12 + i * 0.075, ease: [0.16, 1, 0.3, 1] as const },
});
