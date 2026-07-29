'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import styles from './ServiceSceneFrame.module.css';
import { track } from '../lib/analytics';

// Same lazy-mount pattern as EngineShowcase: the scene is heavy client JS, so
// it only loads once the frame approaches the viewport.
const SCENES = {
  docintel: dynamic(() => import('./engines/docintel-scene/DocIntelScene'), { ssr: false }),
  legal: dynamic(() => import('./engines/legal-scene/LegalScene'), { ssr: false }),
} as const;

export type SceneKey = keyof typeof SCENES;

export default function ServiceSceneFrame({
  scene,
  title,
  slug,
}: {
  scene: SceneKey;
  title: string;
  slug: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // `once` latches: the scene stays mounted after first approach.
  const armed = useInView(ref, { once: true, margin: '240px 0px' });
  const tracked = useRef(false);

  useEffect(() => {
    if (armed && !tracked.current) {
      tracked.current = true;
      track('service_scene_view', { slug, scene });
    }
  }, [armed, slug, scene]);

  const Scene = armed ? SCENES[scene] : null;

  return (
    <div ref={ref} className={styles.frame}>
      <div className={styles.frameBar}>
        <i /><i /><i />
        <span className={styles.frameTitle}>{title}</span>
        <span className={styles.live}>
          <span className={styles.liveDot} aria-hidden="true" /> Live
        </span>
      </div>
      <div className={styles.stage}>
        {Scene ? <Scene /> : <div className={styles.placeholder} aria-hidden="true" />}
      </div>
    </div>
  );
}
