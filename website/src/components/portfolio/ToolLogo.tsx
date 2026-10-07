import Image from "next/image";
import { toolLogo } from "../../lib/tool-logos";
import s from "./ToolLogo.module.css";

/** A tool's logo on a white tile; a branded monogram when there is no public mark. */
export default function ToolLogo({ name, size = 36, label = false }: { name: string; size?: number; label?: boolean }) {
  const logo = toolLogo(name);
  return (
    <span className={s.wrap} title={logo.name}>
      <span className={s.tile} style={{ width: size, height: size }}>
        {logo.src ? (
          <Image src={logo.src} alt={label ? "" : logo.name} width={size} height={size} className={s.img} style={{ padding: Math.round(size * 0.2) }} unoptimized={logo.src.endsWith(".svg")} />
        ) : (
          <span className={s.mono} style={{ background: logo.color, fontSize: Math.round(size * 0.38) }}>{logo.initials}</span>
        )}
      </span>
      {label ? <span className={s.label}>{logo.name}</span> : null}
    </span>
  );
}

/** A compact overlapping row of logos, with a +N for the rest. */
export function ToolLogoRow({ tools, max = 5, size = 30 }: { tools: string[]; max?: number; size?: number }) {
  // Plumbing like "Webhook" says nothing on a card; real products come first.
  const named = tools.filter((tool) => tool !== "Webhook");
  const shown = named.slice(0, max);
  return (
    <span className={s.row} aria-label={`Tools: ${tools.join(", ")}`}>
      {shown.map((tool) => <ToolLogo key={tool} name={tool} size={size} />)}
      {named.length > max ? <span className={s.more} style={{ height: size, minWidth: size }}>+{named.length - max}</span> : null}
    </span>
  );
}
