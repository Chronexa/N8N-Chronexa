'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { track } from '../../lib/analytics';
import { LIVE_STORES } from './content';
import styles from './LiveStores.module.css';

type Device = 'laptop' | 'phone';
/** The size each store is rendered at before being scaled into its frame, so it lays out exactly as on a real screen. */
const VIEWPORT: Record<Device, { w: number; h: number }> = { laptop: { w: 1280, h: 800 }, phone: { w: 390, h: 844 } };
const narrowQuery = '(max-width: 700px)';
const subscribeNarrow = (cb: () => void) => { const m = window.matchMedia(narrowQuery); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); };
const STORE_ORIGINS = new Set(LIVE_STORES.map((s) => new URL(s.url).origin));

/**
 * The three stores, live, inside the page — real storefront copies (no password), loaded on tap so they never
 * weigh on first paint. The demo stores post shopping events back (tools/store-mirror/demo/demo.js); we forward
 * them to Amplitude, and their in-cart "Start your redesign" button hands off to our form via `onCta`.
 */
export default function LiveStores({ onCta }: { onCta: () => void }) {
  const [storeIdx, setStoreIdx] = useState(0);
  // Phones get the phone view by default (a scaled-down laptop is unreadable at 375px); a tap on the toggle overrides it.
  const narrow = useSyncExternalStore(subscribeNarrow, () => window.matchMedia(narrowQuery).matches, () => false);
  const [chosen, setDevice] = useState<Device | null>(null);
  const device: Device = chosen ?? (narrow ? 'phone' : 'laptop');
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0.5);
  const screen = useRef<HTMLDivElement>(null);
  const store = LIVE_STORES[storeIdx];
  const vp = VIEWPORT[device];

  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / VIEWPORT[device].w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [device]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!STORE_ORIGINS.has(e.origin) || e.data?.source !== 'store-demo') return;
      const { event, store: host, path, items, product } = e.data as { event: string; store: string; path: string; items?: number; product?: string };
      const id = LIVE_STORES.find((s) => new URL(s.url).host === host)?.id ?? host;
      track('shopify_landing_live_store_event', { store: id, event, path, items, product });
      if (event === 'cta') onCta();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onCta]);

  const pickStore = (i: number) => {
    setStoreIdx(i);
    track('shopify_landing_live_store_select', { store: LIVE_STORES[i].id, device });
  };
  const pickDevice = (d: Device) => {
    setDevice(d);
    track('shopify_landing_live_store_device', { device: d, store: store.id });
  };
  const open = () => {
    setLoaded(true);
    track('shopify_landing_live_store_open', { store: store.id, device });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <div className={styles.stores} role="group" aria-label="Choose a store">
          {LIVE_STORES.map((s, i) => (
            <button key={s.id} type="button" aria-pressed={storeIdx === i} onClick={() => pickStore(i)}>
              <b>{s.name}</b><span>{s.category}</span>
            </button>
          ))}
        </div>
        <div className={styles.devices} role="group" aria-label="Screen size">
          <button type="button" aria-pressed={device === 'laptop'} onClick={() => pickDevice('laptop')}>Laptop</button>
          <button type="button" aria-pressed={device === 'phone'} onClick={() => pickDevice('phone')}>Phone</button>
        </div>
      </div>

      <div className={styles.stageRow}>
        <div className={`${styles.frame} ${device === 'phone' ? styles.phone : styles.laptop}`}>
          {device === 'laptop' && <div className={styles.bar} aria-hidden="true"><i /><i /><i /><span>{new URL(store.url).host}</span></div>}
          <div ref={screen} className={styles.screen} style={{ aspectRatio: `${vp.w} / ${vp.h}` }}>
            {loaded ? (
              <iframe
                key={`${store.id}-${device}`}
                src={store.url}
                title={`${store.name} live store (demo copy, checkout switched off)`}
                className={styles.iframe}
                style={{ width: vp.w, height: vp.h, transform: `scale(${scale})` }}
                loading="lazy"
              />
            ) : (
              <button type="button" className={styles.poster} onClick={open}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static poster; swapped for the live store on tap */}
                <img src={device === 'phone' ? store.posterMobile : store.posterDesktop} alt="" loading="lazy" decoding="async" />
                <span className={styles.play}><b>Shop the live {store.name} store</b><small>Loads the real storefront · no password</small></span>
              </button>
            )}
          </div>
        </div>

        <div className={styles.info} aria-live="polite">
          <p className={styles.cat}>{store.category}</p>
          <h3>{store.name}</h3>
          <p>{store.line}</p>
          <ul className={styles.tags}>{store.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className={styles.hint}>{loaded ? 'Scroll, open the menu, add to bag. It all works except checkout.' : 'Tap the screen to load the real store right here.'}</p>
          <a className={styles.full} href={store.url} target="_blank" rel="noopener noreferrer" onClick={() => track('shopify_landing_live_store_full', { store: store.id })}>
            Open the full site <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
