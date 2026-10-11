'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ART, type ArtName } from '../../lib/art';
import s from './home.module.css';

/**
 * "Solutions by industry" as an editorial index. Each industry is one large row; on pointer
 * devices a painting follows the cursor and changes with the row under it (keyboard focus shows
 * it beside the row). Phones see a small thumbnail on every row instead. Links stay plain anchors.
 */
export default function IndustryIndex({ links }: { links: { label: string; href: string; art: ArtName }[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !box.current) return;
    const r = box.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const focus = (i: number) => (e: React.FocusEvent<HTMLAnchorElement>) => {
    if (!box.current) return;
    const r = box.current.getBoundingClientRect();
    const a = e.currentTarget.getBoundingClientRect();
    setPos({ x: a.right - r.left - 160, y: a.top - r.top + a.height / 2 });
    setOn(i);
  };

  return (
    <div ref={box} className={s.index} onPointerMove={move} onPointerLeave={() => setOn(null)}>
      <ol>
        {links.map((l, i) => {
          const art = ART[l.art];
          const src = art.kind === 'video' ? art.poster : art.src;
          return (
            <li key={l.href}>
              <Link href={l.href} onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(i)} onFocus={focus(i)} onBlur={() => setOn(null)} className={on === i ? s.indexOn : undefined}>
                <i className={s.indexThumb} aria-hidden="true"><Image src={src} alt="" fill sizes="72px" /></i>
                <span className={s.indexNo}>{String(i + 1).padStart(2, '0')}</span>
                <strong>{l.label}</strong>
                <em aria-hidden="true">↗</em>
              </Link>
            </li>
          );
        })}
      </ol>
      <div className={`${s.indexPreview} ${on !== null ? s.indexPreviewOn : ''}`} style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }} aria-hidden="true">
        {links.map((l, i) => {
          const art = ART[l.art];
          return (
            <Image key={l.href} src={art.kind === 'video' ? art.poster : art.src} alt="" fill sizes="320px" className={on === i ? s.indexImgOn : undefined} />
          );
        })}
      </div>
    </div>
  );
}
