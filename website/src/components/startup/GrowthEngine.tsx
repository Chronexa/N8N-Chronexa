'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import styles from './GrowthEngine.module.css';
import LogoChip from '../LogoChip';
import CountUp from '../CountUp';
import { track } from '../../lib/analytics';

/**
 * The growth-engine player — this page's centerpiece, and the section that
 * makes the Leverage Line concrete instead of theoretical.
 *
 * Everything above this point on the page argues a thesis: output should
 * decouple from headcount. This section is the proof-by-demonstration of what
 * "a system instead of a hire" actually IS — a founder's own stack on both
 * ends, an AI model doing the repeatable middle, a human approving where
 * judgment matters, and the result landing where their team already looks.
 *
 * Its readout is deliberately denominated in HEADCOUNT, not just time saved:
 * "the throughput of ~1.5 SDRs" is the unit a Series A founder budgets in, and
 * it closes the loop with the Headcount Tax figure in the diagnostic above.
 *
 * Grammar is borrowed on purpose from the homepage's StackDiagram (tabs → one
 * animated run at a time → unit-economics readout) so this page reads as part
 * of the same product, not a different site. Dark stage because this is the
 * page's emphatic moment and the rest of it runs light.
 *
 * HONESTY RULE: these are illustrative runs of patterns we genuinely build
 * (the outbound and content engines are our own production workflows), labelled
 * as illustrative in the panel bar. The headcount equivalences are capacity
 * comparisons, NOT client results — no named clients, no invented outcomes.
 */

type Tool = { file: string; name: string };
type AiStep = { file: string; name: string; action: string };
type Metric =
  | { kind: 'count'; value: number; prefix?: string; suffix?: string; label: string; headcount: string }
  | { kind: 'word'; big: string; label: string; headcount: string };

type Flow = {
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

/* The stack a growth-stage team already runs, plus the models we orchestrate
   into it. Relocated here from the hero, where the redesign spec bans tool
   logos outright (§7 Section 1) and §15 lists the strip as something to demote
   to a minor supporting element. Here it isn't decoration — it's the evidence
   for this section's own claim that nothing gets replaced.
   Only tools we genuinely build with: a logo here is a claim. */
const STACK: Tool[] = [
  { file: 'hubspot.png', name: 'HubSpot' },
  { file: 'slack.png', name: 'Slack' },
  { file: 'notion.svg', name: 'Notion' },
  { file: 'gmail.svg', name: 'Gmail' },
  { file: 'intercom.png', name: 'Intercom' },
  { file: 'linkedin.png', name: 'LinkedIn' },
  { file: 'apollo.png', name: 'Apollo' },
  { file: 'claude.svg', name: 'Claude' },
  { file: 'openai.svg', name: 'GPT' },
  { file: 'n8n.svg', name: 'n8n' },
];

const FLOWS: Flow[] = [
  {
    id: 'outbound',
    label: 'Outbound, without the SDR bench',
    hint: 'Sourcing, research, personalisation, follow-up',
    sources: [
      { file: 'apollo.png', name: 'Apollo' },
      { file: 'clay.png', name: 'Clay' },
    ],
    ai: [{ file: 'claude.svg', name: 'Claude', action: 'researches each account, writes the opener' }],
    gate: 'You approve the batch',
    outputs: [
      { file: 'instantly.png', name: 'Instantly' },
      { file: 'hubspot.png', name: 'HubSpot' },
    ],
    metric: {
      kind: 'count',
      value: 400,
      suffix: ' accounts',
      label: 'researched and personally written to to in a single overnight run',
      headcount: 'Roughly the weekly research throughput of 2 SDRs — for the cost of the tools it runs on',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'perplexity.svg', name: 'Perplexity' },
    ],
  },
  {
    id: 'inbound',
    label: 'Inbound answered in minutes',
    hint: 'Qualify, enrich, route, log — before they cool',
    sources: [
      { file: 'gmail.svg', name: 'Website + Gmail' },
      { file: 'clay.png', name: 'Clay' },
    ],
    ai: [{ file: 'claude.svg', name: 'Claude', action: 'qualifies, enriches, scores against your ICP' }],
    outputs: [
      { file: 'slack.png', name: 'Slack' },
      { file: 'hubspot.png', name: 'HubSpot' },
    ],
    metric: {
      kind: 'count',
      value: 4,
      prefix: '< ',
      suffix: ' min',
      label: 'from form fill to a scored lead in your rep’s Slack',
      headcount: 'No one has to be watching the inbox for this to happen at 2am on a Sunday',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'hubspot.png', name: 'HubSpot' },
    ],
  },
  {
    id: 'content',
    label: 'Content engine that ships weekly',
    hint: 'Brief → copy → visuals → scheduled',
    sources: [{ file: 'notion.svg', name: 'Notion' }],
    ai: [
      { file: 'openai.svg', name: 'GPT', action: 'writes the draft, on brand' },
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
      headcount: 'Two weeks of social from a run that costs less than a freelancer’s day rate',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'openai.svg', name: 'GPT' },
      { file: 'gemini.svg', name: 'Gemini' },
    ],
  },
  {
    id: 'support',
    label: 'Support that holds at 10× volume',
    hint: 'Grounded in your own docs, human-approved',
    sources: [{ file: 'intercom.png', name: 'Intercom' }],
    ai: [{ file: 'claude.svg', name: 'Claude', action: 'drafts the reply from your knowledge base' }],
    gate: 'Your team approves in Slack',
    outputs: [{ file: 'intercom.png', name: 'Intercom' }],
    metric: {
      kind: 'count',
      value: 60,
      suffix: '%',
      label: 'of tickets arrive as a draft your team only has to approve',
      headcount: 'The repeatable share absorbed — so the next support hire is for the hard 40%',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'slack.png', name: 'Slack' },
    ],
  },
  {
    id: 'brief',
    label: 'The founder’s Monday brief',
    hint: 'Pipeline, product, inbox — one read',
    sources: [
      { file: 'hubspot.png', name: 'HubSpot' },
      { file: 'jira.svg', name: 'Jira' },
      { file: 'gmail.svg', name: 'Gmail' },
    ],
    ai: [{ file: 'claude.svg', name: 'Claude', action: 'summarises, ranks, flags who is waiting' }],
    outputs: [{ file: 'slack.png', name: 'Slack' }],
    metric: {
      kind: 'word',
      big: 'Daily',
      label: 'brief in Slack before you open a single tab',
      headcount: 'The reporting layer a chief of staff would build — running before you wake up',
    },
    builtWith: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
    ],
  },
];

