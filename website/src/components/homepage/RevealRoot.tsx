'use client';

import { useEffect } from 'react';

/**
 * Brings the homepage to life without decoration: any element marked `data-reveal` rises in
 * once as it enters the viewport. Content is never hidden without JS (the hiding rule only
 * applies once this has run) and nothing moves under reduced-motion.
 */
export default function RevealRoot() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    document.documentElement.setAttribute('data-reveal-ready', '');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).setAttribute('data-in', '');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); document.documentElement.removeAttribute('data-reveal-ready'); };
  }, []);
  return null;
}
