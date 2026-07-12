'use client';

/**
 * SalesScene — the Sales Engine hero demo.
 *
 * One morning's outbound run ("Tuesday's outbound run") built on screen inside
 * a bright, familiar app window: buyers are sourced, one account (Rahul Verma,
 * Acme Logistics) is researched and scored, a personalised sequence is written,
 * a named human approves the batch, and 41 sequences go out. Loops while in
 * view; the stepper scrubs to any beat.
 *
 * Design rule (2026-07-11): client-facing surfaces are friendly software —
 * tool logos, named humans, plain English. No terminal chrome.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './SalesScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type SeqKey = 'research' | 'fit' | 'subject' | 'email1' | 'followups' | 'status';
type HeldKey = 'dropped' | 'held';
type View = 'leads' | 'profile' | 'score' | 'compose' | 'queue' | 'send';

const STEPS = ['Source', 'Research', 'Score', 'Write', 'Approve', 'Send'] as const;

const LEADS = [
  { name: 'Rahul Verma', meta: 'VP Sales · Acme Logistics', ini: 'RV' },
  { name: 'Priya Nair', meta: 'Head of Ops · FleetIQ', ini: 'PN' },
];

const ENRICH = [
  { id: 'e1', lab: 'Funding', val: 'Series B · raised 14 months ago' },
  { id: 'e2', lab: 'Hiring', val: '4 SDRs · scaling outbound' },
  { id: 'e3', lab: 'Stack', val: 'HubSpot · Outreach' },
  { id: 'e4', lab: 'Signal', val: 'Freight-cost pressure (Q2 update)' },
];

const EMAIL_SUBJECT = 'Cutting Acme’s freight-cost leakage';
const EMAIL_BODY =
  'Hi Rahul — saw Acme’s Q2 update flag freight-cost pressure. Teams a year past a Series B usually find real leakage hiding in carrier spend — worth a quick look at how Acme is tracking it?';

const QUEUE_ROWS: { id: string; kind: 'ok' | 'edit' | 'hold'; text: string }[] = [
  { id: 'q1', kind: 'ok', text: '38 approved in one click ✓' },
  { id: 'q2', kind: 'edit', text: '2 edited by Alex before sending' },
  { id: 'q3', kind: 'hold', text: '1 held back — routed to you' },
];

const SEND_ROWS = [
  '41 enrolled · first touch 09:00 local',
  'Channels: email + LinkedIn',
  'Replies land in your inbox',
];

const SEQ_LINES: { key: SeqKey; label: string }[] = [
  { key: 'research', label: 'Company research' },
  { key: 'fit', label: 'Fit score' },
  { key: 'subject', label: 'Subject line' },
  { key: 'email1', label: 'Email 1' },
  { key: 'followups', label: 'Follow-ups' },
  { key: 'status', label: 'Status' },
];

const SEQ_VALUES: Record<SeqKey, string> = {
  research: '4 signals ✓',
  fit: '92 / 100',
  subject: `“${EMAIL_SUBJECT}”`,
  email1: '“Hi Rahul — saw Acme’s Q2 update…”',
  followups: '5 scheduled',
  status: 'sending',
};

const HELD_ITEMS: { key: HeldKey; text: string }[] = [
  { key: 'dropped', text: '19 low-fit accounts dropped — not contacted.' },
  { key: 'held', text: '1 email held back — waits for your call before it sends.' },
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  connected: { ap: boolean; li: boolean; hs: boolean; in: boolean; cl: boolean };
  view: View;
  leadsIn: number;
  moreIn: boolean;
  enrichIn: number;
  fitScore: number;
  chipsIn: number;
  droppedIn: boolean;
  subjectIn: boolean;
  typed: number;
  followupsIn: boolean;
  queueIn: number;
  approveIn: boolean;
  approveClicked: boolean;
  sendIn: number;
  seq: Partial<Record<SeqKey, string>>;
  heldIn: Record<HeldKey, boolean>;
  heldCount: string;
  seqStatus: string;
  seqGood: boolean;
  ringPct: number;
  ringLabel: string;
  toast: string;
  toastDone: boolean;
  alexMeta: string;
  receipt: boolean;
  paneTitle: string;
}

const INITIAL: SceneState = {
  step: 0,
  connected: { ap: false, li: false, hs: false, in: false, cl: false },
  view: 'leads',
  leadsIn: 0,
  moreIn: false,
  enrichIn: 0,
  fitScore: 0,
  chipsIn: 0,
  droppedIn: false,
  subjectIn: false,
  typed: 0,
  followupsIn: false,
  queueIn: 0,
  approveIn: false,
  approveClicked: false,
  sendIn: 0,
  seq: {},
  heldIn: { dropped: false, held: false },
  heldCount: '0 items',
  seqStatus: 'waiting',
  seqGood: false,
  ringPct: 0,
  ringLabel: 'waiting to start',
  toast: 'Starting the engine…',
  toastDone: false,
  alexMeta: 'approves every send',
  receipt: false,
  paneTitle: 'This morning’s buyers',
};

/** Cumulative end-state per beat — lets the stepper scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  (s) => ({
    ...s,
    connected: { ...s.connected, ap: true, li: true },
    leadsIn: LEADS.length, moreIn: true,
    ringPct: 15, ringLabel: '2,341 sourced',
    paneTitle: 'This morning’s buyers',
  }),
  (s) => ({
    ...s,
    view: 'profile', enrichIn: ENRICH.length,
    seq: { ...s.seq, research: SEQ_VALUES.research },
    seqStatus: 'building…',
    ringPct: 35, ringLabel: 'research complete',
    paneTitle: 'Researching Rahul’s account',
  }),
  (s) => ({
    ...s,
    view: 'score',
    connected: { ...s.connected, hs: true },
    fitScore: 92, chipsIn: 2, droppedIn: true,
    heldIn: { ...s.heldIn, dropped: true }, heldCount: '1 item',
    seq: { ...s.seq, fit: SEQ_VALUES.fit },
    ringPct: 55, ringLabel: '41 best-fit accounts',
    paneTitle: 'Scoring for fit',
  }),
  (s) => ({
    ...s,
    view: 'compose',
    connected: { ...s.connected, cl: true },
    subjectIn: true, typed: EMAIL_BODY.length, followupsIn: true,
    seq: { ...s.seq, subject: SEQ_VALUES.subject, email1: SEQ_VALUES.email1, followups: SEQ_VALUES.followups },
    ringPct: 70, ringLabel: 'sequences drafted',
    paneTitle: 'Writing Rahul’s sequence',
  }),
  (s) => ({
    ...s,
    view: 'queue',
    queueIn: QUEUE_ROWS.length, approveIn: true, approveClicked: true,
    heldIn: { ...s.heldIn, held: true }, heldCount: '2 items',
    alexMeta: 'approved 38 in one click',
    ringPct: 90, ringLabel: 'batch approved',
    paneTitle: 'Waiting on Alex',
  }),
  (s) => ({
    ...s,
    view: 'send',
    connected: { ...s.connected, in: true },
    sendIn: SEND_ROWS.length,
    seq: { ...s.seq, status: SEQ_VALUES.status },
    seqStatus: 'sending ✓', seqGood: true,
    ringPct: 100, ringLabel: '41 sending',
    paneTitle: 'Sending on schedule',
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SalesScene() {
  const shellRef = useRef<HTMLDivElement>(null);
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
      setS({ ...fin, step: 6, receipt: true, toastDone: true, toast: '~4 minutes of rep time — the engine did the rest' });
      return;
    }

    const playBeat = (i: number, done: () => void) => {
      patch({ step: i });
      if (i === 0) {
        patch({
          view: 'leads', paneTitle: 'This morning’s buyers',
          toast: 'Pulling this morning’s buyers from Apollo and LinkedIn…', toastDone: false,
        });
        at(250, () => patch((p) => ({ connected: { ...p.connected, ap: true } })));
        at(700, () => patch((p) => ({ connected: { ...p.connected, li: true } })));
        at(1000, () => patch({ leadsIn: 1 }));
        at(1600, () => patch({ leadsIn: 2 }));
        at(2300, () => patch({ moreIn: true, ringPct: 15, ringLabel: '2,341 sourced' }));
        at(2800, () => patch({ toast: '2,341 buyers matched to your ICP — no lists built by hand', toastDone: true }));
        at(5000, done);
      } else if (i === 1) {
        patch({
          view: 'profile', paneTitle: 'Researching Rahul’s account', seqStatus: 'building…',
          toast: 'Reading Acme’s site, news and hiring pages…', toastDone: false,
        });
        ENRICH.forEach((_, k) => at(800 + k * 900, () => patch({ enrichIn: k + 1 })));
        at(4300, () => patch((p) => ({
          seq: { ...p.seq, research: SEQ_VALUES.research },
          ringPct: 35, ringLabel: 'research complete',
          toast: 'Every account researched — real context, not just a name', toastDone: true,
        })));
        at(6200, done);
      } else if (i === 2) {
        patch({
          view: 'score', paneTitle: 'Scoring for fit',
          toast: 'Scoring against the customers you already win…', toastDone: false,
        });
        at(300, () => patch((p) => ({ connected: { ...p.connected, hs: true } })));
        for (let k = 1; k <= 23; k++) {
          const v = Math.round((92 * k) / 23);
          at(500 + k * 55, () => patch({ fitScore: v }));
        }
        at(2100, () => patch({ chipsIn: 1 }));
        at(2600, () => patch({ chipsIn: 2 }));
        at(3300, () => patch({
          droppedIn: true,
          toast: '19 weak fits dropped — your team never sees them', toastDone: true,
        }));
        at(4000, () => patch((p) => ({
          heldIn: { ...p.heldIn, dropped: true }, heldCount: '1 item',
          seq: { ...p.seq, fit: SEQ_VALUES.fit },
          ringPct: 55, ringLabel: '41 best-fit accounts',
        })));
        at(6200, done);
      } else if (i === 3) {
        patch({
          view: 'compose', paneTitle: 'Writing Rahul’s sequence',
          subjectIn: false, typed: 0, followupsIn: false,
          toast: 'Writing Rahul’s opener from the research — not a mail-merge', toastDone: false,
        });
        at(400, () => patch((p) => ({ connected: { ...p.connected, cl: true } })));
        at(900, () => patch((p) => ({ subjectIn: true, seq: { ...p.seq, subject: SEQ_VALUES.subject } })));
        const ticks = Math.ceil(EMAIL_BODY.length / 3);
        for (let k = 1; k <= ticks; k++) {
          const c = Math.min(k * 3, EMAIL_BODY.length);
          at(1500 + k * 30, () => patch({ typed: c }));
        }
        at(3800, () => patch((p) => ({ seq: { ...p.seq, email1: SEQ_VALUES.email1 } })));
        at(4500, () => patch((p) => ({
          followupsIn: true,
          seq: { ...p.seq, followups: SEQ_VALUES.followups },
          ringPct: 70, ringLabel: 'sequences drafted',
          toast: 'Rahul’s sequence drafted — one opener, five follow-ups, your voice', toastDone: true,
        })));
        at(7000, done);
      } else if (i === 4) {
        patch({
          view: 'queue', paneTitle: 'Waiting on Alex',
          toast: 'Nothing sends without a yes — Alex approves the batch', toastDone: false,
        });
        QUEUE_ROWS.forEach((_, k) => at(600 + k * 700, () => patch({ queueIn: k + 1 })));
        at(2700, () => patch({ approveIn: true }));
        at(3600, () => patch({ approveClicked: true, alexMeta: 'approved 38 in one click' }));
        at(4100, () => patch((p) => ({
          heldIn: { ...p.heldIn, held: true }, heldCount: '2 items',
          ringPct: 90, ringLabel: 'batch approved',
          toast: '38 approved in one click · 2 edited · 1 held back', toastDone: true,
        })));
        at(6200, done);
      } else if (i === 5) {
        patch({
          view: 'send', paneTitle: 'Sending on schedule',
          toast: 'Sending on schedule — replies come straight to you', toastDone: false,
        });
        at(400, () => patch((p) => ({ connected: { ...p.connected, in: true } })));
        SEND_ROWS.forEach((_, k) => at(900 + k * 700, () => patch({ sendIn: k + 1 })));
        at(3000, () => patch((p) => ({
          seq: { ...p.seq, status: SEQ_VALUES.status },
          seqStatus: 'sending ✓', seqGood: true,
          ringPct: 100, ringLabel: '41 sending',
          toast: '41 sequences live — first touch 09:00 local', toastDone: true,
        })));
        at(5200, done);
      } else {
        patch({ step: 6 });
        at(300, () => patch({ receipt: true, toast: '~4 minutes of rep time — the engine did the rest', toastDone: true }));
        at(7200, done);
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

  const typing = s.typed > 0 && s.typed < EMAIL_BODY.length;

  return (
    <div className={styles.scene} ref={shellRef}>
      <div className={styles.window} aria-label="Sales Engine — live demonstration">

        {/* ── Window chrome ── */}
        <div className={styles.chrome}>
          <div className={styles.dots} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.chromeTitle}>Chronexa · Sales Engine</span>
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
                <span className={`${styles.avatar} ${styles.avatarRun}`}>T</span>
                <div>
                  <div className={styles.clientName}>Tuesday&rsquo;s outbound run</div>
                  <div className={styles.clientMeta}>Your ICP · runs every morning</div>
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
                <span className={styles.ringLabel}><b>Today&rsquo;s batch</b><br />{s.ringLabel}</span>
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Connected</div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoAp}`}>AP</span>Apollo
                {s.connected.ap && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoLi}`}>in</span>LinkedIn
                {s.connected.li && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoHs}`}>HS</span>HubSpot
                {s.connected.hs && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoIn}`}>IN</span>Instantly
                {s.connected.in && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoCl}`}>CL</span>Claude
                {s.connected.cl && <span className={styles.appStatus}>Connected</span>}
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Your approver</div>
              <div className={styles.prepRow}>
                <span className={`${styles.avatar} ${styles.avatarAc}`}>AC</span>
                <div>
                  <div className={styles.prepName}>Alex Carter, Head of Sales</div>
                  <div className={styles.prepMeta}>{s.alexMeta}</div>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.main}>
            {/* ── Left: the work happening this beat ── */}
            <div className={styles.workL}>
              <span className={styles.paneTitle}>{s.paneTitle}</span>

              {s.view === 'leads' && (
                <div className={styles.leadList}>
                  {LEADS.map((l, i) => (
                    <div key={l.name} className={styles.leadCard} data-in={i < s.leadsIn ? 'true' : 'false'}>
                      <span className={`${styles.avatar} ${i === 0 ? styles.avatarRv : styles.avatarPn}`}>{l.ini}</span>
                      <div className={styles.leadText}>
                        <div className={styles.leadName}>{l.name}</div>
                        <div className={styles.leadMeta}>{l.meta}</div>
                      </div>
                      <span className={styles.leadBadge} data-in={i < s.leadsIn ? 'true' : 'false'}>Matched</span>
                    </div>
                  ))}
                  <div className={styles.leadMore} data-in={s.moreIn ? 'true' : 'false'}>+ 2,338 more matched to your ICP</div>
                </div>
              )}

              {s.view === 'profile' && (
                <div className={styles.profile}>
                  <div className={styles.profileHead}>
                    <span className={`${styles.avatar} ${styles.avatarRv}`}>RV</span>
                    <div>
                      <div className={styles.leadName}>Rahul Verma</div>
                      <div className={styles.leadMeta}>VP Sales · Acme Logistics</div>
                    </div>
                  </div>
                  {ENRICH.map((r, i) => (
                    <div key={r.id} className={styles.enrichRow} data-in={i < s.enrichIn ? 'true' : 'false'}>
                      <span className={styles.enrichLab}>{r.lab}</span>
                      <span className={styles.enrichVal}>{r.val}<span className={styles.enrichCheck}>{'✓'}</span></span>
                    </div>
                  ))}
                </div>
              )}

              {s.view === 'score' && (
                <div className={styles.scoreCard}>
                  <div className={styles.scoreHead}>Fit score — Rahul Verma, Acme Logistics</div>
                  <div className={styles.scoreReadout}>
                    <span className={styles.scoreNum}>{s.fitScore}</span>
                    <span className={styles.scoreDen}>/ 100</span>
                  </div>
                  <div className={styles.scoreChips}>
                    <span className={styles.scoreChip} data-in={s.chipsIn > 0 ? 'true' : 'false'}>ICP match</span>
                    <span className={styles.scoreChip} data-in={s.chipsIn > 1 ? 'true' : 'false'}>Active buying intent</span>
                  </div>
                  <div className={styles.droppedRow} data-in={s.droppedIn ? 'true' : 'false'}>
                    <span className={styles.heldMark}>!</span>
                    <span>19 low-fit accounts dropped — not contacted</span>
                  </div>
                </div>
              )}

              {s.view === 'compose' && (
                <div className={styles.email}>
                  <div className={styles.emailBar}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                    New message · written from the research
                  </div>
                  <div className={styles.emailBody}>
                    <div className={styles.emailRow}><span className={styles.emailK}>To</span><span className={styles.emailV}>Rahul Verma — Acme Logistics</span></div>
                    <div className={styles.emailRow} data-in={s.subjectIn ? 'true' : 'false'}>
                      <span className={styles.emailK}>Subject</span><span className={styles.emailV}>{EMAIL_SUBJECT}</span>
                    </div>
                    <div className={styles.emailLines}>
                      {EMAIL_BODY.slice(0, s.typed)}
                      <span className={styles.caret} data-on={typing ? 'true' : 'false'} aria-hidden="true" />
                    </div>
                  </div>
                  <div className={styles.emailFoot} data-in={s.followupsIn ? 'true' : 'false'}>
                    + 5 follow-ups drafted in your voice
                  </div>
                </div>
              )}

              {s.view === 'queue' && (
                <div className={styles.queue}>
                  <div className={styles.queueHead}>Approval queue · today&rsquo;s batch</div>
                  <div className={styles.queueBody}>
                    {QUEUE_ROWS.map((r, i) => (
                      <div key={r.id} className={styles.queueRow} data-in={i < s.queueIn ? 'true' : 'false'}>
                        <span className={`${styles.queueMark} ${r.kind === 'ok' ? styles.qOk : r.kind === 'edit' ? styles.qEdit : styles.qHold}`}>
                          {r.kind === 'ok' ? '✓' : r.kind === 'edit' ? '✎' : '!'}
                        </span>
                        <span className={styles.queueText}>{r.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.queueFoot}>
                    <button
                      type="button"
                      className={styles.approveBtn}
                      data-in={s.approveIn ? 'true' : 'false'}
                      data-clicked={s.approveClicked ? 'true' : 'false'}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      Approve batch
                    </button>
                    <span className={styles.approvedTag} data-in={s.approveClicked ? 'true' : 'false'}>Approved {'✓'} · nothing else sends</span>
                  </div>
                </div>
              )}

              {s.view === 'send' && (
                <div className={styles.sendCard}>
                  <div className={styles.sendHead}>
                    <span className={`${styles.logo} ${styles.logoIn} ${styles.sendLogo}`}>IN</span>
                    Instantly · sending on schedule
                  </div>
                  <div className={styles.sendBody}>
                    {SEND_ROWS.map((row, i) => (
                      <div key={row} className={styles.sendRow} data-in={i < s.sendIn ? 'true' : 'false'}>
                        <span className={styles.sendDot}>{'✓'}</span>
                        <span>{row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: the sequence being built ── */}
            <div className={styles.workR}>
              <span className={styles.paneTitle}>The sequence being built</span>
              <div className={styles.seqCard}>
                <div className={styles.seqHead}>
                  <span className={`${styles.avatar} ${styles.avatarRv} ${styles.seqAvatar}`}>RV</span>
                  <span className={styles.seqTitle}>Rahul Verma — Acme Logistics</span>
                  <span className={styles.seqSoft} data-good={s.seqGood ? 'true' : 'false'}>{s.seqStatus}</span>
                </div>
                <div className={styles.seqBody}>
                  {SEQ_LINES.map((l) => (
                    <div key={l.key} className={styles.seqLine} data-filled={s.seq[l.key] ? 'true' : 'false'}>
                      <span className={styles.seqCheck}>{'✓'}</span>
                      <span className={styles.seqLab}>{l.label}</span>
                      <span className={styles.seqVal}>{s.seq[l.key] ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.held}>
                <div className={styles.heldHead}>
                  <span className={styles.heldTitle}>Held for you</span>
                  <span className={styles.heldCount}>{s.heldCount}</span>
                </div>
                <div className={styles.heldBody}>
                  {HELD_ITEMS.map((it) => (
                    <div key={it.key} className={styles.heldItem} data-in={s.heldIn[it.key] ? 'true' : 'false'}>
                      <span className={styles.heldMark}>!</span>
                      <span className={styles.heldText}>{it.text}</span>
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
                <p className={styles.receiptTitle}>41 researched, personalised sequences went out this morning.</p>
                <p className={styles.receiptSub}>Your reps did none of the list-building, research, or drafting — and approved everything in one click.</p>
                <div className={styles.receiptRows}>
                  <div className={styles.receiptRow}><span>Accounts sourced</span><b>2,341</b></div>
                  <div className={styles.receiptRow}><span>Researched &amp; scored</span><b>2,341</b></div>
                  <div className={styles.receiptRow}><span>Best-fit sequenced</span><b>41</b></div>
                  <div className={styles.receiptRow}><span>Human-approved</span><b className={styles.receiptHl}>100%</b></div>
                  <div className={styles.receiptRow}><span>Rep time spent</span><b className={styles.receiptHl}>~4 minutes</b></div>
                </div>
                <BookButton className={styles.receiptCta} location="sales-engine-scene-receipt">
                  See it run on your ICP →
                </BookButton>
                <span className={styles.receiptFine}>
                  30 minutes, no slides — your pipeline.<br />
                  Works with <b>Apollo · Clay · ZoomInfo · HubSpot · Instantly · Smartlead</b>
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
