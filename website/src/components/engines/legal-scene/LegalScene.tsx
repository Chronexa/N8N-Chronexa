'use client';

/**
 * LegalScene — the Legal & Regulatory Engine hero demo.
 *
 * NOT an app window. An open dark stage — real third-party tools (an SEC EDGAR
 * regulatory feed, an iManage matter wall, a precedent search, a Word memo, an
 * Elite 3E billing meter, an Outlook client alert) enter as SEPARATE bright
 * windows, play their beat, then dock into the chain connected by green threads.
 *
 * THE SIGNATURE MOTION — BRANCH-AND-CONVERGE. Every other engine is a linear
 * chain. Legal is not. After the regulatory match, the orb fires THREE threads
 * at once and THREE windows (precedents, memo, billing) work in PARALLEL at the
 * same time — three days of sequential human work collapsed into ~4 synchronised
 * minutes. Then all three CONVERGE into one Outlook approval that waits for a
 * partner. That visible parallelism IS the argument.
 *
 * ATTRIBUTION (client mandate — the whole point): Chronexa owns neither an AI
 * nor a legal database. The protagonist orb is labelled "AI agent · Claude" —
 * the precedent search, matter-matching and drafting are Claude reasoning. The
 * tools (iManage, Word, Elite 3E, Outlook) are the firm's own systems.
 *
 * THE DEVICE — THE CLOCK: a scripted timestamp chip that jumps 09:02 → 09:06
 * while the run does three days of work; "the old way: day 3" sits beneath it.
 * Scripted state only — never real time.
 *
 * Movie structure: setup (Watch → Match), the fan-out (Work), the trust climax
 * (Approve — the amber gate for Partner Shah), the payoff (Alert), resolution
 * (Learn → wide shot, orb at the centre of the chain). Loops (~52s); rail scrubs.
 *
 * Design rule (2026-07-11): friendly, bright software — real logos, a named
 * partner with a real headshot, plain English, a serif accent for the legal
 * register. No terminal chrome. Green (#67B035) is reserved for Chronexa (orb,
 * threads, nodes, rail); amber marks the human-control moments only.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './LegalScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type WinKey = 'sec' | 'imanage' | 'precedents' | 'word' | 'billing' | 'outlook';
type Mode = 'hidden' | 'focus' | 'trio' | 'converge' | 'docked';
type NodeMode = 'hidden' | 'focus' | 'docked';
type OrbPos = 'watch' | 'match' | 'branch' | 'approve' | 'alert' | 'learn' | 'wide';
type ThreadKey =
  | 't0'
  | 'bA' | 'bB' | 'bC'
  | 'cvA' | 'cvB' | 'cvC'
  | 'out1' | 'out2'
  | 'lrn'
  | 's1' | 's2' | 's3' | 's4' | 's5';

const STEPS = ['Watch', 'Match', 'Work', 'Approve', 'Alert', 'Learn'] as const;

/** Scripted timestamp per beat — this is state, not real time. */
const CLOCKS = ['09:02', '09:02', '09:05', '09:06', '09:06', '09:06'] as const;

/** One caption per beat; the optional amber clause is the human-control tint. */
const CAPTIONS: { lead: string; amber?: string }[] = [
  { lead: 'It watches every regulator so a paralegal doesn’t have to — and catches the release the moment it publishes.' },
  { lead: 'It cross-references the release against 500+ active matters in seconds — and flags who’s exposed.' },
  { lead: 'Then it does three days of work at once: your own precedents, the memo in your voice, and the billable time — automatically.' },
  { lead: 'Nothing goes to a client on autopilot. ', amber: 'A partner approves every word — here, that took one click.' },
  { lead: 'Your client hears it from you first — in minutes, not three days.' },
  { lead: 'Every release and memo makes the next search better — knowledge that never leaves when a partner does.' },
];

