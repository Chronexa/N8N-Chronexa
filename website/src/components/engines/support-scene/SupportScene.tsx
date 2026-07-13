'use client';

/**
 * SupportScene — the Customer Support Engine hero demo.
 *
 * NOT an app window. An open dark stage — real third-party tools (a Zendesk
 * support queue, a Zendesk live chat, a Stripe billing window, a Statuspage
 * incident window, a Slack escalation to Ahmed, a Twilio voice end-cap) enter
 * as SEPARATE bright windows, play their beat, then dock into the chain
 * connected by green threads.
 *
 * WHAT MAKES SUPPORT DISTINCT — VOLUME + one hero conversation. A persistent
 * Zendesk QUEUE sits docked top-left the whole run: many ticket rows and a
 * "Resolved today" counter that CLIMBS continuously in the background, on its
 * own timer, never pausing for the story. Meanwhile ONE ticket zooms centre-
 * stage as a live CHAT conversation (the hero artifact). That the system keeps
 * flowing while one story plays IS the synchronisation argument.
 *
 * THE SIGNATURE MOTION — BRANCH-AND-CONVERGE (shared with LegalScene). After
 * the ticket is classified and split, the orb fires TWO threads at once into a
 * Stripe window and a Statuspage window working in PARALLEL — real actions, not
 * answers — which CONVERGE back into the chat as two agent reply bubbles.
 *
 * THE AI IS THE PROTAGONIST: a persistent glowing green orb ("AI agent · Claude")
 * that physically moves to what it is doing each beat. The "Billing Agent" and
 * "Debug Agent" are facets of that one AI taking real actions in the client's
 * Stripe and status page — not separate Chronexa products.
 *
 * Movie structure: setup (Knowledge → Classify), the fan-out (Route → Resolve),
 * the trust climax (Escalate — the amber gate to a human, Ahmed), resolution
 * (Learn → wide shot, orb at the centre of the chain). Loops (~50s); rail scrubs.
 *
 * Design rule (2026-07-11): friendly, bright software — real logos, a named
 * human with a real headshot, plain English. No terminal chrome. Green (#67B035)
 * is reserved for Chronexa (orb, threads, nodes, rail); amber marks the human-
 * control moment only.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './SupportScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type WinKey = 'queue' | 'chat' | 'stripe' | 'status' | 'slack';
type Mode = 'hidden' | 'focus' | 'docked';
type NodeMode = 'hidden' | 'focus' | 'docked';
type OrbPos = 'kb' | 'chat' | 'branch' | 'resolve' | 'escalate' | 'learn' | 'wide';
type ThreadKey =
  | 'qc'
  | 'bS' | 'bT'
  | 'cvS' | 'cvT'
  | 'esc'
  | 'lrn'
  | 's1' | 's2' | 's3' | 's4' | 's5';

const STEPS = ['Knowledge', 'Classify', 'Route', 'Resolve', 'Escalate', 'Learn'] as const;

/** One caption per beat; the optional amber clause is the human-control tint. */
const CAPTIONS: { lead: string; amber?: string }[] = [
  { lead: 'Every answer is grounded in your current docs and past tickets — not a static FAQ.' },
  { lead: 'It reads, prioritises and splits every ticket in a third of a second.' },
  { lead: 'Two specialists go to work at once — one on the charge, one on the outage.' },
  { lead: 'Actions, not links — the credit is really applied; the incident is really checked.' },
  { lead: 'The 27% that need a human reach Ahmed ', amber: 'already briefed — no starting from scratch.' },
  { lead: 'Every resolution makes the next one faster — across chat, email and voice.' },
];

// 0 · KNOWLEDGE — the knowledge base that is already live
const KB_LINES = [
  '12,840 articles indexed',
  '342 resolved tickets learned from',
  'API docs v2.4 · updated 2h ago',
];

// The persistent Zendesk queue — VOLUME. One hero row, the rest flowing past.
const QUEUE_ROWS: { id: string; text: string; state: 'hero' | 'done' }[] = [
  { id: '#88421', text: 'Acme · billing + API', state: 'hero' },
  { id: '#88419', text: 'Refund status', state: 'done' },
  { id: '#88417', text: 'Reset 2FA login', state: 'done' },
  { id: '#88414', text: 'CSV export — how to', state: 'done' },
  { id: '#88410', text: 'Upgrade to Scale plan', state: 'done' },
  { id: '#88407', text: 'Webhook not firing', state: 'done' },
];

// 1 · CLASSIFY — the classification chips that pop onto the ticket
const CHIPS = ['Billing', 'Technical', 'High priority', 'Frustrated', 'Tier 1 · $8,400 ARR'];

