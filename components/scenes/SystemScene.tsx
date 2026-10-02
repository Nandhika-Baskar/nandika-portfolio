"use client";

import { useRef, useState, type CSSProperties, type ComponentType } from "react";
import { projects, type Project } from "@/data/projects";
import { systems } from "@/data/systems";
import { projectSky } from "@/data/sky";
import { Sky } from "@/components/sky/Sky";
import { Arrow } from "@/components/ui/Button";
import { clamp, useMotion } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { WorldProps } from "./kit";
import { DiamondWorld } from "./DiamondWorld";
import { TalentWorld } from "./TalentWorld";
import { OrcusWorld } from "./OrcusWorld";
import { EntugoWorld } from "./EntugoWorld";

const worlds: Record<Project["id"], ComponentType<WorldProps>> = {
  "diamond-edge": DiamondWorld,
  "talent-ai": TalentWorld,
  orcus: OrcusWorld,
  entugo: EntugoWorld,
};

/** Catalogue flavour for each chapter: decoration, not data */
const coords: Record<Project["id"], string> = {
  "diamond-edge": "RA 01h 18m · +08° 14′",
  "talent-ai": "RA 02h 44m · −03° 51′",
  orcus: "RA 03h 07m · +11° 02′",
  entugo: "RA 04h 26m · +52° 31′",
};

/** Scroll height per step, in viewport heights */
const PER_STEP = 52;

/**
 * A project as a scene the visitor scrolls through. It opens as typography;
 * the title steps aside, and the project's world assembles step by step
 * while a quiet narration explains what is happening. Scrolling is the only
 * thing required; the step marks can be clicked to jump.
 */
