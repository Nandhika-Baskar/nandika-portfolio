import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="px-5 pb-14 md:px-10 md:pb-10">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-4 border-t border-line pt-6 text-meta text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {site.year} {site.name}. Set in Geist, built with Next.js.
        </p>
        <p>Project previews are recreated from each project&rsquo;s own components; sample data is marked where used.</p>
        <div className="flex gap-6">
          {[site.links.github, site.links.linkedin, site.links.resume].filter(Boolean).map((l) => (
            <a key={l!.href} href={l!.href} target="_blank" rel="noopener noreferrer" className="text-mute hover:text-paper">
              {l!.label}
            </a>
          ))}
          <a href="#top" className="text-mute hover:text-paper" data-cursor-label="Again">
            Back to top
          </a>
          <span aria-hidden data-cursor data-cursor-label="the last light" className="footer-star relative -mr-1 inline-block size-[7px] self-center">
            <svg viewBox="0 0 20 20" className="size-full fill-faint transition-[fill,scale] duration-500 hover:scale-150 hover:fill-signal">
              <path d="M10 0C10.6 6.2 13.8 9.4 20 10C13.8 10.6 10.6 13.8 10 20C9.4 13.8 6.2 10.6 0 10C6.2 9.4 9.4 6.2 10 0Z" />
            </svg>
          </span>
        </div>
      </div>
    </footer>
  );
}
