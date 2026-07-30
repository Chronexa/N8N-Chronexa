'use client';

import { useState, type FormEvent } from 'react';
import styles from './HeroLeadForm.module.css';
import { openBooking, trackBookCta } from '../../lib/cal';
import { track, identifyByEmail } from '../../lib/analytics';
import { site } from '../../lib/site';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const SOURCE = 'startup-hero-form';

const COMPANY_SIZE_OPTIONS = [
  { value: '1-20', label: '1–20 employees' },
  { value: '21-50', label: '21–50 employees' },
  { value: '51-100', label: '51–100 employees' },
  { value: '101-150', label: '101–150 employees' },
  { value: '150+', label: '150+ employees' },
];

/**
 * Hero lead-capture form — additive, not a funnel gate. Every other CTA on
 * this page still links straight to the calendar via BookButton; this is the
 * richer top-of-funnel path for visitors who'd rather leave their details
 * than book blind. On success, hands off to the same `openBooking()` every
 * other CTA uses (new tab, prefilled), so the visitor never retypes their
 * name/email on Calendly.
 */
export default function HeroLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const companySize = String(fd.get('companySize') || '').trim();
    const comments = String(fd.get('comments') || '').trim();

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !company || !companySize) {
      setStatus('error');
      setError('Please fill in your name, business email, company, and company size.');
      return;
    }

    setStatus('submitting');
    identifyByEmail(email);
    track('startup_lead_submit', { source: SOURCE });

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company, companySize, comments, source: SOURCE }),
    })
      .then((r) => {
        if (r.ok) {
          setStatus('success');
          track('startup_lead_success', { source: SOURCE });
          trackBookCta(SOURCE);
          setTimeout(() => openBooking({ name, email, notes: comments }), 600);
        } else {
          setStatus('error');
          setError('Something went wrong — please try again.');
          track('startup_lead_error', { source: SOURCE });
        }
      })
      .catch(() => {
        setStatus('error');
        setError('Something went wrong — please try again.');
        track('startup_lead_error', { source: SOURCE });
      });
  }

  if (status === 'success') {
    return (
      <div className={styles.form}>
        <p className={styles.successText}>Thanks — opening the calendar in a new tab…</p>
        <a href={site.booking} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>
          If it didn&apos;t open, book directly here →
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <p className={styles.label}>Prefer to skip ahead? Tell us about your team.</p>
      <div className={styles.row}>
        <input className={styles.input} name="name" placeholder="Name" autoComplete="name" required />
        <input className={styles.input} name="email" type="email" placeholder="Business email" autoComplete="email" required />
      </div>
      <div className={styles.row}>
        <input className={styles.input} name="company" placeholder="Company name" autoComplete="organization" required />
        <select className={styles.select} name="companySize" defaultValue="" aria-label="Company size" required>
          <option value="" disabled>Company size</option>
          {COMPANY_SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <textarea
        className={styles.textarea}
        name="comments"
        placeholder="Anything specific you want us to know? (optional)"
        rows={3}
      />
      <button className={`btn-primary ${styles.submitBtn}`} type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Get started — book a call'}
      </button>
      {status === 'error' && <p className={styles.errorText}>{error}</p>}
    </form>
  );
}
