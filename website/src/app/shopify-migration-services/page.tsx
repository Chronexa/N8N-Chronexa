import GrowthPage, { growthMetadata } from '../../components/growth/GrowthPage';
import { PRODUCT_PAGES } from '../../lib/product-pages';

// Supporting page for /ecommerce-development (2026-10-07); content in lib/product-pages.ts.
const { p, x, promises, wording } = PRODUCT_PAGES['shopify-migration-services'];
export const metadata = growthMetadata(p);

export default function Page() {
  return <GrowthPage p={p} extra={x} promises={promises} wording={wording} />;
}
