'use client';

/**
 * InvestScene — the Investment Research Engine hero demo.
 *
 * NOT an app window. An open dark stage — real third-party tools (a Plaid link
 * modal, a live holdings window, a browser on SEC EDGAR + news, an IBKR order
 * ticket, a risk monitor) enter ONE AT A TIME in focus, play their beat, then
 * dock into a left→right chain connected by green threads.
 *
 * ATTRIBUTION (client mandate — the whole point): Chronexa owns neither the AI
 * nor the models. The protagonist orb is labelled "AI agent · Claude" — Claude
 * does the reasoning and orchestration. The quantitative signal models are a
 * SEPARATE green logic node labelled "XGBoost · LSTM" — they produce the signal;
 * the orb only stands beside it and reports the number. Never imply Chronexa
 * built either.
 *
 * Movie structure: setup (Connect → Sync → Rules), rising action (Research),
 * the quant moment (Signal), climax (Approve — the amber human gate for Priya),
 * resolution (Watch → wide shot). Loops while in view (~52s); the rail scrubs.
 *
 * Design rule (2026-07-11): friendly, bright software — real logos, a named
 * human with a real headshot, plain English. No trading-terminal chrome. Green
 * (#67B035) is reserved for Chronexa (orb, threads, nodes, rail); amber marks
 * the human-control moment only.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './InvestScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type WinKey = 'plaid' | 'holdings' | 'browser' | 'signals' | 'ticket' | 'risk';
type Mode = 'hidden' | 'focus' | 'docked';
type NodeMode = 'hidden' | 'focus' | 'docked';
type OrbPos =
  | 'connect' | 'sync' | 'rules' | 'research' | 'signal' | 'approve' | 'watch' | 'wide';
type ThreadKey =
  | 'cA'
  | 't1' | 't2' | 't3' | 't4' | 't5' | 't6'
  | 's1' | 's2' | 's3' | 's4' | 's5';
type SigKey = 'sg0' | 'sg1' | 'sg2';

const STEPS = ['Connect', 'Sync', 'Rules', 'Research', 'Signal', 'Approve', 'Watch'] as const;

/** One caption per beat; the optional amber clause is the human-control tint. */
const CAPTIONS: { lead: string; amber?: string }[] = [
  { lead: 'It connects straight to your brokerages through Plaid — live positions, never a stale export.' },
  { lead: 'Your real portfolio, synced live — every signal is measured against what you actually hold.' },
  { lead: 'Your rules first — the engine can never breach the limits you set.' },
  { lead: 'It reads filings, earnings and news across everything you hold — and scores what matters.' },
  { lead: 'Proven models — XGBoost and LSTM — find the entry and size it by your Kelly limit.' },
  { lead: 'Every order waits for a human. ', amber: 'Priya signs; the engine logs who, when and why.' },
  { lead: 'Then it watches beta, Sharpe and drawdown continuously — so risk never drifts unnoticed.' },
];

// 0 · CONNECT — Plaid link modal, the accounts you already hold
const PLAID_ACCTS: { logo: string; alt: string; name: string; bal: string }[] = [
  { logo: '/logos/schwab.png', alt: 'Charles Schwab', name: 'Schwab', bal: '$1.4M' },
  { logo: '/logos/fidelity.png', alt: 'Fidelity', name: 'Fidelity', bal: '$0.7M' },
  { logo: '/logos/ibkr.png', alt: 'Interactive Brokers', name: 'IBKR', bal: '$0.3M' },
];

// 1 · SYNC — live holdings + the market tape
const HOLDINGS: { sym: string; detail: string; dir: 'up' | 'down' | '' }[] = [
  { sym: 'NVDA', detail: '340 sh · avg $148.20', dir: 'up' },
  { sym: 'AAPL', detail: '120 sh · avg $167.50', dir: 'down' },
  { sym: 'Cash', detail: '$84,300', dir: '' },
];
const TAPE: { sym: string; px: string; dir: 'up' | 'down' }[] = [
  { sym: 'NVDA', px: '183.42', dir: 'up' },
  { sym: 'AAPL', px: '167.80', dir: 'down' },
  { sym: 'MSFT', px: '421.15', dir: 'up' },
  { sym: 'META', px: '489.30', dir: 'down' },
  { sym: 'TSLA', px: '244.60', dir: 'up' },
  { sym: 'GOOGL', px: '178.20', dir: 'up' },
];

