import type { Heading } from '../lib/blog-article';
import styles from './ArticleToc.module.css';

/**
 * Article outline. Zero JavaScript by design.
 *
 * The markup is rendered twice — a sticky rail for the desktop gutter and a
 * collapsed <details> for mobile — because exactly one of the two is ever
 * `display: none`, and a hidden element is also removed from the accessibility
 * tree. That costs ~7 anchors of DOM and buys a browser-native disclosure on
 * mobile plus a persistent outline on desktop, with no scroll listener, no
 * active-section observer and no hydration.
 *
 * Why sticky at all: the median post has 7 H2s over ~2,000 words. A one-shot
 * list at the top is decoration — the reader scrolls past it and can never get
 * back to it. A rail in the gutter (which was dead space beside a 660px column)
 * is navigation.
 */
export default function ArticleToc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;

  const list = (
    <ol className={styles.list}>
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Desktop: persistent outline in the gutter */}
      <nav className={styles.rail} aria-label="Table of contents">
        <p className={styles.railLabel}>In this article</p>
        {list}
      </nav>

      {/* Mobile: collapsed, so it never stands between the reader and the prose */}
      <nav className={styles.mobile} aria-label="Table of contents">
        <details className={styles.details}>
          <summary className={styles.summary}>
            In this article
            <span className={styles.count}>{headings.length} sections</span>
          </summary>
          {list}
        </details>
      </nav>
    </>
  );
}
