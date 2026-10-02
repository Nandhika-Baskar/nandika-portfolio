import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/animations/Magnetic";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "line";
  children: ReactNode;
};

/** Link styled as a button. Pill shape is reserved for actions. */
export function ButtonLink({ variant = "solid", className, children, ...rest }: Props) {
  return (
    <Magnetic>
      <a
        {...rest}
        className={cn(
          "group inline-flex h-12 items-center gap-3 rounded-[var(--radius-ctl)] px-6 text-small font-medium tracking-[-0.005em]",
          "transition-[background-color,color,border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] active:scale-[0.97]",
          variant === "solid"
            ? "bg-paper text-ink hover:bg-white"
            : "border border-line-strong text-paper hover:border-paper/60 hover:bg-ink-3",
          className,
        )}
      >
        {children}
      </a>
    </Magnetic>
  );
}

/** Small arrow glyph drawn in SVG so it inherits colour and nudges on hover. */
export function Arrow({ className, direction = "right" }: { className?: string; direction?: "right" | "down" | "up-right" }) {
  const rotate = direction === "down" ? "rotate-90" : direction === "up-right" ? "-rotate-45" : "";
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn("size-3.5 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)]", rotate, className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
