'use client';

import { useRef, useState, type FormEvent } from 'react';
import styles from './SampleRequestForm.module.css';
import { track, identifyByEmail } from '../lib/analytics';

/**
 * The document-pipeline CTA.
 *
 * Deliberately NOT the standard LeadForm. LeadForm's job is to hand the visitor
 * to Cal.com, which is the highest-commitment ask we have and the reason the
 * site has captured nine submissions in its lifetime (five of them our own
 * tests). This form asks for something a stranger will actually do: send us a
 * few documents and let the output do the selling. The call comes after they
 * have seen their own data come out the other side.
 *
 * It also qualifies while it converts — anyone who states a document type and a
 * monthly volume has the problem, has recurring pain, and has the authority to
 * share files.
 */

type Status = 'idle' | 'submitting' | 'success' | 'error';

const MAILTO = 'team@chronexa.io';

export default function SampleRequestForm({ source = 'document-pipeline' }: { source?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const startedRef = useRef(false);

  function onFirstInteract() {
    if (startedRef.current) return;
    startedRef.current = true;
    track('sample_request_start', { source });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const mail = String(fd.get('email') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const docType = String(fd.get('docType') || '').trim();
    const volume = String(fd.get('volume') || '').trim();
    const destination = String(fd.get('destination') || '').trim();

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
      setStatus('error');
      setError('Please enter your name and a valid work email.');
      return;
    }

    setStatus('submitting');
    setEmail(mail);
    identifyByEmail(mail);
    track('sample_request_submit', { source, docType, volume });

    const usecase = [
      docType && `Document type: ${docType}`,
      volume && `Volume/month: ${volume}`,
      destination && `Destination system: ${destination}`,
    ].filter(Boolean).join(' | ');

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: mail, company, usecase, source }),
      });
    } catch {
      // The lead record is best-effort; never block the visitor on it. The next
      // screen tells them to email us directly, which is the real handoff.
    }
    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <strong>One more step — and it&apos;s the important one.</strong>
        <p>
          Reply to this address with 5–10 sample documents:{' '}
          <a href={`mailto:${MAILTO}?subject=Sample%20documents%20-%20${encodeURIComponent(company(email))}`} className={styles.mail}>
            {MAILTO}
          </a>
        </p>
        <p className={styles.fine}>
          Redacted is completely fine — we only need the layout and the fields, not your real numbers.
          You&apos;ll get the extracted output back within two working days, along with an honest read on
          where it struggles. If it isn&apos;t worth building, we&apos;ll tell you that.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} onFocusCapture={onFirstInteract} noValidate>
      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="sr-name">Name</label>
          <input id="sr-name" name="name" type="text" autoComplete="name" placeholder="Jane Smith" required />
        </div>
        <div className={styles.group}>
          <label htmlFor="sr-email">Work email</label>
          <input id="sr-email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" required />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="sr-company">Company</label>
          <input id="sr-company" name="company" type="text" autoComplete="organization" placeholder="Acme Inc" />
        </div>
        <div className={styles.group}>
          <label htmlFor="sr-docType">What document?</label>
          <input id="sr-docType" name="docType" type="text" placeholder="Vendor invoices" />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="sr-volume">Roughly how many a month?</label>
          <input id="sr-volume" name="volume" type="text" inputMode="numeric" placeholder="400" />
        </div>
        <div className={styles.group}>
          <label htmlFor="sr-destination">Where does the data need to go?</label>
          <input id="sr-destination" name="destination" type="text" placeholder="QuickBooks" />
        </div>
      </div>

      {status === 'error' && <p className={styles.error} role="alert">{error}</p>}

      <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send my documents'}
      </button>
      <p className={styles.fine}>
        No call required. We look at your documents first and tell you whether this is worth doing.
      </p>
    </form>
  );
}

/** Best-effort company slug for the mailto subject line. */
function company(email: string) {
  const domain = email.split('@')[1] || '';
  return domain.split('.')[0] || 'documents';
}
