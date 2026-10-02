"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";
import { Frame } from "./Frame";

/* Strings copied from src/dictionaries/en.ts and de.ts in the Entugo repository. */
const copy = {
  en: {
    path: "entugo.com",
    eyebrow: "For Independent Restaurants & Cafes",
    pre: "Turn first-time guests into ",
    em: "regulars.",
    sub: "Entugo is restaurant loyalty program software with marketing and team tools in one app. Keep guests coming back, market to them yourself, and pay one flat fee. No commission, ever.",
    primary: "Start Free Trial",
    secondary: "Book a Demo",
    cookie: "We use essential cookies to run this site. With your consent we also use analytics cookies (Google Analytics) to understand how the site is used.",
    accept: "Accept",
    decline: "Decline",
  },
  de: {
    path: "entugo.com/de",
    eyebrow: "Für unabhängige Restaurants und Cafés",
    pre: "Aus Erstbesuchern werden ",
    em: "Stammgäste.",
    sub: "Entugo vereint Treueprogramm, Marketing und Team-Tools in einer App. Sorgen Sie dafür, dass Ihre Gäste wiederkommen, vermarkten Sie selbst und zahlen Sie eine feste Pauschale. Keine Provision. Niemals.",
    primary: "Kostenlos testen",
    secondary: "Demo buchen",
    cookie: "Wir verwenden notwendige Cookies für den Betrieb dieser Website. Mit Ihrer Einwilligung nutzen wir zusätzlich Analyse-Cookies (Google Analytics), um die Nutzung der Website zu verstehen.",
    accept: "Akzeptieren",
    decline: "Ablehnen",
  },
} as const;

type Lang = keyof typeof copy;

/**
 * The hero and first-visit cookie banner in both languages. The switch is
 * real: it swaps the dictionary strings the site itself uses.
 */
export function EntugoVisual() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-small text-mute" id="entugo-lang">Show the site in</span>
        <div role="group" aria-labelledby="entugo-lang" className="inline-flex rounded-[var(--radius-ctl)] border border-line-strong p-0.5">
          {(["en", "de"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={`h-8 rounded-[var(--radius-ctl)] px-4 text-meta font-medium transition-colors duration-[var(--duration-fast)] ${
                lang === l ? "bg-paper text-ink" : "text-mute hover:text-paper"
              }`}
            >
              {l === "en" ? "English" : "Deutsch"}
            </button>
          ))}
        </div>
      </div>

      <Frame
        tone="light"
        address={t.path}
        caption="Hero and cookie banner, recreated from the site's sections with its own dictionary strings in English and German. Phone image is the site's own asset."
      >
        <div lang={lang} className="relative grid min-h-[460px] overflow-hidden bg-[#faf1e4] text-[#1c1714] md:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
            <div className="mb-8 flex items-center justify-between md:hidden">
              <span className="text-[13px] font-bold tracking-[-0.01em] text-[#221c4e]">ENTUGO</span>
            </div>
            <p className="text-[11px] font-medium text-[#6b6560]">{t.eyebrow}</p>
            <p className="mt-3 max-w-[14ch] text-[clamp(1.9rem,4.4vw,3.4rem)] font-[650] leading-[0.98] tracking-[-0.035em]" aria-live="polite">
              {t.pre}
              <span className="text-[#ee3d24]">{t.em}</span>
            </p>
            <p className="mt-4 max-w-[46ch] text-[12.5px] leading-[1.6] text-[#6b6560]">{t.sub}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#ee3d24] px-4 py-2 text-[11.5px] font-semibold text-white">{t.primary}</span>
              <span className="rounded-full border border-[#1c1714]/20 px-4 py-2 text-[11.5px] font-semibold">{t.secondary}</span>
            </div>
          </div>
          <div className="relative hidden md:block">
            <img
              src={asset("/work/entugo/hero-mockup-640.webp")}
              alt="Phone showing the Entugo restaurant dashboard, from the Entugo website"
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="absolute inset-x-3 bottom-3 flex flex-col gap-3 rounded-[10px] border border-[#e5ddd3] bg-white/95 p-3.5 shadow-[0_10px_30px_-12px_rgba(28,23,20,.35)] sm:inset-x-auto sm:left-4 sm:max-w-[400px]">
            <p className="text-[10.5px] leading-[1.5] text-[#1c1714]">{t.cookie}</p>
            <div className="flex gap-2" aria-hidden>
              <span className="rounded-full bg-[#1c1714] px-3 py-1 text-[10.5px] font-semibold text-white">{t.accept}</span>
              <span className="rounded-full border border-[#1c1714]/25 px-3 py-1 text-[10.5px] font-semibold">{t.decline}</span>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}
