import Link from 'next/link';
import type { CSSProperties } from 'react';
import styles from './WorkShipped.module.css';

const WORK = [
  {
    meta: 'Dec 9 • Commercial',
    title: 'How ReserveStudy.com cut report creation time from days to minutes',
  },
  {
    meta: 'Mar 23 • Commercial',
    title: 'Scaling a personalized outbound pipeline without increasing sales headcount',
  },
  {
    meta: 'Mar 23 • Commercial',
    title: 'How a leading corporate law firm automated regulatory intelligence with AI',
  },
];

export default function WorkShipped() {
  return (
    <>
      <div className={styles.head}>
        <div>
          <p className="eyebrow">Real Results</p>
          <h2 className={styles.heading}>Work we&apos;ve<br />actually shipped.</h2>
        </div>
        <Link href="/case-studies" className={`link-arrow ${styles.headLink}`}>
          Check Portfolio <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.workGrid}>
        {WORK.map((item, i) => (
          <Link href="/case-studies" className={styles.workCard} key={item.title} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
            <div className={styles.workCardTop}>
              <p>{item.meta}</p>
              <h3>{item.title}</h3>
            </div>
            <div className={styles.workCardBottom}>
              <span>Keep Reading</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
