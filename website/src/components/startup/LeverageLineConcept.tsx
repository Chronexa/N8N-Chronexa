'use client';

import React from 'react';
import layouts from './startup-layouts.module.css';
import styles from './LeverageLineConcept.module.css';

export default function LeverageLineConcept() {
  return (
    <section id="leverage-line" className="section-muted reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Framework</p>
        <h2 className={layouts.sectionHead} style={{ maxWidth: '26ch' }}>The Leverage Line</h2>
        <p className={layouts.sectionLede}>
          Every growing company can be plotted on two curves: how fast the team is growing, and how fast output is growing. The point where these two curves should diverge is <strong style={{ color: 'var(--text-light)' }}>The Leverage Line.</strong>
        </p>

        {/* Three zones, side by side — the ratio itself carries the visual
            weight (same big-number treatment as the diagnostic's headline
            stat), so this doesn't need a second small chart repeating what
            the hero chart already showed. */}
        <div className={styles.beats}>
          <div className={styles.beat} data-zone="below">
            <span className={styles.ratio} data-zone="below">&lt;0.8</span>
            <span className={styles.zoneLabel} data-zone="below">Below the Line</span>
            <h3 className={styles.beatTitle}>The 1:1 Trap</h3>
            <p className={styles.beatBody}>
              Output and headcount are growing in lockstep. Every new hire adds a proportional unit of output and a proportional unit of cost. Normal at 0-to-PMF. Dangerous past it.
            </p>
          </div>

          <div className={styles.beat} data-zone="at">
            <span className={styles.ratio} data-zone="at">0.8–1.2</span>
            <span className={styles.zoneLabel} data-zone="at">At the Line</span>
            <h3 className={styles.beatTitle}>The Decision Point</h3>
            <p className={styles.beatBody}>
              You&apos;ve built something that works. The question is no longer whether to grow, but how. The next hire is either a system or a person. This is the moment.
            </p>
          </div>

          <div className={styles.beat} data-zone="above">
            <span className={styles.ratio} data-zone="above">&gt;1.2</span>
            <span className={styles.zoneLabel} data-zone="above">Above the Line</span>
            <h3 className={styles.beatTitle} data-zone="above">Systems-Scaled</h3>
            <p className={styles.beatBody}>
              Output is compounding faster than headcount. The repeatable share of each function&apos;s work has been converted into a system. Every new hire does judgment and relationship work, never backlog-clearing.
            </p>
          </div>
        </div>

        <p className={layouts.pullQuote}>
          &quot;This isn&apos;t a hiring problem. It&apos;s a physics problem. Every company starts below the line. The only question is whether you ever cross it.&quot;
        </p>
      </div>
    </section>
  );
}
