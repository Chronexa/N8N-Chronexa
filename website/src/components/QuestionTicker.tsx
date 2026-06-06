import styles from './QuestionTicker.module.css';

const QUESTIONS = [
  'How do I increase team capacity with AI?',
  'I am buried under backlog from too many tools.',
  'How do we experiment faster?',
  'How do I scale with a 5-person team?',
  'How do I automate content production?',
  'How do I stand out from my competitors?',
  'How do we handle more customer queries?',
  'I do not want to spend time training SDRs.',
  'Is there omnichannel marketing automation?',
  'Can AI handle our supply chain automation?',
  'I want an AI to do stock research.',
  'How do I optimise AI for automation?',
];

export default function QuestionTicker() {
  // Render twice for a seamless CSS loop.
  const row = [...QUESTIONS, ...QUESTIONS];
  return (
    <section className={styles.wrap} aria-label="Questions we hear from teams">
      <div className={styles.track}>
        {row.map((q, i) => (
          <span className={styles.chip} key={i} aria-hidden={i >= QUESTIONS.length}>
            {q}
          </span>
        ))}
      </div>
    </section>
  );
}
