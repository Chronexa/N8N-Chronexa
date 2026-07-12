'use client';

/**
 * SalesScene — the Sales Engine hero demo.
 *
 * NOT an app window. An open dark stage — "a desktop where tool windows
 * appear". Real third-party tools (Apollo, Clay, a Chrome-like browser,
 * Slack, Gmail) enter as SEPARATE bright windows, play their beat, then dock
 * into a left→right chain connected by green threads.
 *
 * THE PROTAGONIST (2026-07-12 rework): a single persistent Chronexa AI orb —
 * a glowing green chip that physically moves to whatever it is doing in every
 * beat and speaks through a small thought bubble. The story is choreographed
 * like a movie: setup (Define), rising action (Fetch → Filter → Research),
 * climax (Angle → Approve), resolution (Send → wide shot, orb at the centre
 * of the chain). All green threads emanate from the AI's actions.
 *
 * Loops while in view (~52s); the top rail scrubs to any beat.
 *
 * Design rule (2026-07-11): client-facing surfaces are friendly software —
 * real tool logos, named humans with real headshots, plain English. No
 * terminal chrome. Green (#67B035) is reserved for Chronexa (orb, threads,
 * nodes, rail); amber marks the human-control moments only.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './SalesScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type WinKey = 'apollo' | 'clay' | 'browser' | 'profile' | 'slack' | 'mail';
type Mode = 'hidden' | 'focus' | 'pair' | 'docked';
type NodeMode = 'hidden' | 'focus' | 'docked';
type OrbPos =
  | 'define' | 'deals' | 'icp' | 'icpDock' | 'fetch'
  | 'browser' | 'angle' | 'slack' | 'mail' | 'wide';
type ThreadKey =
  | 'fA' | 'fC'
  | 't1' | 't2' | 't3' | 't4' | 't5' | 't6' | 't7'
  | 's1' | 's2' | 's3' | 's4';
type SigKey = 'sg0' | 'sg1' | 'sg2';

const STEPS = ['Define', 'Fetch', 'Filter', 'Research', 'Angle', 'Approve', 'Send'] as const;

/** One caption per beat; the optional amber clause is the human-control tint. */
const CAPTIONS: { lead: string; amber?: string }[] = [
  { lead: 'Before anything runs, the AI defines your ideal customer — from deals you’ve already won.' },
  { lead: 'It pulls this morning’s matches from the tools you already pay for.' },
  { lead: 'Only the 500 that truly fit — ', amber: 'the rest are never contacted.' },
  { lead: 'It hunts for signals — what Rahul’s company is searching, announcing and hiring for.' },
  { lead: 'Then it decides the pitch — the exact angle most likely to land.' },
  { lead: 'One tap. Nothing sends without a yes.' },
  { lead: 'Sent, tracked — answered.' },
];

// 0 · DEFINE
const QUESTION = 'Who are your best customers?';
const DEALS: { co: string; who: string; note: string }[] = [
  { co: 'NorthStar Freight', who: 'VP Sales', note: '120 staff · US' },
  { co: 'FleetWave', who: 'Head of Ops', note: '260 staff · US' },
  { co: 'CargoLine', who: 'VP Sales', note: '340 staff · US' },
];
const ICP_TEXT =
  'Industry: Logistics & supply chain · Size: 50–500 · Titles: VP Sales / Head of Ops · Region: US';

// 1 · FETCH
const APOLLO_FILTERS: [string, string][] = [
  ['Title', 'VP Sales+'],
  ['Industry', 'Logistics'],
  ['HQ', 'US'],
  ['Size', '50–500'],
];
const AP_ROWS: [string, string, string][] = [
  ['Rahul Verma', 'VP Sales', 'Acme Logistics'],
  ['Priya Nair', 'Head of Ops', 'FleetIQ'],
  ['Marcus Webb', 'VP Sales', 'Northline Freight'],
  ['Elena Sousa', 'RevOps Director', 'CargoOne'],
  ['Dan Kim', 'VP Growth', 'ShipStack'],
  ['Sara Ali', 'Head of Sales', 'TruckHub'],
];
const CLAY_COLS: { name: string; c: 'cBlue' | 'cAmber' | 'cViolet' | 'cGreen' }[] = [
  { name: 'Email ✓', c: 'cBlue' },
  { name: 'Firmographics ✓', c: 'cAmber' },
  { name: 'Tech stack ✓', c: 'cViolet' },
  { name: 'Recent news ✓', c: 'cGreen' },
];
const CLAY_CELLS: string[][] = [
  ['rahul@acme…', '210 staff · US', 'HubSpot', 'Q2 cost update'],
  ['priya@fleetiq…', '85 staff · US', 'Outreach', 'Series A'],
  ['marcus@north…', '320 staff · US', 'Salesforce', 'New CFO'],
];
const CLAY_TOTAL = CLAY_CELLS.length * CLAY_COLS.length;

