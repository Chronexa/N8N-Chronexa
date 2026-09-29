import { ShopifyOgImage, OG_SIZE, OG_CONTENT_TYPE } from './og-content';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Chronexa — Shopify store redesign and conversion for established D2C brands';

export default function Image() {
  return ShopifyOgImage('We redesign Shopify stores for growing D2C brands — free audit, fixed quote.');
}
