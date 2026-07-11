import Image from 'next/image';
import Link from 'next/link';
import styles from './blog.module.css';

export interface BlogCard {
  id: string;
  href: string;
  title: string;
  excerpt?: string;
  category: string;
  dateLabel?: string;
  readingTime?: number;
  thumb?: string;
  alt?: string;
}

/** Blog index grid. */
export default function BlogGrid({ cards }: { cards: BlogCard[] }) {
  return (
    <div className={styles.grid}>
      {cards.map((post) => (
        <Link href={post.href} key={post.id} className={styles.card}>
          <div className={styles.thumb}>
            {post.thumb ? (
              <Image src={post.thumb} alt={post.alt || post.title} width={640} height={360} sizes="(max-width: 720px) 100vw, 380px" />
            ) : (
              <div className={styles.thumbFallback} aria-hidden="true">Chronexa</div>
            )}
          </div>
          <div className={styles.cardBody}>
            <span className={styles.cat}>{post.category}</span>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
            <div className={styles.cardMeta}>
              {post.dateLabel && <span>{post.dateLabel}</span>}
              {post.readingTime ? <span>{post.readingTime} min</span> : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
