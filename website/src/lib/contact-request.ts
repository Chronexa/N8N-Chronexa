import { captureAttribution } from './attribution';
/** One capture boundary for every form; attribution must reach the durable lead. */
export function contactRequest(options: RequestInit) {
  const payload = typeof options.body === 'string' ? JSON.parse(options.body) : {};
  return fetch('/api/contact', {
    ...options,
    body: JSON.stringify({ ...payload, page: window.location.pathname, attribution: captureAttribution() }),
  });
}
