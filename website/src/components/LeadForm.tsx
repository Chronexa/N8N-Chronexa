'use client';
import { contactRequest } from '../lib/contact-request';

import { useRef, useState, type FormEvent } from 'react';
import styles from './LeadForm.module.css';
import { bookingUrl, trackBookCta } from '../lib/cal';
import { track, identifyByEmail } from '../lib/analytics';
import { site } from '../lib/site';
import { captureAttribution } from '../lib/attribution';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadForm({ source = 'website', compact = false, submitLabel = 'Book my free audit', note = 'Free 30-min call. No spam, no sales pitch — just actionable insights.', fieldLabel = 'What do you want to automate?', fieldPlaceholder = 'e.g. CRM enrichment, claims triage', fieldNote = 'Wants to automate' }: { source?: string; compact?: boolean; submitLabel?: string; note?: string; fieldLabel?: string; fieldPlaceholder?: string; fieldNote?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [calendar, setCalendar] = useState<string>(site.booking);
  const startedRef = useRef(false);

  // Fire once when the visitor first engages the form — the top of the form funnel.
  function onFirstInteract() {
    if (startedRef.current) return;
    startedRef.current = true;
    track('lead_form_start', { source });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const usecase = String(fd.get('usecase') || '').trim();

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('error');
      setError('Please enter your name and a valid work email.');
      return;
    }

    setStatus('submitting');
    track('lead_form_attempt', { source });
    try {
      const response = await contactRequest({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, usecase, source, page: window.location.pathname, attribution: captureAttribution() }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('We couldn’t save your details. Please try again or email us.');
      identifyByEmail(email);
      track('lead_form_submit', { source, lead_id: result.leadId });
      const notes = [company && `Company: ${company}`, usecase && `${fieldNote}: ${usecase}`].filter(Boolean).join(' · ');
      setCalendar(bookingUrl({ name, email, notes }));
      setStatus('success');
    } catch {
      setStatus('error');
      setError('We couldn’t save your details. Please try again, or email info@chronexa.io.');
      track('lead_form_error', { source });
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <strong>Your details are saved. Choose a time.</strong>
        <p>
          Your consultation is booked only after you select and confirm a time.{' '}
          <a href={calendar} onClick={() => trackBookCta(`form:${source}`)} className={styles.successLink}>
            Open the calendar
          </a>.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} onFocusCapture={onFirstInteract} noValidate>
      <div className={styles.group}>
        <label htmlFor={`${source}-name`}>Name</label>
        <input id={`${source}-name`} name="name" type="text" placeholder="Jane Smith" autoComplete="name" required />
      </div>
      <div className={styles.group}>
        <label htmlFor={`${source}-email`}>Work email</label>
        <input id={`${source}-email`} name="email" type="email" placeholder="jane@company.com" autoComplete="email" required />
      </div>
      {!compact && (
        <div className={styles.group}>
          <label htmlFor={`${source}-company`}>Company</label>
          <input id={`${source}-company`} name="company" type="text" placeholder="Company name" autoComplete="organization" />
        </div>
      )}
      <div className={styles.group}>
        <label htmlFor={`${source}-usecase`}>{fieldLabel}</label>
        {compact ? (
          <input id={`${source}-usecase`} name="usecase" type="text" placeholder={fieldPlaceholder} />
        ) : (
          <textarea id={`${source}-usecase`} name="usecase" rows={4} placeholder={fieldPlaceholder} />
        )}
      </div>
      <button type="submit" className={`btn-primary ${styles.btn}`} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Saving your details…' : (
          <>
            {submitLabel}{' '}
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor"
              strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h11M11 6l4 4-4 4" />
            </svg>
          </>
        )}
      </button>
      {status === 'error' && <p className={styles.error} role="alert">{error}</p>}
      <p className={styles.note}>{note}</p>
    </form>
  );
}
