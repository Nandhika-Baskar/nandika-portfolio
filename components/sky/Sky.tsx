"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { stayAwake, useMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { StarShape, type StarKind } from "./shapes";

/* ============================================================================
   A designed sky for one scene.

   Every star is placed by hand in data/sky.ts (x and y in % of the scene).
   Stars are grouped by depth into layers; one transform per layer carries
   pointer parallax and scroll parallax, so the page moves a handful of
   layers, never hundreds of nodes. Drift, rotation and twinkle are CSS.

   The small stars notice the cursor: they lean away from it and brighten,
   a hairline reaches from the nearest one to the pointer, and a second line
   links that star to its closest neighbour for as long as the cursor stays.
   ========================================================================== */

export type SkyStar = {
  x: number;
  y: number;
  /** Size in px at desktop; scales down on small screens */
  s: number;
  kind: StarKind;
  /** 0 = far, 1 = near */
  depth: number;
  /** Seconds per rotation; negative turns the other way; 0 = still */
  spin?: number;
  /** Seconds per drift loop */
  drift?: number;
  twinkle?: boolean;
  accent?: boolean;
  o?: number;
  rot?: number;
  /** Hide on narrow screens to keep mobile sparse */
  desktop?: boolean;
  /** Fades out completely now and then, and comes back */
  vanish?: boolean;
  /** Jumps between a few nearby positions, holding still in between */
  hop?: boolean;
  /** Breathes slowly in scale */
  pulse?: boolean;
};

type Live = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  depth: number;
  /** Base position in px within the scene, set on measure */
  bx: number;
  by: number;
  near: number;
  cx: number;
  cy: number;
  cs: number;
};

const REACH = 150;

export type Constellation = {
  id: string;
  /** Box position in % of the scene, top-left corner */
  x: number;
  y: number;
  /** Box width in % of the scene */
  w: number;
  /** Height / width */
  ratio: number;
  depth: number;
  /** Points in a 100 × (100·ratio) box */
  points: Array<[number, number]>;
  edges: Array<[number, number]>;
  /** Name shown beside the first point */
  name?: string;
  /** Small catalogue note under the name */
  note?: string;
  /** Point drawn as the bright star of the figure */
  lead?: number;
  desktop?: boolean;
};

export type Formation = {
  stars: SkyStar[];
  constellations?: Constellation[];
  /** Tiny technical labels floating in the field */
  labels?: Array<{ x: number; y: number; text: string; depth: number; desktop?: boolean }>;
};

const depthKey = (d: number) => Math.round(d * 10) / 10;

