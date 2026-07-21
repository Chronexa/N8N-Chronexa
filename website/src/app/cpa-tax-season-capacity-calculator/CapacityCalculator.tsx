'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import CurrencyToggle from '../../components/calculators/CurrencyToggle';
import LeadBox from '../../components/calculators/LeadBox';
import ComparisonPanel from '../../components/calculators/ComparisonPanel';
import HeroBar from '../../components/calculators/HeroBar';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';
import { fmtAmount, fmtMoney, resultBand, type Currency } from '../../components/calculators/format';

const COMPARE_BEFORE = [
  'Staff check the client portal for new documents, one client at a time',
  'Missing documents chased by email, tracked in someone’s head or a spreadsheet',
  'Every file sorted and classified by hand — W-2, 1099, K-1, brokerage composite',
  'Every field read off the document and retyped into the tax software',
  'Preparer reviews the finished return line by line for hours',
];
const COMPARE_AFTER = [
  'Documents pulled from the client portal automatically, gaps chased for you',
  '18+ document types classified on arrival',
  'Thousands of fields extracted and verified, low-confidence reads flagged',
  'Return arrives ~94% pre-filled — the preparer starts from a punch-list',
  'CPA review drops to ~15–25 minutes with a side-by-side source dashboard',
];
const COMPARE_OUTCOME =
  'The same benchmark this calculator models: 40% less prep time per return, review down from hours to minutes.';

/**
 * CPA tax-season capacity calculator. Built around the actual stages of the
 * CPA & Tax Engine (engines-data.ts: CPA_TAX_ENGINE.nodes) rather than one
 * blended percentage, so the mechanism — where the hours actually come from —
 * is visible, not just an output.
 *
 * "Prep hours" covers four automated stages: chasing missing documents,
 * classification, extraction/data entry, and return population. Published
 * reduction: 40% (Filed benchmark, corroborated by our own client case study).
 * Review is modelled separately and explicitly, because it is the clearest,
 * most concrete stage: today's review time compared against the published
 * 15–25 minute benchmark for a return arriving pre-verified. This is additive
 * to — not counted inside — the headline capacity number, matching how the
 * engine page already treats it (a conservative-on-purpose exclusion).
 *
 * Capacity math (unchanged from the previous fix, still prep-time-driven so
 * the published worked example stays stable):
 *   hoursFreed         = returns × prepHours × 40%
 *   capacityHoursCap    = preparers × 200h  (headcount ceiling before
 *                         review/sign-off, not prep, becomes the bottleneck)
 *   realizationRate     = 0.45, scaled by prepHours vs. a 4h reference
 *   addedReturns        = min(hoursFreed, capacityHoursCap) ÷ (prepHours × 60%) × realizationRate
 *   capacityRevenue     = addedReturns × fee
 * At the published defaults (10 preparers, 600 returns, 4h prep, $700 fee)
 * this still resolves to exactly 180 added returns / $126,000.
 */
const PREP_REDUCTION = 0.4;
const REALIZATION_BASE = 0.45;
const REFERENCE_PREP_HOURS = 4;
const MAX_HOURS_PER_PREPARER = 200;
const REVIEW_HOURS_AFTER = 20 / 60; // published 15–25 min benchmark, midpoint
const BAND_SPREAD = 0.2; // mid ± 20%, same relative spread as the document-processing calculator's 40/50/60 band
const SOURCE = 'cpa-capacity-calculator';

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

const FEE_CONFIG: Record<Currency, { default: number; min: number; max: number; step: number }> = {
  USD: { default: 700, min: 200, max: 2500, step: 50 },
  INR: { default: 10000, min: 2000, max: 100000, step: 1000 },
};

