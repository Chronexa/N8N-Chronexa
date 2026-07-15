'use client';

/**
 * DocIntelScene — the Document Intelligence Engine hero demo.
 *
 * NOT an app window. An open dark stage where real tools enter as bright
 * windows and dock into a chain: Google Drive / SharePoint / Box (intake of
 * EVERY kind of document) → a green classifier node that sorts the pile across
 * Legal · Finance · Compliance · Tax → a document viewer that READS even a bad
 * scan → and the hero: an "ask your documents" surface where a person asks a
 * plain question and gets an answer CITED to the exact page. Loops (~48s).
 *
 * The reframe (2026-07-15, with Ankit): the old scene told one story (a reserve
 * study). The real product reads TONS of documents across every department and
 * turns them into something you can safely ASK. So breadth is the hero (variety
 * floods in → sorted into four worlds), depth is proven on ONE messy scan, and
 * the aha is the cited answer — the thing generic AI cannot safely do.
 *
 * ATTRIBUTION (client mandate): Chronexa owns no AI or OCR product. The orb is
 * "AI agent · Claude" — the reading + retrieval is Claude and vision/RAG models
 * the engine orchestrates over the firm's own tools. "Safe RAG" = the answer is
 * grounded only in the client's documents and cited to the source page; nothing
 * is sent to public models.
 *
 * Green (#67B035) is reserved for Chronexa (orb, threads, node, rail); amber
 * marks the human-in-the-loop moments only (the 58% flagged line + Elena's
 * review). Domain colours (blue/teal/violet/orange) tag the four worlds.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './DocIntelScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type WinKey = 'drive' | 'viewer' | 'ask';
type Mode = 'hidden' | 'focus' | 'docked';
type NodeMode = 'hidden' | 'focus' | 'docked';
type OrbPos = 'collect' | 'classify' | 'read' | 'ask' | 'cite' | 'deliver' | 'wide';
type ThreadKey = 't0' | 't1' | 't2' | 't3' | 's1' | 's2' | 's3' | 's4';

const STEPS = ['Collect', 'Classify', 'Read', 'Ask', 'Cite', 'Deliver'] as const;

const CAPTIONS: { lead: string; amber?: string }[] = [
  { lead: 'Every document your business runs on — leases, loan files, tax returns, audit reports — from wherever they live.' },
  { lead: 'It reads each one and sorts the whole pile across legal, finance, compliance and tax.' },
  { lead: 'It reads even a faxed, stamped scan — and flags the one line it can’t read, ', amber: 'rather than guess.' },
  { lead: 'Then anyone can just ask a plain question — the way you’d ask a colleague.' },
  { lead: 'The answer comes back cited — every claim pinned to the exact page. ', amber: 'Nothing is sent to public AI.' },
  { lead: 'Your whole archive becomes something you can ask — across every department.' },
];

/** Intake — a deliberately DIVERSE pile; the kind tags the four worlds. */
const DRIVE_FILES: { name: string; kind: string }[] = [
  { name: 'Commercial lease — Suite 400 (scan)', kind: 'Legal' },
  { name: 'Term loan agreement — $4.2M', kind: 'Finance' },
  { name: 'Form 1120 · 2024 tax return', kind: 'Tax' },
  { name: 'SOC 2 audit + KYC files', kind: 'Compliance' },
  { name: '12,000 more — contracts, invoices…', kind: 'Mixed' },
];

/** Classifier output — the four worlds, recognised, with volume. */
const CLASS_CHIPS: { dom: string; n: string; c: string }[] = [
  { dom: 'Legal', n: '3,120', c: 'domLegal' },
  { dom: 'Finance', n: '3,610', c: 'domFinance' },
  { dom: 'Compliance', n: '1,880', c: 'domCompliance' },
  { dom: 'Tax', n: '3,870', c: 'domTax' },
];

/** The messy scanned lease, read line by line into clean fields. */
const DOC_ROWS: { raw: string; clean: string; conf: string; amber: boolean; hand: boolean }[] = [
  { raw: 'TENANT: Meridian Group LLC', clean: 'Tenant · Meridian Group LLC', conf: '99%', amber: false, hand: false },
  { raw: 'TERM: five (5) years', clean: 'Term · 5 years', conf: '98%', amber: false, hand: false },
  { raw: '12.3  auto-renew unless 90-day notice', clean: 'Auto-renews · 90-day notice · §12.3', conf: '96%', amber: false, hand: false },
  { raw: 'esc. 3% ?? (illegible)', clean: 'Rent escalation — flag for Elena', conf: '58%', amber: true, hand: true },
];