// 3 · RESEARCH — signals
const TABS = ['G2 · freight audit', 'Acme — Q2 update', 'LinkedIn · Jobs'];
const URLS = [
  'https://g2.com/categories/freight-audit',
  'https://acmelogistics.com/news/q2-update',
  'https://linkedin.com/company/acme-logistics/jobs',
];
const HL_TOPS = ['14%', '40%', '66%'];
const SIGNALS: { key: SigKey; lab: string; txt: string; ghost: string }[] = [
  { key: 'sg0', lab: 'Intent', txt: 'researching freight audit tools', ghost: 'Intent: freight audit tools' },
  { key: 'sg1', lab: 'News', txt: 'Q2 note — freight-cost pressure', ghost: 'News: freight-cost pressure' },
  { key: 'sg2', lab: 'Hiring', txt: '4 SDRs — scaling outbound', ghost: 'Hiring: 4 SDRs' },
];

// 4 · ANGLE — the AI's reasoning, typed on screen
const ANGLE_TEXT =
  'Costs rising while he scales outbound → pitch: automated quote-to-invoice reconciliation to stop freight leakage.';

// 6 · SEND
const MAIL_SUBJECT = 'Cutting Acme’s freight-cost leakage';
const MAIL_BODY =
  'Hi Rahul — saw the Q2 note on freight costs. While you’re scaling the SDR team, most logistics teams leak 2–3% between quote and invoice…';
const REPLY_TEXT = 'Interested — do you have time Thursday?';

const FINE_LOGOS: { src: string; alt: string }[] = [
  { src: '/logos/hubspot.png', alt: 'HubSpot' },
  { src: '/logos/instantly.png', alt: 'Instantly' },
  { src: '/logos/smartlead.png', alt: 'Smartlead' },
  { src: '/logos/zoominfo.png', alt: 'ZoomInfo' },
  { src: '/logos/apollo.png', alt: 'Apollo' },
  { src: '/logos/clay.png', alt: 'Clay' },
];

/**
 * Green thread paths in the 1000×620 stage space. Every thread starts at the
 * AI's position when the action happens: fA/fC are the fetch flicks from the
 * orb; t1–t7 link the docked chain as the orb builds it; s1–s4 are the wide-
 * shot spokes radiating from the orb's final centre seat.
 */
const THREAD_PATHS: { key: ThreadKey; d: string }[] = [
  { key: 'fA', d: 'M488,148 C430,175 350,215 300,240' },  // orb → Apollo (fetch flick)
  { key: 'fC', d: 'M512,148 C575,175 655,220 702,248' },  // orb → Clay (fetch flick)
  { key: 't1', d: 'M150,196 C195,230 225,255 250,276' },  // Apollo → ICP node
  { key: 't2', d: 'M152,392 C200,362 226,326 252,304' },  // Clay → ICP node
  { key: 't3', d: 'M292,278 C335,252 380,218 420,198' },  // ICP node → browser
  { key: 't4', d: 'M444,214 C450,285 455,355 460,408' },  // browser → profile
  { key: 't5', d: 'M482,420 C520,392 560,345 592,318' },  // profile → angle
  { key: 't6', d: 'M655,290 C695,255 730,213 760,188' },  // angle → Slack
  { key: 't7', d: 'M792,202 C820,262 840,330 856,380' },  // Slack → mail
  { key: 's1', d: 'M478,290 C390,262 240,205 158,182' },  // orb centre → Apollo
  { key: 's2', d: 'M480,308 C395,332 245,382 165,400' },  // orb centre → Clay
  { key: 's3', d: 'M522,290 C610,262 700,212 756,184' },  // orb centre → Slack
  { key: 's4', d: 'M520,308 C610,332 755,378 838,392' },  // orb centre → mail
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–6 = beats, 7 = receipt
  capIdx: number;
  // the protagonist
  orbPos: OrbPos;
  orbSay: string;
  // 0 · define
  defineIn: boolean;
  dealsIn: number;
  dealRead: number; // -1 = none
  defineOut: boolean;
  icpMode: NodeMode;
  icpTyped: number;
  // 1 · fetch
  win: Record<WinKey, Mode>;
  apRows: number;
  apCount: boolean;
  clayCells: number;
  // 2 · filter
  countOn: boolean;
  leadCount: number;
  leadDone: boolean;
  // 3 · research
  tab: number;
  hlOn: number; // -1 = none
  sig: Record<SigKey, boolean>;
  // 4 · angle
  angleMode: NodeMode;
  angleTyped: number;
  score: number;
  // 5 · approve
  slackMsgIn: boolean;
  approveWait: boolean;
  approveClicked: boolean;
  approvedIn: boolean;
  // 6 · send
  mailView: 'compose' | 'thread';
  mailTyped: number;
  sendClicked: boolean;
  track: number; // 0–3: delivered / opened / replied
  replyIn: boolean;
  // connective tissue + finale
  threads: Record<ThreadKey, boolean>;
  wide: boolean;
  pulse: boolean;
  receipt: boolean;
}

