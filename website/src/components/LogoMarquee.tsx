import styles from './LogoMarquee.module.css';

const LOGOS: { name: string; file: string }[] = [
  { name: 'Anthropic', file: 'anthropic' },
  { name: 'Claude', file: 'claude' },
  { name: 'OpenAI', file: 'openai' },
  { name: 'Perplexity', file: 'perplexity' },
  { name: 'n8n', file: 'n8n' },
  { name: 'Make', file: 'make' },
  { name: 'Zapier', file: 'zapier' },
  { name: 'Slack', file: 'slack' },
  { name: 'Notion', file: 'notion' },
  { name: 'Airtable', file: 'airtable' },
  { name: 'Google Cloud', file: 'googlecloud' },
  { name: 'AWS', file: 'aws' },
  { name: 'ElevenLabs', file: 'elevenlabs' },
];

const ShieldCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
      fill="currentColor"
      opacity="0.18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LogoMarquee() {
  const track = [...LOGOS, ...LOGOS];
  return (
    <section className={styles.section} aria-label="Technology partners">
      {/* OAP badge — schema signal for search engines via aria-label + structured data in layout.tsx */}
      <div className={styles.badge}>
        <ShieldCheck />
        <span>Official Anthropic Partner</span>
      </div>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {track.map((logo, i) => (
            <span
              key={`${logo.file}-${i}`}
              className={styles.logo}
              style={{ maskImage: `url(/logos/${logo.file}.svg)`, WebkitMaskImage: `url(/logos/${logo.file}.svg)` }}
              role="img"
              aria-label={logo.name}
              aria-hidden={i >= LOGOS.length ? true : undefined}
              title={logo.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
