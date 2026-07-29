'use client';

import React from 'react';
import LeverageLineChart from './LeverageLineChart';

export default function HeroSection() {
  return (
    <section className="section-light section-major" data-reveal>
      <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + var(--spacing-xl))' }}>

        <div style={{ maxWidth: '820px', marginInline: 'auto', textAlign: 'center' }}>
          {/* SEO eyebrow — carries the keyword so the emotional headline doesn't have to */}
          <p className="eyebrow" style={{ justifyContent: 'center' }}>AI Growth Systems for Startups</p>

          {/* Mirror headline — self-recognition, not value prop */}
          <h1 style={{ fontSize: 'var(--step-5)', marginBottom: 'var(--spacing-sm)', lineHeight: 1.06, maxWidth: '22ch', marginInline: 'auto' }}>
            Your revenue is growing. So is your headcount.{' '}
            <span className="accent-phrase">At the same rate.</span>
          </h1>

          <p style={{ fontSize: 'var(--step-1)', color: 'var(--text-muted-light)', maxWidth: '48ch', marginInline: 'auto', marginBottom: 'var(--spacing-lg)', lineHeight: 'var(--leading-snug)' }}>
            There is a name for this pattern, a number you can compute in ten seconds, and a structural reason it keeps happening. Keep reading.
          </p>

          {/* Soft scroll CTA — not "book a call", too early */}
          <a
            href="#leverage-line"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--step--1)', fontWeight: 600, color: 'var(--brand-green-ink)' }}
          >
            See where you stand <span aria-hidden="true" style={{ fontSize: '1.2em' }}>↓</span>
          </a>
        </div>

        {/* The chart — two lines drawing themselves, ending nearly overlapping */}
        <div style={{ maxWidth: '640px', marginInline: 'auto', marginTop: 'var(--spacing-xl)' }}>
          <div className="panel" style={{ padding: 'var(--spacing-md)', position: 'relative' }}>
            <div className="grid-texture" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <LeverageLineChart variant="hero" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
