'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

/**
 * Decorative hero background video. Loads the device-appropriate source after
 * mount (so the static poster/vista image is the LCP element, not the video),
 * fades in once it can play, and stays OFF for reduced-motion users (poster
 * remains). Muted + playsInline + loop so it autoplays everywhere incl. iOS.
 */
export default function HeroVideo() {
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // keep the still image
    // Respect Data Saver / slow connections — never spend their bandwidth on decoration.
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    setSrc(mobile ? '/videos/hero-mobile.mp4' : '/videos/hero-desktop.mp4');
  }, []);

  useEffect(() => {
    if (src && ref.current) ref.current.play().catch(() => {}); // some browsers need an explicit kick
  }, [src]);

  if (!src) return null;
  return (
    <video
      ref={ref}
      className={`${styles.heroVideo} ${ready ? styles.heroVideoReady : ''}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/images/hero-vista.jpg"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
