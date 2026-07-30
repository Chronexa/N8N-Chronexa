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
 * Everything above it argues a thesis: output should decouple from headcount.
 * This is the proof by demonstration of what "a system instead of a hire"
 * actually IS — the founder's own stack on both ends, a model doing the
 * repeatable middle, a human approving where judgment matters, and a readout
 * denominated in HEADCOUNT (the unit a Series A founder budgets in, which
 * closes the loop with the diagnostic's Headcount Tax).
 *
 * Two things it does deliberately, both from Ankit's feedback:
 *
 *   • IT NARRATES ITSELF, in a ~4-second run. The pipeline used to pulse
 *     forever with no explanation, which meant a founder had to already
 *     understand it to get anything from it. Now each run steps through 3-4
 *     beats, roughly a second each, and a plain-English line says what is
 *     happening in that beat ("Someone fills in your website form at 2am").
 *     Nodes not yet reached stay dimmed, so the eye is led rather than
 *     scattered. Under reduced-motion it renders the finished state at once.
 *
 *   • THE PANEL IS FULL-BLEED. It sits outside `.container` (the page passes
 *     no container wrapper for this section) rather than using 100vw tricks,
 *     which avoids the horizontal-scrollbar bug those cause. The stage uses a
 *     CLAMPED HEIGHT, not `aspect-ratio` — at 900/340 a full-width stage would
 *     be 725px tall on a 1920px screen. The wires SVG is preserveAspectRatio
 *     "none" and the chips are positioned in percentages, so both stretch to
 *     whatever width the viewport gives them.
 *
 * HONESTY RULE: these are illustrative runs of patterns we genuinely build
 * (the outbound and content engines are our own production workflows),
 * labelled as illustrative. The headcount equivalences are capacity
 * comparisons, NOT client results — no named clients, no invented outcomes.
 */

type Tool = { file: string; name: string };
type AiStep = { file: string; name: string; action: string };
type Zone = 'sources' | 'ai' | 'gate' | 'outputs';
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
  /** Plain-English narration, one line per beat of the run. No jargon. */
  story: { sources: string; ai: string; gate?: string; outputs: string };
  metric: Metric;
  builtWith: Tool[];
};

