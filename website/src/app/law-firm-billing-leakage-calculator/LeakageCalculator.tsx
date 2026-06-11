'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import CurrencyToggle from '../../components/calculators/CurrencyToggle';
import LeadBox from '../../components/calculators/LeadBox';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';
import { fmtMoney, fmtRate, resultBand, type Currency } from '../../components/calculators/format';

/**
 * Billing-leakage calculator (legal lead magnet). Results live and ungated.
 * Model (mirrored in the methodology section):
 *   potential = lawyers × rate × billableHours/day × 250 days
 *   leakage   = potential × 26%  (industry benchmark for manual billing failure)
 *   recovery  = leakage × 50%    (conservative capture assumption)
 */
const LEAKAGE = 0.26;
const RECOVERY = 0.5;
const WORK_DAYS = 250;
const SOURCE = 'billing-leakage-calculator';

const RATE_CONFIG: Record<Currency, { default: number; min: number; max: number; step: number }> = {
  USD: { default: 350, min: 100, max: 1500, step: 25 },
  INR: { default: 15000, min: 2000, max: 60000, step: 1000 },
};

export default function LeakageCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [lawyers, setLawyers] = useState(100);
  const [rate, setRate] = useState(RATE_CONFIG.USD.default);
  const [hours, setHours] = useState(6);
  const onEngage = useEngageOnce(SOURCE);

  function switchCurrency(c: Currency) {
    onEngage();
    setCurrency(c);
    setRate(RATE_CONFIG[c].default);
  }

  const potential = lawyers * rate * hours * WORK_DAYS;
  const leakage = potential * LEAKAGE;
  const recoverable = leakage * RECOVERY;
  const hoursLostPerWeek = hours * 5 * LEAKAGE;

  return (
    <div className={styles.calc}>
      {/* Inputs */}
      <div className={styles.inputs}>
        <CurrencyToggle currency={currency} onSwitch={switchCurrency} />
        <SliderField
          label="Fee-earning lawyers"
          displayValue={lawyers.toLocaleString('en-US')}
          value={lawyers} min={5} max={1000} step={5}
          ariaLabel="Number of fee-earning lawyers"
          onChange={setLawyers} onEngage={onEngage}
        />
        <SliderField
          label="Average billable rate"
          displayValue={fmtRate(rate, currency)}
          value={rate}
          min={RATE_CONFIG[currency].min} max={RATE_CONFIG[currency].max} step={RATE_CONFIG[currency].step}
          hint="Blended across partners, associates and fee-earning staff."
          ariaLabel="Average billable rate per hour"
          onChange={setRate} onEngage={onEngage}
        />
        <SliderField
          label="Billable hours per lawyer per day"
          displayValue={`${hours} h`}
          value={hours} min={3} max={10} step={0.5}
          ariaLabel="Billable hours per lawyer per day"
          onChange={setHours} onEngage={onEngage}
        />
      </div>

      {/* Results — live, ungated */}
      <div className={styles.results} aria-live="polite">
        <p className={styles.resultKicker}>Estimated revenue leaking annually</p>
        <div>
          <p className={styles.resultBig}>{fmtMoney(leakage, currency)}</p>
          <p className={styles.resultBigLabel}>
            of potential billings never reaching an invoice, across {lawyers.toLocaleString('en-US')} lawyers
          </p>
        </div>
        <div className={styles.subResults}>
          <div className={styles.subResult}>
            <p className={styles.subValue}>{fmtMoney(recoverable, currency)}</p>
            <p className={styles.subLabel}>conservatively recoverable per year (capturing half the leak)</p>
          </div>
          <div className={styles.subResult}>
            <p className={styles.subValue}>{hoursLostPerWeek.toLocaleString('en-US', { maximumFractionDigits: 1 })} h</p>
            <p className={styles.subLabel}>lost per lawyer, per week — work done but never logged</p>
          </div>
        </div>
        <p className={styles.assumption}>
          Assumes {WORK_DAYS} working days and the 26% leakage rate industry studies attribute to manual billing failure.
          Methodology below. Your firm&rsquo;s real number depends on practice mix — the audit maps it precisely.
        </p>
      </div>

      <LeadBox
        source={SOURCE}
        headline="Get this breakdown for your firm — plus the fix"
        sub="We’ll send your numbers with the full methodology, and the four workflows — billing capture first — that close the leak on the systems your firm already runs."
        successText="Done — the breakdown for your numbers and the four workflows that close the leak are on their way to your inbox. If you would rather see your real number than an estimate, the next step is a 30-minute audit."
        buildUsecase={() =>
          `Billing-leakage calculator: ${lawyers} lawyers · ${fmtRate(rate, currency)} · ${hours} billable h/day → ` +
          `est. leak ${fmtMoney(leakage, currency)}/yr (recoverable ~${fmtMoney(recoverable, currency)})`
        }
        buildMeta={() => ({
          calculator: SOURCE,
          currency,
          inputs: { lawyers, rate, hoursPerDay: hours },
          results: {
            leakage: Math.round(leakage),
            recoverable: Math.round(recoverable),
            leakageFmt: fmtMoney(leakage, currency),
            recoverableFmt: fmtMoney(recoverable, currency),
            hoursLostPerLawyerPerWeek: Number(hoursLostPerWeek.toFixed(1)),
          },
        })}
        resultBand={() => resultBand(leakage, currency)}
      />
    </div>
  );
}
