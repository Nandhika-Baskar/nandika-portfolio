"use client";

import { useRef, useState } from "react";
import { projects, type ProjectId } from "@/data/projects";
import { sectionIds } from "@/data/site";
import { figure, workSky } from "@/data/sky";
import { Arrow } from "@/components/ui/Button";
import { ConstellationFigure, Sky } from "@/components/sky/Sky";
import { useScrollVars } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * The index of work as a star chart. Each row carries its project's
 * constellation; hovering a row draws it, slides the name, and brings up
 * the metadata. The heading drifts sideways as the section scrolls past.
 */
export function WorkIndex() {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<ProjectId | null>(null);
  useScrollVars(ref);

  return (
    <section
      ref={ref}
      id={sectionIds.work}
      data-scene="Selected work"
      data-act="explore"
      data-hover={hovered ? "true" : "false"}
      aria-labelledby="work-title"
      className="work relative overflow-x-clip px-5 pb-24 pt-24 md:px-10 md:pb-36 md:pt-40"
    >
      <Sky formation={workSky} />
      <div className="relative mx-auto max-w-[1680px]">
        <div className="mb-12 grid gap-6 md:mb-20 md:grid-cols-12">
          <h2 id="work-title" className="work-title text-display font-[560] md:col-span-7">
            <span data-scroll className="work-title-1 block">Selected</span>
            <span data-scroll className="work-title-2 block pl-[12%] text-mute">work</span>
          </h2>
          <div className="self-end md:col-span-4 md:col-start-9">
            <p className="relative text-meta uppercase text-faint">
              <span data-guide data-guide-mode="marker" data-guide-label="explore" data-guide-at="0.42" className="absolute -left-5 top-1/2 size-0" />
              Index · 01—04
            </p>
            <p className="mt-3 max-w-[40ch] text-body text-mute">
              Four projects from 2026. Each case study shows the product, the problem, what I built and a live trace of how it works
              underneath.
            </p>
          </div>
        </div>

        <ol className="border-t border-line" onPointerLeave={() => setHovered(null)}>
          {projects.map((p) => {
            const on = hovered === p.id;
            return (
              <li key={p.id} className="relative border-b border-line">
                <ConstellationFigure c={figure(p.id, { x: 74, y: -30, w: 9.5, depth: 0, desktop: true })} on={on} />
                <a
                  href={`#project-${p.id}`}
                  onPointerEnter={() => setHovered(p.id)}
                  onFocus={() => setHovered(p.id)}
                  onBlur={() => setHovered(null)}
                  data-cursor-label={`Open ${p.number}`}
                  data-on={on}
                  className="work-row group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 md:grid-cols-12 md:gap-x-6 md:py-10"
                >
                  <span aria-hidden className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-signal transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
                  <span className="self-start pt-1.5 text-small tabular-nums text-faint md:col-span-1 md:self-center md:pl-4 md:pt-0">
                    <span className="work-num relative inline-block">
                      {p.number}
                      <span aria-hidden className="work-num-hint">
                        ch. {p.number} · {p.integrations[0]}
                      </span>
                    </span>
                  </span>
                  <span className="md:col-span-6">
                    <span className="work-name block text-title font-[540] text-paper">{p.name}</span>
                    <span className="work-meta mt-2 hidden text-meta uppercase text-faint md:block" aria-hidden={!on}>
                      {[...p.stack.slice(0, 3), p.integrations[0]].join("  ·  ")}
                    </span>
                    <span className="mt-2 block text-small text-mute md:hidden">
                      {p.category}
                      <br />
                      <span className="text-faint">{p.period}</span>
                    </span>
                  </span>
                  <span className="hidden text-small text-mute md:col-span-2 md:block">{p.category}</span>
                  <span className="work-period hidden text-small tabular-nums text-faint md:col-span-2 md:block">{p.period}</span>
                  <span className={cn("flex justify-end pr-1 text-mute transition-colors group-hover:text-paper md:col-span-1 md:pr-4")}>
                    <Arrow direction="down" className="group-hover:translate-y-0.5" />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