// 2 · RULES — the mandate the orb types onto the green rules node
const RULES_TEXT = 'Max position 15% · sector cap 30% · drawdown limit −8% · Kelly sizing';

// 3 · RESEARCH — browser tabs + the signals that land on the watch card
const RESEARCH_TABS: { label: string; logo: string }[] = [
  { label: 'SEC EDGAR', logo: '/logos/sec.png' },
  { label: 'Reuters · earnings', logo: '' },
  { label: 'Bloomberg · filings', logo: '' },
];
const RESEARCH_URLS = [
  'https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=NVDA',
  'https://reuters.com/markets/companies/MSFT.O/earnings',
  'https://bloomberg.com/quote/META:US',
];
const HL_TOPS = ['16%', '42%', '68%'];
const SIGNALS: { key: SigKey; sym: string; txt: string; tone: 'green' | 'amber'; ghost: string }[] = [
  { key: 'sg0', sym: 'NVDA', txt: 'Q2 beat, data-centre revenue +42%', tone: 'green', ghost: 'NVDA · +42%' },
  { key: 'sg1', sym: 'MSFT', txt: '10-Q filed, cloud +18%', tone: 'green', ghost: 'MSFT · +18%' },
  { key: 'sg2', sym: 'Meta', txt: 'insider selling · 2 exec transactions', tone: 'amber', ghost: 'Meta · insiders' },
];

// 4 · SIGNAL — the two rows the model node produces beneath the confidence bar
const SIGNAL_ROWS = ['Entry $182.40–187.20 · stop $174.00', 'Kelly fraction 4.2% → size $100,800'];

// 6 · WATCH — the risk gauge rows, all settling green
const RISK_ROWS: { lab: string; val: string; note: string; pct: number }[] = [
  { lab: 'Beta', val: '1.12', note: 'target 1.0–1.15', pct: 62 },
  { lab: 'Sharpe (30d)', val: '1.84', note: 'strong', pct: 74 },
  { lab: 'Max drawdown', val: '−3.2%', note: 'limit −8%', pct: 40 },
  { lab: 'Tech sector', val: '34% → 28%', note: 'rebalancing', pct: 68 },
];

const FINE_LOGOS: { src: string; alt: string }[] = [
  { src: '/logos/plaid.png', alt: 'Plaid' },
  { src: '/logos/schwab.png', alt: 'Charles Schwab' },
  { src: '/logos/ibkr.png', alt: 'Interactive Brokers' },
  { src: '/logos/fidelity.png', alt: 'Fidelity' },
  { src: '/logos/alpaca.png', alt: 'Alpaca' },
];

/**
 * Green thread paths in the 1000×620 stage space. cA is the connect flick from
 * the orb into the Plaid modal; t1–t6 link the docked chain as the orb builds
 * it; s1–s5 are the wide-shot spokes radiating from the orb's final centre seat.
 */
