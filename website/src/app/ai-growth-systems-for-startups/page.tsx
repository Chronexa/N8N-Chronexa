import type { Metadata } from 'next';
import StartupGrowthPage from './StartupGrowthPage';

export const metadata: Metadata = {
  title: 'AI Growth Systems for Growth-Stage Startups | Chronexa',
  description:
    'Custom AI Growth Systems for growth-stage startups — scale acquisition, retention, and operational throughput without scaling headcount in lockstep.',
  openGraph: {
    title: 'AI Growth Systems for Growth-Stage Startups | Chronexa',
    description:
      'Custom AI Growth Systems for growth-stage startups — scale acquisition, retention, and operational throughput without scaling headcount in lockstep.',
    url: 'https://chronexa.io/ai-growth-systems-for-startups',
    type: 'website',
  },
};

export default function Page() {
  return <StartupGrowthPage />;
}
