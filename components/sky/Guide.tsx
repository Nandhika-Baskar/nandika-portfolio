"use client";

import { useRef } from "react";
import { stayAwake, useMotion } from "@/lib/motion";

/* ============================================================================
   The guiding light.

   One amber spark that travels the page. Elements marked [data-guide] are
   its resting places, in document order. Between two of them it arcs from
   one to the next as the visitor scrolls; at each it takes on a form:

     star    the spark itself
     marker  a crosshair, pointing at something to explore
     node    a point inside a project's world (held while the scene is pinned)
     orbit   a small body circling
     land    it settles into the full stop of the last line, and is gone

   [data-guide-hold] places sit inside a pinned scene: the light stays on
   them for as long as the scene is pinned. [data-guide-label] is a word or
   two that appears beside it when the visitor pauses there.
   ========================================================================== */

type Mode = "star" | "marker" | "node" | "orbit" | "land";
type Waypoint = {
  mode: Mode;
  label: string;
  /** Scroll positions where the light is exactly here */
  ta: number;
  tb: number;
  hold: boolean;
  /** Document position (regular) or screen position (hold) */
  x: number;
  y: number;
};

/** Position of an element ignoring transforms, relative to an ancestor (or the document). */
function offsetWithin(el: HTMLElement, stop: Element | null) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== stop) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function Guide() {
  const light = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const trail = useRef<Array<HTMLSpanElement | null>>([]);
  const points = useRef<Waypoint[]>([]);
  const pos = useRef({ x: -100, y: -100, ready: false });
  const trailPos = useRef(Array.from({ length: 4 }, () => ({ x: -100, y: -100 })));
  const rest = useRef<{ timer: number; label: string; shown: boolean }>({ timer: 0, label: "", shown: false });
  const modeRef = useRef<Mode | "">("");

  useMotion(
    (s) => {
      const el = light.current;
      const pts = points.current;
      if (!el || pts.length === 0) return;
      const scroll = s.scroll;
      const screen = (w: Waypoint) => (w.hold ? { x: w.x, y: w.y } : { x: w.x, y: w.y - scroll });

      let tx = 0;
      let ty = 0;
      let mode: Mode = pts[0].mode;
      let resting: Waypoint | null = null;
      let landed = 0;

      if (scroll <= pts[0].tb) {
        ({ x: tx, y: ty } = screen(pts[0]));
        resting = Math.abs(scroll - pts[0].tb) < 60 || scroll < pts[0].tb ? pts[0] : null;
      } else {
        const last = pts[pts.length - 1];
        if (scroll >= last.ta) {
          ({ x: tx, y: ty } = screen(last));
          mode = last.mode;
          resting = last;
          landed = 1;
        }
        for (let i = 0; i < pts.length - 1 && !landed; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          if (scroll >= a.ta && scroll <= a.tb) {
            ({ x: tx, y: ty } = screen(a));
            mode = a.mode;
            resting = a;
            break;
          }
          if (scroll > a.tb && scroll < b.ta) {
            const t = smooth((scroll - a.tb) / Math.max(1, b.ta - a.tb));
            const pa = screen(a);
            const pb = screen(b);
            // A gentle arc, bowing toward the outer edge
            const bow = Math.sin(Math.PI * t) * Math.min(90, s.vw * 0.08) * (pa.x > s.vw / 2 ? 1 : -1);
            tx = pa.x + (pb.x - pa.x) * t + bow;
            ty = pa.y + (pb.y - pa.y) * t;
            mode = t < 0.5 ? a.mode : b.mode;
            if (Math.abs(scroll - a.tb) < 40) resting = a;
            else if (Math.abs(scroll - b.ta) < 40) resting = b;
            break;
          }
        }
      }

      // Ease toward the target so it feels carried, not attached
      const p = pos.current;
      if (!p.ready || s.reduced) {
        p.x = tx;
        p.y = ty;
        p.ready = true;
      } else {
        p.x += (tx - p.x) * 0.22;
        p.y += (ty - p.y) * 0.22;
        if (Math.abs(tx - p.x) + Math.abs(ty - p.y) > 0.3) stayAwake();
      }
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      const flip = p.x > s.vw - 180 ? "true" : "false";
      if (el.dataset.flip !== flip) el.dataset.flip = flip;

      // The trail: each mote follows the one before it
      let lead = { x: p.x, y: p.y };
      trailPos.current.forEach((t, i) => {
        t.x += (lead.x - t.x) * (0.34 - i * 0.05);
        t.y += (lead.y - t.y) * (0.34 - i * 0.05);
        const m = trail.current[i];
        if (m) m.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0)`;
        lead = t;
      });
      if (Math.abs(lead.x - p.x) + Math.abs(lead.y - p.y) > 0.5 && !s.reduced) stayAwake();

      if (mode !== modeRef.current) {
        modeRef.current = mode;
        el.dataset.mode = mode;
      }
      const land = landed === 1 && mode === "land";
      if ((document.documentElement.dataset.guideLanded === "true") !== land) {
        document.documentElement.dataset.guideLanded = land ? "true" : "false";
      }

      // A word appears beside it only once the visitor has paused here
      const r = rest.current;
      const want = resting && Math.abs(s.velocity) < 0.15 ? resting.label : "";
      if (want !== r.label) {
        r.label = want;
        window.clearTimeout(r.timer);
        if (label.current) label.current.dataset.on = "false";
        if (want) {
          r.timer = window.setTimeout(() => {
            if (!label.current) return;
            label.current.textContent = want;
            label.current.dataset.on = "true";
          }, 900);
        }
      }
    },
    () => {
      const vh = window.innerHeight;
      const found: Waypoint[] = [];
      document.querySelectorAll<HTMLElement>("[data-guide]").forEach((el) => {
        if (el.offsetParent === null && getComputedStyle(el).position !== "fixed") return;
        const mode = (el.dataset.guideMode as Mode) || "star";
        const lbl = el.dataset.guideLabel ?? "";
        if (el.hasAttribute("data-guide-hold")) {
          const root = el.closest<HTMLElement>("[data-pin-root]");
          const inner = el.closest<HTMLElement>("[data-pin-inner]");
          if (!root || !inner) return;
          const rootTop = offsetWithin(root, null).y - root.offsetHeight / 2;
          const at = offsetWithin(el, inner);
          // Begin holding once the world is on stage, a little into the pin
          const span = root.offsetHeight - vh;
          found.push({ mode, label: lbl, hold: true, x: at.x, y: at.y, ta: rootTop + span * 0.14, tb: rootTop + span * 0.98 });
        } else {
          const at = offsetWithin(el, null);
          const anchor = parseFloat(el.dataset.guideAt ?? "0.5");
          const t = Math.max(0, at.y - vh * anchor);
          found.push({ mode, label: lbl, hold: false, x: at.x, y: at.y, ta: t, tb: t });
        }
      });
      found.sort((a, b) => a.ta - b.ta);
      points.current = found;
    },
  );

  return (
    <div aria-hidden className="guide-layer pointer-events-none fixed inset-0 z-[45] overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          ref={(el) => {
            trail.current[i] = el;
          }}
          className="guide-mote"
          style={{ opacity: 0.32 - i * 0.07 }}
        />
      ))}
      <div ref={light} className="guide" data-mode="star">
        <span className="guide-body">
          <svg viewBox="0 0 20 20" className="guide-spark">
            <path d="M10 0C10.6 6.2 13.8 9.4 20 10C13.8 10.6 10.6 13.8 10 20C9.4 13.8 6.2 10.6 0 10C6.2 9.4 9.4 6.2 10 0Z" />
          </svg>
          <svg viewBox="0 0 20 20" className="guide-marker">
            <path d="M10 0V6M10 14V20M0 10H6M14 10H20" />
            <rect x="7" y="7" width="6" height="6" />
          </svg>
        </span>
        <span ref={label} className="guide-label" data-on="false" />
      </div>
    </div>
  );
}
