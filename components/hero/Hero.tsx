"use client";

import { useRef, type CSSProperties } from "react";
import { site, sectionIds } from "@/data/site";
import { heroSky } from "@/data/sky";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Sky } from "@/components/sky/Sky";
import { useMotion, useScrollVars } from "@/lib/motion";

/* Each line leans toward the pointer by its own amount (--f) and, as the
   visitor scrolls away, slides out in its own direction (--dx). */
const lines = [
  { text: "Building", indent: "", f: 1, dx: "-16vw" },
  { text: "digital", indent: "pl-[14%] md:pl-[24%]", f: -0.6, dx: "12vw" },
  { text: "experiences.", indent: "xl:pl-[6%]", f: 0.4, dx: "-7vw" },
];

const disciplines = ["Web products", "Interfaces", "Full-stack systems", "Integrations", "AI-assisted development", "MCP servers"];

/**
 * Hairline orbits behind the title. Each body rides a circle that turns on
 * the compositor; the circle is squashed into the drawn ellipse by its
 * parent, so the body follows the ellipse exactly. The whole plate turns
 * further as the page scrolls.
 */
function OrbitPlate() {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    return {
      x: Math.round((400 + Math.cos(a) * 380) * 100) / 100,
      y: Math.round((400 + Math.sin(a) * 150) * 100) / 100,
      long: i % 6 === 0,
    };
  });
  return (
    <div
      aria-hidden
      data-scroll
      className="hero-orbits pointer-events-none absolute right-[-18vw] top-[4vh] aspect-square w-[min(1100px,110vw)] text-paper md:right-[-8vw]"
    >
      <svg viewBox="0 0 800 800" className="absolute inset-0 size-full">
        <ellipse cx="400" cy="400" rx="380" ry="150" fill="none" stroke="currentColor" strokeOpacity="0.09" />
        <ellipse cx="400" cy="400" rx="300" ry="118" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="2 7" />
        <ellipse cx="400" cy="400" rx="210" ry="82" fill="none" stroke="currentColor" strokeOpacity="0.07" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x} y1={t.y} x2={t.x} y2={t.y - (t.long ? 9 : 4)} stroke="currentColor" strokeOpacity={t.long ? 0.3 : 0.14} />
        ))}
      </svg>
      <div className="absolute inset-0" style={{ transform: "scaleY(0.3947)" }}>
        <div className="orbit-turn-slow absolute inset-0">
          <span className="absolute left-[2.5%] top-1/2 size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/50" />
        </div>
      </div>
      <div className="absolute inset-0" style={{ transform: "scaleY(0.3933)" }}>
        <div className="orbit-turn absolute inset-0">
          <span className="absolute left-[87.5%] top-1/2 size-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  useScrollVars(ref, { pointer: true });
  useMotion((s) => {
    const el = readout.current;
    if (!el) return;
    const f = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(3)}`;
    el.textContent = `x ${f(s.px)}  y ${f(-s.py)}`;
  });

  return (
    <section
      ref={ref}
      id="intro"
      data-scene="Opening"
      data-act="discover"
      aria-labelledby="hero-title"
      className="hero relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-8 pt-28 md:pb-10"
    >

      <div className="relative mx-auto w-full max-w-[1680px] px-5 md:px-10">

        <h2 id="hero-title" data-scroll aria-label={lines.map((l) => l.text).join(" ")} className="hero-title text-hero font-[560] text-paper">
          {lines.map((l, i) => (
            <span
              key={l.text}
              data-scroll
              className={`hero-line rise-mask ${l.indent}`}
              style={{ ["--f" as string]: l.f, ["--dx" as string]: l.dx }}
            >
              <span aria-hidden className="rise" style={{ ["--delay" as string]: `${120 + i * 110}ms` }}>
                {[...l.text].map((ch, j, all) => (
                  <span
                    key={j}
                    className="hero-letter"
                    style={{ "--c": ((j - (all.length - 1) / 2) / all.length).toFixed(3), "--c2": (((j * 37) % 7) - 3) / 3 } as CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h2>

        <div aria-hidden className="relative mt-10 h-px md:mt-14">
          <div className="trace-line absolute inset-0 bg-line-strong" />
          <span data-guide data-guide-label="begin" data-guide-at="0.72" className="absolute right-0 top-0 size-0" />
          <span className="trace-dot absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_14px_2px_rgb(233_180_76/0.55)]" />
        </div>

        <div data-scroll className="hero-foot mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-start">
          <div className="fade-in flex flex-wrap gap-3 [--delay:1500ms] md:order-2 md:col-span-5 md:col-start-8 md:justify-end lg:col-span-4 lg:col-start-9">
            <ButtonLink href={`#${sectionIds.work}`}>
              View work <Arrow direction="down" className="group-hover:translate-y-0.5" />
            </ButtonLink>
            <ButtonLink href={`#${sectionIds.contact}`} variant="line">
              Contact
            </ButtonLink>
          </div>
          <div className="fade-in max-w-[48ch] [--delay:900ms] md:order-1 md:col-span-6">
            <p className="text-lede text-paper">
              I build web products end to end: the interface people use, and the APIs, data and integrations underneath it.
            </p>
            <p className="mt-4 text-body text-mute">
              Recent work spans a contractor&rsquo;s CMS-driven website, a two-sided talent platform, an MCP server that lets Claude Code
              work a project board, and a bilingual marketing site. I build with AI coding agents and own what ships.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
