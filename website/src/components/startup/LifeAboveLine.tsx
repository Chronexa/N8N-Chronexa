'use client';

import Image from 'next/image';
import BookButton from '../BookButton';
import layouts from './startup-layouts.module.css';
import styles from './LifeAboveLine.module.css';

const outcomes = [
  {
    title: 'Revenue & Growth',
    felt: 'Content and outbound volume scales without proportional marketing headcount.',
    mechanism: 'AI research and personalization engines handle the repeatable 80% of prospecting and content creation.',
  },
  {
    title: 'Runway & Burn',
    felt: 'Fewer hires needed to hit the same growth targets, extending runway on the same raise.',
    mechanism: 'Each system absorbs a function\'s repeatable work at zero marginal cost per additional unit.',
  },
  {
    title: 'Execution Speed',
    felt: 'Decisions and reports land same-day instead of end-of-week.',
    mechanism: 'Closed-loop analytics push live intelligence to founders via Slack, not Friday spreadsheets.',
  },
  {
    title: 'Hiring Discipline',
    felt: 'Every new hire is for judgment or relationship work, never backlog-clearing.',
    mechanism: 'Repeatable operations are absorbed before the hire requisition is even written.',
  },
  {
    title: 'Customer Experience at Scale',
    felt: 'Support and onboarding quality doesn\'t degrade as volume grows.',
    mechanism: 'AI triage and grounded-answer drafting handles the first 60% of customer interactions instantly.',
  },
];

export default function LifeAboveLine() {
  return (
    <section className="section-light reveal-ready">
      <div className="container" data-reveal>
        <div className={styles.intro}>
          <div>
            <p className="eyebrow">Future Vision</p>
            <h2 className={layouts.sectionHead} style={{ maxWidth: '24ch' }}>Life above the Leverage Line</h2>
            <p className={layouts.sectionLede} style={{ marginBottom: 0 }}>
              What your company looks like when output compounds faster than headcount — in the language you actually think in, not in the language of an AI vendor.
            </p>
          </div>
          <div className={styles.imageFrame}>
            <Image
              src="/images/startup/hero.png"
              alt="An interconnected network of nodes, representing systems that compound and connect rather than a headcount that just adds up"
              width={1024}
              height={1024}
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {outcomes.map((item) => (
            <div className={layouts.card} key={item.title}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardFelt}>{item.felt}</p>
              <p className={styles.cardMechanism}>{item.mechanism}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <BookButton className="btn-outline" location="startup-life-above-line">
            See what this looks like at your stage <span aria-hidden="true">→</span>
          </BookButton>
        </div>
      </div>
    </section>
  );
}
