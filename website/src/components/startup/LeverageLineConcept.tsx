'use client';

import React from 'react';
import LeverageLineChart from './LeverageLineChart';
import layouts from './startup-layouts.module.css';

export default function LeverageLineConcept() {
  return (
    <section id="leverage-line" className="section-muted reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Framework</p>
        <h2 className="sectionHead" style={{ maxWidth: '26ch' }}>The Leverage Line</h2>
        <p style={{ fontSize: 'var(--step-1)', color: 'var(--text-muted-light)', maxWidth: '56ch', marginBottom: 'var(--spacing-xl)', lineHeight: 'var(--leading-snug)' }}>
          Every growing company can be plotted on two curves: how fast the team is growing, and how fast output is growing. The point where these two curves should diverge is <strong style={{ color: 'var(--text-light)' }}>The Leverage Line.</strong>
        </p>

        <div className={layouts.splitGrid} style={{ alignItems: 'start' }}>
          {/* Left: Three concept beats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>Below the Line — Ratio &lt; 1.0</span>
              <h3 style={{ fontSize: 'var(--step-0)', color: 'var(--text-light)', marginBottom: '0.4rem' }}>The 1:1 Trap</h3>
              <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step--1)', margin: 0 }}>
                Output and headcount are growing in lockstep. Every new hire adds a proportional unit of output and a proportional unit of cost. Normal at 0-to-PMF. Dangerous past it.
              </p>
            </div>

            <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted-light)', marginBottom: '0.5rem' }}>At the Line — Ratio ≈ 1.0</span>
              <h3 style={{ fontSize: 'var(--step-0)', color: 'var(--text-light)', marginBottom: '0.4rem' }}>The Decision Point</h3>
              <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step--1)', margin: 0 }}>
                You've built something that works. The question is no longer whether to grow, but how. The next hire is either a system or a person. This is the moment.
              </p>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-green-ink)', marginBottom: '0.5rem' }}>Above the Line — Ratio &gt; 1.0</span>
              <h3 style={{ fontSize: 'var(--step-0)', color: 'var(--brand-green-ink)', marginBottom: '0.4rem' }}>Systems-Scaled</h3>
              <p style={{ color: 'var(--text-muted-light)', fontSize: 'var(--step--1)', margin: 0 }}>
                Output is compounding faster than headcount. The repeatable share of each function's work has been converted into a system. Every new hire does judgment and relationship work, never backlog-clearing.
              </p>
            </div>
          </div>

          {/* Right: Annotated chart */}
          <div className="panel" style={{ padding: 'var(--spacing-md)', position: 'relative' }}>
            <div className="grid-texture" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <LeverageLineChart variant="concept" />
            </div>
          </div>
        </div>

        <p style={{ marginTop: 'var(--spacing-lg)', fontSize: 'var(--step-1)', color: 'var(--text-light)', maxWidth: '56ch', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontVariationSettings: '"WONK" 1, "SOFT" 8' }}>
          "This isn't a hiring problem. It's a physics problem. Every company starts below the line. The only question is whether you ever cross it."
        </p>
      </div>
    </section>
  );
}
