/** Shared money formatting + currency types for the calculator suite. */

export type Currency = 'USD' | 'INR';

/** Compact money: $4.2M / $850k — ₹42.6 Cr / ₹85 L. */
export function fmtMoney(v: number, c: Currency): string {
  if (c === 'INR') {
    if (v >= 1e7) return `₹${(v / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
    if (v >= 1e5) return `₹${(v / 1e5).toLocaleString('en-IN', { maximumFractionDigits: 1 })} L`;
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  }
  if (v >= 1e6) return `$${(v / 1e6).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;
  if (v >= 1e3) return `$${Math.round(v / 1e3).toLocaleString('en-US')}k`;
  return `$${Math.round(v)}`;
}

/** Exact amount with symbol: $700 / ₹15,000. */
export function fmtAmount(v: number, c: Currency): string {
  return c === 'INR' ? `₹${v.toLocaleString('en-IN')}` : `$${v.toLocaleString('en-US')}`;
}

export function fmtRate(v: number, c: Currency): string {
  return `${fmtAmount(v, c)}/hr`;
}

/** Coarse result-magnitude band for analytics — lead quality scoring without
 *  storing raw inputs (USD: 100k/1M thresholds; INR: 1 Cr/10 Cr). */
export function resultBand(v: number, c: Currency): string {
  const [lo, hi] = c === 'INR' ? [1e7, 1e8] : [1e5, 1e6];
  if (v < lo) return 'low';
  if (v < hi) return 'mid';
  return 'high';
}
