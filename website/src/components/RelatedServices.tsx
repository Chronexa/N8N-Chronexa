import Link from 'next/link';
import { relatedServices } from '../lib/blog-links';
import styles from './RelatedServices.module.css';

/**
 * Contextual "money links" at the foot of every blog post → the most relevant
 * service / use-case pages, with keyword-rich anchor text. Drives link equity
 * to commercial pages and gives readers a path toward booking.
 */
export default function RelatedServices({ title, category, slug }: { title?: string; category?: string; slug?: string }) {
  const items = relatedServices({ title, category, slug });
  if (!items.length) return null;
  return (
    <aside className={styles.wrap} aria-label="Related services">
      <p className={styles.eyebrow}>Automate this with Chronexa</p>
      <ul className={styles.list}>
        {items.map((it) => (
          <li key={it.slug}>
            <Link href={`/${it.slug}`} className={styles.link}>
              {it.label}<span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
