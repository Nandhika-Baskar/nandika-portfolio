"use client";

import { createElement, type ReactNode } from "react";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Large headings rise out of a mask the first time they scroll into view.
 * The hidden starting state applies only once scripts run (html.js), so the
 * text is always readable without JavaScript, and reduced motion skips it.
 */
export function TextReveal({
  as = "h2",
  id,
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const [ref, shown] = useInView<HTMLElement>({ rootMargin: "0px 0px -10% 0px" });
  return createElement(
    as,
    { ref, id, className: cn("text-reveal", className), "data-shown": shown },
    <span className="rise-mask">
      <span className="text-reveal-inner">{children}</span>
    </span>,
  );
}