// The hero: ask → cited answer
const QUESTION = 'Which commercial leases auto-renew before December 31?';
const ANSWER = 'Three leases auto-renew before Dec 31. Earliest notice window: Suite 400 — due Oct 2.';
const CLAUSE =
  '…shall automatically renew for successive one-year terms unless either party gives written notice not less than ninety (90) days prior to expiry…';
const CLAUSE_TAG = 'Suite 400 lease · p.7 §12.3';
const CITES: { doc: string; page: string }[] = [
  { doc: 'Lease · Suite 400', page: 'p.7 §12.3' },
  { doc: 'Lease · Downtown HQ', page: 'p.4 §9.1' },
  { doc: 'Lease · Warehouse B', page: 'p.6 §11.2' },
];
const TRUST = 'Grounded in your documents · nothing sent to public AI';

/** Deliver — the same surface, now asked across every department. */
const KB_ASKS: { dom: string; q: string; c: string }[] = [
  { dom: 'Finance', q: 'Total exposure across all loan covenants?', c: 'domFinance' },
  { dom: 'Compliance', q: 'Any KYC files missing a 2024 refresh?', c: 'domCompliance' },
  { dom: 'Tax', q: 'Which entities filed a 1120 for 2024?', c: 'domTax' },
];

const FINE_LOGOS: { src: string; alt: string }[] = [
  { src: '/logos/gdrive.svg', alt: 'Google Drive' },
  { src: '/logos/sharepoint.png', alt: 'SharePoint' },
  { src: '/logos/box.png', alt: 'Box' },
  { src: '/logos/outlook.png', alt: 'Outlook' },
];

const THREAD_PATHS: { key: ThreadKey; d: string }[] = [
  { key: 't0', d: 'M150,300 C240,326 300,352 356,366' },   // drive → classifier
  { key: 't1', d: 'M436,354 C486,332 512,312 540,298' },   // classifier → viewer
  { key: 't2', d: 'M560,300 C650,326 742,352 812,372' },   // viewer → ask
  { key: 't3', d: 'M812,296 C600,214 350,214 158,292' },   // ask → back to drive (full circle)
  { key: 's1', d: 'M476,300 C384,278 250,268 160,288' },   // orb centre → drive
  { key: 's2', d: 'M486,318 C452,356 404,378 372,386' },   // orb centre → classifier
  { key: 's3', d: 'M512,300 C520,300 528,300 540,300' },   // orb centre → viewer
  { key: 's4', d: 'M524,306 C640,324 758,358 826,384' },   // orb centre → ask
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
  docCount: number;
  // classify
  classChipsIn: number;
  // read
  readIn: number;
  scanRow: number; // -1 = off
  // ask
  askTyped: number;
  askAsked: boolean;
  // cite
  answerIn: boolean;
  citesIn: number;
  clauseIn: boolean;
  trustIn: boolean;
  // deliver
  kbIn: number;
  elenaConfirm: boolean;
  // tissue + finale
  threads: Record<ThreadKey, boolean>;
  wide: boolean;
  pulse: boolean;
  receipt: boolean;
}

const NO_THREADS: Record<ThreadKey, boolean> = {
  t0: false, t1: false, t2: false, t3: false, s1: false, s2: false, s3: false, s4: false,
};

