'use client';

import React from 'react';

const outcomes = [
  {
    title: 'Revenue & Growth',
    felt: 'Content and outbound volume scales without proportional marketing headcount.',
    mechanism: 'AI research and personalization engines handle the repeatable 80% of prospecting and content creation.',
  },
  {
    title: 'Runway & Burn',
    felt: 'Fewer hires needed to hit the same growth targets, extending runway on the same raise.',
    mechanism: 'Each system absorbs a function\'s repeatable work at zero marginal cost per additional unit.',
  },
  {
    title: 'Execution Speed',
    felt: 'Decisions and reports land same-day instead of end-of-week.',
    mechanism: 'Closed-loop analytics push live intelligence to founders via Slack, not Friday spreadsheets.',
  },
  {
    title: 'Hiring Discipline',
    felt: 'Every new hire is for judgment or relationship work, never backlog-clearing.',
    mechanism: 'Repeatable operations are absorbed before the hire requisition is even written.',
  },
  {
    title: 'Customer Experience at Scale',
    felt: 'Support and onboarding quality doesn\'t degrade as volume grows.',
    mechanism: 'AI triage and grounded-answer drafting handles the first 60% of customer interactions instantly.',
  },
];

export default function LifeAboveLine() {
  return (
    <section className="section-light reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">Future Vision</p>
        <h2 className="sectionHead" style={{ maxWidth: '24ch' }}>Life above the Leverage Line</h2>
        <p style={{ fontSize: 'var(--step-1)', color: 'var(--text-muted-light)', maxWidth: '56ch', marginBottom: 'var(--spacing-xl)', lineHeight: 'var(--leading-snug)' }}>
          What your company looks like when output compounds faster than headcount — in the language you actually think in, not in the language of an AI vendor.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-md)' }}>
          {outcomes.map((item, idx) => (
            <div key={idx} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <h3 style={{ fontSize: 'var(--step-0)', color: 'var(--text-light)', fontFamily: 'var(--font-sans)', fontWeight: 600, margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: 'var(--step--1)', color: 'var(--text-light)', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
                {item.felt}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted-light)', margin: 0, lineHeight: 1.4, paddingTop: '0.4rem', borderTop: '1px solid var(--border-light)' }}>
                {item.mechanism}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <a
            href="https://calendly.com/ankit-chronexa/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            See what this looks like at your stage <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
