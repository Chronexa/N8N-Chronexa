import BookButton from './BookButton';
import styles from './MidPageCta.module.css';

/**
 * Homepage-only, low-key CTA directly under the bottleneck router — the moment
 * a visitor thinks "yes, that's my week," not six sections later at the bottom
 * banner. Deliberately small (a strip, not a card).
 *
 * The label matches the hero and the closing band exactly. It used to say
 * "Book a 15-min call" while the hero said "Book a discovery call" and the
 * footer form said "Book my free audit" — three names and three durations for
 * one action, which makes a visitor re-evaluate what they're agreeing to every
 * time they see it.
 */
export default function MidPageCta() {
  return (
    <div className={styles.strip}>
      <p className={styles.text}>Recognise one of these? Let&apos;s talk about which one to fix first.</p>
      <BookButton location="homepage-mid">
        Book a discovery call <span aria-hidden="true">→</span>
      </BookButton>
    </div>
  );
}