const CUSTOMER_MSG =
  'We got charged $42 extra this month AND your API keeps timing out — this is blocking our launch.';

// 5 · LEARN — the closing card
const CLOSE_LINES = [
  'Ticket #88421 resolved · CSAT 4.7/5',
  'New pattern indexed → the next one resolves faster',
  'First-touch resolution this week: 73%',
];

const FINE_LOGOS: { src: string; alt: string }[] = [
  { src: '/logos/zendesk.png', alt: 'Zendesk' },
  { src: '/logos/intercom.png', alt: 'Intercom' },
  { src: '/logos/freshdesk.png', alt: 'Freshdesk' },
  { src: '/logos/twilio.png', alt: 'Twilio' },
  { src: '/logos/elevenlabs.png', alt: 'ElevenLabs' },
];

/**
 * Green thread paths in the 1000×620 stage space. qc pulls the hero ticket out
 * of the queue into the chat; bS/bT are the SIGNATURE fan-out — two threads
 * fired at once from the orb's branch point into the Stripe + Statuspage windows
 * working in parallel; cvS/cvT converge their real actions back into the chat as
 * two agent replies; esc carries the low-confidence thread to Ahmed; lrn files
 * the resolution into the knowledge base; s1–s5 are the wide-shot spokes
 * radiating from the orb's final centre seat.
 */
const THREAD_PATHS: { key: ThreadKey; d: string }[] = [
  { key: 'qc',  d: 'M235,250 C300,285 345,305 372,322' },  // queue → chat (pull the hero ticket)
  { key: 'bS',  d: 'M604,172 C650,182 690,194 716,204' },  // orb branch → Stripe   (fired together)
  { key: 'bT',  d: 'M600,180 C640,255 682,340 716,402' },  // orb branch → Statuspage(fired together)
  { key: 'cvS', d: 'M712,238 C640,272 560,300 516,322' },  // Stripe → chat (converge)
  { key: 'cvT', d: 'M712,402 C640,392 560,372 516,356' },  // Statuspage → chat (converge)
  { key: 'esc', d: 'M520,392 C600,430 680,460 736,478' },  // chat (debug thread) → Ahmed
  { key: 'lrn', d: 'M470,452 C600,372 740,220 826,132' },  // closed ticket → knowledge base
  { key: 's1',  d: 'M488,290 C380,275 250,262 178,256' },  // orb centre → queue
  { key: 's2',  d: 'M492,306 C470,360 464,410 460,452' },  // orb centre → chat
  { key: 's3',  d: 'M514,288 C640,240 760,170 836,128' },  // orb centre → knowledge base
  { key: 's4',  d: 'M516,300 C660,300 780,280 858,262' },  // orb centre → Stripe
  { key: 's5',  d: 'M512,308 C640,380 720,450 790,492' },  // orb centre → Ahmed
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  capIdx: number;
  // the protagonist
  orbPos: OrbPos;
  orbSay: string;
  // windows
  win: Record<WinKey, Mode>;
  // 0 · knowledge
  kbMode: NodeMode;
  kbLines: number;
  kbCount: number;
  kbNewLine: boolean;
  // 1 · classify
  heroPulled: boolean;
  typing: boolean;
  custIn: boolean;
  chips: number;
  classCaption: boolean;
  // 2/3 · route + resolve (two parallel windows, real actions)
  stripeDone: boolean;
  statusDone: boolean;
  billingReplyIn: boolean;
  billingChip: boolean;
  debugReplyIn: boolean;
  debugChip: boolean;
  // 4 · escalate (the amber human gate)
  confAppear: boolean;
  conf: number; // confidence, dips to 0.61
  handoffIn: boolean;
  ahmedIn: boolean;
  // 5 · learn
  closeIn: boolean;
  closeLines: number;
  voiceIn: boolean;
  // connective tissue + finale
  threads: Record<ThreadKey, boolean>;
  wide: boolean;
  pulse: boolean;
  receipt: boolean;
}

const NO_THREADS: Record<ThreadKey, boolean> = {
  qc: false,
  bS: false, bT: false,
  cvS: false, cvT: false,
  esc: false,
  lrn: false,
  s1: false, s2: false, s3: false, s4: false, s5: false,
};

