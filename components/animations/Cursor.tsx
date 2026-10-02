"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

const INTERACTIVE = "a, button, [role='tab'], [role='option'], [role='radio'], [data-cursor]";
const TEXT_INPUT = "input, textarea, [contenteditable='true']";

/**
 * A small four-point spark that sits exactly on the pointer, and a ring that
 * trails it. Over anything clickable the ring opens around the spark and can
 * carry a word (data-cursor-label). Elements marked data-magnetic lean a few
 * pixels toward it. The system cursor comes back over text fields.
 * Mouse and trackpad only; off under reduced motion.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    const d = dot.current;
    const r = ring.current;
    const l = label.current;
    if (!d || !r || !l) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let moving = false;
    let magnet: HTMLElement | null = null;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      r.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.1) raf = requestAnimationFrame(tick);
      else moving = false;
    };

    const release = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      d.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      root.dataset.cursorVisible = "on";

      const el = e.target as Element | null;
      const hit = el?.closest?.(INTERACTIVE) as HTMLElement | null;
      const typing = Boolean(el?.closest?.(TEXT_INPUT));
      r.dataset.state = typing ? "text" : hit ? "hover" : "idle";
      d.dataset.state = typing ? "text" : hit ? "hover" : "idle";
      const text = (el?.closest?.("[data-cursor-label]") as HTMLElement | null)?.dataset.cursorLabel ?? "";
      if (l.textContent !== text) l.textContent = text;
      r.dataset.label = text ? "true" : "false";

      const m = el?.closest?.("[data-magnetic]") as HTMLElement | null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const b = m.getBoundingClientRect();
        const cap = (v: number) => Math.max(-7, Math.min(7, v));
        m.style.translate = `${cap((e.clientX - (b.left + b.width / 2)) * 0.2)}px ${cap((e.clientY - (b.top + b.height / 2)) * 0.25)}px`;
      }

      if (!moving) {
        moving = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => {
      root.dataset.cursorVisible = "off";
      release();
    };
    const onDown = () => (r.dataset.down = "true");
    const onUp = () => (r.dataset.down = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      release();
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <>
      <div ref={ring} aria-hidden className="cursor-ring" data-state="idle">
        <span className="cursor-ring-circle" />
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} aria-hidden className="cursor-dot" data-state="idle">
        <svg viewBox="0 0 20 20">
          <path d="M10 0C10.6 6.2 13.8 9.4 20 10C13.8 10.6 10.6 13.8 10 20C9.4 13.8 6.2 10.6 0 10C6.2 9.4 9.4 6.2 10 0Z" />
        </svg>
      </div>
    </>
  );
}
