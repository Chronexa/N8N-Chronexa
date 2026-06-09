'use client';

import { useRef, useState, type FormEvent } from 'react';
import styles from './LeadForm.module.css';
import { openBooking, trackBookCta } from '../lib/cal';
import { track, identifyByEmail } from '../lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadForm({ source = 'website', compact = false }: { source?: string; compact?: boolean }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const startedRef = useRef(false);

  // Fire once when the visitor first engages the form — the top of the form funnel.
  function onFirstInteract() {
    if (startedRef.current) return;
    startedRef.current = true;
    track('lead_form_start', { source });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
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
    identifyByEmail(email); // stitch this device to the email → merges with the Cal booking event
    track('lead_form_submit', { source });
    trackBookCta(`form:${source}`);

    // Best-effort lead record (non-blocking). Captures the moment CONTACT_WEBHOOK_URL
    // is set; either way the visitor is handed straight to booking below.
    const notes = [company && `Company: ${company}`, usecase && `Wants to automate: ${usecase}`]
      .filter(Boolean)
      .join(' · ');
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company, usecase, source }),
    }).catch(() => {});

    // Hand off to Cal.com, prefilled, so booking is one step.
    openBooking({ name, email, notes: notes || usecase });
    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <strong>Opening your booking…</strong>
        <p>
          Pick a time and we&apos;ll come prepped on your workflows. Didn&apos;t see it?{' '}
          <a href="https://cal.com/chronexa/30min" target="_blank" rel="noopener noreferrer" className={styles.successLink}>
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
        <label htmlFor={`${source}-usecase`}>What do you want to automate?</label>
        {compact ? (
          <input id={`${source}-usecase`} name="usecase" type="text" placeholder="e.g. CRM enrichment, claims triage" />
        ) : (
          <textarea id={`${source}-usecase`} name="usecase" rows={4} placeholder="e.g. automate our claims triage / CRM enrichment" />
        )}
      </div>
      <button type="submit" className={`btn-primary ${styles.btn}`} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Opening booking…' : <>Book my free audit <span aria-hidden="true">→</span></>}
      </button>
      {status === 'error' && <p className={styles.error} role="alert">{error}</p>}
      <p className={styles.note}>Free 30-min call. No spam, no sales pitch — just actionable insights.</p>
    </form>
  );
}
