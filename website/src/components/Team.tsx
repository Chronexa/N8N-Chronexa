import Image from 'next/image';
import { founders } from '../lib/site';
import styles from './Team.module.css';

export default function Team() {
  return (
    <>
      <p className="eyebrow">Leadership</p>
      <h2 className={styles.heading}>The team behind your builds</h2>
      <div className={styles.grid}>
        {founders.map((f) => (
          <article className={styles.card} key={f.name} data-reveal>
            <div className={styles.head}>
              <div className={styles.photoWrap}>
                <Image src={f.image} alt={`${f.name}, ${f.role} of Chronexa`} width={200} height={200} className={styles.photo} sizes="200px" />
              </div>
              <div>
                <h3 className={styles.name}>{f.name}</h3>
                <p className={styles.role}>{f.role}</p>
                <p className={styles.credential}>{f.credential}</p>
              </div>
            </div>
            <p className={styles.bio}>{f.bio}</p>
            <ul className={styles.tags}>
              {f.expertise.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}
