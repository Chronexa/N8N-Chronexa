'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { track } from '../../lib/analytics';
import styles from './VideoFrame.module.css';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

type Props = {
  src: string;
  poster: string;
  /** Screen-reader description of what the clip shows. */
  label: string;
  /** Device chrome around the clip. 'bare' = rounded media only. */
  frame?: 'laptop' | 'phone' | 'bare';
  /** Text in the laptop address bar. */
  address?: string;
  /** Hero clip: start fetching right away instead of waiting to scroll near it. */
  priority?: boolean;
  loop?: boolean;
  /** Media aspect ratio (e.g. '2938 / 1600') when the clip isn't the frame's default shape — avoids cropping. */
  aspect?: string;
  /** Analytics id for shopify_landing_video_play. */
  id: string;
  onEnded?: () => void;
  className?: string;
};

/**
 * Silent, inline, lazy video in a device frame. Only fetches when near the
 * viewport (or immediately when `priority`), plays only while on screen, and
 * never autoplays under prefers-reduced-motion — the poster shows instead, with
 * a play button. `playsInline` + `muted` are what let it autoplay inside the
 * Instagram/Facebook in-app browsers most of the ad traffic arrives in.
 */
export default function VideoFrame({ src, poster, label, frame = 'bare', address, priority = false, loop = true, aspect, id, onEnded, className }: Props) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [userPlayed, setUserPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const tracked = useRef(false);

  // Hero clips: the poster <img> below is the LCP element and must win the
  // network race, so the video itself only starts downloading once the page
  // has finished loading (Lighthouse measured LCP at 8.7s when both raced).
  useEffect(() => {
    if (!priority) return;
    let timer = 0;
    const start = () => { timer = window.setTimeout(() => setNear(true), 300); };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => { window.removeEventListener('load', start); window.clearTimeout(timer); };
  }, [priority]);

  useEffect(() => {
    const el = ref.current;
    if (!el || priority) return;
    const nearObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { rootMargin: '600px 0px' });
    const visObs = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    nearObs.observe(el);
    visObs.observe(el);
    return () => { nearObs.disconnect(); visObs.disconnect(); };
  }, [priority]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !priority) return;
    const visObs = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    visObs.observe(el);
    return () => visObs.disconnect();
  }, [priority]);

  const shouldPlay = near && onScreen && !userPaused && (!reducedMotion || userPlayed);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near) return;
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }, [shouldPlay, near, src]);

  function toggle() {
    if (playing) { setUserPaused(true); return; }
    setUserPaused(false);
    setUserPlayed(true);
  }

  const video = (
    <div className={styles.media} style={aspect ? { aspectRatio: aspect } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element -- plain eager poster so it's discovered in the HTML and fetched first */}
      {priority && <img className={styles.posterImg} src={poster} alt="" aria-hidden="true" fetchPriority="high" loading="eager" decoding="async" />}
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={near || priority ? poster : undefined}
        muted
        playsInline
        loop={loop}
        preload={priority ? 'auto' : 'none'}
        className={`${styles.video} ${priority ? styles.overPoster : ''}`}
        aria-label={label}
        onPlay={() => {
          setPlaying(true);
          if (!tracked.current) { tracked.current = true; track('shopify_landing_video_play', { video: id }); }
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
      />
      <button type="button" className={styles.toggle} onClick={toggle} aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}>
        {playing
          ? <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1" /><rect x="9.5" y="2.5" width="3" height="11" rx="1" /></svg>
          : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" /></svg>}
      </button>
    </div>
  );

  if (frame === 'laptop') {
    return (
      <div className={`${styles.laptop} ${className ?? ''}`}>
        <div className={styles.browserBar} aria-hidden="true"><i /><i /><i /><span>{address}</span></div>
        {video}
      </div>
    );
  }
  if (frame === 'phone') {
    return <div className={`${styles.phone} ${className ?? ''}`}>{video}</div>;
  }
  return <div className={`${styles.bare} ${className ?? ''}`}>{video}</div>;
}
