"use client";

import { useEffect, useState } from "react";
import { site, sectionIds } from "@/data/site";
import { cn } from "@/lib/cn";
import { Clock } from "./Clock";
import { openPalette } from "./palette-events";

const links = [
  { label: "Work", id: sectionIds.work },
  { label: "About", id: sectionIds.about },
  { label: "Contact", id: sectionIds.contact },
];

/* The case studies sit between the index and Capabilities; they count as Work. */
const workRegion = (el: Element) => el.id === sectionIds.work || el.id.startsWith("project-");

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section sits in the middle band of the viewport.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("main > section[id], main article[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          setCurrent(workRegion(el) ? sectionIds.work : el.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-base)]",
        scrolled ? "border-b border-line bg-ink/75 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="text-meta font-medium uppercase tracking-[0.14em] text-paper">
          {site.monogram} <span className="text-faint">/</span> {site.name.toUpperCase()}
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <Clock className="mr-4 hidden text-meta tracking-[0.04em] text-mute lg:inline" />
          <ul className="hidden items-center sm:flex">
            {links.map((l) => {
              const here = current === l.id;
              return (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={here ? "location" : undefined}
                  data-magnetic
                  className={cn(
                    "nav-link group relative block px-3 py-2 text-meta font-medium uppercase tracking-[0.14em] transition-colors duration-[var(--duration-fast)] hover:text-paper",
                    here ? "text-paper" : "text-mute",
                  )}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-1 h-px origin-left bg-paper transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:scale-x-100",
                      here ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={openPalette}
            className="ml-2 hidden h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-line px-2.5 text-meta text-mute transition-colors hover:border-line-strong hover:text-paper sm:inline-flex"
            aria-label="Open command menu"
          >
            <kbd className="font-sans">{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd className="font-sans">K</kbd>
          </button>
          <button
            type="button"
            onClick={openPalette}
            className="inline-flex h-9 items-center rounded-[var(--radius-ctl)] border border-line-strong px-4 text-meta font-medium uppercase tracking-[0.14em] text-paper sm:hidden"
          >
            Menu
          </button>
        </div>
      </nav>
    </header>
  );
}
