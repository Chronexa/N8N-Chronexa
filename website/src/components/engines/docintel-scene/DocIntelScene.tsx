'use client';

/**
 * DocIntelScene — the Document Intelligence Engine hero demo.
 *
 * NOT an app window. An open dark stage where real tools enter as bright
 * windows and dock into a conveyor: Google Drive (intake) → a green classifier
 * node → a document viewer (the HANDWRITING hero) → Excel (visible formulas) →
 * a finished report that files BACK into Drive (full circle). After the reserve-
 * study pass, a fast montage coda re-fires the chain for two other verticals
 * (insurance, mortgage) to prove versatility.
 *
 * THE WOW is HANDWRITING: a photographed handwritten inspection sheet read on
 * screen, each scrawled line lifting into a clean field with a confidence score
 * — and the one field it is unsure of routes to Robert, it does not guess.
 *
 * ATTRIBUTION (client mandate): Chronexa owns no AI or OCR product. The orb is
 * "AI agent · Claude" — the reading/extraction is Claude + vision models the
 * engine orchestrates; Google Drive, Excel and the report template are the
 * firm's own tools.
 *
 * Movie structure: setup (Collect → Classify), the hero (Read), the model
 * (Compute), the trust peak (Check — flags to Robert), the payoff (Deliver →
 * back to Drive), versatility (montage), resolution (wide shot). Loops (~50s).
 *
 * Green (#67B035) is reserved for Chronexa (orb, threads, node, rail); amber
 * marks the human-review moments only (the 61% field + the 2 QA flags).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './DocIntelScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type WinKey = 'drive' | 'viewer' | 'excel' | 'report';
type Mode = 'hidden' | 'focus' | 'docked';
type NodeMode = 'hidden' | 'focus' | 'docked';
type OrbPos = 'collect' | 'classify' | 'read' | 'compute' | 'check' | 'deliver' | 'wide';
type ThreadKey = 't0' | 't1' | 't2' | 't3' | 't4' | 's1' | 's2' | 's3' | 's4' | 's5';

const STEPS = ['Collect', 'Classify', 'Read', 'Compute', 'Check', 'Deliver'] as const;

const CAPTIONS: { lead: string; amber?: string }[] = [
  { lead: 'It takes documents in any shape — PDFs, scans, phone photos, handwriting — from wherever they live.' },
  { lead: 'It sorts the pile by type, so each document goes to the right specialist reader.' },
  { lead: 'The hard part: it reads a photo of a handwritten sheet at 94% — and flags the one field it isn’t sure of.' },
  { lead: 'It runs your own model — the same spreadsheet math — and every figure traces back to a source document.' },
  { lead: 'It checks its own work and hands Robert ', amber: 'the 2 judgement calls — not a full re-review.' },
  { lead: 'Out comes a finished report in your firm’s own format — back in your Drive, ready for the PE stamp.' },
];

const DRIVE_FILES: { name: string; kind: string }[] = [
  { name: '18 site photos — iPhone (JPG)', kind: 'Photos' },
  { name: '3 handwritten assessment sheets', kind: 'Handwritten' },
  { name: '2024 reserve study — prior year', kind: 'PDF' },
  { name: 'HOA financials — 3 years', kind: 'PDF' },
];

const CLASS_CHIPS = ['Photos ×18', 'Handwritten ×3', 'PDFs ×24', 'Prior-year ×1'];

/** The handwritten inspection sheet, read line by line into clean fields. */
const HAND_ROWS: { raw: string; clean: string; conf: string; amber: boolean }[] = [
  { raw: 'HVAC unit 14 — 8 yrs, cond. fair', clean: 'HVAC #14 · age 8 · fair', conf: '94%', amber: false },
  { raw: 'Roof section C — patched 2023', clean: 'Roof C · patched 2023', conf: '97%', amber: false },
  { raw: 'Pool pump 3 — approx $14,200', clean: 'Pool pump 3 · $14,200', conf: '88%', amber: false },
  { raw: 'p.34 f.4 — (smudged) ……', clean: 'Flagged for Robert', conf: '61%', amber: true },
];

const MODEL_ROWS: { lab: string; val: string }[] = [
  { lab: '30-year need', val: '$2.1M' },
  { lab: 'Funded today', val: '61% ($1.28M)' },
  { lab: 'Annual contribution', val: '$124,000' },
];
const TIMELINE_CHIPS = ['HVAC → Year 4 · $380k', 'Roof → Year 7 · $540k'];

