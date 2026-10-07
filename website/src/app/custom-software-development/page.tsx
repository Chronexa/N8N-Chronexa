import GrowthPage, { growthMetadata } from '../../components/growth/GrowthPage';
import { PRODUCT_PAGES } from '../../lib/product-pages';

// Rebuilt 2026-10-07 (audit) on the shared growth layout; content in lib/product-pages.ts.
const { p, x, promises, wording } = PRODUCT_PAGES['custom-software-development'];
export const metadata = growthMetadata(p);

export default function Page() {
  return <GrowthPage p={p} extra={x} promises={promises} wording={wording} />;
}
