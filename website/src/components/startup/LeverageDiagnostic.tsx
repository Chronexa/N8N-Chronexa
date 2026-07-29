'use client';

import React, { useState, useMemo } from 'react';
import LeverageLineChart from './LeverageLineChart';
import layouts from './startup-layouts.module.css';

export default function LeverageDiagnostic() {
  const [outputGrowth, setOutputGrowth] = useState(30); // % output growth over last 2 quarters
  const [headcountGrowth, setHeadcountGrowth] = useState(25); // % headcount growth over same period

  const result = useMemo(() => {
    // Cap ratio to avoid infinity when headcount growth is 0
    if (headcountGrowth <= 0) {
      return { ratio: 5.0, zone: 'above' as const, label: 'Systems-Scaled' };
    }
    const ratio = Math.round((outputGrowth / headcountGrowth) * 100) / 100;
    if (ratio < 0.8) return { ratio, zone: 'below' as const, label: 'Deep in the 1:1 Trap' };
    if (ratio <= 1.2) return { ratio, zone: 'at' as const, label: 'At the 1:1 Trap boundary' };
    return { ratio, zone: 'above' as const, label: 'Above the Line' };
  }, [outputGrowth, headcountGrowth]);

  // Headcount Tax calculation — reusing the V0 salary data
  // Average blended CTC per head: ~₹6L (mix of SDR, marketer, support, analyst)
  const avgCTCPerHead = 6.0; // lakhs
  const teamSize = 20; // assume a 20-person growth-stage startup
  const headcountGrowthAbsolute = Math.round(teamSize * (headcountGrowth / 100));
  const annualHeadcountBurn = headcountGrowthAbsolute * avgCTCPerHead * 1.18; // +18% statutory
  const automatableShare = annualHeadcountBurn * 0.65; // McKinsey 60-70% midpoint

  return (
    <section id="diagnostic" className="section-light reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Diagnostic</p>
        <h2 className="sectionHead" style={{ maxWidth: '24ch' }}>Where do you actually stand?</h2>
        <p style={{ fontSize: 'var(--step-1)', color: 'var(--text-muted-light)', maxWidth: '56ch', marginBottom: 'var(--spacing-xl)', lineHeight: 'var(--leading-snug)' }}>
          Two numbers you already know. Ten seconds of math. A verdict about your company you can't unsee.
        </p>

        <div className={`glass-panel ${layouts.splitGrid}`} style={{ padding: 0, overflow: 'hidden' }}>
          {/* Left: Inputs */}
          <div style={{ padding: 'var(--spacing-lg)', background: 'var(--bg-light)' }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-light)' }}>
                <span>Output growth (last 2 quarters)</span>
                <span style={{ color: 'var(--brand-green-ink)', fontFamily: 'var(--font-display)', fontVariationSettings: '"WONK" 1, "SOFT" 4' }}>{outputGrowth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={outputGrowth}
                onChange={(e) => setOutputGrowth(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-green-ink)' }}
                aria-label="Output growth percentage"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-light)' }}>Revenue, customers served, or your north-star metric</span>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-light)' }}>
                <span>Headcount growth (same period)</span>
                <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-display)', fontVariationSettings: '"WONK" 1, "SOFT" 4' }}>{headcountGrowth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={headcountGrowth}
                onChange={(e) => setHeadcountGrowth(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                aria-label="Headcount growth percentage"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-light)' }}>Full-time team size increase, including contractors</span>
            </div>

            {/* Headcount Tax */}
            <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-amber)' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>Headcount Tax</span>
              <span className="display-num" style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', display: 'block' }}>₹{automatableShare.toFixed(1)}L</span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted-light)', marginTop: '0.3rem' }}>
                Estimated annual cost of work that could be absorbed by a system instead of a hire (McKinsey: 60–70% of routine hours).
              </span>
            </div>
          </div>

          {/* Right: Verdict + Chart */}
          <div style={{ padding: 'var(--spacing-lg)', background: 'var(--bg-sunken)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: result.zone === 'above' ? 'var(--brand-green-ink)' : 'var(--accent-amber)', marginBottom: '0.5rem' }}>
                Your Leverage Ratio
              </span>
              <span className="display-num" style={{
                fontSize: 'var(--step-4)',
                color: result.zone === 'above' ? 'var(--brand-green-ink)' : result.zone === 'at' ? 'var(--text-light)' : 'var(--accent-amber)',
                display: 'block',
              }}>
                {result.ratio.toFixed(1)}x
              </span>
              <span style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.35rem 0.8rem',
                borderRadius: '999px',
                background: result.zone === 'above' ? 'var(--brand-green-soft)' : result.zone === 'at' ? 'var(--bg-card)' : 'var(--accent-amber-soft)',
                color: result.zone === 'above' ? 'var(--brand-green-ink)' : result.zone === 'at' ? 'var(--text-light)' : 'var(--accent-amber)',
                border: '1px solid',
                borderColor: result.zone === 'above' ? 'var(--brand-green-line)' : result.zone === 'at' ? 'var(--border-light)' : 'var(--accent-amber-line)',
              }}>
                {result.label}
              </span>
            </div>

            <div className="panel" style={{ padding: 'var(--spacing-sm)', position: 'relative' }}>
              <div className="grid-texture" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <LeverageLineChart variant="diagnostic" leverageRatio={result.ratio} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
