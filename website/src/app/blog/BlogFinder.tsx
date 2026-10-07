'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { INDUSTRIES, FORMATS, labelFor } from '../../lib/blog-taxonomy';
import { track } from '../../lib/analytics';
import styles from './blog.module.css';

/**
 * Compact per-post record. Single-letter keys keep the client-side search
 * index small even though it includes excerpts for useful full-text matching.
 */
export interface FinderEntry {
  /** slug */ s: string;
  /** title */ t: string;
  /** industry */ i: string;
  /** topic */ p: string;
  /** format */ f: string;
  /** excerpt */ x: string;
  /** ISO date */ d: string;
  /** reading time */ r?: number;
}

/** Chips shown. Only buckets with real depth — a chip that returns 3 posts is a dead end. */
const CHIP_MIN = 10;

export default function BlogFinder({
  entries,
  masthead,
  children,
}: {
  entries: FinderEntry[];
  /**
   * Server-rendered headline copy. It is passed in rather than rendered by the
   * page because the search box and chips now live in the masthead band beside
   * it: the old layout stacked a full-height hero, then a separate floating
   * search card, and pushed the first article ~1,240px down — a visitor landing
   * on /blog saw no articles at all.
   */
  masthead: React.ReactNode;
  /** Server-rendered default view, shown whenever no chip or query is active. */
  children: React.ReactNode;
}) {
  const [industry, setIndustry] = useState('');
  const [format, setFormat] = useState('');
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const industryChips = useMemo(() => {
    const counts = entries.reduce<Record<string, number>>((a, e) => ((a[e.i] = (a[e.i] || 0) + 1), a), {});
    return INDUSTRIES.filter((b) => (counts[b.value] ?? 0) >= CHIP_MIN).map((b) => ({
      value: b.value,
      label: b.short,
      n: counts[b.value],
    }));
  }, [entries]);

  // Read filters from the URL after mount. Deliberately not useSearchParams():
  // on a statically prerendered page that defers the whole subtree to the client
  // and strips the server-rendered article grid out of the HTML.
  const readUrl = useCallback(() => {
    const p = new URLSearchParams(window.location.search);
    setIndustry(p.get('industry') || '');
    setFormat(p.get('format') || '');
    setQuery(p.get('q') || '');
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(readUrl, 0);
    window.addEventListener('popstate', readUrl);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('popstate', readUrl);
    };
  }, [readUrl]);

  // ⌘K / Ctrl-K focuses search, the convention every docs site uses.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const sync = useCallback((next: { industry?: string; format?: string; q?: string }) => {
    const p = new URLSearchParams();
    if (next.industry) p.set('industry', next.industry);
    if (next.format) p.set('format', next.format);
    if (next.q?.trim()) p.set('q', next.q.trim());
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, []);

  const active = Boolean(industry || format || query.trim());

  const results = useMemo(() => {
    if (!active) return [];
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (!industry || e.i === industry) &&
        (!format || e.f === format) &&
        (!q || [e.t, e.x, e.s, labelFor('industry', e.i), labelFor('topic', e.p)]
          .some((value) => value.toLowerCase().includes(q)))
    );
  }, [entries, industry, format, query, active]);

  const pick = (kind: 'industry' | 'format', value: string) => {
    const next =
      kind === 'industry'
        ? { industry: industry === value ? '' : value, format, q: query }
        : { industry, format: format === value ? '' : value, q: query };
    setIndustry(next.industry);
    setFormat(next.format);
    sync(next);
    if (next[kind]) track('blog_filter_apply', { facet: kind, value });
  };

  const clear = () => {
    setIndustry('');
    setFormat('');
    setQuery('');
    sync({});
  };

  return (
    <>
      <section className={styles.mastheadBand}>
        <div className={`container ${styles.masthead}`}>
          <div className={styles.mastheadCopy}>{masthead}</div>

          <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <label className={styles.srOnly} htmlFor="blog-search">Search {entries.length} articles</label>
          <input
            id="blog-search"
            ref={inputRef}
            className={styles.searchInput}
            type="search"
            autoComplete="off"
            placeholder="Search articles, guides, playbooks…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              sync({ industry, format, q: e.target.value });
            }}
          />
          <kbd className={styles.kbd} aria-hidden="true">⌘K</kbd>
        </div>

        <div className={styles.chipRow}>
          <span className={styles.chipLabel}>Popular:</span>
          {industryChips.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`${styles.chip} ${industry === c.value ? styles.chipOn : ''}`}
              aria-pressed={industry === c.value}
              onClick={() => pick('industry', c.value)}
            >
              {c.label}
            </button>
          ))}
          {FORMATS.filter((f) => f.value !== 'guide').map((f) => (
            <button
              key={f.value}
              type="button"
              className={`${styles.chip} ${format === f.value ? styles.chipOn : ''}`}
              aria-pressed={format === f.value}
              onClick={() => pick('format', f.value)}
            >
              {f.label}
            </button>
          ))}
          </div>
        </div>
      </section>

      <section className={styles.wrap}>
        <div className="container">
          {!active ? (
            children
          ) : (
            <section className={styles.resultsWrap} aria-live="polite">
              <div className={styles.collectionHead}>
                <h2 className={styles.collectionTitle}>
                  {results.length} {results.length === 1 ? 'article' : 'articles'}
                </h2>
                <button type="button" className={styles.clear} onClick={clear}>Clear filters</button>
              </div>
              {results.length === 0 ? (
                <p className={styles.empty}>Nothing matches that combination yet. Try clearing a filter.</p>
              ) : (
                <ol className={styles.resultList}>
                  {results.map((r) => (
                    <li key={r.s}>
                      <Link href={`/blog/${r.s}`}>
                        <span className={styles.resultTitle}>{r.t}</span>
                        <span className={styles.resultMeta}>
                          {labelFor('industry', r.i)}
                          {r.p ? ` · ${labelFor('topic', r.p)}` : ''}
                          {r.r ? ` · ${r.r} min read` : ''}
                          {r.d ? ` · ${new Date(r.d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}
        </div>
      </section>
    </>
  );
}
