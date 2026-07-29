'use client';

import React from 'react';

export default function MethodSection() {
  return (
    <section className="section-muted reveal-ready">
      <div className="container" data-reveal style={{ maxWidth: '860px', marginInline: 'auto' }}>
        <p className="eyebrow">Methodology</p>
        <h2 className="sectionHead" style={{ maxWidth: '26ch' }}>How Chronexa moves a company above the Line</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
            <span className="display-num" style={{ fontSize: 'var(--step-3)', flexShrink: 0 }}>01</span>
            <div>
              <h3 style={{ fontSize: 'var(--step-1)', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Diagnose the highest-leverage bottleneck</h3>
              <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step-0)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
                We use this same framework — the Leverage Line — to find the single function in your company where converting repeatable work into a system would produce the largest ratio shift. Not a generic audit. A specific, measurable answer to "where should the first system go?"
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
            <span className="display-num" style={{ fontSize: 'var(--step-3)', flexShrink: 0 }}>02</span>
            <div>
              <h3 style={{ fontSize: 'var(--step-1)', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Build inside your stack, not around it</h3>
              <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step-0)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
                Fixed-price. Integrated directly into the tools your team already runs — HubSpot, Slack, Notion, Intercom, WhatsApp. No new software logins to learn. No platform migration. No per-seat SaaS tax that scales against you. You own the system outright.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
            <span className="display-num" style={{ fontSize: 'var(--step-3)', flexShrink: 0, color: 'var(--brand-green-ink)' }}>03</span>
            <div>
              <h3 style={{ fontSize: 'var(--step-1)', color: 'var(--brand-green-ink)', marginBottom: '0.5rem' }}>Compound</h3>
              <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step-0)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
                Each system makes the next one cheaper and faster to build, because the stack is already wired for it. This is the genuinely ownable insight: <strong style={{ color: 'var(--text-light)' }}>systems compound, headcount doesn't.</strong> The first build is the hardest. Every build after that leverages the infrastructure of the one before it.
              </p>
            </div>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <a
            href="https://calendly.com/ankit-chronexa/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Book your systems audit <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
