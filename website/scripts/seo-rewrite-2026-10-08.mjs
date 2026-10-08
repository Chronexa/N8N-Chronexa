// Applies the demand-led rewrites in docs/research/seo-forensics-2026-10-06/keyword-map/rewrites/*.md
// to the existing Sanity posts (same slug, same hero/author/publish date; new title, meta, takeaways, body).
//   node scripts/seo-rewrite-2026-10-08.mjs            # dry run
//   node scripts/seo-rewrite-2026-10-08.mjs --apply    # backs up each doc first
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { htmlToPortableText, markdownToFlatHtml } from './lib/md-to-portable-text.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = resolve(ROOT, '../docs/research/seo-forensics-2026-10-06/keyword-map/rewrites');
const env = (n) => { for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) { try { const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${n}\\s*=\\s*(.+)\\s*$`, 'm')); if (m) return m[1].trim().replace(/^["']|["']$/g, ''); } catch {} } return null; };
const client = createClient({ projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'), dataset: env('NEXT_PUBLIC_SANITY_DATASET') || 'production', apiVersion: '2024-01-01', token: env('SANITY_API_WRITE_TOKEN'), useCdn: false });
const APPLY = process.argv.includes('--apply');
const BACKUP = process.env.BACKUP_DIR || resolve(ROOT, 'tmp/seo-backups-rewrite');
if (APPLY) mkdirSync(BACKUP, { recursive: true });
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.slice(7);

const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rid = () => 'k' + Math.random().toString(36).slice(2, 12);

function tableHtml(lines) {
  const rows = lines.filter((l) => !/^\|\s*-/.test(l)).map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
  const [head, ...body] = rows;
  return `<table><thead><tr>${head.map((c) => `<th>${inline(esc(c))}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(esc(c))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function parse(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = {}; let takeaways = []; let inT = false;
  for (const line of m[1].split('\n')) {
    if (/^takeaways:/.test(line)) { inT = true; continue; }
    if (inT && line.startsWith('- ')) { takeaways.push(line.slice(2).trim()); continue; }
    const kv = line.match(/^(\w+):\s*(.*)$/); if (kv) { fm[kv[1]] = kv[2].trim(); inT = false; }
  }
  // split body into markdown chunks and tables
  const blocks = []; let buf = []; const lines = m[2].split('\n'); let i = 0;
  const flush = () => { if (buf.length) { blocks.push(...htmlToPortableText(markdownToFlatHtml(buf.join('\n')))); buf = []; } };
  while (i < lines.length) {
    if (/^\|/.test(lines[i])) { flush(); const t = []; while (i < lines.length && /^\|/.test(lines[i])) t.push(lines[i++]); blocks.push({ _type: 'htmlTable', _key: rid(), html: tableHtml(t) }); continue; }
    buf.push(lines[i++]);
  }
  flush();
  return { fm, takeaways, body: blocks, words: m[2].split(/\s+/).filter(Boolean).length };
}

for (const f of readdirSync(DIR).filter((x) => x.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  if (ONLY && ONLY !== slug) continue;
  const { fm, takeaways, body, words } = parse(resolve(DIR, f));
  for (const k of ['title', 'metaTitle', 'metaDescription', 'excerpt']) if (!fm[k]) throw new Error(`${slug}: missing ${k}`);
  if (fm.metaTitle.length > 62) throw new Error(`${slug}: metaTitle ${fm.metaTitle.length}`);
  if (fm.metaDescription.length > 160) throw new Error(`${slug}: metaDescription ${fm.metaDescription.length}`);
  const doc = await client.fetch(`*[_type=="post" && slug.current==$s && !(_id in path("drafts.**"))][0]`, { s: slug });
  if (!doc) throw new Error(`no post ${slug}`);
  const h2 = body.filter((b) => b.style === 'h2').length, tables = body.filter((b) => b._type === 'htmlTable').length, links = body.reduce((n, b) => n + (b.markDefs?.length || 0), 0);
  console.log(`${slug}\n  ${fm.title}\n  meta ${fm.metaTitle.length}/${fm.metaDescription.length} | ${words} words, ${body.length} blocks, ${h2} h2, ${tables} tables, ${links} links, ${takeaways.length} takeaways`);
  if (!APPLY) continue;
  writeFileSync(resolve(BACKUP, `${slug}.json`), JSON.stringify(doc, null, 1));
  await client.patch(doc._id).set({ title: fm.title, metaTitle: fm.metaTitle, metaDescription: fm.metaDescription, excerpt: fm.excerpt, keyTakeaways: takeaways, body, readingTime: Math.max(1, Math.round(words / 210)), updatedAt: new Date().toISOString() }).commit();
  console.log('  patched');
}
