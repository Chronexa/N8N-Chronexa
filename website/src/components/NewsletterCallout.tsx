'use client';

import { useState, type FormEvent } from 'react';
import styles from './NewsletterCallout.module.css';
import { track, identifyByEmail } from '../lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** End-of-article newsletter signup. Reuses the same lead-capture endpoint as
 * the main contact form (tagged source: newsletter), rather than a separate
 * unbuilt subscription system. */
export default function NewsletterCallout() {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    identifyByEmail(value);
    track('lead_form_submit', { source: 'newsletter' });
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Newsletter Subscriber', email: value, source: 'newsletter' }),
    })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }

  if (status === 'success') {
    return (
      <div className={styles.wrap}>
        <p className={styles.thanks}>You're on the list — we'll send new posts as they publish, nothing else.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.title}>Get new articles when they publish</p>
      <p className={styles.sub}>One email per post. No pitch, no spam.</p>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="you@firm.com"
          className={styles.input}
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          required
        />
        <button type="submit" className={styles.button} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className={styles.errorMsg}>Please enter a valid email.</p>}
    </div>
  );
}
