import ArtPlate from './ArtPlate';
import type { ArtName } from '../../lib/art';
import s from './hero-stage.module.css';

/**
 * A live demo floating on a painting (2026-10-11). Used in the dark heroes of the solution and
 * industry pages: the painting bleeds off the right edge of the page and the demo window sits over
 * its left side, the same gallery-plate device as the homepage work stage. On phones the painting
 * sits above the demo and the demo overlaps its lower edge.
 */
export default function HeroStage({ art, position, children }: { art: ArtName; position?: string; children: React.ReactNode }) {
  return (
    <div className={s.stage}>
      <ArtPlate name={art} position={position} className={s.plate} unveil={false} priority sizes="(max-width: 1040px) 100vw, 50vw" decorative />
      <div className={s.demo}>{children}</div>
    </div>
  );
}

/** The same library art for a page's "relevant work" block. */
export function ProofArt({ art, position, caption }: { art: ArtName; position?: string; caption?: string }) {
  return <ArtPlate name={art} position={position} className={s.proofArt} caption={caption} sizes="(max-width: 1040px) 100vw, 34vw" decorative />;
}
