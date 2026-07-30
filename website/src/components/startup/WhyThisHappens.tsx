'use client';

import layouts from './startup-layouts.module.css';
import { IconSpark, IconClock, IconHourglass, IconAlert } from './icons';

const beats = [
  {
    icon: IconSpark,
    tone: undefined,
    lead: 'Every startup starts below the line, and that’s correct.',
    body: 'A handful of people doing everything by hand at zero-to-PMF is how you learn what to systematize in the first place.',
  },
  {
    icon: IconClock,
    tone: undefined,
    lead: 'Crossing it looks, in the moment, like extra work.',
    body: 'Mid-sprint — closing a round, shipping a feature, hiring for a fire — extra work always loses to the next urgent thing.',
  },
  {
    icon: IconHourglass,
    tone: undefined,
    lead: 'So the crossing keeps getting deferred.',
    body: 'Not from incompetence — the incentive structure of a growth-stage startup actively punishes exactly this investment.',
  },
  {
    icon: IconAlert,
    tone: 'amber',
    lead: 'Until the Headcount Tax becomes impossible to ignore.',
    body: 'That’s usually now.',
  },
] as const;

export default function WhyThisHappens() {
  return (
    <section className="section-light reveal-ready">
      <div className="container" data-reveal style={{ maxWidth: '720px', marginInline: 'auto' }}>
        <p className="eyebrow">Why This Happens</p>
        <h2 className={layouts.sectionHead} style={{ maxWidth: '22ch' }}>It&apos;s not your fault. It&apos;s structural.</h2>

        <div className={layouts.reasoningChain}>
          {beats.map(({ icon: Icon, tone, lead, body }) => (
            <div className={layouts.iconRow} key={lead}>
              <span className={layouts.iconBadge} data-tone={tone}>
                <Icon />
              </span>
              <p className={layouts.reasoningRow}>
                <strong>{lead}</strong> {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
