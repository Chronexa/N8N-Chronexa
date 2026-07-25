'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import styles from './WorkShipped.module.css';
import LogoChip from './LogoChip';
import CountUp from './CountUp';
import { track } from '../lib/analytics';

/**
 * Client proof — rebuilt 2026-07 as a SPOTLIGHT rather than three tall cards.
 *
 * One story at a time, told the way an enterprise page tells it: outcome
 * headline + two counted stats on the left, and on the right a code-built
 * app window "running" that engagement's pipeline — real tool logos, rows
 * appearing one by one, the amber human-gate row from the engine grammar,
 * and the headline metric floating as a dark badge. Auto-rotates every 8s
 * while on screen (pauses on hover/focus, stops for good after any manual
 * navigation, off under reduced motion); prev/next arrows, dots, swipe.
 *
 * Two rules carried over from the old build:
 *   • Titles are OUTCOMES, not client names.
 *   • Every slide deep-links to its own case study (case_study_click event).
 * Slide selection rule: every slide must carry a unit-economics number or
 * structural fact (capacity, hours, volume — not speed alone, and never an
 * invented measurement), and the set must cover ops capacity, documents,
 * revenue, delivery and research. Sanity holds more case studies than we
 * surface here; regulatory intelligence was rotated out 2026-07.
 * One rule from the sitewide overhaul: nothing in the mock windows is
 * invented — steps are qualitative, numbers only where already attributed.
 */

// A stat with a string value renders as a word ("Human") instead of a count-up.
type CaseStat = { value: number | string; suffix?: string; label: string };
// A row without a logo file renders `glyph` initials — for pipeline stages that
// must stay tool-agnostic (no false attribution of a specific vendor).
type CaseRow = { file?: string; glyph?: string; name: string; text: string };
type CaseDef = {
  slug: string;
  label: string;
  client: string;
  title: string;
  body: string;
  stats: [CaseStat, CaseStat];
  window: { title: string; rows: CaseRow[]; gate: string };
  overlay: { big: string; small: string };
  grad: 'a' | 'b';
};

