"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Clip-path reveal for large media. Used only on project visuals, so the
 * motion marks "here is the work" rather than decorating every section.
 * Reduced motion: the CSS shows the content immediately.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const [ref, shown] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-shown={shown} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
