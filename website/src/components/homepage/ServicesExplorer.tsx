'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavGroup } from '../../lib/nav';
import s from './home.module.css';

/**
 * "What we do": every service, individually. Three practice tabs; each practice draws its services on the design system's green thread. All panels stay in the
 * DOM so every service link is crawlable.
 */
export default function ServicesExplorer({ groups, groupLines, serviceLines }: {
  groups: NavGroup[];
  groupLines: Record<string, string>;
  serviceLines: Record<string, string>;
}) {
  const [tab, setTab] = useState(0);
  return (
    <div className={s.explorer}>
      <div className={s.tabs} role="tablist" aria-label="Practices">
        {groups.map((g, i) => (
            <button
              key={g.head} type="button" role="tab" id={`svc-tab-${i}`} aria-controls={`svc-panel-${i}`}
              aria-selected={i === tab} className={i === tab ? s.tabOn : s.tab} onClick={() => setTab(i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{g.head}</strong>
              <small>{g.links.length} services</small>
            </button>
        ))}
      </div>
      {groups.map((g, i) => (
        <div key={g.head} role="tabpanel" id={`svc-panel-${i}`} aria-labelledby={`svc-tab-${i}`} hidden={i !== tab} className={s.panel}>
          <p className={s.panelLine}>{groupLines[g.head]}</p>
          <ol className={s.thread}>
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>
                  <i aria-hidden="true" />
                  <strong>{l.label}</strong>
                  <span>{serviceLines[l.href]}</span>
                  <em aria-hidden="true">→</em>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
