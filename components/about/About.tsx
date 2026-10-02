"use client";

import { useRef } from "react";
import { sectionIds } from "@/data/site";
import { aboutSky } from "@/data/sky";
import { Sky } from "@/components/sky/Sky";
import { useScrollVars } from "@/lib/motion";

const closing = [
  { text: "Still learning.", indent: "" },
  { text: "Still building.", indent: "pl-[12%]" },
  { text: "Still looking beyond what already exists.", indent: "pl-[24%]" },
];

/** An editorial page: one statement, one paragraph set off to the side, and a closing cadence. */
export function About() {
  const ref = useRef<HTMLElement>(null);
  useScrollVars(ref);
  return (
    <section ref={ref} id={sectionIds.about} data-scene="About" data-act="person" aria-labelledby="about-title" className="about relative scroll-mt-16 px-5 py-28 md:px-10 md:py-44">
      <Sky formation={aboutSky} />
      <div className="relative mx-auto max-w-[1680px]">
        <div className="flex items-baseline justify-between border-t border-line pt-5 text-meta uppercase text-faint">
          <h2 id="about-title" className="relative">
            <span data-guide data-guide-mode="orbit" data-guide-label="the person" data-guide-at="0.45" className="absolute -left-4 top-1/2 size-0" />
            About
          </h2>
          <span>The person behind the work</span>
        </div>

        <p data-scroll className="about-statement mt-16 max-w-[24ch] text-title font-[480] leading-[1.12] text-mute md:mt-24 md:text-[clamp(2rem,3.6vw,3.4rem)]">
          <span className="text-paper">I&rsquo;m Nandhika</span> &mdash; a Computer Science &amp; Cybersecurity student exploring the space between{" "}
          <span className="text-paper">building technology</span> and{" "}
          <span className="text-paper">understanding what makes it trustworthy.</span>
        </p>

        <div className="mt-20 grid gap-10 md:mt-32 md:grid-cols-12 md:gap-6">
          <p className="text-meta uppercase text-faint md:col-span-3 md:col-start-2">Software · AI · Automation · Security</p>
          <p className="max-w-[52ch] text-lede text-mute md:col-span-6 md:col-start-6">
            I work across software, AI, automation, and digital experiences, turning ideas into systems that are not only functional, but{" "}
            <span className="text-paper">thoughtful and secure.</span> I&rsquo;m fascinated by how things connect: how a simple idea becomes a
            product, how systems communicate, and how those same systems can be designed to withstand what comes from the other side.
          </p>
        </div>

        <div className="mt-24 md:mt-36">
          {closing.map((l, i) => (
            <p key={l.text} className={`flex items-center gap-4 text-[clamp(1.5rem,3vw,2.75rem)] font-[500] leading-[1.25] tracking-[-0.03em] ${l.indent} ${i === 2 ? "text-paper" : "text-faint"}`}>
              <svg aria-hidden viewBox="0 0 20 20" className="size-2.5 shrink-0 fill-current opacity-60">
                <path d="M10 0C10.6 6.2 13.8 9.4 20 10C13.8 10.6 10.6 13.8 10 20C9.4 13.8 6.2 10.6 0 10C6.2 9.4 9.4 6.2 10 0Z" />
              </svg>
              {l.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
