import Image from 'next/image';
import AmbientVideo from './AmbientVideo';
import s from './integrated-visual.module.css';

type Shared = {
  className?: string;
  label?: string;
  marker: string;
  position?: string;
  sizes?: string;
};

type Props = Shared & ({
  kind: 'video';
  src: string;
  poster: string;
} | {
  kind: 'image';
  src: string;
  alt: string;
});

export default function IntegratedVisual(props: Props) {
  const style = props.position
    ? ({ '--visual-position': props.position } as React.CSSProperties)
    : undefined;

  return (
    <figure
      className={`${s.visual}${props.className ? ` ${props.className}` : ''}`}
      data-visual-integration={props.marker}
      style={style}
    >
      {props.kind === 'video' ? (
        <>
          <Image src={props.poster} alt="" fill sizes={props.sizes ?? '(max-width: 800px) 100vw, 48vw'} />
          <AmbientVideo src={props.src} poster={props.poster} />
        </>
      ) : (
        <Image src={props.src} alt={props.alt} fill sizes={props.sizes ?? '(max-width: 800px) 100vw, 48vw'} />
      )}
      {props.label ? <figcaption>{props.label}</figcaption> : null}
    </figure>
  );
}
