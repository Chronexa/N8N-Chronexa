'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import styles from './StackDiagram.module.css';
import LogoChip from './LogoChip';
import CountUp from './CountUp';
import { track } from '../lib/analytics';

/**
 * The workflow player — rebuilt 2026-07 from a static hub diagram into five
 * REAL workflow patterns, each shown as a run: work arrives from the client's
 * tools, an AI model (visible, named) does the middle, a human gate approves
 * where it matters, and the result lands where the team already looks. A pulse
 * travels the threads, and every run ends in a unit-economics readout.
 *
 * Why it exists: the ideal buyer's biggest pre-call objection is disruption
 * ("do we have to replace our tools / change how we work?"). This section
 * answers it by demonstration — their tools on both ends, our engineering and
 * the models in the middle, and the ROI stated per run.
 *
 * Honesty rule: these are illustrative runs of patterns from real client
 * builds (labelled as such in the panel header) — no invented client claims.
 */

type Tool = { file: string; name: string };
type AiStep = { file: string; name: string; action: string };
type Metric =
  | { kind: 'count'; value: number; prefix?: string; suffix?: string; label: string; sub: string }
  | { kind: 'word'; big: string; label: string; sub: string };

type Workflow = {
  id: string;
  label: string;
  hint: string;
  sources: Tool[];
  ai: AiStep[];
  gate?: string;
  outputs: Tool[];
  metric: Metric;
  builtWith: Tool[];
};

const WORKFLOWS: Workflow[] = [
  {
    id: 'documents',
    label: 'Documents in, filed & extracted',
    hint: 'Intelligent document processing',
    sources: [
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'gdrive.svg', name: 'Google Drive' },
    ],
    ai: [{ file: 'claude.svg', name: 'Claude', action: 'reads, classifies, extracts every field' }],
    gate: 'Analyst approves the flags',
    outputs: [
      { file: 'netdocuments.png', name: 'NetDocuments' },
      { file: 'excel.svg', name: 'Excel' },
    ],
    metric: {
      kind: 'count',
      value: 5,
      suffix: ' docs',
      label: 'classified, extracted and filed in one 90-second run',
      sub: '≈ 40 minutes of manual filing, returned',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
    ],
  },
  {
    id: 'whatsapp',
    label: 'Customer replies on WhatsApp',
    hint: 'Grounded in your own knowledge',
    sources: [{ file: 'whatsapp.svg', name: 'WhatsApp' }],
    ai: [{ file: 'claude.svg', name: 'Claude', action: 'drafts the reply from your knowledge base' }],
    gate: 'Your team approves in Slack',
    outputs: [{ file: 'whatsapp.svg', name: 'WhatsApp' }],
    metric: {
      kind: 'count',
      value: 2,
      prefix: '< ',
      suffix: ' min',
      label: 'from customer message to approved reply',
      sub: 'was hours in a shared inbox queue',
    },
    builtWith: [
      { file: 'twilio.png', name: 'Twilio' },
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
    ],
  },
  {
    id: 'content',
    label: 'Content engine → social',
    hint: 'Copy, visuals, scheduled posts',
    sources: [{ file: 'notion.svg', name: 'Notion' }],
    ai: [
      { file: 'openai.svg', name: 'GPT', action: 'writes the copy, on brand' },
      { file: 'gemini.svg', name: 'Gemini', action: 'generates the visuals' },
    ],
    gate: 'You approve the calendar',
    outputs: [
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'instagram.svg', name: 'Instagram' },
    ],
    metric: {
      kind: 'count',
      value: 12,
      suffix: ' posts',
      label: 'drafted, illustrated and scheduled from one brief',
      sub: 'two weeks of social from a single run',
    },
    builtWith: [
      { file: 'zapier.svg', name: 'Zapier' },
      { file: 'openai.svg', name: 'GPT' },
      { file: 'gemini.svg', name: 'Gemini' },
    ],
  },
  {
    id: 'briefing',
    label: 'Your morning, prioritised',
    hint: 'Inbox, deals and sprint in one brief',
    sources: [
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'jira.svg', name: 'Jira' },
      { file: 'hubspot.png', name: 'HubSpot' },
    ],
    ai: [{ file: 'claude.svg', name: 'Claude', action: 'summarises, ranks, flags who is waiting' }],
    outputs: [{ file: 'slack.png', name: 'Slack' }],
    metric: {
      kind: 'count',
      value: 15,
      suffix: ' min',
      label: 'back every morning, before standup',
      sub: 'what happened, what is urgent, who is waiting on you',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
    ],
  },
  {
    id: 'sprint',
    label: 'Sprint radar for engineering',
    hint: 'Progress, capacity, risk forecast',
    sources: [
      { file: 'jira.svg', name: 'Jira' },
      { file: 'github.svg', name: 'GitHub' },
    ],
    ai: [{ file: 'gemini.svg', name: 'Gemini', action: 'reads progress, forecasts capacity' }],
    outputs: [{ file: 'slack.png', name: 'Slack' }],
    metric: {
      kind: 'word',
      big: 'Daily',
      label: 'sprint-risk forecast in Slack, before standup',
      sub: 'scope, capacity and blockers — read in thirty seconds',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'gemini.svg', name: 'Gemini' },
    ],
  },
];

