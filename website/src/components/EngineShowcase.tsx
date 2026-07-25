'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ComponentType } from 'react';
import styles from './EngineShowcase.module.css';
import { ENGINE_ROADMAP, type RoadmapItem } from './engines/engines-data';
import { track } from '../lib/analytics';

/**
 * The homepage engine demo — "show the working thing" rather than claim it.
 *
 * Performance is the whole design constraint here. Each scene is a 700–900 line
 * client component with its own motion timeline, so the rules are:
 *   1. Nothing loads until the section is actually near the viewport
 *      (IntersectionObserver with rootMargin, so the chunk is in flight just
 *      before the user arrives rather than on first paint).
 *   2. Only the SELECTED scene is ever mounted. Switching tabs unmounts the
 *      previous one, so we pay for one scene, never six.
 *   3. The stage reserves its height up front, so a scene arriving late can't
 *      shift the page (CLS).
 *
 * The scenes already handle their own `useInView` pausing and `useReducedMotion`,
 * so there is no motion work to do here — only mounting discipline.
 *
 * The CPA scene is final and must not be edited; this only mounts it.
 */

const SCENES: Record<string, ComponentType> = {
  'Document Intelligence Engine': dynamic(() => import('./engines/docintel-scene/DocIntelScene'), { ssr: false }),
  'Sales Engine': dynamic(() => import('./engines/sales-scene/SalesScene'), { ssr: false }),
  'CPA & Tax Engine': dynamic(() => import('./engines/cpa-scene/CpaTaxScene'), { ssr: false }),
  'Legal & Regulatory Engine': dynamic(() => import('./engines/legal-scene/LegalScene'), { ssr: false }),
  'Investment Research Engine': dynamic(() => import('./engines/invest-scene/InvestScene'), { ssr: false }),
  'Customer Support Engine': dynamic(() => import('./engines/support-scene/SupportScene'), { ssr: false }),
};

/** Short tab labels — the full names are too long to sit in a row. */
const TAB_LABEL: Record<string, string> = {
  'Document Intelligence Engine': 'Documents',
  'Sales Engine': 'Sales',
  'CPA & Tax Engine': 'CPA & Tax',
  'Legal & Regulatory Engine': 'Legal',
  'Investment Research Engine': 'Investment',
  'Customer Support Engine': 'Support',
};

/** One plain-English line per engine — what it does, no jargon. */
const TAB_BLURB: Record<string, string> = {
  'Document Intelligence Engine': 'Ask a plain-language question of every document your business runs on, and get an answer cited to the exact page.',
  'Sales Engine': 'Finds the right buyers, researches each one, drafts the outreach with a real reason attached — and holds every send for your approval.',
  'CPA & Tax Engine': 'Ingests every client document, extracts the fields, and hands your CPA a reviewer-ready return with the uncertain items flagged rather than guessed.',
  'Legal & Regulatory Engine': 'Matches regulatory changes to live matters the day they publish, captures AI-tool time into billing, and feeds closed matters back into knowledge.',
  'Investment Research Engine': 'Unifies the book across every custodian, runs your own models on live data, and turns what the PM approves into logged orders.',
  'Customer Support Engine': 'Answers email, chat and voice from your own knowledge base and live system data — and escalates with full context when it is not confident.',
};

/** Order shown left to right. Documents leads: it is the one that applies to almost everyone. */
const ORDER = [
  'Document Intelligence Engine',
  'Sales Engine',
  'CPA & Tax Engine',
  'Legal & Regulatory Engine',
  'Investment Research Engine',
  'Customer Support Engine',
];

const ENGINES: (RoadmapItem & { href: string })[] = ORDER
  .map((name) => ENGINE_ROADMAP.find((e) => e.name === name))
  .filter((e): e is RoadmapItem & { href: string } => !!e && e.status === 'live' && !!e.href);

export default function EngineShowcase() {
  const [active, setActive] = useState(ENGINES[0]?.name ?? '');
  const [armed, setArmed] = useState(false); // has the section come near the viewport yet?
  const stageRef = useRef<HTMLDivElement>(null);
  const seen = useRef<Set<string>>(new Set());

  // Arm on approach, then stop observing — the scenes handle their own in-view
  // pausing from here, so we only need the one-shot "start loading" signal.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    // Safety net for anything without IntersectionObserver: arm on the next tick
    // rather than synchronously, so we don't trigger a cascading render.
    if (typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setArmed(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setArmed(true); io.disconnect(); }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Count a scene view once per engine per session.
  useEffect(() => {
    if (!armed || !active || seen.current.has(active)) return;
    seen.current.add(active);
    track('engine_scene_view', { engine: active });
  }, [armed, active]);

  const Scene = armed ? SCENES[active] : undefined;
  const current = ENGINES.find((e) => e.name === active);

  return (
    <>
      <div className={styles.head}>
        <p className="eyebrow">Built, running, and watchable</p>
        <h2 className={styles.heading}>Six engines we&apos;ve already built. Watch one run.</h2>
        <p className={styles.sub}>
          An engine is a connected set of AI agents that runs a whole workflow end to end —
          pulling from your tools, reasoning over the data, doing the work, and stopping for a
          human wherever you want it to. These are the ones we&apos;ve built so far.
        </p>
      </div>

      <div className={`seg-tabs ${styles.tabs}`} role="tablist" aria-label="AI engines">
        {ENGINES.map((e) => {
          const selected = e.name === active;
          return (
            <button
              key={e.name}
              type="button"
              role="tab"
              id={`engine-tab-${e.href.split('/').pop()}`}
              aria-selected={selected}
              aria-controls="engine-stage"
              className="seg-tab"
              onClick={() => {
                setActive(e.name);
                track('engine_tab_select', { engine: e.name });
              }}
            >
              {TAB_LABEL[e.name] ?? e.name}
            </button>
          );
        })}
      </div>

      {/* The demo runs inside window chrome — product framing, not a floating
          rectangle. The blurb is the window's caption bar, so it stops being a
          paragraph hovering in space (and the min-height wobble goes with it). */}
      <div className={styles.frame}>
        <div className={styles.frameBar}>
          <span className={styles.frameDots} aria-hidden="true"><i /><i /><i /></span>
          <span className={styles.frameTitle}>{current ? `${current.name} — live demo` : 'Engine demo'}</span>
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} aria-hidden="true" />
            Live
          </span>
        </div>
        {current && (
          <p className={styles.frameCaption} key={current.name}>
            {TAB_BLURB[current.name]}
          </p>
        )}
        {/* Height is reserved whether or not a scene has arrived — no layout shift. */}
        <div
          className={styles.stage}
          id="engine-stage"
          role="tabpanel"
          aria-live="polite"
          ref={stageRef}
        >
          {Scene ? <Scene key={active} /> : <div className={styles.placeholder} aria-hidden="true" />}
        </div>
      </div>

      {current && (
        <p className={styles.more}>
          <Link href={current.href} className="link-arrow">
            See how the {current.name} works <span aria-hidden="true">→</span>
          </Link>
          <Link href="/ai-engines" className={styles.allLink}>
            All six engines
          </Link>
        </p>
      )}
    </>
  );
}
