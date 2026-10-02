"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** Local time in Chennai. A quiet, true status line instead of a claimed availability. */
export function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={className}>
      <span aria-hidden className="blink mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-signal" />
      <span className="sr-only">Local time in Chennai: </span>
      Chennai <span className="tabular-nums">{time ?? "--:--"}</span>
    </span>
  );
}
