"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Pulls its child a few pixels toward the cursor. Capped at 6px so it reads
 * as weight, not as a trick. Off on touch and for reduced motion.
 */
export function Magnetic({ children, className, strength = 0.18 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!active || !el) return;
    const r = el.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-6, Math.min(6, v));
    const x = clamp((e.clientX - (r.left + r.width / 2)) * strength);
    const y = clamp((e.clientY - (r.top + r.height / 2)) * strength);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("inline-block transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] will-change-transform", className)}
    >
      {children}
    </span>
  );
}
