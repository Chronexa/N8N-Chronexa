'use client';

/**
 * CpaTaxScene — the CPA & Tax Engine hero demo.
 *
 * One client's return (Marcus Chen, 42 documents) built on screen inside a
 * bright, familiar app window: documents are collected, sorted, read field by
 * field into a Form 1040, gaps are chased by email, and a named preparer
 * approves and e-files. Loops while in view; the stepper scrubs to any beat.
 *
 * Design rule (2026-07-11): client-facing surfaces are friendly software —
 * tool logos, named humans, plain English. No terminal chrome.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './CpaTaxScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type DocKey = 'w2' | 'div' | 'k1' | 'b';
type RetKey = 'wages' | 'div' | 'sche1' | 'schd' | 'sche2' | 'carry';
type RevKey = 'p1' | 'p2' | 'p3';

const STEPS = ['Collect', 'Sort', 'Read', 'Chase', 'Fill', 'File'] as const;

const FILES = [
  { name: 'W-2 — Meridian Capital', src: 'from TaxDome', ico: 1, lab: 'W-2', badge: 'W-2' },
  { name: '1099-DIV — Fidelity', src: 'from Google Drive', ico: 2, lab: '1099', badge: '1099-DIV' },
  { name: '1099-B — Schwab · 38 pgs', src: 'from Google Drive', ico: 3, lab: '1099', badge: '1099-B' },
  { name: 'K-1 — Stonegate Partners', src: 'from TaxDome', ico: 4, lab: 'K-1', badge: 'K-1' },
  { name: 'K-1 — Chen & Assoc. LLC', src: 'from SmartVault', ico: 5, lab: 'K-1', badge: 'K-1' },
  { name: '2023 return — prior year', src: 'from TaxDome', ico: 6, lab: '1040', badge: 'Prior yr' },
];
const DOC_ICO_CLASS = [styles.docC1, styles.docC2, styles.docC3, styles.docC4, styles.docC5, styles.docC6];

const DOCS: Record<DocKey, { form: string; issuer: string; rows: { id: string; lab: string; val: string }[] }> = {
  w2: {
    form: 'Form W-2 · 2025', issuer: 'Meridian Capital Group',
    rows: [
      { id: 'w2b1', lab: 'Box 1 · Wages, tips, other comp.', val: '$287,400' },
      { id: 'w2b2', lab: 'Box 2 · Federal tax withheld', val: '$61,208' },
      { id: 'w2b12', lab: 'Box 12a · 401(k) — Code D', val: '$23,000' },
    ],
  },
  div: {
    form: 'Form 1099-DIV · 2025', issuer: 'Fidelity Investments',
    rows: [
      { id: 'div1a', lab: '1a · Total ordinary dividends', val: '$16,910' },
      { id: 'div1b', lab: '1b · Qualified dividends', val: '$14,230' },
    ],
  },
  k1: {
    form: 'Schedule K-1 (1065)', issuer: 'Stonegate Partners II LP',
    rows: [
      { id: 'k1b2', lab: 'Box 2 · Net rental income', val: '$31,400' },
      { id: 'k1b20', lab: 'Box 20 · Code AH — see stmt.', val: 'attached' },
    ],
  },
  b: {
    form: 'Form 1099-B · Composite', issuer: 'Charles Schwab · 127 lots',
    rows: [
      { id: 'blot42', lab: 'Lot 42 · NVDA · 60 sh — proceeds', val: '$11,016' },
      { id: 'blot43', lab: 'Lot 43 · purchase price', val: 'missing' },
      { id: 'blot44', lab: 'Lot 44 · MSFT · 25 sh — proceeds', val: '$10,405' },
    ],
  },
};

const RET_LINES: { key: RetKey; label: string }[] = [
  { key: 'wages', label: 'Wages — Meridian Capital' },
  { key: 'div', label: 'Dividends — Fidelity' },
  { key: 'sche1', label: 'Rental income — Stonegate LP' },
  { key: 'schd', label: 'Stock sales — Schwab, 127 lots' },
  { key: 'sche2', label: 'Business loss — Chen & Assoc.' },
  { key: 'carry', label: 'Carried forward from 2023' },
];

const REV_ITEMS: { key: RevKey; text: string; fix: string }[] = [
  { key: 'p1', text: 'K-1 Box 20 has a code we don’t auto-fill — set aside.', fix: 'Sarah applied §199A ✓' },
  { key: 'p2', text: 'One stock sale is missing its purchase price.', fix: 'Confirmed with Marcus: $4,200 ✓' },
  { key: 'p3', text: 'Foreign account from last year isn’t in this year’s file.', fix: 'FBAR Form 114 queued ✓' },
];

const MORE_PENDING = '45 smaller items — each linked to its source page';
const MORE_RESOLVED = '45 smaller items — resolved in the review screen';

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  connected: { td: boolean; gd: boolean; sv: boolean; ut: boolean; irs: boolean };
  filesIn: number;
  moreIn: boolean;
  badgesIn: number;
  view: 'grid' | 'paper' | 'email';
  doc: DocKey;
  hl: Partial<Record<string, 'green' | 'amber'>>;
  filled: Partial<Record<RetKey, string>>;
  retStatus: string;
  retGood: boolean;
  revIn: Record<RevKey | 'more', boolean>;
  resolved: Record<RevKey, boolean>;
  moreText: string;
  revCount: string;
  emailClicked: boolean;
  emailSent: boolean;
  approveIn: boolean;
  approveClicked: boolean;
  filed: boolean;
  ringPct: number;
  ringLabel: string;
  toast: string;
  toastDone: boolean;
  prepMeta: string;
  receipt: boolean;
  paneTitle: string;
}

const INITIAL: SceneState = {
  step: 0,
  connected: { td: false, gd: false, sv: false, ut: true, irs: false },
  filesIn: 0,
  moreIn: false,
  badgesIn: 0,
  view: 'grid',
  doc: 'w2',
  hl: {},
  filled: {},
  retStatus: 'waiting',
  retGood: false,
  revIn: { p1: false, p2: false, p3: false, more: false },
  resolved: { p1: false, p2: false, p3: false },
  moreText: MORE_PENDING,
  revCount: '0 items',
  emailClicked: false,
  emailSent: false,
  approveIn: false,
  approveClicked: false,
  filed: false,
  ringPct: 0,
  ringLabel: 'waiting for documents',
  toast: 'Starting the engine…',
  toastDone: false,
  prepMeta: 'reviews everything before filing',
  receipt: false,
  paneTitle: 'Documents',
};

/** Cumulative end-state per beat — lets the stepper scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  (s) => ({
    ...s,
    connected: { ...s.connected, td: true, gd: true, sv: true },
    filesIn: FILES.length, moreIn: true,
    ringPct: 8, ringLabel: '42 documents in',
  }),
  (s) => ({ ...s, badgesIn: FILES.length, ringPct: 16, ringLabel: '18 types identified' }),
  (s) => ({
    ...s,
    view: 'paper', doc: 'b',
    hl: { blot43: 'amber' },
    filled: { wages: '$287,400', div: '$14,230', sche1: '$31,400' },
    retStatus: 'filling…',
    revIn: { ...s.revIn, p1: true, p2: true }, revCount: '2 items',
    ringPct: 38, ringLabel: '1,847 fields read',
    paneTitle: 'Reading each document',
  }),
  (s) => ({
    ...s,
    view: 'email', emailClicked: true, emailSent: true,
    revIn: { ...s.revIn, p3: true }, revCount: '3 items',
    ringLabel: '2 items requested',
    paneTitle: 'Chasing what’s missing',
  }),
  (s) => ({
    ...s,
    filled: { ...s.filled, schd: 'mapped ✓', sche2: '($8,420)', carry: '$12,100' },
    retStatus: '94% pre-filled', retGood: true,
    revIn: { ...s.revIn, more: true }, revCount: '48 items',
    ringPct: 94, ringLabel: 'ready for Sarah',
  }),
  (s) => ({
    ...s,
    resolved: { p1: true, p2: true, p3: true },
    moreText: MORE_RESOLVED, revCount: '0 open',
    approveIn: true, approveClicked: true, filed: true,
    retStatus: 'e-filed ✓',
    connected: { ...s.connected, irs: true },
    ringPct: 100, ringLabel: 'filed with the IRS',
    prepMeta: 'reviewed & signed in 18 minutes',
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CpaTaxScene() {
  const shellRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
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

  /** Flying value chip from a document field to a return line (or review tray). */
  const ghost = useCallback((fromId: string, toKey: string | null, text: string, amber?: boolean) => {
    const win = windowRef.current;
    if (!win) return;
    const from = win.querySelector<HTMLElement>(`[data-fid="${fromId}"]`);
    const to = toKey
      ? win.querySelector<HTMLElement>(`[data-rline="${toKey}"]`)
      : win.querySelector<HTMLElement>('[data-revcount]');
    if (!from || !to) return;
    const wr = win.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const g = document.createElement('span');
    g.className = styles.ghost;
    if (amber) g.dataset.amber = 'true';
    g.textContent = text;
    g.style.left = `${a.right - wr.left - 80}px`;
    g.style.top = `${a.top - wr.top}px`;
    win.appendChild(g);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        g.style.transform = `translate(${b.left - a.right + 80 + (toKey ? to.offsetWidth - 120 : 0)}px, ${b.top - a.top}px)`;
        g.style.opacity = '0';
      });
    });
    window.setTimeout(() => g.remove(), 700);
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
      setS({ ...fin, step: 6, receipt: true, toastDone: true, toast: '18 minutes of review instead of 4.5 hours of typing' });
      return;
    }

    const playBeat = (i: number, done: () => void) => {
      patch({ step: i });
      if (i === 0) {
        patch({ toast: 'Collecting Marcus’s documents from TaxDome, Google Drive and SmartVault…', toastDone: false });
        at(200, () => patch((p) => ({ connected: { ...p.connected, td: true } })));
        at(650, () => patch((p) => ({ connected: { ...p.connected, gd: true } })));
        at(1050, () => patch((p) => ({ connected: { ...p.connected, sv: true } })));
        FILES.forEach((_, k) => at(500 + k * 400, () => patch({ filesIn: k + 1 })));
        at(500 + FILES.length * 400 + 150, () => patch({
          moreIn: true, ringPct: 8, ringLabel: '42 documents in',
          toast: '42 documents collected — no one uploaded anything by hand', toastDone: true,
        }));
        at(4700, done);
      } else if (i === 1) {
        patch({ toast: 'Sorting documents by type…', toastDone: false });
        FILES.forEach((_, k) => at(300 + k * 430, () => patch({ badgesIn: k + 1 })));
        at(300 + FILES.length * 430 + 250, () => patch({
          ringPct: 16, ringLabel: '18 types identified',
          toast: 'Every document identified — nothing unrecognised', toastDone: true,
        }));
        at(4300, done);
      } else if (i === 2) {
        patch({ paneTitle: 'Reading each document', toast: 'Reading Marcus’s W-2 from Meridian Capital…', toastDone: false });
        at(150, () => patch({ view: 'paper', doc: 'w2', hl: {}, retStatus: 'filling…' }));
        at(900, () => patch({ hl: { w2b1: 'green' } }));
        at(1250, () => { ghost('w2b1', 'wages', '$287,400'); patch({ ringPct: 14, ringLabel: 'reading W-2…' }); });
        at(1930, () => patch((p) => ({ filled: { ...p.filled, wages: '$287,400' } })));
        at(2400, () => patch({ doc: 'div', hl: {}, toast: 'Reading the Fidelity 1099-DIV…', toastDone: false }));
        at(2900, () => patch({ hl: { div1b: 'green' } }));
        at(3250, () => { ghost('div1b', 'div', '$14,230'); patch({ ringPct: 24, ringLabel: 'reading 1099s…' }); });
        at(3930, () => patch((p) => ({ filled: { ...p.filled, div: '$14,230' } })));
        at(4400, () => patch({ doc: 'k1', hl: {}, toast: 'Reading the Stonegate K-1…', toastDone: false }));
        at(4900, () => patch({ hl: { k1b2: 'green' } }));
        at(5250, () => { ghost('k1b2', 'sche1', '$31,400'); patch({ ringPct: 38, ringLabel: 'reading K-1s…' }); });
        at(5930, () => patch((p) => ({ filled: { ...p.filled, sche1: '$31,400' } })));
        at(6200, () => patch((p) => ({
          hl: { ...p.hl, k1b20: 'amber' as const },
          toast: 'Box 20 has a code we don’t auto-fill — setting it aside for Sarah', toastDone: true,
        })));
        at(6650, () => {
          ghost('k1b20', null, '→ for Sarah', true);
          patch((p) => ({ revIn: { ...p.revIn, p1: true }, revCount: '1 item' }));
        });
        at(7900, () => patch({ doc: 'b', hl: {}, toast: 'Checking all 127 stock sales on the Schwab statement…', toastDone: false }));
        at(8500, () => patch((p) => ({
          hl: { ...p.hl, blot43: 'amber' as const },
          toast: 'One sale is missing its purchase price — set aside, not guessed', toastDone: true,
        })));
        at(8950, () => {
          ghost('blot43', null, '→ for Sarah', true);
          patch((p) => ({ revIn: { ...p.revIn, p2: true }, revCount: '2 items', ringPct: 38, ringLabel: '1,847 fields read' }));
        });
        at(10300, done);
      } else if (i === 3) {
        patch({ paneTitle: 'Chasing what’s missing', toast: 'Comparing this year’s file against Marcus’s 2023 return…', toastDone: false });
        at(200, () => patch({ view: 'email' }));
        at(1400, () => patch({ toast: 'Found 2 gaps — drafting a reminder to Marcus', toastDone: true }));
        at(2400, () => patch((p) => ({ revIn: { ...p.revIn, p3: true }, revCount: '3 items' })));
        at(3300, () => patch({ emailClicked: true }));
        at(3700, () => patch({
          emailSent: true, ringLabel: '2 items requested',
          toast: 'Reminder sent through TaxDome — with the exact items, not “please send documents”', toastDone: true,
        }));
        at(5600, done);
      } else if (i === 4) {
        patch({ toast: 'Filling the return in UltraTax CS…', toastDone: false });
        at(500, () => patch((p) => ({ filled: { ...p.filled, schd: 'mapped ✓' } })));
        at(1100, () => patch((p) => ({ filled: { ...p.filled, sche2: '($8,420)' } })));
        at(1700, () => patch((p) => ({ filled: { ...p.filled, carry: '$12,100' } })));
        at(2400, () => patch({ ringPct: 94, ringLabel: 'ready for Sarah', retStatus: '94% pre-filled', retGood: true }));
        at(3100, () => patch((p) => ({
          revIn: { ...p.revIn, more: true }, revCount: '48 items',
          toast: 'Return 94% pre-filled — 48 items queued for Sarah, each with its source page', toastDone: true,
        })));
        at(5100, done);
      } else if (i === 5) {
        patch({ toast: 'Sarah reviews — source document and extracted value, side by side…', toastDone: false });
        at(900, () => patch((p) => ({ resolved: { ...p.resolved, p1: true } })));
        at(1900, () => patch((p) => ({ resolved: { ...p.resolved, p2: true } })));
        at(2900, () => patch({ resolved: { p1: true, p2: true, p3: true }, moreText: MORE_RESOLVED, revCount: '0 open' }));
        at(3700, () => patch({ approveIn: true, prepMeta: 'reviewing flagged items…' }));
        at(4600, () => patch({ approveClicked: true }));
        at(5000, () => patch((p) => ({
          filed: true, retStatus: 'e-filed ✓',
          connected: { ...p.connected, irs: true },
          ringPct: 100, ringLabel: 'filed with the IRS',
          prepMeta: 'reviewed & signed in 18 minutes',
          toast: 'E-filed with the IRS — through the firm’s own software and EFIN', toastDone: true,
        })));
        at(6600, done);
      } else {
        patch({ step: 6 });
        at(300, () => patch({ receipt: true, toast: '18 minutes of review instead of 4.5 hours of typing', toastDone: true }));
        at(7000, done);
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

  const doc = DOCS[s.doc];

  return (
    <div className={styles.scene} ref={shellRef}>
      <div className={styles.window} ref={windowRef} aria-label="CPA & Tax Engine — live demonstration">

        {/* ── Window chrome ── */}
        <div className={styles.chrome}>
          <div className={styles.dots} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.chromeTitle}>Chronexa · CPA &amp; Tax Engine</span>
          <span className={styles.livePill}><i aria-hidden="true" />Live run</span>
        </div>

        {/* ── Stepper ── */}
        <div className={styles.stepper} role="tablist" aria-label="Pipeline steps">
          {STEPS.map((name, i) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={s.step === i}
              className={styles.step}
              data-state={i < s.step ? 'done' : i === s.step ? 'active' : 'idle'}
              onClick={() => goTo(i)}
            >
              <span className={styles.stepDot}>{i < s.step ? '✓' : i + 1}</span>
              <span className={styles.stepName}>{name}</span>
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>
          <aside className={styles.side}>
            <div className={styles.sideCard}>
              <div className={styles.clientRow}>
                <span className={`${styles.avatar} ${styles.avatarMc}`}>MC</span>
                <div>
                  <div className={styles.clientName}>Marcus Chen</div>
                  <div className={styles.clientMeta}>Form 1040 · Tax year 2025</div>
                </div>
              </div>
              <div className={styles.ringWrap}>
                <div className={styles.ring}>
                  <svg width="62" height="62" viewBox="0 0 62 62" aria-hidden="true">
                    <circle className={styles.ringBg} cx="31" cy="31" r="26" />
                    <circle
                      className={styles.ringFg} cx="31" cy="31" r="26"
                      style={{ strokeDashoffset: 163.4 * (1 - s.ringPct / 100) }}
                    />
                  </svg>
                  <span className={styles.ringPct}>{s.ringPct}%</span>
                </div>
                <span className={styles.ringLabel}><b>Return progress</b><br />{s.ringLabel}</span>
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Connected</div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoTd}`}>TD</span>TaxDome
                {s.connected.td && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoGd}`}>
                  <svg width="15" height="14" viewBox="0 0 24 21" aria-hidden="true">
                    <path fill="#4285F4" d="M15.5 0H8.5L20 21h4z" transform="scale(0.85)" />
                    <path fill="#FBBC04" d="M8.5 0L0 15.5 3.5 21 12 6z" transform="scale(0.85)" />
                    <path fill="#34A853" d="M3.5 21h13L20 15.5H7z" transform="scale(0.85)" />
                  </svg>
                </span>Google Drive
                {s.connected.gd && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoSv}`}>SV</span>SmartVault
                {s.connected.sv && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoUt}`}>UT</span>UltraTax CS
                {s.connected.ut && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoIrs}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 13l5 5L20 7" />
                  </svg>
                </span>IRS e-file
                {s.connected.irs && <span className={styles.appStatus}>Connected</span>}
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Your preparer</div>
              <div className={styles.prepRow}>
                <span className={`${styles.avatar} ${styles.avatarSk}`}>SK</span>
                <div>
                  <div className={styles.prepName}>Sarah Klein, CPA</div>
                  <div className={styles.prepMeta}>{s.prepMeta}</div>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.main}>
            {/* ── Left: documents / paper / email ── */}
            <div className={styles.workL}>
              <span className={styles.paneTitle}>{s.paneTitle}</span>

              {s.view === 'grid' && (
                <div className={styles.docGrid}>
                  {FILES.map((f, i) => (
                    <div key={f.name} className={styles.docCard} data-in={i < s.filesIn ? 'true' : 'false'}>
                      <span className={`${styles.docIco} ${DOC_ICO_CLASS[f.ico - 1]}`}>{f.lab}</span>
                      <div className={styles.docText}>
                        <div className={styles.docName}>{f.name}</div>
                        <div className={styles.docSrc}>{f.src}</div>
                      </div>
                      <span className={styles.docBadge} data-in={i < s.badgesIn ? 'true' : 'false'}>{f.badge}</span>
                    </div>
                  ))}
                  <div className={styles.docMore} data-in={s.moreIn ? 'true' : 'false'}>+ 36 more collected automatically</div>
                </div>
              )}

              {s.view === 'paper' && (
                <div className={styles.paper}>
                  <div className={styles.paperHead}>
                    <span className={styles.paperForm}>{doc.form}</span>
                    <span className={styles.paperIssuer}>{doc.issuer}</span>
                  </div>
                  {doc.rows.map((r) => (
                    <div key={r.id} className={styles.field} data-fid={r.id} data-hl={s.hl[r.id] ?? ''}>
                      <span className={styles.fieldLab}>{r.lab}</span>
                      <span className={styles.fieldVal}>{r.val}<span className={styles.fieldCheck}>{'✓'}</span></span>
                    </div>
                  ))}
                </div>
              )}

              {s.view === 'email' && (
                <div className={styles.email}>
                  <div className={styles.emailBar}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                    New message · sent via TaxDome
                  </div>
                  <div className={styles.emailBody}>
                    <div className={styles.emailRow}><span className={styles.emailK}>To</span><span className={styles.emailV}>Marcus Chen</span></div>
                    <div className={styles.emailRow}><span className={styles.emailK}>Subject</span><span className={styles.emailV}>Two items needed to finish your 2025 return</span></div>
                    <div className={styles.emailLines}>
                      Hi Marcus — we&rsquo;re nearly done. Still needed:<br />
                      <b>1. K-1 from Stonegate Partners</b> (they filed an extension)<br />
                      <b>2. Your HSBC account statement</b> — it was on last year&rsquo;s return
                    </div>
                  </div>
                  <div className={styles.emailFoot}>
                    <button type="button" className={styles.sendBtn} data-clicked={s.emailClicked ? 'true' : 'false'} tabIndex={-1} aria-hidden="true">
                      Send reminder
                    </button>
                    <span className={styles.sentTag} data-in={s.emailSent ? 'true' : 'false'}>Sent {'✓'} · Marcus will get a friendly nudge</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: the return being built ── */}
            <div className={styles.workR}>
              <span className={styles.paneTitle}>The return being built</span>
              <div className={styles.returnCard}>
                <div className={styles.retHead}>
                  <span className={`${styles.logo} ${styles.logoUt} ${styles.retLogo}`}>UT</span>
                  <span className={styles.retTitle}>Form 1040 — Marcus Chen</span>
                  <span className={styles.retSoft} data-good={s.retGood ? 'true' : 'false'}>{s.retStatus}</span>
                </div>
                <div className={styles.retBody}>
                  {RET_LINES.map((l) => (
                    <div key={l.key} className={styles.retLine} data-rline={l.key} data-filled={s.filled[l.key] ? 'true' : 'false'}>
                      <span className={styles.retCheck}>{'✓'}</span>
                      <span className={styles.retLab}>{l.label}</span>
                      <span className={styles.retVal}>{s.filled[l.key] ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.review}>
                <div className={styles.revHead}>
                  <span className={styles.revTitle}>For Sarah&rsquo;s review</span>
                  <span className={styles.revCount} data-revcount="true">{s.revCount}</span>
                </div>
                <div className={styles.revBody}>
                  {REV_ITEMS.map((it) => (
                    <div key={it.key} className={styles.revItem} data-in={s.revIn[it.key] ? 'true' : 'false'} data-resolved={s.resolved[it.key] ? 'true' : 'false'}>
                      <span className={styles.revMark}>!</span>
                      <span className={styles.revText}>{it.text}&nbsp;<span className={styles.revFix}>{it.fix}</span></span>
                    </div>
                  ))}
                  <div className={styles.revItem} data-in={s.revIn.more ? 'true' : 'false'}>
                    <span className={styles.revMark}>·</span>
                    <span className={styles.revText}>{s.moreText}</span>
                  </div>
                </div>
              </div>

              <div className={styles.fileRow}>
                <button
                  type="button"
                  className={styles.approveBtn}
                  data-in={s.approveIn ? 'true' : 'false'}
                  data-clicked={s.approveClicked ? 'true' : 'false'}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  Approve &amp; e-file
                </button>
                <span className={styles.filedTag} data-in={s.filed ? 'true' : 'false'}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 13l5 5L20 7" />
                  </svg>
                  E-filed with the IRS
                </span>
              </div>
            </div>

            {/* ── Receipt overlay ── */}
            <div className={styles.receipt} data-show={s.receipt ? 'true' : 'false'}>
              <div className={styles.receiptCard}>
                <svg className={styles.bigCheck} viewBox="0 0 54 54" aria-hidden="true">
                  <circle cx="27" cy="27" r="24" />
                  <path d="M17 28l7 7 14-15" />
                </svg>
                <p className={styles.receiptTitle}>Marcus&rsquo;s return is ready — filed in one sitting.</p>
                <p className={styles.receiptSub}>Sarah reviewed 48 flagged items with full context. Everything else was already done.</p>
                <div className={styles.receiptRows}>
                  <div className={styles.receiptRow}><span>Documents collected for Sarah</span><b>42</b></div>
                  <div className={styles.receiptRow}><span>Fields read &amp; double-checked</span><b>1,847</b></div>
                  <div className={styles.receiptRow}><span>Return pre-filled</span><b className={styles.receiptHl}>94%</b></div>
                  <div className={styles.receiptRow}><span>Sarah&rsquo;s review time</span><b className={styles.receiptHl}>18 min</b></div>
                  <div className={styles.receiptRow}><span>The old way</span><b className={styles.receiptOld}>~4.5 hours</b></div>
                </div>
                <BookButton className={styles.receiptCta} location="cpa-tax-engine-scene-receipt">
                  See it on one of your returns →
                </BookButton>
                <span className={styles.receiptFine}>
                  We run a de-identified prior-year return through the engine, live on a call.<br />
                  Works with <b>UltraTax CS · CCH Axcess · Drake · Lacerte · ProConnect</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Toast ── */}
        <div className={styles.toastWrap}>
          <div className={styles.toast} data-done={s.toastDone ? 'true' : 'false'} role="status" aria-live="polite">
            <span className={styles.toastSpin} aria-hidden="true" />
            <span className={styles.toastCheck} aria-hidden="true">{'✓'}</span>
            <span className={styles.toastText}>{s.toast}</span>
          </div>
        </div>
      </div>

      <p className={styles.hint}>Click a step above to jump · the run loops on its own</p>
    </div>
  );
}