const THREAD_PATHS: { key: ThreadKey; d: string }[] = [
  { key: 'cA', d: 'M690,250 C620,285 520,305 452,312' }, // orb → Plaid modal (connect flick)
  { key: 't1', d: 'M120,192 C116,270 128,345 138,392' }, // Plaid → holdings
  { key: 't2', d: 'M160,402 C210,365 248,322 270,306' }, // holdings → rules node
  { key: 't3', d: 'M298,278 C348,238 405,196 438,186' }, // rules node → browser
  { key: 't4', d: 'M462,190 C540,240 585,320 612,368' }, // browser → signal (model) node
  { key: 't5', d: 'M636,372 C700,325 720,240 736,192' }, // signal node → ticket
  { key: 't6', d: 'M752,190 C812,255 845,330 858,380' }, // ticket → risk monitor
  { key: 's1', d: 'M488,290 C380,255 220,205 132,182' }, // orb centre → Plaid
  { key: 's2', d: 'M486,306 C388,352 240,392 150,404' }, // orb centre → holdings
  { key: 's3', d: 'M496,286 C480,250 462,210 452,186' }, // orb centre → browser
  { key: 's4', d: 'M514,288 C610,255 690,210 730,186' }, // orb centre → ticket
  { key: 's5', d: 'M516,306 C640,345 780,378 852,390' }, // orb centre → risk
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–6 = beats, 7 = receipt
  capIdx: number;
  // the protagonist
  orbPos: OrbPos;
  orbSay: string;
  // persistent market tape
  tapeOn: boolean;
  // windows
  win: Record<WinKey, Mode>;
  // 0 · connect
  plaidAccts: number;
  plaidDone: boolean;
  // 1 · sync
  holdRows: number;
  holdFoot: boolean;
  // 2 · rules
  rulesMode: NodeMode;
  rulesTyped: number;
  // 3 · research
  tab: number;
  hlOn: number; // -1 = none
  sig: Record<SigKey, boolean>;
  sigFoot: boolean;
  // 4 · signal (the quant model node)
  signalMode: NodeMode;
  conf: number; // 0–89, displayed as 0.89
  sigRowsIn: number;
  // 5 · approve
  ticketBuilt: boolean;
  approveWait: boolean;
  queuedIn: boolean;
  approveClicked: boolean;
  filledIn: boolean;
  auditIn: boolean;
  // 6 · watch
  riskRows: number;
  // connective tissue + finale
  threads: Record<ThreadKey, boolean>;
  wide: boolean;
  pulse: boolean;
  receipt: boolean;
}

const NO_THREADS: Record<ThreadKey, boolean> = {
  cA: false,
  t1: false, t2: false, t3: false, t4: false, t5: false, t6: false,
  s1: false, s2: false, s3: false, s4: false, s5: false,
};

const INITIAL: SceneState = {
  step: 0,
  capIdx: 0,
  orbPos: 'connect',
  orbSay: '',
  tapeOn: false,
  win: { plaid: 'hidden', holdings: 'hidden', browser: 'hidden', signals: 'hidden', ticket: 'hidden', risk: 'hidden' },
  plaidAccts: 0,
  plaidDone: false,
  holdRows: 0,
  holdFoot: false,
  rulesMode: 'hidden',
  rulesTyped: 0,
  tab: 0,
  hlOn: -1,
  sig: { sg0: false, sg1: false, sg2: false },
  sigFoot: false,
  signalMode: 'hidden',
  conf: 0,
  sigRowsIn: 0,
  ticketBuilt: false,
  approveWait: false,
  queuedIn: false,
  approveClicked: false,
  filledIn: false,
  auditIn: false,
  riskRows: 0,
  threads: { ...NO_THREADS },
  wide: false,
  pulse: false,
  receipt: false,
};

