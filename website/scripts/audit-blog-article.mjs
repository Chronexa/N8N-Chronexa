/**
 * Article-page regression audit, driven over the Chrome DevTools Protocol.
 *
 *   npx next build && npx next start -p 3111
 *   node scripts/audit-blog-article.mjs
 *
 * Checks each sampled post at desktop and mobile for: SERP title budget, a single
 * H1 and unbroken heading order, resolvable TOC anchors, reading measure and body
 * colour, horizontal overflow, BlogPosting/BreadcrumbList integrity against the
 * rendered breadcrumb, one-ask-at-a-time CTA behaviour, hero over-fetch and
 * target sizes. A fresh tab per page keeps navigations off a stale context.
 * No project dependencies: Node 22's global WebSocket speaks CDP directly.
 *
 * KNOWN FLAKE: driving ~18 page-loads through one browser occasionally trips
 * "NO ASK mid-article" — an IntersectionObserver callback plus React re-render
 * that has not landed before the sampling window. It moves between pages run to
 * run. Verified against a per-page deep-jump test (load, one instant jump to 40%,
 * 3s settle), where all pages report exactly one available ask every time. Treat
 * a repeated failure on the SAME page as real; a wandering one as contention.
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9414;
const BASE = 'http://localhost:3111';
// Representative variants: short, long, tables, comparison (scope tier),
// calculator tier, call tier, few headings, many headings, and the
// highest-traffic post. Point AUDIT_PICKS at another JSON file to override.
const picks = JSON.parse(
  readFileSync(process.env.AUDIT_PICKS || new URL('./audit-blog-article-picks.json', import.meta.url), 'utf8'),
);
const AUDIT_FN = readFileSync(new URL('./audit-blog-article-fn.js', import.meta.url), 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/cx-cdp2',
  '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost',
  '--no-first-run', '--no-default-browser-check', 'about:blank',
], { stdio: 'ignore' });

for (let i = 0; i < 80; i++) { try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch { await sleep(250); } }

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
  };
  const api = {
    ready: new Promise((r) => { ws.onopen = r; }),
    send: (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }),
    close: () => ws.close(),
  };
  api.evaluate = async (expression) => {
    const r = await api.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
    return r.result.value;
  };
  return api;
}

async function auditPage(slug, w, h) {
  // Fresh tab at about:blank, then navigate inside it. Passing the URL on
  // /json/new is unreliable (Chrome treats the query string inconsistently).
  const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const s = connect(tab.webSocketDebuggerUrl);
  await s.ready;
  try {
    await s.send('Page.enable');
    await s.send('Runtime.enable');
    await s.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: w < 700 ? 3 : 2, mobile: w < 700 });
    await s.send('Page.navigate', { url: `${BASE}/blog/${slug}` });
    let ready = false;
    for (let i = 0; i < 90; i++) {
      try {
        ready = await s.evaluate(`document.readyState === 'complete' && !!document.querySelector('article h1')
          && document.querySelectorAll('script[type="application/ld+json"]').length >= 2`);
      } catch { ready = false; }
      if (ready) break;
      await sleep(150);
    }
    if (!ready) return { problems: ['PAGE NEVER REACHED A READY STATE'] };
    await sleep(350); // let webfonts settle before measuring line boxes
    const r = await s.evaluate(`(${AUDIT_FN})(${w})`);

    // Read the bar/ask state only once it stops changing: an IntersectionObserver
    // callback plus a React re-render after an instant scroll can take longer
    // than a fixed sleep when 18 pages are being driven through one browser.
    const CTA_STATE = `(() => {
      const blocks = [...document.querySelectorAll('[data-cta-block]')];
      const onScreen = blocks.some(b => { const r = b.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; });
      return { bar: !!document.querySelector('aside[aria-label="Next step"]'), blockOnScreen: onScreen };
    })()`;
    const settled = async () => {
      // Minimum settle first: two identical reads taken before the observer has
      // fired at all look "stable" while actually being stale.
      await sleep(1400);
      let prev = null;
      for (let i = 0; i < 16; i++) {
        const now = await s.evaluate(CTA_STATE);
        const key = `${now.bar}|${now.blockOnScreen}`;
        if (prev === key) return now;
        prev = key;
        await sleep(200);
      }
      return s.evaluate(CTA_STATE);
    };

    // Mid-article FIRST: reaching the end latches the bar off for good, so
    // testing the bottom first would invalidate this reading.
    await s.evaluate(`window.scrollTo(0, Math.round(document.body.scrollHeight * 0.4)); 1`);
    const mid = await settled();
    r.stickyMid = mid.bar;
    if (mid.bar && mid.blockOnScreen) r.problems.push('CTA DUPLICATION mid-article: bar visible while an in-page ask is on screen');
    if (!mid.bar && !mid.blockOnScreen) r.problems.push('NO ASK mid-article: bar hidden with no in-page ask on screen');

    // Then the foot of the page: the end block is on screen, so the bar must go.
    await s.evaluate(`window.scrollTo(0, document.body.scrollHeight); 1`);
    await settled();
    const both = await s.evaluate(`(() => {
      const end = document.querySelector('[data-cta-end]');
      const b = end && end.getBoundingClientRect();
      return { endVisible: !!(b && b.top < innerHeight && b.bottom > 0),
               barPresent: !!document.querySelector('aside[aria-label="Next step"]') };
    })()`);
    if (both.endVisible && both.barPresent) r.problems.push('CTA DUPLICATION: sticky bar visible while the end block is on screen');
    r.stickyAtBottom = both.barPresent;
    return r;
  } finally {
    s.close();
    try { await fetch(`http://127.0.0.1:${PORT}/json/close/${tab.id}`); } catch {}
  }
}

const results = {};
for (const [w, h, name] of [[1440, 900, 'DESKTOP 1440'], [390, 844, 'MOBILE 390']]) {
  results[name] = [];
  for (const [label, slug] of picks) {
    let r;
    try { r = await auditPage(slug, w, h); } catch (e) { r = { problems: ['HARNESS ERROR: ' + e.message] }; }
    r.label = label; r.slug = slug;
    results[name].push(r);
  }
}

let totalBad = 0;
for (const [name, rows] of Object.entries(results)) {
  console.log(`\n${'='.repeat(76)}\n  ${name}\n${'='.repeat(76)}`);
  let bad = 0;
  for (const r of rows) {
    const ok = !r.problems.length; if (!ok) { bad++; totalBad++; }
    console.log(`\n${ok ? 'PASS' : 'FAIL'}  ${r.label}  —  ${r.slug}`);
    console.log(`   measure ${r.cpl}ch @ ${r.fontPx}/${r.lineHeight} ${r.color}  |  h1=${r.h1} headings=${r.headings} tocLinks=${r.tocLinks} visibleTOC=${r.tocVisible}`);
    console.log(`   schema ${r.schema}`);
    console.log(`   words=${r.wordCount} section=${JSON.stringify(r.articleSection)} crumbs=${r.crumbs} bookLinks=${r.bookLinks}`);
    console.log(`   cta blocks=${r.ctaBlocks} end=${r.ctaEnd} stickyMid=${r.stickyMid} stickyAtBottom=${r.stickyAtBottom} | standfirst=${r.hasStandfirst} takeaways=${r.takeaways} pillar=${r.pillarLink}`);
    console.log(`   proseCtas: ${r.proseCtas || "none"}`);
    console.log(`   hero ${r.heroNatural} shown ${r.heroDisplay} | docWidth ${r.scrollW}/${r.clientW} | title(${(r.title || '').length})`);
    for (const p of r.problems) console.log(`   ✗ ${p}`);
  }
  console.log(`\n  ${rows.length - bad}/${rows.length} clean`);
}
console.log(`\nTOTAL FAILING: ${totalBad}`);
chrome.kill();
process.exit(0);
