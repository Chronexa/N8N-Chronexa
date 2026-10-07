import GrowthPage, { growthMetadata } from '../../components/growth/GrowthPage';
import { growthPage } from '../../lib/growth-pages';

const p = growthPage('what-is-ai-automation');
export const metadata = growthMetadata(p);

export default function Page() {
  return <GrowthPage p={p} />;
}
