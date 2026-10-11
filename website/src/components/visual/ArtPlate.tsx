import Image from 'next/image';
import AmbientVideo from './AmbientVideo';
import { ART, type ArtName } from '../../lib/art';
import s from './art-plate.module.css';

/**
 * One piece from the art library (lib/art.ts), framed. Films show their poster first and only load
 * the loop when near the viewport (AmbientVideo). Plates unveil as they scroll in: the frame opens
 * from an inset and the picture settles from a slight zoom (scroll-driven, CSS only, skipped under
 * reduced motion or where the browser lacks scroll timelines).
 */
export default function ArtPlate({
  name, className, sizes = '(max-width: 800px) 100vw, 50vw', position, caption, still = false, unveil = true, priority = false, decorative = false,
}: {
  name: ArtName;
  className?: string;
  sizes?: string;
  position?: string;
  caption?: React.ReactNode;
  /** Show a film's poster frame only. */
  still?: boolean;
  unveil?: boolean;
  priority?: boolean;
  /** Art that only repeats what the text says: hide it from screen readers. */
  decorative?: boolean;
}) {
  const art = ART[name];
  const style = position ? ({ '--art-pos': position } as React.CSSProperties) : undefined;
  const img = art.kind === 'video' ? art.poster : art.src;
  return (
    <figure className={`${s.plate}${unveil ? ` ${s.unveil}` : ''}${className ? ` ${className}` : ''}`} style={style} data-art={name}>
      <Image src={img} alt={decorative ? '' : art.alt} fill sizes={sizes} priority={priority} />
      {art.kind === 'video' && !still ? <AmbientVideo src={art.src} poster={art.poster} /> : null}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
