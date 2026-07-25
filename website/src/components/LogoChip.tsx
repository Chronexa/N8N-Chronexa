import Image from 'next/image';
import styles from './LogoChip.module.css';

/**
 * A real tool logo in a small white chip — the single ingredient that puts
 * honest colour on the page. `file` is a full filename inside /public/logos
 * (the folder mixes .svg and .png; prefer the colour version where both exist).
 *
 * Only chip tools we genuinely build with — a logo here is a claim.
 */
type Props = {
  file: string;
  name: string;
  showName?: boolean;
  size?: 'sm' | 'md';
};

export default function LogoChip({ file, name, showName = false, size = 'md' }: Props) {
  return (
    <span className={`${styles.chip} ${size === 'sm' ? styles.sm : ''}`} title={name}>
      <Image
        src={`/logos/${file}`}
        alt={showName ? '' : name}
        width={18}
        height={18}
        className={styles.logo}
      />
      {showName && <span className={styles.name}>{name}</span>}
    </span>
  );
}
