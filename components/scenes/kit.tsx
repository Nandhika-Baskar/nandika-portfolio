import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ============================================================================
   Building blocks for the project worlds.

   A stage is a 1000 × 640 box. Lines live in one SVG that scales with it;
   nodes and labels are HTML placed by percentage, so text stays readable at
   any width. Everything changes state only when the scroll crosses a step,
   and CSS transitions do the moving: no per-frame work.
   ========================================================================== */

export const W = 1000;
export const H = 640;
export const px = (x: number) => `${(x / W) * 100}%`;
export const py = (y: number) => `${(y / H) * 100}%`;

export type WorldProps = {
  /** -1 before the first step, 0..n-1 while stepping, n once complete */
  step: number;
  n: number;
};

/** The stage: a fixed-ratio box with an SVG layer for lines. */
export function Stage({ children, lines, className }: { children?: ReactNode; lines?: ReactNode; className?: string }) {
  return (
    <div className={cn("stage relative w-full [container-type:inline-size]", className)} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {lines}
      </svg>
      {children}
    </div>
  );
}

/**
 * A connection that draws itself when `on`, and carries moving light while
 * `flow` is set. `dashed` makes a quieter, provisional line.
 */
export function Edge({
  d,
  on,
  flow,
  dashed,
  active,
  delay = 0,
  speed = 2.4,
}: {
  d: string;
  on: boolean;
  flow?: boolean;
  dashed?: boolean;
  active?: boolean;
  delay?: number;
  speed?: number;
}) {
  return (
    <g className="edge" data-on={on} data-active={active} style={{ "--delay": `${delay}ms`, "--speed": `${speed}s` } as CSSProperties}>
      <path d={d} pathLength={1} className={cn("edge-line", dashed && "edge-dashed")} />
      {flow && on && (
        <>
          <path d={d} pathLength={1} className="edge-particle" />
          <path d={d} pathLength={1} className="edge-particle edge-particle-2" />
        </>
      )}
    </g>
  );
}

/** A point in the world with a label. `shape` sets the mark; `active` lifts it. */
export function Node({
  x,
  y,
  on,
  active,
  shape = "dot",
  label,
  sub,
  side = "right",
  delay = 0,
  guide,
  className,
}: {
  x: number;
  y: number;
  on: boolean;
  active?: boolean;
  shape?: "dot" | "ring" | "square" | "diamond" | "spark" | "none";
  label?: ReactNode;
  sub?: ReactNode;
  side?: "right" | "left" | "top" | "bottom";
  delay?: number;
  /** Marks this node as where the guiding light rests during the scene */
  guide?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("node", className)}
      data-on={on}
      data-active={active}
      data-side={side}
      style={{ left: px(x), top: py(y), "--delay": `${delay}ms` } as CSSProperties}
      {...(guide ? { "data-guide": "", "data-guide-hold": "", "data-guide-mode": "node" } : {})}
    >
      <span className={cn("node-mark", `node-${shape}`)} aria-hidden>
        {shape === "spark" && (
          <svg viewBox="0 0 20 20">
            <path d="M10 0C10.6 6.2 13.8 9.4 20 10C13.8 10.6 10.6 13.8 10 20C9.4 13.8 6.2 10.6 0 10C6.2 9.4 9.4 6.2 10 0Z" />
          </svg>
        )}
      </span>
      {(label || sub) && (
        <span className="node-label">
          {label && <span className="block text-paper">{label}</span>}
          {sub && <span className="block text-faint">{sub}</span>}
        </span>
      )}
    </div>
  );
}

/** A small free label, for coordinates and annotations inside a world. */
export function Tag({ x, y, on, children, className }: { x: number; y: number; on: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn("world-tag", className)} data-on={on} style={{ left: px(x), top: py(y) }}>
      {children}
    </span>
  );
}
