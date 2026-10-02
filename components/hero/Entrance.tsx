"use client";

import { useRef } from "react";
import { useScrollVars } from "@/lib/motion";

/** A four-point star with concave sides, in a 100 × 100 box. */
const STAR = "M50 2L61 38H98L68 60L79 96L50 74L21 96L32 60L2 38H39Z";

/** A large star drawn in halftone: fine dots at the edge, heavier dots inside. */
function HalftoneStar({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <defs>
        <pattern id={`${id}-a`} width="2.2" height="2.2" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r="0.42" fill="var(--color-paper)" />
        </pattern>
        <pattern id={`${id}-b`} width="2.2" height="2.2" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r="0.85" fill="var(--color-paper)" />
        </pattern>
        <clipPath id={`${id}-in`}>
          <path d={STAR} transform="translate(50 50) scale(0.62) translate(-50 -50)" />
        </clipPath>
        <clipPath id={`${id}-out`}>
          <path d={STAR} />
        </clipPath>
      </defs>
      <rect width="100" height="100" fill={`url(#${id}-a)`} clipPath={`url(#${id}-out)`} />
      <rect width="100" height="100" fill={`url(#${id}-b)`} clipPath={`url(#${id}-in)`} />
      <path d={STAR} fill="none" stroke="var(--color-paper)" strokeWidth="0.25" strokeDasharray="0.8 1.6" opacity="0.6" />
    </svg>
  );
}

/**
 * The entrance: the name, split around a turning engraved star, between two
 * large halftone stars cropped by the frame. Everything leans with the
 * cursor at its own depth; scrolling carries the visitor into the work.
 */
export function Entrance() {
  const ref = useRef<HTMLElement>(null);
  useScrollVars(ref, { pointer: true });

  return (
    <section ref={ref} id="top" data-act="enter" aria-label="Entrance" className="entrance relative h-[100svh] overflow-hidden">
      <div data-scroll className="ent-far pointer-events-none absolute -right-[24vmin] top-[8vh] size-[70vmin]">
        <HalftoneStar id="ht1" className="ent-spin size-full opacity-80" />
      </div>
      <div data-scroll className="ent-near pointer-events-none absolute -bottom-[22vmin] -left-[16vmin] size-[64vmin]">
        <HalftoneStar id="ht2" className="ent-spin-rev size-full opacity-90" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 data-scroll aria-label="Build things" className="ent-name flex items-center gap-[2vmin] text-[clamp(1.6rem,5vmin,4rem)] font-[520] italic leading-none tracking-[-0.045em] text-paper">
          <span>build</span>
          <span className="ent-object relative block size-[clamp(6rem,24vmin,15rem)]">
            <span aria-hidden className="track absolute -inset-[14%]" data-label="OBJ·01  0.938" />
            <svg viewBox="0 0 100 100" aria-hidden className="ent-turn size-full overflow-visible">
              {[1, 0.86, 0.72, 0.58, 0.44].map((k, i) => (
                <path
                  key={k}
                  d={STAR}
                  transform={`translate(50 50) scale(${k}) translate(-50 -50)`}
                  fill="none"
                  stroke="var(--color-paper)"
                  strokeOpacity={0.9 - i * 0.16}
                  strokeWidth={0.5 / k}
                />
              ))}
              <path d={STAR} transform="translate(50 50) scale(0.16) translate(-50 -50)" fill="var(--color-paper)" fillOpacity="0.85" />
            </svg>
          </span>
          <span>
            things<span className="text-signal">.</span>
          </span>
        </h1>
      </div>

      <span aria-hidden className="track absolute left-[9%] top-[18%] hidden h-[9vh] w-[6vw] md:block" data-label="SIG·04  0.617" />
      <span aria-hidden className="track track-fast absolute bottom-[20%] right-[12%] h-[7vh] w-[5vw]" data-label="NOD·12" />

      <p className="absolute inset-x-0 bottom-[7vh] flex flex-col items-center gap-3 text-meta uppercase tracking-[0.2em] text-faint">
        <span>Developer | Full-Stack &amp; AI Builder</span>
        <span aria-hidden className="scroll-cue block h-8 w-px bg-line-strong" />
      </p>
      <p className="absolute left-5 top-24 text-[10px] md:left-10 uppercase tracking-[0.16em] text-faint md:right-10">
        01 / Enter
        <br />
        scroll to begin
      </p>
    </section>
  );
}