// 0 · WATCH — the watched regulator feeds (chips marked "Live")
const FEED_CHIPS: { src: string; alt: string }[] = [
  { src: '/logos/sec.png', alt: 'SEC EDGAR' },
  { src: '/logos/sebi.png', alt: 'SEBI' },
  { src: '/logos/rbi.png', alt: 'RBI' },
  { src: '/logos/fedregister.png', alt: 'Federal Register' },
];
const QUIET = [
  'Federal Register — routine notice · no action',
  'SEBI — circular update · out of scope',
  'RBI — no change to watched rules',
];

// 1 · MATCH — the matters that illuminate on the iManage wall
const MATTERS: { text: string; amber: boolean }[] = [
  { text: '#4472 · exec trading plan · Shah', amber: false },
  { text: '#4509 · Rule 10b5-1 setup · Lee', amber: false },
  { text: '+5 more matters exposed', amber: false },
  { text: '2 pending filings — put on hold automatically', amber: true },
];

// 2 · WORK · Window A — precedents (the firm's own memory surfaced)
const PRECEDENTS: { title: string; sub: string; own: boolean }[] = [
  { title: 'Salman v. United States (2016)', sub: 'tipper-tippee liability', own: false },
  { title: 'Your own 2022 10b5-1 guidance memo', sub: 'surfaced from the archive', own: true },
  { title: 'Prior matter #3841', sub: 'same client, same issue (2023)', own: false },
];

// 2 · WORK · Window B — the memo sections that check on, line by line
const MEMO_ROWS = [
  'The change, in plain English',
  '7 affected matters, by partner',
  'Relevant precedents (12)',
  '3 numbered action items',
];

const FINE_LOGOS: { src: string; alt: string }[] = [
  { src: '/logos/imanage.png', alt: 'iManage' },
  { src: '/logos/thomsonreuters.png', alt: 'Elite 3E' },
  { src: '/logos/clio.png', alt: 'Clio' },
  { src: '/logos/netdocuments.png', alt: 'NetDocuments' },
  { src: '/logos/outlook.png', alt: 'Outlook' },
];

/**
 * Green thread paths in the 1000×620 stage space. t0 links the release into the
 * matter wall; bA/bB/bC are the SIGNATURE fan-out — three threads fired at once
 * from the orb's branch point into the three parallel windows; cvA/cvB/cvC are
 * the convergence into the Outlook approval; out1/out2 are the client alerts
 * departing; lrn files the release into the knowledge base; s1–s5 are the wide-
 * shot spokes radiating from the orb's final centre seat.
 */
const THREAD_PATHS: { key: ThreadKey; d: string }[] = [
  { key: 't0',  d: 'M155,162 C250,220 380,300 460,335' },  // SEC (docked) → iManage matter wall
  { key: 'bA',  d: 'M492,184 C420,240 300,300 200,352' },  // orb branch → precedents  (fired together)
  { key: 'bB',  d: 'M500,188 C500,250 500,310 500,362' },  // orb branch → memo        (fired together)
  { key: 'bC',  d: 'M508,184 C580,240 700,300 800,352' },  // orb branch → billing     (fired together)
  { key: 'cvA', d: 'M180,185 C260,270 400,340 468,362' },  // precedents → Outlook  (converge)
  { key: 'cvB', d: 'M500,160 C500,240 500,300 500,346' },  // memo       → Outlook  (converge)
  { key: 'cvC', d: 'M820,185 C740,270 600,340 532,362' },  // billing    → Outlook  (converge)
  { key: 'out1', d: 'M560,362 C700,350 830,325 940,300' }, // Outlook → client alert 1
  { key: 'out2', d: 'M560,382 C700,395 830,420 940,440' }, // Outlook → client alert 2
  { key: 'lrn', d: 'M735,255 C650,290 560,320 520,338' },  // orb → knowledge base node
  { key: 's1',  d: 'M488,286 C400,250 250,175 150,152' },  // orb centre → SEC
  { key: 's2',  d: 'M480,296 C380,320 220,338 128,344' },  // orb centre → iManage
  { key: 's3',  d: 'M514,286 C640,250 780,175 860,158' },  // orb centre → memo
  { key: 's4',  d: 'M518,300 C640,325 800,340 878,348' },  // orb centre → billing
  { key: 's5',  d: 'M512,306 C620,390 690,470 722,516' },  // orb centre → Outlook
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  capIdx: number;
  clock: string;
  // the protagonist
  orbPos: OrbPos;
  orbSay: string;
  // windows
  win: Record<WinKey, Mode>;
  // 0 · watch
  feedsLive: number;
  quietIn: number;
  releaseIn: boolean;
  // 1 · match
  matterIn: number;
  // 2 · work (three windows, concurrent)
  precIn: number;
  precFoot: boolean;
  memoTitleIn: boolean;
  memoDone: number;
  stampIn: boolean;
  billMeter: number; // 0–100, displayed as hrs
  billNote: boolean;
  // 3 · approve
  alertDraftIn: boolean;
  approveWait: boolean;
  approved: boolean;
  // 4 · alert
  sentOut: number;
  deliveredIn: boolean;
  compareIn: boolean;
  // 5 · learn (green knowledge node)
  kbMode: NodeMode;
  kbCount: number;
  kbLine: boolean;
  // connective tissue + finale
  threads: Record<ThreadKey, boolean>;
  wide: boolean;
  pulse: boolean;
  receipt: boolean;
}

