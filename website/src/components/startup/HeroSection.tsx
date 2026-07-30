'use client';

import HeroLeadForm from './HeroLeadForm';
import styles from './HeroSection.module.css';

/**
 * Hero — realigned to the redesign spec
 * (src/specs/ai-growth-systems-for-startups-redesign.md, §7 Section 1).
 *
 * The spec is explicit about what must NOT appear here: no tool logos, no
 * stats, no service list, no "we build AI automation for startups." A previous
 * pass put a ten-logo strip and three counting stats in this section — the
 * exact two things the spec bans, and the tool strip is separately listed under
 * §15 "What to Remove" as something to demote to a minor supporting element at
 * most. Both have moved: logos to the growth-engine section (where "your tools,
 * kept" is the actual argument being made), stats to the evidence section.
 *
 * The motif chart that briefly sat inside this section now has its own
 * full-bleed band immediately below (LeverageLineScene) — it needed the width,
 * and the form column is much taller than this copy, so keeping it here left
 * either a dead void or a cramped chart.
 *
 * One deliberate deviation from the spec, on Ankit's explicit instruction: the
 * spec calls for "almost no chrome" and a soft CTA only, but the hero carries a
 * lead-capture form. That instruction supersedes the spec.
 */
export default function HeroSection() {
  return (
    <section className={`section-light ${styles.hero}`} data-reveal>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            {/* Carries the target keyword so the emotional headline doesn't
                have to — spec §7 Section 1, point 10. */}
            <p className={`eyebrow ${styles.eyebrow}`}>AI Growth Systems for Startups</p>

            {/* The mirror line. Self-recognition, not a value proposition. */}
            <h1 className={styles.h1}>
              Your revenue is growing. So is your headcount.{' '}
              <span className="accent-phrase">At the same rate.</span>
            </h1>

            <p className={styles.lede}>
              There is a name for this pattern, a number you can compute in ten seconds, and a
              structural reason it keeps happening. Keep reading.
            </p>

            <a href="#leverage-line" className={styles.scrollCta}>
              See where you stand <span aria-hidden="true" className={styles.scrollArrow}>↓</span>
            </a>
          </div>

          <div className={styles.formCol}>
            <HeroLeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
