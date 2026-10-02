import { asset, srcSet } from "@/lib/asset";
import { Frame } from "./Frame";

const services = [
  { stem: "/work/diamond-edge/robotic-demolition", widths: [640, 1280], title: "Robotic Demolition" },
  { stem: "/work/diamond-edge/core-drilling", widths: [640, 1280], title: "Core Drilling" },
  { stem: "/work/diamond-edge/wire-sawing", widths: [640], title: "Wire Sawing" },
];

const studioTypes = ["Services", "Rental categories", "Projects", "Project categories", "Team members"];

/** Recreation of the live hero plus service cards, using the site's own photography. */
export function DiamondEdgeVisual() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-12 md:gap-5 [&>*]:min-w-0">
      <Frame
        className="md:col-span-12"
        address="diamondedgecutting.com"
        caption="Homepage hero, recreated from the repository's Hero component with the site's own photography and copy."
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a] sm:aspect-[16/9]">
          <img
            src={asset("/work/diamond-edge/hero-1280.webp")}
            srcSet={srcSet("/work/diamond-edge/hero", [640, 1280])}
            sizes="(min-width: 1280px) 1200px, 100vw"
            alt="Robotic demolition machine on a dark site, the Diamond Edge Cutting homepage background"
            className="absolute inset-0 size-full object-cover opacity-70"
            loading="lazy"
            decoding="async"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white">Diamond Edge Cutting</span>
            <span className="hidden gap-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 md:flex">
              <span>Demolition Services</span>
              <span>Rental Equipment</span>
              <span>Projects</span>
              <span className="text-white">Contact</span>
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-8 sm:pb-9">
            <p className="text-[clamp(1.9rem,5.4vw,5.25rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-white" aria-hidden>
              We <span className="text-[#c8102e]">demolish.</span>
              <br />
              We cut. We drill.
              <br />
              We <span className="text-[#c8102e]">deliver.</span>
            </p>
            <p className="sr-only">Headline: We demolish. We cut. We drill. We deliver.</p>
            <p className="mt-4 hidden max-w-[52ch] text-[12px] leading-[1.6] text-white/75 sm:block">
              Controlled demolition, robotic demolition, specialist concrete cutting and core drilling across the UAE, Oman, Saudi Arabia,
              Qatar, Bahrain and Kuwait.
            </p>
          </div>
        </div>
      </Frame>

      <div className="grid grid-cols-3 gap-3 md:col-span-8 md:gap-4">
        {services.map((s) => (
          <figure key={s.title} className="m-0 overflow-hidden rounded-[var(--radius-md)] border border-line bg-[#0a0a0a]">
            <img
              src={asset(`${s.stem}-640.webp`)}
              srcSet={srcSet(s.stem, s.widths)}
              sizes="(min-width: 768px) 22vw, 33vw"
              alt=""
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white sm:text-[11px]">{s.title}</figcaption>
          </figure>
        ))}
      </div>

      <div className="flex flex-col justify-between rounded-[var(--radius-md)] border border-line bg-ink-2 p-5 md:col-span-4">
        <div>
          <p className="text-small text-paper">Studio at /studio</p>
          <p className="mt-1 text-meta text-faint">Content the client edits without a developer</p>
        </div>
        <ul className="mt-6 space-y-0 text-small">
          {studioTypes.map((t) => (
            <li key={t} className="flex items-center justify-between border-t border-line py-2 text-mute">
              {t}
              <span aria-hidden className="size-1.5 rounded-full bg-paper/25" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
