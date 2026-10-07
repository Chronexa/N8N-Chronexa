import BookButton from './BookButton';
import HeroVideo from './HeroVideo';
import s from './homepage/home.module.css';

/* Homepage hero (v4, 2026-10-08). Design-system type: Fraunces with the one green italic phrase. Full-bleed film (cultivation: people and machines growing
   something together), one statement, two actions, and a quiet partner line with the platforms
   we orchestrate. No badges, no pills. */
const PLATFORMS: [string, string][] = [
  ['claude.svg', 'Claude'], ['openai.svg', 'OpenAI'], ['gemini.svg', 'Gemini'], ['n8n.svg', 'n8n'],
  ['slack.svg', 'Slack'], ['hubspot.png', 'HubSpot'], ['shopify.svg', 'Shopify'], ['aws.svg', 'AWS'],
];

export default function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <picture className={s.heroPicture}>
        <source media="(max-width: 860px)" srcSet="/images/hero-vista-mobile.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-vista.jpg" alt="" fetchPriority="high" decoding="async" />
      </picture>
      <HeroVideo />
      <div className={s.heroScrim} aria-hidden="true" />
      <div className={`container ${s.heroInner}`}>
        <h1 id="hero-title">Imagine AI doing the work, <em>and you just approving it.</em></h1>
        <p className={s.heroCopy}>
          Chronexa is an AI-native IT services firm. We engineer AI agents, automation and software into how your
          company runs, so your business grows faster than your headcount.
        </p>
        <div className={s.heroActions}>
          <BookButton location="hero" className={s.btnGreen}>Book a strategy call</BookButton>
          <a className={s.heroLink} href="#work">See the work we’ve shipped</a>
        </div>
      </div>
      <div className={`container ${s.heroFoot}`}>
        <p>Anthropic partner. We orchestrate the right model for each job.</p>
        <ul>
          {PLATFORMS.map(([logo, name]) => (
            // eslint-disable-next-line @next/next/no-img-element
            <li key={name}><img src={`/logos/${logo}`} alt={name} height={18} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
