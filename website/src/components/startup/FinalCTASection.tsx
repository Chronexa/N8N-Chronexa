'use client';

import React from 'react';
import LeverageLineChart from './LeverageLineChart';

export default function FinalCTASection() {
  return (
    <section className="section-light reveal-ready">
      <div className="container" data-reveal style={{ maxWidth: '720px', marginInline: 'auto', textAlign: 'center' }}>

        {/* Chart motif — open upward line, bookending the story */}
        <div style={{ maxWidth: '400px', marginInline: 'auto', marginBottom: 'var(--spacing-lg)', opacity: 0.6 }}>
          <LeverageLineChart variant="cta" />
        </div>

        <h2 style={{ fontSize: 'var(--step-4)', marginBottom: 'var(--spacing-sm)', maxWidth: '20ch', marginInline: 'auto' }}>
          Cross the <span className="accent-phrase">Leverage Line.</span>
        </h2>

        <p style={{ fontSize: 'var(--step-0)', color: 'var(--text-muted-light)', maxWidth: '48ch', marginInline: 'auto', marginBottom: 'var(--spacing-lg)' }}>
          One 30-minute call. We run the diagnostic on your company, identify the highest-leverage bottleneck, and tell you honestly whether a system is the right intervention.
        </p>

        <a
          href="https://calendly.com/ankit-chronexa/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ fontSize: 'var(--step-0)' }}
        >
          Book your discovery call <span aria-hidden="true">→</span>
        </a>

        <p style={{ marginTop: 'var(--spacing-md)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted-light)', letterSpacing: '0.05em' }}>
          30 minutes · Fixed-price scopes · You own everything we build
        </p>
      </div>
    </section>
  );
}
