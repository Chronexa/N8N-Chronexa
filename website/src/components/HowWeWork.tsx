'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import styles from './HowWeWork.module.css';

/**
 * The process, as a horizontal connected pipeline rather than a vertical list.
 *
 * This is the first section rebuilt in the "less vertical, more shown" direction
 * (2026-07): four stages laid left-to-right on a green thread that draws in on
 * scroll, each stage a card with its own glyph and the concrete artifact the
 * client walks away with. It reuses the engine scenes' grammar on purpose —
 * nodes joined by a thread — so the way we draw our method matches the way we
 * draw our product. On mobile it folds to a vertical thread down the left.
 *
 * Copy is deliberately condensed from the old paragraph-per-step version; the
 * "You keep / approve / own / track" chip carries the concrete outcome so the
 * section is scannable, not read.
 */

type Step = {
  n: string;
  title: string;
  body: string;
  artifactLabel: string;
  /** 'amber' marks the human-decision step — the same code the engine scenes use. */
  artifactTone?: 'amber';
  artifact: string;
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  {
    n: '01',
    title: 'We audit before we build',
    body: 'We map how the work actually gets done — every tool, handoff and manual step — and find where the time leaks. It is almost never where people expect.',
    artifactLabel: 'You keep',
    artifact: 'A roadmap — free',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),
  },
  {
    n: '02',
    title: 'You get a fixed price first',
    body: 'A written scope — deliverables, success metrics, integration points, the price. You approve it before we write a line. No hourly billing, no surprises.',
    artifactLabel: 'You approve',
    artifactTone: 'amber' as const,
    artifact: 'A fixed-price scope',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 15l2 2 4-4" />
      </>
    ),
  },
  {
    n: '03',
    title: 'We build what fits your stack',
    body: 'n8n, custom code, or both — the technology follows the problem. Then it runs on your real data, with the edge cases handled, before it touches live work.',
    artifactLabel: 'You own',
    artifact: 'A system on your stack',
    icon: (
      <>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="M7.6 7.4 11 16M16.4 7.4 13 16M8 6h8" />
      </>
    ),
  },
  {
    n: '04',
    title: 'We deploy, measure, and stay',
    body: 'Live with documentation, training and weekly ROI reporting. Then we keep going — the first build unlocks capacity, the next one multiplies it.',
    artifactLabel: 'You track',
    artifact: 'Weekly ROI, in writing',
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 14l3-3 3 3 5-6" />
      </>
    ),
  },
];

export default function HowWeWork() {
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, margin: '-120px' });
  const reduce = useReducedMotion();
  const animate = inView && !reduce;

  return (
    <>
      <p className="eyebrow">How we work</p>
      <h2 className={styles.heading}>
        We don&apos;t build automation.<br />
        We build AI infrastructure — and we stay.
      </h2>
      <p className={styles.sub}>
        Four stages, in this order, on every engagement. The first is free and the second is fixed,
        so you know the cost and the target before anything is committed.
      </p>

      <div className={styles.track} ref={trackRef}>
        {/* The connecting thread — draws left→right on scroll (vertical on mobile),
            the same node/thread language the engine demo uses. */}
        <svg className={styles.wire} viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
          <motion.line
            x1="0" y1="1" x2="100" y2="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animate ? 1 : reduce ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <motion.li
              className={styles.step}
              key={s.n}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={animate ? { opacity: 1, y: 0 } : reduce ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.node}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={styles.glyph}>
                  {s.icon}
                </svg>
              </div>

              <div className={styles.card}>
                <span className={styles.num}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
                <span className={`${styles.artifact} ${s.artifactTone === 'amber' ? styles.artifactAmber : ''}`}>
                  <span className={styles.artifactLabel}>{s.artifactLabel}</span>
                  {s.artifact}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <p className={styles.callout}>
        We measure the same three things every time: time recovered, capacity added, and cost per
        unit of work. <strong>Not AI hype. Unit economics.</strong>
      </p>
    </>
  );
}
