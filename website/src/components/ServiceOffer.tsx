import styles from './ServiceOffer.module.css';
import BookButton from './BookButton';
import SampleRequestForm from './SampleRequestForm';
import type { ServiceContent } from '../lib/services-content';

/**
 * The mid-page offer band (2026-08-19).
 *
 * Ankit's review: "There is no CTA follow-up. Once you pass the hero section,
 * there is nothing to do... There is no offer and nothing driving sales, even
 * though the entire purpose of these pages is to drive conversions."
 *
 * He was right — the template put two CTAs in the hero and then nothing for
 * roughly 1,400 words until the footer band. This block sits directly after the
 * proof, which is the moment a reader has just been given a reason to believe.
 *
 * Two shapes:
 *   • default — the free automation audit, booking straight through BookButton.
 *   • form: 'sample' — the "send us 10 documents" ask, which is the locked offer
 *     from the revenue sprint and the only one on the site that lets a buyer
 *     start without booking a call. Reserved for the document pages.
 *
 * The button label is "Book a discovery call" everywhere, deliberately. It used
 * to read three different ways within one screen; MidPageCta.tsx already carries
 * a comment about why that costs conversions.
 */
export default function ServiceOffer({
  offer,
  slug,
}: {
  offer: NonNullable<ServiceContent['offer']>;
  slug: string;
}) {
  const isSample = offer.form === 'sample';

  return (
    <div className={`${styles.band} ${isSample ? styles.bandForm : ''}`} data-reveal>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Start here</p>
        <h2 className={styles.heading}>{offer.heading}</h2>
        <p className={styles.body}>{offer.body}</p>
        {!isSample && (
          <div className={styles.actions}>
            <BookButton location={`service-offer-${slug}`} className="btn-primary">
              Book a discovery call
            </BookButton>
            <span className={styles.reassure}>
              Free, 30 minutes, and you keep whatever we map out.
            </span>
          </div>
        )}
      </div>

      {isSample && (
        <div className={styles.formCard}>
          <SampleRequestForm source={`service-${slug}`} />
        </div>
      )}
    </div>
  );
}
