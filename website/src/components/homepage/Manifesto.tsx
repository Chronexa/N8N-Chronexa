'use client';

import { useEffect, useRef } from 'react';
import s from './home.module.css';

/**
 * "Who we are" statement. Words fill from grey to ink as the paragraph moves through the
 * viewport, so the reader is paced through one idea at a time. Static (fully inked) for
 * reduced-motion and before hydration only the colour changes, never the layout.
 */
export default function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll('span'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => w.setAttribute('data-on', ''));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top of the paragraph reaches 85% of the viewport, 1 when its bottom reaches 45%.
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => (i < n ? w.setAttribute('data-on', '') : w.removeAttribute('data-on')));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <p ref={ref} className={s.manifesto}>
      {text.split(' ').map((word, i) => <span key={i}>{word} </span>)}
    </p>
  );
}
