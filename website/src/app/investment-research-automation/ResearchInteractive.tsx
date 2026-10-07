'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './ResearchInteractive.module.css';

/* The research desk. For each workflow: what goes in, what is computed, what a
   human decides, and what is kept so the claim can be substantiated later.
   The last tab is a build we turn down, and the reason is regulatory. */

type Flow = {
  id: string;
  tab: string;
  ask: string;
  inputs: { src: string; what: string }[];
  computed: string[];
  human: string;
  record: string;
  refused?: boolean;
};

const FLOWS: Flow[] = [
  {
    id: 'consolidate',
    tab: 'Consolidate the portfolio',
    ask: 'Show one household’s true position across everything, including what we do not custody.',
    inputs: [
      { src: 'Custodian feed', what: 'Positions and transactions for managed accounts' },
      { src: 'Plaid / Yodlee', what: 'Held-away accounts the client linked themselves' },
      { src: 'Market data', what: 'Prices, corporate actions, fund holdings' },
    ],
    computed: [
      'Identifiers reconciled across sources, so the same holding is not counted twice under two tickers',
      'Look-through into funds and ETFs, so an overweight hidden inside three vehicles becomes visible',
      'Unreconciled items listed as unreconciled rather than silently dropped to make the total balance',
    ],
    human: 'The adviser reads a household position that is actually complete, including the held-away accounts that usually make the picture wrong.',
    record: 'Every source, the retrieval timestamp, and each reconciliation decision — so a number in a client review can be traced back months later.',
  },
  {
    id: 'screen',
    tab: 'Run the screen',
    ask: 'Which names meet our stated criteria this quarter, and why did each one qualify?',
    inputs: [
      { src: 'Fundamental data', what: 'Statements, ratios, revisions' },
      { src: 'Price and volume', what: 'NSE, BSE, NYSE, NASDAQ, as the mandate requires' },
      { src: 'Your own criteria', what: 'The screen your process already uses, written down' },
    ],
    computed: [
      'The screen applied consistently, on a schedule, without someone rebuilding a spreadsheet',
      'A ranking over explicitly chosen features, where gradient-boosted models genuinely earn their place',
      'For every name: which criteria it passed, which it failed, and the values behind both',
    ],
    human: 'An analyst decides what is worth work. The output is a prioritised reading list with its reasoning attached, not a recommendation.',
    record: 'The criteria as of that run, the data vintage, the model version and the full ranked output — including the names that did not make the cut.',
  },
  {
    id: 'risk',
    tab: 'Watch for drift',
    ask: 'Tell us which portfolios have moved away from their mandate, before the client notices.',
    inputs: [
      { src: 'Positions', what: 'Current holdings across all consolidated accounts' },
      { src: 'Target models', what: 'The allocation each household is supposed to be at' },
      { src: 'Market data', what: 'Prices, and fund composition for look-through' },
    ],
    computed: [
      'Drift from target measured at position and asset-class level, on a schedule you set',
      'Concentration measured after look-through, which is where the real overlaps hide',
      'Rebalancing analysis showing what a trade would do, with tax lots surfaced where relevant',
    ],
    human: 'The adviser decides whether to act, and the client conversation happens before the drift becomes a complaint.',
    record: 'What triggered, when, what it showed, and whether anyone acted — the audit trail that makes this defensible in a review.',
  },
  {
    id: 'refused',
    tab: 'One we turn down',
    ask: 'Build us a model that predicts prices, so we can tell clients our AI beats the market.',
    inputs: [
      { src: 'The ask', what: 'Usually framed as "an LSTM on price history"' },
      { src: 'The reality', what: 'Sequence models on raw prices do not hold up out of sample' },
      { src: 'The regulator', what: 'The SEC has charged advisers for overstating AI capability' },
    ],
    computed: [
      'Nothing. We decline the framing rather than build something and let you describe it loosely',
      'The Marketing Rule covers AI claims and performance figures like any other advertisement',
      'If you cannot substantiate it from records, you should not be saying it to a client',
    ],
    human: 'We will happily build the screening, risk and research infrastructure underneath — and then help you describe it accurately, which is a shorter sentence but a safer one.',
    record: 'The best protection here is a system whose outputs can be reproduced and evidenced. That is buildable. Prediction is not.',
    refused: true,
  },
];

export function ResearchDesk() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(FLOWS.length, 8000);
  const f = FLOWS[active];

  return (
    <div className={s.desk} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>THE RESEARCH DESK</span>
        <span>{running ? 'PLAYING · PICK ONE' : 'PICK A WORKFLOW'}</span>
      </div>

      <div className={s.picker} role="group" aria-label="Choose a workflow">
        {FLOWS.map((x, i) => (
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
        <motion.div key={f.id} {...panelMotion(reduce)}>
          <p className={s.ask}>&ldquo;{f.ask}&rdquo;</p>

          <div className={s.body} aria-live="polite">
            <p className={s.label}>{f.refused ? 'What is in front of us' : 'What goes in'}</p>
            <ul className={s.inputs}>
              {f.inputs.map((i, n) => (
                <motion.li key={i.src} {...rowMotion(reduce, n)}>
                  <b>{i.src}</b>
                  <span>{i.what}</span>
                </motion.li>
              ))}
            </ul>

            <p className={s.label}>{f.refused ? 'Why we say no' : 'What is computed'}</p>
            <ul className={f.refused ? s.refusedList : s.computed}>
              {f.computed.map((x, n) => (
                <motion.li key={x} {...rowMotion(reduce, f.inputs.length + n)}>{x}</motion.li>
              ))}
            </ul>

            <motion.div {...rowMotion(reduce, f.inputs.length + f.computed.length)}>
              <p className={s.label}>{f.refused ? 'What we build instead' : 'What a person decides'}</p>
              <p className={s.human}>{f.human}</p>
            </motion.div>

            <motion.p
              className={`${s.record} ${f.refused ? s.recordRefused : ''}`}
              {...rowMotion(reduce, f.inputs.length + f.computed.length + 1)}
            >
              <b>{f.refused ? 'THE POINT' : 'ON THE RECORD'}</b>
              {f.record}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
