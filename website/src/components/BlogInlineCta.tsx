import BookButton from './BookButton';
import CalcCtaButton from './CalcCtaButton';
import type { ArticleCtaPlan } from '../lib/blog-links';
import styles from './BlogInlineCta.module.css';

const LOCATION = 'blog-inline';

/**
 * Mid-article ask, for the reader who stops partway through and never reaches
 * the end-of-post block.
 *
 * Deliberately the quietest of the three placements: it interrupts the reading
 * column, so it gets a hairline rule and one line of copy rather than a panel.
 * It also names what the reader is actually reading about (the post's own
 * industry/topic labels) instead of repeating a generic pitch — the old version
 * said the same thing as the sticky bar and the footer CTA, and sameness is
 * what made three asks feel like pressure.
 *
 * Server component: no state, no effects. `data-cta-block` lets the sticky bar
 * stand down while this is on screen.
 */
export default function BlogInlineCta({
  plan,
  subject,
}: {
  plan: ArticleCtaPlan;
  /** What the article is about, e.g. "document intelligence" — lower-cased in copy. */
  subject?: string;
}) {
  const about = subject ? subject.toLowerCase() : 'this';

  if (plan.tier === 'calculator') {
    return (
      <aside className={styles.box} data-cta-block>
        <p className={styles.line}>
          <strong>Want your own number rather than a benchmark?</strong> The {plan.calc.navLabel.toLowerCase()} runs
          on your figures in about two minutes. No email required.
        </p>
        <CalcCtaButton slug={plan.calc.slug} location={LOCATION} className={styles.action}>
          Open the calculator <span aria-hidden="true">→</span>
        </CalcCtaButton>
      </aside>
    );
  }

  if (plan.tier === 'scope') {
    return (
      <aside className={styles.box} data-cta-block>
        <p className={styles.line}>
          <strong>Weighing this up for your own firm?</strong> We map the workflow first and quote a
          written fixed price before any build — so you can compare us on scope, not on a sales pitch.
        </p>
        <BookButton location={LOCATION} className={styles.action}>
          See how we would scope it <span aria-hidden="true">→</span>
        </BookButton>
      </aside>
    );
  }

  return (
    <aside className={styles.box} data-cta-block>
      <p className={styles.line}>
        <strong>Is {about} costing your team real hours?</strong> We build the systems that take this
        kind of work off people, without taking the judgment away from them.
      </p>
      <BookButton location={LOCATION} className={styles.action}>
        Talk it through in 15 minutes <span aria-hidden="true">→</span>
      </BookButton>
    </aside>
  );
}
