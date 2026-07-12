'use client';

/**
 * DocIntelScene — the Document Intelligence Engine hero demo.
 *
 * One reserve study (Willow Creek HOA, 47 documents) built on screen inside a
 * bright, familiar app window. The wow-moment is HANDWRITING: a photographed,
 * handwritten inspection sheet read correctly on screen, field by field, with
 * per-field confidence. Low-confidence reads route to a named engineer's tray.
 * Loops while in view; the stepper scrubs to any beat.
 *
 * Design rule (2026-07-11): client-facing surfaces are friendly software —
 * tool logos, named humans, plain English. No terminal chrome.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './DocIntelScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type SheetKey = 'r1' | 'r2' | 'r3';
type TrayKey = 't1' | 't2' | 't3';
type SlotKey = 'docs' | 'fields' | 'comps' | 'reserve' | 'flags' | 'report';
type ViewKey = 'files' | 'sheet' | 'table' | 'model' | 'qa' | 'report';

const STEPS = ['Collect', 'Read', 'Organise', 'Calculate', 'Check', 'Deliver'] as const;

const FILES = [
  { name: '2026 inspection photos — 18 JPGs (from a phone)', src: 'from Google Drive', ico: 1, lab: 'JPG' },
  { name: 'Handwritten assessment sheets — 3', src: 'photographed on-site', ico: 2, lab: 'HW' },
  { name: '2024 reserve study (prior year)', src: 'from SharePoint', ico: 3, lab: 'PDF' },
  { name: 'HOA financials — 3 years', src: 'from Box', ico: 4, lab: 'XLS' },
];
const DOC_ICO_CLASS = [styles.docC1, styles.docC2, styles.docC3, styles.docC4];

const SHEET_ROWS: { key: SheetKey; text: string; chip: string; tone: 'green' | 'amber' }[] = [
  { key: 'r1', text: 'HVAC unit 14 — 8 yrs, cond. fair', chip: '94% ✓', tone: 'green' },
  { key: 'r2', text: 'Roof section C — patched 2023', chip: '97% ✓', tone: 'green' },
  { key: 'r3', text: 'Pool pump 3 — replaced?, $14,200', chip: '61% → flagged', tone: 'amber' },
];

const TABLE_ROWS = [
  { name: 'HVAC', qty: '23 units', note: 'avg 8.2 yrs' },
  { name: 'Roofing', qty: '180,000 sq ft', note: 'installed 2018' },
  { name: 'Pool equipment', qty: '4 systems', note: '2 near end of life' },
  { name: 'Paving', qty: '42,000 sq ft', note: 'condition fair' },
];

const QA_ROWS: { key: string; tone: 'green' | 'amber'; text: string }[] = [
  { key: 'q1', tone: 'green', text: '845 of 847 data points validated' },
  { key: 'q2', tone: 'amber', text: 'Unit 14: reported life 12 yrs vs expected 8' },
  { key: 'q3', tone: 'amber', text: 'Pool pump 3: $14,200 vs RS Means $8,800' },
];

const REPORT_ROWS = [
  '30-year funding plan',
  'Excel model attached — auditable formulas',
  'Certification page → ready for PE stamp',
];

const SLOTS: { key: SlotKey; label: string; amber?: boolean }[] = [
  { key: 'docs', label: 'Documents in' },
  { key: 'fields', label: 'Fields read' },
  { key: 'comps', label: 'Components structured' },
  { key: 'reserve', label: 'Reserve required' },
  { key: 'flags', label: 'Flags for Robert', amber: true },
  { key: 'report', label: 'Report' },
];

const TRAY_ITEMS: { key: TrayKey; text: string; fix: string }[] = [
  { key: 't1', text: 'Page 34, field 4 — handwriting read at 61% confidence.', fix: 'Confirmed from the photo — $14,200 ✓' },
  { key: 't2', text: 'Unit 14: reported life 12 yrs vs expected 8.', fix: 'Confirmed 8 yrs — inspector error ✓' },
  { key: 't3', text: 'Pool pump 3: $14,200 vs RS Means $8,800.', fix: 'Quote verified — premium pump ✓' },
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  connected: { gd: boolean; sp: boolean; bx: boolean; rs: boolean; xl: boolean };
  filesIn: number;
  moreIn: boolean;
  view: ViewKey;
  hl: Partial<Record<SheetKey, 'green' | 'amber'>>;
  tableIn: number;
  tableFoot: boolean;
  modelIn: number;
  calcReq: number; // $M, counts up to 2.1
  calcFunded: number; // %, counts up to 61
  chipIn: number;
  qaIn: number;
  reportIn: number;
  pages: number; // report page counter, ticks to 89
  slots: Partial<Record<SlotKey, string>>;
  trayIn: Record<TrayKey, boolean>;
  trayResolved: Record<TrayKey, boolean>;
  trayCount: string;
  ringPct: number;
  ringLabel: string;
  toast: string;
  toastDone: boolean;
  engMeta: string;
  receipt: boolean;
  paneTitle: string;
}

const INITIAL: SceneState = {
  step: 0,
  connected: { gd: false, sp: false, bx: false, rs: false, xl: false },
  filesIn: 0,
  moreIn: false,
  view: 'files',
  hl: {},
  tableIn: 0,
  tableFoot: false,
  modelIn: 0,
  calcReq: 0,
  calcFunded: 0,
  chipIn: 0,
  qaIn: 0,
  reportIn: 0,
  pages: 0,
  slots: {},
  trayIn: { t1: false, t2: false, t3: false },
  trayResolved: { t1: false, t2: false, t3: false },
  trayCount: '0 items',
  ringPct: 0,
  ringLabel: 'waiting for documents',
  toast: 'Starting the engine…',
  toastDone: false,
  engMeta: 'reviews every flag',
  receipt: false,
  paneTitle: 'Documents coming in',
};

/** Cumulative end-state per beat — lets the stepper scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  (s) => ({
    ...s,
    connected: { ...s.connected, gd: true, sp: true, bx: true },
    filesIn: FILES.length, moreIn: true,
    slots: { ...s.slots, docs: '47' },
    ringPct: 12, ringLabel: '47 documents in',
  }),
  (s) => ({
    ...s,
    view: 'sheet',
    hl: { r1: 'green', r2: 'green', r3: 'amber' },
    trayIn: { ...s.trayIn, t1: true }, trayCount: '1 item',
    slots: { ...s.slots, fields: '847 · 94% handwriting' },
    ringPct: 34, ringLabel: '847 fields read',
    paneTitle: 'Reading the handwritten sheet',
  }),
  (s) => ({
    ...s,
    view: 'table', tableIn: TABLE_ROWS.length, tableFoot: true,
    slots: { ...s.slots, comps: '18' },
    ringPct: 52, ringLabel: '18 categories',
    paneTitle: 'Structuring the data',
  }),
  (s) => ({
    ...s,
    view: 'model',
    connected: { ...s.connected, rs: true },
    modelIn: 3, calcReq: 2.1, calcFunded: 61, chipIn: 2,
    slots: { ...s.slots, reserve: '$2.1M' },
    ringPct: 72, ringLabel: '$2.1M computed',
    paneTitle: 'Running the reserve model',
  }),
  (s) => ({
    ...s,
    view: 'qa', qaIn: QA_ROWS.length,
    trayIn: { t1: true, t2: true, t3: true }, trayCount: '3 items',
    slots: { ...s.slots, flags: '2' },
    ringPct: 88, ringLabel: '2 flags',
    paneTitle: 'Checking every number',
  }),
  (s) => ({
    ...s,
    view: 'report',
    connected: { ...s.connected, xl: true },
    reportIn: 1 + REPORT_ROWS.length, pages: 89,
    trayResolved: { t1: true, t2: true, t3: true }, trayCount: '0 open',
    slots: { ...s.slots, report: '89 pages' },
    ringPct: 100, ringLabel: 'report ready',
    engMeta: 'signed off — 2 judgement calls, not a re-review',
    paneTitle: 'Assembling the deliverable',
  }),
];

const FINAL_TOAST = '4 hours instead of 14 days — with a full audit trail';

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocIntelScene() {
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

  /** Flying amber chip from a flagged field to Robert's tray. */
  const ghost = useCallback((fromId: string, text: string) => {
    const win = windowRef.current;
    if (!win) return;
    const from = win.querySelector<HTMLElement>(`[data-fid="${fromId}"]`);
    const to = win.querySelector<HTMLElement>('[data-traycount]');
    if (!from || !to) return;
    const wr = win.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const g = document.createElement('span');
    g.className = styles.ghost;
    g.textContent = text;
    g.style.left = `${a.right - wr.left - 80}px`;
    g.style.top = `${a.top - wr.top}px`;
    win.appendChild(g);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        g.style.transform = `translate(${b.left - a.right + 80}px, ${b.top - a.top}px)`;
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
      setS({ ...fin, step: 6, receipt: true, toastDone: true, toast: FINAL_TOAST });
      return;
    }

    const playBeat = (i: number, done: () => void) => {
      patch({ step: i });
      if (i === 0) {
        patch({ paneTitle: 'Documents coming in', toast: 'Collecting Willow Creek’s documents from Google Drive, SharePoint and Box…', toastDone: false });
        at(200, () => patch((p) => ({ connected: { ...p.connected, gd: true } })));
        at(600, () => patch((p) => ({ connected: { ...p.connected, sp: true } })));
        at(1000, () => patch((p) => ({ connected: { ...p.connected, bx: true } })));
        FILES.forEach((_, k) => at(500 + k * 450, () => patch({ filesIn: k + 1 })));
        at(2600, () => patch((p) => ({
          moreIn: true, ringPct: 12, ringLabel: '47 documents in',
          slots: { ...p.slots, docs: '47' },
          toast: '47 documents in — 312 pages, 18 phone photos, 3 handwritten sheets', toastDone: true,
        })));
        at(5000, done);
      } else if (i === 1) {
        patch({ paneTitle: 'Reading the handwritten sheet', toast: 'Opening the handwritten assessment sheet — photographed on-site…', toastDone: false, view: 'sheet', hl: {} });
        at(900, () => patch({
          hl: { r1: 'green' },
          toast: 'Reading the handwritten sheet — 94% confidence, photographed on an iPhone', toastDone: true,
        }));
        at(2300, () => patch((p) => ({ hl: { ...p.hl, r2: 'green' as const } })));
        at(3600, () => patch((p) => ({
          hl: { ...p.hl, r3: 'amber' as const },
          toast: 'One field read at 61% confidence — set aside for Robert, not guessed', toastDone: true,
        })));
        at(4400, () => {
          ghost('r3', '→ for Robert');
          patch((p) => ({ trayIn: { ...p.trayIn, t1: true }, trayCount: '1 item' }));
        });
        at(5800, () => patch((p) => ({
          ringPct: 34, ringLabel: '847 fields read',
          slots: { ...p.slots, fields: '847 · 94% handwriting' },
          toast: '847 fields read across 312 pages — every one with a confidence score', toastDone: true,
        })));
        at(9000, done);
      } else if (i === 2) {
        patch({ paneTitle: 'Structuring the data', toast: 'Organising 847 data points into component categories…', toastDone: false, view: 'table', tableIn: 0, tableFoot: false });
        TABLE_ROWS.forEach((_, k) => at(500 + k * 550, () => patch({ tableIn: k + 1 })));
        at(2700, () => patch({ tableFoot: true }));
        at(3300, () => patch((p) => ({
          ringPct: 52, ringLabel: '18 categories',
          slots: { ...p.slots, comps: '18' },
          toast: '18 categories structured — ready for the financial model', toastDone: true,
        })));
        at(5200, done);
      } else if (i === 3) {
        patch({ paneTitle: 'Running the reserve model', toast: 'Running the 30-year projection with RS Means cost data…', toastDone: false, view: 'model', modelIn: 0, calcReq: 0, calcFunded: 0, chipIn: 0 });
        at(200, () => patch((p) => ({ connected: { ...p.connected, rs: true } })));
        at(500, () => patch({ modelIn: 1, calcReq: 0.7 }));
        at(850, () => patch({ calcReq: 1.4 }));
        at(1200, () => patch({ calcReq: 2.1 }));
        at(1700, () => patch({ modelIn: 2, calcFunded: 24 }));
        at(2000, () => patch({ calcFunded: 45 }));
        at(2300, () => patch({ calcFunded: 61 }));
        at(2800, () => patch({ modelIn: 3 }));
        at(3300, () => patch({ chipIn: 1 }));
        at(3700, () => patch({ chipIn: 2 }));
        at(4200, () => patch((p) => ({
          ringPct: 72, ringLabel: '$2.1M computed',
          slots: { ...p.slots, reserve: '$2.1M' },
          toast: '$2.1M required over 30 years — every number traces to a source page', toastDone: true,
        })));
        at(5800, done);
      } else if (i === 4) {
        patch({ paneTitle: 'Checking every number', toast: 'Cross-checking against the prior study and RS Means benchmarks…', toastDone: false, view: 'qa', qaIn: 0 });
        at(600, () => patch({ qaIn: 1 }));
        at(1500, () => patch({ qaIn: 2 }));
        at(2100, () => {
          ghost('q2', '→ for Robert');
          patch((p) => ({ trayIn: { ...p.trayIn, t2: true }, trayCount: '2 items' }));
        });
        at(3000, () => patch({ qaIn: 3 }));
        at(3600, () => {
          ghost('q3', '→ for Robert');
          patch((p) => ({ trayIn: { ...p.trayIn, t3: true }, trayCount: '3 items' }));
        });
        at(4300, () => patch((p) => ({
          ringPct: 88, ringLabel: '2 flags',
          slots: { ...p.slots, flags: '2' },
          toast: '845 of 847 validated — 2 need Robert’s judgement, not a re-review', toastDone: true,
        })));
        at(6000, done);
      } else if (i === 5) {
        patch({ paneTitle: 'Assembling the deliverable', toast: 'Robert reviews the flags — source photo and extracted value, side by side…', toastDone: false, view: 'report', reportIn: 0, pages: 0 });
        at(700, () => patch((p) => ({ trayResolved: { ...p.trayResolved, t1: true } })));
        at(1500, () => patch((p) => ({ trayResolved: { ...p.trayResolved, t2: true } })));
        at(2300, () => patch({
          trayResolved: { t1: true, t2: true, t3: true }, trayCount: '0 open',
          engMeta: 'signed off — 2 judgement calls, not a re-review',
        }));
        at(2900, () => patch((p) => ({
          connected: { ...p.connected, xl: true },
          toast: 'Assembling the report — 89 pages, Excel model, certification page…', toastDone: false,
        })));
        at(3100, () => patch({ reportIn: 1, pages: 18 }));
        at(3350, () => patch({ pages: 41 }));
        at(3600, () => patch({ pages: 67 }));
        at(3850, () => patch({ pages: 89 }));
        at(4200, () => patch({ reportIn: 2 }));
        at(4700, () => patch({ reportIn: 3 }));
        at(5200, () => patch({ reportIn: 4 }));
        at(5700, () => patch((p) => ({
          ringPct: 100, ringLabel: 'report ready',
          slots: { ...p.slots, report: '89 pages' },
          toast: 'Ready for Robert’s PE stamp — 4 hours after the documents arrived', toastDone: true,
        })));
        at(7000, done);
      } else {
        patch({ step: 6 });
        at(300, () => patch({ receipt: true, toast: FINAL_TOAST, toastDone: true }));
        at(6800, done);
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

  return (
    <div className={styles.scene} ref={shellRef}>
      <div className={styles.window} ref={windowRef} aria-label="Document Intelligence Engine — live demonstration">

        {/* ── Window chrome ── */}
        <div className={styles.chrome}>
          <div className={styles.dots} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.chromeTitle}>Chronexa · Document Intelligence Engine</span>
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
                <span className={`${styles.avatar} ${styles.avatarWc}`}>WC</span>
                <div>
                  <div className={styles.clientName}>Willow Creek HOA</div>
                  <div className={styles.clientMeta}>Reserve study · 2026</div>
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
                <span className={styles.ringLabel}><b>Study progress</b><br />{s.ringLabel}</span>
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Connected</div>
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
                <span className={`${styles.logo} ${styles.logoSp}`}>SP</span>SharePoint
                {s.connected.sp && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoBx}`}>bx</span>Box
                {s.connected.bx && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoRs}`}>RS</span>RS Means cost data
                {s.connected.rs && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoXl}`}>X</span>Excel
                {s.connected.xl && <span className={styles.appStatus}>Connected</span>}
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Your engineer</div>
              <div className={styles.engRow}>
                <span className={`${styles.avatar} ${styles.avatarRc}`}>RC</span>
                <div>
                  <div className={styles.engName}>Robert C., Principal Engineer</div>
                  <div className={styles.engMeta}>{s.engMeta}</div>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.main}>
            {/* ── Left: the work happening ── */}
            <div className={styles.workL}>
              <span className={styles.paneTitle}>{s.paneTitle}</span>

              {s.view === 'files' && (
                <div className={styles.docGrid}>
                  {FILES.map((f, i) => (
                    <div key={f.name} className={styles.docCard} data-in={i < s.filesIn ? 'true' : 'false'}>
                      <span className={`${styles.docIco} ${DOC_ICO_CLASS[f.ico - 1]}`}>{f.lab}</span>
                      <div className={styles.docText}>
                        <div className={styles.docName}>{f.name}</div>
                        <div className={styles.docSrc}>{f.src}</div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.docMore} data-in={s.moreIn ? 'true' : 'false'}>+43 more · 312 pages</div>
                </div>
              )}

              {s.view === 'sheet' && (
                <div className={styles.sheet}>
                  <div className={styles.sheetHead}>Component Assessment — Building C <span className={styles.sheetSub}>(photographed on-site)</span></div>
                  {SHEET_ROWS.map((r) => (
                    <div key={r.key} className={styles.inkRow} data-fid={r.key} data-hl={s.hl[r.key] ?? ''}>
                      <span className={styles.inkText}>{r.text}</span>
                      <span className={styles.confChip} data-tone={r.tone}>{r.chip}</span>
                    </div>
                  ))}
                </div>
              )}

              {s.view === 'table' && (
                <div className={styles.dataTable}>
                  <div className={styles.tableHead}>
                    <span>Component</span><span>Quantity</span><span>Condition</span>
                  </div>
                  {TABLE_ROWS.map((r, i) => (
                    <div key={r.name} className={styles.tableRow} data-in={i < s.tableIn ? 'true' : 'false'}>
                      <span className={styles.tableName}>{r.name}</span>
                      <span className={styles.tableQty}>{r.qty}</span>
                      <span className={styles.tableNote}>{r.note}</span>
                    </div>
                  ))}
                  <div className={styles.tableFoot} data-in={s.tableFoot ? 'true' : 'false'}>18 categories · 847 data points</div>
                </div>
              )}

              {s.view === 'model' && (
                <div className={styles.modelCard}>
                  <div className={styles.modelRow} data-in={s.modelIn >= 1 ? 'true' : 'false'}>
                    <span className={styles.modelVal}>${s.calcReq.toFixed(1)}M</span>
                    <span className={styles.modelLab}>required over 30 years</span>
                  </div>
                  <div className={styles.modelRow} data-in={s.modelIn >= 2 ? 'true' : 'false'}>
                    <span className={styles.modelVal}>{s.calcFunded}%</span>
                    <span className={styles.modelLab}>funded today</span>
                  </div>
                  <div className={styles.modelRow} data-in={s.modelIn >= 3 ? 'true' : 'false'}>
                    <span className={styles.modelVal}>$124,000</span>
                    <span className={styles.modelLab}>annual contribution</span>
                  </div>
                  <div className={styles.chipRow}>
                    <span className={styles.yearChip} data-in={s.chipIn >= 1 ? 'true' : 'false'}>HVAC → Year 4 · $380k</span>
                    <span className={styles.yearChip} data-in={s.chipIn >= 2 ? 'true' : 'false'}>Roof → Year 7 · $540k</span>
                  </div>
                </div>
              )}

              {s.view === 'qa' && (
                <div className={styles.qaCard}>
                  {QA_ROWS.map((r, i) => (
                    <div key={r.key} className={styles.qaRow} data-fid={r.key} data-tone={r.tone} data-in={i < s.qaIn ? 'true' : 'false'}>
                      <span className={styles.qaMark}>{r.tone === 'green' ? '✓' : '!'}</span>
                      <span className={styles.qaText}>{r.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {s.view === 'report' && (
                <div className={styles.reportCard}>
                  <div className={styles.reportHead} data-in={s.reportIn >= 1 ? 'true' : 'false'}>
                    <span className={styles.reportTitle}>Reserve study — <span className={styles.pageCount}>{s.pages}</span> pages</span>
                  </div>
                  {REPORT_ROWS.map((r, i) => (
                    <div key={r} className={styles.reportRow} data-in={i + 2 <= s.reportIn ? 'true' : 'false'}>
                      <span className={styles.reportCheck}>{'✓'}</span>
                      <span className={styles.reportText}>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: the study being built ── */}
            <div className={styles.workR}>
              <span className={styles.paneTitle}>The study being built</span>
              <div className={styles.slotsCard}>
                {SLOTS.map((sl) => (
                  <div key={sl.key} className={styles.slotRow} data-filled={s.slots[sl.key] ? 'true' : 'false'} data-amber={sl.amber ? 'true' : 'false'}>
                    <span className={styles.slotCheck}>{sl.amber ? '!' : '✓'}</span>
                    <span className={styles.slotLab}>{sl.label}</span>
                    <span className={styles.slotVal}>{s.slots[sl.key] ?? '—'}</span>
                  </div>
                ))}
              </div>

              <div className={styles.tray}>
                <div className={styles.trayHead}>
                  <span className={styles.trayTitle}>For Robert&rsquo;s judgement</span>
                  <span className={styles.trayCount} data-traycount="true">{s.trayCount}</span>
                </div>
                <div className={styles.trayBody}>
                  {TRAY_ITEMS.map((it) => (
                    <div key={it.key} className={styles.trayItem} data-in={s.trayIn[it.key] ? 'true' : 'false'} data-resolved={s.trayResolved[it.key] ? 'true' : 'false'}>
                      <span className={styles.trayMark}>!</span>
                      <span className={styles.trayText}>{it.text}&nbsp;<span className={styles.trayFix}>{it.fix}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Receipt overlay ── */}
            <div className={styles.receipt} data-show={s.receipt ? 'true' : 'false'}>
              <div className={styles.receiptCard}>
                <svg className={styles.bigCheck} viewBox="0 0 54 54" aria-hidden="true">
                  <circle cx="27" cy="27" r="24" />
                  <path d="M17 28l7 7 14-15" />
                </svg>
                <p className={styles.receiptTitle}>A 14-day reserve study, delivered in 4 hours.</p>
                <p className={styles.receiptSub}>Robert made 2 judgement calls. The engine did the other 845.</p>
                <div className={styles.receiptRows}>
                  <div className={styles.receiptRow}><span>Documents processed</span><b>47</b></div>
                  <div className={styles.receiptRow}><span>Fields extracted</span><b>847 · 94% on handwriting</b></div>
                  <div className={styles.receiptRow}><span>Reserve computed</span><b>$2.1M · fully auditable</b></div>
                  <div className={styles.receiptRow}><span>Engineer review</span><b>2 flags</b></div>
                  <div className={styles.receiptRow}>
                    <span>Turnaround</span>
                    <b><span className={styles.receiptHl}>4 hrs</span> <span className={styles.receiptOld}>14 days</span></b>
                  </div>
                </div>
                <BookButton className={styles.receiptCta} location="document-intelligence-engine-scene-receipt">
                  Run it on 10 of your documents →
                </BookButton>
                <span className={styles.receiptFine}>
                  We show you extraction accuracy side-by-side with your ground truth — before you commit.<br />
                  <b>PDFs, scans, photos, handwriting.</b>
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
