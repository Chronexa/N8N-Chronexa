/** Preserve campaign attribution through internal navigation and scheduling. */
export type Touch = Record<string, string>;
const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'] as const;
let memory: { first: Touch; latest: Touch } | undefined;
export function captureAttribution() {
  if (typeof window === 'undefined') return { first: {}, latest: {} };
  const params = new URLSearchParams(window.location.search);
  const touch: Touch = { landing_path: window.location.pathname, referrer: document.referrer || 'direct', first_seen_at: new Date().toISOString() };
  for (const key of FIELDS) touch[key] = (params.get(key) || '').slice(0, 300);
  const campaign = FIELDS.some(key => !!touch[key]);
  let external = false;
  try { external = !!document.referrer && new URL(document.referrer).hostname !== window.location.hostname; } catch { /* no referrer */ }
  try {
    const first = JSON.parse(localStorage.getItem('chronexa_first_touch') || 'null') || touch;
    const oldLatest = JSON.parse(localStorage.getItem('chronexa_latest_touch') || 'null');
    const signature = window.location.pathname + window.location.search;
    const captured = sessionStorage.getItem('chronexa_attribution_entry') === signature;
    const latest = !captured && (campaign || (external && !memory)) ? touch : oldLatest || first;
    localStorage.setItem('chronexa_first_touch', JSON.stringify(first));
    localStorage.setItem('chronexa_latest_touch', JSON.stringify(latest));
    sessionStorage.setItem('chronexa_attribution_entry', signature);
    memory = { first, latest };
  } catch { memory ||= { first: touch, latest: touch }; }
  return memory;
}
export function analyticsAllowed() {
  if (typeof window === 'undefined') return false;
  if (!['chronexa.io', 'www.chronexa.io'].includes(window.location.hostname) || navigator.webdriver) return false;
  try {
    const choice = new URLSearchParams(window.location.search).get('analytics');
    if (choice === 'off') sessionStorage.setItem('chronexa_analytics_off', '1');
    return sessionStorage.getItem('chronexa_analytics_off') !== '1';
  } catch { return true; }
}
