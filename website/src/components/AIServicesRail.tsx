import Link from 'next/link';
import s from './AIServicesRail.module.css';

const PRIMARY_AI_SERVICES = [
  { slug: 'ai-strategy-consulting', label: 'Strategy', cue: 'Decide what to fund' },
  { slug: 'ai-automation', label: 'Workflows', cue: 'Automate repeated work' },
  { slug: 'ai-agent-development', label: 'Agents', cue: 'Give AI a defined job' },
  { slug: 'ai-integration-services', label: 'Integration', cue: 'Connect tools and data' },
  { slug: 'ai-voice-agent-development', label: 'Voice', cue: 'Answer and complete calls' },
] as const;

export default function AIServicesRail({ current }: { current: string }) {
  return (
    <nav className={s.rail} aria-label="Five primary AI and automation services">
      <div className={s.inner}>
        <p><span>AI &amp; automation</span><strong>Five clear ways to engage</strong></p>
        <ol>
          {PRIMARY_AI_SERVICES.map((item, index) => (
            <li key={item.slug} data-current={item.slug === current}>
              <Link href={`/${item.slug}`} aria-current={item.slug === current ? 'page' : undefined}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <span><strong>{item.label}</strong><em>{item.cue}</em></span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
