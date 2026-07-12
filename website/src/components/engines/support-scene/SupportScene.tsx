'use client';

/**
 * SupportScene — the Customer Support Engine hero demo.
 *
 * One real ticket (Acme SaaS: a $42 overage dispute + an API timeout in a
 * single message) resolved on screen inside a bright, familiar chat window:
 * the knowledge base is already live, the message is classified and split,
 * two specialist agents work in parallel, real actions land in the thread,
 * and the one part that needs judgement reaches Ahmed already briefed.
 * Loops while in view; the stepper scrubs to any beat.
 *
 * Design rule (2026-07-11): client-facing surfaces are friendly software —
 * tool logos, named humans, plain English. No terminal chrome.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './SupportScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type SlotKey = 'kb' | 'classified' | 'routed' | 'credit' | 'incident' | 'escalated';
type AgentState = 'hidden' | 'working' | 'done';

const STEPS = ['Knowledge', 'Classify', 'Route', 'Resolve', 'Escalate', 'Learn'] as const;

const KB_LINES = [
  '12,840 articles indexed',
  '342 past tickets learned from',
  'API docs v2.4 — updated 2h ago',
];

const CHIPS = ['Billing', 'Technical', 'High priority', 'Frustrated', 'Tier 1 · $8,400 ARR'];

const SLOTS: { key: SlotKey; label: string; value: string }[] = [
  { key: 'kb', label: 'Knowledge base live', value: '12,840 articles' },
  { key: 'classified', label: 'Classified', value: '0.31 s' },
  { key: 'routed', label: 'Routed to specialists', value: '2 agents' },
  { key: 'credit', label: 'Credit actually applied', value: '$42' },
  { key: 'incident', label: 'Live incident log checked', value: '#4821' },
  { key: 'escalated', label: 'Escalated with context', value: '1 thread' },
];

const CLOSE_LINES = [
  'Ticket #88421 closed · CSAT 4.7/5',
  'New pattern indexed: billing + API combo',
  'First-touch resolution this week: 73%',
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  connected: { zd: boolean; ic: boolean; sl: boolean; tw: boolean; st: boolean };
  ringPct: number;
  ringLabel: string;
  humanMeta: string;
  kbIn: boolean;
  kbLines: number;
  typing: boolean;
  custIn: boolean;
  chips: number;
  chipCaption: boolean;
  billing: AgentState;
  debug: AgentState;
  billingReplyIn: boolean;
  billingChipIn: boolean;
  debugReplyIn: boolean;
  debugChipIn: boolean;
  escalateIn: boolean;
  handoffIn: boolean;
  closeIn: boolean;
  closeLines: number;
  slots: Record<SlotKey, boolean>;
  trayIn: boolean;
  trayResolved: boolean;
  toast: string;
  toastDone: boolean;
  receipt: boolean;
}

const INITIAL: SceneState = {
  step: 0,
  connected: { zd: false, ic: false, sl: false, tw: false, st: false },
  ringPct: 0,
  ringLabel: 'waiting for the ticket',
  humanMeta: 'takes only what needs judgement',
  kbIn: false,
  kbLines: 0,
  typing: false,
  custIn: false,
  chips: 0,
  chipCaption: false,
  billing: 'hidden',
  debug: 'hidden',
  billingReplyIn: false,
  billingChipIn: false,
  debugReplyIn: false,
  debugChipIn: false,
  escalateIn: false,
  handoffIn: false,
  closeIn: false,
  closeLines: 0,
  slots: { kb: false, classified: false, routed: false, credit: false, incident: false, escalated: false },
  trayIn: false,
  trayResolved: false,
  toast: 'Starting the engine…',
  toastDone: false,
  receipt: false,
};

/** Cumulative end-state per beat — lets the stepper scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  (s) => ({
    ...s,
    connected: { zd: true, ic: true, sl: true, tw: true, st: true },
    kbIn: true, kbLines: KB_LINES.length,
    slots: { ...s.slots, kb: true },
    ringPct: 8, ringLabel: 'KB live',
  }),
  (s) => ({
    ...s,
    custIn: true, chips: CHIPS.length, chipCaption: true,
    slots: { ...s.slots, classified: true },
    ringPct: 25, ringLabel: 'classified 0.31s',
  }),
  (s) => ({
    ...s,
    billing: 'working', debug: 'working',
    slots: { ...s.slots, routed: true },
    ringPct: 40, ringLabel: '2 agents on it',
  }),
  (s) => ({
    ...s,
    billing: 'done', debug: 'done',
    billingReplyIn: true, billingChipIn: true,
    debugReplyIn: true, debugChipIn: true,
    slots: { ...s.slots, credit: true, incident: true },
    ringPct: 65, ringLabel: 'credit applied',
  }),
  (s) => ({
    ...s,
    escalateIn: true, handoffIn: true, trayIn: true,
    slots: { ...s.slots, escalated: true },
    ringPct: 85, ringLabel: 'Ahmed briefed',
    humanMeta: 'picked up one thread — already briefed',
  }),
  (s) => ({
    ...s,
    trayResolved: true, closeIn: true, closeLines: CLOSE_LINES.length,
    ringPct: 100, ringLabel: 'resolved · CSAT 4.7',
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SupportScene() {
  const shellRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
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
      setS({ ...fin, step: 6, receipt: true, toastDone: true, toast: 'First response 8 seconds — resolved with real actions' });
      return;
    }

    const playBeat = (i: number, done: () => void) => {
      patch({ step: i });
      if (i === 0) {
        patch({ toast: 'Indexing docs, past tickets and release notes…', toastDone: false });
        at(200, () => patch((p) => ({ connected: { ...p.connected, zd: true } })));
        at(500, () => patch((p) => ({ connected: { ...p.connected, ic: true } })));
        at(800, () => patch((p) => ({ connected: { ...p.connected, sl: true } })));
        at(1100, () => patch((p) => ({ connected: { ...p.connected, tw: true } })));
        at(1400, () => patch((p) => ({ connected: { ...p.connected, st: true } })));
        at(400, () => patch({ kbIn: true }));
        KB_LINES.forEach((_, k) => at(1000 + k * 600, () => patch({ kbLines: k + 1 })));
        at(2800, () => patch((p) => ({
          slots: { ...p.slots, kb: true }, ringPct: 8, ringLabel: 'KB live',
          toast: 'The knowledge base is already live — answers come from current docs, not last year’s FAQ',
          toastDone: true,
        })));
        at(4600, done);
      } else if (i === 1) {
        patch({ toast: 'A new ticket is coming in…', toastDone: false });
        at(300, () => patch({ typing: true }));
        at(1500, () => patch({ typing: false, custIn: true, toast: 'Reading the message…', toastDone: false }));
        CHIPS.forEach((_, k) => at(2300 + k * 450, () => patch({ chips: k + 1 })));
        at(4700, () => patch((p) => ({
          chipCaption: true,
          slots: { ...p.slots, classified: true },
          ringPct: 25, ringLabel: 'classified 0.31s',
          toast: 'Classified in 0.31 seconds — two issues in one message, split into two threads',
          toastDone: true,
        })));
        at(6400, done);
      } else if (i === 2) {
        patch({ toast: 'Routing each thread to the right specialist…', toastDone: false });
        at(500, () => patch({ billing: 'working' }));
        at(1100, () => patch({ debug: 'working' }));
        at(1900, () => patch((p) => ({
          slots: { ...p.slots, routed: true },
          ringPct: 40, ringLabel: '2 agents on it',
          toast: 'Two specialists working in parallel — no queue, no transfers',
          toastDone: true,
        })));
        at(4000, done);
      } else if (i === 3) {
        patch({ toast: 'Billing Agent pulling account data…', toastDone: false });
        at(1300, () => patch({ billing: 'done', billingReplyIn: true }));
        at(2500, () => patch((p) => ({
          billingChipIn: true,
          slots: { ...p.slots, credit: true },
          ringPct: 65, ringLabel: 'credit applied',
          toast: 'The $42 credit is actually applied — an action, not a promise to look into it',
          toastDone: true,
        })));
        at(4400, () => patch({ toast: 'Debug Agent checking the live incident log…', toastDone: false }));
        at(5700, () => patch({ debug: 'done', debugReplyIn: true }));
        at(6900, () => patch((p) => ({
          debugChipIn: true,
          slots: { ...p.slots, incident: true },
          toast: 'Incident #4821 confirmed from the live log — ETA shared before the customer asked',
          toastDone: true,
        })));
        at(9600, done);
      } else if (i === 4) {
        patch({ toast: 'Checking confidence before anything ships…', toastDone: false });
        at(700, () => patch({ escalateIn: true }));
        at(1500, () => patch({ toast: 'Confidence 0.61 is below the 0.75 threshold — this goes to a human', toastDone: true }));
        at(2500, () => patch({ handoffIn: true, toast: 'Packaging full context for Ahmed…', toastDone: false }));
        at(3300, () => patch((p) => ({
          trayIn: true,
          slots: { ...p.slots, escalated: true },
          ringPct: 85, ringLabel: 'Ahmed briefed',
          humanMeta: 'picked up one thread — already briefed',
        })));
        at(3900, () => patch({ toast: 'Ahmed edits a briefed draft — the customer never repeats themselves', toastDone: true }));
        at(6000, done);
      } else if (i === 5) {
        patch({ toast: 'Ahmed replies from the briefed draft…', toastDone: false });
        at(900, () => patch({ trayResolved: true }));
        CLOSE_LINES.forEach((_, k) => at(1800 + k * 700, () => patch({ closeIn: true, closeLines: k + 1 })));
        at(3200, () => patch({ ringPct: 100, ringLabel: 'resolved · CSAT 4.7' }));
        at(3800, () => patch({ toast: 'The KB just learned a new pattern — the next combo ticket resolves itself', toastDone: true }));
        at(5400, done);
      } else {
        patch({ step: 6 });
        at(300, () => patch({ receipt: true, toast: 'First response 8 seconds — resolved with real actions', toastDone: true }));
        at(6600, done);
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
  }, [reduced, stop]);

  useEffect(() => {
    // Kick off via a timer so no state updates happen synchronously in the
    // effect body (react-hooks/set-state-in-effect).
    const id = window.setTimeout(() => {
      if (reduced || inView) goTo(0);
      else { stop(); setS(INITIAL); }
    }, 0);
    return () => { window.clearTimeout(id); stop(); };
  }, [inView, reduced, goTo, stop]);

  useEffect(() => {
    // Keep the chat pinned to the newest message as the thread grows.
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [s, reduced]);

  return (
    <div className={styles.scene} ref={shellRef}>
      <div className={styles.window} aria-label="Customer Support Engine — live demonstration">

        {/* ── Window chrome ── */}
        <div className={styles.chrome}>
          <div className={styles.dots} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.chromeTitle}>Chronexa · Customer Support Engine</span>
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
                <span className={`${styles.avatar} ${styles.avatarAs}`}>AS</span>
                <div>
                  <div className={styles.clientName}>Acme SaaS</div>
                  <div className={styles.clientMeta}>800 tickets/month · email, chat, voice</div>
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
                <span className={styles.ringLabel}><b>This ticket</b><br />{s.ringLabel}</span>
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Connected</div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoZd}`}>Z</span>Zendesk
                {s.connected.zd && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoIc}`}>IC</span>Intercom
                {s.connected.ic && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoSl}`}>SL</span>Slack
                {s.connected.sl && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoTw}`}>TW</span>Twilio
                {s.connected.tw && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoSt}`}>ST</span>Status page
                {s.connected.st && <span className={styles.appStatus}>Connected</span>}
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Your team</div>
              <div className={styles.humanRow}>
                <span className={`${styles.avatar} ${styles.avatarAh}`}>AH</span>
                <div>
                  <div className={styles.humanName}>Ahmed — Tier 2 support</div>
                  <div className={styles.humanMeta}>{s.humanMeta}</div>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.main}>
            {/* ── Left: the conversation ── */}
            <div className={styles.workL}>
              <span className={styles.paneTitle}>The conversation</span>
              <div className={styles.chatCard}>
                <div className={styles.chatBar}>
                  <span className={`${styles.logo} ${styles.logoIc} ${styles.chatBarLogo}`}>IC</span>
                  Live chat · Intercom
                  {s.custIn && <span className={styles.chatBarTicket}>Ticket #88421</span>}
                </div>
                <div className={styles.chatScroll} ref={chatRef}>

                  {s.kbIn && (
                    <div className={styles.kbCard}>
                      <div className={styles.kbHead}>
                        <span className={styles.kbTitle}>Knowledge base</span>
                        <span className={styles.kbLive}>Live</span>
                      </div>
                      {KB_LINES.map((line, i) => (
                        i < s.kbLines && (
                          <div key={line} className={styles.kbLine}>
                            <span className={styles.kbCheck} aria-hidden="true">{'✓'}</span>{line}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {s.typing && (
                    <div className={`${styles.msg} ${styles.msgCust}`}>
                      <span className={styles.msgWho}>Acme SaaS · customer</span>
                      <div className={`${styles.bubble} ${styles.bubbleCust} ${styles.bubbleTyping}`} aria-label="Customer is typing">
                        <span className={styles.typingDot} /><span className={styles.typingDot} /><span className={styles.typingDot} />
                      </div>
                    </div>
                  )}

                  {s.custIn && (
                    <div className={`${styles.msg} ${styles.msgCust}`}>
                      <span className={styles.msgWho}>Acme SaaS · customer</span>
                      <div className={`${styles.bubble} ${styles.bubbleCust}`}>
                        We got charged $42 extra this month AND your API keeps timing out. This is blocking our launch.
                      </div>
                      <div className={styles.chipsRow}>
                        {CHIPS.map((c, i) => (
                          i < s.chips && <span key={c} className={styles.chip}>{c}</span>
                        ))}
                      </div>
                      {s.chipCaption && (
                        <span className={styles.chipCaption}>classified in 0.31 seconds — split into two threads</span>
                      )}
                    </div>
                  )}

                  {s.billing !== 'hidden' && (
                    <div className={styles.agentsRow}>
                      <div className={styles.agentCard} data-done={s.billing === 'done' ? 'true' : 'false'}>
                        <span className={`${styles.agentMark} ${styles.agentMarkB}`}>BA</span>
                        <div className={styles.agentText}>
                          <span className={styles.agentName}>Billing Agent</span>
                          <span className={styles.agentTask}>pulling account data…</span>
                        </div>
                        <span className={styles.agentSpin} aria-hidden="true" />
                        <span className={styles.agentCheck} aria-hidden="true">{'✓'}</span>
                      </div>
                      {s.debug !== 'hidden' && (
                        <div className={styles.agentCard} data-done={s.debug === 'done' ? 'true' : 'false'}>
                          <span className={`${styles.agentMark} ${styles.agentMarkD}`}>DA</span>
                          <div className={styles.agentText}>
                            <span className={styles.agentName}>Debug Agent</span>
                            <span className={styles.agentTask}>checking live system status…</span>
                          </div>
                          <span className={styles.agentSpin} aria-hidden="true" />
                          <span className={styles.agentCheck} aria-hidden="true">{'✓'}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {s.billingReplyIn && (
                    <div className={`${styles.msg} ${styles.msgAgent}`}>
                      <span className={styles.msgWho}>Billing Agent</span>
                      <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                        You&rsquo;re right — 14,200 API calls over your plan limit caused the $42 charge.
                        I&rsquo;ve applied a $42 credit to your account — confirmed.
                      </div>
                      {s.billingChipIn && (
                        <span className={styles.actionChip}>Action taken: $42 credit applied {'✓'}</span>
                      )}
                    </div>
                  )}

                  {s.debugReplyIn && (
                    <div className={`${styles.msg} ${styles.msgAgent}`}>
                      <span className={styles.msgWho}>Debug Agent</span>
                      <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                        The /v2/export timeout is a known incident (#4821) — engineering is on it,
                        ETA about 2 hours. I&rsquo;ll update you here when it clears.
                      </div>
                      {s.debugChipIn && (
                        <span className={styles.checkChip}>Checked live incident log — 30s ago</span>
                      )}
                    </div>
                  )}

                  {s.escalateIn && (
                    <div className={styles.escCard}>
                      <div className={styles.escHead}>
                        <span className={styles.escTitle}>Debug Agent — confidence 0.61</span>
                        <span className={styles.escPill}>below 0.75 threshold</span>
                      </div>
                      {s.handoffIn && (
                        <>
                          <div className={styles.escHandoff}>
                            → Ahmed · full context packaged: thread, draft reply, KB articles, live system data · SLA 4 hrs
                          </div>
                          <p className={styles.escTrust}>Ahmed edits a briefed draft — the customer never repeats themselves.</p>
                        </>
                      )}
                    </div>
                  )}

                  {s.closeIn && (
                    <div className={styles.closeCard}>
                      {CLOSE_LINES.map((line, i) => (
                        i < s.closeLines && (
                          <div key={line} className={styles.closeLine}>
                            <span className={styles.closeCheck} aria-hidden="true">{'✓'}</span>{line}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right: behind the reply ── */}
            <div className={styles.workR}>
              <span className={styles.paneTitle}>Behind the reply</span>
              <div className={styles.slotCard}>
                {SLOTS.map((slot) => (
                  <div key={slot.key} className={styles.slotItem} data-on={s.slots[slot.key] ? 'true' : 'false'}>
                    <span className={styles.slotCheck} aria-hidden="true">{'✓'}</span>
                    <span className={styles.slotLab}>{slot.label}</span>
                    <span className={styles.slotVal}>{slot.value}</span>
                  </div>
                ))}
              </div>

              <div className={styles.tray}>
                <div className={styles.trayHead}>
                  <span className={styles.trayTitle}>With Ahmed</span>
                  <span className={styles.trayCount}>{s.trayIn ? '1 thread' : '0 threads'}</span>
                </div>
                <div className={styles.trayBody}>
                  <div className={styles.trayItem} data-in={s.trayIn ? 'true' : 'false'} data-resolved={s.trayResolved ? 'true' : 'false'}>
                    <span className={styles.trayMark}>!</span>
                    <span className={styles.trayText}>
                      Debug thread — draft reply, KB refs, live system data · SLA 4 hrs&nbsp;
                      <span className={styles.trayFix}>Ahmed replied — 4 min, no back-and-forth {'✓'}</span>
                    </span>
                  </div>
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
                <p className={styles.receiptTitle}>First response in 8 seconds. Resolved with real actions.</p>
                <p className={styles.receiptSub}>73% of tickets never need a human. The 27% that do reach Ahmed already briefed.</p>
                <div className={styles.receiptRows}>
                  <div className={styles.receiptRow}><span>First response</span><b className={styles.receiptHl}>8 sec</b></div>
                  <div className={styles.receiptRow}><span>Resolved without a human</span><b className={styles.receiptHl}>73%</b></div>
                  <div className={styles.receiptRow}><span>Actions taken (credit, incident check)</span><b>real, not canned</b></div>
                  <div className={styles.receiptRow}><span>Escalations arrive briefed</span><b>100%</b></div>
                  <div className={styles.receiptRow}><span>CSAT</span><b>4.7/5</b></div>
                </div>
                <BookButton className={styles.receiptCta} location="customer-support-engine-scene-receipt">
                  Run a week of your tickets →
                </BookButton>
                <span className={styles.receiptFine}>
                  We replay your historical tickets and show you what would have resolved, what would have escalated, and your first-touch rate.<br />
                  <b>Zendesk · Intercom · Freshdesk · voice via Twilio/ElevenLabs</b>
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
