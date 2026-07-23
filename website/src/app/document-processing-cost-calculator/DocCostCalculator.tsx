'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import LeadBox from '../../components/calculators/LeadBox';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';

// ─── Hidden Backend Constants (The "Secret Sauce") ────────────────────────────
const AI_COST_PER_INVOICE = 2.00;   // AI drops cost-per-invoice to $2 (hardcoded)
const DISCOUNT_RATE       = 0.02;   // Standard "2/10 Net 30" early payment discount
const EARLY_PAY_THRESHOLD = 10;     // Must process in <10 days to capture discount
const SOURCE = 'ap-cash-velocity-calculator';

function fmtM(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}
function fmtFull(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function DocCostCalculator() {
  const [annualSpend,     setAnnualSpend]     = useState(20_000_000);
  const [processingDays,  setProcessingDays]  = useState(12);
  const [vendorDiscount,  setVendorDiscount]  = useState(20);
  const [costPerInvoice,  setCostPerInvoice]  = useState(12);

  const onEngage = useEngageOnce(SOURCE);

  // ─── Core Math ─────────────────────────────────────────────────────────────
  // Estimate invoice volume from spend (avg invoice = $2,500)
  const invoiceVolume        = Math.round(annualSpend / 2500);

  // The Small Money: Labor savings
  const laborSavings         = invoiceVolume * (costPerInvoice - AI_COST_PER_INVOICE);

  // The Big Money: Missed discounts
  const eligibleSpend        = annualSpend * (vendorDiscount / 100);
  const missedDiscounts      = processingDays > EARLY_PAY_THRESHOLD
    ? eligibleSpend * DISCOUNT_RATE   // Over 10 days = lose ALL discounts
    : 0;                              // Under 10 days = already capturing them
  const discountsIfAI        = eligibleSpend * DISCOUNT_RATE; // AI always < 24hr

  const totalOpportunity     = laborSavings + (processingDays > EARLY_PAY_THRESHOLD ? missedDiscounts : discountsIfAI);
  const discountGain         = processingDays > EARLY_PAY_THRESHOLD ? missedDiscounts : discountsIfAI;

  // DPO impact: freeing cash sooner
  const daysSaved            = Math.max(0, processingDays - 1); // AI = 1 day
  const workingCapitalRelease = annualSpend * (daysSaved / 365) * 0.08; // 8% cost of capital

  const alreadyCapturing     = processingDays <= EARLY_PAY_THRESHOLD;

  return (
    <div className={styles.calc}>

      {/* ── LEFT: INPUTS ───────────────────────────────────────────────── */}
      <div className={styles.inputs}>

        <div className={styles.calcIntro}>
          <p className={styles.calcIntroText}>
            Data entry is cheap. <strong>Missed opportunities are expensive.</strong>{' '}
            If invoices sit in an approval queue for more than 10 days, you forfeit the{' '}
            &ldquo;2/10 Net 30&rdquo; early payment discount — and on a $20M spend base, that 2% is worth{' '}
            <strong>$400,000 a year</strong>.
          </p>
        </div>

        <SliderField
          label="Annual Invoice Spend"
          displayValue={fmtFull(annualSpend)}
          value={annualSpend}
          min={1_000_000}
          max={500_000_000}
          step={1_000_000}
          hint={`Estimated invoice volume: ~${invoiceVolume.toLocaleString()} invoices/year`}
          onChange={setAnnualSpend}
          onEngage={onEngage}
        />
        <SliderField
          label="Current Invoice Processing Time"
          displayValue={`${processingDays} days`}
          value={processingDays}
          min={1}
          max={45}
          step={1}
          hint={processingDays > EARLY_PAY_THRESHOLD
            ? `⚠ Over ${EARLY_PAY_THRESHOLD} days — you are missing ALL early payment discounts`
            : `✓ Under ${EARLY_PAY_THRESHOLD} days — you are eligible to capture discounts`
          }
          onChange={setProcessingDays}
          onEngage={onEngage}
        />
        <SliderField
          label="% of Vendors Offering Early Pay Discount"
          displayValue={`${vendorDiscount}%`}
          value={vendorDiscount}
          min={5}
          max={50}
          step={5}
          hint="Industry average: 20% of vendors offer the standard 2/10 Net 30 terms"
          onChange={setVendorDiscount}
          onEngage={onEngage}
        />
        <SliderField
          label="Current Cost Per Invoice (Labor)"
          displayValue={fmtFull(costPerInvoice)}
          value={costPerInvoice}
          min={5}
          max={50}
          step={1}
          hint="APQC benchmark: $15–$40 for manual-heavy AP. AI drops this to ~$2."
          onChange={setCostPerInvoice}
          onEngage={onEngage}
        />
      </div>

      {/* ── RIGHT: RESULTS ─────────────────────────────────────────────── */}
      <div className={styles.results} aria-live="polite">

        {/* The "Ouch" — total annual opportunity */}
        <div className={styles.ouchBlock}>
          <p className={styles.resultKicker}>Total Annual Cash Opportunity</p>
          <p className={styles.resultBig} data-ouch="true">{fmtM(totalOpportunity)}</p>
          <p className={styles.resultBigLabel}>
            {alreadyCapturing
              ? `Your processing time is under 10 days — you are eligible for discounts. AI can still unlock ${fmtM(totalOpportunity)} by eliminating labor cost and releasing working capital.`
              : `Your slow AP approval cycle is costing your firm ${fmtM(totalOpportunity)} every year.`
            }
          </p>
        </div>

        {/* The "Twist" — breakdown showing discounts dwarf labor savings */}
        <div className={styles.subResults}>
          <div className={styles.subResult}>
            <p className={`${styles.subValue}`} style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step-1)' }}>
              {fmtM(laborSavings)}
            </p>
            <p className={styles.subLabel}>
              Labor savings (reducing cost-per-invoice from ${costPerInvoice} to $2)
            </p>
          </div>
          <div className={styles.subResult}>
            <p className={`${styles.subValue} ${styles.resultGreen}`}>{fmtM(discountGain)}</p>
            <p className={styles.subLabel}>
              {alreadyCapturing
                ? 'Early payment discounts (already capturing — AI locks this in consistently)'
                : `Missed early payment discounts (2% on ${fmtM(eligibleSpend)} eligible spend)`
              }
            </p>
          </div>
        </div>

        {/* The Reframe Insight */}
        <div className={styles.insightStrip}>
          {alreadyCapturing ? (
            <p className={styles.insightText}>
              <strong>You&apos;re ahead of most firms.</strong> Your processing time qualifies for early payment discounts. AI automation locks in <strong>{fmtM(discountGain)}</strong> in discounts consistently — and releases <strong>{fmtM(workingCapitalRelease)}</strong> in working capital by compressing approval to 24 hours.
            </p>
          ) : (
            <p className={styles.insightText}>
              <strong>The CFO reframe:</strong> This is not an AP efficiency problem. It is a <strong>Working Capital</strong> problem. The labor savings ({fmtM(laborSavings)}) are almost irrelevant. The missed discounts ({fmtM(missedDiscounts)}) are{' '}
              <strong>{Math.round(missedDiscounts / Math.max(laborSavings, 1))}× larger</strong> — and entirely avoidable with same-day invoice processing.
            </p>
          )}
        </div>

        {/* Working capital bonus */}
        {daysSaved > 0 && (
          <div className={styles.bonusMetric}>
            <p className={styles.bonusValue}>{fmtM(workingCapitalRelease)}</p>
            <p className={styles.bonusLabel}>
              Additional working capital released annually by compressing approval from {processingDays} days to 24 hours (at 8% cost of capital)
            </p>
          </div>
        )}

        <LeadBox
          source={SOURCE}
          headline="Download the Full Board Report — formatted to show your CFO"
          sub="A complete breakdown of your AP cost structure vs. industry benchmarks, your early payment discount capture rate, and a working capital optimization roadmap."
          successText="Done — your AP analysis is on the way. Book the workflow audit below to map this against your specific ERP and approval chain."
          buildUsecase={() =>
            `AP Cash Velocity Calculator: $${(annualSpend / 1_000_000).toFixed(1)}M spend · ${processingDays}d processing · ${vendorDiscount}% discount vendors · $${costPerInvoice}/invoice → ${fmtM(totalOpportunity)} total opportunity`
          }
          buildMeta={() => ({
            calculator: SOURCE,
            inputs: { annualSpend, processingDays, vendorDiscount, costPerInvoice },
            results: {
              invoiceVolume,
              laborSavings:          Math.round(laborSavings),
              missedDiscounts:       Math.round(discountGain),
              totalOpportunity:      Math.round(totalOpportunity),
              workingCapitalRelease: Math.round(workingCapitalRelease),
              alreadyCapturing,
            },
          })}
          resultBand={() => {
            if (totalOpportunity > 1_000_000) return 'critical';
            if (totalOpportunity > 200_000)   return 'high';
            return 'medium';
          }}
        />
      </div>
    </div>
  );
}