const INITIAL: SceneState = {
  step: 0,
  capIdx: 0,
  orbPos: 'collect',
  orbSay: '',
  win: { drive: 'hidden', viewer: 'hidden', ask: 'hidden' },
  classMode: 'hidden',
  filesIn: 0,
  spConnected: false,
  boxConnected: false,
  docCount: 0,
  classChipsIn: 0,
  readIn: 0,
  scanRow: -1,
  askTyped: 0,
  askAsked: false,
  answerIn: false,
  citesIn: 0,
  clauseIn: false,
  trustIn: false,
  kbIn: 0,
  elenaConfirm: false,
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
    filesIn: DRIVE_FILES.length, spConnected: true, boxConnected: true, docCount: 12480,
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
    readIn: DOC_ROWS.length, scanRow: -1,
    threads: { ...s.threads, t0: false, t1: true },
    orbPos: 'read', capIdx: 2,
  }),
  (s) => ({
    ...s,
    win: { ...s.win, viewer: 'docked', ask: 'focus' },
    askTyped: QUESTION.length, askAsked: true,
    threads: { ...s.threads, t1: false, t2: true },
    orbPos: 'ask', capIdx: 3,
  }),
  (s) => ({
    ...s,
    answerIn: true, citesIn: CITES.length, clauseIn: true, trustIn: true,
    orbPos: 'cite', capIdx: 4,
  }),
  (s) => ({
    ...s,
    kbIn: KB_ASKS.length, elenaConfirm: true,
    win: { drive: 'docked', viewer: 'docked', ask: 'docked' },
    classMode: 'docked',
    threads: { ...s.threads, t2: false, t3: false, s1: true, s2: true, s3: true, s4: true },
    wide: true, orbPos: 'wide', orbSay: 'Your whole archive — now something you can ask.', capIdx: 5,
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

  /** Flying chip: a value lifting off the scanned sheet into a clean field. */
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

    /** Typewriter helper: 3 chars per tick. */
    const type = (t0: number, text: string, ms: number, key: 'askTyped') => {
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
        // COLLECT — variety floods in
        patch({ capIdx: 0, orbPos: 'collect', orbSay: '' });
        at(200, () => patch((p) => ({ win: { ...p.win, drive: 'focus' } })));
        at(500, () => patch({ spConnected: true }));
        at(800, () => patch({ boxConnected: true }));
        DRIVE_FILES.forEach((_, k) => at(700 + k * 360, () => patch({ filesIn: k + 1 })));
        for (let k = 1; k <= 20; k++) {
          const e = 1 - Math.pow(1 - k / 20, 3);
          at(900 + k * 70, () => patch({ docCount: Math.round(12480 * e) }));
        }
        at(2600, () => patch({ orbSay: 'Every document you run on — pulled from every system, deduplicated.' }));
        at(4300, done);
      } else if (i === 1) {
        // CLASSIFY — sort the pile into the four worlds
        patch({ capIdx: 1 });
        at(150, () => patch((p) => ({
          win: { ...p.win, drive: 'docked' }, classMode: 'focus',
          threads: { ...p.threads, t0: true },
        })));
        at(600, () => patch({ orbPos: 'classify', orbSay: 'Reading each one — sorting the whole pile by department.' }));
        CLASS_CHIPS.forEach((_, k) => at(1000 + k * 420, () => patch({ classChipsIn: k + 1 })));
        at(3000, () => patch({ orbSay: 'Legal, finance, compliance, tax — every type recognised.' }));
        at(3900, done);
      } else if (i === 2) {
        // READ — one messy scan, read line by line, one line flagged
        patch({ capIdx: 2 });
        at(150, () => patch((p) => ({
          classMode: 'docked', win: { ...p.win, viewer: 'focus' },
          threads: { ...p.threads, t0: false, t1: true }, readIn: 0, scanRow: -1,
        })));
        at(650, () => patch({ orbPos: 'read', orbSay: 'Even a faxed, stamped scan — read line by line.' }));
        DOC_ROWS.forEach((row, k) => {
          const t0 = 1100 + k * 1350;
          at(t0, () => patch({ scanRow: k }));
          at(t0 + 650, () => fly(`[data-hand="${k}"]`, `[data-field="${k}"]`, row.conf, row.amber));
          at(t0 + 1050, () => patch({ readIn: k + 1 }));
        });
        const endRead = 1100 + DOC_ROWS.length * 1350;
        at(endRead - 150, () => patch({ scanRow: -1, orbSay: 'The one line it can’t read, it flags — it never guesses.' }));
        at(endRead + 500, done);
      } else if (i === 3) {
        // ASK — Elena asks a plain question
        patch({ capIdx: 3 });
        at(150, () => patch((p) => ({
          win: { ...p.win, viewer: 'docked', ask: 'focus' },
          threads: { ...p.threads, t1: false, t2: true }, askTyped: 0, askAsked: false,
        })));
        at(650, () => patch({ orbPos: 'ask', orbSay: 'Now Elena just asks — in plain words.' }));
        const askEnd = type(1150, QUESTION, 26, 'askTyped');
        at(askEnd + 350, () => patch({ askAsked: true, orbSay: '' }));
        at(askEnd + 1300, done);
      } else if (i === 4) {
        // CITE — the aha: answer grounded + cited, then stillness
        patch({ capIdx: 4 });
        at(150, () => patch({ orbPos: 'cite', orbSay: 'It answers only from your files.' }));
        at(600, () => patch({ answerIn: true }));
        CITES.forEach((_, k) => at(1050 + k * 430, () => patch({ citesIn: k + 1 })));
        at(2500, () => patch({ clauseIn: true }));
        at(3050, () => patch({ trustIn: true, orbSay: 'Every claim pinned to a page. Nothing left your systems.' }));
        at(4600, done);
      } else if (i === 5) {
        // DELIVER — the same surface, asked across every department; wide shot
        patch({ capIdx: 5 });
        at(200, () => patch({ orbPos: 'deliver', orbSay: 'The same question works across every department.' }));
        KB_ASKS.forEach((_, k) => at(600 + k * 460, () => patch({ kbIn: k + 1 })));
        at(2500, () => patch({ elenaConfirm: true, orbSay: '' }));
        at(3300, () => patch((p) => ({
          win: { drive: 'docked', viewer: 'docked', ask: 'docked' },
          classMode: 'docked' as NodeMode,
          wide: true, pulse: true, orbPos: 'wide' as OrbPos,
          orbSay: 'Your whole archive — now something you can ask.',
          threads: { ...p.threads, t2: false, t3: false, s1: true, s2: true, s3: true, s4: true },
        })));
        at(5000, done);
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

  const askTyping = s.askTyped > 0 && s.askTyped < QUESTION.length;
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

          {/* 0 · COLLECT — intake from every system */}
          <div className={`${styles.win} ${styles.wDrive}`} data-mode={s.win.drive}>
            <div className={styles.tbar}>
              <img src="/logos/gdrive.svg" alt="Google Drive" width={20} height={18} className={styles.tlogo} />
              <span className={styles.tname}>Document intake</span>
              <span className={styles.tsub}>Meridian Group</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.srcRow}>
                <span className={styles.srcChip} data-on={on(true)}>
                  <img src="/logos/gdrive.svg" alt="" width={11} height={11} />Drive
                </span>
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
                    <span className={styles.fileTag} data-kind={f.kind}>{f.kind}</span>
                  </div>
                ))}
              </div>
              <div className={styles.driveFoot}>
                <b>{s.docCount.toLocaleString('en-US')}</b> documents · 3 sources · deduplicated
              </div>
            </div>
          </div>

          {/* 1 · CLASSIFY — the green classifier node, four worlds */}
          <div className={`${styles.node} ${styles.classNode}`} data-mode={s.classMode}>
            <span className={styles.nodeTag}>AI classifier · safe RAG index</span>
            <div className={styles.classChips}>
              {CLASS_CHIPS.map((c, i) => (
                <span key={c.dom} className={styles.classChip} data-in={on(i < s.classChipsIn)}>
                  <span className={`${styles.cdot} ${styles[c.c]}`} aria-hidden="true" />
                  {c.dom} · {c.n}
                </span>
              ))}
            </div>
            <span className={styles.classFoot}>38 document types recognised</span>
          </div>

          {/* 2 · READ — the messy-scan hero */}
          <div className={`${styles.win} ${styles.wViewer}`} data-mode={s.win.viewer}>
            <div className={styles.tbar}>
              <span className={styles.viewerGlyph} aria-hidden="true">▤</span>
              <span className={styles.tname}>Document reader</span>
              <span className={styles.tsub}>Commercial lease · faxed scan</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.viewerBody}>
              {/* the scanned page */}
              <div className={styles.sheet}>
                <span className={styles.scanStamp} aria-hidden="true">RECEIVED</span>
                <div className={styles.sheetHead}>COMMERCIAL LEASE — STE 400</div>
                {DOC_ROWS.map((r, i) => (
                  <div
                    key={r.raw}
                    className={r.hand ? `${styles.docLine} ${styles.docHand}` : styles.docLine}
                    data-hand={`${i}`}
                    data-scan={on(s.scanRow === i)}
                  >
                    {r.raw}
                  </div>
                ))}
              </div>
              {/* the clean extracted fields */}
              <div className={styles.fields}>
                {DOC_ROWS.map((r, i) => (
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

          {/* 3–5 · ASK — the hero surface: plain question → cited answer */}
          <div className={`${styles.win} ${styles.wAsk}`} data-mode={s.win.ask}>
            <div className={styles.tbar}>
              <span className={styles.askGlyph} aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 15 15">
                  <circle cx="6.5" cy="6.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="10" y1="10" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.tname}>Ask your documents</span>
              <span className={styles.tsub}>{s.docCount.toLocaleString('en-US')} indexed · cited</span>
              <span className={styles.tick} aria-hidden="true" />
            </div>
            <div className={styles.winBody}>
              <div className={styles.askBar}>
                <img src="/demo/elena.png" alt="Elena Ruiz" width={22} height={22} className={styles.askAvatar} />
                <span className={styles.askQ}>
                  {QUESTION.slice(0, s.askTyped)}
                  <span className={styles.caret} data-on={on(askTyping)} aria-hidden="true" />
                </span>
                <span className={styles.askGo} data-in={on(s.askAsked)}>Ask</span>
              </div>

              <div className={styles.answer} data-in={on(s.answerIn)}>
                <span className={styles.answerNum}>3 matches</span>
                <p className={styles.answerText}>{ANSWER}</p>

                <div className={styles.clause} data-in={on(s.clauseIn)}>
                  <span className={styles.clauseMark} aria-hidden="true" />
                  <p className={styles.clauseText}>{CLAUSE}</p>
                  <span className={styles.clauseTag}>{CLAUSE_TAG}</span>
                </div>

                <div className={styles.cites}>
                  {CITES.map((c, i) => (
                    <span key={c.doc} className={styles.citeChip} data-in={on(i < s.citesIn)}>
                      <span className={styles.citeDoc}>{c.doc}</span>
                      <span className={styles.citePage}>{c.page}</span>
                    </span>
                  ))}
                </div>

                <div className={styles.trustRow} data-in={on(s.trustIn)}>
                  <span className={styles.trustIco} aria-hidden="true">
                    <svg width="12" height="13" viewBox="0 0 12 13">
                      <path d="M6 0.6 L11 2.4 V6 C11 9 8.8 11.4 6 12.4 C3.2 11.4 1 9 1 6 V2.4 Z"
                        fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                      <path d="M3.7 6.2 L5.3 7.8 L8.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {TRUST}
                </div>

                {/* DELIVER — the same surface, across every department */}
                <div className={styles.kbStrip} data-in={on(s.kbIn > 0)}>
                  <span className={styles.kbHead}>Ask anything — across every department</span>
                  {KB_ASKS.map((k, i) => (
                    <div key={k.q} className={styles.kbAsk} data-in={on(i < s.kbIn)}>
                      <span className={`${styles.kbDom} ${styles[k.c]}`}>{k.dom}</span>
                      <span className={styles.kbQ}>{k.q}</span>
                      <span className={styles.kbCited} aria-hidden="true">cited ✓</span>
                    </div>
                  ))}
                  <div className={styles.elenaRow} data-in={on(s.elenaConfirm)}>
                    <img src="/demo/elena.png" alt="Elena Ruiz" width={18} height={18} className={styles.elenaAvatar} />
                    Elena reviews before anything is filed.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Receipt overlay ── */}
        <div className={styles.receipt} data-show={on(s.receipt)}>
          <div className={styles.receiptCard}>
            <p className={styles.receiptKicker}>Your archive, on tap</p>
            <p className={styles.receiptTitle}>Ask a plain question. Get a cited answer in seconds.</p>
            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}><span>Documents read &amp; indexed</span><b>12,480</b></div>
              <div className={styles.receiptRow}>
                <span>Across</span>
                <b>Legal · Finance · Compliance · Tax</b>
              </div>
              <div className={styles.receiptRow}>
                <span>Every answer</span>
                <b className={styles.receiptHl}>cited to the source page</b>
              </div>
              <div className={styles.receiptRow}>
                <span>Sent to public AI</span>
                <b className={styles.receiptHl}>nothing</b>
              </div>
              <div className={styles.receiptRow}>
                <span>Weeks of manual review</span>
                <b><s className={styles.receiptOld}>weeks</s> <span className={styles.receiptHl}>seconds</span></b>
              </div>
            </div>
            <BookButton className={styles.receiptCta} location="document-intelligence-engine-scene-receipt">
              Ask it your first question →
            </BookButton>
            <span className={styles.receiptFine}>
              <span className={styles.fineLogos}>
                {FINE_LOGOS.map((l) => (
                  <img key={l.src} src={l.src} alt={l.alt} width={14} height={14} />
                ))}
              </span>
              Contracts, filings, claims, returns, records — any paper your business has to read and be sure of.
            </span>
          </div>
        </div>
      </div>

      <p className={styles.orchNote}>
        Chronexa doesn&rsquo;t sell an AI or an OCR product. We orchestrate Claude, vision and retrieval models over your own
        documents — grounded, cited, and private to you. We build the pipeline; your files never leave your systems.
      </p>
      <p className={styles.hint}>Click a step above to jump · the run loops on its own</p>
    </div>
  );
}
