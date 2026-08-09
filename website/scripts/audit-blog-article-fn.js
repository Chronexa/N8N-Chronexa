function auditArticle(W) {
  const doc = document, win = window;
  const r = { problems: [] };
  const P = (m) => r.problems.push(m);

  // ---- title
  r.title = doc.title;
  if (/\|\s*Chronexa/.test(doc.title)) P('TITLE still carries the "| Chronexa" suffix');
  if (doc.title.length > 62) P(`TITLE ${doc.title.length} chars (>62 — SERP truncation risk)`);

  // ---- heading hierarchy
  const hs = [...doc.querySelectorAll('article h1,article h2,article h3,article h4,article h5,article h6')];
  const h1s = hs.filter((h) => h.tagName === 'H1');
  r.h1 = h1s.length; r.headings = hs.length;
  if (h1s.length !== 1) P(`H1 count = ${h1s.length} (must be exactly 1)`);
  let prev = 1;
  for (const h of hs) {
    const lv = +h.tagName[1];
    if (lv > prev + 1) P(`HEADING SKIP h${prev} -> h${lv} ("${h.textContent.trim().slice(0, 38)}")`);
    prev = lv;
  }

  // ---- TOC anchors
  const tocNavs = [...doc.querySelectorAll('nav[aria-label="Table of contents"]')];
  const tocLinks = [...doc.querySelectorAll('nav[aria-label="Table of contents"] a[href^="#"]')];
  r.tocLinks = tocLinks.length;
  const seen = new Set();
  for (const a of tocLinks) {
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (seen.has(id)) continue;
    seen.add(id);
    if (!doc.getElementById(id)) P(`BROKEN TOC ANCHOR #${id}`);
  }
  r.tocVisible = tocNavs.filter((n) => n.getBoundingClientRect().width > 0).length;
  if (tocNavs.length && r.tocVisible !== 1) P(`TOC variants visible = ${r.tocVisible} (expected exactly 1)`);

  // ---- reading measure + colour
  const ps = [...doc.querySelectorAll('article p')].filter(
    (e) => e.textContent.trim().length > 220 && e.offsetParent !== null && !e.closest('[data-cta-block]'),
  );
  if (ps.length) {
    // Pool several paragraphs: a single one is noisy because its last line is
    // partial, which drags the per-line average down.
    const sample = ps.slice(0, 12);
    const cs = win.getComputedStyle(sample[0]);
    let chars = 0, lines = 0;
    for (const el of sample) {
      chars += el.textContent.trim().length;
      lines += Math.max(1, Math.round(el.getBoundingClientRect().height / parseFloat(win.getComputedStyle(el).lineHeight)));
    }
    r.cpl = Math.round(chars / lines);
    r.sampledParas = sample.length;
    r.colWidth = Math.round(sample[0].getBoundingClientRect().width);
    r.fontPx = cs.fontSize; r.lineHeight = cs.lineHeight; r.color = cs.color;
    const lo = W < 700 ? 30 : 60, hi = W < 700 ? 48 : 78;
    if (r.cpl < lo || r.cpl > hi) P(`MEASURE ${r.cpl} chars/line (target ${lo}-${hi})`);
    if (cs.color !== 'rgb(26, 26, 23)') P(`BODY COLOUR ${cs.color} (expected near-black rgb(26,26,23))`);
  } else P('no body paragraph long enough to measure');

  // ---- horizontal overflow
  const de = doc.documentElement;
  r.scrollW = de.scrollWidth; r.clientW = de.clientWidth;
  if (de.scrollWidth > de.clientWidth + 1) {
    P(`H-OVERFLOW document ${de.scrollWidth} > viewport ${de.clientWidth}`);
    const bad = [...doc.querySelectorAll('article *')]
      .filter((e) => { const b = e.getBoundingClientRect(); return b.width > de.clientWidth + 1 && b.height > 0; })
      .slice(0, 4)
      .map((e) => `${e.tagName}.${String(e.className || '').split(' ')[0]}(${Math.round(e.getBoundingClientRect().width)}px)`);
    if (bad.length) P('   widest offenders: ' + bad.join(', '));
  }

  // ---- structured data
  const ld = [...doc.querySelectorAll('script[type="application/ld+json"]')];
  try {
    const graphs = ld.map((n) => JSON.parse(n.textContent)).filter((j) => j['@graph']);
    const g = graphs.flatMap((j) => j['@graph']);
    r.schema = g.map((x) => x['@type']).join('+');
    const post = g.find((x) => x['@type'] === 'BlogPosting');
    if (!post) P('SCHEMA missing BlogPosting');
    else {
      for (const k of ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'mainEntityOfPage'])
        if (!post[k]) P(`SCHEMA BlogPosting missing ${k}`);
      r.wordCount = post.wordCount; r.articleSection = post.articleSection;
      if (post.headline !== doc.querySelector('article h1')?.textContent.trim())
        P('SCHEMA headline does not match the rendered H1');
    }
    const bc = g.find((x) => x['@type'] === 'BreadcrumbList');
    if (!bc) P('SCHEMA missing BreadcrumbList');
    else {
      const visible = doc.querySelectorAll('nav[aria-label="Breadcrumb"] > a, nav[aria-label="Breadcrumb"] > [aria-current]').length;
      r.crumbs = `${bc.itemListElement.length} schema / ${visible} visible`;
      if (bc.itemListElement.length !== visible) P(`BREADCRUMB mismatch ${r.crumbs}`);
    }
  } catch (e) { P('SCHEMA parse failed: ' + e.message); }

  // ---- CTAs
  r.ctaBlocks = doc.querySelectorAll('[data-cta-block]').length;
  r.ctaEnd = doc.querySelectorAll('[data-cta-end]').length;
  if (r.ctaEnd !== 1) P(`data-cta-end count = ${r.ctaEnd} (expected 1)`);
  if (!doc.querySelector('[data-cta-sentinel]')) P('missing sticky-CTA sentinel');
  if (doc.querySelectorAll('article form input[type=email]').length) P('newsletter form still inside <article>');
  // book-a-call links should not be stacked three-deep in the footer
  // Separate the asks WE render from the ones a writer typed into the body copy
  // years ago: only the former is this redesign's responsibility.
  const bookEls = [...doc.querySelectorAll('article a[href*="calendly"], article a[href*="cal.com"]')];
  r.bookLinks = bookEls.length;
  const fromProse = bookEls.filter((a) => a.closest('[class*="body"]') && !a.closest('[data-cta-block]'));
  const fromComponents = bookEls.length - fromProse.length;
  r.ctaComponentBookLinks = fromComponents;
  r.ctaProseBookLinks = fromProse.length;
  if (fromComponents > 2) P(`${fromComponents} component-rendered booking links (expected <= 2)`);
  if (fromProse.length) r.proseCtas = fromProse.map((a) => `"${a.textContent.trim().slice(0, 40)}"`).join(' | ');

  // ---- furniture
  r.hasStandfirst = !!doc.querySelector('article header > p[class*="standfirst"]');
  r.takeaways = !!doc.querySelector('[aria-labelledby="takeaways-label"]');
  r.pillarLink = !!doc.querySelector('p[class*="pillarLink"] a');

  // ---- images
  const hero = doc.querySelector('article header figure[class*="cover"] img');
  if (hero) {
    const dispW = hero.getBoundingClientRect().width;
    r.heroNatural = `${hero.naturalWidth}x${hero.naturalHeight}`;
    r.heroDisplay = `${Math.round(dispW)}px`;
    if (hero.getAttribute('alt') === null || hero.getAttribute('alt') === '') P('hero image has no alt text');
    if (hero.naturalWidth && hero.naturalWidth > 2.2 * dispW * (win.devicePixelRatio || 1))
      P(`HERO OVERFETCH natural ${hero.naturalWidth}px for a ${Math.round(dispW)}px slot`);
  }
  const noAlt = [...doc.querySelectorAll('article img')].filter((i) => i.getAttribute('alt') === null).length;
  if (noAlt) P(`${noAlt} <img> with no alt attribute`);

  // ---- accessibility spot checks
  // WCAG 2.5.8 exempts links inline in a block of text, and the prose is
  // author-written CMS content rather than page chrome — so only page furniture
  // is held to the 24px target size here.
  const badTargets = [...doc.querySelectorAll('article a, article button')].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.height > 0 && b.height < 24
      && !e.closest('p, li, td, th, blockquote, nav[aria-label="Breadcrumb"]')
      && !e.closest('[class*="post-module"][class*="body"]');
  });
  if (badTargets.length)
    P(`${badTargets.length} interactive element(s) under 24px tall: ` +
      badTargets.map((e) => `${e.tagName}.${String(e.className).split(' ')[0]}(${Math.round(e.getBoundingClientRect().height)}px,"${e.textContent.trim().slice(0, 22)}")`).join(' | '));
  const emptyLinks = [...doc.querySelectorAll('article a')].filter(
    (a) => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])'),
  ).length;
  if (emptyLinks) P(`${emptyLinks} link(s) with no accessible name`);

  return r;
}
