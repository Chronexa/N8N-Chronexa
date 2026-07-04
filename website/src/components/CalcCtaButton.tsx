'use client';

import Link from 'next/link';
import { track } from '../lib/analytics';

/**
 * Low-commitment counterpart to BookButton — routes to a free calculator
 * instead of a call. Same tracked-click pattern: `calculator_cta_click`
 * records which page and which calculator drove the click.
 */
export default function CalcCtaButton({
  slug,
  children,
  className = 'btn-primary',
  location,
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
  location: string;
}) {
  return (
    <Link
      href={`/tools/${slug}`}
      className={className}
      onClick={() => track('calculator_cta_click', { location, calculator: slug })}
    >
      {children}
    </Link>
  );
}
