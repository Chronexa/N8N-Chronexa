/**
 * Minimal HTML → Sanity PortableText converter for the blog pipeline.
 *
 * The n8n copywriter agent emits a strict, flat HTML vocabulary (enforced by
 * its prompt): <h2>–<h4>, <p>, <ul>/<ol>/<li>, <blockquote>, and inline
 * <strong>/<b>, <em>/<i>, <code>, <a href>. This converts exactly that — no
 * DOM library needed, which keeps the /api/blog-publish Lambda dependency-free
 * (jsdom/@sanity/block-tools break in serverless bundling).
 *
 * Output shape mirrors what scripts/import-blogs.mjs produced via block-tools,
 * so pipeline posts render identically to the imported back catalog.
 */

interface Span {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

interface MarkDef {
  _key: string;
  _type: 'link';
  href: string;
}

export interface PTBlock {
  _type: 'block';
  _key: string;
  style: string;
  markDefs: MarkDef[];
  children: Span[];
  listItem?: 'bullet' | 'number';
  level?: number;
}

export interface HtmlTableBlock {
  _type: 'htmlTable';
  _key: string;
  html: string;
}

export type BodyBlock = PTBlock | HtmlTableBlock;

let keyCounter = 0;
function key(): string {
  // unique within a document; randomness avoids collisions across re-publishes
  return `k${(keyCounter++).toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** Parse inline content (text + strong/em/code/a) into spans + markDefs. */
function parseInline(html: string, markDefs: MarkDef[]): Span[] {
  const spans: Span[] = [];
  const stack: string[] = []; // active marks
  let buf = '';

  const flush = () => {
    if (!buf) return;
    spans.push({ _type: 'span', _key: key(), text: decodeEntities(buf), marks: [...stack] });
    buf = '';
  };

  const tagRe = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html))) {
    buf += html.slice(last, m.index);
    last = tagRe.lastIndex;
    const closing = m[0].startsWith('</');
    const tag = m[1].toLowerCase();
    const attrs = m[2] || '';

    if (tag === 'br') {
      buf += '\n';
      continue;
    }
    const mark =
      tag === 'strong' || tag === 'b' ? 'strong'
      : tag === 'em' || tag === 'i' ? 'em'
      : tag === 'code' ? 'code'
      : tag === 'a' ? 'link'
      : null;
    if (!mark) continue; // unknown inline tag: keep its text, drop the tag

    flush();
    if (mark === 'link') {
      if (!closing) {
        const href = (attrs.match(/href\s*=\s*["']([^"']*)["']/i) || [])[1] || '';
        const def: MarkDef = { _key: key(), _type: 'link', href: decodeEntities(href) };
        markDefs.push(def);
        stack.push(def._key);
      } else {
        // pop the most recent link markDef key
        for (let i = stack.length - 1; i >= 0; i--) {
          if (markDefs.some((d) => d._key === stack[i])) { stack.splice(i, 1); break; }
        }
      }
    } else if (!closing) {
      stack.push(mark);
    } else {
      const i = stack.lastIndexOf(mark);
      if (i !== -1) stack.splice(i, 1);
    }
  }
  buf += html.slice(last);
  flush();
  return spans.filter((s) => s.text.length > 0);
}

function block(style: string, inner: string, list?: { type: 'bullet' | 'number' }): PTBlock | null {
  const markDefs: MarkDef[] = [];
  const children = parseInline(inner, markDefs);
  if (children.length === 0) return null;
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs,
    children,
    ...(list ? { listItem: list.type, level: 1 } : {}),
  };
}

/** Sanitize one table cell: unwrap <p>, keep strong/em/code/a(href)/br only. */
function sanitizeCell(inner: string): string {
  let s = inner
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '<br>')
    .replace(/<(strong|b)[^>]*>/gi, '<strong>')
    .replace(/<\/(strong|b)>/gi, '</strong>')
    .replace(/<(em|i)[^>]*>/gi, '<em>')
    .replace(/<\/(em|i)>/gi, '</em>')
    .replace(/<code[^>]*>/gi, '<code>')
    .replace(/<a\s[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi, '<a href="$1">')
    .replace(/<br\s*\/?>/gi, '<br>');
  // drop any tag not in the whitelist (keeps its text)
  s = s.replace(/<\/?(?!strong\b|em\b|code\b|a\b|br\b)[a-zA-Z][^>]*>/g, '');
  return s.replace(/(<br>)+$/g, '').trim();
}

/** <table> → sanitized table markup with a detected header row. */
function tableToBlock(tableHtml: string): HtmlTableBlock | null {
  const rows: string[][] = [];
  const headerFlags: boolean[] = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let tr: RegExpExecArray | null;
  while ((tr = trRe.exec(tableHtml))) {
    const cells: string[] = [];
    let allTh = true;
    const cellRe = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
    let c: RegExpExecArray | null;
    while ((c = cellRe.exec(tr[1]))) {
      if (c[1].toLowerCase() !== 'th') allTh = false;
      cells.push(sanitizeCell(c[2]));
    }
    if (cells.length) { rows.push(cells); headerFlags.push(allTh); }
  }
  if (!rows.length) return null;
  const looksHeader = headerFlags[0] || rows[0].every((c) => /^<strong>.*<\/strong>$/.test(c));
  let out = '<table>';
  let body = rows;
  if (looksHeader) {
    out += `<thead><tr>${rows[0].map((c) => `<th>${c.replace(/^<strong>|<\/strong>$/g, '')}</th>`).join('')}</tr></thead>`;
    body = rows.slice(1);
  }
  out += `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  return { _type: 'htmlTable', _key: key(), html: out };
}

export function htmlToPortableText(html: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  // top-level block elements, flat (the copywriter never nests block tags)
  const blockRe = /<(h[1-6]|p|ul|ol|blockquote|table)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html))) {
    const tag = m[1].toLowerCase();
    const inner = m[3];
    if (tag === 'table') {
      const t = tableToBlock(m[0]);
      if (t) blocks.push(t);
    } else if (tag === 'ul' || tag === 'ol') {
      const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let li: RegExpExecArray | null;
      while ((li = liRe.exec(inner))) {
        const b = block('normal', li[1], { type: tag === 'ul' ? 'bullet' : 'number' });
        if (b) blocks.push(b);
      }
    } else if (tag === 'blockquote') {
      const b = block('blockquote', inner.replace(/<\/?p[^>]*>/gi, ' '));
      if (b) blocks.push(b);
    } else if (tag === 'h1') {
      // page already renders its own h1 — demote
      const b = block('h2', inner);
      if (b) blocks.push(b);
    } else if (tag.startsWith('h')) {
      const b = block(tag, inner);
      if (b) blocks.push(b);
    } else {
      const b = block('normal', inner);
      if (b) blocks.push(b);
    }
  }
  return blocks;
}