/* ── Pipeline geometry — one fixed 900×340 space shared by SVG + chips ────── */
const W = 900, H = 340;
const SRC_X = 128, AI_X = 420, GATE_X = 628, OUT_X = 792;
const MID = H / 2;
const rowsFor = (n: number) => (n === 1 ? [MID] : n === 2 ? [H * 0.34, H * 0.66] : [H * 0.2, MID, H * 0.8]);
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function paths(wf: Workflow) {
  const srcRows = rowsFor(wf.sources.length);
  const aiRows = rowsFor(wf.ai.length);
  const outRows = rowsFor(wf.outputs.length);
  const rightStart = wf.gate ? GATE_X + 66 : AI_X + 104;
  const leftIn: string[] = srcRows.map((y, i) => {
    const ty = aiRows[Math.min(i, aiRows.length - 1)];
    return `M${SRC_X + 62},${y} C ${SRC_X + 170},${y} ${AI_X - 210},${ty} ${AI_X - 104},${ty}`;
  });
  const aiOut: string[] = wf.gate
    ? aiRows.map((y) => `M${AI_X + 104},${y} C ${AI_X + 170},${y} ${GATE_X - 130},${MID} ${GATE_X - 66},${MID}`)
    : [];
  const rightOut: string[] = outRows.map((y) => {
    const fy = wf.gate ? MID : aiRows[0];
    return `M${rightStart},${fy} C ${rightStart + 66},${fy} ${OUT_X - 150},${y} ${OUT_X - 58},${y}`;
  });
  return { leftIn, aiOut, rightOut, srcRows, aiRows, outRows };
}

