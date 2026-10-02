"use client";

import { useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { projects, type Project } from "@/data/projects";
import { Sky } from "@/components/sky/Sky";
import { useScrollVars } from "@/lib/motion";
import { systems } from "@/data/systems";
import { Arrow } from "@/components/ui/Button";
import { SystemScene } from "@/components/scenes/SystemScene";
import { cn } from "@/lib/cn";
import { DiamondEdgeVisual } from "./DiamondEdgeVisual";
import { TalentVisual } from "./TalentVisual";
import { OrcusVisual } from "./OrcusVisual";
import { EntugoVisual } from "./EntugoVisual";

const visuals = {
  "diamond-edge": DiamondEdgeVisual,
  "talent-ai": TalentVisual,
  orcus: OrcusVisual,
  entugo: EntugoVisual,
} as const;

/** A labelled chapter: small label on the left, content on the right. Stacks on mobile. */
function Chapter({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-4 border-t border-line pt-5 md:grid-cols-12 md:gap-6 md:pt-6", className)}>
      <h4 className="text-meta uppercase text-faint md:col-span-3">{label}</h4>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </div>
  );
}

export function ProjectStory({ project }: { project: Project }) {
  const Visual = visuals[project.id];
  const titleId = `project-${project.id}-title`;
  const detailsId = useId();
  const [open, setOpen] = useState(false);
  const plate = useRef<HTMLDivElement>(null);
  useScrollVars(plate);
  // Chapters alternate: odd ones enter from the left, even from the right.
  const flip = projects.indexOf(project) % 2 === 1;

  return (
    <article
      id={`project-${project.id}`}
      aria-labelledby={titleId}
      className="chapter relative scroll-mt-0 overflow-x-clip"
      style={{ "--dir": flip ? 1 : -1 } as CSSProperties}
    >
      <SystemScene project={project} />
      <div className="relative mx-auto max-w-[1680px] px-5 pb-20 md:px-10 md:pb-32">
        <p className="flex items-baseline justify-between border-t border-line pt-5 text-meta uppercase text-faint">
          <span>The story behind {project.number}</span>
          <span className="hidden sm:inline">{project.category}</span>
        </p>

        {/* The story */}
        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-6">
          <aside className="lg:col-span-3">
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-3 lg:sticky lg:top-24 lg:grid-cols-1">
              <div>
                <dt className="text-meta uppercase text-faint">Role</dt>
                <dd className="mt-1.5 text-small text-paper">{project.role}</dd>
              </div>
              <div>
                <dt className="text-meta uppercase text-faint">Product type</dt>
                <dd className="mt-1.5 text-small text-paper">{project.category}</dd>
              </div>
              <div>
                <dt className="text-meta uppercase text-faint">Live</dt>
                <dd className="mt-1.5 text-small">
                  {project.link ? (
                    <>
                      <a
                        href={project.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor
                        className="group inline-flex items-center gap-1.5 text-paper underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-paper"
                      >
                        {project.link.label}
                        <Arrow direction="up-right" className="size-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                      {project.link.note && <span className="block text-faint">{project.link.note}</span>}
                    </>
                  ) : (
                    <span className="text-mute">Private application, no public link</span>
                  )}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="space-y-10 lg:col-span-9 md:space-y-12">
            <Chapter label="The product">
              <p className="max-w-[58ch] text-body text-paper">{project.product}</p>
            </Chapter>
            <Chapter label="The problem">
              <p className="max-w-[58ch] text-body text-mute">{project.problem}</p>
            </Chapter>
            <Chapter label="The contribution">
              <p className="max-w-[58ch] text-body text-paper">{project.intro}</p>
            </Chapter>
            <Chapter label="The stack">
              <ul className="flex flex-wrap gap-2" aria-label="Built with">
                {project.stack.map((t) => (
                  <li key={t} className="rounded-full border border-line-strong px-3 py-1 text-small text-paper">
                    {t}
                  </li>
                ))}
              </ul>
              <ul className="mt-2 flex flex-wrap gap-2" aria-label="Integrations">
                {project.integrations.map((t) => (
                  <li key={t} className="rounded-full border border-dashed border-line-strong px-3 py-1 text-small text-mute">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-meta text-faint">Solid: built with. Dashed: services it integrates.</p>
            </Chapter>
          </div>
        </div>

        {/* Visual */}
        <div className="mt-16 md:mt-24">
          <p className="mb-6 flex justify-between text-meta uppercase text-faint">
            <span>The visual</span>
            <span>Plate {project.number}</span>
          </p>
          <div ref={plate} data-scroll className="plate corners">
            <span aria-hidden className="corner tl" />
            <span aria-hidden className="corner tr" />
            <span aria-hidden className="corner bl" />
            <span aria-hidden className="corner br" />
            <Visual />
          </div>
        </div>

        {/* Key details, expandable */}
        <div className="mt-16 border-t border-line md:mt-24">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((o) => !o)}
            data-cursor
            className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
          >
            <span>
              <span className="block text-meta uppercase text-faint">Key details</span>
              <span className="mt-2 block text-title font-[520] text-paper transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] md:group-hover:translate-x-2">
                {open ? "Close the case study" : "Open the full case study"}
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "relative flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[transform,background-color,border-color] duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:border-paper/60",
                open && "rotate-45 bg-paper",
              )}
            >
              <span className={cn("absolute h-px w-4", open ? "bg-ink" : "bg-paper")} />
              <span className={cn("absolute h-4 w-px", open ? "bg-ink" : "bg-paper")} />
            </span>
          </button>

          <div id={detailsId} className={cn("expand", open && "expand-open")} inert={!open}>
            <div className="overflow-hidden">
              <ul className="grid gap-x-10 gap-y-10 pb-6 pt-2 sm:grid-cols-2 xl:grid-cols-3">
                {project.highlights.map((h, i) => (
                  <li key={h.title} className="border-t border-line pt-5">
                    <p className="text-meta tabular-nums text-faint">{String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-2 text-body font-medium text-paper">{h.title}</p>
                    <p className="mt-2 text-small text-mute">{h.body}</p>
                    <p className="mt-3 break-words text-meta tracking-[0.01em] text-faint">In the code: {h.evidence}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-4 border-t border-line pb-10 pt-6 md:grid-cols-12 md:gap-6">
                <h5 className="text-meta uppercase text-faint md:col-span-3">Worth knowing</h5>
                <ul className="space-y-2 text-small text-mute md:col-span-9">
                  {project.notes.map((n) => (
                    <li key={n} className="flex gap-3">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-b border-line" />
        </div>
      </div>
    </article>
  );
}