export default function CapacityCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [preparers, setPreparers] = useState(10);
  const [returns, setReturns] = useState(600);
  const [prepHours, setPrepHours] = useState(4);
  const [reviewHours, setReviewHours] = useState(3.5);
  const [fee, setFee] = useState(FEE_CONFIG.USD.default);
  const onEngage = useEngageOnce(SOURCE);

  function switchCurrency(c: Currency) {
    onEngage();
    setCurrency(c);
    setFee(FEE_CONFIG[c].default);
  }

  const hoursFreed = returns * prepHours * PREP_REDUCTION;
  const capacityHoursCap = preparers * MAX_HOURS_PER_PREPARER;
  const effectiveHoursFreed = Math.min(hoursFreed, capacityHoursCap);
  const realizationRate = REALIZATION_BASE * clamp(prepHours / REFERENCE_PREP_HOURS, 0.6, 1.4);
  const theoreticalAddedReturns = effectiveHoursFreed / (prepHours * (1 - PREP_REDUCTION));
  const addedReturns = Math.round(theoreticalAddedReturns * realizationRate);
  const addedReturnsLow = Math.round(addedReturns * (1 - BAND_SPREAD));
  const addedReturnsHigh = Math.round(addedReturns * (1 + BAND_SPREAD));
  const capacityRevenue = addedReturns * fee;
  const returnsPerPreparer = addedReturns / preparers;
  const isStaffingConstrained = hoursFreed > capacityHoursCap;

  // Review is modelled separately from prep — additive, not folded into
  // addedReturns/capacityRevenue above (kept conservative, matching the
  // engine page's own treatment of review as an excluded bonus).
  const reviewMinutesAfter = Math.round(REVIEW_HOURS_AFTER * 60);
  const reviewHoursSavedPerReturn = Math.max(0, reviewHours - REVIEW_HOURS_AFTER);
  const reviewHoursSavedSeason = reviewHoursSavedPerReturn * returns;

  return (
    <div className={styles.calc}>
      {/* Inputs */}
      <div className={styles.inputs}>
        <CurrencyToggle currency={currency} onSwitch={switchCurrency} />
        <SliderField
          label="Preparers on staff"
          displayValue={preparers.toLocaleString('en-US')}
          value={preparers} min={2} max={200} step={1}
          ariaLabel="Number of tax preparers"
          onChange={setPreparers} onEngage={onEngage}
        />
        <SliderField
          label="Returns filed per season"
          displayValue={returns.toLocaleString('en-US')}
          value={returns} min={100} max={20000} step={50}
          ariaLabel="Returns filed per season"
          onChange={setReturns} onEngage={onEngage}
        />
        <SliderField
          label="Average prep hours per return"
          displayValue={`${prepHours} h`}
          value={prepHours} min={1} max={8} step={0.5}
          hint="Document chasing, classification, data entry and population — before review."
          ariaLabel="Average preparation hours per return"
          onChange={setPrepHours} onEngage={onEngage}
        />
        <SliderField
          label="Average review hours per return, today"
          displayValue={`${reviewHours} h`}
          value={reviewHours} min={1} max={6} step={0.25}
          hint="Time the CPA spends checking extracted data against source documents before sign-off."
          ariaLabel="Average review hours per return today"
          onChange={setReviewHours} onEngage={onEngage}
        />
        <SliderField
          label="Average fee per return"
          displayValue={fmtAmount(fee, currency)}
          value={fee}
          min={FEE_CONFIG[currency].min} max={FEE_CONFIG[currency].max} step={FEE_CONFIG[currency].step}
          ariaLabel="Average fee per return"
          onChange={setFee} onEngage={onEngage}
        />
      </div>

      {/* Results — live, ungated */}
      <div className={styles.results} aria-live="polite">
        <p className={styles.resultKicker}>Added capacity revenue per season</p>
        <div>
          <p className={styles.resultBig}>{fmtMoney(capacityRevenue, currency)}</p>
          <p className={styles.resultBigLabel}>
            from {addedReturns.toLocaleString('en-US')} additional returns your current team could file —{' '}
            {returnsPerPreparer.toLocaleString('en-US', { maximumFractionDigits: 0 })} more per preparer, no new hires
          </p>
        </div>
        <div className={styles.subResults}>
          <div className={styles.subResult}>
            <p className={styles.subValue}>{Math.round(hoursFreed).toLocaleString('en-US')} h</p>
            <p className={styles.subLabel}>of prep time freed per season — chasing, classifying, extracting, populating</p>
          </div>
          <div className={styles.subResult}>
            <p className={styles.subValue}>+{addedReturns.toLocaleString('en-US')}</p>
            <p className={styles.subLabel}>
              returns added ({addedReturnsLow.toLocaleString('en-US')}–{addedReturnsHigh.toLocaleString('en-US')} band)
              at a conservative {Math.round(realizationRate * 100)}% realization rate — the engine&rsquo;s benchmark is 3×
            </p>
          </div>
        </div>

        <p className={styles.taskHeading}>Where the hours actually go</p>
        <div className={styles.taskList}>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Document chasing</span>
            <span className={styles.taskAfter}>Automated — reminders sent, nobody tracks it by hand</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Classification</span>
            <span className={styles.taskAfter}>Automated — 18+ document types sorted on arrival</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Extraction &amp; data entry</span>
            <span className={styles.taskAfter}>Automated — every field verified before it&rsquo;s used</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Return population</span>
            <span className={styles.taskAfter}>Arrives ~94% pre-filled</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>CPA review</span>
            <span className={styles.taskAfter}>{reviewHours} h today → ~{reviewMinutesAfter} min per return</span>
          </div>
        </div>

        <HeroBar
          label="CPA review time, per return"
          beforeValue={reviewHours}
          beforeLabel={`${reviewHours} h`}
          afterValue={REVIEW_HOURS_AFTER}
          afterLabel={`~${reviewMinutesAfter} min`}
        />
        <p className={styles.assumption}>
          Review alone: roughly {Math.round(reviewHoursSavedSeason).toLocaleString('en-US')}h saved across the season —
          on top of the capacity number above, not counted inside it.
        </p>

        {isStaffingConstrained && (
          <p className={styles.assumption}>
            At this volume, preparer headcount — not prep-time savings — is the binding constraint: your team could
            absorb {Math.round(capacityHoursCap).toLocaleString('en-US')}h of the {Math.round(hoursFreed).toLocaleString('en-US')}h
            freed before review and sign-off time becomes the bottleneck. More preparers would raise this ceiling.
          </p>
        )}
        <p className={styles.assumption}>
          Uses the published benchmarks from our CPA &amp; Tax Engine: 40% less prep time per return and a 94% pre-fill
          rate, with the realization rate modelled conservatively and scaled to your current prep time and staffing.
          Methodology below — your firm&rsquo;s real number depends on return mix, and the audit maps it.
        </p>
      </div>

      <ComparisonPanel
        title="How a return moves through the engine, start to sign-off"
        beforeSteps={COMPARE_BEFORE}
        afterSteps={COMPARE_AFTER}
        outcome={COMPARE_OUTCOME}
        source="Synthesized from the CPA & Tax Engine's published six-stage pipeline."
      />

      <LeadBox
        source={SOURCE}
        headline="Get this breakdown for your firm — before next season"
        sub="We’ll send your numbers with the full methodology, plus how document chasing, extraction, return pre-fill and review each change — on the tax software you already run."
        successText="Done — your capacity breakdown is on its way to your inbox. If you want the real number for your return mix instead of a benchmark, the next step is a 30-minute audit."
        buildUsecase={() =>
          `CPA capacity calculator: ${preparers} preparers · ${returns} returns/season · ${prepHours}h prep · ${reviewHours}h review · ` +
          `${fmtAmount(fee, currency)}/return → +${addedReturns} returns, ${fmtMoney(capacityRevenue, currency)}/season capacity, ` +
          `${Math.round(reviewHoursSavedSeason)}h review time saved`
        }
        buildMeta={() => ({
          calculator: SOURCE,
          currency,
          inputs: { preparers, returnsPerSeason: returns, prepHoursPerReturn: prepHours, reviewHoursPerReturn: reviewHours, feePerReturn: fee },
          results: {
            capacityRevenue: Math.round(capacityRevenue),
            capacityRevenueFmt: fmtMoney(capacityRevenue, currency),
            addedReturns,
            hoursFreed: Math.round(hoursFreed),
            reviewHoursSavedSeason: Math.round(reviewHoursSavedSeason),
            staffingConstrained: isStaffingConstrained,
          },
        })}
        resultBand={() => resultBand(capacityRevenue, currency)}
      />
    </div>
  );
}
