import { capabilityGroups } from "@/data/capabilities";
import { projects } from "@/data/projects";
import { sectionIds } from "@/data/site";
import { capabilitiesSky } from "@/data/sky";
import { Sky } from "@/components/sky/Sky";
import { TextReveal } from "@/components/animations/TextReveal";

/**
 * A matrix, not a skills grid: each capability is marked against the projects
 * where it was used, so every claim points at its evidence.
 */
export function Capabilities() {
  return (
    <section id={sectionIds.capabilities} data-scene="Capabilities" data-act="person" aria-labelledby="cap-title" className="relative scroll-mt-16 px-5 py-24 md:px-10 md:py-36">
      <Sky formation={capabilitiesSky} />
      <div className="relative mx-auto max-w-[1680px]">
        <div className="grid gap-6 md:grid-cols-12">
          <TextReveal id="cap-title" className="text-display font-[560] md:col-span-7">
            Capabilities
          </TextReveal>
          <p className="max-w-[40ch] self-end text-body text-mute md:col-span-4 md:col-start-9">
            No levels or percentages. Each line is marked against the projects where it was actually used.
          </p>
        </div>

        <div className="mt-14 md:mt-20">
          {/* Column heads, desktop only */}
          <div aria-hidden className="sticky top-16 z-10 hidden grid-cols-12 gap-6 border-b border-line bg-ink/90 py-3 backdrop-blur md:grid">
            <span className="col-span-7" />
            {projects.map((p) => (
              <span key={p.id} className="col-span-1 text-center text-meta text-faint">
                {p.number}
                <span className="block truncate">{p.name.split(" ")[0]}</span>
              </span>
            ))}
          </div>

          {capabilityGroups.map((g) => (
            <div key={g.title} className="grid gap-x-6 border-b border-line py-8 md:grid-cols-12 md:py-10">
              <div className="mb-4 md:col-span-3 md:mb-0">
                <h3 className="text-lede text-paper">{g.title}</h3>
                <p className="mt-1 text-small text-faint">{g.summary}</p>
              </div>
              <table className="w-full md:col-span-9">
                <caption className="sr-only">{g.title}: where each capability was used</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Capability</th>
                    {projects.map((p) => (
                      <th key={p.id} scope="col">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.items.map((item) => (
                    <tr key={item.name} className="group border-t border-line first:border-t-0 md:grid md:grid-cols-9 md:gap-6">
                      <th scope="row" className="block py-3 text-left font-normal md:col-span-4 md:table-cell md:py-3.5">
                        <span className="text-body text-paper/90 transition-colors group-hover:text-paper">{item.name}</span>
                        {item.note && <span className="mt-0.5 block text-small text-faint">{item.note}</span>}
                        <span className="mt-2 flex flex-wrap gap-1.5 md:hidden">
                          {projects
                            .filter((p) => item.projects.includes(p.id))
                            .map((p) => (
                              <span key={p.id} className="rounded-full border border-line-strong px-2.5 py-0.5 text-meta text-mute">
                                {p.name}
                              </span>
                            ))}
                        </span>
                      </th>
                      {projects.map((p) => {
                        const used = item.projects.includes(p.id);
                        return (
                          <td key={p.id} className="hidden py-3.5 text-center md:col-span-1 md:block">
                            {used ? (
                              <span className="inline-block size-2 rounded-full bg-paper/80 transition-colors group-hover:bg-signal">
                                <span className="sr-only">Used</span>
                              </span>
                            ) : (
                              <span className="inline-block h-px w-3 bg-line-strong align-middle">
                                <span className="sr-only">Not used</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
