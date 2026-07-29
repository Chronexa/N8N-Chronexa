'use client';

import React from 'react';

export default function ImplementationRoadmap() {
  const steps = [
    {
      num: '01',
      title: 'Discovery Call',
      text: 'A focused 30-minute session to run the Leverage Line diagnostic on your company, identify the highest-leverage bottleneck, and determine if a system is the right intervention.',
    },
    {
      num: '02',
      title: 'Scoped Proposal',
      text: 'We map the data flow into your existing stack and deliver a fixed-price proposal with clear, agreed ROI metrics before writing a single line of code. No hourly billing. No surprise invoices.',
    },
    {
      num: '03',
      title: 'Build & Integrate',
      text: 'Your first system goes live inside your stack within 2 to 4 weeks — directly integrated into HubSpot, Slack, Notion, or whatever your team already runs. Zero new software logins.',
    },
    {
      num: '04',
      title: 'Tune & Handoff',
      text: 'Two weeks of live usage tuning to ensure accuracy on real data. Then complete handoff of system assets you own 100% outright, with documentation and optional ongoing retainer.',
    },
  ];

  return (
    <section className="section-light reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Build</p>
        <h2 className="sectionHead" style={{ maxWidth: '26ch' }}>What actually happens if you say yes</h2>
        <p style={{ fontSize: 'var(--step-1)', color: 'var(--text-muted-light)', maxWidth: '56ch', marginBottom: 'var(--spacing-xl)', lineHeight: 'var(--leading-snug)' }}>
          From bottleneck diagnosis to live deployment in weeks — transparent, fixed-price, and time-boxed so you can evaluate with zero long-term risk.
        </p>

        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--spacing-md)' }}>
          {steps.map((step, idx) => (
            <li key={idx} style={{ paddingTop: 'var(--spacing-sm)', borderTop: '2px solid var(--border-light-strong)' }}>
              <span className="display-num" style={{ display: 'block', fontSize: 'var(--step-2)', fontWeight: 700, marginBottom: '0.4rem' }}>{step.num}</span>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-light)', fontSize: 'var(--step-0)' }}>{step.title}</strong>
              <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step--1)', margin: 0, lineHeight: 1.5 }}>{step.text}</p>
            </li>
          ))}
        </ol>

        <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-md)', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', maxWidth: '640px' }}>
          <h3 style={{ fontSize: 'var(--step-0)', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Pricing</h3>
          <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step--1)', margin: 0, lineHeight: 1.5 }}>
            Transparent, fixed-price project scopes based on the specific bottleneck being solved. Discovery call → scoped proposal → agreed price before any work begins. No surprise hourly billing, no hidden recurring SaaS seat fees, no lock-in.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <a
            href="https://calendly.com/ankit-chronexa/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Book your discovery call <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