const CASES: CaseDef[] = [
  {
    slug: 'ai-automation-tax-workflow-cpa-case-study',
    label: 'Tax workflow · CPA firm',
    client: 'CPA firm',
    title: 'Tax-season capacity, tripled. Headcount, flat.',
    body: 'Client documents chased, classified and extracted automatically through the busiest weeks of the year — with uncertain items flagged for the CPA rather than guessed.',
    stats: [
      { value: 3, suffix: '×', label: 'documents per staff member' },
      { value: 84, suffix: '%', label: 'less client follow-up' },
    ],
    window: {
      title: 'Client intake — busy season',
      rows: [
        { file: 'gmail.svg', name: 'Gmail', text: 'K-1s and 1099s collected' },
        { file: 'gdrive.svg', name: 'Google Drive', text: 'Classified into client files' },
        { file: 'excel.svg', name: 'Excel', text: 'Fields extracted for review' },
      ],
      gate: 'CPA review queue → filed',
    },
    overlay: { big: '3×', small: 'season capacity' },
    grad: 'a',
  },
  {
    slug: 'how-reservestudy-automated-report-production-with-ai',
    label: 'Intelligent document processing · Property services',
    client: 'US property-services firm',
    title: 'Report production: three weeks to four hours.',
    body: 'Site photos, PDFs, spreadsheets and field notes — thousands of files per engagement — classified, extracted, modelled and assembled into a 50+ page client report automatically, then reviewed by an analyst before it ships. 1,200+ times a year.',
    stats: [
      { value: 85, suffix: '%', label: 'less time per report' },
      { value: 1200, suffix: '+', label: 'reports a year' },
    ],
    window: {
      title: 'Document pipeline — report run',
      rows: [
        { file: 'gdrive.svg', name: 'Google Drive', text: 'Photos, PDFs and field notes received' },
        { file: 'excel.svg', name: 'Excel', text: 'Measurements extracted and modelled' },
        { file: 'word.svg', name: 'Word', text: '50+ page report assembled' },
      ],
      gate: 'Analyst review → shipped to client',
    },
    overlay: { big: '4 hrs', small: 'was 3 weeks' },
    grad: 'b',
  },
  {
    slug: 'ai-outbound-sales-automation-personalisation-case-study',
    label: 'Sales automation · Revenue operations',
    client: 'B2B sales team',
    title: 'Five times the outreach. Zero new sales hires.',
    body: 'Every prospect researched from their real LinkedIn activity, the likely pain point mapped, and a first touch drafted in the prospect’s own register — automatically. Reps review for thirty seconds and press send. Five times the daily volume, same team.',
    stats: [
      { value: 5, suffix: '×', label: 'personalized outreach per rep' },
      { value: 78, suffix: '%', label: 'less research and drafting time' },
    ],
    window: {
      title: 'Outbound engine — daily run',
      rows: [
        { file: 'linkedin.png', name: 'LinkedIn', text: 'Posts, triggers and firmographics pulled' },
        { file: 'clay.png', name: 'Clay', text: 'Enriched into a prospect dossier' },
        { file: 'n8n.svg', name: 'n8n', text: 'First touch drafted in their register' },
      ],
      gate: 'Rep reviews 30 seconds → send',
    },
    overlay: { big: '5×', small: 'outreach per rep' },
    grad: 'a',
  },
  {
    slug: 'ai-scrum-master-sprint-operations-automation-case-study',
    label: 'Sprint operations · Product & delivery teams',
    client: 'Product engineering team',
    title: 'Sprints planned on math, tracked to the hour.',
    body: 'An AI notetaker sits in the daily standup, checks every update against Jira — done means done, hours logged, estimates versus actuals — and posts the sprint report before the meeting ends. The PM decides; the system compiles.',
    stats: [
      { value: 700, suffix: ' hrs', label: 'capacity planned — 10 devs × 7 hrs × 10 days' },
      { value: 100, suffix: '%', label: 'of tickets tracked estimate vs. actual' },
    ],
    window: {
      title: 'Sprint radar — daily standup',
      rows: [
        { glyph: 'AI', name: 'AI notetaker', text: 'Standup captured and transcribed' },
        { file: 'jira.svg', name: 'Jira', text: 'Matched: done, not done, time logged' },
        { file: 'slack.svg', name: 'Slack', text: 'Sprint report posted to the team' },
      ],
      gate: 'PM reallocates → sprint replanned',
    },
    overlay: { big: '700 hrs', small: 'planned, not guessed' },
    grad: 'b',
  },
  {
    slug: 'ai-quant-research-multi-asset-portfolio-automation',
    label: 'Quant research · Licensed investment firms',
    client: 'Licensed investment firm',
    title: 'Stocks, crypto, funds: one live book.',
    body: 'Positions pulled from every trading app into a single live view, with machine-learning models researching and back-testing signals against history. Built for licensed firms only — models advise, and the desk approves every decision.',
    stats: [
      { value: 3, suffix: '', label: 'asset classes in one live book' },
      { value: 'Human', label: 'sign-off on every decision — licensed firms only' },
    ],
    window: {
      title: 'Research desk — the live book',
      rows: [
        { glyph: 'API', name: 'Trading apps', text: 'Stocks, crypto and fund accounts connected' },
        { glyph: 'ML', name: 'Models', text: 'Signals researched, back-tested against history' },
        { glyph: 'BOOK', name: 'Live book', text: 'Exposure answered from one current view' },
      ],
      gate: 'Licensed desk approves → acted on',
    },
    overlay: { big: '3', small: 'asset classes, one book' },
    grad: 'a',
  },
];

const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={styles.tick} aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ROTATE_MS = 8000;

