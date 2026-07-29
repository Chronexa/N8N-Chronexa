'use client';

import React from 'react';

export default function WhyThisHappens() {
  return (
    <section className="section-light reveal-ready">
      <div className="container" data-reveal style={{ maxWidth: '720px', marginInline: 'auto' }}>
        <p className="eyebrow">Why This Happens</p>
        <h2 className="sectionHead" style={{ maxWidth: '22ch' }}>It's not your fault. It's structural.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
          <p style={{ fontSize: 'var(--step-0)', color: 'var(--text-muted-light)', lineHeight: 'var(--leading-normal)' }}>
            Every startup starts below the Leverage Line, and that is correct. At zero-to-PMF, a handful of humans doing everything by hand is the right call — it's how you learn what to systematize in the first place.
          </p>

          <p style={{ fontSize: 'var(--step-0)', color: 'var(--text-muted-light)', lineHeight: 'var(--leading-normal)' }}>
            The problem is that crossing the line requires a deliberate investment in systems that looks, in the moment, like "extra work." And when you're mid-sprint — closing a round, shipping a feature, hiring for a fire — extra work always loses to the next urgent thing. So the crossing keeps getting deferred.
          </p>

          <p style={{ fontSize: 'var(--step-0)', color: 'var(--text-light)', lineHeight: 'var(--leading-normal)', fontWeight: 500 }}>
            Not because the founder is incompetent. Because the incentive structure of a growth-stage startup actively punishes the one investment that would make every subsequent quarter cheaper. Until the accumulated cost of staying below the line — the Headcount Tax — becomes impossible to ignore.
          </p>

          <p style={{ fontSize: 'var(--step-0)', color: 'var(--text-muted-light)', lineHeight: 'var(--leading-normal)' }}>
            That's usually now.
          </p>
        </div>
      </div>
    </section>
  );
}