const NO_THREADS: Record<ThreadKey, boolean> = {
  t0: false,
  bA: false, bB: false, bC: false,
  cvA: false, cvB: false, cvC: false,
  out1: false, out2: false,
  lrn: false,
  s1: false, s2: false, s3: false, s4: false, s5: false,
};

const INITIAL: SceneState = {
  step: 0,
  capIdx: 0,
  clock: '09:02',
  orbPos: 'watch',
  orbSay: '',
  win: { sec: 'hidden', imanage: 'hidden', precedents: 'hidden', word: 'hidden', billing: 'hidden', outlook: 'hidden' },
  feedsLive: 0,
  quietIn: 0,
  releaseIn: false,
  matterIn: 0,
  precIn: 0,
  precFoot: false,
  memoTitleIn: false,
  memoDone: 0,
  stampIn: false,
  billMeter: 0,
  billNote: false,
  alertDraftIn: false,
  approveWait: false,
  approved: false,
  sentOut: 0,
  deliveredIn: false,
  compareIn: false,
  kbMode: 'hidden',
  kbCount: 0,
  kbLine: false,
  threads: { ...NO_THREADS },
  wide: false,
  pulse: false,
  receipt: false,
};

/** Cumulative end-state per beat — lets the rail scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  // 0 · WATCH — the feed window up, feeds Live, the bulletin caught
  (s) => ({
    ...s,
    clock: CLOCKS[0],
    win: { ...s.win, sec: 'focus' },
    feedsLive: FEED_CHIPS.length, quietIn: QUIET.length, releaseIn: true,
    orbPos: 'watch', orbSay: '', capIdx: 0,
  }),
  // 1 · MATCH — SEC docks, iManage up, 7 matters lit, 2 filings on hold
  (s) => ({
    ...s,
    clock: CLOCKS[1],
    win: { ...s.win, sec: 'docked', imanage: 'focus' },
    matterIn: MATTERS.length,
    threads: { ...s.threads, t0: true },
    orbPos: 'match', capIdx: 1,
  }),
  // 2 · WORK — iManage docks; three windows work in PARALLEL; three threads fired
  (s) => ({
    ...s,
    clock: CLOCKS[2],
    win: { ...s.win, imanage: 'docked', precedents: 'trio', word: 'trio', billing: 'trio' },
    threads: { ...s.threads, t0: false, bA: true, bB: true, bC: true },
    precIn: PRECEDENTS.length, precFoot: true,
    memoTitleIn: true, memoDone: MEMO_ROWS.length, stampIn: true,
    billMeter: 100, billNote: true,
    orbPos: 'branch', capIdx: 2,
  }),
  // 3 · APPROVE — the three converge into Outlook; Partner Shah signs
  (s) => ({
    ...s,
    clock: CLOCKS[3],
    win: { ...s.win, precedents: 'converge', word: 'converge', billing: 'converge', outlook: 'focus' },
    threads: { ...s.threads, bA: false, bB: false, bC: false, cvA: true, cvB: true, cvC: true },
    alertDraftIn: true, approveWait: false, approved: true,
    orbPos: 'approve', capIdx: 3,
  }),
  // 4 · ALERT — the two client alerts depart; comparison chip lands
  (s) => ({
    ...s,
    clock: CLOCKS[4],
    threads: { ...s.threads, cvA: false, cvB: false, cvC: false, out1: true, out2: true },
    sentOut: 2, deliveredIn: true, compareIn: true,
    orbPos: 'alert', capIdx: 4,
  }),
  // 5 · LEARN — release files into the knowledge base; wide shot, orb centred
  (s) => ({
    ...s,
    clock: CLOCKS[5],
    win: {
      sec: 'docked', imanage: 'docked', precedents: 'docked',
      word: 'docked', billing: 'docked', outlook: 'docked',
    },
    kbMode: 'docked', kbCount: 4218, kbLine: true,
    threads: {
      ...s.threads, out1: false, out2: false, lrn: false,
      s1: true, s2: true, s3: true, s4: true, s5: true,
    },
    wide: true, orbPos: 'wide', orbSay: 'Four minutes. Not three days.', capIdx: 5,
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LegalScene() {
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(shellRef, { amount: 0.2 });
  const reduced = useReducedMotion();

  const [s, setS] = useState<SceneState>(INITIAL);

  const timersRef = useRef<number[]>([]);
  const tokenRef = useRef(0);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /** Flying chip: files the release from the SEC feed into the knowledge base. */
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
        // WATCH (setup) — the feeds wake; routine items tick past; then the
        // release lands highlighted the moment it publishes.
        patch({ capIdx: 0, clock: CLOCKS[0], orbPos: 'watch', orbSay: '' });
        at(200, () => patch((p) => ({ win: { ...p.win, sec: 'focus' } })));
        FEED_CHIPS.forEach((_, k) => at(500 + k * 200, () => patch({ feedsLive: k + 1 })));
        QUIET.forEach((_, k) => at(900 + k * 420, () => patch({ quietIn: k + 1 })));
        at(2500, () => patch({ releaseIn: true, orbPos: 'watch', orbSay: 'New SEC release — is any live matter exposed?' }));
        at(5000, done);
      } else if (i === 1) {
        // MATCH — SEC docks; the iManage matter wall lights up; 2 filings held.
        patch({ capIdx: 1, clock: CLOCKS[1] });
        at(150, () => patch((p) => ({
          win: { ...p.win, sec: 'docked', imanage: 'focus' },
          threads: { ...p.threads, t0: true },
        })));
        at(650, () => patch({ orbPos: 'match', orbSay: 'Seven matters. Two filings I’ll pause until a partner looks.' }));
        at(1150, () => patch({ matterIn: 1 }));
        at(1550, () => patch({ matterIn: 2 }));
        at(1950, () => patch({ matterIn: 3 }));
        at(2500, () => patch({ matterIn: 4 })); // the amber "on hold" row
        at(5000, done);
      } else if (i === 2) {
        // WORK (the fan-out — the SIGNATURE beat). The orb reaches the branch
        // point and fires THREE threads at once; three windows work in PARALLEL.
        patch({ capIdx: 2, clock: '09:03' });
        at(150, () => patch((p) => ({
          win: { ...p.win, imanage: 'docked', precedents: 'trio', word: 'trio', billing: 'trio' },
        })));
        at(600, () => patch({ orbPos: 'branch', orbSay: 'Precedents, memo and the billing entry — all at once.' }));
        // fire all three branch threads TOGETHER — the visible parallelism
        at(950, () => patch((p) => ({ threads: { ...p.threads, bA: true, bB: true, bC: true } })));
        // Window A · precedents — rows land
        at(1300, () => patch({ precIn: 1 }));
        at(1700, () => patch({ precIn: 2 }));
        at(2100, () => patch({ precIn: 3 }));
        at(2500, () => patch({ precFoot: true }));
        // Window B · memo — sections check on (SAME time window as A and C)
        at(1400, () => patch({ memoTitleIn: true }));
        at(1650, () => patch({ memoDone: 1 }));
        at(2000, () => patch({ memoDone: 2 }));
        at(2350, () => patch({ memoDone: 3 }));
        at(2700, () => patch({ memoDone: 4 }));
        at(3050, () => patch({ stampIn: true }));
        // Window C · billing — the meter counts (SAME time window as A and B)
        for (let k = 1; k <= 20; k++) at(1500 + k * 75, () => patch({ billMeter: Math.round((100 * k) / 20) }));
        at(3050, () => patch({ billNote: true, clock: '09:05' }));
        at(3500, () => patch({ orbSay: 'Three days of work — in parallel.' }));
        at(4600, done);
      } else if (i === 3) {
        // APPROVE (the trust climax) — the three CONVERGE into Outlook; the amber
        // gate holds; then Partner Shah approves in one click.
        patch({ capIdx: 3, clock: CLOCKS[3] });
        at(150, () => patch((p) => ({
          win: { ...p.win, precedents: 'converge', word: 'converge', billing: 'converge' },
          threads: { ...p.threads, bA: false, bB: false, bC: false, cvA: true, cvB: true, cvC: true },
        })));
        at(700, () => patch((p) => ({ win: { ...p.win, outlook: 'focus' }, orbPos: 'approve', orbSay: 'Drafting the client alert — then stopping.' })));
        at(1300, () => patch({ alertDraftIn: true }));
        at(1900, () => patch({ approveWait: true, orbSay: '' })); // amber gate holds ~2.5s
        at(4400, () => patch({ approveWait: false, approved: true }));
        at(4900, () => patch({ orbSay: 'A partner approved every word.' }));
        at(5900, done);
      } else if (i === 4) {
        // ALERT (the payoff) — the two client alerts depart; the comparison lands.
        patch({ capIdx: 4, clock: CLOCKS[4] });
        at(200, () => patch((p) => ({ threads: { ...p.threads, cvA: false, cvB: false, cvC: false } })));
        at(500, () => patch({ orbPos: 'alert', orbSay: 'Your client hears it from you — first.' }));
        at(900, () => patch((p) => ({ threads: { ...p.threads, out1: true } })));
        at(1100, () => patch({ sentOut: 1 }));
        at(1300, () => patch((p) => ({ threads: { ...p.threads, out2: true } })));
        at(1500, () => patch({ sentOut: 2 }));
        at(2100, () => patch({ deliveredIn: true }));
        at(2800, () => patch({ compareIn: true, orbSay: '' }));
        at(4000, done);
      } else if (i === 5) {
        // LEARN (resolution) — the release files into the knowledge base; then
        // the wide shot: the orb settles at the centre of the chain it built.
        patch({ capIdx: 5, clock: CLOCKS[5] });
        at(150, () => patch((p) => ({
          win: { ...p.win, outlook: 'docked' },
          threads: { ...p.threads, out1: false, out2: false },
        })));
        at(600, () => patch({ kbMode: 'focus', orbPos: 'learn', orbSay: 'Filed. The firm just got smarter.' }));
        at(900, () => patch((p) => ({ threads: { ...p.threads, lrn: true } })));
        at(1000, () => fly('[data-fly="release"]', '[data-fly="kb"]', 'SEC 33-11138'));
        for (let k = 1; k <= 18; k++) {
          const e = 1 - Math.pow(1 - k / 18, 3);
          const v = Math.round(4200 + 18 * e);
          at(1200 + k * 60, () => patch({ kbCount: v }));
        }
        at(2500, () => patch({ kbLine: true }));
        at(3300, () => patch((p) => ({
          win: {
            sec: 'docked', imanage: 'docked', precedents: 'docked',
            word: 'docked', billing: 'docked', outlook: 'docked',
          },
          kbMode: 'docked' as NodeMode,
          wide: true, pulse: true, orbPos: 'wide' as OrbPos, orbSay: 'Four minutes. Not three days.',
          threads: { ...p.threads, lrn: false, s1: true, s2: true, s3: true, s4: true, s5: true },
        })));
        at(4900, done);
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

  const on = (b: boolean) => (b ? 'true' : 'false');
  const cap = CAPTIONS[s.capIdx];
  const billHrs = ((s.billMeter * 1.2) / 100).toFixed(1);

  return (
    <div className={styles.scene} ref={shellRef}>
      <div
        className={styles.stage}
        ref={stageRef}
        data-pulse={on(s.pulse)}
        aria-label="Legal & Regulatory Engine — live demonstration"
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

        {/* ── The clock (Legal's device) — scripted, never real time ── */}
        <div className={styles.clock} aria-hidden="true">
          <span className={styles.clockTime}>{s.clock}</span>
          <span className={styles.clockCap}>the old way: day 3</span>
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

          <span className={styles.vlink} data-on={on(s.win.sec !== 'hidden')} aria-hidden="true" />

          {/* 0 · WATCH — the SEC EDGAR regulatory feed + the bulletin */}
          <div className={`${styles.win} ${styles.wSec}`} data-mode={s.win.sec} data-fly="release">
            <div className={styles.tbar}>
              <img src="/logos/sec.png" alt="SEC EDGAR" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Regulatory feed</span>
              <span className={styles.tsub}>watching, live</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.feedChips}>
                {FEED_CHIPS.map((f, i) => (
                  <span key={f.alt} className={styles.feedChip} data-live={on(i < s.feedsLive)}>
                    <img src={f.src} alt={f.alt} width={14} height={14} className={styles.feedChipLogo} />
                    <span className={styles.feedLiveDot} aria-hidden="true" />Live
                  </span>
                ))}
              </div>
              <div className={styles.feedList}>
                {QUIET.map((q, i) => (
                  <div key={q} className={styles.quietRow} data-in={on(i < s.quietIn)}>
                    <span className={styles.quietText}>{q}</span>
                  </div>
                ))}
              </div>
              <div className={styles.releaseCard} data-in={on(s.releaseIn)}>
                <div className={styles.relHead}>
                  <img src="/logos/sec.png" alt="SEC EDGAR" width={16} height={16} className={styles.relLogo} />
                  <span className={styles.relSrc}>SEC EDGAR · just published</span>
                </div>
                <div className={styles.relTitle}>SEC Release No. 33-11138 — Rule 10b5-1 trading plan amendments</div>
                <div className={styles.relMeta}>effective Feb 27, 2026</div>
                <div className={styles.chips}>
                  <span className={styles.chip}>Securities law</span>
                  <span className={styles.chip} data-amber="true">Insider trading</span>
                </div>
              </div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.imanage !== 'hidden')} aria-hidden="true" />

          {/* 1 · MATCH — the iManage matter wall */}
          <div className={`${styles.win} ${styles.wImanage}`} data-mode={s.win.imanage}>
            <div className={styles.tbar}>
              <img src="/logos/imanage.png" alt="iManage" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>iManage</span>
              <span className={styles.tsub}>matter wall</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.matterHead}>Meridian Shah LLP · 500+ active matters cross-referenced</div>
              <div className={styles.matterGrid}>
                {MATTERS.map((m, i) => (
                  <div
                    key={m.text}
                    className={styles.matterCard}
                    data-in={on(i < s.matterIn)}
                    data-amber={on(m.amber)}
                  >
                    <span className={styles.matterMark} aria-hidden="true">{m.amber ? '!' : '§'}</span>
                    <span className={styles.matterText}>{m.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.precedents !== 'hidden')} aria-hidden="true" />

          {/* 2 · WORK · Window A — precedents (the firm's own memory) */}
          <div className={`${styles.win} ${styles.wPrec}`} data-mode={s.win.precedents}>
            <div className={styles.tbar}>
              <img src="/logos/imanage.png" alt="iManage" width={18} height={18} className={styles.tlogo} />
              <span className={styles.tname}>Precedent search</span>
              <span className={styles.tsub}>iManage · RAG</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              {PRECEDENTS.map((p, i) => (
                <div key={p.title} className={styles.precCard} data-in={on(i < s.precIn)} data-own={on(p.own)}>
                  <span className={styles.precIco} aria-hidden="true">§</span>
                  <div className={styles.precTextWrap}>
                    <div className={styles.precTitle}>{p.title}</div>
                    <div className={styles.precSub}>{p.sub}</div>
                  </div>
                </div>
              ))}
              <div className={styles.precFoot} data-in={on(s.precFoot)}>12 matched · relevance 0.87+</div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.word !== 'hidden')} aria-hidden="true" />

          {/* 2 · WORK · Window B — the partner memo (real Word icon) */}
          <div className={`${styles.win} ${styles.wWord}`} data-mode={s.win.word}>
            <div className={styles.tbar}>
              <img src="/logos/word.svg" alt="Microsoft Word" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Guidance memo</span>
              <span className={styles.tsub}>Word · house style</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.memoTitleWrap}>
                {s.memoTitleIn
                  ? <span className={styles.memoTitle}>Rule 10b5-1 amendments — client impact</span>
                  : <span className={styles.memoSkel} aria-hidden="true" />}
              </div>
              <div className={styles.memoBody}>
                {MEMO_ROWS.map((m, i) => (
                  <div key={m} className={styles.memoRow} data-done={on(i < s.memoDone)}>
                    <span className={styles.memoCheck} aria-hidden="true">{'✓'}</span>
                    <span className={styles.memoLab}>{m}</span>
                  </div>
                ))}
              </div>
              <div className={styles.stampRow}>
                <span className={styles.stamp} data-in={on(s.stampIn)}>Drafted in 4 min 12 sec</span>
              </div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.billing !== 'hidden')} aria-hidden="true" />

          {/* 2 · WORK · Window C — Elite 3E billing meter (Thomson Reuters) */}
          <div className={`${styles.win} ${styles.wBilling}`} data-mode={s.win.billing}>
            <div className={styles.tbar}>
              <img src="/logos/thomsonreuters.png" alt="Thomson Reuters Elite" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Elite 3E</span>
              <span className={styles.tsub}>time &amp; billing</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.billLab}>Research time — logged to #4472</div>
              <div className={styles.billMeterWrap}>
                <span className={styles.billMeterFill} style={{ width: `${s.billMeter}%` }} />
              </div>
              <div className={styles.billNums}>
                <span className={styles.billHrs}>{billHrs} hrs</span>
                <span className={styles.billAuto}>automatically</span>
              </div>
              <div className={styles.billNote} data-in={on(s.billNote)}>26% billing leakage — closed</div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.outlook !== 'hidden')} aria-hidden="true" />

          {/* 3 · APPROVE / 4 · ALERT — Outlook client alert + the amber gate */}
          <div className={`${styles.win} ${styles.wOutlook}`} data-mode={s.win.outlook}>
            <div className={styles.tbar}>
              <img src="/logos/outlook.png" alt="Outlook" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Outlook</span>
              <span className={styles.tsub}>client alert</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.olDraft} data-in={on(s.alertDraftIn)}>
                <div className={styles.olRow}><span className={styles.olK}>To</span><span className={styles.olV}>[affected clients]</span></div>
                <div className={styles.olRow}><span className={styles.olK}>Subject</span><span className={styles.olV}>SEC Rule 10b5-1 amendment — action needed on your trading plan</span></div>
              </div>

              <div
                className={styles.olBanner}
                data-show={on(s.alertDraftIn && !s.approved)}
                data-wait={on(s.approveWait)}
              >
                <span className={styles.olBannerMark} aria-hidden="true">!</span>
                Awaiting Partner Shah — nothing reaches a client without a partner
              </div>

              <div className={styles.olApproved} data-in={on(s.approved)}>
                <img src="/demo/shah.png" alt="Partner A. Shah" width={22} height={22} className={styles.olAvatar} />
                <span className={styles.olApprovedText}>
                  <span className={styles.olCheck} aria-hidden="true">{'✓'}</span>
                  Approved by A. Shah · sent to 2 clients
                </span>
              </div>

              <div className={styles.olDelivered} data-in={on(s.deliveredIn)}>
                <span className={styles.olDelChip}>Delivered to 2 clients {'✓'}</span>
              </div>

              <div className={styles.olCompare} data-in={on(s.compareIn)}>
                <b>You: 09:06.</b> The market&rsquo;s other lawyers: still on day 3.
              </div>
            </div>
          </div>

          {/* 5 · LEARN — the knowledge-base node (green Chronexa tissue) */}
          <div className={`${styles.node} ${styles.kbNode}`} data-mode={s.kbMode} data-fly="kb">
            <span className={styles.nodeTag}>Your knowledge base</span>
            <div className={styles.kbInner}>
              <span className={styles.kbHead}>Embedded — the next matter already knows</span>
              <span className={styles.kbBig}>{s.kbCount.toLocaleString('en-US')}</span>
              <span className={styles.kbSub}>documents · it never leaves when a partner does</span>
              <span className={styles.kbLine} data-in={on(s.kbLine)}>SEC Release 33-11138 filed {'✓'}</span>
            </div>
          </div>
        </div>

        {/* ── Receipt overlay ── */}
        <div className={styles.receipt} data-show={on(s.receipt)}>
          <div className={styles.receiptCard}>
            <p className={styles.receiptKicker}>Published 09:02 · you replied 09:06</p>
            <p className={styles.receiptTitle}>Four minutes to a partner-approved client alert.</p>
            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}><span>Matters checked</span><b>500+</b></div>
              <div className={styles.receiptRow}><span>Exposed matters found</span><b className={styles.receiptHl}>7</b></div>
              <div className={styles.receiptRow}>
                <span>Precedents surfaced</span>
                <b>12 <span className={styles.receiptNote}>incl. your own 2022 memo</span></b>
              </div>
              <div className={styles.receiptRow}>
                <span>Billable time captured</span>
                <b className={styles.receiptHl}>1.2 hrs <span className={styles.receiptNote}>auto</span></b>
              </div>
              <div className={styles.receiptRow}>
                <span>Time to client alert</span>
                <b><s className={styles.receiptOld}>3–4 days</s> <span className={styles.receiptHl}>4 min</span></b>
              </div>
            </div>
            <BookButton className={styles.receiptCta} location="legal-regulatory-engine-scene-receipt">
              Pick the gap that hurts most →
            </BookButton>
            <span className={styles.receiptFine}>
              <span className={styles.fineLogos}>
                {FINE_LOGOS.map((l) => (
                  <img key={l.src} src={l.src} alt={l.alt} width={14} height={14} />
                ))}
              </span>
              Regulatory alerts, billing capture, knowledge activation, diligence-to-report — four workflows, on the systems you already run.
            </span>
          </div>
        </div>
      </div>

      <p className={styles.orchNote}>
        Chronexa doesn&rsquo;t sell an AI or a legal database. We orchestrate Claude with the systems you already run —
        iManage, your billing platform, Word and Outlook. We build the workflow; every client alert still waits for a partner.
      </p>
      <p className={styles.hint}>Click a step above to jump · the run loops on its own</p>
    </div>
  );
}
