import Link from 'next/link';
import { capabilities } from '../../lib/capabilities';
import styles from './enterprise.module.css';

export default function Capabilities() {
  return <section id="capabilities" className={styles.section}>
    <div className="container">
      <div className={styles.sectionHeading} data-reveal><p className={styles.kicker}>01 / OUR EXPERTISE</p><div><h2>From the first idea.<br />To what comes next.</h2><p>Strategy, design and engineering under one roof. Bring us a product to build, a system to improve, or a team that needs more capability.</p></div></div>
      <div className={styles.capabilityGrid}>{capabilities.map((s, i) => <Link href={`/${s.slug}`} key={s.slug} className={styles.capability} data-reveal>
        <div className={styles.cardIndex}><span>0{i + 1}</span><span aria-hidden="true">↗</span></div>
        <h3>{s.title}</h3><p>{s.description}</p><div className={styles.tags}>{s.tags.map(t => <span key={t}>{t}</span>)}</div>
      </Link>)}</div>
      <Link className={styles.textLink} href="/solutions">Explore all services and specialist solutions <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
