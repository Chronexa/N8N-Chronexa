import Image from 'next/image';
import { founders } from '../lib/site';
import styles from './Team.module.css';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

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
                <h3 className={styles.name}>
                  {f.name}
                  {f.linkedin && (
                    <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkedin} aria-label={`${f.name}'s LinkedIn`}>
                      <LinkedInIcon />
                    </a>
                  )}
                </h3>
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
