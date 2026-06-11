'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import CurrencyToggle from '../../components/calculators/CurrencyToggle';
import LeadBox from '../../components/calculators/LeadBox';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';
import { fmtAmount, fmtMoney, resultBand, type Currency } from '../../components/calculators/format';

/**
 * CPA tax-season capacity calculator. Model mirrors the worked example already
 * published on /ai-engines/cpa-tax-engine (600 returns · $700 → 180 added
 * returns · $126,000), so site math stays self-consistent:
 *   hoursFreed     = returns × prepHours × 40%   (published prep-time reduction)
 *   addedReturns   = returns × 30%               (conservative throughput gain)
 *   capacityRevenue = addedReturns × fee
 */
const PREP_REDUCTION = 0.4;
const THROUGHPUT_GAIN = 0.3;
const SOURCE = 'cpa-capacity-calculator';

const FEE_CONFIG: Record<Currency, { default: number; min: number; max: number; step: number }> = {
  USD: { default: 700, min: 200, max: 2500, step: 50 },
  INR: { default: 10000, min: 2000, max: 100000, step: 1000 },
};

export default function CapacityCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [preparers, setPreparers] = useState(10);
  const [returns, setReturns] = useState(600);
  const [prepHours, setPrepHours] = useState(4);
  const [fee, setFee] = useState(FEE_CONFIG.USD.default);
  const onEngage = useEngageOnce(SOURCE);

  function switchCurrency(c: Currency) {
    onEngage();
    setCurrency(c);
    setFee(FEE_CONFIG[c].default);
  }

  const hoursFreed = returns * prepHours * PREP_REDUCTION;
  const addedReturns = Math.round(returns * THROUGHPUT_GAIN);
  const capacityRevenue = addedReturns * fee;
  const returnsPerPreparer = addedReturns / preparers;

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
          hint="Intake, classification, data entry and population — before review."
          ariaLabel="Average preparation hours per return"
          onChange={setPrepHours} onEngage={onEngage}
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
            <p className={styles.subLabel}>of staff prep time freed per season at the published 40% reduction</p>
          </div>
          <div className={styles.subResult}>
            <p className={styles.subValue}>+{addedReturns.toLocaleString('en-US')}</p>
            <p className={styles.subLabel}>returns added at a conservative 30% throughput gain — the engine&rsquo;s benchmark is 3×</p>
          </div>
        </div>
        <p className={styles.assumption}>
          Uses the published benchmarks from our CPA &amp; Tax Engine: 40% less prep time per return and a 94% pre-fill
          rate, with throughput modelled at a conservative 30%. Methodology below — your firm&rsquo;s real number depends
          on return mix, and the audit maps it.
        </p>
      </div>

      <LeadBox
        source={SOURCE}
        headline="Get this breakdown for your firm — before next season"
        sub="We’ll send your numbers with the full methodology, plus how document intake, extraction and return pre-fill produce the 40% — on the tax software you already run."
        successText="Done — your capacity breakdown is on its way to your inbox. If you want the real number for your return mix instead of a benchmark, the next step is a 30-minute audit."
        buildUsecase={() =>
          `CPA capacity calculator: ${preparers} preparers · ${returns} returns/season · ${prepHours}h prep · ` +
          `${fmtAmount(fee, currency)}/return → +${addedReturns} returns, ${fmtMoney(capacityRevenue, currency)}/season capacity`
        }
        buildMeta={() => ({
          calculator: SOURCE,
          currency,
          inputs: { preparers, returnsPerSeason: returns, prepHoursPerReturn: prepHours, feePerReturn: fee },
          results: {
            capacityRevenue: Math.round(capacityRevenue),
            capacityRevenueFmt: fmtMoney(capacityRevenue, currency),
            addedReturns,
            hoursFreed: Math.round(hoursFreed),
          },
        })}
        resultBand={() => resultBand(capacityRevenue, currency)}
      />
    </div>
  );
}
