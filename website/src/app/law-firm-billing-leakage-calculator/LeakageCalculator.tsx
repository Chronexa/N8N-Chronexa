'use client';

import { useRef, useState, type FormEvent } from 'react';
import styles from './calculator.module.css';
import BookButton from '../../components/BookButton';
import { track, identifyByEmail } from '../../lib/analytics';

/**
 * Interactive billing-leakage calculator (the legal lead magnet).
 * Results are live and ungated; the email capture below the result sends the
 * visitor's own numbers into /api/contact so the lead arrives pre-qualified.
 *
 * Model (kept deliberately transparent — mirrored in the methodology section):
 *   potential = lawyers × rate × billableHours/day × 250 days
 *   leakage   = potential × 26%  (industry benchmark for manual billing failure)
 *   recovery  = leakage × 50%    (conservative capture assumption)
 */
const LEAKAGE = 0.26;
const RECOVERY = 0.5;
const WORK_DAYS = 250;
const SOURCE = 'billing-leakage-calculator';

type Currency = 'USD' | 'INR';

const RATE_CONFIG: Record<Currency, { default: number; min: number; max: number; step: number }> = {
  USD: { default: 350, min: 100, max: 1500, step: 25 },
  INR: { default: 15000, min: 2000, max: 60000, step: 1000 },
};

function fmtMoney(v: number, c: Currency): string {
  if (c === 'INR') {
    if (v >= 1e7) return `₹${(v / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
    if (v >= 1e5) return `₹${(v / 1e5).toLocaleString('en-IN', { maximumFractionDigits: 1 })} L`;
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  }
  if (v >= 1e6) return `$${(v / 1e6).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;
  if (v >= 1e3) return `$${Math.round(v / 1e3).toLocaleString('en-US')}k`;
  return `$${Math.round(v)}`;
}

function fmtRate(v: number, c: Currency): string {
  return c === 'INR' ? `₹${v.toLocaleString('en-IN')}/hr` : `$${v.toLocaleString('en-US')}/hr`;
}

type LeadStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function LeakageCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [lawyers, setLawyers] = useState(100);
  const [rate, setRate] = useState(RATE_CONFIG.USD.default);
  const [hours, setHours] = useState(6);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('idle');
  const [leadError, setLeadError] = useState('');
  const engagedRef = useRef(false);

  // Top of the calculator funnel — fire once on first slider/toggle touch.
  function onEngage() {
    if (engagedRef.current) return;
    engagedRef.current = true;
    track('calculator_engage', { source: SOURCE });
  }

  function switchCurrency(c: Currency) {
    onEngage();
    setCurrency(c);
    setRate(RATE_CONFIG[c].default);
  }

  const potential = lawyers * rate * hours * WORK_DAYS;
  const leakage = potential * LEAKAGE;
  const recoverable = leakage * RECOVERY;
  const hoursLostPerWeek = hours * 5 * LEAKAGE;

  function onLeadSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLeadError('');
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setLeadStatus('error');
      setLeadError('Please enter your name and a valid work email.');
      return;
    }

    setLeadStatus('submitting');
    identifyByEmail(email);
    track('calculator_lead_submit', { source: SOURCE, lawyers, currency });

    const usecase =
      `Billing-leakage calculator: ${lawyers} lawyers · ${fmtRate(rate, currency)} · ${hours} billable h/day → ` +
      `est. leak ${fmtMoney(leakage, currency)}/yr (recoverable ~${fmtMoney(recoverable, currency)})`;

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, usecase, source: SOURCE }),
    })
      .then((r) => setLeadStatus(r.ok ? 'success' : 'error'))
      .catch(() => setLeadStatus('error'));
  }

  return (
    <div className={styles.calc}>
      {/* Inputs */}
      <div className={styles.inputs}>
        <div className={styles.currencyRow} role="group" aria-label="Currency">
          <button type="button" className={styles.currencyBtn} data-active={currency === 'USD'} onClick={() => switchCurrency('USD')}>
            $ USD
          </button>
          <button type="button" className={styles.currencyBtn} data-active={currency === 'INR'} onClick={() => switchCurrency('INR')}>
            ₹ INR
          </button>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldTop}>
            <span className={styles.fieldLabel}>Fee-earning lawyers</span>
            <span className={styles.fieldValue}>{lawyers.toLocaleString('en-US')}</span>
          </span>
          <input
            type="range" min={5} max={1000} step={5} value={lawyers} className={styles.range}
            aria-label="Number of fee-earning lawyers"
            onInput={onEngage}
            onChange={(e) => setLawyers(Number(e.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldTop}>
            <span className={styles.fieldLabel}>Average billable rate</span>
            <span className={styles.fieldValue}>{fmtRate(rate, currency)}</span>
          </span>
          <input
            type="range"
            min={RATE_CONFIG[currency].min} max={RATE_CONFIG[currency].max} step={RATE_CONFIG[currency].step}
            value={rate} className={styles.range}
            aria-label="Average billable rate per hour"
            onInput={onEngage}
            onChange={(e) => setRate(Number(e.target.value))}
          />
          <span className={styles.fieldHint}>Blended across partners, associates and fee-earning staff.</span>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldTop}>
            <span className={styles.fieldLabel}>Billable hours per lawyer per day</span>
            <span className={styles.fieldValue}>{hours} h</span>
          </span>
          <input
            type="range" min={3} max={10} step={0.5} value={hours} className={styles.range}
            aria-label="Billable hours per lawyer per day"
            onInput={onEngage}
            onChange={(e) => setHours(Number(e.target.value))}
          />
        </label>
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

      {/* Lead capture */}
      <div className={styles.leadBox}>
        {leadStatus === 'success' ? (
          <div className={styles.leadSuccess}>
            <p className={styles.leadSuccessText}>
              Done — the breakdown for your numbers and the four workflows that close the leak are on their way to
              your inbox. If you would rather see your real number than an estimate, the next step is a 30-minute audit.
            </p>
            <BookButton className="btn-primary" location="calculator-success">
              Book a Free Audit
            </BookButton>
          </div>
        ) : (
          <>
            <p className={styles.leadHead}>Get this breakdown for your firm — plus the fix</p>
            <p className={styles.leadSub}>
              We&rsquo;ll send your numbers with the full methodology, and the four workflows — billing capture first —
              that close the leak on the systems your firm already runs.
            </p>
            <form className={styles.leadForm} onSubmit={onLeadSubmit}>
              <input className={styles.leadInput} name="name" placeholder="Your name" autoComplete="name" />
              <input className={styles.leadInput} name="email" type="email" placeholder="Work email" autoComplete="email" />
              <button className={`btn-primary ${styles.leadBtn}`} type="submit" disabled={leadStatus === 'submitting'}>
                {leadStatus === 'submitting' ? 'Sending…' : 'Email me the breakdown'}
              </button>
            </form>
            {leadStatus === 'error' && (
              <p className={styles.leadError}>{leadError || 'Something went wrong — please try again.'}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