const NO_THREADS: Record<ThreadKey, boolean> = {
  fA: false, fC: false,
  t1: false, t2: false, t3: false, t4: false, t5: false, t6: false, t7: false,
  s1: false, s2: false, s3: false, s4: false,
};

const INITIAL: SceneState = {
  step: 0,
  capIdx: 0,
  orbPos: 'define',
  orbSay: '',
  defineIn: false,
  dealsIn: 0,
  dealRead: -1,
  defineOut: false,
  icpMode: 'hidden',
  icpTyped: 0,
  win: { apollo: 'hidden', clay: 'hidden', browser: 'hidden', profile: 'hidden', slack: 'hidden', mail: 'hidden' },
  apRows: 0,
  apCount: false,
  clayCells: 0,
  countOn: false,
  leadCount: 2341,
  leadDone: false,
  tab: 0,
  hlOn: -1,
  sig: { sg0: false, sg1: false, sg2: false },
  angleMode: 'hidden',
  angleTyped: 0,
  score: 0,
  slackMsgIn: false,
  approveWait: false,
  approveClicked: false,
  approvedIn: false,
  mailView: 'compose',
  mailTyped: 0,
  sendClicked: false,
  track: 0,
  replyIn: false,
  threads: { ...NO_THREADS },
  wide: false,
  pulse: false,
  receipt: false,
};

