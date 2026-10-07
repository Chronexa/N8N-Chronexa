"use client";

import { createElement, useEffect, useState } from "react";
import type { Minimap as MinimapData } from "../../lib/portfolio-canvas";
import Minimap from "./Minimap";
import s from "./N8nEmbed.module.css";

/* n8n's own canvas renderer — the component n8n.io uses on its template pages.
   It draws the workflow in an iframe served by n8n, so nodes, icons, sticky
   notes and wiring look exactly as they do in the editor. Pinned: a new major
   of the component should be looked at before it reaches the site. */
const SCRIPT = "https://cdn.jsdelivr.net/npm/@n8n_io/n8n-demo-component@1.0.20/n8n-demo.bundled.js";

function loadScript() {
  if (typeof window === "undefined" || customElements.get("n8n-demo")) return;
  if (document.querySelector(`script[src="${SCRIPT}"]`)) return;
  const script = document.createElement("script");
  script.type = "module";
  script.src = SCRIPT;
  document.head.appendChild(script);
}

export default function N8nEmbed({
  workflowJson,
  fileName,
  active,
  map,
  tall = false,
}: {
  /** The public workflow, already serialised on the server. */
  workflowJson: string;
  fileName: string;
  active: boolean;
  map: MinimapData;
  tall?: boolean;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadScript();
    let cancelled = false;
    customElements.whenDefined("n8n-demo").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <figure className={`${s.window} ${tall ? s.tall : ""}`}>
      <figcaption className={s.bar}>
        <span className={s.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={s.file}>{fileName}</span>
        <span className={active ? s.live : s.idle}>{active ? "Running now" : "n8n canvas"}</span>
      </figcaption>
      <div className={s.stage}>
        {/* Shown until n8n's canvas has loaded, and if its preview service is down. */}
        <div className={s.placeholder} aria-hidden="true">
          <Minimap map={map} />
        </div>
        {ready
          ? createElement("n8n-demo", {
              workflow: workflowJson,
              frame: "false",
              clicktointeract: "true",
              collapseformobile: "false",
              hidecanvaserrors: "true",
              theme: "light",
              class: s.demo,
            })
          : null}
      </div>
    </figure>
  );
}
