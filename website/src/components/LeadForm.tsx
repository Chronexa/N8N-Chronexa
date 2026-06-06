'use client';

import { useState, type FormEvent } from 'react';
import styles from './LeadForm.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadForm({ source = 'website', compact = false }: { source?: string; compact?: boolean }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      company: fd.get('company'),
      usecase: fd.get('usecase'),
      source,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Something went wrong.');
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <strong>Thanks — we&apos;ve got it.</strong>
        <p>We&apos;ll review your workflows and get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
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
        {status === 'submitting' ? 'Sending…' : <>Get My Free Audit <span aria-hidden="true">→</span></>}
      </button>
      {status === 'error' && <p className={styles.error} role="alert">{error}</p>}
      <p className={styles.note}>No spam. No sales pitch. Just actionable insights.</p>
    </form>
  );
}