const QA_FLAGS: { text: string; fix: string }[] = [
  { text: 'HVAC Unit 14 — reported life 12 yrs vs expected 8', fix: 'confirmed 8 yrs — inspector typo' },
  { text: 'Pool pump 3 — $14,200 vs RS Means $8,800', fix: 'premium pump — quote verified' },
];

const REPORT_ROWS = [
  'Reserve Study — 89 pages',
  '30-year funding plan',
  'Excel model attached — auditable',
  'Certification page → ready for PE stamp',
];

const MONTAGE = [
  'Insurance claim · 40–80 pp → adjuster report',
  'Mortgage file · appraisal + tax returns → underwriting summary',
];

const FINE_LOGOS: { src: string; alt: string }[] = [
  { src: '/logos/gdrive.svg', alt: 'Google Drive' },
  { src: '/logos/sharepoint.png', alt: 'SharePoint' },
  { src: '/logos/box.png', alt: 'Box' },
  { src: '/logos/excel.svg', alt: 'Excel' },
  { src: '/logos/rsmeans.png', alt: 'RS Means' },
];

const THREAD_PATHS: { key: ThreadKey; d: string }[] = [
  { key: 't0', d: 'M170,300 C260,320 340,336 420,344' },   // drive → classifier
  { key: 't1', d: 'M470,300 C500,320 520,336 540,344' },   // classifier → viewer
  { key: 't2', d: 'M300,330 C420,352 560,360 640,350' },   // viewer → excel
  { key: 't3', d: 'M660,330 C740,352 820,356 880,350' },   // excel → report
  { key: 't4', d: 'M880,300 C700,240 400,210 200,300' },   // report → back to drive
  { key: 's1', d: 'M488,296 C400,268 250,205 150,300' },
  { key: 's2', d: 'M480,306 C380,330 240,344 150,352' },
  { key: 's3', d: 'M514,296 C640,268 760,215 852,300' },
  { key: 's4', d: 'M518,306 C640,330 800,344 878,350' },
  { key: 's5', d: 'M512,312 C600,392 690,452 720,500' },
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number;
  capIdx: number;
  orbPos: OrbPos;
  orbSay: string;
  win: Record<WinKey, Mode>;
  classMode: NodeMode;
  // collect
  filesIn: number;
  spConnected: boolean;
  boxConnected: boolean;
  // classify
  classChipsIn: number;
  // read
  readIn: number;   // clean fields revealed
  scanRow: number;  // which handwritten row the scan is on (-1 = off)
  // compute
  formula: number;  // 0 none, 1 SLN, 2 RS Means
  modelIn: number;
  timelineIn: number;
  // check
  qaValidated: boolean;
  flagsIn: number;
  robertIn: boolean;
  flagsResolved: number;
  // deliver
  reportIn: number;
  pageCount: number;
  reportFiled: boolean;
  // montage
  montage: number; // 0 off, 1 insurance, 2 mortgage
  // tissue + finale
  threads: Record<ThreadKey, boolean>;
  wide: boolean;
  pulse: boolean;
  receipt: boolean;
}

const NO_THREADS: Record<ThreadKey, boolean> = {
  t0: false, t1: false, t2: false, t3: false, t4: false,
  s1: false, s2: false, s3: false, s4: false, s5: false,
};

const INITIAL: SceneState = {
  step: 0,
  capIdx: 0,
  orbPos: 'collect',
  orbSay: '',
  win: { drive: 'hidden', viewer: 'hidden', excel: 'hidden', report: 'hidden' },
  classMode: 'hidden',
  filesIn: 0,
  spConnected: false,
  boxConnected: false,
  classChipsIn: 0,
  readIn: 0,
  scanRow: -1,
  formula: 0,
  modelIn: 0,
  timelineIn: 0,
  qaValidated: false,
  flagsIn: 0,
  robertIn: false,
  flagsResolved: 0,
  reportIn: 0,
  pageCount: 0,
  reportFiled: false,
  montage: 0,
  threads: { ...NO_THREADS },
  wide: false,
  pulse: false,
  receipt: false,
};