/** Cumulative end-state per beat — lets the rail scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  // 0 · DEFINE — ICP written and docked as the filter node; setup cards gone
  (s) => ({
    ...s,
    defineIn: true, dealsIn: DEALS.length, dealRead: -1, defineOut: true,
    icpMode: 'docked', icpTyped: ICP_TEXT.length,
    orbPos: 'icpDock', orbSay: '', capIdx: 0,
  }),
  // 1 · FETCH — flick threads out; Apollo + Clay side by side, populated
  (s) => ({
    ...s,
    win: { ...s.win, apollo: 'pair', clay: 'pair' },
    threads: { ...s.threads, fA: true, fC: true },
    apRows: AP_ROWS.length, apCount: true, clayCells: CLAY_TOTAL,
    orbPos: 'fetch', capIdx: 1,
  }),
  // 2 · FILTER — both docked, threads converge into the ICP node, 500 settled
  (s) => ({
    ...s,
    win: { ...s.win, apollo: 'docked', clay: 'docked' },
    threads: { ...s.threads, fA: false, fC: false, t1: true, t2: true },
    countOn: true, leadCount: 500, leadDone: true,
    orbPos: 'icpDock', capIdx: 2,
  }),
  // 3 · RESEARCH — browser + profile up, orb in the tab bar, 3 signals landed
  (s) => ({
    ...s,
    win: { ...s.win, browser: 'pair', profile: 'pair' },
    tab: 2, hlOn: -1, sig: { sg0: true, sg1: true, sg2: true },
    orbPos: 'browser', capIdx: 3,
  }),
  // 4 · ANGLE — browser docked, angle card typed, dial at 92
  (s) => ({
    ...s,
    win: { ...s.win, browser: 'docked' },
    threads: { ...s.threads, t3: true },
    angleMode: 'focus', angleTyped: ANGLE_TEXT.length, score: 92,
    orbPos: 'angle', capIdx: 4,
  }),
  // 5 · APPROVE — chain grows, Slack up, batch approved by Alex
  (s) => ({
    ...s,
    win: { ...s.win, profile: 'docked', slack: 'focus' },
    angleMode: 'docked',
    threads: { ...s.threads, t4: true, t5: true },
    slackMsgIn: true, approveWait: false, approveClicked: true, approvedIn: true,
    orbPos: 'slack', capIdx: 5,
  }),
  // 6 · SEND — full chain docked, reply in, wide shot with the orb at centre
  (s) => ({
    ...s,
    win: { ...s.win, slack: 'docked', mail: 'docked' },
    threads: { ...s.threads, t6: true, t7: true, s1: true, s2: true, s3: true, s4: true },
    mailView: 'thread', mailTyped: MAIL_BODY.length, sendClicked: true,
    track: 3, replyIn: true, wide: true,
    orbPos: 'wide', orbSay: 'All before 9:00.', capIdx: 6,
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SalesScene() {
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

  /** Flying signal chip: from a browser highlight box to a profile signal row. */
  const ghost = useCallback((hl: number, sig: SigKey, text: string) => {
    const stage = stageRef.current;
    if (!stage) return;
    const from = stage.querySelector<HTMLElement>(`[data-hlbox="${hl}"]`);
    const to = stage.querySelector<HTMLElement>(`[data-sig="${sig}"]`);
    if (!from || !to) return;
    const wr = stage.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const g = document.createElement('span');
    g.className = styles.ghost;
    g.textContent = text;
    g.style.left = `${a.right - wr.left - 60}px`;
    g.style.top = `${a.top - wr.top}px`;
    stage.appendChild(g);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        g.style.transform = `translate(${b.left - a.right + 60}px, ${b.top - a.top}px)`;
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
      setS({ ...fin, step: 7, receipt: true, pulse: false });
      return;
    }

    /** Typewriter helper: 3 chars per tick. */
    const type = (t0: number, text: string, ms: number, key: 'icpTyped' | 'angleTyped' | 'mailTyped') => {
      const ticks = Math.ceil(text.length / 3);
      for (let k = 1; k <= ticks; k++) {
        const c = Math.min(k * 3, text.length);
        at(t0 + k * ms, () => patch({ [key]: c } as Partial<SceneState>));
      }
      return t0 + ticks * ms;
    };

    const playBeat = (i: number, done: () => void) => {
      patch({ step: i });
      if (i === 0) {
        // DEFINE (setup) — the AI reads won deals, then writes the ICP itself.
        patch({ capIdx: 0, orbPos: 'define', orbSay: '' });
        at(250, () => patch({ defineIn: true }));
        at(900, () => patch({ orbPos: 'deals', orbSay: 'Learning from deals you’ve already won…' }));
        DEALS.forEach((_, k) => at(1250 + k * 260, () => patch({ dealsIn: k + 1 })));
        at(2050, () => patch({ dealRead: 0 }));
        at(2600, () => patch({ dealRead: 1 }));
        at(3150, () => patch({ dealRead: 2 }));
        at(3700, () => patch({ dealRead: -1 }));
        at(3900, () => patch({ orbPos: 'icp', orbSay: 'So your best customers look like this…' }));
        at(4350, () => patch({ icpMode: 'focus' }));
        type(4650, ICP_TEXT, 28, 'icpTyped');
        at(6000, () => patch({ orbSay: '' }));
        at(6350, () => patch({ defineOut: true, icpMode: 'docked', orbPos: 'icpDock' }));
        at(7400, done);
      } else if (i === 1) {
        // FETCH — the orb flicks two threads out; Apollo + Clay arrive on them.
        patch({ capIdx: 1 });
        at(150, () => patch({ orbPos: 'fetch', orbSay: 'Reaching into Apollo and Clay…' }));
        at(800, () => patch((p) => ({ threads: { ...p.threads, fA: true } })));
        at(950, () => patch((p) => ({ threads: { ...p.threads, fC: true } })));
        at(1250, () => patch((p) => ({ win: { ...p.win, apollo: 'pair' } })));
        at(1450, () => patch((p) => ({ win: { ...p.win, clay: 'pair' } })));
        AP_ROWS.forEach((_, k) => at(1900 + k * 300, () => patch({ apRows: k + 1 })));
        for (let k = 1; k <= CLAY_TOTAL; k++) at(2300 + k * 115, () => patch({ clayCells: k }));
        at(4100, () => patch({ apCount: true }));
        at(4600, () => patch({ orbSay: '2,341 possibles.' }));
        at(5900, done);
      } else if (i === 2) {
        // FILTER — windows dock; their threads converge into the AI's ICP node.
        patch({ capIdx: 2 });
        at(150, () => patch((p) => ({
          win: { ...p.win, apollo: 'docked', clay: 'docked' },
          threads: { ...p.threads, fA: false, fC: false },
        })));
        at(650, () => patch({ orbPos: 'icpDock', orbSay: 'Keeping only the true fits…' }));
        at(1100, () => patch((p) => ({ threads: { ...p.threads, t1: true, t2: true }, countOn: true })));
        const SPIN = 16;
        for (let k = 1; k <= SPIN; k++) {
          const e = 1 - Math.pow(1 - k / SPIN, 3);
          const v = Math.round(2341 - (2341 - 500) * e);
          at(1450 + k * 75, () => patch({ leadCount: v }));
        }
        at(2950, () => patch({ leadDone: true }));
        at(3500, () => patch({ orbSay: '' }));
        at(4500, done);
      } else if (i === 3) {
        // RESEARCH (rising action) — the orb docks into the browser tab bar
        // and hunts signals; each one flies onto Rahul's card.
        patch({ capIdx: 3 });
        at(200, () => patch((p) => ({ win: { ...p.win, browser: 'pair', profile: 'pair' }, tab: 0, hlOn: -1 })));
        at(500, () => patch({ orbPos: 'browser', orbSay: 'Reading what Acme is up to…' }));
        SIGNALS.forEach((sg, j) => {
          const t0 = 1300 + j * 1900;
          at(t0, () => patch({ tab: j, hlOn: j }));
          at(t0 + 650, () => ghost(j, sg.key, sg.ghost));
          at(t0 + 1250, () => patch((p) => ({ sig: { ...p.sig, [sg.key]: true } })));
        });
        at(6700, () => patch({ hlOn: -1, orbSay: 'Three live signals.' }));
        at(7900, done);
      } else if (i === 4) {
        // ANGLE (climax, part 1) — the orb moves beside Rahul's card and types
        // its reasoning; the dial fills; then a beat of stillness. The aha.
        patch({ capIdx: 4 });
        at(150, () => patch((p) => ({ win: { ...p.win, browser: 'docked' }, threads: { ...p.threads, t3: true } })));
        at(650, () => patch({ orbPos: 'angle', orbSay: 'Deciding the pitch…' }));
        at(1150, () => patch({ angleMode: 'focus' }));
        type(1500, ANGLE_TEXT, 28, 'angleTyped');
        // ~1s of stillness after the line completes, then the dial fills.
        for (let k = 1; k <= 23; k++) at(3700 + k * 45, () => patch({ score: Math.round((92 * k) / 23) }));
        at(5000, () => patch({ orbSay: 'That’s the angle.' }));
        at(6300, done);
      } else if (i === 5) {
        // APPROVE (climax, part 2) — Slack enters; the amber wait for Alex.
        patch({ capIdx: 5 });
        at(150, () => patch((p) => ({
          win: { ...p.win, profile: 'docked' },
          angleMode: 'docked' as NodeMode,
          threads: { ...p.threads, t4: true, t5: true },
        })));
        at(700, () => patch({ orbPos: 'slack', orbSay: 'Checking with Alex first.' }));
        at(1150, () => patch((p) => ({ win: { ...p.win, slack: 'focus' } })));
        at(1700, () => patch({ slackMsgIn: true }));
        at(2400, () => patch({ approveWait: true })); // amber: nothing moves for ~2s
        at(4400, () => patch({ approveWait: false, approveClicked: true }));
        at(4900, () => patch({ approvedIn: true }));
        at(5400, () => patch({ orbSay: '' }));
        at(6300, done);
      } else if (i === 6) {
        // SEND (resolution) — the mail leads with the signal; reply lands;
        // wide shot: the orb settles at the centre of the chain it built.
        patch({ capIdx: 6 });
        at(150, () => patch((p) => ({ win: { ...p.win, slack: 'docked' }, threads: { ...p.threads, t6: true } })));
        at(700, () => patch({ orbPos: 'mail', orbSay: 'Writing it around the Q2 signal…' }));
        at(1050, () => patch((p) => ({ win: { ...p.win, mail: 'focus' }, mailView: 'compose' as const, mailTyped: 0 })));
        type(1700, MAIL_BODY, 26, 'mailTyped');
        at(3600, () => patch({ sendClicked: true }));
        at(4100, () => patch({ mailView: 'thread', orbSay: '' }));
        at(4700, () => patch({ track: 1 }));
        at(5500, () => patch({ track: 2 }));
        at(6300, () => patch({ track: 3 }));
        at(6900, () => patch({ replyIn: true, orbSay: 'Answered.' }));
        at(8100, () => patch((p) => ({ win: { ...p.win, mail: 'docked' }, threads: { ...p.threads, t7: true } })));
        at(8900, () => patch((p) => ({
          wide: true, pulse: true, orbPos: 'wide' as OrbPos, orbSay: 'All before 9:00.',
          threads: { ...p.threads, s1: true, s2: true, s3: true, s4: true },
        })));
        at(10300, done);
      } else {
        // RECEIPT
        patch({ step: 7 });
        at(400, () => patch({ receipt: true }));
        at(6600, done);
      }
    };

    const run = (i: number) => {
      if (tokenRef.current !== myToken) return;
      if (i > 7) {
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
  }, [ghost, reduced, stop]);

  useEffect(() => {
    // Kick off via a timer so no state updates happen synchronously in the
    // effect body (react-hooks/set-state-in-effect).
    const id = window.setTimeout(() => {
      if (reduced || inView) goTo(0);
      else { stop(); setS(INITIAL); }
    }, 0);
    return () => { window.clearTimeout(id); stop(); };
  }, [inView, reduced, goTo, stop]);

  const icpTyping = s.icpTyped > 0 && s.icpTyped < ICP_TEXT.length;
  const angleTyping = s.angleTyped > 0 && s.angleTyped < ANGLE_TEXT.length;
  const mailTyping = s.mailTyped > 0 && s.mailTyped < MAIL_BODY.length;
  const on = (b: boolean) => (b ? 'true' : 'false');
  const cap = CAPTIONS[s.capIdx];

  return (
    <div className={styles.scene} ref={shellRef}>
      <div
        className={styles.stage}
        ref={stageRef}
        data-pulse={on(s.pulse)}
        aria-label="Sales Engine — live demonstration"
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

          {/* The protagonist: the Chronexa AI orb + thought bubble */}
          <div className={styles.orb} data-pos={s.orbPos}>
            <span className={styles.orbChip}>
              <span className={styles.orbDot} aria-hidden="true" />
              <span className={styles.orbName}>Chronexa AI</span>
            </span>
            <span className={styles.orbSay} data-on={on(s.orbSay !== '')}>
              {s.orbSay || ' '}
            </span>
          </div>

          {/* 0 · DEFINE — the opening question */}
          <div className={styles.defCard} data-in={on(s.defineIn)} data-out={on(s.defineOut)}>
            <span className={styles.defKicker}>First question</span>
            <span className={styles.defQ}>{QUESTION}</span>
          </div>

          {/* 0 · DEFINE — three greyed closed-won deals the AI reads */}
          <div className={styles.deals} data-out={on(s.defineOut)}>
            {DEALS.map((d, i) => (
              <div key={d.co} className={styles.deal} data-in={on(i < s.dealsIn)} data-read={on(s.dealRead === i)}>
                <span className={styles.dealWon}>Closed won</span>
                <span className={styles.dealCo}>{d.co}</span>
                <span className={styles.dealMeta}>{d.who} · {d.note}</span>
              </div>
            ))}
          </div>

          {/* The ICP criteria card — typed by the AI, then docks as the filter node */}
          <div className={`${styles.node} ${styles.icpNode}`} data-mode={s.icpMode}>
            <span className={styles.nodeTag}>Chronexa AI · your ICP</span>
            <p className={styles.icpText}>
              {ICP_TEXT.slice(0, s.icpTyped)}
              <span className={styles.caret} data-on={on(icpTyping)} aria-hidden="true" />
            </p>
            <span className={styles.nodeCount} data-in={on(s.countOn)}>
              {s.leadCount.toLocaleString('en-US')} leads
            </span>
            <span className={styles.nodeSub} data-in={on(s.leadDone)}>match your ICP</span>
          </div>

          <span className={styles.vlink} data-on={on(s.win.apollo !== 'hidden')} aria-hidden="true" />

          {/* Apollo */}
          <div className={`${styles.win} ${styles.wApollo}`} data-mode={s.win.apollo}>
            <div className={styles.tbar}>
              <img src="/logos/apollo.png" alt="Apollo" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Apollo</span>
              <span className={styles.tsub}>People search</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.apGrid}>
                <div className={styles.apFilters}>
                  <div className={styles.apFilterHead}>Filters</div>
                  {APOLLO_FILTERS.map(([k, v]) => (
                    <div key={k} className={styles.apFilter}><span>{k}</span><b>{v}</b></div>
                  ))}
                </div>
                <div className={styles.apTable}>
                  <div className={styles.apHead}><span>Name</span><span>Title</span><span>Company</span></div>
                  {AP_ROWS.map((r, i) => (
                    <div key={r[0]} className={styles.apRow} data-in={on(i < s.apRows)}>
                      <span className={styles.apName}>
                        <img src="/logos/linkedin.png" alt="LinkedIn" width={11} height={11} className={styles.liMark} />
                        {r[0]}
                      </span>
                      <span>{r[1]}</span><span>{r[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.apFoot} data-in={on(s.apCount)}>2,341 matches</div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.clay !== 'hidden')} aria-hidden="true" />

          {/* Clay */}
          <div className={`${styles.win} ${styles.wClay}`} data-mode={s.win.clay}>
            <div className={styles.tbar}>
              <img src="/logos/clay.png" alt="Clay" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Clay</span>
              <span className={styles.tsub}>Enrichment table</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.clayHead}>
                {CLAY_COLS.map((c) => (
                  <span key={c.name} className={`${styles.clayCol} ${styles[c.c]}`}>{c.name}</span>
                ))}
              </div>
              {CLAY_CELLS.map((row, r) => (
                <div key={row[0]} className={styles.clayRow}>
                  {row.map((cell, c) => (
                    <span key={cell} className={styles.clayCell}>
                      <span className={styles.clayChip} data-in={on(r * CLAY_COLS.length + c < s.clayCells)}>{cell}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.browser !== 'hidden')} aria-hidden="true" />

          {/* Browser — the AI orb docks into its tab bar while researching */}
          <div className={`${styles.win} ${styles.wBrowser}`} data-mode={s.win.browser}>
            <div className={styles.bTop}>
              <span className={styles.bDots} aria-hidden="true"><i /><i /><i /></span>
              <div className={styles.bTabs}>
                {TABS.map((t, i) => (
                  <span key={t} className={styles.bTab} data-active={on(s.tab === i)}>{t}</span>
                ))}
              </div>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.bUrl}>{URLS[s.tab]}</div>
            <div className={styles.winBody}>
              <div className={styles.bPage} data-tab={s.tab}>
                <span className={styles.sk} /><span className={styles.sk} /><span className={styles.sk} />
                <span className={styles.sk} /><span className={styles.sk} /><span className={styles.sk} />
                <span className={styles.sk} /><span className={styles.sk} />
                {HL_TOPS.map((top, k) => (
                  <span key={top} className={styles.hlBox} data-hlbox={k} data-on={on(s.hlOn === k)} style={{ top }} />
                ))}
              </div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.profile !== 'hidden')} aria-hidden="true" />

          {/* Rahul's profile card — where the signals land */}
          <div className={`${styles.win} ${styles.wProfile}`} data-mode={s.win.profile}>
            <div className={styles.winBody}>
              <div className={styles.pHead}>
                <img src="/demo/rahul.png" alt="Rahul Verma" width={36} height={36} className={styles.pAvatar} />
                <div>
                  <div className={styles.pName}>Rahul Verma</div>
                  <div className={styles.pMeta}>VP Sales, Acme Logistics</div>
                </div>
              </div>
              <div className={styles.sigHead}>Live signals</div>
              {SIGNALS.map((sg) => (
                <div key={sg.key} className={styles.sigRow} data-sig={sg.key} data-in={on(s.sig[sg.key])}>
                  <span className={styles.sigGlyph} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <circle cx="7" cy="7" r="2" fill="currentColor" />
                      <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
                      <circle cx="7" cy="7" r="6.4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
                    </svg>
                  </span>
                  <span className={styles.sigText}><b>{sg.lab}:</b> {sg.txt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The angle card — the AI's reasoning, typed on screen (climax) */}
          <div className={`${styles.node} ${styles.angleNode}`} data-mode={s.angleMode}>
            <span className={styles.nodeTag}>Chronexa AI · the pitch</span>
            <div className={styles.angleBody}>
              <div className={styles.dialWrap}>
                <div className={styles.dial}>
                  <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
                    <circle className={styles.dialBg} cx="23" cy="23" r="19" />
                    <circle
                      className={styles.dialFg} cx="23" cy="23" r="19"
                      style={{ strokeDashoffset: 119.4 * (1 - s.score / 100) }}
                    />
                  </svg>
                  <span className={styles.dialNum}>{s.score}</span>
                </div>
                <span className={styles.dialCap}>fit / 100</span>
              </div>
              <p className={styles.angleText}>
                {ANGLE_TEXT.slice(0, s.angleTyped)}
                <span className={styles.caret} data-on={on(angleTyping)} aria-hidden="true" />
              </p>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.slack !== 'hidden')} aria-hidden="true" />

          {/* Slack — the human-control moment */}
          <div className={`${styles.win} ${styles.wSlack}`} data-mode={s.win.slack}>
            <div className={styles.slTop}>
              <img src="/logos/slack.png" alt="Slack" width={20} height={20} className={styles.slLogo} />
              <span className={styles.slWs}>Slack · your workspace</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.slChan}># outbound-approvals</div>
            <div className={styles.winBody}>
              <div className={styles.slMsg} data-in={on(s.slackMsgIn)}>
                <span className={styles.slOrb} aria-hidden="true"><i /></span>
                <div className={styles.slMsgBody}>
                  <div className={styles.slMeta}>
                    <b>Chronexa AI</b><span className={styles.slApp}>APP</span><span className={styles.slTime}>08:58</span>
                  </div>
                  <p className={styles.slText}>41 researched sequences ready. Each pitched on a live signal.</p>
                  <p className={styles.slSub}>Top fit: Rahul Verma · Acme Logistics · 92/100</p>
                  <div className={styles.slBtns}>
                    <button
                      type="button"
                      className={styles.slApprove}
                      data-wait={on(s.approveWait)}
                      data-clicked={on(s.approveClicked)}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      Approve
                    </button>
                    <button type="button" className={styles.slEdit} tabIndex={-1} aria-hidden="true">Edit</button>
                  </div>
                  <p className={styles.slDone} data-in={on(s.approvedIn)}>
                    <img src="/demo/alex.png" alt="Alex Carter" width={16} height={16} className={styles.slDoneAvatar} />
                    {'✓'} Approved by Alex · 09:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.mail !== 'hidden')} aria-hidden="true" />

          {/* Gmail */}
          <div className={`${styles.win} ${styles.wMail}`} data-mode={s.win.mail}>
            <div className={styles.tbar}>
              <img src="/logos/gmail.svg" alt="Gmail" width={20} height={15} className={styles.tlogo} />
              <span className={styles.tname}>{s.mailView === 'compose' ? 'New message' : 'Inbox — Acme Logistics'}</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            {s.mailView === 'compose' ? (
              <div className={styles.winBody}>
                <div className={styles.gmRow}><span className={styles.gmK}>To</span><span className={styles.gmV}>rahul@acmelogistics.com</span></div>
                <div className={styles.gmRow}><span className={styles.gmK}>Subject</span><span className={styles.gmV}>{MAIL_SUBJECT}</span></div>
                <p className={styles.gmBody}>
                  {MAIL_BODY.slice(0, s.mailTyped)}
                  <span className={styles.caret} data-on={on(mailTyping)} aria-hidden="true" />
                </p>
                <div className={styles.gmFoot}>
                  <button type="button" className={styles.gmSend} data-clicked={on(s.sendClicked)} tabIndex={-1} aria-hidden="true">
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.winBody}>
                <div className={styles.gmSubj}>{MAIL_SUBJECT}</div>
                <div className={styles.trk}>
                  <span className={styles.trkChip} data-lit={on(s.track >= 1)}>Delivered {'✓'}</span>
                  <span className={styles.trkArrow} aria-hidden="true">→</span>
                  <span className={styles.trkChip} data-lit={on(s.track >= 2)}>Opened ×2</span>
                  <span className={styles.trkArrow} aria-hidden="true">→</span>
                  <span className={styles.trkChip} data-lit={on(s.track >= 3)}>Replied {'✓'}</span>
                </div>
                <p className={styles.gmSnippet}>You: {MAIL_BODY.slice(0, 88)}…</p>
                <div className={styles.gmReply} data-in={on(s.replyIn)}>
                  <img src="/demo/rahul.png" alt="Rahul Verma" width={24} height={24} className={styles.gmReplyAvatar} />
                  <p>{REPLY_TEXT}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Receipt overlay ── */}
        <div className={styles.receipt} data-show={on(s.receipt)}>
          <div className={styles.receiptCard}>
            <p className={styles.receiptKicker}>Before 9:00 this morning</p>
            <p className={styles.receiptTitle}>Your stack did this while the team slept.</p>
            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}><span>ICP defined by AI</span><b className={styles.receiptHl}>{'✓'}</b></div>
              <div className={styles.receiptRow}><span>Accounts sourced</span><b>2,341</b></div>
              <div className={styles.receiptRow}><span>Matched &amp; researched</span><b>500</b></div>
              <div className={styles.receiptRow}><span>Signal-based pitches</span><b className={styles.receiptHl}>41</b></div>
              <div className={styles.receiptRow}><span>Human taps</span><b className={styles.receiptHl}>1</b></div>
            </div>
            <BookButton className={styles.receiptCta} location="sales-engine-scene-receipt">
              See it run on your ICP →
            </BookButton>
            <span className={styles.receiptFine}>
              <span className={styles.fineLogos}>
                {FINE_LOGOS.map((l) => (
                  <img key={l.src} src={l.src} alt={l.alt} width={14} height={14} />
                ))}
              </span>
              We orchestrate your tools; you keep them.
            </span>
          </div>
        </div>
      </div>

      <p className={styles.hint}>Click a step above to jump · the run loops on its own</p>
    </div>
  );
}
