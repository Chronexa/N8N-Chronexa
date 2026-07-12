'use client';

/**
 * LegalScene — the Legal & Regulatory Engine hero demo.
 *
 * One regulatory event (SEC Release No. 33-11138, Rule 10b5-1 amendments)
 * handled end-to-end inside a bright, familiar app window: the release is
 * caught the moment it publishes, matched against live matters, backed by the
 * firm's own precedents, drafted into a partner memo, billed, and indexed.
 * The device is THE CLOCK — a scripted timestamp that jumps 09:02 → 09:07
 * while the caption reminds you the old way is "day 3". Loops while in view;
 * the stepper scrubs to any beat.
 *
 * Design rule (2026-07-11): client-facing surfaces are friendly software —
 * tool logos, named humans, plain English. No terminal chrome.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './LegalScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

const STEPS = ['Watch', 'Impact', 'Precedent', 'Draft', 'Log', 'Learn'] as const;

/** Scripted timestamp per beat — this is state, not real time. */
const CLOCKS = ['09:02', '09:02', '09:03', '09:06', '09:07', '09:07'] as const;

const FEEDS = [
  { name: 'SEC EDGAR', mark: 'SEC', cls: styles.logoSec },
  { name: 'SEBI', mark: 'SB', cls: styles.logoSebi },
  { name: 'RBI', mark: 'RB', cls: styles.logoRbi },
  { name: 'FINRA', mark: 'FN', cls: styles.logoFinra },
  { name: 'Federal Register', mark: 'FR', cls: styles.logoFr },
];

const APPS = [
  { name: 'iManage', mark: 'iM', cls: styles.logoIm },
  { name: 'Elite 3E', mark: '3E', cls: styles.logo3e },
];

/** The quiet feed — most of regulatory monitoring is uneventful. */
const QUIET = [
  { mark: 'FR', cls: styles.logoFr, text: 'Federal Register — routine notice' },
  { mark: 'SB', cls: styles.logoSebi, text: 'SEBI — circular update, out of scope' },
  { mark: 'FN', cls: styles.logoFinra, text: 'FINRA — no change to watched rules' },
];

const IMPACT = [
  { text: 'Matter #4472 — exec trading plan · Partner Shah', amber: false },
  { text: 'Matter #4509 — 10b5-1 setup · Partner Lee', amber: false },
  { text: '+5 more matters', amber: false },
  { text: '2 pending filings — put on hold automatically', amber: true },
];

const PRECEDENTS = [
  { title: 'SEC v. Salman (2016)', sub: 'tipper-tippee liability', own: false },
  { title: 'Your own 2022 guidance memo', sub: 'surfaced from the archive', own: true },
  { title: 'Prior matter #3841', sub: 'same client, same issue (2023)', own: false },
];

const DRAFT_SRC = [
  'The release, parsed in plain English',
  '7 affected matters, ranked by partner',
  '12 precedents, cited inline',
];

const LOG_ROWS = [
  'Matter #4472 updated',
  '1.2 hrs research time logged — automatically',
  'Client dockets updated',
  'Compliance calendar updated',
];

const MEMO_ROWS = [
  'The change, in plain English',
  '7 affected matters, by partner',
  'Relevant precedents (12)',
  '3 numbered action items',
];

type LeftView = 'feed' | 'precedent' | 'drafting' | 'log' | 'learn';

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  clock: string;
  feedsLive: number;
  pmConnected: boolean;
  quietIn: number;
  releaseIn: boolean;
  view: LeftView;
  impactIn: number;
  precIn: number;
  precFootIn: boolean;
  draftSrcIn: number;
  logIn: number;
  learnIn: boolean;
  memoStub: boolean;
  memoDone: number;
  stampIn: boolean;
  trayIn: boolean;
  approved: boolean;
  ringPct: number;
  ringLabel: string;
  partnerMeta: string;
  toast: string;
  toastDone: boolean;
  receipt: boolean;
  paneTitle: string;
}

