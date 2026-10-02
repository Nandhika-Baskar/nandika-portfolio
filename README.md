# Nandhika: portfolio

A single-page portfolio built with Next.js 15 (App Router), TypeScript and
Tailwind CSS 4. It exports as a static site (`output: "export"`), so it can be
hosted on Vercel, Netlify, Cloudflare Pages, Hostinger or any static host.

## Run it

    npm install
    npm run dev          # http://localhost:3000
    npm run build        # static site in ./out

Set the public URL before building so canonical links, the sitemap and Open
Graph tags point at the right place:

    NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build

## Fill these in

`data/site.ts` holds every contact link. GitHub, Email, LinkedIn and Resume
are all `null` for now, and anything `null` is hidden everywhere (contact section, command
palette). Add them there and nothing else needs to change.

## Structure

    app/                 layout (metadata, JSON-LD), page, sitemap, robots, globals.css (design tokens)
    components/
      layout/            HomePage (section order), Footer
      navigation/        Nav, Clock, CommandPalette (Cmd/Ctrl + K)
      hero/              Hero
      projects/          WorkIndex (editorial index with cursor-follow preview)
      case-study/        ProjectStory (product, problem, contribution, stack, visual, system, key details) and one recreated preview per project
      capabilities/      Capabilities matrix
      about/, contact/   About, Contact
      animations/        Reveal, TextReveal, Magnetic, Cursor
      sky/               Sky (scene formations), shapes, Guide (the travelling light), Progress (six acts)
      scenes/            SystemScene (pinned, scroll-driven project scene) and one World per project
      hero/              Hero, Prologue (pinned scene)
      ui/                ButtonLink, Arrow
    data/                site.ts, projects.ts, systems.ts, capabilities.ts  (all content lives here)
    lib/                 hooks (media queries, in-view), asset paths, cn
    public/              Geist font, OG image, optimised project images (WebP, fixed widths)
    tools/preview/       optional static preview build (not used by Next.js)

## Design system

All tokens are in `app/globals.css` under `@theme`: colour, type scale,
radius, shadow, easing and durations.

- Ground: warm charcoal `#121211`; text warm white `#ece7dd`; two greys.
- One accent, sodium amber `#e9b44c`, used only for live state: the signal
  dot in the hero and the system traces, the active step, focus rings, the
  clock. If something is amber it is moving or selected.
- Type: Geist (variable, self-hosted, OFL). Display sizes use `clamp()`.
- Motion: one orchestrated load sequence in the hero, clip reveals on project
  media, and motion that answers the visitor (hover, palette, system steps).
  No animation library: CSS and two small hooks. Everything is disabled under
  `prefers-reduced-motion`, and the static page is complete.
- Cursor effects (spark cursor, labels, magnetic buttons) run only on fine pointers.
- The sky: every star and constellation is placed by hand in `data/sky.ts`;
  `components/sky/` draws them (SVG shapes, depth layers, the Meridian
  journey line). `lib/motion.ts` is the single rAF loop for pointer and
  scroll; it sleeps when nothing moves, and writes registered,
  non-inheriting CSS properties (`--p`, `--e`, `--pin`, `--px`, `--py`)
  only onto elements marked `data-scroll`. Ambient drift, spin and twinkle
  are compositor-only CSS animations and pause when a sky is off screen.

## Where the content comes from

Every project statement was checked against the four repositories (code,
config and git history). Each highlight in `data/projects.ts` carries an
`evidence` field naming the file or commit, and the page shows it as
"In the code: ...". Things done by other contributors are stated as such in
each project's "Worth knowing" list.

Project previews are recreations built from each repository's own components,
copy, colours and image assets. Where sample data is used it is labelled in the
caption. The repositories are private, so the page links to the live sites,
not to GitHub repos.

## Checked so far, and what still needs a run

This was built in an environment without access to the npm registry, so
`next build` has not been run yet. What was verified:

- The same components were server-rendered and hydrated with React 19, with
  the CSS compiled by the Tailwind 4 compiler (`tools/preview`), then tested
  in Chromium at 375, 390, 1440 and 1920 px widths: no console errors, no
  hydration errors, no horizontal overflow.
- Keyboard: command palette (open, filter, arrow keys, Enter, Esc, focus
  return), tabs with arrow/Home/End, all controls reachable, visible focus.
- Reduced motion renders the complete page.
- The project's own TypeScript was checked against stand-in React types.

Run `npm install && npm run build` once locally; if anything fails it will be
in Next-specific glue (`app/`), not in the components.

## The journey

The page is six acts (Enter, Discover, Explore, Work, Person, Exit), declared
with `data-act` on each section. Each project is a pinned scene: scrolling
plays its steps (`data/systems.ts`) through that project's own world in
`components/scenes/`. A single amber light (`components/sky/Guide.tsx`)
rests on every `[data-guide]` element in turn and lands as the final full
stop. Under reduced motion, scenes render complete and still.