export default function StackDiagram() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { margin: '-80px' });

  const wf = WORKFLOWS[active];
  const g = paths(wf);

  // Auto-advance until the visitor takes over; never under reduced motion.
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const t = setInterval(() => setActive((i) => (i + 1) % WORKFLOWS.length), 7000);
    return () => clearInterval(t);
  }, [reduce, paused, inView]);

  const select = (i: number) => {
    setActive(i);
    setPaused(true);
    track('workflow_select', { workflow: WORKFLOWS[i].id });
  };

  return (
    <>
      <div className={styles.head}>
        <p className="eyebrow">Custom AI infrastructure</p>
        <h2 className={styles.heading}>
          Not another tool to adopt. <span className="accent-phrase">A team that builds yours.</span>
        </h2>
        <p className={styles.sub}>
          A chat window can answer questions about the document you paste into it. It can&apos;t
          watch your inbox, classify a hundred thousand filings, and put the result where your
          team already works. We orchestrate Claude, GPT and Gemini — with n8n, Zapier and custom
          code — into the stack you already run. Here&apos;s what that looks like, one run at a time.
        </p>
      </div>

      <div className={`panel ${styles.panel}`} ref={panelRef}>
        <div className={styles.panelBar}>
          <span>Real workflow patterns, as we build them</span>
          <span className={styles.panelNote}>Illustrative runs · nothing replaced, everything connected</span>
        </div>

        <div className={styles.body}>
          {/* ── Use-case list ─────────────────────────────────────────────── */}
          <div className={styles.list} role="tablist" aria-label="Workflow examples">
            {WORKFLOWS.map((w, i) => (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`${styles.listItem} ${i === active ? styles.listItemActive : ''}`}
                onClick={() => select(i)}
              >
                <span className={styles.listLabel}>{w.label}</span>
                <span className={styles.listHint}>{w.hint}</span>
              </button>
            ))}
          </div>

          {/* ── The run ───────────────────────────────────────────────────── */}
          <div className={styles.stageWrap}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={wf.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={styles.stageMotion}
              >
                {/* Desktop pipeline */}
                <div className={styles.stage}>
                  <div className={`${styles.stageGrid} grid-texture`} aria-hidden="true" />
                  <svg className={styles.wires} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                    {[...g.leftIn, ...g.aiOut, ...g.rightOut].map((d) => (
                      <path key={d} d={d} className={styles.wire} />
                    ))}
                    {/* Work, visibly travelling the pipe */}
                    <g className={styles.pulses}>
                      {g.leftIn.map((d, i) => (
                        <circle key={`p${d}`} r="4" className={styles.pulse}>
                          <animateMotion dur="2.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      ))}
                      {(wf.gate ? g.aiOut : []).map((d) => (
                        <circle key={`q${d}`} r="4" className={styles.pulse}>
                          <animateMotion dur="1.8s" begin="1.2s" repeatCount="indefinite" path={d} />
                        </circle>
                      ))}
                      {g.rightOut.map((d, i) => (
                        <circle key={`r${d}`} r="4" className={styles.pulse}>
                          <animateMotion dur="2s" begin={`${1.6 + i * 0.4}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      ))}
                    </g>
                  </svg>

                  {wf.sources.map((t, i) => (
                    <div key={t.name + i} className={styles.srcChip} style={{ left: pct(SRC_X, W), top: pct(g.srcRows[i], H) }}>
                      <LogoChip file={t.file} name={t.name} showName />
                    </div>
                  ))}

                  {wf.ai.map((m, i) => (
                    <div key={m.name} className={styles.aiCard} style={{ left: pct(AI_X, W), top: pct(g.aiRows[i], H) }}>
                      <LogoChip file={m.file} name={m.name} showName />
                      <span className={styles.aiAction}>{m.action}</span>
                    </div>
                  ))}

                  {wf.gate && (
                    <div className={styles.gate} style={{ left: pct(GATE_X, W), top: pct(MID, H) }}>
                      <span className={styles.gateDot} aria-hidden="true" />
                      {wf.gate}
                    </div>
                  )}

                  {wf.outputs.map((t, i) => (
                    <div key={t.name + i} className={styles.outChip} style={{ left: pct(OUT_X, W), top: pct(g.outRows[i], H) }}>
                      <LogoChip file={t.file} name={t.name} showName />
                    </div>
                  ))}
                </div>

                {/* Mobile fold: same run, vertical */}
                <div className={styles.flowStack}>
                  <div className={styles.stackRow}>
                    {wf.sources.map((t, i) => <LogoChip key={t.name + i} file={t.file} name={t.name} showName size="sm" />)}
                  </div>
                  <span className={styles.stackWire} aria-hidden="true" />
                  <div className={styles.stackAi}>
                    {wf.ai.map((m) => (
                      <div key={m.name} className={styles.aiCardStatic}>
                        <LogoChip file={m.file} name={m.name} showName size="sm" />
                        <span className={styles.aiAction}>{m.action}</span>
                      </div>
                    ))}
                  </div>
                  {wf.gate && (
                    <>
                      <span className={styles.stackWire} aria-hidden="true" />
                      <div className={styles.gateStatic}>
                        <span className={styles.gateDot} aria-hidden="true" />
                        {wf.gate}
                      </div>
                    </>
                  )}
                  <span className={styles.stackWire} aria-hidden="true" />
                  <div className={styles.stackRow}>
                    {wf.outputs.map((t, i) => <LogoChip key={t.name + i} file={t.file} name={t.name} showName size="sm" />)}
                  </div>
                </div>

                {/* ── The unit-economics readout ─────────────────────────── */}
                <div className={styles.metric}>
                  <div className={styles.metricMain}>
                    <span className={`display-num ${styles.metricNum}`}>
                      {wf.metric.kind === 'count' ? (
                        <CountUp
                          key={wf.id}
                          value={wf.metric.value}
                          prefix={wf.metric.prefix}
                          suffix={wf.metric.suffix}
                          duration={1.1}
                        />
                      ) : (
                        wf.metric.big
                      )}
                    </span>
                    <span className={styles.metricLabel}>{wf.metric.label}</span>
                  </div>
                  <div className={styles.metricSide}>
                    <span className={styles.metricSub}>{wf.metric.sub}</span>
                    <span className={styles.builtWith}>
                      Built with
                      {wf.builtWith.map((t) => (
                        <LogoChip key={t.name} file={t.file} name={t.name} size="sm" />
                      ))}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
