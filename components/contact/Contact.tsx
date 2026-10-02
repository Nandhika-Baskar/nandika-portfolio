"use client";

import { useRef } from "react";
import { site, sectionIds } from "@/data/site";
import { contactSky } from "@/data/sky";
import { Sky } from "@/components/sky/Sky";
import { useScrollVars } from "@/lib/motion";
import { Arrow } from "@/components/ui/Button";
import { Magnetic } from "@/components/animations/Magnetic";
import { TextReveal } from "@/components/animations/TextReveal";

/** Shows only the contact routes set in data/site.ts. */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useScrollVars(ref);
  const { email, github, linkedin, resume } = site.links;
  const links = [github, linkedin, resume].filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <section
      ref={ref}
      id={sectionIds.contact}
      data-scene="Contact"
      data-act="exit"
      aria-labelledby="contact-title"
      className="contact relative scroll-mt-16 overflow-hidden border-t border-line px-5 pb-16 pt-24 md:px-10 md:pb-20 md:pt-40"
    >
      <Sky formation={contactSky} />
      <div className="relative mx-auto max-w-[1680px]">
        <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-meta uppercase text-mute">
          <span>Contact</span>
          <span className="text-faint">05 / 04 · the next one is yours</span>
        </p>
        <h2 id="contact-title" data-scroll className="contact-title mt-6 text-hero font-[560] text-paper md:mt-10">
          <TextReveal as="span" className="block">Let&rsquo;s build</TextReveal>
          <TextReveal as="span" className="block pl-[8%] text-mute md:pl-[18%]">something</TextReveal>
          <TextReveal as="span" className="block md:pl-[6%]">
            interesting
            <span className="landing-dot relative">
              .
              <span data-guide data-guide-mode="land" data-guide-at="0.6" className="absolute bottom-[0.18em] left-1/2 size-0" />
            </span>
          </TextReveal>
        </h2>

        <div className="mt-20 grid gap-12 border-t border-line pt-10 md:mt-32 md:grid-cols-12 md:gap-6 md:pt-14">
          <p className="max-w-[38ch] text-body text-mute md:col-span-4">
            Websites, web applications, integrations or an MCP server for your own tools. Tell me what you are making and where it is stuck.
          </p>
          <ul className="flex flex-col md:col-span-5 md:col-start-8">
            {email && (
              <li className="pb-6">
                <p className="mb-3 text-meta uppercase text-faint">Write</p>
                <Magnetic>
                  <a
                    href={`mailto:${email}`}
                    data-cursor-label="Write"
                    className="contact-mail group inline-flex items-center gap-3 break-all text-lede text-paper"
                  >
                    <span className="relative">
                      {email}
                      <span aria-hidden className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-[0.25] bg-paper/50 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-x-100" />
                    </span>
                    <Arrow className="size-4 shrink-0 text-mute group-hover:translate-x-1 group-hover:text-signal" />
                  </a>
                </Magnetic>
              </li>
            )}
            {links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="group flex items-center justify-between py-4 text-body text-paper"
                >
                  <span className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-2">{l.label}</span>
                  <span className="flex items-center gap-3 text-small tracking-normal text-faint">
                    <span className="hidden sm:inline">{l.href.replace("https://", "")}</span>
                    <Arrow direction="up-right" className="size-4 text-mute group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
