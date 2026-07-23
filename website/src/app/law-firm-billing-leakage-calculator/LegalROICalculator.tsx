'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import LeadBox from '../../components/calculators/LeadBox';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';

// ─── Hidden Backend Constants (The "Secret Sauce") ────────────────────────────
// Never displayed to the user. Industry-validated benchmarks.
const NARRATIVE_QUALITY_LIFT = 0.08; // AI narrative coaching improves realization 8pp
const ABA_ELITE_BENCHMARK    = 0.93; // ABA-reported elite firm realization rate
const SOURCE = 'legal-realization-calculator';

function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}
function fmtMoneyFull(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function LegalROICalculator() {
  const [feeEarners,   setFeeEarners]   = useState(25);
  const [billingRate,  setBillingRate]  = useState(350);
  const [targetHours,  setTargetHours]  = useState(1800);
  const [realization,  setRealization]  = useState(84);

  const onEngage = useEngageOnce(SOURCE);

  // ─── Core Math ────────────────────────────────────────────────────────────
  const potentialRevenue   = feeEarners * targetHours * billingRate;
  const currentLeakage     = potentialRevenue * (1 - realization / 100);
  const recoveredRevenue   = currentLeakage * NARRATIVE_QUALITY_LIFT;
  const gapToElite         = feeEarners * targetHours * billingRate * (ABA_ELITE_BENCHMARK - realization / 100);
  const isAboveElite       = realization / 100 >= ABA_ELITE_BENCHMARK;

  const ouch_label         = fmtMoney(currentLeakage);
  const recover_label      = fmtMoney(recoveredRevenue);
  const gap_label          = fmtMoney(Math.max(0, gapToElite));
  const pp_gap             = (ABA_ELITE_BENCHMARK * 100 - realization).toFixed(1);

  return (
    <div className={styles.calc}>

      {/* ── LEFT: INPUTS ───────────────────────────────────────────────── */}
      <div className={styles.inputs}>

        <div className={styles.calcIntro}>
          <p className={styles.calcIntroText}>
            Most firms focus on <strong>Billable Hours</strong>. Elite firms focus on{' '}
            <strong>Realization Rate</strong>. The ABA benchmark for top-performing firms is{' '}
            <strong>93%</strong>. Where does your firm stand?
          </p>
        </div>

        <SliderField
          label="Number of Fee Earners"
          displayValue={feeEarners.toString()}
          value={feeEarners}
          min={5}
          max={500}
          step={5}
          hint="Partners, Associates, and Paralegals who bill time"
          onChange={setFeeEarners}
          onEngage={onEngage}
        />
        <SliderField
          label="Average Billable Rate ($/hr)"
          displayValue={fmtMoneyFull(billingRate)}
          value={billingRate}
          min={150}
          max={2000}
          step={25}
          hint="Blended rate across all fee earners"
          onChange={setBillingRate}
          onEngage={onEngage}
        />
        <SliderField
          label="Target Billable Hours / Year"
          displayValue={targetHours.toLocaleString('en-US') + ' h'}
          value={targetHours}
          min={1200}
          max={2400}
          step={50}
          hint="Firm target per timekeeper (industry average: 1,800 h)"
          onChange={setTargetHours}
          onEngage={onEngage}
        />
        <SliderField
          label="Current Realization Rate"
          displayValue={`${realization}%`}
          value={realization}
          min={60}
          max={98}
          step={1}
          hint="% of recorded time actually paid by clients. Includes pre-bill write-downs."
          onChange={setRealization}
          onEngage={onEngage}
        />
      </div>

      {/* ── RIGHT: RESULTS ─────────────────────────────────────────────── */}
      <div className={styles.results} aria-live="polite">

        {/* The "Ouch" — primary loss number */}
        <div className={styles.ouchBlock}>
          <p className={styles.resultKicker}>Annual WIP Write-Down Exposure</p>
          <p className={styles.resultBig} data-ouch="true">{ouch_label}</p>
          <p className={styles.resultBigLabel}>
            Your firm is voluntarily burning <strong>{ouch_label}</strong> annually in revenue that was worked, entered, and then deleted before the bill went out.
          </p>
        </div>

        {/* The "Recovery" — green win */}
        <div className={styles.subResults}>
          <div className={styles.subResult}>
            <p className={`${styles.subValue} ${styles.resultGreen}`}>{recover_label}</p>
            <p className={styles.subLabel}>
              Immediately recoverable by improving time-entry narrative quality with AI coaching
            </p>
          </div>

          {!isAboveElite ? (
            <div className={styles.subResult}>
              <p className={`${styles.subValue} ${styles.resultAlert}`}>
                {pp_gap}pp below elite
              </p>
              <p className={styles.subLabel}>
                The {gap_label}/yr gap between your realization rate and the ABA 93% elite benchmark
              </p>
            </div>
          ) : (
            <div className={styles.subResult}>
              <p className={`${styles.subValue} ${styles.resultGreen}`}>Elite Tier ✓</p>
              <p className={styles.subLabel}>
                Your realization rate exceeds the ABA 93% elite benchmark. AI can protect and extend this lead.
              </p>
            </div>
          )}
        </div>

        {/* Insight strip */}
        <div className={styles.insightStrip}>
          <p className={styles.insightText}>
            <strong>The source of the leak:</strong> Partners delete time entries before billing when the narrative is vague — "Reviewing file" gets cut. "Analysis of Tort Claim precedents re: Martinez discovery dispute" gets paid. AI-coached narratives reduce write-downs by an average of 8 percentage points.
          </p>
        </div>

        <LeadBox
          source={SOURCE}
          headline="Download the Full Board Report — formatted to show your Partners and CFO"
          sub="A complete breakdown of where the write-down loss is originating, which practice groups are most affected, and a 12-month recovery roadmap."
          successText="Done — your report is on the way. Book the workflow audit below to see exactly how narrative coaching integrates with your current billing system."
          buildUsecase={() =>
            `Legal Realization Simulator: ${feeEarners} fee earners · $${billingRate}/hr · ${targetHours}h target · ${realization}% realization → $${Math.round(currentLeakage).toLocaleString()} leakage / $${Math.round(recoveredRevenue).toLocaleString()} recoverable`
          }
          buildMeta={() => ({
            calculator: SOURCE,
            inputs: { feeEarners, billingRate, targetHours, realization },
            results: {
              potentialRevenue: Math.round(potentialRevenue),
              currentLeakage:   Math.round(currentLeakage),
              recoveredRevenue: Math.round(recoveredRevenue),
              gapToElite:       Math.round(Math.max(0, gapToElite)),
            },
          })}
          resultBand={() => {
            if (currentLeakage > 2_000_000) return 'critical';
            if (currentLeakage > 500_000)   return 'high';
            return 'medium';
          }}
        />
      </div>
    </div>
  );
}
