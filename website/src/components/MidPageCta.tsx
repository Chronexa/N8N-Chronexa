import BookButton from './BookButton';
import styles from './MidPageCta.module.css';

/**
 * Homepage-only, low-key CTA right under Pain Points — the moment a visitor
 * thinks "yes, that's my problem," not seven sections later at the bottom
 * banner. Deliberately small (a strip, not a card) and worded differently
 * from the hero/closing CTAs so the page doesn't read as repetitive.
 */
export default function MidPageCta() {
  return (
    <div className={styles.strip}>
      <p className={styles.text}>Recognize one of these? Let&apos;s talk about which one to fix first.</p>
      <BookButton location="homepage-mid">
        Book a 15-min call <span aria-hidden="true">→</span>
      </BookButton>
    </div>
  );
}
