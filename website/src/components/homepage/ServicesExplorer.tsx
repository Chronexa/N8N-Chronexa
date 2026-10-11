'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { NavGroup } from '../../lib/nav';
import { ART, type ArtName } from '../../lib/art';
import ArtPlate from '../visual/ArtPlate';
import s from './home.module.css';

/**
 * "What we do": every service, individually. Three practice tabs, each with its own piece of art;
 * each practice draws its services on the design system's green thread. All panels stay in the
 * DOM so every service link is crawlable.
 */
export default function ServicesExplorer({ groups, groupLines, serviceLines, groupArt }: {
  groups: NavGroup[];
  groupLines: Record<string, string>;
  serviceLines: Record<string, string>;
  groupArt: Record<string, ArtName>;
}) {
  const [tab, setTab] = useState(0);
  return (
    <div className={s.explorer}>
      <div className={s.tabs} role="tablist" aria-label="Practices">
        {groups.map((g, i) => {
          const art = ART[groupArt[g.head]];
          return (
            <button
              key={g.head} type="button" role="tab" id={`svc-tab-${i}`} aria-controls={`svc-panel-${i}`}
              aria-selected={i === tab} className={i === tab ? s.tabOn : s.tab} onClick={() => setTab(i)}
            >
              <i className={s.tabThumb} aria-hidden="true">
                <Image src={art.kind === 'video' ? art.poster : art.src} alt="" fill sizes="64px" />
              </i>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{g.head}</strong>
              <small>{g.links.length} services</small>
            </button>
          );
        })}
      </div>
      {groups.map((g, i) => (
        <div key={g.head} role="tabpanel" id={`svc-panel-${i}`} aria-labelledby={`svc-tab-${i}`} hidden={i !== tab} className={s.panel}>
          <div className={s.panelArt}>
            <ArtPlate name={groupArt[g.head]} className={s.panelPlate} unveil={false} sizes="(max-width: 900px) 100vw, 34vw" decorative />
            <p>{groupLines[g.head]}</p>
          </div>
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
