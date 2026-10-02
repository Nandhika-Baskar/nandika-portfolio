import { projects } from "@/data/projects";
import { Nav } from "@/components/navigation/Nav";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { Hero } from "@/components/hero/Hero";
import { Entrance } from "@/components/hero/Entrance";
import { Guide } from "@/components/sky/Guide";
import { Progress } from "@/components/sky/Progress";
import { WorkIndex } from "@/components/projects/WorkIndex";
import { ProjectStory } from "@/components/case-study/ProjectStory";
import { Capabilities } from "@/components/capabilities/Capabilities";
import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { Cursor } from "@/components/animations/Cursor";
import { Footer } from "./Footer";

/** The whole page, in reading order. Kept framework-free so it can render anywhere React does. */
export function HomePage() {
  return (
    <>
      <a href="#main" className="sr-only z-[80] rounded-[var(--radius-sm)] bg-paper px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Entrance />
        <Hero />
        <WorkIndex />
        <div aria-label="Project stories">
          {projects.map((p) => (
            <ProjectStory key={p.id} project={p} />
          ))}
        </div>
        <Capabilities />
        <About />
        <Contact />
      </main>
      <Footer />
      <Progress />
      <Guide />
      <CommandPalette />
      <Cursor />
      <div aria-hidden className="grain" />
    </>
  );
}
