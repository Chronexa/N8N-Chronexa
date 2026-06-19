import type { CSSProperties } from 'react';
import styles from './PartnershipModel.module.css';

const PILLARS = [
  {
    num: '01',
    title: 'Audit first, always.',
    body: "Before a single line of code, we sit with your team. We map every tool, every touch point, every manual step. We've reverse-engineered entire business operations before most vendors finish their sales pitch. That's how we find where the time and money are actually leaking.",
  },
  {
    num: '02',
    title: 'Build what fits. Not what sells.',
    body: "Sometimes that's n8n. Sometimes it's a fully coded custom system. Sometimes it's just organising what you already have so it can be automated. The technology follows the problem — we don't wedge your workflow into a product that wasn't built for it.",
  },
  {
    num: '03',
    title: 'A partnership, not a project.',
    body: 'The first build unlocks capacity. The second multiplies it. We stay — because AI automation compounds. More reports per month. More clients served. More revenue without more headcount. The unit economics keep moving in your favour.',
  },
];

export default function PartnershipModel() {
  return (
    <>
      <p className="eyebrow">How we work</p>
      <h2 className={styles.heading}>
        We don&apos;t build automation.<br />
        We build AI infrastructure — and we stay.
      </h2>
      <p className={styles.sub}>
        Every engagement starts with an audit. We sit with your team, map every workflow, and
        reverse-engineer how work actually gets done — before a single line of code is written.
      </p>

      <div className={styles.pillars}>
        {PILLARS.map((p, i) => (
          <div className={styles.pillar} key={p.num} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
            <div className={styles.pillarLeft}>
              <span className={styles.num}>{p.num}</span>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
            </div>
            <p className={styles.pillarBody}>{p.body}</p>
          </div>
        ))}
      </div>

      <div className={styles.callout}>
        We measure everything the same way: time recovered, capacity multiplied, revenue unlocked.{' '}
        <strong>Not AI hype. Unit economics.</strong>
      </div>
    </>
  );
}