/** Cumulative end-state per beat — lets the rail scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  (s) => ({
    ...s,
    win: { ...s.win, drive: 'focus' },
    filesIn: DRIVE_FILES.length, spConnected: true, boxConnected: true,
    orbPos: 'collect', capIdx: 0,
  }),
  (s) => ({
    ...s,
    win: { ...s.win, drive: 'docked' },
    classMode: 'focus', classChipsIn: CLASS_CHIPS.length,
    threads: { ...s.threads, t0: true },
    orbPos: 'classify', capIdx: 1,
  }),
  (s) => ({
    ...s,
    classMode: 'docked',
    win: { ...s.win, viewer: 'focus' },
    readIn: HAND_ROWS.length, scanRow: -1,
    threads: { ...s.threads, t0: false, t1: true },
    orbPos: 'read', capIdx: 2,
  }),
  (s) => ({
    ...s,
    win: { ...s.win, viewer: 'docked', excel: 'focus' },
    formula: 2, modelIn: MODEL_ROWS.length, timelineIn: TIMELINE_CHIPS.length,
    threads: { ...s.threads, t1: false, t2: true },
    orbPos: 'compute', capIdx: 3,
  }),
  (s) => ({
    ...s,
    qaValidated: true, flagsIn: QA_FLAGS.length, robertIn: true, flagsResolved: QA_FLAGS.length,
    orbPos: 'check', capIdx: 4,
  }),
  (s) => ({
    ...s,
    win: { drive: 'docked', viewer: 'docked', excel: 'docked', report: 'docked' },
    classMode: 'docked',
    reportIn: REPORT_ROWS.length, pageCount: 89, reportFiled: true,
    threads: {
      ...s.threads, t2: false, t3: false, t4: false,
      s1: true, s2: true, s3: true, s4: true, s5: true,
    },
    wide: true, orbPos: 'wide', orbSay: '14 days of typing → 4 hours.', capIdx: 5,
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocIntelScene() {
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

  /** Flying chip: a value lifting off the handwritten sheet, or the report filing back to Drive. */
  const fly = useCallback((fromSel: string, toSel: string, text: string, amber?: boolean) => {
    const stage = stageRef.current;
    if (!stage) return;
    const from = stage.querySelector<HTMLElement>(fromSel);
    const to = stage.querySelector<HTMLElement>(toSel);
    if (!from || !to) return;
    const wr = stage.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const g = document.createElement('span');
    g.className = amber ? `${styles.ghost} ${styles.ghostAmber}` : styles.ghost;
    g.textContent = text;
    g.style.left = `${a.left - wr.left + a.width / 2 - 30}px`;
    g.style.top = `${a.top - wr.top + a.height / 2}px`;
    stage.appendChild(g);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        g.style.transform = `translate(${b.left - a.left + (b.width - a.width) / 2}px, ${b.top - a.top + (b.height - a.height) / 2}px)`;
        g.style.opacity = '0';
      });
    });
    window.setTimeout(() => g.remove(), 780);
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
        patch({ capIdx: 0, orbPos: 'collect', orbSay: '' });
        at(200, () => patch((p) => ({ win: { ...p.win, drive: 'focus' } })));
        at(500, () => patch({ spConnected: true }));
        at(800, () => patch({ boxConnected: true }));
        DRIVE_FILES.forEach((_, k) => at(700 + k * 420, () => patch({ filesIn: k + 1 })));
        at(700 + DRIVE_FILES.length * 420 + 200, () => patch({
          orbSay: 'Every file — even a phone photo of a handwritten sheet — pulled in and deduplicated.',
        }));
        at(4700, done);
      } else if (i === 1) {
        patch({ capIdx: 1 });
        at(150, () => patch((p) => ({
          win: { ...p.win, drive: 'docked' }, classMode: 'focus',
          threads: { ...p.threads, t0: true },
        })));
        at(600, () => patch({ orbPos: 'classify', orbSay: 'Sorting 47 files — each type to its own reader.' }));
        CLASS_CHIPS.forEach((_, k) => at(1000 + k * 380, () => patch({ classChipsIn: k + 1 })));
        at(3800, done);
      } else if (i === 2) {
        // READ — the handwriting hero
        patch({ capIdx: 2 });
        at(150, () => patch((p) => ({
          classMode: 'docked', win: { ...p.win, viewer: 'focus' },
          threads: { ...p.threads, t0: false, t1: true }, readIn: 0, scanRow: -1,
        })));
        at(650, () => patch({ orbPos: 'read', orbSay: 'Reading the handwriting — photographed on-site.' }));
        HAND_ROWS.forEach((row, k) => {
          const t0 = 1100 + k * 1500;
          at(t0, () => patch({ scanRow: k }));
          at(t0 + 700, () => fly(`[data-hand="${k}"]`, `[data-field="${k}"]`, row.conf, row.amber));
          at(t0 + 1150, () => patch({ readIn: k + 1 }));
        });
        const endRead = 1100 + HAND_ROWS.length * 1500;
        at(endRead - 200, () => patch({ scanRow: -1, orbSay: '94% on handwriting — and it flags what it isn’t sure of.' }));
        at(endRead + 500, done);
      } else if (i === 3) {
        // COMPUTE — Excel with visible formulas
        patch({ capIdx: 3 });
        at(150, () => patch((p) => ({
          win: { ...p.win, viewer: 'docked', excel: 'focus' },
          threads: { ...p.threads, t1: false, t2: true }, formula: 0, modelIn: 0, timelineIn: 0,
        })));
        at(650, () => patch({ orbPos: 'compute', orbSay: 'Your Excel model — run automatically, every figure traceable.', formula: 1 }));
        at(1400, () => patch({ formula: 2 }));
        MODEL_ROWS.forEach((_, k) => at(1800 + k * 560, () => patch({ modelIn: k + 1 })));
        TIMELINE_CHIPS.forEach((_, k) => at(3600 + k * 400, () => patch({ timelineIn: k + 1 })));
        at(4900, done);
      } else if (i === 4) {
        // CHECK — the trust peak, flags to Robert
        patch({ capIdx: 4 });
        at(300, () => patch({ orbPos: 'check', qaValidated: true, orbSay: 'It checks its own work first.' }));
        at(900, () => patch({ flagsIn: 1 }));
        at(1400, () => patch({ flagsIn: 2 }));
        at(2000, () => patch({ robertIn: true, orbSay: 'Robert gets the 2 calls that need judgement.' }));
        at(2800, () => patch({ flagsResolved: 1 }));
        at(3400, () => patch({ flagsResolved: 2, orbSay: '' }));
        at(4400, done);
      } else if (i === 5) {
        // DELIVER — report assembles, files back to Drive, then the montage coda
        patch({ capIdx: 5 });
        at(150, () => patch((p) => ({
          win: { ...p.win, excel: 'docked', report: 'focus' },
          threads: { ...p.threads, t2: false, t3: true },
        })));
        at(650, () => patch({ orbPos: 'deliver', orbSay: 'Formatted to your template — 89 pages.' }));
        REPORT_ROWS.forEach((_, k) => at(1000 + k * 420, () => patch({ reportIn: k + 1 })));
        for (let k = 1; k <= 18; k++) {
          const v = Math.round((89 * k) / 18);
          at(1200 + k * 55, () => patch({ pageCount: v }));
        }
        at(2700, () => patch((p) => ({ threads: { ...p.threads, t4: true } })));
        at(2900, () => { fly('[data-fly="report"]', '[data-fly="drive"]', 'Reserve Study.pdf'); patch({ reportFiled: true, orbSay: 'Filed back in your Drive.' }); });
        // montage coda — the same chain, two more verticals, fast
        at(3900, () => patch({ montage: 1, orbSay: '' }));
        at(5100, () => patch({ montage: 2 }));
        at(6300, () => patch((p) => ({
          montage: 0,
          win: { drive: 'docked', viewer: 'docked', excel: 'docked', report: 'docked' },
          classMode: 'docked' as NodeMode,
          wide: true, pulse: true, orbPos: 'wide' as OrbPos, orbSay: '14 days of typing → 4 hours.',
          threads: { ...p.threads, t3: false, t4: false, s1: true, s2: true, s3: true, s4: true, s5: true },
        })));
        at(7900, done);
      } else {
        patch({ step: 6 });
        at(400, () => patch({ receipt: true }));
        at(6600, done);
      }
    };

    const run = (i: number) => {
      if (tokenRef.current !== myToken) return;
      if (i > 6) {
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
    const id = window.setTimeout(() => {
      if (reduced || inView) goTo(0);
      else { stop(); setS(INITIAL); }
    }, 0);
    return () => { window.clearTimeout(id); stop(); };
  }, [inView, reduced, goTo, stop]);

  const on = (b: boolean) => (b ? 'true' : 'false');
  const cap = CAPTIONS[s.capIdx];

  return (
    <div className={styles.scene} ref={shellRef}>
      <div
        className={styles.stage}
        ref={stageRef}
        data-pulse={on(s.pulse)}
        aria-label="Document Intelligence Engine — live demonstration"
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

        {/* ── Montage banner (versatility coda) ── */}
        <div className={styles.montage} data-show={on(s.montage > 0)}>
          <span className={styles.montageDot} aria-hidden="true" />
          <span className={styles.montageText}>
            {s.montage === 1 ? MONTAGE[0] : s.montage === 2 ? MONTAGE[1] : ''}
          </span>
          <span className={styles.montageTag}>same engine</span>
        </div>

        {/* ── The desktop: threads + the AI orb + tool windows ── */}
        <div className={styles.world} data-wide={on(s.wide)}>
          <svg className={styles.threads} viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            {THREAD_PATHS.map((t) => (
              <path key={t.key} className={styles.thread} d={t.d} data-on={on(s.threads[t.key])} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>

          {/* The protagonist: the AI agent (Claude) orb */}
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

          {/* 0 · COLLECT — Google Drive intake */}
          <div className={`${styles.win} ${styles.wDrive}`} data-mode={s.win.drive} data-fly="drive">
            <div className={styles.tbar}>
              <img src="/logos/gdrive.svg" alt="Google Drive" width={20} height={18} className={styles.tlogo} />
              <span className={styles.tname}>Google Drive</span>
              <span className={styles.tsub}>Willow Creek HOA</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.srcRow}>
                <span className={styles.srcChip} data-on={on(true)}>Drive</span>
                <span className={styles.srcChip} data-on={on(s.spConnected)}>
                  <img src="/logos/sharepoint.png" alt="" width={11} height={11} />SharePoint
                </span>
                <span className={styles.srcChip} data-on={on(s.boxConnected)}>
                  <img src="/logos/box.png" alt="" width={11} height={11} />Box
                </span>
              </div>
              <div className={styles.fileList}>
                {DRIVE_FILES.map((f, i) => (
                  <div key={f.name} className={styles.fileRow} data-in={on(i < s.filesIn)}>
                    <span className={styles.fileIco} data-kind={f.kind} aria-hidden="true" />
                    <span className={styles.fileName}>{f.name}</span>
                  </div>
                ))}
              </div>
              <div className={styles.driveFoot}>47 documents · 312 pages · deduplicated</div>
            </div>
          </div>

          {/* 1 · CLASSIFY — the green classifier node */}
          <div className={`${styles.node} ${styles.classNode}`} data-mode={s.classMode}>
            <span className={styles.nodeTag}>AI classifier</span>
            <div className={styles.classChips}>
              {CLASS_CHIPS.map((c, i) => (
                <span key={c} className={styles.classChip} data-in={on(i < s.classChipsIn)}>{c}</span>
              ))}
            </div>
            <span className={styles.classFoot}>21 component categories identified</span>
          </div>

          {/* 2 · READ — the handwriting hero */}
          <div className={`${styles.win} ${styles.wViewer}`} data-mode={s.win.viewer}>
            <div className={styles.tbar}>
              <span className={styles.viewerGlyph} aria-hidden="true">✍</span>
              <span className={styles.tname}>Document reader</span>
              <span className={styles.tsub}>Building C · photographed on-site</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.viewerBody}>
              {/* the photographed handwritten sheet */}
              <div className={styles.sheet}>
                <div className={styles.sheetHead}>Component Assessment — Bldg C</div>
                {HAND_ROWS.map((r, i) => (
                  <div key={r.raw} className={styles.handRow} data-hand={`${i}`} data-scan={on(s.scanRow === i)}>
                    {r.raw}
                  </div>
                ))}
              </div>
              {/* the clean extracted fields */}
              <div className={styles.fields}>
                {HAND_ROWS.map((r, i) => (
                  <div
                    key={r.clean}
                    className={styles.field}
                    data-field={`${i}`}
                    data-in={on(i < s.readIn)}
                    data-amber={on(r.amber)}
                  >
                    <span className={styles.fieldText}>{r.clean}</span>
                    <span className={styles.fieldConf}>{r.conf}{r.amber ? '' : ' ✓'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 · COMPUTE — Excel with visible formulas */}
          <div className={`${styles.win} ${styles.wExcel}`} data-mode={s.win.excel}>
            <div className={styles.tbar}>
              <img src="/logos/excel.svg" alt="Microsoft Excel" width={20} height={20} className={styles.tlogo} />
              <span className={styles.tname}>Reserve model</span>
              <span className={styles.xRsmeans}>
                <img src="/logos/rsmeans.png" alt="" width={12} height={12} />RS Means
              </span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.formulaBar}>
                <span className={styles.fx}>fx</span>
                <span className={styles.formulaText}>
                  {s.formula === 0 ? '' : s.formula === 1 ? '=SLN(replacement_cost, salvage, useful_life)' : '=RS_Means_index(component, region) · 30-yr projection'}
                </span>
              </div>
              <div className={styles.modelRows}>
                {MODEL_ROWS.map((m, i) => (
                  <div key={m.lab} className={styles.modelRow} data-in={on(i < s.modelIn)}>
                    <span className={styles.modelLab}>{m.lab}</span>
                    <span className={styles.modelVal}>{m.val}</span>
                  </div>
                ))}
              </div>
              <div className={styles.timeline}>
                {TIMELINE_CHIPS.map((t, i) => (
                  <span key={t} className={styles.tlChip} data-in={on(i < s.timelineIn)}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 4 · CHECK — QA panel + Robert's tray */}
          <div className={styles.qaPanel} data-show={on(s.step === 4)}>
            <div className={styles.qaValidated} data-in={on(s.qaValidated)}>
              <span className={styles.qaCheck} aria-hidden="true">✓</span>845 of 847 data points validated
            </div>
            <div className={styles.qaTray}>
              <div className={styles.qaTrayHead}>
                <img src="/demo/robert.png" alt="Robert C." width={20} height={20} className={styles.robertAvatar} data-in={on(s.robertIn)} />
                For Robert C. · Principal Engineer
              </div>
              {QA_FLAGS.map((f, i) => (
                <div key={f.text} className={styles.qaFlag} data-in={on(i < s.flagsIn)} data-resolved={on(i < s.flagsResolved)}>
                  <span className={styles.qaMark} aria-hidden="true">{i < s.flagsResolved ? '✓' : '!'}</span>
                  <span className={styles.qaText}>
                    {f.text}
                    <span className={styles.qaFix}> — {f.fix}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 · DELIVER — the finished report */}
          <div className={`${styles.win} ${styles.wReport}`} data-mode={s.win.report} data-fly="report">
            <div className={styles.tbar}>
              <span className={styles.reportGlyph} aria-hidden="true">▤</span>
              <span className={styles.tname}>Reserve Study</span>
              <span className={styles.tsub}>your firm’s template</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.reportHead}>
                <span className={styles.pageBig}>{s.pageCount}</span>
                <span className={styles.pageCap}>pages generated</span>
              </div>
              <div className={styles.reportRows}>
                {REPORT_ROWS.map((r, i) => (
                  <div key={r} className={styles.reportRow} data-in={on(i < s.reportIn)}>
                    <span className={styles.reportCheck} aria-hidden="true">✓</span>{r}
                  </div>
                ))}
              </div>
              <div className={styles.reportFiled} data-in={on(s.reportFiled)}>→ filed back to Google Drive</div>
            </div>
          </div>
        </div>

        {/* ── Receipt overlay ── */}
        <div className={styles.receipt} data-show={on(s.receipt)}>
          <div className={styles.receiptCard}>
            <p className={styles.receiptKicker}>A 14-day reserve study</p>
            <p className={styles.receiptTitle}>Delivered in 4 hours. Robert made 2 judgement calls.</p>
            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}><span>Documents processed</span><b>47</b></div>
              <div className={styles.receiptRow}>
                <span>Fields extracted</span>
                <b>847 <span className={styles.receiptNote}>94% on handwriting</span></b>
              </div>
              <div className={styles.receiptRow}>
                <span>Reserve computed</span>
                <b className={styles.receiptHl}>$2.1M <span className={styles.receiptNote}>auditable</span></b>
              </div>
              <div className={styles.receiptRow}><span>Engineer review</span><b>2 flags</b></div>
              <div className={styles.receiptRow}>
                <span>Turnaround</span>
                <b><s className={styles.receiptOld}>14 days</s> <span className={styles.receiptHl}>4 hrs</span></b>
              </div>
            </div>
            <BookButton className={styles.receiptCta} location="document-intelligence-engine-scene-receipt">
              Send us 10 of your documents →
            </BookButton>
            <span className={styles.receiptFine}>
              <span className={styles.fineLogos}>
                {FINE_LOGOS.map((l) => (
                  <img key={l.src} src={l.src} alt={l.alt} width={14} height={14} />
                ))}
              </span>
              Reserve studies, insurance claims, mortgage files, medical records — any workflow where paper becomes data.
            </span>
          </div>
        </div>
      </div>

      <p className={styles.orchNote}>
        Chronexa doesn&rsquo;t sell an AI or an OCR product. We orchestrate Claude and vision models with the tools you already
        run — Google Drive, your Excel model, your report template. We build the pipeline; you deliver in your own format.
      </p>
      <p className={styles.hint}>Click a step above to jump · the run loops on its own</p>
    </div>
  );
}