/* ── Pipeline geometry — one fixed 900×340 space shared by SVG + chips.
      Same coordinate system as the homepage's StackDiagram: proven, and it
      keeps the two sections visually consistent. ─────────────────────────── */
const W = 900, H = 340;
const SRC_X = 128, AI_X = 420, GATE_X = 628, OUT_X = 792;
const MID = H / 2;
const rowsFor = (n: number) => (n === 1 ? [MID] : n === 2 ? [H * 0.34, H * 0.66] : [H * 0.2, MID, H * 0.8]);
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function paths(flow: Flow) {
  const srcRows = rowsFor(flow.sources.length);
  const aiRows = rowsFor(flow.ai.length);
  const outRows = rowsFor(flow.outputs.length);
  const rightStart = flow.gate ? GATE_X + 66 : AI_X + 104;
  const leftIn = srcRows.map((y, i) => {
    const ty = aiRows[Math.min(i, aiRows.length - 1)];
    return `M${SRC_X + 62},${y} C ${SRC_X + 170},${y} ${AI_X - 210},${ty} ${AI_X - 104},${ty}`;
  });
  const aiOut = flow.gate
    ? aiRows.map((y) => `M${AI_X + 104},${y} C ${AI_X + 170},${y} ${GATE_X - 130},${MID} ${GATE_X - 66},${MID}`)
    : [];
  const rightOut = outRows.map((y) => {
    const fy = flow.gate ? MID : aiRows[0];
    return `M${rightStart},${fy} C ${rightStart + 66},${fy} ${OUT_X - 150},${y} ${OUT_X - 58},${y}`;
  });
  return { leftIn, aiOut, rightOut, srcRows, aiRows, outRows };
}

