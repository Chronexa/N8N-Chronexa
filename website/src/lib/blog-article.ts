/**
 * Pure helpers for the blog article page: heading anchors (TOC + jump links)
 * and FAQ extraction (FAQPage structured data). All operate on the SAME
 * normalized PortableText blocks the page renders, so anchors and schema
 * always match what the reader sees.
 */

interface SpanChild {
  _type?: string;
  text?: string;
}

export interface PTBlockLike {
  _type?: string;
  style?: string;
  listItem?: string;
  children?: SpanChild[];
}

/** Plain text of one block. */
export function blockText(block: PTBlockLike): string {
  return (block.children || []).map((c) => c.text || '').join('').trim();
}

/** Stable anchor id from heading text — must match between TOC and renderer. */
export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'section'
  );
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** All h2 (and h3) headings in document order — drives the "In this article" TOC. */
export function extractHeadings(blocks: unknown): Heading[] {
  if (!Array.isArray(blocks)) return [];
  const out: Heading[] = [];
  for (const b of blocks as PTBlockLike[]) {
    if (b?._type !== 'block') continue;
    if (b.style !== 'h2' && b.style !== 'h3') continue;
    const text = blockText(b);
    if (!text) continue;
    out.push({ id: slugifyHeading(text), text, level: b.style === 'h2' ? 2 : 3 });
  }
  return out;
}

/**
 * Array index (into the same `blocks`) of the middle h2 section — where a
 * mid-article CTA gets inserted. Long posts get read partway through and
 * abandoned before reaching the end-of-post CTA; this catches that reader.
 * Returns -1 for short posts (fewer than 3 h2 sections) — the end CTA and
 * sticky bar already cover those.
 */
export function midpointBlockIndex(blocks: unknown): number {
  if (!Array.isArray(blocks)) return -1;
  const h2Indexes: number[] = [];
  (blocks as PTBlockLike[]).forEach((b, i) => {
    if (b?._type === 'block' && b.style === 'h2') h2Indexes.push(i);
  });
  if (h2Indexes.length < 3) return -1;
  return h2Indexes[Math.ceil(h2Indexes.length / 2)];
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQ section → Q&A pairs for FAQPage schema. Looks for an h2 matching
 * "FAQ"/"Frequently Asked", then treats each following h3 as a question and
 * the normal blocks under it as the answer, until the next h2.
 */
export function extractFaq(blocks: unknown): FaqItem[] {
  if (!Array.isArray(blocks)) return [];
  const items: FaqItem[] = [];
  let inFaq = false;
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    if (question && answer.length) items.push({ question, answer: answer.join(' ') });
    question = null;
    answer = [];
  };

  for (const b of blocks as PTBlockLike[]) {
    if (b?._type !== 'block') continue;
    const text = blockText(b);
    if (b.style === 'h2') {
      flush();
      inFaq = /faq|frequently asked/i.test(text);
      continue;
    }
    if (!inFaq) continue;
    if (b.style === 'h3' || b.style === 'h4') {
      flush();
      question = text;
    } else if (question && (!b.style || b.style === 'normal') && !b.listItem && text) {
      answer.push(text);
    }
  }
  flush();
  return items;
}
