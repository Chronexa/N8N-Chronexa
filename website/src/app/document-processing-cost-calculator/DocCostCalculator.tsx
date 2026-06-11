'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import CurrencyToggle from '../../components/calculators/CurrencyToggle';
import LeadBox from '../../components/calculators/LeadBox';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';
import { fmtMoney, fmtRate, resultBand, type Currency } from '../../components/calculators/format';

/**
 * Document / invoice processing cost calculator.
 *   annualCost = docs/month × 12 × minutes/doc ÷ 60 × loaded hourly cost
 *   savings    = annualCost × 40–60% (published AP/document handling reduction;
 *                midpoint 50% highlighted)
 * External cross-checks cited in the FAQ: APQC ~$21 median per manual invoice,
 * Ardent Partners $15–40 for manual-heavy AP shops.
 */
const SAVE_LOW = 0.4;
const SAVE_MID = 0.5;
const SAVE_HIGH = 0.6;
const SOURCE = 'document-processing-cost-calculator';

const COST_CONFIG: Record<Currency, { default: number; min: number; max: number; step: number }> = {
  USD: { default: 30, min: 15, max: 80, step: 5 },
  INR: { default: 400, min: 100, max: 2000, step: 50 },
};

export default function DocCostCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [docs, setDocs] = useState(5000);
  const [minutes, setMinutes] = useState(8);
  const [hourly, setHourly] = useState(COST_CONFIG.USD.default);
  const onEngage = useEngageOnce(SOURCE);

  function switchCurrency(c: Currency) {
    onEngage();
    setCurrency(c);
    setHourly(COST_CONFIG[c].default);
  }

  const annualHours = (docs * 12 * minutes) / 60;
  const annualCost = annualHours * hourly;
  const perDoc = (minutes / 60) * hourly;
  const savingsLow = annualCost * SAVE_LOW;
  const savingsMid = annualCost * SAVE_MID;
  const savingsHigh = annualCost * SAVE_HIGH;
  const hoursFreedMonthly = ((docs * minutes) / 60) * SAVE_MID;

  return (
    <div className={styles.calc}>
      {/* Inputs */}
      <div className={styles.inputs}>
        <CurrencyToggle currency={currency} onSwitch={switchCurrency} />
        <SliderField
          label="Documents handled per month"
          displayValue={docs.toLocaleString('en-US')}
          value={docs} min={500} max={100000} step={500}
          hint="Invoices, claims, forms, statements, contracts — anything staff read and re-key."
          ariaLabel="Documents handled per month"
          onChange={setDocs} onEngage={onEngage}
        />
        <SliderField
          label="Handling minutes per document"
          displayValue={`${minutes} min`}
          value={minutes} min={2} max={30} step={1}
          hint="Open, read, extract, re-key, file, route — the full touch time."
          ariaLabel="Handling minutes per document"
          onChange={setMinutes} onEngage={onEngage}
        />
        <SliderField
          label="Loaded hourly cost of processing staff"
          displayValue={fmtRate(hourly, currency)}
          value={hourly}
          min={COST_CONFIG[currency].min} max={COST_CONFIG[currency].max} step={COST_CONFIG[currency].step}
          hint="Salary plus benefits and overhead, per hour."
          ariaLabel="Loaded hourly cost of processing staff"
          onChange={setHourly} onEngage={onEngage}
        />
      </div>

      {/* Results — live, ungated */}
      <div className={styles.results} aria-live="polite">
        <p className={styles.resultKicker}>What manual document handling costs you annually</p>
        <div>
          <p className={styles.resultBig}>{fmtMoney(annualCost, currency)}</p>
          <p className={styles.resultBigLabel}>
            {Math.round(annualHours).toLocaleString('en-US')} staff-hours a year at{' '}
            {fmtMoney(perDoc, currency)} per document
          </p>
        </div>
        <div className={styles.subResults}>
          <div className={styles.subResult}>
            <p className={styles.subValue}>{fmtMoney(savingsMid, currency)}</p>
            <p className={styles.subLabel}>
              annual saving at the 50% midpoint of the published 40–60% reduction
              ({fmtMoney(savingsLow, currency)}–{fmtMoney(savingsHigh, currency)} band)
            </p>
          </div>
          <div className={styles.subResult}>
            <p className={styles.subValue}>{Math.round(hoursFreedMonthly).toLocaleString('en-US')} h</p>
            <p className={styles.subLabel}>freed per month — staff redeployed from re-keying to exceptions and review</p>
          </div>
        </div>
        <p className={styles.assumption}>
          Uses the 40–60% handling-time reduction published on our document and finance automation pages — consistent
          with our first-hand client result of a 14-day document turnaround cut to 4 hours. Methodology below.
        </p>
      </div>

      <LeadBox
        source={SOURCE}
        headline="Get this breakdown for your document volume — plus the fix"
        sub="We’ll send your numbers with the full methodology, and how extraction with per-field confidence scoring removes 40–60% of handling time on your document types."
        successText="Done — your cost breakdown is on its way to your inbox. If you want a real number for your actual document mix, the next step is a 30-minute audit."
        buildUsecase={() =>
          `Document-processing cost calculator: ${docs.toLocaleString('en-US')} docs/mo · ${minutes} min/doc · ` +
          `${fmtRate(hourly, currency)} → ${fmtMoney(annualCost, currency)}/yr manual cost (save ~${fmtMoney(savingsMid, currency)})`
        }
        buildMeta={() => ({
          calculator: SOURCE,
          currency,
          inputs: { docsPerMonth: docs, minutesPerDoc: minutes, hourlyCost: hourly },
          results: {
            annualCost: Math.round(annualCost),
            annualCostFmt: fmtMoney(annualCost, currency),
            savingsMid: Math.round(savingsMid),
            savingsMidFmt: fmtMoney(savingsMid, currency),
            hoursFreedMonthly: Math.round(hoursFreedMonthly),
          },
        })}
        resultBand={() => resultBand(annualCost, currency)}
      />
    </div>
  );
}