const INITIAL: SceneState = {
  step: 0,
  capIdx: 0,
  orbPos: 'kb',
  orbSay: '',
  // the queue is present from the very start — the system is always flowing
  win: { queue: 'docked', chat: 'hidden', stripe: 'hidden', status: 'hidden', slack: 'hidden' },
  kbMode: 'hidden',
  kbLines: 0,
  kbCount: 12840,
  kbNewLine: false,
  heroPulled: false,
  typing: false,
  custIn: false,
  chips: 0,
  classCaption: false,
  stripeDone: false,
  statusDone: false,
  billingReplyIn: false,
  billingChip: false,
  debugReplyIn: false,
  debugChip: false,
  confAppear: false,
  conf: 0.86,
  handoffIn: false,
  ahmedIn: false,
  closeIn: false,
  closeLines: 0,
  voiceIn: false,
  threads: { ...NO_THREADS },
  wide: false,
  pulse: false,
  receipt: false,
};

/** Cumulative end-state per beat — lets the rail scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  // 0 · KNOWLEDGE — the KB is live and docks as the green knowledge node
  (s) => ({
    ...s,
    kbMode: 'docked', kbLines: KB_LINES.length,
    orbPos: 'kb', orbSay: '', capIdx: 0,
  }),
  // 1 · CLASSIFY — the hero ticket is pulled into the chat, read, split
  (s) => ({
    ...s,
    win: { ...s.win, chat: 'focus' },
    threads: { ...s.threads, qc: true },
    heroPulled: true, custIn: true, chips: CHIPS.length, classCaption: true,
    orbPos: 'chat', capIdx: 1,
  }),
  // 2 · ROUTE (the branch) — two windows open in parallel; two threads fired
  (s) => ({
    ...s,
    win: { ...s.win, stripe: 'focus', status: 'focus' },
    threads: { ...s.threads, qc: false, bS: true, bT: true },
    orbPos: 'branch', capIdx: 2,
  }),
  // 3 · RESOLVE — real actions land, then converge back into the chat as replies
  (s) => ({
    ...s,
    stripeDone: true, statusDone: true,
    threads: { ...s.threads, bS: false, bT: false, cvS: true, cvT: true },
    billingReplyIn: true, billingChip: true, debugReplyIn: true, debugChip: true,
    orbPos: 'resolve', capIdx: 3,
  }),
  // 4 · ESCALATE (the amber climax) — the two windows fold; Ahmed gets it briefed
  (s) => ({
    ...s,
    win: { ...s.win, stripe: 'docked', status: 'docked', slack: 'focus' },
    threads: { ...s.threads, cvS: false, cvT: false, esc: true },
    confAppear: true, conf: 0.61, handoffIn: true, ahmedIn: true,
    orbPos: 'escalate', capIdx: 4,
  }),
  // 5 · LEARN — resolution files into the KB; voice end-cap; wide shot, orb centre
  (s) => ({
    ...s,
    win: { queue: 'docked', chat: 'docked', stripe: 'docked', status: 'docked', slack: 'docked' },
    kbMode: 'docked', kbCount: 12841, kbNewLine: true,
    closeIn: true, closeLines: CLOSE_LINES.length, voiceIn: true,
    threads: { ...s.threads, esc: false, lrn: false, s1: true, s2: true, s3: true, s4: true, s5: true },
    wide: true, orbPos: 'wide', orbSay: 'Every ticket makes the next one faster.', capIdx: 5,
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SupportScene() {
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(shellRef, { amount: 0.2 });
  const reduced = useReducedMotion();

  const [s, setS] = useState<SceneState>(INITIAL);
  // The "Resolved today" counter climbs on its OWN timer — independent of the
  // beat loop, so the background queue never pauses for the story and never
  // resets when the run loops.
  const [resolved, setResolved] = useState(186);

  const timersRef = useRef<number[]>([]);
  const tokenRef = useRef(0);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /** Flying mote: files the closed ticket from the chat into the knowledge base. */
  const fly = useCallback((fromSel: string, toSel: string, text: string) => {
    const stage = stageRef.current;
    if (!stage) return;
    const from = stage.querySelector<HTMLElement>(fromSel);
    const to = stage.querySelector<HTMLElement>(toSel);
    if (!from || !to) return;
    const wr = stage.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const g = document.createElement('span');
    g.className = styles.ghost;
    g.textContent = text;
    g.style.left = `${a.left - wr.left + a.width / 2 - 40}px`;
    g.style.top = `${a.top - wr.top + a.height / 2}px`;
    stage.appendChild(g);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        g.style.transform = `translate(${b.left - a.left + (b.width - a.width) / 2}px, ${b.top - a.top + (b.height - a.height) / 2}px)`;
        g.style.opacity = '0';
      });
    });
    window.setTimeout(() => g.remove(), 800);
  }, []);

  const goTo = useCallback((start: number) => {
    stop();
    const myToken = tokenRef.current;
    const at = (ms: number, fn: () => void) => {
      timersRef.current.push(window.setTimeout(() => {
        if (tokenRef.current === myToken) fn();
      }, ms));
    };
    const patch = (p: Partial<SceneState> | ((prev: SceneState) => Partial<SceneState>)) =>
      setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));

    // Scrub: land on the cumulative state of every beat before `start`.
    let base = INITIAL;
    for (let i = 0; i < start; i++) base = APPLY[i](base);
    setS({ ...base, step: start });

    if (reduced) {
      let fin = INITIAL;
      APPLY.forEach((f) => { fin = f(fin); });
      setS({ ...fin, step: 6, receipt: true, pulse: false });
      return;
    }

    const playBeat = (i: number, done: () => void) => {
      patch({ step: i });
      if (i === 0) {
        // KNOWLEDGE (setup) — the KB is already live; the queue is already
        // flowing behind it (its counter climbs on a separate timer).
        patch({ capIdx: 0, orbPos: 'kb', orbSay: '' });
        at(200, () => patch({ kbMode: 'focus' }));
        at(550, () => patch({ orbSay: 'The knowledge base is already live — answers come from current docs, not last year’s FAQ.' }));
        KB_LINES.forEach((_, k) => at(900 + k * 460, () => patch({ kbLines: k + 1 })));
        at(2650, () => patch({ orbSay: '' }));
        at(2950, () => patch({ kbMode: 'docked', orbPos: 'kb' }));
        at(3800, done);
      } else if (i === 1) {
        // CLASSIFY — one ticket is pulled out of the flowing queue into the
        // chat, read, and split into two threads in a third of a second.
        patch({ capIdx: 1 });
        at(150, () => patch((p) => ({ win: { ...p.win, chat: 'focus' }, orbPos: 'chat', orbSay: 'Pulling this ticket out of the queue…' })));
        at(300, () => patch((p) => ({ heroPulled: true, threads: { ...p.threads, qc: true } })));
        at(800, () => patch({ typing: true, orbSay: 'Reading, prioritising, splitting…' }));
        at(1800, () => patch({ typing: false, custIn: true }));
        CHIPS.forEach((_, k) => at(2300 + k * 380, () => patch({ chips: k + 1 })));
        at(4100, () => patch({ classCaption: true, orbSay: 'Two issues, one message. Split in 0.31 seconds.' }));
        at(5100, () => patch({ orbSay: '' }));
        at(5600, done);
      } else if (i === 2) {
        // ROUTE (the branch — the SIGNATURE beat). The orb reaches the branch
        // point and fires TWO threads at once; two windows work in PARALLEL.
        patch({ capIdx: 2 });
        at(150, () => patch({ orbPos: 'branch', orbSay: 'Two specialists — at once.' }));
        at(700, () => patch((p) => ({ win: { ...p.win, stripe: 'focus', status: 'focus' } })));
        at(1000, () => patch((p) => ({ threads: { ...p.threads, qc: false, bS: true, bT: true } })));
        at(1900, () => patch({ orbSay: 'One on the charge. One on the outage.' }));
        at(3000, () => patch({ orbSay: '' }));
        at(3600, done);
      } else if (i === 3) {
        // RESOLVE — the two windows perform REAL ACTIONS, then converge back
        // into the chat as two agent replies.
        patch({ capIdx: 3 });
        at(150, () => patch({ orbPos: 'resolve', orbSay: 'Real actions — not links.' }));
        // Stripe: apply the credit (an action), then converge into the chat
        at(750, () => patch({ stripeDone: true }));
        at(1500, () => patch((p) => ({ threads: { ...p.threads, bS: false, cvS: true }, billingReplyIn: true })));
        at(2200, () => patch({ billingChip: true }));
        // Statuspage: check the live incident log, then converge into the chat
        at(1650, () => patch({ statusDone: true }));
        at(2500, () => patch((p) => ({ threads: { ...p.threads, bT: false, cvT: true }, debugReplyIn: true })));
        at(3200, () => patch({ debugChip: true }));
        at(3700, () => patch({ orbSay: 'Credit applied. Incident confirmed.' }));
        at(4800, () => patch({ orbSay: '' }));
        at(5400, done);
      } else if (i === 4) {
        // ESCALATE (the amber climax) — the Debug thread confidence dips under
        // the threshold; the two windows fold; a briefed handoff reaches Ahmed.
        patch({ capIdx: 4 });
        at(150, () => patch({ orbPos: 'escalate', orbSay: 'This one needs judgement.' }));
        at(550, () => patch((p) => ({ win: { ...p.win, stripe: 'docked', status: 'docked' } })));
        at(800, () => patch((p) => ({ win: { ...p.win, slack: 'focus' }, confAppear: true })));
        // the confidence meter dips to 0.61, under the 0.75 threshold
        for (let k = 1; k <= 14; k++) {
          const e = 1 - Math.pow(1 - k / 14, 3);
          const v = Number((0.86 - (0.86 - 0.61) * e).toFixed(2));
          at(1000 + k * 70, () => patch({ conf: v }));
        }
        at(2200, () => patch({ orbSay: 'Confidence 0.61 — below 0.75. Escalating.' }));
        at(2700, () => patch((p) => ({ threads: { ...p.threads, esc: true }, handoffIn: true })));
        at(3400, () => patch({ ahmedIn: true, orbSay: 'Ahmed picks up a briefed draft.' }));
        at(4600, () => patch({ orbSay: '' }));
        at(5200, done);
      } else if (i === 5) {
        // LEARN (resolution) — the resolution files into the KB; a voice end-cap
        // appears; then the wide shot: the orb settles at the centre of the chain.
        patch({ capIdx: 5 });
        at(150, () => patch({ orbPos: 'learn', orbSay: 'Filing what we learned.' }));
        at(400, () => patch({ closeIn: true }));
        CLOSE_LINES.forEach((_, k) => at(700 + k * 520, () => patch({ closeLines: k + 1 })));
        at(1600, () => patch((p) => ({ threads: { ...p.threads, lrn: true } })));
        at(1700, () => fly('[data-fly="closed"]', '[data-fly="kb"]', 'billing + API'));
        at(2000, () => patch({ kbCount: 12841, kbNewLine: true }));
        at(2700, () => patch({ voiceIn: true, orbSay: 'Voice too — 60% of calls, no hold time.' }));
        at(3800, () => patch({ orbSay: '' }));
        at(4100, () => patch((p) => ({
          win: { queue: 'docked', chat: 'docked', stripe: 'docked', status: 'docked', slack: 'docked' },
          wide: true, pulse: true, orbPos: 'wide' as OrbPos, orbSay: 'Every ticket makes the next one faster.',
          threads: { ...p.threads, lrn: false, s1: true, s2: true, s3: true, s4: true, s5: true },
        })));
        at(5500, done);
      } else {
        // RECEIPT
        patch({ step: 6 });
        at(400, () => patch({ receipt: true }));
        at(6600, done);
      }
    };

    const run = (i: number) => {
      if (tokenRef.current !== myToken) return;
      if (i > 6) {
        // Loop: reset to the opening state and replay from the first beat.
        timersRef.current.push(window.setTimeout(() => {
          if (tokenRef.current !== myToken) return;
          setS(INITIAL);
          run(0);
        }, 900));
        return;
      }
      playBeat(i, () => run(i + 1));
    };
    run(start);
  }, [fly, reduced, stop]);

  useEffect(() => {
    // Kick off via a timer so no state updates happen synchronously in the
    // effect body (react-hooks/set-state-in-effect).
    const id = window.setTimeout(() => {
      if (reduced || inView) goTo(0);
      else { stop(); setS(INITIAL); }
    }, 0);
    return () => { window.clearTimeout(id); stop(); };
  }, [inView, reduced, goTo, stop]);

  useEffect(() => {
    // The queue's "Resolved today" counter climbs continuously in the
    // background, on its own timer — the system keeps flowing while one story
    // plays. It never resets when the run loops. (Kick off via a timer so no
    // state update happens synchronously in the effect body.)
    if (reduced) {
      const t = window.setTimeout(() => setResolved(214), 0);
      return () => window.clearTimeout(t);
    }
    if (!inView) return;
    const id = window.setInterval(() => setResolved((r) => r + 1), 1100);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const on = (b: boolean) => (b ? 'true' : 'false');
  const cap = CAPTIONS[s.capIdx];

  return (
    <div className={styles.scene} ref={shellRef}>
      <div
        className={styles.stage}
        ref={stageRef}
        data-pulse={on(s.pulse)}
        aria-label="Customer Support Engine — live demonstration"
      >
        {/* ── Progress rail ── */}
        <div className={styles.rail} role="tablist" aria-label="Pipeline steps">
          {STEPS.map((name, i) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={s.step === i}
              className={styles.pill}
              data-state={i < s.step ? 'done' : i === s.step ? 'active' : 'idle'}
              onClick={() => goTo(i)}
            >
              {name}
            </button>
          ))}
        </div>

        <p className={styles.caption} role="status" aria-live="polite">
          <span className={styles.capDot} aria-hidden="true" />
          <span className={styles.capText}>
            {cap.lead}
            {cap.amber ? <span className={styles.capAmber}>{cap.amber}</span> : null}
          </span>
        </p>

        {/* ── The desktop: threads + the AI orb + tool windows ── */}
        <div className={styles.world} data-wide={on(s.wide)}>
          <svg className={styles.threads} viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            {THREAD_PATHS.map((t) => (
              <path key={t.key} className={styles.thread} d={t.d} data-on={on(s.threads[t.key])} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>

          {/* The protagonist: the AI agent (Claude) orb + thought bubble */}
          <div className={styles.orb} data-pos={s.orbPos}>
            <span className={styles.orbChip}>
              <span className={styles.orbDot} aria-hidden="true" />
              <span className={styles.orbName}>AI agent</span>
              <span className={styles.orbModel}>Claude</span>
            </span>
            <span className={styles.orbSay} data-on={on(s.orbSay !== '')}>
              {s.orbSay || ' '}
            </span>
          </div>

          <span className={styles.vlink} data-on="true" aria-hidden="true" />

          {/* ── The persistent Zendesk QUEUE (VOLUME) — docked the whole run ── */}
          <div className={`${styles.win} ${styles.wQueue}`} data-mode={s.win.queue}>
            <div className={styles.tbar}>
              <img src="/logos/zendesk.png" alt="Zendesk" width={18} height={18} className={styles.tlogo} />
              <span className={styles.tname}>Zendesk</span>
              <span className={styles.tsub}>support queue</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.qResolved}>
                <span className={styles.qResolvedNum}>{resolved.toLocaleString('en-US')}</span>
                <span className={styles.qResolvedLab}>resolved today<span className={styles.qArrow} aria-hidden="true"> ↑</span></span>
              </div>
              <div className={styles.qRows}>
                {QUEUE_ROWS.map((r) => (
                  <div
                    key={r.id}
                    className={styles.qRow}
                    data-state={r.state}
                    data-active={on(r.state === 'hero' && s.heroPulled)}
                  >
                    <span className={styles.qRowId}>{r.id}</span>
                    <span className={styles.qRowText}>{r.text}</span>
                    <span className={styles.qRowMark} aria-hidden="true">
                      {r.state === 'hero' ? (s.heroPulled ? '●' : '·') : '✓'}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.qMore}>+ 40 more flowing through — auto-resolving</div>
            </div>
          </div>

          {/* ── The knowledge base (green Chronexa node) ── */}
          <div className={`${styles.node} ${styles.kbNode}`} data-mode={s.kbMode} data-fly="kb">
            <span className={styles.nodeTag}>
              <img src="/logos/zendesk.png" alt="" width={11} height={11} className={styles.nodeTagLogo} aria-hidden="true" />
              Knowledge base · live
            </span>
            <div className={styles.kbInner}>
              {KB_LINES.map((line, i) => (
                <span key={line} className={styles.kbLineItem} data-in={on(i < s.kbLines)}>
                  <span className={styles.kbCheck} aria-hidden="true">{'✓'}</span>{line}
                </span>
              ))}
              <span className={styles.kbCount}>
                <b>{s.kbCount.toLocaleString('en-US')}</b> articles · always current
              </span>
              <span className={styles.kbNewLine} data-in={on(s.kbNewLine)}>New pattern indexed {'✓'}</span>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.chat !== 'hidden')} aria-hidden="true" />

          {/* ── The hero CHAT conversation (Zendesk) — the story artifact ── */}
          <div className={`${styles.win} ${styles.wChat}`} data-mode={s.win.chat}>
            <div className={styles.tbar}>
              <img src="/logos/zendesk.png" alt="Zendesk" width={18} height={18} className={styles.tlogo} />
              <span className={styles.tname}>Zendesk</span>
              <span className={styles.tsub}>live chat</span>
              {s.custIn && <span className={styles.chatTicket}>#88421</span>}
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.chatScroll}>
                {/* customer message */}
                <div className={`${styles.msg} ${styles.msgCust}`} data-in={on(s.typing || s.custIn)}>
                  <img src="/demo/customer.png" alt="Customer" width={22} height={22} className={styles.msgAvatar} />
                  <div className={styles.msgCol}>
                    <span className={styles.msgWho}>Priya · Acme SaaS</span>
                    {s.custIn ? (
                      <div className={`${styles.bubble} ${styles.bubbleCust}`}>{CUSTOMER_MSG}</div>
                    ) : (
                      <div className={`${styles.bubble} ${styles.bubbleCust} ${styles.bubbleTyping}`} aria-label="Customer is typing">
                        <span className={styles.typingDot} /><span className={styles.typingDot} /><span className={styles.typingDot} />
                      </div>
                    )}
                    {s.custIn && (
                      <div className={styles.chipsRow}>
                        {CHIPS.map((c, i) => (
                          <span key={c} className={styles.chip} data-in={on(i < s.chips)}>{c}</span>
                        ))}
                      </div>
                    )}
                    {s.classCaption && (
                      <span className={styles.classCaption}>classified in 0.31 seconds — split into two threads</span>
                    )}
                  </div>
                </div>

                {/* Billing Agent reply (Stripe action converged in) */}
                <div className={`${styles.msg} ${styles.msgAgent}`} data-in={on(s.billingReplyIn)}>
                  <div className={styles.msgCol}>
                    <span className={styles.msgWho}>
                      <span className={styles.agentDot} aria-hidden="true" />Billing Agent
                    </span>
                    <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                      You&rsquo;re right — 14,200 calls over your plan caused the $42. I&rsquo;ve applied a $42 credit — confirmed.
                    </div>
                    <span className={styles.actionChip} data-in={on(s.billingChip)}>
                      Action taken · $42 credit applied {'✓'}
                    </span>
                  </div>
                </div>

                {/* Debug Agent reply (Statuspage check converged in) */}
                <div className={`${styles.msg} ${styles.msgAgent}`} data-in={on(s.debugReplyIn)} data-fly="closed">
                  <div className={styles.msgCol}>
                    <span className={styles.msgWho}>
                      <span className={styles.agentDot} aria-hidden="true" />Debug Agent
                    </span>
                    <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                      The timeout is a known incident (#4821) — engineering is on it, ETA ~2 hours. I&rsquo;ll update you here the moment it clears.
                    </div>
                    <span className={styles.checkChip} data-in={on(s.debugChip)}>
                      checked the live incident log · 30s ago
                    </span>
                  </div>
                </div>

                {/* close card — the resolution the learning loop files away */}
                <div className={styles.closeCard} data-in={on(s.closeIn)}>
                  {CLOSE_LINES.map((line, i) => (
                    <span key={line} className={styles.closeLine} data-in={on(i < s.closeLines)}>
                      <span className={styles.closeCheck} aria-hidden="true">{'✓'}</span>{line}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.stripe !== 'hidden')} aria-hidden="true" />

          {/* ── Stripe — the Billing Agent's real action ── */}
          <div className={`${styles.win} ${styles.wStripe}`} data-mode={s.win.stripe}>
            <div className={styles.tbar}>
              <img src="/logos/stripe.png" alt="Stripe" width={18} height={18} className={styles.tlogo} />
              <span className={styles.tname}>Stripe</span>
              <span className={styles.tsub}>Billing Agent</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.toolTask} data-done={on(s.stripeDone)}>
                <span className={styles.toolSpin} aria-hidden="true" />
                <span className={styles.toolCheck} aria-hidden="true">{'✓'}</span>
                <span className={styles.toolTaskText}>
                  {s.stripeDone ? 'Account usage pulled' : 'Pulling account usage…'}
                </span>
              </div>
              <div className={styles.stripeCalc} data-in={on(s.stripeDone)}>
                <span className={styles.stripeCalcNum}>14,200</span> API calls over plan
                <span className={styles.stripeArrow} aria-hidden="true"> → </span>
                <b className={styles.stripeAmt}>$42.00 credit</b>
              </div>
              <button
                type="button"
                className={styles.stripeBtn}
                data-pressed={on(s.stripeDone)}
                tabIndex={-1}
                aria-hidden="true"
              >
                {s.stripeDone ? 'Credit applied ✓' : 'Apply credit'}
              </button>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.status !== 'hidden')} aria-hidden="true" />

          {/* ── Statuspage — the Debug Agent's live incident check ── */}
          <div className={`${styles.win} ${styles.wStatus}`} data-mode={s.win.status}>
            <div className={styles.tbar}>
              <img src="/logos/statuspage.png" alt="Statuspage" width={18} height={18} className={styles.tlogo} />
              <span className={styles.tname}>Statuspage</span>
              <span className={styles.tsub}>Debug Agent</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.toolTask} data-done={on(s.statusDone)}>
                <span className={styles.toolSpin} aria-hidden="true" />
                <span className={styles.toolCheck} aria-hidden="true">{'✓'}</span>
                <span className={styles.toolTaskText}>
                  {s.statusDone ? 'Live incident log checked' : 'Checking live incident log…'}
                </span>
              </div>
              <div className={styles.statusBody} data-in={on(s.statusDone)}>
                <div className={styles.statusRow}>
                  <span className={styles.statusK}>/v2/export</span>
                  <span className={styles.statusV}>P99 <b>2.1s</b> <i>(normal 0.4s)</i></span>
                </div>
                <div className={styles.statusIncident}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  Incident #4821 OPEN · eng aware · ETA 2h
                </div>
              </div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.slack !== 'hidden')} aria-hidden="true" />

          {/* ── Slack escalation to Ahmed — the amber human gate ── */}
          <div className={`${styles.win} ${styles.wSlack}`} data-mode={s.win.slack}>
            <div className={styles.slTop}>
              <img src="/logos/slack.png" alt="Slack" width={18} height={18} className={styles.slLogo} />
              <span className={styles.slWs}>Slack · #support-escalations</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              {/* the amber confidence gate */}
              <div className={styles.confCard} data-in={on(s.confAppear)}>
                <div className={styles.confHead}>
                  <span className={styles.confLab}>Debug Agent confidence</span>
                  <span className={styles.confNum}>{s.conf.toFixed(2)}</span>
                </div>
                <div className={styles.confMeter}>
                  <span className={styles.confThresh} aria-hidden="true" />
                  <span className={styles.confFill} style={{ width: `${s.conf * 100}%` }} data-low={on(s.conf < 0.75)} />
                </div>
                <span className={styles.confMsg}>below 0.75 threshold — escalating to a human</span>
              </div>

              {/* the briefed handoff, stapled to Ahmed */}
              <div className={styles.handoff} data-in={on(s.handoffIn)}>
                <div className={styles.handoffRow}>
                  <img src="/demo/ahmed.png" alt="Ahmed" width={26} height={26} className={styles.handoffAvatar} />
                  <div className={styles.handoffWho}>
                    <span className={styles.handoffName}>→ Ahmed · Tier 2</span>
                    <span className={styles.handoffMeta}>SLA 4 hrs</span>
                  </div>
                </div>
                <div className={styles.staple}>
                  <span className={styles.stapleLab}>Packaged</span>
                  <span className={styles.stapleItem}>full thread</span>
                  <span className={styles.stapleItem}>draft reply</span>
                  <span className={styles.stapleItem}>KB articles</span>
                  <span className={styles.stapleItem}>live system data</span>
                </div>
                <p className={styles.ahmedLine} data-in={on(s.ahmedIn)}>
                  Ahmed picks up a briefed draft — the customer never repeats themselves.
                </p>
              </div>
            </div>
          </div>

          {/* ── Voice end-cap (Twilio) ── */}
          <div className={styles.voiceCap} data-in={on(s.voiceIn)}>
            <img src="/logos/twilio.png" alt="Twilio" width={16} height={16} className={styles.voiceLogo} />
            <span className={styles.voiceText}>Voice too — <b>60%</b> of calls resolved, no hold time.</span>
          </div>
        </div>

        {/* ── Receipt overlay ── */}
        <div className={styles.receipt} data-show={on(s.receipt)}>
          <div className={styles.receiptCard}>
            <p className={styles.receiptKicker}>This ticket, start to finish</p>
            <p className={styles.receiptTitle}>First response in 8 seconds. Resolved with real actions.</p>
            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}><span>First response</span><b className={styles.receiptHl}>8 sec</b></div>
              <div className={styles.receiptRow}><span>Resolved without a human</span><b className={styles.receiptHl}>73%</b></div>
              <div className={styles.receiptRow}><span>Real actions taken</span><b>credit + incident check</b></div>
              <div className={styles.receiptRow}><span>Escalations arrive briefed</span><b className={styles.receiptHl}>100%</b></div>
              <div className={styles.receiptRow}><span>CSAT</span><b>4.7/5</b></div>
            </div>
            <BookButton className={styles.receiptCta} location="customer-support-engine-scene-receipt">
              Run a week of your tickets →
            </BookButton>
            <span className={styles.receiptFine}>
              <span className={styles.fineLogos}>
                {FINE_LOGOS.map((l) => (
                  <img key={l.src} src={l.src} alt={l.alt} width={14} height={14} />
                ))}
              </span>
              We replay your historical tickets and show you what would have resolved, what would have escalated, and your first-touch rate.
            </span>
          </div>
        </div>
      </div>

      <p className={styles.orchNote}>
        Chronexa doesn&rsquo;t sell an AI or a chatbot. We orchestrate Claude with the tools you already run —
        Zendesk, Stripe, your status page — so most tickets resolve themselves and your team only sees the ones that need them.
      </p>
      <p className={styles.hint}>Click a step above to jump · the run loops on its own</p>
    </div>
  );
}