export default function WorkShipped() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [autoOff, setAutoOff] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const c = CASES[index];

  const go = (d: number) =>
    setState(([i]) => [(i + d + CASES.length) % CASES.length, d]);

  // Manual navigation hands control to the user for good — auto-rotate never
  // restarts and yanks the slide they chose.
  const goManual = (d: number) => {
    setAutoOff(true);
    go(d);
  };

  // Focus pause is a hard requirement, not politeness: rotating unmounts the
  // slide, and unmounting a focused link drops keyboard focus to <body>.
  useEffect(() => {
    if (reduce || autoOff || hovered || focused || !inView) return;
    const t = setInterval(() => setState(([i]) => [(i + 1) % CASES.length, 1]), ROTATE_MS);
    return () => clearInterval(t);
  }, [reduce, autoOff, hovered, focused, inView]);

  return (
    <>
      <div className={styles.head}>
        <div>
          <p className="eyebrow">Real results</p>
          <h2 className={styles.heading}>
            Work we&apos;ve <span className="accent-phrase">actually shipped.</span>
          </h2>
        </div>
        <Link href="/case-studies" className={`link-arrow ${styles.headLink}`}>
          All case studies <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div
        ref={panelRef}
        className={`panel ${styles.spotlight}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Case studies"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={c.slug}
            className={styles.slide}
            initial={reduce ? false : { opacity: 0, x: dir >= 0 ? 44 : -44 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: dir >= 0 ? -44 : 44 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) goManual(1);
              else if (info.offset.x > 70) goManual(-1);
            }}
          >
            <div className={styles.copy}>
              <span className={styles.labelChip}>{c.label}</span>
              <h3 className={styles.title}>{c.title}</h3>
              <p className={styles.body}>{c.body}</p>

              <div className={styles.stats}>
                {c.stats.map((s) => (
                  <div className={styles.stat} key={s.label}>
                    <span className={`display-num ${styles.statNum}`}>
                      {typeof s.value === 'number' ? <CountUp value={s.value} suffix={s.suffix ?? ''} /> : s.value}
                    </span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/case-studies/${c.slug}`}
                className={`link-arrow ${styles.read}`}
                onClick={() => track('case_study_click', { slug: c.slug, position: index + 1 })}
              >
                Read the full case study <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={`${styles.visual} ${c.grad === 'a' ? styles.gradA : styles.gradB}`}>
              <div className={`${styles.visualGrid} grid-texture`} aria-hidden="true" />

              <div className={styles.window} role="img" aria-label={`Simplified view of the ${c.client} pipeline`}>
                <div className={styles.windowBar} aria-hidden="true">
                  <i /><i /><i />
                  <span>{c.window.title}</span>
                </div>
                <ul className={styles.rows}>
                  {c.window.rows.map((r, i) => (
                    <motion.li
                      key={r.text}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {r.file ? (
                        <LogoChip file={r.file} name={r.name} size="sm" />
                      ) : (
                        <span className={styles.glyphChip} role="img" aria-label={r.name}>
                          {r.glyph}
                        </span>
                      )}
                      <span className={styles.rowText}>{r.text}</span>
                      <Tick />
                    </motion.li>
                  ))}
                  <motion.li
                    className={styles.gate}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + 3 * 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className={styles.gateDot} aria-hidden="true" />
                    <span className={styles.rowText}>{c.window.gate}</span>
                  </motion.li>
                </ul>
              </div>

              <motion.div
                className={styles.overlayCard}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
              >
                <span className={`display-num ${styles.overlayNum}`}>{c.overlay.big}</span>
                <span className={styles.overlaySmall}>{c.overlay.small}</span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.controls}>
          <div className={styles.dots} role="tablist" aria-label="Choose case study">
            {CASES.map((cc, i) => (
              <button
                key={cc.slug}
                type="button"
                className={i === index ? styles.dotActive : styles.dot}
                aria-label={cc.client}
                aria-current={i === index}
                onClick={() => {
                  setAutoOff(true);
                  setState([i, i > index ? 1 : -1]);
                }}
              />
            ))}
          </div>
          <div className={styles.arrows}>
            <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} aria-label="Previous case study" onClick={() => goManual(-1)}>
              <ArrowIcon />
            </button>
            <button type="button" className={styles.arrow} aria-label="Next case study" onClick={() => goManual(1)}>
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>

      <p className={styles.footnote}>Every system is custom. None of this is off-the-shelf.</p>
    </>
  );
}
