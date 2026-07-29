'use client';

import React from 'react';

export default function EvidenceSection() {
  return (
    <section className="section-muted reveal-ready">
      <div className="container" data-reveal style={{ maxWidth: '860px', marginInline: 'auto' }}>
        <p className="eyebrow">The Evidence</p>
        <h2 className="sectionHead" style={{ maxWidth: '24ch' }}>Proof, honestly</h2>

        {/* Sourced Industry Benchmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: 'var(--step--1)', fontWeight: 700, color: 'var(--text-light)' }}>McKinsey Global Institute</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted-light)', fontStyle: 'italic' }}>Industry research, not Chronexa data</span>
            </div>
            <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step--1)', margin: 0 }}>
              60–70% of employee work hours in routine operational roles are automatable with current AI and workflow technology. This is the structural basis for the Headcount Tax calculation in the diagnostic above.
            </p>
          </div>

          <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: 'var(--step--1)', fontWeight: 700, color: 'var(--text-light)' }}>Zapier State of Business Automation</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted-light)', fontStyle: 'italic' }}>Industry research, not Chronexa data</span>
            </div>
            <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step--1)', margin: 0 }}>
              94% of knowledge workers perform repetitive, time-consuming tasks that workflow automation can absorb. Teams with automation in place save an average of 10+ hours per person per week.
            </p>
          </div>
        </div>

        {/* Founding Cohort Statement */}
        <div style={{ padding: 'var(--spacing-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: 'var(--step-1)', color: 'var(--text-light)', marginBottom: 'var(--spacing-sm)' }}>A note on case studies</h3>
          <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step-0)', lineHeight: 'var(--leading-normal)', marginBottom: 'var(--spacing-sm)' }}>
            This is a new vertical for Chronexa. We are not going to invent client logos or fabricate success metrics to fill a trust-badge strip.
          </p>
          <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step-0)', lineHeight: 'var(--leading-normal)', marginBottom: 'var(--spacing-sm)' }}>
            What we will tell you honestly: Chronexa has built production AI systems for enterprise clients across legal, financial services, and CPA verticals — real, deployed, maintained infrastructure, not slide-deck strategy. This startup vertical applies the same engineering standard to a different problem set: the growth-stage operating model.
          </p>
          <p style={{ color: 'var(--text-light)', fontSize: 'var(--step-0)', lineHeight: 'var(--leading-normal)', fontWeight: 500, margin: 0 }}>
            For an early customer, that honesty is a feature, not a gap: more founder-level attention, more flexible scoping, direct access to the person building the system rather than a delivery-manager layer. If you want a vendor with a wall of startup logos, we are not it yet. If you want someone who will build you the system and stand behind it personally, that is exactly what this is.
          </p>
        </div>
      </div>
    </section>
  );
}
