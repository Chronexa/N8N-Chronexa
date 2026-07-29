'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import LeadBox from '../../components/calculators/LeadBox';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';
import { fmtMoney } from '../../components/calculators/format';

// ─── Sourced inputs (see /src/lib/services-content.ts comment for citations) ─
// Fully-loaded CTC midpoints, Bangalore/Mumbai, 1-3 yrs experience:
//   Growth/Performance Marketer: PayScale/Glassdoor/AmbitionBox, ~₹6-13L → ₹9.5L
//   Sales/BD Rep (SDR):          PayScale India, ~₹3.5-7L → ₹5L
//   Support Executive:           PayScale/AmbitionBox, ~₹2.1-4.1L → ₹3L
//   Ops/Business Analyst:        AmbitionBox via Naukri, ~₹6.3-7.2L avg → ₹7L
const CTC = { marketer: 950_000, sdr: 500_000, support: 300_000, ops: 700_000 };
// Statutory/employer overhead convention (PF match + gratuity + ESI) — India payroll/EOR norm.
const OVERHEAD = 0.18;
// McKinsey, "The Economic Potential of Generative AI" (2023): 60-70% of current
// work hours are automatable with today's technology.
const AUTOMATABLE_LOW = 0.6;
const AUTOMATABLE_HIGH = 0.7;
const SOURCE = 'startup-hiring-cost-calculator';

export default function HiringCostCalculator() {
  const [marketers, setMarketers] = useState(1);
  const [sdrs, setSdrs] = useState(2);
  const [support, setSupport] = useState(1);
  const [ops, setOps] = useState(0);

  const onEngage = useEngageOnce(SOURCE);

  const baseCTC = marketers * CTC.marketer + sdrs * CTC.sdr + support * CTC.support + ops * CTC.ops;
  const fullyLoaded = baseCTC * (1 + OVERHEAD);
  const automatableLow = fullyLoaded * AUTOMATABLE_LOW;
  const automatableHigh = fullyLoaded * AUTOMATABLE_HIGH;
  const headcount = marketers + sdrs + support + ops;

  return (
    <div className={styles.calc}>
      {/* ── LEFT: INPUTS ─────────────────────────────────────────────── */}
      <div className={styles.inputs}>
        <div className={styles.calcIntro}>
          <p className={styles.calcIntroText}>
            This is what the team you&apos;re about to hire actually costs — fully loaded, before
            training, ramp time, or a single result. <strong>Move the sliders to your plan.</strong>
          </p>
        </div>

        <SliderField
          label="Growth / Performance Marketers"
          displayValue={String(marketers)}
          value={marketers}
          min={0}
          max={5}
          step={1}
          hint={`~${fmtMoney(CTC.marketer, 'INR')} CTC each — Bangalore/Mumbai, 1-3 yrs`}
          onChange={setMarketers}
          onEngage={onEngage}
        />
        <SliderField
          label="Sales / BD Reps (SDR)"
          displayValue={String(sdrs)}
          value={sdrs}
          min={0}
          max={5}
          step={1}
          hint={`~${fmtMoney(CTC.sdr, 'INR')} CTC each`}
          onChange={setSdrs}
          onEngage={onEngage}
        />
        <SliderField
          label="Support Executives"
          displayValue={String(support)}
          value={support}
          min={0}
          max={5}
          step={1}
          hint={`~${fmtMoney(CTC.support, 'INR')} CTC each`}
          onChange={setSupport}
          onEngage={onEngage}
        />
        <SliderField
          label="Ops / Business Analysts"
          displayValue={String(ops)}
          value={ops}
          min={0}
          max={5}
          step={1}
          hint={`~${fmtMoney(CTC.ops, 'INR')} CTC each`}
          onChange={setOps}
          onEngage={onEngage}
        />
      </div>

      {/* ── RIGHT: RESULTS ───────────────────────────────────────────── */}
      <div className={styles.results} aria-live="polite">
        <div className={styles.ouchBlock}>
          <p className={styles.resultKicker}>Fully-Loaded Annual Cost — This Team</p>
          <p className={styles.resultBig} data-ouch="true">{fmtMoney(fullyLoaded, 'INR')}</p>
          <p className={styles.resultBigLabel}>
            {headcount > 0
              ? `${headcount} hire${headcount > 1 ? 's' : ''}, before training or ramp time — salary + ~18% statutory overhead (PF, gratuity, ESI).`
              : 'Move a slider to see the fully-loaded cost of this team.'}
          </p>
        </div>

        <div className={styles.subResults}>
          <div className={styles.subResult}>
            <p className={`${styles.subValue} ${styles.resultGreen}`}>
              {fmtMoney(automatableLow, 'INR')}–{fmtMoney(automatableHigh, 'INR')}
            </p>
            <p className={styles.subLabel}>
              of that cost sits in work AI can already take on today — McKinsey estimates 60–70%
              of current work hours are automatable with today&apos;s technology (2023)
            </p>
          </div>
        </div>

        <div className={styles.insightStrip}>
          <p className={styles.insightText}>
            <strong>The reframe:</strong> hiring is real leverage over the long run — but it&apos;s
            a 2–3 month cycle before someone is fully ramped, and the cost scales with headcount
            forever. A growth system takes on the repeatable share of this work in weeks, and keeps
            absorbing volume as you grow — no re-hiring at the next inflection point.
          </p>
        </div>

        <LeadBox
          source={SOURCE}
          headline="Get the exact breakdown — which of these roles' work is automatable, and what it would take"
          sub="A short breakdown of where the repeatable work sits in this team, mapped to your actual stack. Lands in your inbox."
          successText="Done — your breakdown is on the way. Book the discovery call below to map this against your actual funnel and stack."
          buildUsecase={() =>
            `Startup Hiring-Cost Calculator: ${marketers} marketer(s) · ${sdrs} SDR(s) · ${support} support · ${ops} ops → ${fmtMoney(fullyLoaded, 'INR')} fully-loaded cost`
          }
          buildMeta={() => ({
            calculator: SOURCE,
            inputs: { marketers, sdrs, support, ops },
            results: {
              baseCTC: Math.round(baseCTC),
              fullyLoaded: Math.round(fullyLoaded),
              automatableLow: Math.round(automatableLow),
              automatableHigh: Math.round(automatableHigh),
            },
          })}
          resultBand={() => {
            if (fullyLoaded > 1e7) return 'critical';
            if (fullyLoaded > 3e6) return 'high';
            return 'medium';
          }}
        />
      </div>
    </div>
  );
}
