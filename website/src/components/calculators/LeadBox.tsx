'use client';

import { useState, type FormEvent } from 'react';
import styles from './calculators.module.css';
import BookButton from '../BookButton';
import { track, identifyByEmail } from '../../lib/analytics';

type LeadStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Shared calculator lead capture. Owns the submit state machine, analytics
 * events and the /api/contact POST. The parent supplies the human-readable
 * `usecase` string (lands in Baserow/Sheets) and the structured `meta`
 * (forwarded to the n8n breakdown-email webhook only).
 */
export default function LeadBox({
  source,
  headline,
  sub,
  successText,
  buildUsecase,
  buildMeta,
  resultBand,
}: {
  source: string;
  headline: string;
  sub: string;
  successText: string;
  buildUsecase: () => string;
  buildMeta: () => Record<string, unknown>;
  resultBand: () => string;
}) {
  const [status, setStatus] = useState<LeadStatus>('idle');
  const [error, setError] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('error');
      setError('Please enter your name and a valid work email.');
      return;
    }

    setStatus('submitting');
    identifyByEmail(email);
    track('calculator_lead_submit', { source, result_band: resultBand() });

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, usecase: buildUsecase(), source, meta: buildMeta() }),
    })
      .then((r) => {
        setStatus(r.ok ? 'success' : 'error');
        track(r.ok ? 'calculator_lead_success' : 'calculator_lead_error', { source });
      })
      .catch(() => {
        setStatus('error');
        track('calculator_lead_error', { source });
      });
  }

  return (
    <div className={styles.leadBox}>
      {status === 'success' ? (
        <div className={styles.leadSuccess}>
          <p className={styles.leadSuccessText}>{successText}</p>
          <BookButton className="btn-primary" location={`${source}-success`}>
            Book a Free Audit
          </BookButton>
        </div>
      ) : (
        <>
          <p className={styles.leadHead}>{headline}</p>
          <p className={styles.leadSub}>{sub}</p>
          <form className={styles.leadForm} onSubmit={onSubmit}>
            <input className={styles.leadInput} name="name" placeholder="Your name" autoComplete="name" />
            <input className={styles.leadInput} name="email" type="email" placeholder="Work email" autoComplete="email" />
            <button className={`btn-primary ${styles.leadBtn}`} type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Email me the breakdown'}
            </button>
          </form>
          {status === 'error' && (
            <p className={styles.leadError}>{error || 'Something went wrong — please try again.'}</p>
          )}
        </>
      )}
    </div>
  );
}
