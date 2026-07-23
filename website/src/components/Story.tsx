import styles from './Story.module.css';

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export default function Story() {
  return (
    <section className={styles.section}>
      <div className="container">
        
        <div className={styles.intro}>
          <p className="eyebrow">Our Story</p>
          <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>We didn't start with hype. We started by automating our own businesses.</h2>
          <p className={styles.introText}>
            We’ve known each other for years, and we’ve been building classical machine learning and data science products long before the generative AI wave hit in 2023. When the world was distracted by chatbots, we saw something different: AI wasn't just a toy to chat with; it was an employee, a partner, and an engine that could sit quietly inside a tech stack and actually do the work.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <p className={styles.cardRole}>Engineering & Product</p>
            <h3 className={styles.cardName}>Ankit's Stack</h3>
            <p className={styles.cardText}>
              "Running tech and product teams, we were drowning in administrative overhead. So we built AI systems connected via Zapier to act as our Scrum Master—fetching details from Fireflies, updating Jira, building velocity reports, streamlining sprint planning, and writing PRDs."
            </p>
          </article>
          
          <article className={styles.card}>
            <p className={styles.cardRole}>Finance & Operations</p>
            <h3 className={styles.cardName}>Abhishek's Stack</h3>
            <p className={styles.cardText}>
              "Coming from a financial background where paperwork is a massive burden, the manual data entry was paralyzing. We built systems to autonomously generate financial reports, handle approvals, and manage transaction alerts directly through Slack."
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.cardRole}>Marketing & GTM</p>
            <h3 className={styles.cardName}>Tushar's Stack</h3>
            <p className={styles.cardText}>
              "Lead generation and brand building require immense manual bandwidth. We deployed AI to generate brand creatives, enrich lead data via sales engines, and automatically manage CRM updates and outbound campaigns."
            </p>
          </article>
        </div>

        <div className={styles.philosophy}>
          <div>
            <h3>From Internal Tools to Enterprise Infrastructure</h3>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              When we realized the sheer volume of time and capital we had unlocked for ourselves, we launched Chronexa to do it for others. But our approach remains the same. We don’t sell AI hype. We care about one thing: <strong>Unit Economics.</strong>
            </p>
            <p style={{ fontSize: 'var(--step--1)' }}>
              Rookie influencers don't understand business. We do. We bring real industry insights to the table. We sit with your team, audit every touchpoint of your operations, and only then do we map out the exact system you need to scale.
            </p>
          </div>
          <div>
            <ul className={styles.philosophyList}>
              <li><CheckIcon className={styles.checkIcon} /> Time saved and manual work eliminated.</li>
              <li><CheckIcon className={styles.checkIcon} /> Increased capacity without increasing headcount.</li>
              <li><CheckIcon className={styles.checkIcon} /> Higher output and faster SLAs.</li>
              <li><CheckIcon className={styles.checkIcon} /> Context-aware systems for better decision-making.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
