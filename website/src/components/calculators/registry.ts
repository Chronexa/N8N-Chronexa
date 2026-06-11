/**
 * Single source of truth for the free-tools calculator suite.
 * Consumed by Footer.tsx ("Free tools" group — footer only, never top nav),
 * /tools hub page, and sitemap.ts. Adding calculator N+1 = one entry here
 * plus its route directory.
 */
export interface CalculatorDef {
  slug: string;
  /** Full page H1-ish title for hub cards. */
  title: string;
  /** Short label for the footer link. */
  navLabel: string;
  /** One-line hub-card description. */
  description: string;
  /** The benchmark hook shown on the hub card. */
  benchmarkHook: string;
  /** `source` tag sent to /api/contact and analytics. */
  sourceTag: string;
  vertical: 'legal' | 'cpa-tax' | 'documents';
}

export const CALCULATORS: CalculatorDef[] = [
  {
    slug: 'law-firm-billing-leakage-calculator',
    title: 'Law Firm Billing Leakage Calculator',
    navLabel: 'Billing Leakage Calculator',
    description: 'How much revenue your firm loses to unlogged time — and what automated time capture recovers.',
    benchmarkHook: '26% of potential billings never reach an invoice',
    sourceTag: 'billing-leakage-calculator',
    vertical: 'legal',
  },
  {
    slug: 'cpa-tax-season-capacity-calculator',
    title: 'CPA Tax-Season Capacity Calculator',
    navLabel: 'Tax Season Capacity Calculator',
    description: 'Returns and revenue your firm could add next season without hiring, at published automation rates.',
    benchmarkHook: '40% less prep time per return · 3× busy-season capacity',
    sourceTag: 'cpa-capacity-calculator',
    vertical: 'cpa-tax',
  },
  {
    slug: 'document-processing-cost-calculator',
    title: 'Document Processing Cost Calculator',
    navLabel: 'Document Processing Cost Calculator',
    description: 'What manual document handling really costs per year — and the 40–60% that automation removes.',
    benchmarkHook: 'Manual handling costs $10–$40 per document industry-wide',
    sourceTag: 'document-processing-cost-calculator',
    vertical: 'documents',
  },
];
