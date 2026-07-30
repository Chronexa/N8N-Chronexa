'use client';

import BookButton from '../BookButton';
import layouts from './startup-layouts.module.css';
import styles from './ImplementationRoadmap.module.css';

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

export default function ImplementationRoadmap() {
  return (
    <section className="section-muted reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Build</p>
        <h2 className={layouts.sectionHead} style={{ maxWidth: '26ch' }}>What actually happens if you say yes</h2>
        <p className={layouts.sectionLede}>
          From bottleneck diagnosis to live deployment in weeks — transparent, fixed-price, and time-boxed so you can evaluate with zero long-term risk.
        </p>

        <p className={styles.swipeHint} aria-hidden="true">Swipe to see all 4 steps →</p>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li className={styles.step} key={step.num}>
              <span className={styles.stepNode}>{step.num.replace('0', '')}</span>
              <strong className={styles.stepTitle}>{step.title}</strong>
              <p className={styles.stepBody}>{step.text}</p>
            </li>
          ))}
        </ol>

        <div className={styles.pricingNote}>
          <h3 className={styles.pricingTitle}>Pricing</h3>
          <p className={styles.pricingBody}>
            Transparent, fixed-price project scopes based on the specific bottleneck being solved. Discovery call → scoped proposal → agreed price before any work begins. No surprise hourly billing, no hidden recurring SaaS seat fees, no lock-in.
          </p>
        </div>

        <div className={styles.ctaWrap}>
          <BookButton location="startup-roadmap">
            Book your discovery call <span aria-hidden="true">→</span>
          </BookButton>
        </div>
      </div>
    </section>
  );
}
