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

export default function LogoMarquee() {
  const track = [...LOGOS, ...LOGOS];
  return (
    <section className={styles.section} aria-label="Technology partners">
      {/* The Anthropic partnership badge moved into the hero — it is a credibility
          signal and belongs where 100% of visitors see it. What is left here does a
          different job: it answers the unspoken "do I have to replace my stack?" */}
      <p className={styles.badge}>Built on the stack you already run</p>
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
