import type { Minimap as MinimapData } from "../../lib/portfolio-canvas";
import s from "./Minimap.module.css";

/** To-scale sketch of a workflow canvas: sticky notes, wires, nodes. */
export default function Minimap({ map, className = "" }: { map: MinimapData; className?: string }) {
  return (
    <svg className={`${s.map} ${className}`} viewBox={map.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {map.notes.map((note, index) => (
        <rect key={`n${index}`} className={s.note} x={note.x} y={note.y} width={note.w} height={note.h} rx="10" />
      ))}
      {map.edges.map((d, index) => (
        <path key={`e${index}`} className={s.edge} d={d} />
      ))}
      {map.nodes.map((node, index) => (
        <rect
          key={`d${index}`}
          className={node.trigger ? s.trigger : s.node}
          x={node.x}
          y={node.y}
          width="100"
          height="100"
          rx={node.trigger ? 36 : 14}
        />
      ))}
    </svg>
  );
}
