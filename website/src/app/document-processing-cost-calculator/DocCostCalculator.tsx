'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import CurrencyToggle from '../../components/calculators/CurrencyToggle';
import LeadBox from '../../components/calculators/LeadBox';
import ComparisonPanel from '../../components/calculators/ComparisonPanel';
import HeroBar from '../../components/calculators/HeroBar';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';
import { fmtMoney, fmtRate, resultBand, type Currency } from '../../components/calculators/format';

/**
 * Document / invoice processing cost calculator.
 *   annualCost = docs/month × 12 × minutes/doc ÷ 60 × loaded hourly cost
 *   savings    = annualCost × 40–60% (published AP/document handling reduction;
 *                midpoint 50% highlighted)
 * External cross-checks cited in the FAQ: APQC ~$21 median per manual invoice,
 * Ardent Partners $15–40 for manual-heavy AP shops.
 *
 * The hero bar and comparison panel below don't derive from the sliders —
 * they're the one real, published client result (DOC_INTEL_ROI in
 * engines-data.ts: a reserve-study pipeline, 14 days to 4 hours) shown as
 * proof of mechanism, same role the CPA calculator's review-time bar plays.
 */
const SAVE_LOW = 0.4;
const SAVE_MID = 0.5;
const SAVE_HIGH = 0.6;
const SOURCE = 'document-processing-cost-calculator';

const COMPARE_BEFORE = [
  'Every document opened, read and re-typed by hand — invoices, claims, forms, statements, contracts',
  'Scanned, faxed or handwritten pages get set aside for someone to puzzle over',
  'Each document filed manually, with no way to search across the pile',
  'A question about the archive means re-reading everything by hand',
];
const COMPARE_AFTER = [
  'Every document pulled in automatically — PDFs, scans, phone photos, handwritten forms, email attachments',
  'OCR and AI vision read even faxed or handwritten content, with a confidence score on every field',
  'Every document classified and routed automatically — legal, finance, compliance and tax',
  'A plain-language question gets a cited answer in seconds, traced to the exact source page',
];
const COMPARE_OUTCOME =
  'The reserve-study pipeline this pattern comes from: 14 days of intake-to-report work compressed to 4 hours, at 94% extraction accuracy on handwritten forms.';

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

        <p className={styles.taskHeading}>Where the touch time actually goes</p>
        <div className={styles.taskList}>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Document intake</span>
            <span className={styles.taskAfter}>Every format and source pulled in and deduplicated automatically</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>AI + OCR reading</span>
            <span className={styles.taskAfter}>Reads scans, photos and handwriting — flags what it can&rsquo;t confirm, never guesses</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Classification</span>
            <span className={styles.taskAfter}>Sorted across legal, finance, compliance and tax automatically</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Private, cited index</span>
            <span className={styles.taskAfter}>Indexed inside your tenant — every answer traced to its source page</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Plain-language Q&amp;A</span>
            <span className={styles.taskAfter}>A question gets a cited answer in seconds, not a search through folders</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskStage}>Human review</span>
            <span className={styles.taskAfter}>A named reviewer confirms before anything is filed or sent</span>
          </div>
        </div>

        <HeroBar
          label="One real client result: reserve-study document turnaround"
          beforeValue={14 * 24}
          beforeLabel="14 days"
          afterValue={4}
          afterLabel="4 hours"
        />

        <p className={styles.assumption}>
          Uses the 40–60% handling-time reduction published on our document and finance automation pages — consistent
          with our first-hand client result above. Methodology below.
        </p>
      </div>

      <ComparisonPanel
        title="How document handling changes once every format is read automatically"
        beforeSteps={COMPARE_BEFORE}
        afterSteps={COMPARE_AFTER}
        outcome={COMPARE_OUTCOME}
        source="Synthesized from the Document Intelligence Engine's published pipeline."
      />

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