/* The stack a growth-stage team already runs, plus the models we orchestrate
   into it. Lives here rather than in the hero, where the redesign spec bans
   tool logos (§7 Section 1) and §15 lists the strip as something to demote.
   Here it isn't decoration — it's the evidence for this section's own claim
   that nothing gets replaced. A logo here is a claim. */
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
    story: {
      sources: 'You describe the kind of company you want to sell to. That’s your whole input.',
      ai: 'Claude reads each company’s site and recent news, then writes an opener about them — not a mail-merge template.',
      gate: 'You skim the batch over coffee and approve what goes out. Nothing sends without you.',
      outputs: 'The emails send and replies land in your CRM. Nobody on your team wrote 400 emails.',
    },
    metric: {
      kind: 'count',
      value: 400,
      suffix: ' accounts',
      label: 'researched and personally written to in one overnight run',
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
    story: {
      sources: 'Someone fills in your website form at 2am on a Sunday.',
      ai: 'Claude works out who they actually are, how big they are, and how closely they match your best customers.',
      outputs: 'Your rep wakes up to a scored lead in Slack, already written into HubSpot — while the lead is still warm.',
    },
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
    story: {
      sources: 'You drop one line of direction into Notion. That’s the brief.',
      ai: 'GPT writes the posts in your voice. Gemini makes the images to go with them.',
      gate: 'You approve a fortnight of content in one sitting, instead of chasing it daily.',
      outputs: 'Everything schedules itself to LinkedIn and Instagram. No one had to “find time for content”.',
    },
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
    story: {
      sources: 'A customer asks a question you have answered a hundred times before.',
      ai: 'Claude writes the reply using your own help docs — so it’s your answer, not a chatbot’s guess.',
      gate: 'Your team reads it, agrees, and hits send. Judgment stays human.',
      outputs: 'The customer has a correct answer in minutes instead of tomorrow afternoon.',
    },
    metric: {
      kind: 'count',
      value: 60,
      suffix: '%',
      label: 'of tickets arrive as a draft your team only has to approve',
      headcount: 'The repeatable share absorbed — so your next support hire is for the hard 40%',
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
    story: {
      sources: 'Overnight your pipeline moved, the sprint moved, and your inbox filled up.',
      ai: 'Claude reads all three and works out the handful of things that actually matter today.',
      outputs: 'One Slack message before you open a single tab: what moved, what’s stuck, who’s waiting on you.',
    },
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

/* ── Pipeline geometry. One fixed 900×340 coordinate space shared by the SVG
      wires and the absolutely-positioned chips. The rendered stage is a
      CLAMPED HEIGHT rather than this aspect ratio (see the note at the top),
      so everything here stretches horizontally on wide screens. ─────────── */
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

/** The beats of one run, in order, each with the plain-English line that
 *  describes it. Flows without a human gate simply have one beat fewer. */
function beatsFor(flow: Flow): { zone: Zone; text: string }[] {
  return [
    { zone: 'sources', text: flow.story.sources },
    { zone: 'ai', text: flow.story.ai },
    ...(flow.gate && flow.story.gate ? [{ zone: 'gate' as Zone, text: flow.story.gate }] : []),
    { zone: 'outputs', text: flow.story.outputs },
  ];
}

/* 1500ms per beat puts BOTH flow lengths inside the 3-5s brief: a 3-beat run
   (no human gate) takes 2 transitions = 3.0s, a 4-beat run takes 3 = 4.5s.
   At 1150ms the short flows finished in 2.3s, which read as a flicker. */
const BEAT_MS = 1500;
const HOLD_MS = 2200;   // time on the finished frame before the next flow

export default function GrowthEngine() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [beat, setBeat] = useState(0);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { margin: '-80px' });

  const flow = FLOWS[active];
  const g = paths(flow);
  const beats = beatsFor(flow);
  const lastBeat = beats.length - 1;

  /* Reduced motion is a DERIVED render decision, not state — those users just
     see the finished frame. Keeping it out of the effect also avoids calling
     setState synchronously in an effect body, which cascades renders. */
  const shownBeat = reduce ? lastBeat : beat;

  // Step through the run. Every update is scheduled, including the reset to 0
  // on a flow change, so nothing sets state synchronously here.
  useEffect(() => {
    if (reduce || !inView) return;
    const timers = [setTimeout(() => setBeat(0), 0)];
    for (let i = 1; i <= lastBeat; i++) {
      timers.push(setTimeout(() => setBeat(i), BEAT_MS * i));
    }
    return () => timers.forEach(clearTimeout);
  }, [active, inView, reduce, lastBeat]);

  // Advance to the next flow once this run has played and held.
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const total = BEAT_MS * lastBeat + HOLD_MS;
    const t = setTimeout(() => setActive((i) => (i + 1) % FLOWS.length), total);
    return () => clearTimeout(t);
  }, [active, reduce, paused, inView, lastBeat]);

  const select = (i: number) => {
    setActive(i);
    setPaused(true);
    track('startup_flow_select', { flow: FLOWS[i].id });
  };

  /** idle → not reached yet (dimmed); active → happening now (glowing);
   *  done → already happened (full opacity, calm). */
  const stateOf = (zone: Zone): 'idle' | 'active' | 'done' => {
    const idx = beats.findIndex((b) => b.zone === zone);
    if (idx < 0) return 'done';
    if (shownBeat === idx) return 'active';
    return shownBeat > idx ? 'done' : 'idle';
  };
  /** Which wire bundle carries the pulse right now. */
  const pulsingInto = beats[shownBeat]?.zone;

  const pulse = (d: string, key: string, dur: string) => (
    <circle key={key} r="4.5" className={styles.pulse}>
      <animateMotion dur={dur} repeatCount="indefinite" path={d} />
    </circle>
  );

  return (
    <>
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">What we actually build</p>
          <h2 className={styles.heading}>
            A system instead of a hire. <span className="accent-phrase">Here&apos;s what that means.</span>
          </h2>
          <p className={styles.sub}>
            &ldquo;Cross the Leverage Line&rdquo; is an abstraction until you watch one run. So here are
            five — each a job that normally gets solved with a new hire, solved instead with a system
            that runs on the tools you already pay for. Watch any of them play out.
          </p>
        </div>
      </div>

      {/* Full-bleed: deliberately NOT wrapped in .container. */}
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
                    {/* Work travels only the segment being narrated right now. */}
                    <g className={styles.pulses} key={`${flow.id}-${shownBeat}`}>
                      {pulsingInto === 'ai' && g.leftIn.map((d, i) => pulse(d, `a${i}`, '1.1s'))}
                      {pulsingInto === 'gate' && g.aiOut.map((d, i) => pulse(d, `b${i}`, '1s'))}
                      {pulsingInto === 'outputs' && g.rightOut.map((d, i) => pulse(d, `c${i}`, '1.1s'))}
                    </g>
                  </svg>

                  {flow.sources.map((t, i) => (
                    <div
                      key={t.name + i}
                      className={styles.srcChip}
                      data-state={stateOf('sources')}
                      style={{ left: pct(SRC_X, W), top: pct(g.srcRows[i], H) }}
                    >
                      <LogoChip file={t.file} name={t.name} showName />
                    </div>
                  ))}

                  {flow.ai.map((m, i) => (
                    <div
                      key={m.name}
                      className={styles.aiCard}
                      data-state={stateOf('ai')}
                      style={{ left: pct(AI_X, W), top: pct(g.aiRows[i], H) }}
                    >
                      <LogoChip file={m.file} name={m.name} showName />
                      <span className={styles.aiAction}>{m.action}</span>
                    </div>
                  ))}

                  {flow.gate && (
                    <div
                      className={styles.gate}
                      data-state={stateOf('gate')}
                      style={{ left: pct(GATE_X, W), top: pct(MID, H) }}
                    >
                      <span className={styles.gateDot} aria-hidden="true" />
                      {flow.gate}
                    </div>
                  )}

                  {flow.outputs.map((t, i) => (
                    <div
                      key={t.name + i}
                      className={styles.outChip}
                      data-state={stateOf('outputs')}
                      style={{ left: pct(OUT_X, W), top: pct(g.outRows[i], H) }}
                    >
                      <LogoChip file={t.file} name={t.name} showName />
                    </div>
                  ))}
                </div>

                {/* Mobile fold: same run, vertical, same beat states */}
                <div className={styles.flowStack}>
                  <div className={styles.stackRow} data-state={stateOf('sources')}>
                    {flow.sources.map((t, i) => <LogoChip key={t.name + i} file={t.file} name={t.name} showName size="sm" />)}
                  </div>
                  <span className={styles.stackWire} aria-hidden="true" />
                  <div className={styles.stackAi} data-state={stateOf('ai')}>
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
                      <div className={styles.gateStatic} data-state={stateOf('gate')}>
                        <span className={styles.gateDot} aria-hidden="true" />
                        {flow.gate}
                      </div>
                    </>
                  )}
                  <span className={styles.stackWire} aria-hidden="true" />
                  <div className={styles.stackRow} data-state={stateOf('outputs')}>
                    {flow.outputs.map((t, i) => <LogoChip key={t.name + i} file={t.file} name={t.name} showName size="sm" />)}
                  </div>
                </div>

                {/* ── Narration: what is happening, in plain words ───────── */}
                <div className={styles.narration}>
                  <div className={styles.beatDots} aria-hidden="true">
                    {beats.map((b, i) => (
                      <span key={b.zone} className={styles.beatDot} data-on={i <= shownBeat ? 'true' : undefined} />
                    ))}
                  </div>
                  <p className={styles.narrationText} aria-live="polite">
                    {beats[shownBeat]?.text}
                  </p>
                </div>

                {/* ── Readout, denominated in headcount ──────────────────── */}
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
      <div className="container">
        <div className={styles.stack}>
          <p className={styles.stackLabel}>Tools you already run — nothing replaced, everything connected</p>
          <div className={styles.stackRow2}>
            {STACK.map((t) => (
              <LogoChip key={t.name} file={t.file} name={t.name} showName size="sm" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
