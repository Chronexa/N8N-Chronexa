import styles from './LogoMarquee.module.css';

/** Tools/partners we build on. Monochrome marks, recoloured uniformly via CSS mask. */
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
  // Render the set twice back-to-back so the CSS translate loops seamlessly.
  const track = [...LOGOS, ...LOGOS];
  return (
    <section className={styles.section} aria-label="Tools and platforms we build on">
      <p className={styles.eyebrow}>
        Built on the tools your team already uses —{' '}
        <span className={styles.partner}>and an official Anthropic&nbsp;partner</span>
      </p>
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