const INITIAL: SceneState = {
  step: 0,
  clock: '09:02',
  feedsLive: 0,
  pmConnected: false,
  quietIn: 0,
  releaseIn: false,
  view: 'feed',
  impactIn: 0,
  precIn: 0,
  precFootIn: false,
  draftSrcIn: 0,
  logIn: 0,
  learnIn: false,
  memoStub: false,
  memoDone: 0,
  stampIn: false,
  trayIn: false,
  approved: false,
  ringPct: 0,
  ringLabel: 'waking the feeds',
  partnerMeta: 'reviews every client alert',
  toast: 'Starting the engine…',
  toastDone: false,
  receipt: false,
  paneTitle: 'Regulatory feed',
};

/** Cumulative end-state per beat — lets the stepper scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  (s) => ({
    ...s,
    clock: CLOCKS[0],
    feedsLive: FEEDS.length, quietIn: QUIET.length, releaseIn: true,
    ringPct: 12, ringLabel: 'watching 14 feeds',
  }),
  (s) => ({
    ...s,
    clock: CLOCKS[1],
    impactIn: IMPACT.length, memoStub: true,
    ringPct: 30, ringLabel: '7 matters affected',
  }),
  (s) => ({
    ...s,
    clock: CLOCKS[2],
    view: 'precedent', paneTitle: 'The firm’s own precedents',
    precIn: PRECEDENTS.length, precFootIn: true,
    ringPct: 50, ringLabel: '12 precedents',
  }),
  (s) => ({
    ...s,
    clock: CLOCKS[3],
    view: 'drafting', paneTitle: 'Composing the memo',
    draftSrcIn: DRAFT_SRC.length,
    memoDone: MEMO_ROWS.length, stampIn: true, trayIn: true,
    ringPct: 75, ringLabel: 'memo drafted',
  }),
  (s) => ({
    ...s,
    clock: CLOCKS[4],
    view: 'log', paneTitle: 'Practice management',
    logIn: LOG_ROWS.length, pmConnected: true, approved: true,
    partnerMeta: '3 matters, briefed by 09:06',
    ringPct: 92, ringLabel: 'time logged',
  }),
  (s) => ({
    ...s,
    clock: CLOCKS[5],
    view: 'learn', paneTitle: 'Knowledge base',
    learnIn: true,
    ringPct: 100, ringLabel: 'indexed',
  }),
];

const FINAL_TOAST = 'Published 09:02 — partner-ready memo by 09:06';

// ─── Component ────────────────────────────────────────────────────────────────

export default function LegalScene() {
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
      setS({ ...fin, step: 6, receipt: true, toastDone: true, toast: FINAL_TOAST });
      return;
    }

    const playBeat = (i: number, done: () => void) => {
      if (i <= 5) patch({ step: i, clock: CLOCKS[i] });
      if (i === 0) {
        patch({ paneTitle: 'Regulatory feed', toast: 'Watching 14 regulatory feeds — a paralegal doesn’t have to…', toastDone: false });
        FEEDS.forEach((_, k) => at(200 + k * 250, () => patch({ feedsLive: k + 1 })));
        QUIET.forEach((_, k) => at(600 + k * 500, () => patch({ quietIn: k + 1 })));
        at(1500, () => patch({ ringPct: 12, ringLabel: 'watching 14 feeds' }));
        at(2600, () => patch({
          releaseIn: true,
          toast: 'SEC Release No. 33-11138 detected — Rule 10b5-1 amendments', toastDone: true,
        }));
        at(5200, done);
      } else if (i === 1) {
        patch({ toast: 'New SEC release — matching it against 500+ active matters…', toastDone: false });
        at(700, () => patch({ impactIn: 1 }));
        at(1400, () => patch({ impactIn: 2 }));
        at(2100, () => patch({ impactIn: 3, memoStub: true, ringPct: 30, ringLabel: '7 matters affected' }));
        at(2900, () => patch({
          impactIn: 4,
          toast: '7 matters affected — 2 pending filings put on hold', toastDone: true,
        }));
        at(5600, done);
      } else if (i === 2) {
        patch({
          view: 'precedent', paneTitle: 'The firm’s own precedents',
          toast: 'Searching the firm’s own precedents — memory that never leaves…', toastDone: false,
        });
        at(600, () => patch({ precIn: 1 }));
        at(1500, () => patch({ precIn: 2 }));
        at(2400, () => patch({ precIn: 3 }));
        at(3200, () => patch({
          precFootIn: true, ringPct: 50, ringLabel: '12 precedents',
          toast: '12 precedents matched — including your own 2022 memo', toastDone: true,
        }));
        at(6000, done);
      } else if (i === 3) {
        patch({
          view: 'drafting', paneTitle: 'Composing the memo',
          toast: 'Drafting the partner memo in your house style…', toastDone: false,
        });
        at(500, () => patch({ draftSrcIn: 1 }));
        at(1000, () => patch({ draftSrcIn: 2 }));
        at(1500, () => patch({ draftSrcIn: 3 }));
        at(900, () => patch({ memoDone: 1 }));
        at(1700, () => patch({ memoDone: 2 }));
        at(2500, () => patch({ memoDone: 3 }));
        at(3300, () => patch({ memoDone: 4 }));
        at(4000, () => patch({ stampIn: true, ringPct: 75, ringLabel: 'memo drafted' }));
        at(4600, () => patch({
          trayIn: true,
          toast: 'Memo drafted in 4 min 12 sec — 2 client alerts wait for approval', toastDone: true,
        }));
        at(7200, done);
      } else if (i === 4) {
        patch({
          view: 'log', paneTitle: 'Practice management',
          toast: 'Logging 1.2 hrs of research time — billing leakage closed…', toastDone: false,
        });
        at(400, () => patch({ pmConnected: true }));
        at(800, () => patch({ logIn: 1 }));
        at(1500, () => patch({ logIn: 2, ringPct: 92, ringLabel: 'time logged' }));
        at(2200, () => patch({ logIn: 3 }));
        at(2900, () => patch({ logIn: 4 }));
        at(3700, () => patch({
          approved: true, partnerMeta: '3 matters, briefed by 09:06',
          toast: 'Approved by Partner Shah — alerts sent, billing captured', toastDone: true,
        }));
        at(6200, done);
      } else if (i === 5) {
        patch({
          view: 'learn', paneTitle: 'Knowledge base',
          toast: 'Indexing the release — the firm just got smarter', toastDone: false,
        });
        at(800, () => patch({ learnIn: true, ringPct: 100, ringLabel: 'indexed' }));
        at(1800, () => patch({
          toast: 'Knowledge base: 4,218 documents — the next search already knows', toastDone: true,
        }));
        at(4400, done);
      } else {
        patch({ step: 6 });
        at(300, () => patch({ receipt: true, toast: FINAL_TOAST, toastDone: true }));
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

  return (
    <div className={styles.scene} ref={shellRef}>
      <div className={styles.window} aria-label="Legal & Regulatory Engine — live demonstration">

        {/* ── Window chrome ── */}
        <div className={styles.chrome}>
          <div className={styles.dots} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.chromeTitle}>Chronexa · Legal &amp; Regulatory Engine</span>
          <span className={styles.livePill}><i aria-hidden="true" />Live run</span>
          <span className={styles.clockChip}>
            <span className={styles.clockTime}>{s.clock}</span>
            <span className={styles.clockCaption}>the old way: day 3</span>
          </span>
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
                <span className={`${styles.avatar} ${styles.avatarMs}`}>MS</span>
                <div>
                  <div className={styles.clientName}>Meridian Shah LLP</div>
                  <div className={styles.clientMeta}>Securities &amp; corporate · 500+ active matters</div>
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
                <span className={styles.ringLabel}><b>Response progress</b><br />{s.ringLabel}</span>
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Watching</div>
              {FEEDS.map((f, i) => (
                <div key={f.name} className={styles.appRow}>
                  <span className={`${styles.logo} ${f.cls}`}>{f.mark}</span>{f.name}
                  {i < s.feedsLive && <span className={styles.appStatus}>Live</span>}
                </div>
              ))}
              <div className={`${styles.sideTitle} ${styles.sideTitleSecond}`}>Connected</div>
              {APPS.map((a) => (
                <div key={a.name} className={styles.appRow}>
                  <span className={`${styles.logo} ${a.cls}`}>{a.mark}</span>{a.name}
                  {s.pmConnected && <span className={styles.appStatus}>Connected</span>}
                </div>
              ))}
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>The partner</div>
              <div className={styles.prepRow}>
                <span className={`${styles.avatar} ${styles.avatarAs}`}>AS</span>
                <div>
                  <div className={styles.prepName}>Partner A. Shah</div>
                  <div className={styles.prepMeta}>{s.partnerMeta}</div>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.main}>
            {/* ── Left: feed / precedents / drafting / log / learn ── */}
            <div className={styles.workL}>
              <span className={styles.paneTitle}>{s.paneTitle}</span>

              {s.view === 'feed' && (
                <div className={styles.feedList}>
                  {QUIET.map((q, i) => (
                    <div key={q.text} className={styles.quietRow} data-in={i < s.quietIn ? 'true' : 'false'}>
                      <span className={`${styles.logo} ${styles.quietLogo} ${q.cls}`}>{q.mark}</span>
                      <span className={styles.quietText}>{q.text}</span>
                      <span className={styles.quietTag}>no action</span>
                    </div>
                  ))}
                  <div className={styles.releaseCard} data-in={s.releaseIn ? 'true' : 'false'}>
                    <div className={styles.relHead}>
                      <span className={`${styles.logo} ${styles.logoSec}`}>SEC</span>
                      <span className={styles.relSrc}>SEC EDGAR · just published</span>
                    </div>
                    <div className={styles.relTitle}>SEC Release No. 33-11138 — Rule 10b5-1 trading plan amendments</div>
                    <div className={styles.relMeta}>Effective Feb 27, 2026</div>
                    <div className={styles.chips}>
                      <span className={styles.chip}>Securities law</span>
                      <span className={styles.chip}>Insider trading</span>
                    </div>
                  </div>
                  <div className={styles.impactList}>
                    {IMPACT.map((m, i) => (
                      <div
                        key={m.text}
                        className={styles.impactRow}
                        data-in={i < s.impactIn ? 'true' : 'false'}
                        data-amber={m.amber ? 'true' : 'false'}
                      >
                        <span className={styles.impactMark}>{m.amber ? '!' : '→'}</span>
                        <span className={styles.impactText}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {s.view === 'precedent' && (
                <div className={styles.precList}>
                  {PRECEDENTS.map((p, i) => (
                    <div
                      key={p.title}
                      className={styles.precCard}
                      data-in={i < s.precIn ? 'true' : 'false'}
                      data-own={p.own ? 'true' : 'false'}
                    >
                      <span className={styles.precIco} aria-hidden="true">§</span>
                      <div>
                        <div className={styles.precTitle}>{p.title}</div>
                        <div className={styles.precSub}>{p.sub}</div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.precFoot} data-in={s.precFootIn ? 'true' : 'false'}>
                    12 matched · relevance 0.87+
                  </div>
                </div>
              )}

              {s.view === 'drafting' && (
                <div className={styles.draftCard}>
                  <div className={styles.draftHead}>Composing from</div>
                  {DRAFT_SRC.map((d, i) => (
                    <div key={d} className={styles.draftRow} data-done={i < s.draftSrcIn ? 'true' : 'false'}>
                      <span className={styles.draftCheck}>{'✓'}</span>{d}
                    </div>
                  ))}
                  <div className={styles.draftHint}>The memo builds on the right →</div>
                </div>
              )}

              {s.view === 'log' && (
                <div className={styles.logCard}>
                  <div className={styles.logHead}>
                    <span className={`${styles.logo} ${styles.logoIm}`}>iM</span>
                    <span className={`${styles.logo} ${styles.logo3e}`}>3E</span>
                    <span className={styles.logTitle}>iManage · Elite 3E</span>
                  </div>
                  {LOG_ROWS.map((l, i) => (
                    <div key={l} className={styles.logRow} data-in={i < s.logIn ? 'true' : 'false'}>
                      <span className={styles.logCheck}>{'✓'}</span>{l}
                    </div>
                  ))}
                </div>
              )}

              {s.view === 'learn' && (
                <div className={styles.learnCard} data-in={s.learnIn ? 'true' : 'false'}>
                  <div className={styles.learnTitle}>Release embedded into the firm&rsquo;s knowledge base</div>
                  <div className={styles.learnBig}>4,218</div>
                  <div className={styles.learnSub}>documents the next search can draw on</div>
                  <div className={styles.learnLine}>The next search already knows about it.</div>
                </div>
              )}
            </div>

            {/* ── Right: the partner memo being composed ── */}
            <div className={styles.workR}>
              <span className={styles.paneTitle}>The partner memo</span>
              <div className={styles.memoCard}>
                <div className={styles.memoKicker}>Guidance memo · house style</div>
                <div className={styles.memoTitleWrap}>
                  {s.memoStub
                    ? <span className={styles.memoTitle}>Rule 10b5-1 amendments — client impact</span>
                    : <span className={styles.memoSkelLine} aria-hidden="true" />}
                </div>
                <div className={styles.memoBody}>
                  {MEMO_ROWS.map((m, i) => (
                    <div key={m} className={styles.memoRow} data-done={i < s.memoDone ? 'true' : 'false'}>
                      <span className={styles.memoCheck}>{'✓'}</span>
                      <span className={styles.memoLab}>{m}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.stampRow}>
                  <span className={styles.stamp} data-in={s.stampIn ? 'true' : 'false'}>Drafted in 4 min 12 sec</span>
                </div>
              </div>

              <div className={styles.tray}>
                <div className={styles.trayHead}>
                  <span className={styles.trayTitle}>For partner approval</span>
                </div>
                <div className={styles.trayBody}>
                  <div
                    className={styles.trayItem}
                    data-in={s.trayIn ? 'true' : 'false'}
                    data-resolved={s.approved ? 'true' : 'false'}
                  >
                    <span className={styles.trayMark}>!</span>
                    <span className={styles.trayText}>
                      2 client alert emails — drafted, not sent&nbsp;
                      <span className={styles.trayFix}>Approved by Partner Shah {'✓'} · sent</span>
                    </span>
                  </div>
                </div>
              </div>
              <p className={styles.trustLine}>Nothing reaches a client without a partner&rsquo;s yes.</p>
            </div>

            {/* ── Receipt overlay ── */}
            <div className={styles.receipt} data-show={s.receipt ? 'true' : 'false'}>
              <div className={styles.receiptCard}>
                <svg className={styles.bigCheck} viewBox="0 0 54 54" aria-hidden="true">
                  <circle cx="27" cy="27" r="24" />
                  <path d="M17 28l7 7 14-15" />
                </svg>
                <p className={styles.receiptTitle}>Published 09:02. Partner-ready memo by 09:06.</p>
                <p className={styles.receiptSub}>The old way, this is day 3 — and the client heard it from the news first.</p>
                <div className={styles.receiptRows}>
                  <div className={styles.receiptRow}><span>Feeds watched</span><b>14</b></div>
                  <div className={styles.receiptRow}><span>Matters matched</span><b>7</b></div>
                  <div className={styles.receiptRow}>
                    <span>Precedents surfaced</span>
                    <b>12 <span className={styles.receiptNote}>incl. your own 2022 memo</span></b>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Billable time captured</span>
                    <b className={styles.receiptHl}>1.2 hrs <span className={styles.receiptNote}>automatically</span></b>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Time to draft alert</span>
                    <b><s className={styles.receiptOld}>3–4 days</s> <span className={styles.receiptHl}>4 min</span></b>
                  </div>
                </div>
                <BookButton className={styles.receiptCta} location="legal-regulatory-engine-scene-receipt">
                  Pick the gap that hurts most →
                </BookButton>
                <span className={styles.receiptFine}>
                  Regulatory alerts, billing capture, knowledge loop, or diligence reports — see one run end-to-end in 30 minutes.<br />
                  <b>iManage · NetDocuments · Elite 3E · Clio</b>
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
