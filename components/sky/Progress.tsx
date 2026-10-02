"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/lib/motion";

/* ============================================================================
   Where the visitor is, told quietly.

   The page is six acts. Sections declare theirs with data-act. Along the
   right edge sit the act numerals on a hairline; a small orbiting body
   slides down it as the page is read. The act's name appears when it
   begins and then withdraws. On small screens it folds into one line in
   the corner. A session clock counts quietly underneath.
   ========================================================================== */

const ACTS = [
  { id: "enter", name: "Enter" },
  { id: "discover", name: "Discover" },
  { id: "explore", name: "Explore" },
  { id: "work", name: "Work" },
  { id: "person", name: "Person" },
  { id: "exit", name: "Exit" },
] as const;

type Mark = { act: number; at: number; id: string; sub?: string };

export function Progress() {
  const [act, setAct] = useState(0);
  const [sub, setSub] = useState<string | undefined>();
  const [announce, setAnnounce] = useState(false);
  const marks = ACTS.map((_, i) => i / (ACTS.length - 1));
  const body = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const mobileBar = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const found = useRef<Mark[]>([]);
  const max = useRef(1);
  const actRef = useRef(-1);
  const actStarts = useRef<number[]>([0]);
  const railH = useRef(0);
  const rail = useRef<HTMLElement>(null);
  const subRef = useRef<string | undefined>(undefined);

  useMotion(
    (s) => {
      const p = Math.min(1, Math.max(0, s.scroll / max.current));
      // Position along the rail: whole acts are evenly spaced, and the body
      // moves through the current one in proportion to how far in it is.
      const reading = s.scroll + s.vh * 0.5;
      const starts = actStarts.current;
      let a0 = 0;
      for (let i = 0; i < starts.length; i++) if (reading >= starts[i]) a0 = i;
      const next = a0 + 1 < starts.length ? starts[a0 + 1] : max.current + s.vh;
      const local = Math.min(1, Math.max(0, (reading - starts[a0]) / Math.max(1, next - starts[a0])));
      const railPos = (a0 + local) / (ACTS.length - 1);
      if (body.current) body.current.style.transform = `translate3d(50%, ${(Math.min(1, railPos) * railH.current - 6.5).toFixed(1)}px, 0)`;
      if (mobileBar.current) mobileBar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      // the last section that has begun
      let cur: Mark | undefined;
      for (const m of found.current) if (s.scroll + s.vh * 0.5 >= m.at) cur = m;
      const a = cur?.act ?? 0;
      if (a !== actRef.current) {
        actRef.current = a;
        setAct(a);
      }
      if (cur?.sub !== subRef.current) {
        subRef.current = cur?.sub;
        setSub(cur?.sub);
      }
    },
    () => {
      max.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      railH.current = rail.current?.offsetHeight ?? 0;
      const list: Mark[] = [];
      document.querySelectorAll<HTMLElement>("[data-act]").forEach((el) => {
        const act = ACTS.findIndex((a) => a.id === el.dataset.act);
        if (act < 0) return;
        const at = el.getBoundingClientRect().top + window.scrollY;
        list.push({ act, at, id: el.id, sub: el.dataset.actSub });
      });
      found.current = list.sort((a, b) => a.at - b.at);
      actStarts.current = ACTS.map((_, i) => list.find((m) => m.act === i)?.at ?? 0);
    },
  );

  // The act's name shows for a moment when it begins
  useEffect(() => {
    setAnnounce(true);
    const t = window.setTimeout(() => setAnnounce(false), 2600);
    return () => window.clearTimeout(t);
  }, [act]);

  // Session clock
  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const sec = Math.floor((Date.now() - start) / 1000);
      if (clock.current) clock.current.textContent = `t+${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const name = ACTS[act].name;
  return (
    <>
      {/* desktop: the acts along the right edge */}
      <nav ref={rail} aria-label="Acts" className="progress group/p fixed bottom-[16vh] right-3 top-[20vh] z-40 hidden w-8 lg:block 3xl:right-7">
        <span aria-hidden className="absolute inset-y-0 right-[11px] w-px bg-line" />
        {ACTS.map((a, i) => (
          <a
            key={a.id}
            href={`#${found.current.find((m) => m.act === i)?.id ?? "top"}`}
            data-cursor-label={a.name}
            className="absolute right-0 flex h-5 -translate-y-1/2 items-center gap-2"
            style={{ top: `${marks[i] * 100}%` }}
          >
            <span className="sr-only">{a.name}</span>
            <span
              aria-hidden
              className={`text-[9.5px] tabular-nums tracking-[0.12em] transition-colors duration-[var(--duration-base)] ${
                i === act ? "text-paper" : i < act ? "text-mute" : "text-faint/60 group-hover/p:text-faint"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className={`block h-px transition-[width,background-color] duration-[var(--duration-base)] ${i === act ? "w-3 bg-paper" : "w-1.5 bg-line-strong"}`} />
          </a>
        ))}
        {/* the travelling body: a small orbit */}
        <span ref={body} aria-hidden className="absolute right-[11px] top-0 size-[13px] will-change-transform">
          <span className="progress-orbit absolute inset-0 rounded-full border border-paper/40">
            <span className="absolute -top-[2px] left-1/2 size-[4px] -translate-x-1/2 rounded-full bg-paper" />
          </span>
        </span>
        <span aria-hidden className="absolute -bottom-14 right-0 text-right text-[9.5px] tabular-nums tracking-[0.12em] text-faint">
          <span className="progress-name block whitespace-nowrap uppercase text-mute" data-on={announce}>
            {name}
            {sub ? ` · ${sub}` : ""}
          </span>
          <span ref={pct}>000</span>
          <br />
          <span ref={clock}>t+00:00</span>
        </span>
      </nav>

      {/* small screens: one line in the corner */}
      <div aria-hidden className="pointer-events-none fixed bottom-3 left-4 z-40 flex items-center gap-2.5 text-[9.5px] uppercase tabular-nums tracking-[0.14em] text-mute lg:hidden">
        <span className="text-paper">{String(act + 1).padStart(2, "0")}</span>
        <span className="relative block h-px w-10 bg-line-strong">
          <span ref={mobileBar} className="absolute inset-0 origin-left bg-paper/70" style={{ transform: "scaleX(0)" }} />
        </span>
        <span>
          {name}
          {sub ? ` · ${sub}` : ""}
        </span>
      </div>
    </>
  );
}
