'use client';

import { useEffect, useRef, useState } from 'react';

export default function AmbientVideo({ src, poster }: { src: string; poster: string }) {
  const host = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const video = host.current;
    if (!video) return;
    // Respect reduced-motion: the poster frame stays, the loop never loads.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: '240px 0px', threshold: 0.05 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = host.current;
    if (!video || !loaded) return;
    if (visible) video.play().catch(() => undefined);
    else video.pause();
  }, [loaded, visible]);

  return (
    <video ref={host} muted loop playsInline preload="none" poster={poster} aria-hidden="true">
      {loaded ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