/** Cumulative end-state per beat — lets the rail scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  // 0 · CONNECT — Plaid modal up, three accounts linked
  (s) => ({
    ...s,
    win: { ...s.win, plaid: 'focus' },
    plaidAccts: PLAID_ACCTS.length, plaidDone: true,
    threads: { ...s.threads, cA: true },
    orbPos: 'connect', orbSay: '', capIdx: 0,
  }),
  // 1 · SYNC — Plaid docks, holdings up, market tape starts ticking
  (s) => ({
    ...s,
    win: { ...s.win, plaid: 'docked', holdings: 'focus' },
    tapeOn: true,
    holdRows: HOLDINGS.length, holdFoot: true,
    threads: { ...s.threads, cA: false, t1: true },
    orbPos: 'sync', capIdx: 1,
  }),
  // 2 · RULES — holdings docks, mandate typed onto the rules node
  (s) => ({
    ...s,
    win: { ...s.win, holdings: 'docked' },
    rulesMode: 'docked', rulesTyped: RULES_TEXT.length,
    threads: { ...s.threads, t2: true },
    orbPos: 'rules', capIdx: 2,
  }),
  // 3 · RESEARCH — browser + watch card up, three signals landed
  (s) => ({
    ...s,
    win: { ...s.win, browser: 'focus', signals: 'focus' },
    tab: 2, hlOn: -1, sig: { sg0: true, sg1: true, sg2: true }, sigFoot: true,
    threads: { ...s.threads, t3: true },
    orbPos: 'research', capIdx: 3,
  }),
  // 4 · SIGNAL — browser + card dock, the model node fills to 0.89
  (s) => ({
    ...s,
    win: { ...s.win, browser: 'docked', signals: 'docked' },
    signalMode: 'focus', conf: 89, sigRowsIn: SIGNAL_ROWS.length,
    threads: { ...s.threads, t4: true },
    orbPos: 'signal', capIdx: 4,
  }),
  // 5 · APPROVE — model node docks, ticket built, Priya signs, order fills
  (s) => ({
    ...s,
    win: { ...s.win, ticket: 'focus' },
    signalMode: 'docked',
    ticketBuilt: true, queuedIn: true, approveWait: false,
    approveClicked: true, filledIn: true, auditIn: true,
    threads: { ...s.threads, t5: true },
    orbPos: 'approve', capIdx: 5,
  }),
  // 6 · WATCH — ticket docks, risk monitor settles, wide shot with the orb centred
  (s) => ({
    ...s,
    win: { ...s.win, ticket: 'docked', risk: 'docked' },
    riskRows: RISK_ROWS.length, wide: true,
    threads: { ...s.threads, t6: true, s1: true, s2: true, s3: true, s4: true, s5: true },
    orbPos: 'wide', orbSay: 'Before the market opened.', capIdx: 6,
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function InvestScene() {
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

  /** Flying signal chip: from a browser highlight box to a watch-card signal row. */
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
    const type = (t0: number, text: string, ms: number, key: 'rulesTyped') => {
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
        // CONNECT (setup) — the Plaid link modal links the accounts you hold.
        patch({ capIdx: 0, orbPos: 'connect', orbSay: '' });
        at(250, () => patch((p) => ({ win: { ...p.win, plaid: 'focus' } })));
        at(700, () => patch({ orbSay: 'Connecting to the accounts you already hold…' }));
        at(900, () => patch((p) => ({ threads: { ...p.threads, cA: true } })));
        PLAID_ACCTS.forEach((_, k) => at(1400 + k * 560, () => patch({ plaidAccts: k + 1 })));
        at(3300, () => patch({ plaidDone: true }));
        at(3700, () => patch({ orbSay: '$2.4M across three brokerages.' }));
        at(5200, done);
      } else if (i === 1) {
        // SYNC — Plaid docks; live holdings arrive; the market tape starts.
        patch({ capIdx: 1 });
        at(150, () => patch((p) => ({
          win: { ...p.win, plaid: 'docked' },
          threads: { ...p.threads, cA: false, t1: true },
        })));
        at(600, () => patch({ orbPos: 'sync', orbSay: 'Pulling every live position…' }));
        at(1050, () => patch((p) => ({ win: { ...p.win, holdings: 'focus' } })));
        at(1300, () => patch({ tapeOn: true }));
        HOLDINGS.forEach((_, k) => at(1700 + k * 400, () => patch({ holdRows: k + 1 })));
        at(3100, () => patch({ holdFoot: true, orbSay: 'Measured against what you actually hold.' }));
        at(4700, done);
      } else if (i === 2) {
        // RULES — holdings docks; the orb types your mandate onto the rules node.
        patch({ capIdx: 2 });
        at(150, () => patch((p) => ({
          win: { ...p.win, holdings: 'docked' },
          threads: { ...p.threads, t2: true },
        })));
        at(600, () => patch({ orbPos: 'rules', orbSay: 'Your limits go in first…' }));
        at(1050, () => patch({ rulesMode: 'focus' }));
        type(1350, RULES_TEXT, 26, 'rulesTyped');
        at(2300, () => patch({ orbSay: 'The engine can never breach these.' }));
        at(3600, () => patch({ rulesMode: 'docked', orbSay: '' }));
        at(4600, done);
      } else if (i === 3) {
        // RESEARCH (rising action) — the orb docks into the browser tab bar and
        // pulls signals; each one flies onto the watch card.
        patch({ capIdx: 3 });
        at(200, () => patch((p) => ({
          win: { ...p.win, browser: 'focus', signals: 'focus' },
          threads: { ...p.threads, t3: true }, tab: 0, hlOn: -1,
        })));
        at(500, () => patch({ orbPos: 'research', orbSay: 'Reading filings, earnings and news…' }));
        SIGNALS.forEach((sg, j) => {
          const t0 = 1300 + j * 1900;
          at(t0, () => patch({ tab: j, hlOn: j }));
          at(t0 + 650, () => ghost(j, sg.key, sg.ghost));
          at(t0 + 1250, () => patch((p) => ({ sig: { ...p.sig, [sg.key]: true } })));
        });
        at(6700, () => patch({ hlOn: -1, sigFoot: true, orbSay: '247 scanned — 14 worth acting on.' }));
        at(7900, done);
      } else if (i === 4) {
        // SIGNAL (the quant moment) — the SEPARATE model node (XGBoost · LSTM)
        // lights up and fills to 0.89. The orb only stands beside it.
        patch({ capIdx: 4 });
        at(150, () => patch((p) => ({
          win: { ...p.win, browser: 'docked', signals: 'docked' },
          threads: { ...p.threads, t4: true },
        })));
        at(650, () => patch({ orbPos: 'signal', orbSay: 'Handing the shortlist to the models…' }));
        at(1150, () => patch({ signalMode: 'focus' }));
        for (let k = 1; k <= 23; k++) at(1600 + k * 40, () => patch({ conf: Math.round((89 * k) / 23) }));
        at(2700, () => patch({ sigRowsIn: 1 }));
        at(3100, () => patch({ sigRowsIn: 2 }));
        at(3900, () => patch({ orbSay: '0.89 confidence — sized to your risk.' }));
        at(5400, done);
      } else if (i === 5) {
        // APPROVE (climax) — the ticket builds, then HOLDS on the amber gate.
        // A second order queues. Priya signs; the order fills and is logged.
        patch({ capIdx: 5 });
        at(150, () => patch((p) => ({
          signalMode: 'docked' as NodeMode,
          threads: { ...p.threads, t5: true },
        })));
        at(650, () => patch({ orbPos: 'approve', orbSay: 'Drafting the order — then stopping.' }));
        at(1150, () => patch((p) => ({ win: { ...p.win, ticket: 'focus' } })));
        at(1700, () => patch({ ticketBuilt: true }));
        at(2300, () => patch({ queuedIn: true }));
        at(2600, () => patch({ approveWait: true, orbSay: '' })); // amber gate holds ~2.5s
        at(5100, () => patch({ approveWait: false, approveClicked: true }));
        at(5600, () => patch({ filledIn: true, orbSay: 'Filled — logged who, when and why.' }));
        at(6300, () => patch({ auditIn: true }));
        at(7700, done);
      } else if (i === 6) {
        // WATCH (resolution) — the risk monitor settles green, then the wide
        // shot: the orb takes the centre of the chain it built.
        patch({ capIdx: 6 });
        at(150, () => patch((p) => ({
          win: { ...p.win, ticket: 'docked' },
          threads: { ...p.threads, t6: true },
        })));
        at(650, () => patch({ orbPos: 'watch', orbSay: 'Now it just watches the risk.' }));
        at(1150, () => patch((p) => ({ win: { ...p.win, risk: 'focus' } })));
        RISK_ROWS.forEach((_, k) => at(1600 + k * 430, () => patch({ riskRows: k + 1 })));
        at(3600, () => patch({ orbSay: 'Beta, Sharpe, drawdown — all in range.' }));
        at(4400, () => patch((p) => ({ win: { ...p.win, risk: 'docked' } })));
        at(5000, () => patch((p) => ({
          wide: true, pulse: true, orbPos: 'wide' as OrbPos, orbSay: 'Before the market opened.',
          threads: { ...p.threads, s1: true, s2: true, s3: true, s4: true, s5: true },
        })));
        at(6600, done);
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

  const rulesTyping = s.rulesTyped > 0 && s.rulesTyped < RULES_TEXT.length;
  const on = (b: boolean) => (b ? 'true' : 'false');
  const cap = CAPTIONS[s.capIdx];

  return (
    <div className={styles.scene} ref={shellRef}>
      <div
        className={styles.stage}
        ref={stageRef}
        data-pulse={on(s.pulse)}
        aria-label="Investment Research Engine — live demonstration"
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

          {/* Persistent market tape — a light ticker strip, always moving */}
          <div className={styles.tape} data-on={on(s.tapeOn)} aria-hidden="true">
            <div className={styles.tapeTrack}>
              {[...TAPE, ...TAPE].map((t, i) => (
                <span key={`${t.sym}-${i}`} className={styles.tapeItem} data-dir={t.dir}>
                  <b className={styles.tapeSym}>{t.sym}</b>
                  <span className={styles.tapePx}>{t.px}</span>
                  <span className={styles.tapeArrow}>{t.dir === 'up' ? '▲' : '▼'}</span>
                </span>
              ))}
            </div>
          </div>

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

          <span className={styles.vlink} data-on={on(s.win.plaid !== 'hidden')} aria-hidden="true" />

          {/* 0 · CONNECT — Plaid link modal */}
          <div className={`${styles.win} ${styles.wPlaid}`} data-mode={s.win.plaid}>
            <div className={styles.plaidTop}>
              <img src="/logos/plaid.png" alt="Plaid" width={46} height={17} className={styles.plaidLogo} />
              <span className={styles.plaidSecure}>secure link</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.plaidTitle}>Connect your accounts</div>
              <div className={styles.plaidSub}>Link the brokerages you already hold</div>
              {PLAID_ACCTS.map((a, i) => (
                <div key={a.name} className={styles.plaidRow} data-in={on(i < s.plaidAccts)}>
                  <img src={a.logo} alt={a.alt} width={20} height={20} className={styles.plaidRowLogo} />
                  <span className={styles.plaidRowName}>{a.name}</span>
                  <span className={styles.plaidRowBal}>{a.bal}</span>
                  <span className={styles.plaidCheck} aria-hidden="true">{'✓'}</span>
                </div>
              ))}
              <div className={styles.plaidFoot} data-in={on(s.plaidDone)}>$2.4M AUM · 47 holdings · live</div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.holdings !== 'hidden')} aria-hidden="true" />

          {/* 1 · SYNC — live holdings */}
          <div className={`${styles.win} ${styles.wHoldings}`} data-mode={s.win.holdings}>
            <div className={styles.tbar}>
              <img src="/logos/plaid.png" alt="Plaid" width={40} height={15} className={styles.tlogo} />
              <span className={styles.tname}>Live portfolio</span>
              <span className={styles.tsub}>real-time</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              {HOLDINGS.map((h, i) => (
                <div key={h.sym} className={styles.hRow} data-in={on(i < s.holdRows)}>
                  <span className={styles.hSym}>{h.sym}</span>
                  <span className={styles.hDetail}>{h.detail}</span>
                  <span className={styles.hDelta} data-dir={h.dir || 'flat'}>{h.dir === 'up' ? '▲' : h.dir === 'down' ? '▼' : ''}</span>
                </div>
              ))}
              <div className={styles.hFoot} data-in={on(s.holdFoot)}>+44 holdings · real-time prices</div>
            </div>
          </div>

          {/* The rules node — the mandate, typed by the orb, then docked (green tissue) */}
          <div className={`${styles.node} ${styles.rulesNode}`} data-mode={s.rulesMode}>
            <span className={styles.nodeTag}>Your rules · always enforced</span>
            <p className={styles.rulesText}>
              {RULES_TEXT.slice(0, s.rulesTyped)}
              <span className={styles.caret} data-on={on(rulesTyping)} aria-hidden="true" />
            </p>
          </div>

          <span className={styles.vlink} data-on={on(s.win.browser !== 'hidden')} aria-hidden="true" />

          {/* 3 · RESEARCH — browser on SEC EDGAR + news; the orb docks into the tab bar */}
          <div className={`${styles.win} ${styles.wBrowser}`} data-mode={s.win.browser}>
            <div className={styles.bTop}>
              <span className={styles.bDots} aria-hidden="true"><i /><i /><i /></span>
              <div className={styles.bTabs}>
                {RESEARCH_TABS.map((t, i) => (
                  <span key={t.label} className={styles.bTab} data-active={on(s.tab === i)}>
                    {t.logo ? <img src={t.logo} alt="SEC EDGAR" width={13} height={13} className={styles.bTabLogo} /> : null}
                    {t.label}
                  </span>
                ))}
              </div>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.bUrl}>{RESEARCH_URLS[s.tab]}</div>
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

          <span className={styles.vlink} data-on={on(s.win.signals !== 'hidden')} aria-hidden="true" />

          {/* The watch card — where research signals land */}
          <div className={`${styles.win} ${styles.wSignals}`} data-mode={s.win.signals}>
            <div className={styles.winBody}>
              <div className={styles.sigCardHead}>Watchlist signals</div>
              {SIGNALS.map((sg) => (
                <div key={sg.key} className={styles.sigRow} data-sig={sg.key} data-tone={sg.tone} data-in={on(s.sig[sg.key])}>
                  <span className={styles.sigGlyph} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <circle cx="7" cy="7" r="2" fill="currentColor" />
                      <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
                      <circle cx="7" cy="7" r="6.4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
                    </svg>
                  </span>
                  <span className={styles.sigText}><b>{sg.sym}</b> — {sg.txt}</span>
                </div>
              ))}
              <div className={styles.sigFoot} data-in={on(s.sigFoot)}>247 signals scanned · 14 high-conviction</div>
            </div>
          </div>

          {/* 4 · SIGNAL — the SEPARATE quant model node (XGBoost · LSTM) */}
          <div className={`${styles.node} ${styles.signalNode}`} data-mode={s.signalMode}>
            <span className={styles.nodeTag}>Signal models · XGBoost · LSTM</span>
            <div className={styles.sgCard}>
              <div className={styles.sgTop}>
                <span className={styles.sgSym}>NVDA · entry signal</span>
                <span className={styles.sgConf}>{(s.conf / 100).toFixed(2)}</span>
              </div>
              <div className={styles.sgBar}>
                <span className={styles.sgBarFill} style={{ width: `${s.conf}%` }} />
              </div>
              {SIGNAL_ROWS.map((r, i) => (
                <div key={r} className={styles.sgRow} data-in={on(i < s.sigRowsIn)}>{r}</div>
              ))}
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.ticket !== 'hidden')} aria-hidden="true" />

          {/* 5 · APPROVE — the IBKR order ticket + the amber human gate */}
          <div className={`${styles.win} ${styles.wTicket}`} data-mode={s.win.ticket}>
            <div className={styles.tbar}>
              <img src="/logos/ibkr.png" alt="Interactive Brokers" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Interactive Brokers</span>
              <span className={styles.tsub}>Order ticket</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.tkOrder} data-built={on(s.ticketBuilt)} data-filled={on(s.filledIn)}>
                <div className={styles.tkOrderHead}>
                  <span className={styles.tkSide}>BUY</span>
                  <span className={styles.tkQty}>40 NVDA</span>
                  <span className={styles.tkType}>market</span>
                  <span className={styles.tkAmt}>$14,800</span>
                </div>
                <div className={styles.tkFilled} data-in={on(s.filledIn)}>
                  <span className={styles.tkFilledCheck} aria-hidden="true">{'✓'}</span>
                  Filled @ $183.60 · IBKR #7841923 · 09:14 EST
                </div>
              </div>

              <div className={styles.tkBanner} data-show={on(s.ticketBuilt && !s.filledIn)} data-wait={on(s.approveWait)}>
                Awaiting Priya — nothing trades on its own
              </div>

              <div className={styles.tkQueued} data-in={on(s.queuedIn)}>
                <span className={styles.tkQueuedTag}>Queued for Priya</span>
                <span className={styles.tkQueuedOrder}>SELL 80 META · limit $492.00</span>
              </div>

              <div className={styles.tkApprover} data-in={on(s.filledIn)}>
                <img src="/demo/priya.png" alt="Priya M." width={22} height={22} className={styles.tkAvatar} />
                <span className={styles.tkApproverText}>Approved by Priya M., Portfolio Manager · 09:14 EST</span>
              </div>
              <div className={styles.tkAudit} data-in={on(s.auditIn)}>logged: who · when · why</div>
            </div>
          </div>

          <span className={styles.vlink} data-on={on(s.win.risk !== 'hidden')} aria-hidden="true" />

          {/* 6 · WATCH — the risk monitor */}
          <div className={`${styles.win} ${styles.wRisk}`} data-mode={s.win.risk}>
            <div className={styles.tbar}>
              <span className={styles.riskGlyph} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 10.5 L6 6.5 L9 9 L14 3.5" />
                  <path d="M2 13.5 H14" opacity="0.5" />
                </svg>
              </span>
              <span className={styles.tname}>Portfolio monitor</span>
              <span className={styles.tsub}>risk, live</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              {RISK_ROWS.map((r, i) => (
                <div key={r.lab} className={styles.riskRow} data-in={on(i < s.riskRows)}>
                  <span className={styles.riskLab}>{r.lab}</span>
                  <span className={styles.riskBar}>
                    <span className={styles.riskBarFill} style={{ width: `${r.pct}%` }} />
                  </span>
                  <span className={styles.riskVal}>{r.val}</span>
                  <span className={styles.riskNote}>{r.note}</span>
                  <span className={styles.riskCheck} aria-hidden="true">{'✓'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Receipt overlay ── */}
        <div className={styles.receipt} data-show={on(s.receipt)}>
          <div className={styles.receiptCard}>
            <p className={styles.receiptKicker}>This morning, before the open</p>
            <p className={styles.receiptTitle}>Your models ran. You approved. Nothing drifted.</p>
            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}><span>Portfolio synced</span><b className={styles.receiptHl}>$2.4M {'✓'}</b></div>
              <div className={styles.receiptRow}><span>Signals scanned</span><b>247</b></div>
              <div className={styles.receiptRow}><span>High-conviction</span><b className={styles.receiptHl}>14</b></div>
              <div className={styles.receiptRow}><span>Orders drafted</span><b>2</b></div>
              <div className={styles.receiptRow}><span>Human approvals</span><b className={styles.receiptHl}>100%</b></div>
            </div>
            <div className={styles.receiptSigner}>
              <img src="/demo/priya.png" alt="Priya M." width={24} height={24} className={styles.receiptAvatar} />
              <span>Signed off by Priya M., Portfolio Manager</span>
            </div>
            <BookButton className={styles.receiptCta} location="investment-research-engine-scene-receipt">
              Backtest your actual holdings →
            </BookButton>
            <span className={styles.receiptFine}>
              <span className={styles.fineLogos}>
                {FINE_LOGOS.map((l) => (
                  <img key={l.src} src={l.src} alt={l.alt} width={14} height={14} />
                ))}
              </span>
              We connect your brokerage and run the models. You approve every trade.
            </span>
          </div>
        </div>
      </div>

      <p className={styles.orchNote}>
        Chronexa doesn&rsquo;t sell an AI or a trading strategy. We orchestrate proven models — XGBoost, LSTM, Claude — with your
        brokerage and your sign-off. We build the system; you own every decision.
      </p>
      <p className={styles.hint}>Click a step above to jump · the run loops on its own</p>
    </div>
  );
}