export function SystemScene({ project }: { project: Project }) {
  const flow = systems.find((s) => s.id === project.systemId)!;
  const World = worlds[project.id];
  const n = flow.steps.length;
  const U = n + 2; // intro + steps + finale
  const index = projects.indexOf(project);
  const flip = index % 2 === 1;
  const reduced = useReducedMotion();

  const ref = useRef<HTMLElement>(null);
  const box = useRef({ top: 0, height: 1 });
  const targets = useRef<HTMLElement[]>([]);
  const last = useRef("");
  const [step, setStep] = useState(-1);
  const stepRef = useRef(-1);

  useMotion(
    (s) => {
      if (!ref.current) return;
      const { top, height } = box.current;
      const rel = top - s.scroll;
      if (rel > s.vh * 1.2 || rel + height < -s.vh * 0.2) return;
      const pin = clamp(-rel / Math.max(1, height - s.vh));
      const enter = clamp((s.vh - rel) / s.vh);
      const p = pin.toFixed(4);
      const e = enter.toFixed(4);
      const key = `${p}|${e}|${s.px.toFixed(3)}|${s.py.toFixed(3)}`;
      if (key !== last.current) {
        last.current = key;
        // The intro layer only changes while it is visible: once the world
        // has taken over, stop writing to it.
        const g = enter - 1 + pin * U;
        const introLive = g < 1.6;
        for (const el of targets.current) {
          if (!introLive && el.dataset.phase === "intro" && el.dataset.settled === "1") continue;
          el.style.setProperty("--pin", p);
          el.style.setProperty("--e", e);
          el.style.setProperty("--px", s.px.toFixed(4));
          el.style.setProperty("--py", s.py.toFixed(4));
          if (el.dataset.phase === "intro") el.dataset.settled = introLive ? "0" : "1";
        }
      }
      const u = pin * U;
      const next = u < 1 ? -1 : Math.min(n, Math.floor(u - 1));
      if (next !== stepRef.current) {
        stepRef.current = next;
        setStep(next);
      }
    },
    () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      box.current = { top: r.top + window.scrollY, height: r.height };
      targets.current = Array.from(el.querySelectorAll<HTMLElement>("[data-scroll]"));
    },
  );

  const jump = (i: number) => {
    const { top, height } = box.current;
    const y = top + ((i + 1.5) / U) * (height - window.innerHeight);
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };

  const titleId = `project-${project.id}-title`;
  const words = project.name.split(" ");
  const finale = flow.finale ?? { label: "The whole system", detail: flow.outcome, where: "" };

  /* ----- Reduced motion: the same content, complete and still ----- */
  if (reduced) {
    return (
      <section ref={ref} id={`scene-${project.id}`} data-act="work" data-act-sub={`${project.number} / 04`} data-scene={project.name} className="relative px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1680px]">
          <p className="flex justify-between text-meta uppercase text-faint">
            <span>
              Chapter {project.number} / 04
            </span>
            <span>{project.period}</span>
          </p>
          <h3 id={titleId} className="mt-10 text-display font-[560] text-paper">
            {project.name}
          </h3>
          <p className="mt-5 max-w-[40ch] text-lede text-mute">{project.summary}</p>
          <div className="mt-12">
            <World step={n} n={n} />
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {flow.steps.map((s, i) => (
              <li key={s.label} className="border-t border-line pt-4">
                <p className="text-meta tabular-nums text-faint">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-body text-paper">{s.label}</p>
                <p className="mt-1 text-small text-mute">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  /* ----- The scene ----- */
  return (
    <section
      ref={ref}
      id={`scene-${project.id}`}
      data-act="work"
      data-act-sub={`${project.number} / 04`}
      data-scene={project.name}
      data-pin-root
      className="scene relative"
      style={{ height: `calc(100svh + ${U * PER_STEP}vh)`, "--units": U, "--dir": flip ? 1 : -1 } as CSSProperties}
      aria-labelledby={titleId}
    >
      <div data-pin-inner className="sticky top-0 h-[100svh] overflow-hidden">
        <Sky formation={projectSky(project.id, flip)} />

        {/* the oversized numeral, with its catalogue line orbiting it */}
        <div
          data-scroll
          aria-hidden
          className={cn("scene-num pointer-events-none absolute bottom-[-8vh] select-none opacity-60", flip ? "right-[-2vw]" : "right-[-2vw]")}
        >
          <span className="chapter-num block text-[48vw] font-[600] leading-[0.8] tracking-[-0.07em] md:text-[30vw]">{project.number}</span>
          <svg viewBox="0 0 200 200" className="orbit-text absolute left-1/2 top-1/2 w-[30vw] -translate-x-1/2 -translate-y-1/2 md:w-[15vw]">
            <defs>
              <path id={`ring-${project.id}`} d="M100 100m-86 0a86 86 0 1 1 172 0a86 86 0 1 1 -172 0" />
            </defs>
            <text className="fill-[var(--color-faint)] text-[6.4px] uppercase tracking-[0.3em]">
              <textPath href={`#ring-${project.id}`}>
                Chapter {project.number} · {project.name} · {coords[project.id]} ·
              </textPath>
            </text>
          </svg>
        </div>

        <div className="relative mx-auto h-full max-w-[1680px] px-5 md:px-10">
          {/* top line */}
          <div className="flex items-baseline justify-between gap-6 border-t border-line-strong pt-4 text-meta uppercase text-faint md:pt-5" style={{ marginTop: "max(4.5rem, 9vh)" }}>
            <span className="tabular-nums">
              Chapter {project.number} <span className="text-line-strong">/</span> 04
            </span>
            <span data-scroll data-phase="intro" className="scene-signal hidden md:inline">
              Signal {project.number} · acquired
            </span>
            <span className="hidden tabular-nums lg:inline">{coords[project.id]}</span>
            <span className="tabular-nums">{project.period}</span>
          </div>

          {/* the title, which steps aside when the world begins */}
          <div className="absolute inset-x-5 top-[19vh] bottom-[7vh] flex flex-col md:left-10 md:right-auto md:top-[21vh] md:w-[min(46vw,640px)]">
          <div data-scroll className="scene-title shrink-0">
            <h3 id={titleId} className="text-[clamp(2.4rem,min(6.4vw,9.5vh),6.5rem)] font-[560] leading-[0.94] tracking-[-0.045em] text-paper">
              {words.map((w, i) => (
                <span key={w} className="scene-word block" style={{ "--w": i } as CSSProperties}>
                  {w}
                </span>
              ))}
            </h3>
          </div>

          {/* what reveals itself before the world assembles */}
          <div data-scroll data-phase="intro" className="scene-intro mt-[min(5vh,2.5rem)] max-w-[42ch] min-h-0">
            <p data-scroll data-phase="intro" className="scene-reveal text-lede text-mute" style={{ "--t": 0.1 } as CSSProperties}>
              {project.summary}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-small">
              <div data-scroll data-phase="intro" className="scene-reveal" style={{ "--t": 0.3 } as CSSProperties}>
                <dt className="text-meta uppercase text-faint">Role</dt>
                <dd className="mt-1 text-paper">{project.role}</dd>
              </div>
              <div data-scroll data-phase="intro" className="scene-reveal" style={{ "--t": 0.45 } as CSSProperties}>
                <dt className="text-meta uppercase text-faint">Built with</dt>
                <dd className="mt-1 text-paper">{project.stack.slice(0, 4).join(", ")}</dd>
              </div>
              <div data-scroll data-phase="intro" className="scene-reveal col-span-2" style={{ "--t": 0.6 } as CSSProperties}>
                <dt className="text-meta uppercase text-faint">Live</dt>
                <dd className="mt-1">
                  {project.link ? (
                    <a
                      href={project.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor-label="Visit"
                      className="group inline-flex items-center gap-1.5 text-paper underline decoration-line-strong underline-offset-4 hover:decoration-paper"
                    >
                      {project.link.label}
                      <Arrow direction="up-right" className="size-3" />
                    </a>
                  ) : (
                    <span className="text-mute">Private application, no public link</span>
                  )}
                </dd>
              </div>
            </dl>
            <p data-scroll data-phase="intro" className="scene-reveal mt-6 flex items-center gap-2 text-meta uppercase text-faint" style={{ "--t": 0.75 } as CSSProperties}>
              <span aria-hidden className="scroll-cue block h-6 w-px bg-line-strong" />
              Keep scrolling to watch it work
            </p>
          </div>

          </div>

          {/* the world */}
          <div
            data-scroll
            className="scene-stage absolute left-5 right-5 top-[30vh] md:left-[36vw] md:right-10 md:top-[18vh] md:bottom-[10vh] md:flex md:items-center"
          >
            <div className="w-full">
              <World step={step} n={n} />
            </div>
          </div>

          {/* narration */}
          <div data-scroll className="scene-panel absolute bottom-[8vh] left-5 right-5 md:bottom-[12vh] md:left-10 md:right-auto md:w-[28vw]">
            <div className="flex items-center gap-3 text-meta uppercase tabular-nums text-faint">
              <span>{step < 0 ? "—" : step >= n ? "Complete" : `${String(step + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`}</span>
              <span className="flex gap-1">
                {flow.steps.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => jump(i)}
                    aria-label={`Go to step ${i + 1}: ${s.label}`}
                    data-cursor-label={s.short ?? s.label}
                    className="group flex h-6 w-4 items-center justify-center"
                  >
                    <span
                      className={cn(
                        "block h-px w-full transition-colors duration-[var(--duration-base)]",
                        i === step ? "bg-signal" : i < step ? "bg-paper/70" : "bg-line-strong group-hover:bg-mute",
                      )}
                    />
                  </button>
                ))}
              </span>
            </div>
            <div aria-hidden className="relative mt-3 min-h-[9.5rem] md:min-h-[12rem]">
              {[...flow.steps, finale].map((s, i) => (
                <div key={s.label} className="scene-step absolute inset-x-0 top-0" data-on={i === step || (i === n && step >= n)}>
                  <p className="flex flex-wrap items-center gap-2 text-lede text-paper">
                    {s.label}
                    {"guard" in s && Boolean(s.guard) && (
                      <span className="rounded-full border border-signal/40 px-2 py-0.5 text-meta text-signal">can stop the request</span>
                    )}
                  </p>
                  <p className="mt-2 text-small text-mute md:text-body">{s.detail}</p>
                  {s.where && <p className="mt-2 break-words text-meta text-faint">In the code: {s.where}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* the whole sequence, for screen readers */}
      <ol className="sr-only">
        {flow.steps.map((s) => (
          <li key={s.label}>
            {s.label}: {s.detail}
          </li>
        ))}
        <li>{flow.outcome}</li>
      </ol>
    </section>
  );
}
