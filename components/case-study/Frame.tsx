import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Window for a project preview. The address bar names where the screen lives,
 * and the caption says plainly how the preview was made.
 */
export function Frame({
  address,
  caption,
  children,
  className,
  tone = "dark",
}: {
  address: string;
  caption: string;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <figure className={cn("m-0", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-lg)] border",
          tone === "dark" ? "border-line-strong bg-ink-2" : "border-line-strong bg-paper",
        )}
      >
        <div className={cn("flex h-9 items-center gap-3 border-b px-4", tone === "dark" ? "border-line" : "border-black/10")}>
          <span aria-hidden className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn("size-2 rounded-full", tone === "dark" ? "bg-paper/15" : "bg-black/15")} />
            ))}
          </span>
          <span className={cn("truncate text-[11px] tracking-[0.01em]", tone === "dark" ? "text-faint" : "text-black/55")}>{address}</span>
        </div>
        <div className="relative">{children}</div>
      </div>
      <figcaption className="mt-3 max-w-[60ch] text-meta tracking-[0.01em] text-faint">{caption}</figcaption>
    </figure>
  );
}
