'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './DocInteractive.module.css';

/* The pipeline bench. Four real document types, each of which survives most of
   the pipeline and then breaks at a different stage. That is the argument: the
   extraction step is rarely where a document fails, so a vendor benchmarked on
   extraction tells you almost nothing about your documents. */

type Stage = { name: string; state: 'ok' | 'flag' | 'stop' };

type Doc = {
  id: string;
  tab: string;
  what: string;
  detail: string;
  stages: Stage[];
  breaks: string;
  fix: string;
  out: string;
};

const STAGES = ['Scan', 'Classify', 'Extract', 'Validate', 'Structure', 'Index', 'Route'];

const DOCS: Doc[] = [
  {
    id: 'invoice',
    tab: 'Supplier invoices',
    what: '2,400 invoices a month · 60 suppliers · no two templates alike',
    detail: 'The easy-sounding one. Every vendor demo uses invoices.',
    stages: [
      { name: 'Scan', state: 'ok' },
      { name: 'Classify', state: 'ok' },
      { name: 'Extract', state: 'ok' },
      { name: 'Validate', state: 'stop' },
      { name: 'Structure', state: 'ok' },
      { name: 'Index', state: 'ok' },
      { name: 'Route', state: 'ok' },
    ],
    breaks: 'Validation, not extraction. The line items were read correctly and they do not add up to the stated total, because the supplier applied a credit on a separate page that no one told the system about.',
    fix: 'Totals are checked against line items, tax is recomputed rather than trusted, and a mismatch becomes a flagged exception with both numbers shown — never a silent overwrite of one with the other.',
    out: 'Into the ledger with a confidence score per field. Twelve of 2,400 reach a human, and each one arrives with the reason attached.',
  },
  {
    id: 'scanned',
    tab: 'Scanned, then re-scanned',
    what: 'Tax and compliance forms · photographed, faxed, or scanned at 150 dpi',
    detail: 'The documents that arrive in whatever state the client had them.',
    stages: [
      { name: 'Scan', state: 'stop' },
      { name: 'Classify', state: 'ok' },
      { name: 'Extract', state: 'flag' },
      { name: 'Validate', state: 'ok' },
      { name: 'Structure', state: 'ok' },
      { name: 'Index', state: 'ok' },
      { name: 'Route', state: 'ok' },
    ],
    breaks: 'The first stage. A page photographed at an angle, a fax with half a column shaved off, a scan where the form number is legible to a person but not to a parser. Quality has to be judged before anything is extracted.',
    fix: 'Legibility is scored on arrival. Anything unreadable produces a specific re-request the same day — "page 2 of the passport, the bottom third is cut off" — instead of a wrong value with a confident score on it.',
    out: 'Modern multimodal models handle degraded scans roughly 10–15 accuracy points better than classical OCR. That is a real gain, and it is still not a substitute for refusing the unreadable page.',
  },
  {
    id: 'tables',
    tab: 'Tables that fight back',
    what: 'Statements and reports · merged cells, nested tables, totals split across pages',
    detail: 'Where almost every document tool quietly degrades.',
    stages: [
      { name: 'Scan', state: 'ok' },
      { name: 'Classify', state: 'ok' },
      { name: 'Extract', state: 'flag' },
      { name: 'Validate', state: 'ok' },
      { name: 'Structure', state: 'stop' },
      { name: 'Index', state: 'ok' },
      { name: 'Route', state: 'ok' },
    ],
    breaks: 'Structure. The text comes out fine; the relationships do not. A merged header now applies to the wrong column, a row that continued onto page four is read as a new record, and a footnote becomes a data value.',
    fix: 'Layout is reconstructed before values are trusted — merged cells resolved, continuations stitched across pages, footnotes separated from figures. Row counts and column sums are checked against the document rather than assumed.',
    out: 'This is the single most common place a document pipeline is quietly wrong for months, because nothing errors. It just produces plausible numbers.',
  },
  {
    id: 'mixed',
    tab: 'A folder of everything',
    what: 'One engagement · PDFs, photos, spreadsheets, an email chain and two presentations',
    detail: 'What real clients actually send. No vendor benchmarks this.',
    stages: [
      { name: 'Scan', state: 'ok' },
      { name: 'Classify', state: 'stop' },
      { name: 'Extract', state: 'ok' },
      { name: 'Validate', state: 'ok' },
      { name: 'Structure', state: 'ok' },
      { name: 'Index', state: 'flag' },
      { name: 'Route', state: 'ok' },
    ],
    breaks: 'Classification, before a single field is read. Nobody labelled these. Two documents are duplicates at different scan qualities, one spreadsheet is a working draft, and the presentation contains the only copy of a figure that matters.',
    fix: 'Every file is classified and deduplicated first, versions are ranked so the superseded draft cannot win, and anything the classifier is unsure about is held rather than guessed into the wrong pile.',
    out: 'Indexed so an AI system can cite the exact page it used, with provenance kept — which document, which version, which page, read when.',
  },
];

const LABEL: Record<Stage['state'], string> = { ok: 'passed', flag: 'watched', stop: 'breaks here' };

export function PipelineBench() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(DOCS.length, 8000);
  const d = DOCS[active];

  return (
    <div className={s.bench} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>THE PIPELINE BENCH</span>
        <span>{running ? 'PLAYING · PICK ONE' : 'PICK A DOCUMENT TYPE'}</span>
      </div>

      <div className={s.picker} role="group" aria-label="Choose a document type">
        {DOCS.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={i === active} onClick={() => pick(i)}>
            {x.tab}
            {i === active && (
              <i
                key={`${active}-${running}`}
                className={running ? `${s.progress} ${s.progressRun}` : s.progress}
                style={running ? { animationDuration: `${intervalMs}ms` } : undefined}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={d.id} {...panelMotion(reduce)}>
          <div className={s.head}>
            <b>{d.what}</b>
            <span>{d.detail}</span>
          </div>

          <ol className={s.rail} aria-label="Pipeline stages">
            {d.stages.map((st, i) => (
              <motion.li key={st.name} className={s[st.state]} {...rowMotion(reduce, i)}>
                <i aria-hidden="true" />
                <b>{st.name}</b>
                <span>{LABEL[st.state]}</span>
              </motion.li>
            ))}
          </ol>

          <div className={s.detail} aria-live="polite">
            <motion.div {...rowMotion(reduce, STAGES.length)}>
              <p className={s.label}>Where it actually breaks</p>
              <p className={s.breaks}>{d.breaks}</p>
            </motion.div>
            <motion.div {...rowMotion(reduce, STAGES.length + 1)}>
              <p className={s.label}>What the pipeline does about it</p>
              <p className={s.fix}>{d.fix}</p>
            </motion.div>
            <motion.p className={s.out} {...rowMotion(reduce, STAGES.length + 2)}>{d.out}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
