'use client';

import React from 'react';
import layouts from './startup-layouts.module.css';

export default function TheShift() {
  const comparisons = [
    {
      outcome: 'Hiring Plan',
      traditional: 'Every function that hits capacity gets a new hire. Payroll grows in lockstep with demand.',
      aiFirst: 'Every function that hits capacity gets a system first. New hires are reserved for judgment and relationship work only.',
    },
    {
      outcome: 'Execution Speed',
      traditional: 'New initiatives take weeks to ramp because they depend on people learning new domains.',
      aiFirst: 'Repeatable execution launches in days. The system absorbs the first 70% and a human steers the last 30%.',
    },
    {
      outcome: 'Runway Efficiency',
      traditional: 'Fixed monthly burn rises with every new role. One bad quarter threatens the next raise.',
      aiFirst: 'Marginal cost of each additional transaction or lead approaches zero. Runway extends on the same raise.',
    },
    {
      outcome: 'Decision Speed',
      traditional: 'Founders wait until Friday for manually compiled reports. Decisions are made on stale data.',
      aiFirst: 'Leadership gets same-day automated intelligence. Decisions are made on live data, not last week\'s spreadsheet.',
    },
    {
      outcome: 'Customer Experience at Scale',
      traditional: 'Quality degrades as volume grows. Support tickets pile up. Response times stretch.',
      aiFirst: 'Quality holds at scale. AI triage handles the repeatable share. Humans handle the cases that need a human.',
    },
  ];

  return (
    <section className="section-muted reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Shift</p>
        <h2 className="sectionHead" style={{ maxWidth: '24ch' }}>Two ways to scale. One of them works.</h2>
        <p style={{ fontSize: 'var(--step-1)', color: 'var(--text-muted-light)', maxWidth: '56ch', marginBottom: 'var(--spacing-xl)', lineHeight: 'var(--leading-snug)' }}>
          Traditional startups scale by adding headcount to every function that hits capacity. AI-first startups scale by building a system once that absorbs the repeatable share of that function's work.
        </p>

        {/* Comparison table — outcome-organized, not department-organized */}
        <div className="panel" style={{ overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-sunken)' }}>
            <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted-light)' }}>Outcome</div>
            <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-amber)' }}>Scales Headcount</div>
            <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-green-ink)' }}>Scales Systems</div>
          </div>

          {/* Rows */}
          {comparisons.map((row, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: idx < comparisons.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 600, fontSize: 'var(--step--1)', color: 'var(--text-light)', background: 'var(--bg-sunken)' }}>{row.outcome}</div>
              <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: 'var(--step--1)', color: 'var(--text-muted-light)' }}>{row.traditional}</div>
              <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: 'var(--step--1)', color: 'var(--text-muted-light)', background: 'var(--brand-green-soft)' }}>{row.aiFirst}</div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 'var(--spacing-lg)', fontStyle: 'italic', color: 'var(--text-light)', fontFamily: 'var(--font-display)', fontVariationSettings: '"WONK" 1, "SOFT" 8', fontSize: 'var(--step-0)' }}>
          Crossing the Leverage Line is the moment output growth decouples from headcount growth. That decoupling is engineered, not lucky.
        </p>
      </div>
    </section>
  );
}
