#!/usr/bin/env node
/**
 * Pre-launch / ads-readiness check for the Shopify landing pages.
 *
 *   node scripts/check-shopify-landing.mjs                  # live chronexa.io, no lead created
 *   node scripts/check-shopify-landing.mjs --submit         # also sends ONE test lead per page
 *   node scripts/check-shopify-landing.mjs --base=http://localhost:3000 --shots=/tmp/shots
 *
 * Drives real headless Chrome (desktop 1440 + phone 393) over the DevTools
 * protocol and checks what an ad click actually experiences: page health,
 * section order, Meta Pixel, Amplitude (payloads are gzipped — decoded here),
 * ad attribution, CTAs, form validation and, with --submit, the full lead path
 * (speed, success state, Pixel Lead + matching eventID, /api/contact verdict).
 * Also statically checks every budget band on the form is in the API's
 * qualify list — a missing band silently marks those leads unqualified.
 *
 * Exits 1 if any check fails. Test leads are named "QA TEST Chronexa - please ignore".
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { gunzipSync } from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const require = createRequire(import.meta.url);
const WebSocket = require('ws');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const BASE = (args.base || 'https://chronexa.io').replace(/\/$/, '');
const SUBMIT = !!args.submit;
const SHOTS = args.shots || null;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Expected top-to-bottom order of section headings (h2 ids). Update when the page is reordered on purpose.
const EXPECTED_ORDER = ['live-heading', 'services-heading', 'enquiry-heading', 'testimonials-heading', 'process-heading', 'tour-heading', 'faq-heading', 'films-heading', 'final-heading'];
const PAGES = [
  { name: 'global', path: '/shopify-store-build', code: '1', phone: '5555550100', budget: '3000-6000usd', qualified: true },
  { name: 'india', path: '/shopify-store-build-india', code: '91', phone: '9999900000', budget: 'under-20k-inr', qualified: false },
];
const QS = '?utm_source=facebook&utm_medium=paid&utm_campaign=QA_CHECK&utm_content=QA_AD&utm_term=QA_ADSET&angle=traffic';

const results = [];
const check = (scope, name, ok, detail = '') => { results.push({ scope, name, ok: !!ok, detail }); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Static: budget bands vs qualify list ---------------------------------
{
  const markets = fs.readFileSync(path.join(ROOT, 'src/app/shopify-store-build/markets.ts'), 'utf8');
  const route = fs.readFileSync(path.join(ROOT, 'src/app/api/contact/route.ts'), 'utf8');
  const bands = [...markets.matchAll(/value: '([^']+)'/g)].map((m) => m[1]);
  const qualifyBlock = route.slice(route.indexOf('const shopQualified'), route.indexOf('].includes(shop.budget)'));
  const lowest = new Set(['under-3000usd', 'under-20k-inr']); // deliberately unqualified
  const missing = bands.filter((b) => !lowest.has(b) && !qualifyBlock.includes(`'${b}'`));
  check('static', 'every non-lowest budget band is in the qualify list', missing.length === 0, missing.join(', '));
}

// ---- Browser ----------------------------------------------------------------
async function openChrome(port) {
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--disable-gpu', '--autoplay-policy=no-user-gesture-required',
    `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'shopify-check-'))}`, 'about:blank'], { stdio: 'ignore' });
  let tabs;
  for (let i = 0; i < 60 && !tabs?.length; i++) { try { tabs = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } await sleep(250); }
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  await new Promise((r) => ws.on('open', r));
  let id = 0; const pending = new Map(); const listeners = [];
  ws.on('message', (m) => { const d = JSON.parse(m); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else listeners.forEach((l) => l(d)); });
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
  return { proc, ws, send, ev, listeners };
}

function decodeAmplitude(req) {
  try {
    const entries = req.postDataEntries || [];
    const buf = Buffer.concat(entries.map((e) => Buffer.from(e.bytes || '', 'base64')));
    const text = buf[0] === 0x1f && buf[1] === 0x8b ? gunzipSync(buf).toString() : (buf.length ? buf.toString() : req.postData || '');
    return JSON.parse(text).events || [];
  } catch { return []; }
}

async function runPage(page, device, port, submit) {
  const scope = `${page.name}/${device}`;
  const c = await openChrome(port);
  const log = { fb: [], amp: [], contact: null, contactReq: null, exceptions: [], consoleErrors: [], failed: [] };
  c.listeners.push((d) => {
    if (d.method === 'Network.requestWillBeSent') {
      const r = d.params.request;
      if (r.url.includes('facebook.com/tr')) log.fb.push(Object.fromEntries(new URL(r.url).searchParams));
      if (/amplitude\.com\/2\/httpapi|api2\.amplitude/.test(r.url)) log.amp.push(...decodeAmplitude(r));
      if (r.url.includes('/api/contact')) { log.contactReq = JSON.parse(r.postData || '{}'); log.contactStart = Date.now(); }
    }
    if (d.method === 'Network.responseReceived' && d.params.response.url.includes('/api/contact')) log.contact = { status: d.params.response.status, ms: Date.now() - log.contactStart };
    if (d.method === 'Network.loadingFailed' && !d.params.canceled && !/ERR_ABORTED|ERR_BLOCKED/.test(d.params.errorText)) log.failed.push(d.params.errorText);
    if (d.method === 'Runtime.exceptionThrown') log.exceptions.push(d.params.exceptionDetails.exception?.description?.split('\n')[0] || d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') log.consoleErrors.push(d.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 200));
  });
  await c.send('Network.enable', { maxPostDataSize: 1e6 }); await c.send('Runtime.enable'); await c.send('Page.enable');
  const mobile = device === 'mobile';
  await c.send('Emulation.setDeviceMetricsOverride', mobile ? { width: 393, height: 852, deviceScaleFactor: 2, mobile: true } : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await c.send('Emulation.setUserAgentOverride', { userAgent: mobile
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
    : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' });

  const t0 = Date.now();
  await c.send('Page.navigate', { url: BASE + page.path + QS });
  for (let i = 0; i < 60 && (await c.ev('document.readyState')) !== 'complete'; i++) await sleep(250);
  check(scope, 'page loads in under 8s', Date.now() - t0 < 8000, `${Date.now() - t0}ms`);
  await sleep(6000); // pixel + Amplitude init

  // Page health
  const meta = await c.ev(`({ title: document.title, h1: document.querySelector('h1')?.innerText.replace(/\\n/g,' '),
    canonical: document.querySelector('link[rel=canonical]')?.href, robots: document.querySelector('meta[name=robots]')?.content,
    og: document.querySelector('meta[property="og:image"]')?.content, ids: [...document.querySelectorAll('[id]')].map(e => e.id) })`);
  check(scope, 'title + H1 present', meta.title && meta.h1, meta.h1);
  check(scope, 'H1 matches ?angle=traffic', /traffic|visitors|sales/i.test(meta.h1 || ''), meta.h1);
  check(scope, 'canonical points to itself', meta.canonical === BASE.replace('http://localhost:3000', 'https://chronexa.io') + page.path || meta.canonical?.endsWith(page.path), meta.canonical);
  check(scope, 'paid page is noindex (by design)', /noindex/.test(meta.robots || ''), meta.robots);
  if (meta.og) { const r = await fetch(meta.og.replace('https://chronexa.io', BASE)); check(scope, 'OG share image returns 200', r.ok, String(r.status)); }

  const order = await c.ev(`[...document.querySelectorAll('h2[id]')].map(h => h.id)`);
  const seen = order.filter((x) => EXPECTED_ORDER.includes(x));
  check(scope, 'section order matches the agreed layout', JSON.stringify(seen) === JSON.stringify(EXPECTED_ORDER), seen.join(' → '));
  const navTargets = await c.ev(`[...document.querySelectorAll('nav a[href^="#"], a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(Boolean)`);
  const missingAnchors = [...new Set(navTargets)].filter((t) => !meta.ids.includes(t));
  check(scope, 'every in-page link has a target', missingAnchors.length === 0, missingAnchors.join(', '));
  check(scope, '6 client testimonials', (await c.ev(`document.querySelectorAll('section[aria-labelledby="testimonials-heading"] blockquote').length`)) === 6);
  check(scope, 'phone (tel:) link present', await c.ev(`!!document.querySelector('a[href^="tel:"]')`));

  // Scroll the whole page like a reader (lazy images, videos, scroll-depth events)
  const h = await c.ev('document.documentElement.scrollHeight');
  for (let y = 0; y < h; y += 600) { await c.ev(`window.scrollTo(0, ${y})`); await sleep(300); }
  await sleep(1500);
  check(scope, 'no horizontal scroll', !(await c.ev('document.documentElement.scrollWidth > window.innerWidth + 1')));
  const broken = await c.ev(`[...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.currentSrc).map(i => i.currentSrc.split('/').pop())`);
  check(scope, 'no broken images', broken.length === 0, broken.join(', '));
  const vids = await c.ev(`[...document.querySelectorAll('video')].map(v => ({ src: (v.currentSrc || v.querySelector('source')?.src || '').split('/').pop(), state: v.readyState, err: !!v.error }))`);
  const vidErr = vids.filter((v) => v.err);
  check(scope, 'no video fails to load', vidErr.length === 0, `${vids.length} videos; errors: ${vidErr.map((v) => v.src).join(', ')}`);
  check(scope, 'videos actually buffer (≥1 playable)', vids.some((v) => v.state >= 2), vids.map((v) => `${v.src}:${v.state}`).slice(0, 6).join(' '));
  if (SHOTS) {
    fs.mkdirSync(SHOTS, { recursive: true });
    for (const id of ['live-stores', 'services', 'lead-form', 'testimonials-heading', 'process', 'faq', 'films-heading']) {
      await c.ev(`document.getElementById('${id}')?.scrollIntoView({block:'start'})`); await sleep(1200);
      const { result } = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 60 });
      fs.writeFileSync(path.join(SHOTS, `${scope.replace('/', '-')}-${id}.jpg`), Buffer.from(result.data, 'base64'));
    }
  }
  await c.ev('window.scrollTo(0,0)'); await sleep(500);

  // CTA → form
  await c.ev(`[...document.querySelectorAll('header button')].find(b => /contact us/i.test(b.textContent))?.click()`);
  await sleep(1800);
  check(scope, 'header "Contact Us" scrolls to the form', await c.ev(`(() => { const r = document.getElementById('lead-form').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })()`));

  // Validation: empty submit must not call the API
  await c.ev(`document.querySelector('#lead-form button[type=submit]').click()`); await sleep(800);
  check(scope, 'empty form shows an error and sends nothing', (await c.ev(`!!document.querySelector('#lead-form [role=alert]')`)) && !log.contactReq);

  if (submit) {
    await c.ev(`(async () => {
      const f = document.querySelector('#lead-form form');
      const set = (el, v) => { Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
      set(f.querySelector('[name=name]'), 'QA TEST Chronexa - please ignore');
      set(f.querySelector('[name=countryCode]'), '${page.code}');
      set(f.querySelector('[name=phone]'), '${page.phone}');
      set(f.querySelector('[name=budget]'), '${page.budget}');
      const wa = f.querySelector('[name=waConsent]'); if (wa.checked) wa.click(); // never WhatsApp a test number
      f.querySelector('button[type=submit]').click();
    })()`);
    const s0 = Date.now();
    while (Date.now() - s0 < 15000 && !(await c.ev(`!!document.querySelector('#lead-form[role=status]')`))) await sleep(150);
    const secs = (Date.now() - s0) / 1000;
    check(scope, 'submit → thank-you in under 3s', secs < 3, `${secs.toFixed(2)}s`);
    check(scope, '/api/contact answered 200', log.contact?.status === 200, JSON.stringify(log.contact));
    check(scope, 'phone sent with country code', log.contactReq?.phone === `+${page.code}${page.phone}`, log.contactReq?.phone);
    check(scope, 'form sent correct source tag', log.contactReq?.source === (page.name === 'india' ? 'shopify-store-landing-india' : 'shopify-store-landing'), log.contactReq?.source);
    await sleep(3000);
    const lead = log.fb.find((p) => p.ev === 'Lead');
    check(scope, 'Meta Pixel Lead fired', !!lead);
    check(scope, 'Pixel Lead eventID matches server CAPI event_id (dedup)', lead && lead.eid === log.contactReq?.eventId, `${lead?.eid} vs ${log.contactReq?.eventId}`);
    const success = log.amp.find((e) => e.event_type === 'shopify_landing_lead_success');
    check(scope, 'Amplitude lead_submit + lead_success', log.amp.some((e) => e.event_type === 'shopify_landing_lead_submit') && success);
    check(scope, `API qualified verdict = ${page.qualified}`, success?.event_properties?.qualified === page.qualified, String(success?.event_properties?.qualified));
  }

  await sleep(2500);
  // Tracking
  const pv = log.fb.filter((p) => p.ev === 'PageView');
  check(scope, 'Meta Pixel PageView fired', pv.length > 0);
  const pixelId = await c.ev(`(document.getElementById('meta-pixel')?.textContent.match(/fbq\\('init', '(\\d+)'/) || [])[1]`);
  check(scope, 'Pixel events go to the pixel the page initialises', pixelId && pv.every((p) => p.id === pixelId), `${pixelId} ← ${[...new Set(pv.map((p) => p.id))].join(',')}`);
  check(scope, '_fbp cookie set (server CAPI can match)', await c.ev(`document.cookie.includes('_fbp=')`));
  const types = [...new Set(log.amp.map((e) => e.event_type))];
  check(scope, 'Amplitude receiving events', log.amp.length > 0, `${log.amp.length} events`);
  const angleView = log.amp.find((e) => e.event_type === 'shopify_landing_angle_view');
  check(scope, 'Amplitude angle_view with angle from ad', angleView?.event_properties?.angle === 'traffic', JSON.stringify(angleView?.event_properties));
  check(scope, 'Amplitude ad_id/adset_id attribution set', log.amp.some((e) => JSON.stringify(e.user_properties || {}).includes('QA_AD')), '');
  check(scope, 'Amplitude CTA click tracked', types.includes('shopify_landing_header_cta_click'));
  check(scope, 'Amplitude sees UTM campaign', log.amp.some((e) => JSON.stringify(e).includes('QA_CHECK')));
  check(scope, 'no JavaScript errors', log.exceptions.length === 0, log.exceptions.slice(0, 3).join(' | '));
  check(scope, 'no console errors', log.consoleErrors.length === 0, log.consoleErrors.slice(0, 3).join(' | '));
  check(scope, 'no failed network requests', log.failed.length === 0, log.failed.slice(0, 5).join(' | '));

  c.ws.close(); c.proc.kill();
}

let port = 9500;
for (const page of PAGES) for (const device of ['desktop', 'mobile']) {
  // Only submit once per page (desktop), so a run creates at most two test leads.
  try { await runPage(page, device, port++, SUBMIT && device === 'desktop'); } catch (e) { check(`${page.name}/${device}`, 'run completed', false, e.message); }
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  [${r.scope}] ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed against ${BASE}${SUBMIT ? ' (with test submissions)' : ''}`);
process.exit(failed.length ? 1 : 0);
