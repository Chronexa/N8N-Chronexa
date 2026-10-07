import BookButton from './BookButton';
import CalcCtaButton from './CalcCtaButton';
import TrackedLink from './TrackedLink';
import type { ArticleCtaPlan } from '../lib/blog-links';
import styles from './ArticleCta.module.css';

/**
 * The single primary ask at the end of an article. Which ask appears is decided
 * by reader intent in `articleCta()` (see blog-links.ts), not by how many CTAs
 * we can fit on the page.
 *
 * The `scope` tier exists because Search Console showed the blog's best-earning
 * posts are all vendor comparisons whose readers are mid-shortlist — they were
 * being handed a cold "book a call" that answered a question they had not
 * reached yet. Every claim in that tier is one Chronexa already publishes on
 * /how-we-work: we audit first, we quote a written fixed price before any code,
 * we build on the client's stack against real data. No invented prices, no
 * invented timelines.
 *
 * Carries `data-cta-block` so BlogStickyCta can stand down while this is on
 * screen — one visible ask at a time.
 */
export default function ArticleCta({
  plan,
  audience,
  location = 'blog-post',
}: {
  plan: ArticleCtaPlan;
  /**
   * A ready-made noun phrase that slots straight into the sentence, e.g.
   * "a CPA firm". The page supplies it (see AUDIENCE_PHRASE); taxonomy labels
   * like "Cross-Industry" or "Sales" are not sentence-shaped and are omitted
   * rather than bent into "scope this for cross-industry".
   */
  audience?: string;
  location?: string;
}) {
  const who = audience ? ` for ${audience}` : '';

  // Agency-shopping readers are picking a supplier this week and will compare
  // three before booking with any of them. So the ask is the smallest real
  // commitment we offer: a free audit, with the first workflow built free.
  if (plan.tier === 'offer') {
    return (
      <aside className={styles.block} data-cta-block data-cta-end aria-labelledby="cta-heading">
        <p className={styles.eyebrow}>Shortlisting agencies?</p>
        <h2 id="cta-heading" className={styles.headline}>
          Start with a free audit, not a sales deck.
        </h2>
        <p className={styles.lede}>
          We look at how your team works today, tell you what is worth automating and what is not, and
          build the first workflow free, live inside a week. You see the work before you decide whether
          we are the right long-term partner.
        </p>
        <div className={styles.actions}>
          <BookButton location={location}>
            Book a free AI audit <span aria-hidden="true">→</span>
          </BookButton>
          <TrackedLink
            href="/ai-automation-agency"
            className={styles.quiet}
            event="cta_click"
            props={{ tier: 'offer', location: `${location}-secondary` }}
          >
            How we work with companies <span aria-hidden="true">→</span>
          </TrackedLink>
        </div>
      </aside>
    );
  }

  if (plan.tier === 'scope') {
    return (
      <aside className={styles.block} data-cta-block data-cta-end aria-labelledby="cta-heading">
        <p className={styles.eyebrow}>Still comparing options?</p>
        <h2 id="cta-heading" className={styles.headline}>
          Here is how we would scope this{who}.
        </h2>
        <ol className={styles.steps}>
          <li>
            <span className={styles.stepNo}>1</span>
            We map how the work gets done today — every tool, handoff and manual step — and find where
            the time actually leaks.
          </li>
          <li>
            <span className={styles.stepNo}>2</span>
            You get a written scope with deliverables, success metrics, integration points and a fixed
            price. You approve it before we write a line of code.
          </li>
          <li>
            <span className={styles.stepNo}>3</span>
            We build on your existing stack and run it against your real data, edge cases handled,
            before it touches live work.
          </li>
        </ol>
        <div className={styles.actions}>
          <BookButton location={location}>
            Book a free AI audit <span aria-hidden="true">→</span>
          </BookButton>
          <TrackedLink
            href="/ai-automation-cost"
            className={styles.quiet}
            event="cta_click"
            props={{ tier: 'scope', location: `${location}-cost` }}
          >
            What it costs <span aria-hidden="true">→</span>
          </TrackedLink>
          {plan.calc && (
            <CalcCtaButton slug={plan.calc.slug} location={`${location}-secondary`} className={styles.quiet}>
              Or size the problem first: {plan.calc.navLabel} <span aria-hidden="true">→</span>
            </CalcCtaButton>
          )}
        </div>
      </aside>
    );
  }

  if (plan.tier === 'calculator') {
    return (
      <aside className={styles.block} data-cta-block data-cta-end aria-labelledby="cta-heading">
        <p className={styles.eyebrow}>Before you talk to anyone</p>
        <h2 id="cta-heading" className={styles.headline}>{plan.calc.benchmarkHook}</h2>
        <p className={styles.line}>
          Work out your own firm&apos;s number instead of ours. Two minutes, no email required.
        </p>
        <div className={styles.actions}>
          <CalcCtaButton slug={plan.calc.slug} location={location} className="btn-primary">
            {plan.calc.navLabel} <span aria-hidden="true">→</span>
          </CalcCtaButton>
          <BookButton className={styles.quiet} location={`${location}-secondary`}>
            Or book a 15-min call <span aria-hidden="true">→</span>
          </BookButton>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.block} data-cta-block data-cta-end aria-labelledby="cta-heading">
      <p className={styles.eyebrow}>If this is the work eating your week</p>
      <h2 id="cta-heading" className={styles.headline}>
        We build the system that removes it.
      </h2>
      <p className={styles.line}>
        Fifteen minutes with the engineer who would build it, not a sales rep. You leave with a view of
        what is automatable and what is not — whether or not you work with us.
      </p>
      <div className={styles.actions}>
        <BookButton location={location}>
          Book a free AI audit <span aria-hidden="true">→</span>
        </BookButton>
      </div>
    </aside>
  );
}
