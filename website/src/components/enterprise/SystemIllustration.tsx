import styles from './enterprise.module.css';

/** Illustrative system architecture, not a claim of live customer activity. */
export default function SystemIllustration({ kind = 'software' }: { kind?: string }) {
  const labels: Record<string, string[]> = {
    software: ['Experience layer', 'Application services', 'Data & integrations'],
    automation: ['Business event', 'Reasoning + review', 'Connected action'],
    voice: ['Listen & understand', 'Context & intent', 'Resolve or hand off'],
    commerce: ['Discover', 'Choose & purchase', 'Fulfill & retain'],
    design: ['Research', 'Prototype & validate', 'Design system'],
    team: ['Your roadmap', 'Embedded engineers', 'Reviewed releases'],
  };
  return <div className={styles.illustration} role="img" aria-label={`Illustrative architecture: ${(labels[kind] ?? labels.software).join(', ')}`}>
    <div className={styles.figureTop}><span>CHRONEXA / SYSTEM DESIGN</span><span>01—03</span></div>
    <div className={styles.orbit} aria-hidden="true"><i /><i /><i /><div className={styles.core}>c<span>×</span></div></div>
    <div className={styles.layers}>{(labels[kind] ?? labels.software).map((label, i) => <div key={label}><span>0{i + 1}</span><strong>{label}</strong><b aria-hidden="true">↗</b></div>)}</div>
    <div className={styles.figureBottom}><span className={styles.signal} />ILLUSTRATIVE ARCHITECTURE<span>HUMAN-LED / AI-ENABLED</span></div>
  </div>;
}