export function ConstellationFigure({ c, on }: { c: Constellation; on: boolean }) {
  const h = 100 * c.ratio;
  return (
    <div
      className={cn("sky-figure absolute", c.desktop && "hidden md:block")}
      data-on={on}
      style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, aspectRatio: `${1 / c.ratio}` }}
    >
      <svg viewBox={`0 0 100 ${h}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {c.edges.map(([a, b], i) => (
          <line
            key={i}
            x1={c.points[a][0]}
            y1={c.points[a][1]}
            x2={c.points[b][0]}
            y2={c.points[b][1]}
            pathLength={1}
            className="sky-edge"
            style={{ transitionDelay: on ? `${i * 140}ms` : "0ms" }}
          />
        ))}
      </svg>
      {c.points.map(([x, y], i) => (
        <span
          key={i}
          className="sky-node"
          data-lead={c.lead === i}
          style={{ left: `${x}%`, top: `${(y / h) * 100}%`, transitionDelay: on ? `${i * 90}ms` : "0ms" }}
        >
          <StarShape kind={c.lead === i ? "spark" : "node"} accent={c.lead === i} />
        </span>
      ))}
      {c.name && (
        <span className="sky-name" style={{ left: 0, top: "100%" }}>
          {c.name}
          {c.note && <span className="block text-faint">{c.note}</span>}
        </span>
      )}
    </div>
  );
}

/**
 * @param active  ids of constellations to draw. Omit to draw every figure when the scene comes into view.
 */
export function Sky({ formation, active, className }: { formation: Formation; active?: string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const layers = useRef<Map<number, HTMLDivElement>>(new Map());
  const box = useRef({ top: 0, left: 0, width: 1, height: 1, pinTop: 0, pinSpan: 0 });
  const live = useRef<Live[]>([]);
  const offsets = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lineCursor = useRef<SVGLineElement>(null);
  const lineLink = useRef<SVGLineElement>(null);
  const lineState = useRef({ o: 0, star: -1 });
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);

  const groups = useMemo(() => {
    const m = new Map<number, { stars: SkyStar[]; figures: Constellation[]; labels: NonNullable<Formation["labels"]> }>();
    const get = (d: number) => {
      const k = depthKey(d);
      if (!m.has(k)) m.set(k, { stars: [], figures: [], labels: [] });
      return m.get(k)!;
    };
    formation.stars.forEach((s) => get(s.depth).stars.push(s));
    formation.constellations?.forEach((c) => get(c.depth).figures.push(c));
    formation.labels?.forEach((l) => get(l.depth).labels.push(l));
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [formation]);

  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { rootMargin: "0px 0px -20% 0px" });
    const vis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(el);
    vis.observe(el);
    return () => {
      io.disconnect();
      vis.disconnect();
    };
  }, []);

  useMotion(
    (s) => {
      const { top, height, pinTop, pinSpan } = box.current;
      let rel = top - s.scroll;
      let drift = 0;
      if (pinSpan > 0) {
        // Inside a pinned scene the sky rides the sticky frame; while pinned
        // it only drifts slowly with progress.
        const r = pinTop - s.scroll;
        rel = r > 0 ? r : -r <= pinSpan ? 0 : r + pinSpan;
        if (r <= 0 && -r <= pinSpan) drift = r * 0.05;
      }
      if (rel > s.vh * 1.3 || rel + height < -s.vh * 0.3) return;
      // Distance of the scene centre from the viewport centre, px
      const off = rel + height / 2 - s.vh / 2 + drift;
      const small = s.vw < 768 ? 0.5 : 1;
      layers.current.forEach((el, d) => {
        const k = (d - 0.35) * 0.55; // near layers outrun the content, far layers lag behind it
        const x = -s.px * d * 34 * small;
        const y = off * k - s.py * d * 22 * small - s.velocity * d * 1.2;
        offsets.current.set(d, { x, y });
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });

      // The cursor in scene coordinates
      if (s.reduced) return;
      const mx = s.sx - box.current.left;
      const my = s.sy - rel;
      let best = -1;
      let bestD = REACH;
      const stars = live.current;
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const o = offsets.current.get(st.depth) ?? { x: 0, y: 0 };
        const sx = st.bx + o.x;
        const sy = st.by + o.y;
        const dx = sx - mx;
        const dy = sy - my;
        const dist = Math.hypot(dx, dy);
        // Lean away from the cursor and grow a little, more the closer it is
        const f = s.mouse && dist < REACH ? 1 - dist / REACH : 0;
        const tx = dist > 0 ? (dx / dist) * f * 14 : 0;
        const ty = dist > 0 ? (dy / dist) * f * 14 : 0;
        const ts = 1 + f * 0.7;
        if (Math.abs(tx - st.cx) + Math.abs(ty - st.cy) + Math.abs(ts - st.cs) * 10 > 0.05) {
          st.cx = tx;
          st.cy = ty;
          st.cs = ts;
          st.el.style.translate = `${tx.toFixed(2)}px ${ty.toFixed(2)}px`;
          st.el.style.scale = ts.toFixed(3);
        }
        if (s.mouse && dist < bestD) {
          bestD = dist;
          best = i;
        }
      }

      // Temporary lines: star to cursor, star to its nearest neighbour
      const lc = lineCursor.current;
      const ll = lineLink.current;
      if (!lc || !ll) return;
      const ls = lineState.current;
      const targetO = best >= 0 ? 1 - bestD / REACH : 0;
      if (best >= 0) ls.star = best;
      ls.o += (targetO - ls.o) * 0.2;
      if (Math.abs(targetO - ls.o) > 0.01) stayAwake();
      if (ls.star >= 0 && ls.o > 0.01) {
        const a = stars[ls.star];
        const oa = offsets.current.get(a.depth) ?? { x: 0, y: 0 };
        const ax = a.bx + oa.x + a.cx;
        const ay = a.by + oa.y + a.cy;
        lc.setAttribute("x1", ax.toFixed(1));
        lc.setAttribute("y1", ay.toFixed(1));
        lc.setAttribute("x2", mx.toFixed(1));
        lc.setAttribute("y2", my.toFixed(1));
        lc.style.opacity = (ls.o * 0.55).toFixed(3);
        const b = stars[a.near];
        if (b) {
          const ob = offsets.current.get(b.depth) ?? { x: 0, y: 0 };
          ll.setAttribute("x1", ax.toFixed(1));
          ll.setAttribute("y1", ay.toFixed(1));
          ll.setAttribute("x2", (b.bx + ob.x + b.cx).toFixed(1));
          ll.setAttribute("y2", (b.by + ob.y + b.cy).toFixed(1));
          ll.style.opacity = (Math.min(1, ls.o * 1.6) * 0.4).toFixed(3);
        }
      } else if (lc.style.opacity !== "0") {
        lc.style.opacity = "0";
        ll.style.opacity = "0";
      }
    },
    () => {
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pin = el.closest<HTMLElement>("[data-pin-root]");
      const pr = pin?.getBoundingClientRect();
      box.current = {
        top: r.top + window.scrollY,
        left: r.left,
        width: r.width,
        height: r.height,
        pinTop: pr ? pr.top + window.scrollY : 0,
        pinSpan: pin ? Math.max(0, pin.offsetHeight - window.innerHeight) : 0,
      };
      // Small, visible stars react; the big engraved ones only drift
      const found: Live[] = [];
      el.querySelectorAll<HTMLSpanElement>(".sky-star[data-react='true']").forEach((star) => {
        if (star.offsetParent === null) return; // hidden on this screen size
        const x = parseFloat(star.dataset.x!);
        const y = parseFloat(star.dataset.y!);
        found.push({ el: star, x, y, depth: parseFloat(star.dataset.depth!), bx: (x / 100) * r.width, by: (y / 100) * r.height, near: -1, cx: 0, cy: 0, cs: 1 });
      });
      found.forEach((a, i) => {
        let nd = Infinity;
        found.forEach((b, j) => {
          if (i === j) return;
          const d = Math.hypot(a.bx - b.bx, a.by - b.by);
          if (d < nd) {
            nd = d;
            a.near = j;
          }
        });
      });
      live.current = found;
    },
  );

  return (
    <div ref={root} aria-hidden className={cn("sky pointer-events-none absolute inset-0 overflow-hidden", className)} data-on={inView} data-visible={visible}>
      {groups.map(([d, g]) => (
        <div
          key={d}
          ref={(el) => {
            if (el) layers.current.set(d, el);
            else layers.current.delete(d);
          }}
          className="sky-layer absolute inset-0"
          style={{ ["--d" as string]: d } as CSSProperties}
        >
          {g.stars.map((s, i) => (
            <span
              key={i}
              className={cn("sky-star", s.desktop && "hidden md:block")}
              data-react={s.kind !== "contour" && s.s <= 48}
              data-x={s.x}
              data-y={s.y}
              data-depth={d}
              data-vanish={s.vanish}
              data-hop={s.hop}
              data-pulse={s.pulse}
              style={
                {
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  "--s": `${s.s}px`,
                  "--o": s.o ?? 0.85,
                  "--rot": `${s.rot ?? 0}deg`,
                  "--spin": s.spin ? `${Math.abs(s.spin)}s` : "0s",
                  "--dir": s.spin && s.spin < 0 ? "reverse" : "normal",
                  "--drift": `${s.drift ?? 18 + ((i * 7) % 13)}s`,
                  "--delay": `${-((i * 3.7) % 11)}s`,
                } as CSSProperties
              }
              data-twinkle={s.twinkle}
              data-spin={Boolean(s.spin)}
            >
              <span className="sky-star-drift">
                <span className="sky-star-spin">
                  <StarShape kind={s.kind} accent={s.accent} />
                </span>
              </span>
            </span>
          ))}
          {g.figures.map((c) => (
            <ConstellationFigure key={c.id} c={c} on={active ? active.includes(c.id) : inView} />
          ))}
          {g.labels.map((l, i) => (
            <span key={i} className={cn("sky-label", l.desktop && "hidden md:block")} style={{ left: `${l.x}%`, top: `${l.y}%` }}>
              {l.text}
            </span>
          ))}
        </div>
      ))}
      <svg className="absolute inset-0 size-full overflow-visible">
        <line ref={lineCursor} className="sky-reach" style={{ opacity: 0 }} />
        <line ref={lineLink} className="sky-reach sky-reach-link" style={{ opacity: 0 }} />
      </svg>
    </div>
  );
}
