import styles from './Principles.module.css';

const PRINCIPLES = [
  {
    title: 'Engineer-Led, Not Sales-Led',
    body: "Growth shouldn't always mean hiring more staff. We build scalable systems that handle 10x the volume without adding 10x the payroll.",
  },
  {
    title: 'Partners, Not Just Vendors',
    body: "We don't take a ticket and disappear. We act as your technical co-founders, challenging your workflows and finding the most efficient path forward.",
  },
  {
    title: 'Built for the Long Haul',
    body: 'We reject quick hacks. We build robust, enterprise-grade infrastructure designed to grow with you for years, not just weeks.',
  },
];

export default function Principles() {
  return (
    <div className={styles.principles}>
      {PRINCIPLES.map((principle) => (
        <div key={principle.title} className={styles.principle}>
          <h3>{principle.title}</h3>
          <p>{principle.body}</p>
        </div>
      ))}
    </div>
  );
}
