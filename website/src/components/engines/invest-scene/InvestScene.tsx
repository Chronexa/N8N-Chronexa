'use client';

/**
 * InvestScene — the Investment Research Engine hero demo.
 *
 * One portfolio's daily cycle built on screen inside a bright, familiar app
 * window: accounts sync through Plaid, research is read across every holding,
 * models score a signal, a draft order waits — deliberately — for Priya the
 * portfolio manager, risk is watched, and a tax-aware rebalance is drafted.
 * Loops while in view; the stepper scrubs to any beat.
 *
 * Design rule (2026-07-11): client-facing surfaces are friendly software —
 * tool logos, named humans, plain English. No terminal chrome.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import BookButton from '../../BookButton';
import styles from './InvestScene.module.css';

// ─── Scene data ───────────────────────────────────────────────────────────────

type ViewKey = 'holdings' | 'research' | 'signal' | 'monitor' | 'rebalance';
type TicketPhase = 'draft' | 'waiting' | 'filled';

const STEPS = ['Sync', 'Research', 'Signal', 'Approve', 'Monitor', 'Rebalance'] as const;

const HOLDINGS = [
  { tick: 'NV', name: 'NVDA · 340 shares', meta: 'avg cost $148.20', ico: 1 },
  { tick: 'AA', name: 'AAPL · 120 shares', meta: 'avg cost $167.50', ico: 2 },
  { tick: '$', name: 'Cash · $84,300', meta: '3.5% of portfolio', ico: 3 },
];
const HOLD_ICO_CLASS = [styles.holdC1, styles.holdC2, styles.holdC3];
const NEWS_ICO_CLASS = [styles.holdC1, styles.holdC4, styles.holdC5];

const NEWS: { tick: string; ico: number; title: string; meta: string; chip: string; tone: 'green' | 'neutral' | 'amber' }[] = [
  { tick: 'NV', ico: 1, title: 'NVDA — Q2 earnings beat', meta: 'data centre revenue +42%', chip: '0.82 Bull', tone: 'green' },
  { tick: 'MS', ico: 2, title: 'MSFT — 10-Q filed', meta: 'cloud segment +18%', chip: '10-Q', tone: 'neutral' },
  { tick: 'ME', ico: 3, title: 'Meta — insider selling', meta: '2 exec transactions flagged', chip: 'Watch', tone: 'amber' },
];

const SIG_ROWS = [
  { lab: 'Position size', val: '$100,800 · Kelly 4.2%' },
  { lab: 'Entry zone', val: '$182.40–187.20 · stop $174.00' },
];

const MON_ROWS = [
  { lab: 'Beta', val: '1.12', note: 'target 1.0–1.15' },
  { lab: 'Sharpe (30d)', val: '1.84', note: 'no alerts' },
  { lab: 'Max drawdown', val: '−3.2%', note: 'limit −8%' },
];

const REB_ROWS = [
  { lab: 'Tech exposure', val: '34% → 28%' },
  { lab: 'Orders', val: '3 sells · minimum turnover' },
  { lab: 'Tax-loss captured', val: '$4,200 (META)' },
];

// ─── Scene state ──────────────────────────────────────────────────────────────

interface SceneState {
  step: number; // 0–5 = beats, 6 = receipt
  connected: { plaid: boolean; ibkr: boolean; schwab: boolean; fidelity: boolean; risk: boolean };
  view: ViewKey;
  holdingsIn: number;
  holdingsMoreIn: boolean;
  newsIn: number;
  newsFootIn: boolean;
  sigIn: boolean;
  sigConf: number;
  sigRowsIn: number;
  sigMetaIn: boolean;
  monIn: number;
  rebIn: number;
  ticketIn: boolean;
  ticketAmt: boolean;
  ticketPhase: TicketPhase;
  approveIn: boolean;
  approveClicked: boolean;
  auditIn: boolean;
  queueIn: boolean;
  ringPct: number;
  ringLabel: string;
  pmMeta: string;
  toast: string;
  toastDone: boolean;
  receipt: boolean;
  paneTitle: string;
}

const INITIAL: SceneState = {
  step: 0,
  connected: { plaid: false, ibkr: false, schwab: false, fidelity: false, risk: false },
  view: 'holdings',
  holdingsIn: 0,
  holdingsMoreIn: false,
  newsIn: 0,
  newsFootIn: false,
  sigIn: false,
  sigConf: 0,
  sigRowsIn: 0,
  sigMetaIn: false,
  monIn: 0,
  rebIn: 0,
  ticketIn: false,
  ticketAmt: false,
  ticketPhase: 'draft',
  approveIn: false,
  approveClicked: false,
  auditIn: false,
  queueIn: false,
  ringPct: 0,
  ringLabel: 'syncing…',
  pmMeta: 'approves every order',
  toast: 'Starting the daily cycle…',
  toastDone: false,
  receipt: false,
  paneTitle: 'Portfolio',
};

/** Cumulative end-state per beat — lets the stepper scrub to any point. */
const APPLY: ((s: SceneState) => SceneState)[] = [
  (s) => ({
    ...s,
    connected: { ...s.connected, plaid: true, ibkr: true, schwab: true, fidelity: true },
    holdingsIn: HOLDINGS.length, holdingsMoreIn: true,
    ringPct: 16, ringLabel: '47 holdings live',
  }),
  (s) => ({
    ...s,
    view: 'research', paneTitle: 'Research feed',
    newsIn: NEWS.length, newsFootIn: true,
    ringPct: 33, ringLabel: '14 signals',
  }),
  (s) => ({
    ...s,
    view: 'signal', paneTitle: 'Signal detail',
    sigIn: true, sigConf: 89, sigRowsIn: SIG_ROWS.length, sigMetaIn: true,
    ticketIn: true, ticketAmt: true, ticketPhase: 'draft',
    ringPct: 50,
  }),
  (s) => ({
    ...s,
    ticketPhase: 'filled', approveIn: true, approveClicked: true, auditIn: true, queueIn: true,
    ringPct: 67, ringLabel: 'order filled',
    pmMeta: 'approved at 09:14 — 90 seconds after the signal',
  }),
  (s) => ({
    ...s,
    view: 'monitor', paneTitle: 'Risk monitor', monIn: MON_ROWS.length,
    connected: { ...s.connected, risk: true },
    ringPct: 84, ringLabel: 'risk green',
  }),
  (s) => ({
    ...s,
    view: 'rebalance', paneTitle: 'Rebalance plan', rebIn: REB_ROWS.length,
    ringPct: 100, ringLabel: 'rebalanced',
  }),
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function InvestScene() {
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

  /** Flying chip from a signal element to the order ticket (or queue tray). */
  const ghost = useCallback((fromId: string, toId: string, text: string, amber?: boolean) => {
    const win = windowRef.current;
    if (!win) return;
    const from = win.querySelector<HTMLElement>(`[data-fid="${fromId}"]`);
    const to = win.querySelector<HTMLElement>(`[data-gto="${toId}"]`);
    if (!from || !to) return;
    const wr = win.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const g = document.createElement('span');
    g.className = styles.ghost;
    if (amber) g.dataset.amber = 'true';
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
      setS({ ...fin, step: 6, receipt: true, toastDone: true, toast: 'Signal to human-approved order in 90 seconds' });
      return;
    }

    const playBeat = (i: number, done: () => void) => {
      patch({ step: i });
      if (i === 0) {
        patch({ toast: 'Syncing your accounts through Plaid — live positions, not a stale export…', toastDone: false });
        at(200, () => patch((p) => ({ connected: { ...p.connected, plaid: true } })));
        at(650, () => patch((p) => ({ connected: { ...p.connected, ibkr: true } })));
        at(1000, () => patch((p) => ({ connected: { ...p.connected, schwab: true } })));
        at(1350, () => patch((p) => ({ connected: { ...p.connected, fidelity: true } })));
        at(900, () => patch({ holdingsIn: 1 }));
        at(1500, () => patch({ holdingsIn: 2 }));
        at(2100, () => patch({ holdingsIn: 3 }));
        at(2700, () => patch({
          holdingsMoreIn: true, ringPct: 16, ringLabel: '47 holdings live',
          toast: '3 accounts synced — 47 holdings at live prices, as of 09:01 EST', toastDone: true,
        }));
        at(5200, done);
      } else if (i === 1) {
        patch({ toast: 'Reading news, filings and earnings across everything you hold…', toastDone: false });
        at(200, () => patch({ view: 'research', paneTitle: 'Research feed' }));
        at(700, () => patch({ newsIn: 1 }));
        at(1600, () => patch({ newsIn: 2 }));
        at(2500, () => patch({ newsIn: 3 }));
        at(3400, () => patch({
          newsFootIn: true, ringPct: 33, ringLabel: '14 signals',
          toast: '247 signals scanned — 14 worth a closer look', toastDone: true,
        }));
        at(5900, done);
      } else if (i === 2) {
        patch({ toast: 'XGBoost and LSTM models scoring entry and exit points…', toastDone: false });
        at(200, () => patch({ view: 'signal', paneTitle: 'Signal detail', sigIn: true }));
        at(800, () => patch({ sigConf: 89 }));
        at(1600, () => patch({ sigRowsIn: 1 }));
        at(2400, () => patch({ sigRowsIn: 2 }));
        at(3200, () => patch({ sigMetaIn: true }));
        at(4000, () => { ghost('sig-main', 'ticket', 'BUY 40 NVDA'); patch({ ringPct: 50 }); });
        at(4600, () => patch({ ticketIn: true }));
        at(5200, () => patch({
          ticketAmt: true,
          toast: 'Draft ticket ready — BUY 40 NVDA, $14,800 at market', toastDone: true,
        }));
        at(7400, done);
      } else if (i === 3) {
        patch({ toast: 'Order drafted — waiting for Priya. It will wait as long as it takes.', toastDone: false });
        at(300, () => patch({ ticketPhase: 'waiting' }));
        at(1100, () => ghost('sig-meta', 'queue', 'SELL 80 META', true));
        at(1500, () => patch({ queueIn: true }));
        // The amber banner holds — that pause is the message.
        at(2900, () => patch({ approveIn: true, pmMeta: 'reviewing the draft order…' }));
        at(3800, () => patch({ approveClicked: true }));
        at(4300, () => patch({
          ticketPhase: 'filled', auditIn: true,
          ringPct: 67, ringLabel: 'order filled',
          pmMeta: 'approved at 09:14 — 90 seconds after the signal',
          toast: 'Filled at $183.60 — approved by Priya, logged with who, when and why', toastDone: true,
        }));
        at(6600, done);
      } else if (i === 4) {
        patch({ toast: 'Watching beta, Sharpe and drawdown continuously…', toastDone: false });
        at(250, () => patch({ view: 'monitor', paneTitle: 'Risk monitor' }));
        at(550, () => patch((p) => ({ connected: { ...p.connected, risk: true } })));
        at(1000, () => patch({ monIn: 1 }));
        at(1700, () => patch({ monIn: 2 }));
        at(2400, () => patch({ monIn: 3 }));
        at(3200, () => patch({
          ringPct: 84, ringLabel: 'risk green',
          toast: 'Every check green — beta, Sharpe and drawdown all inside limits', toastDone: true,
        }));
        at(5400, done);
      } else if (i === 5) {
        patch({ toast: 'Drift detected — tax-aware rebalance plan drafted for approval', toastDone: false });
        at(250, () => patch({ view: 'rebalance', paneTitle: 'Rebalance plan' }));
        at(900, () => patch({ rebIn: 1 }));
        at(1700, () => patch({ rebIn: 2 }));
        at(2500, () => patch({ rebIn: 3 }));
        at(3300, () => patch({
          ringPct: 100, ringLabel: 'rebalanced',
          toast: 'Rebalance drafted — $4,200 tax loss captured on META', toastDone: true,
        }));
        at(5500, done);
      } else {
        patch({ step: 6 });
        at(300, () => patch({ receipt: true, toast: 'Signal to human-approved order in 90 seconds', toastDone: true }));
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
      <div className={styles.window} ref={windowRef} aria-label="Investment Research Engine — live demonstration">

        {/* ── Window chrome ── */}
        <div className={styles.chrome}>
          <div className={styles.dots} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.chromeTitle}>Chronexa · Investment Research Engine</span>
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
                <span className={`${styles.avatar} ${styles.avatarP}`}>P</span>
                <div>
                  <div className={styles.clientName}>Growth portfolio</div>
                  <div className={styles.clientMeta}>$2.4M AUM · 3 accounts via Plaid</div>
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
                <span className={styles.ringLabel}><b>Daily cycle</b><br />{s.ringLabel}</span>
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Connected</div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoPl}`}>PL</span>Plaid
                {s.connected.plaid && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoIb}`}>IB</span>IBKR
                {s.connected.ibkr && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoCs}`}>CS</span>Schwab
                {s.connected.schwab && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoF}`}>F</span>Fidelity
                {s.connected.fidelity && <span className={styles.appStatus}>Connected</span>}
              </div>
              <div className={styles.appRow}>
                <span className={`${styles.logo} ${styles.logoRm}`}>RM</span>Risk monitor
                {s.connected.risk && <span className={styles.appStatus}>Connected</span>}
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Your portfolio manager</div>
              <div className={styles.prepRow}>
                <span className={`${styles.avatar} ${styles.avatarPm}`}>PM</span>
                <div>
                  <div className={styles.prepName}>Priya M., Portfolio Manager</div>
                  <div className={styles.prepMeta}>{s.pmMeta}</div>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.main}>
            {/* ── Left: holdings / research / signal / monitor / rebalance ── */}
            <div className={styles.workL}>
              <span className={styles.paneTitle}>{s.paneTitle}</span>

              {s.view === 'holdings' && (
                <div className={styles.holdList}>
                  {HOLDINGS.map((h, i) => (
                    <div key={h.name} className={styles.holdCard} data-in={i < s.holdingsIn ? 'true' : 'false'}>
                      <span className={`${styles.holdIco} ${HOLD_ICO_CLASS[h.ico - 1]}`}>{h.tick}</span>
                      <div className={styles.holdText}>
                        <div className={styles.holdName}>{h.name}</div>
                        <div className={styles.holdMeta}>{h.meta}</div>
                      </div>
                      <span className={styles.holdBadge} data-in={i < s.holdingsIn ? 'true' : 'false'}>Live</span>
                    </div>
                  ))}
                  <div className={styles.holdMore} data-in={s.holdingsMoreIn ? 'true' : 'false'}>+44 more holdings · live prices</div>
                </div>
              )}

              {s.view === 'research' && (
                <div className={styles.holdList}>
                  {NEWS.map((n, i) => (
                    <div key={n.title} className={styles.newsCard} data-in={i < s.newsIn ? 'true' : 'false'} data-tone={n.tone}>
                      <span className={`${styles.holdIco} ${NEWS_ICO_CLASS[n.ico - 1]}`}>{n.tick}</span>
                      <div className={styles.holdText}>
                        <div className={styles.holdName}>{n.title}</div>
                        <div className={styles.holdMeta}>{n.meta}</div>
                      </div>
                      <span className={styles.newsChip} data-tone={n.tone}>{n.chip}</span>
                    </div>
                  ))}
                  <div className={styles.holdMore} data-in={s.newsFootIn ? 'true' : 'false'}>247 signals scanned · 14 high-conviction</div>
                </div>
              )}

              {s.view === 'signal' && (
                <div className={styles.sigCard} data-in={s.sigIn ? 'true' : 'false'} data-fid="sig-main">
                  <div className={styles.sigHead}>
                    <span className={`${styles.holdIco} ${styles.holdC1} ${styles.sigIco}`}>NV</span>
                    <span className={styles.sigTitle}>NVDA · Entry signal</span>
                    <span className={styles.sigChip}>XGBoost</span>
                  </div>
                  <div className={styles.confRow}>
                    <span className={styles.confLab}>Model confidence</span>
                    <span className={styles.confBar}><span className={styles.confFill} style={{ width: `${s.sigConf}%` }} /></span>
                    <span className={styles.confVal}>0.89</span>
                  </div>
                  {SIG_ROWS.map((r, i) => (
                    <div key={r.lab} className={styles.sigRow} data-in={i < s.sigRowsIn ? 'true' : 'false'}>
                      <span className={styles.sigLab}>{r.lab}</span>
                      <span className={styles.sigVal}>{r.val}</span>
                    </div>
                  ))}
                  <div className={styles.sigMeta} data-in={s.sigMetaIn ? 'true' : 'false'} data-fid="sig-meta">
                    <span className={styles.qMark}>!</span>
                    Meta · Exit signal · confidence 0.77
                  </div>
                </div>
              )}

              {s.view === 'monitor' && (
                <div className={styles.monCard}>
                  {MON_ROWS.map((r, i) => (
                    <div key={r.lab} className={styles.monRow} data-in={i < s.monIn ? 'true' : 'false'}>
                      <span className={styles.monCheck} aria-hidden="true">{'✓'}</span>
                      <span className={styles.monLab}>{r.lab}</span>
                      <span className={styles.monNote}>{r.note}</span>
                      <span className={styles.monVal}>{r.val}</span>
                    </div>
                  ))}
                  <div className={styles.holdMore} data-in={s.monIn >= MON_ROWS.length ? 'true' : 'false'}>All risk checks green · watching continuously</div>
                </div>
              )}

              {s.view === 'rebalance' && (
                <div className={styles.monCard}>
                  {REB_ROWS.map((r, i) => (
                    <div key={r.lab} className={styles.rebRow} data-in={i < s.rebIn ? 'true' : 'false'}>
                      <span className={styles.rebLab}>{r.lab}</span>
                      <span className={styles.rebVal}>{r.val}</span>
                    </div>
                  ))}
                  <div className={styles.holdMore} data-in={s.rebIn >= REB_ROWS.length ? 'true' : 'false'}>Plan queued for Priya — nothing rebalances on its own</div>
                </div>
              )}
            </div>

            {/* ── Right: the order ticket ── */}
            <div className={styles.workR}>
              <span className={styles.paneTitle}>The order ticket</span>
              <div className={styles.ticket} data-gto="ticket" data-phase={s.ticketPhase}>
                <div className={styles.tkHead}>
                  <span className={`${styles.logo} ${styles.logoIb} ${styles.tkLogo}`}>IB</span>
                  <span className={styles.tkTitle}>Order ticket — IBKR</span>
                  <span className={styles.tkStatus} data-phase={s.ticketIn ? s.ticketPhase : 'empty'}>
                    {!s.ticketIn ? 'no orders' : s.ticketPhase === 'filled' ? 'Filled' : s.ticketPhase === 'waiting' ? 'On hold' : 'Draft'}
                  </span>
                </div>
                {!s.ticketIn ? (
                  <div className={styles.tkEmpty}>Waiting for a signal to clear the model…</div>
                ) : (
                  <div className={styles.tkBody}>
                    <div className={styles.tkLine}>
                      <span className={styles.tkSide}>BUY</span>
                      <span className={styles.tkInstr}>40 NVDA @ market</span>
                      <span className={styles.tkAmt} data-in={s.ticketAmt ? 'true' : 'false'}>$14,800</span>
                    </div>
                    <div className={styles.waitBanner} data-show={s.ticketPhase === 'waiting' ? 'true' : 'false'}>
                      <span className={styles.waitDot} aria-hidden="true" />
                      Awaiting Priya&rsquo;s approval — nothing trades on its own
                    </div>
                    <div className={styles.tkApprove} data-in={s.approveIn ? 'true' : 'false'}>
                      <span className={`${styles.avatar} ${styles.avatarPm} ${styles.tkAvatar}`}>PM</span>
                      <button
                        type="button"
                        className={styles.approveBtn}
                        data-clicked={s.approveClicked ? 'true' : 'false'}
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        Approve order
                      </button>
                    </div>
                    <div className={styles.tkFilled} data-in={s.ticketPhase === 'filled' ? 'true' : 'false'}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 13l5 5L20 7" />
                      </svg>
                      Filled @ $183.60 · IBKR #7841923 · 09:14 EST
                    </div>
                    <div className={styles.tkAudit} data-in={s.auditIn ? 'true' : 'false'}>Logged: who, when, why — full audit trail</div>
                  </div>
                )}
              </div>

              <div className={styles.queue}>
                <div className={styles.qHead}>
                  <span className={styles.qTitle}>Queued for Priya</span>
                  <span className={styles.qCount} data-gto="queue">{s.queueIn ? '1 order' : 'empty'}</span>
                </div>
                <div className={styles.qBody}>
                  <div className={styles.qItem} data-in={s.queueIn ? 'true' : 'false'}>
                    <span className={styles.qMark}>!</span>
                    <span className={styles.qText}>SELL 80 META @ limit $492.00 — exit signal 0.77</span>
                  </div>
                  <div className={styles.qEmpty} data-hide={s.queueIn ? 'true' : 'false'}>
                    Exit and rebalance orders wait here for sign-off
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
                <p className={styles.receiptTitle}>Signal to human-approved order: 90 seconds.</p>
                <p className={styles.receiptSub}>The model finds it, sizes it, and drafts the ticket. Priya decides. Every decision logged.</p>
                <div className={styles.receiptRows}>
                  <div className={styles.receiptRow}><span>Signals scanned today</span><b>247</b></div>
                  <div className={styles.receiptRow}><span>High-conviction</span><b>14</b></div>
                  <div className={styles.receiptRow}><span>Orders drafted</span><b>2</b></div>
                  <div className={styles.receiptRow}><span>Human-approved</span><b className={styles.receiptHl}>100%</b></div>
                  <div className={styles.receiptRow}><span>Time saved daily</span><b className={styles.receiptHl}>~2 hrs</b></div>
                </div>
                <BookButton className={styles.receiptCta} location="investment-research-engine-scene-receipt">
                  Backtest your actual holdings →
                </BookButton>
                <span className={styles.receiptFine}>
                  10 years of data — see the Sharpe and win rate before any live capital.<br />
                  <b>IBKR · Schwab · Fidelity · Alpaca</b>, connected via Plaid
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