export default function GrowthEngine() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { margin: '-80px' });

  const flow = FLOWS[active];
  const g = paths(flow);

  // Auto-advance until the visitor takes over; never under reduced motion.
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const t = setInterval(() => setActive((i) => (i + 1) % FLOWS.length), 7000);
    return () => clearInterval(t);
  }, [reduce, paused, inView]);

  const select = (i: number) => {
    setActive(i);
    setPaused(true);
    track('startup_flow_select', { flow: FLOWS[i].id });
  };

  return (
    <>
      <div className={styles.head}>
        <p className="eyebrow">What we actually build</p>
        <h2 className={styles.heading}>
          A system instead of a hire. <span className="accent-phrase">Here&apos;s what that means.</span>
        </h2>
        <p className={styles.sub}>
          &ldquo;Cross the Leverage Line&rdquo; is an abstraction until you see one. So here are five —
          each one a function that normally gets solved with a req, solved instead with a system that
          runs on the tools you already pay for. Your stack on both ends. A model doing the repeatable
          middle. You, approving the part that needs judgment.
        </p>
      </div>

      <div className={styles.panel} ref={panelRef}>
        <div className={styles.panelBar}>
          <span>Patterns we build for growth-stage teams</span>
          <span className={styles.panelNote}>Illustrative runs · your tools, kept</span>
        </div>

        <div className={styles.body}>
          {/* ── Flow list ─────────────────────────────────────────────────── */}
          <div className={styles.list} role="tablist" aria-label="Growth engine examples">
            {FLOWS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`${styles.listItem} ${i === active ? styles.listItemActive : ''}`}
                onClick={() => select(i)}
              >
                <span className={styles.listLabel}>{f.label}</span>
                <span className={styles.listHint}>{f.hint}</span>
              </button>
            ))}
          </div>

          {/* ── The run ───────────────────────────────────────────────────── */}
          <div className={styles.stageWrap}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={flow.id}
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
                      {(flow.gate ? g.aiOut : []).map((d) => (
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

                  {flow.sources.map((t, i) => (
                    <div key={t.name + i} className={styles.srcChip} style={{ left: pct(SRC_X, W), top: pct(g.srcRows[i], H) }}>
                      <LogoChip file={t.file} name={t.name} showName />
                    </div>
                  ))}

                  {flow.ai.map((m, i) => (
                    <div key={m.name} className={styles.aiCard} style={{ left: pct(AI_X, W), top: pct(g.aiRows[i], H) }}>
                      <LogoChip file={m.file} name={m.name} showName />
                      <span className={styles.aiAction}>{m.action}</span>
                    </div>
                  ))}

                  {flow.gate && (
                    <div className={styles.gate} style={{ left: pct(GATE_X, W), top: pct(MID, H) }}>
                      <span className={styles.gateDot} aria-hidden="true" />
                      {flow.gate}
                    </div>
                  )}

                  {flow.outputs.map((t, i) => (
                    <div key={t.name + i} className={styles.outChip} style={{ left: pct(OUT_X, W), top: pct(g.outRows[i], H) }}>
                      <LogoChip file={t.file} name={t.name} showName />
                    </div>
                  ))}
                </div>

                {/* Mobile fold: same run, vertical */}
                <div className={styles.flowStack}>
                  <div className={styles.stackRow}>
                    {flow.sources.map((t, i) => <LogoChip key={t.name + i} file={t.file} name={t.name} showName size="sm" />)}
                  </div>
                  <span className={styles.stackWire} aria-hidden="true" />
                  <div className={styles.stackAi}>
                    {flow.ai.map((m) => (
                      <div key={m.name} className={styles.aiCardStatic}>
                        <LogoChip file={m.file} name={m.name} showName size="sm" />
                        <span className={styles.aiAction}>{m.action}</span>
                      </div>
                    ))}
                  </div>
                  {flow.gate && (
                    <>
                      <span className={styles.stackWire} aria-hidden="true" />
                      <div className={styles.gateStatic}>
                        <span className={styles.gateDot} aria-hidden="true" />
                        {flow.gate}
                      </div>
                    </>
                  )}
                  <span className={styles.stackWire} aria-hidden="true" />
                  <div className={styles.stackRow}>
                    {flow.outputs.map((t, i) => <LogoChip key={t.name + i} file={t.file} name={t.name} showName size="sm" />)}
                  </div>
                </div>

                {/* ── The readout, denominated in headcount ──────────────── */}
                <div className={styles.metric}>
                  <div className={styles.metricMain}>
                    <span className={`display-num ${styles.metricNum}`}>
                      {flow.metric.kind === 'count' ? (
                        <CountUp
                          key={flow.id}
                          value={flow.metric.value}
                          prefix={flow.metric.prefix}
                          suffix={flow.metric.suffix}
                          duration={1.1}
                        />
                      ) : (
                        flow.metric.big
                      )}
                    </span>
                    <span className={styles.metricLabel}>{flow.metric.label}</span>
                  </div>
                  <div className={styles.metricSide}>
                    <span className={styles.metricSub}>{flow.metric.headcount}</span>
                    <span className={styles.builtWith}>
                      Built with
                      {flow.builtWith.map((t) => (
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

      {/* The disruption objection, answered with evidence rather than a promise:
          these are the tools the runs above start and end in. */}
      <div className={styles.stack}>
        <p className={styles.stackLabel}>Tools you already run — nothing replaced, everything connected</p>
        <div className={styles.stackRow}>
          {STACK.map((t) => (
            <LogoChip key={t.name} file={t.file} name={t.name} showName size="sm" />
          ))}
        </div>
      </div>
    </>
  );
}
