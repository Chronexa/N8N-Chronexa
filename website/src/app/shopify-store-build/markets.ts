/**
 * Per-market settings for the Shopify landing page. Both paid pages render the
 * same ShopifyStorePage; only the lead form and tracking labels differ.
 * Budget `value`s must stay in the qualify list in src/app/api/contact/route.ts
 * — a band missing there silently marks every lead in it as unqualified.
 */
export type Market = {
  id: 'global' | 'india';
  /** Form source tag — keeps leads separately labelled in Baserow/Sheets/CAPI. */
  formSource: 'shopify-store-landing' | 'shopify-store-landing-india';
  /** Meta Pixel Lead content_name. */
  pixelName: string;
  /** Fallback dialling code when the visitor's country can't be detected (see detectCountryCode). */
  countryCode: string;
  phonePlaceholder: string;
  budgets: readonly { value: string; label: string }[];
  /** Named in the 'Conversion & checkout' and 'Shipping & operations' services. */
  payments: string;
  shipping: string;
};

/** US/EU (switched from UK/GBP on 2026-09-24). The form pre-picks the visitor's own country (detectCountryCode). */
export const GLOBAL: Market = {
  id: 'global',
  formSource: 'shopify-store-landing',
  pixelName: 'Shopify Store Landing',
  countryCode: '1',
  phonePlaceholder: '555 123 4567',
  budgets: [
    { value: 'under-3000usd', label: 'Under $3,000' },
    { value: '3000-6000usd', label: '$3,000 – $6,000' },
    { value: '6000-12000usd', label: '$6,000 – $12,000' },
    { value: '12000usd+', label: '$12,000+' },
  ],
  payments: 'Shopify Payments, Shop Pay, Apple Pay, Google Pay, PayPal and buy-now-pay-later',
  shipping: 'carrier rates, label printing and 3PL or fulfilment partners',
};

export const INDIA: Market = {
  id: 'india',
  formSource: 'shopify-store-landing-india',
  pixelName: 'Shopify Store Landing India',
  countryCode: '91',
  phonePlaceholder: '98765 43210',
  budgets: [
    { value: 'under-20k-inr', label: 'Under ₹20,000' },
    { value: '20-50k-inr', label: '₹20,000 – ₹50,000' },
    { value: '50k-1lakh-inr', label: '₹50,000 – ₹1,00,000' },
    { value: '1lakh+-inr', label: '₹1,00,000+' },
  ],
  payments: 'UPI, cards, wallets, Razorpay and Cash on Delivery',
  shipping: 'Shiprocket, Delhivery and COD order checks to cut returns',
};

/** Dialling codes offered in the form's country picker (both markets share one list). */
export const COUNTRY_CODES = [
  { code: '91', label: 'India' },
  { code: '1', label: 'US / Canada' },
  { code: '44', label: 'UK' },
  { code: '971', label: 'UAE' },
  { code: '61', label: 'Australia' },
  { code: '353', label: 'Ireland' },
  { code: '49', label: 'Germany' },
  { code: '33', label: 'France' },
  { code: '31', label: 'Netherlands' },
  { code: '34', label: 'Spain' },
  { code: '39', label: 'Italy' },
  { code: '64', label: 'New Zealand' },
  { code: '65', label: 'Singapore' },
  { code: '60', label: 'Malaysia' },
  { code: '966', label: 'Saudi Arabia' },
  { code: '974', label: 'Qatar' },
  { code: '27', label: 'South Africa' },
  { code: '92', label: 'Pakistan' },
  { code: '880', label: 'Bangladesh' },
  { code: '977', label: 'Nepal' },
  { code: '94', label: 'Sri Lanka' },
] as const;

/** Browser time zone → dialling code. Only zones whose code is in COUNTRY_CODES. */
const TZ_CODE: Record<string, string> = {
  'Asia/Kolkata': '91', 'Asia/Calcutta': '91',
  'Europe/London': '44', 'Europe/Dublin': '353', 'Europe/Berlin': '49', 'Europe/Paris': '33',
  'Europe/Amsterdam': '31', 'Europe/Madrid': '34', 'Europe/Rome': '39',
  'Asia/Dubai': '971', 'Asia/Singapore': '65', 'Asia/Kuala_Lumpur': '60', 'Asia/Riyadh': '966',
  'Asia/Qatar': '974', 'Asia/Karachi': '92', 'Asia/Dhaka': '880', 'Asia/Kathmandu': '977',
  'Asia/Katmandu': '977', 'Asia/Colombo': '94', 'Africa/Johannesburg': '27', 'Pacific/Auckland': '64',
};

/** Guess the visitor's dialling code from their device time zone (no network call, no
 * permission prompt). Falls back to the market default; the visitor can always change it. */
export function detectCountryCode(fallback: string): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (TZ_CODE[tz]) return TZ_CODE[tz];
    if (tz.startsWith('Australia/')) return '61';
    // US + Canada zones; Latin American zones (not in the list) fall through to the default.
    if (/^America\/(New_York|Chicago|Denver|Phoenix|Los_Angeles|Anchorage|Detroit|Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Boise|Indiana|Kentucky)/.test(tz) || tz === 'Pacific/Honolulu') return '1';
  } catch { /* old browser: use the fallback */ }
  return fallback;
}
