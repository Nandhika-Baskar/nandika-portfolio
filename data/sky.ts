import type { Constellation, Formation } from "@/components/sky/Sky";
import type { ProjectId } from "./projects";

/* ============================================================================
   The night sky, scene by scene. Every position here is placed by hand.

   Each project has its own constellation, drawn from what the project is:
     Adamas  (Diamond Edge)  a brilliant-cut stone: crown, girdle, pavilion
     Grex    (Talent AI)     a pool: a loose ring of people around one lead
     Orcus   (Orcus)         a hub with spokes: one server, many tools
     Gemini  (Entugo)        twins: two languages, joined at the head
   They are decoration, not data: names and notes are catalogue flavour.
   ========================================================================== */

const figures: Record<ProjectId, Omit<Constellation, "x" | "y" | "w" | "depth" | "id">> = {
  "diamond-edge": {
    ratio: 0.9,
    points: [
      [50, 2],
      [92, 30],
      [50, 88],
      [8, 30],
      [30, 30],
      [70, 30],
    ],
    edges: [
      [3, 0],
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 1],
      [0, 4],
      [0, 5],
      [4, 2],
      [5, 2],
    ],
    lead: 0,
    name: "Adamas",
    note: "fig. 01 · cut stone",
  },
  "talent-ai": {
    ratio: 0.8,
    points: [
      [50, 40],
      [14, 22],
      [40, 6],
      [78, 12],
      [94, 44],
      [70, 74],
      [26, 70],
      [4, 50],
    ],
    edges: [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 1],
      [0, 2],
      [0, 5],
      [0, 7],
    ],
    lead: 0,
    name: "Grex",
    note: "fig. 02 · the pool",
  },
  orcus: {
    ratio: 1,
    points: [
      [50, 50],
      [50, 6],
      [90, 26],
      [94, 70],
      [56, 96],
      [12, 78],
      [6, 32],
      [30, 14],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [1, 2],
      [3, 4],
      [5, 6],
      [6, 7],
      [7, 1],
    ],
    lead: 0,
    name: "90482 Orcus",
    note: "fig. 03 · one server",
  },
  entugo: {
    ratio: 1.05,
    points: [
      [30, 4],
      [70, 8],
      [24, 36],
      [74, 40],
      [18, 70],
      [80, 74],
      [10, 100],
      [88, 102],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [2, 4],
      [4, 6],
      [1, 3],
      [3, 5],
      [5, 7],
      [2, 3],
    ],
    lead: 1,
    name: "Gemini",
    note: "fig. 04 · EN / DE",
  },
};

export const figure = (id: ProjectId, at: { x: number; y: number; w: number; depth: number; desktop?: boolean }): Constellation => ({
  id,
  ...figures[id],
  ...at,
});

/* ---------------------------------------------------------------------------
   Scenes
   ------------------------------------------------------------------------- */

export const heroSky: Formation = {
  stars: [
    // the two engraved stars: one far behind the title, one near and cropped
    { x: 78, y: 22, s: 44, kind: "contour", depth: 0.4, spin: 90, o: 0.7, rot: 12 },
    // bright sparks
    { x: 66, y: 13, s: 15, kind: "spark", depth: 0.6, twinkle: true },
    { x: 92, y: 52, s: 9, kind: "spark", depth: 0.75, accent: true, twinkle: true },
    { x: 47, y: 24, s: 22, kind: "hollow", depth: 0.4, spin: 90, o: 0.6 },
    { x: 23, y: 16, s: 18, kind: "six", depth: 0.5, spin: 120, o: 0.55, desktop: true },
    { x: 58, y: 70, s: 12, kind: "eight", depth: 0.3, spin: -200, o: 0.3, desktop: true },
    { x: 74, y: 78, s: 14, kind: "ring", depth: 0.25, spin: 60, o: 0.4, pulse: true },
    { x: 31, y: 72, s: 9, kind: "plus", depth: 0.5, hop: true, o: 0.55, desktop: true },
    { x: 61, y: 34, s: 7, kind: "plus", depth: 0.3, o: 0.35 },
    // dust
    { x: 12, y: 40, s: 3, kind: "dot", depth: 0.2, vanish: true, o: 0.6 },
    { x: 34, y: 8, s: 2, kind: "dot", depth: 0.15, o: 0.5 },
    { x: 55, y: 44, s: 2.5, kind: "dot", depth: 0.35, twinkle: true, o: 0.5 },
    { x: 86, y: 8, s: 3, kind: "dot", depth: 0.45, o: 0.7, vanish: true },
    { x: 96, y: 30, s: 2, kind: "dot", depth: 0.2, twinkle: true, o: 0.5 },
    { x: 70, y: 56, s: 2, kind: "dot", depth: 0.55, o: 0.45 },
    { x: 40, y: 88, s: 2.5, kind: "dot", depth: 0.65, twinkle: true, o: 0.5 },
    { x: 6, y: 22, s: 2, kind: "dot", depth: 0.3, o: 0.45 },
  ],
  labels: [
    { x: 69, y: 9, text: "α 00h 42m", depth: 0.6, desktop: true },
    { x: 18, y: 55, text: "+08° 14′", depth: 0.2, desktop: true },
  ],
};

export const prologueSky: Formation = {
  stars: [
    { x: 8, y: 14, s: 12, kind: "spark", depth: 0.6, twinkle: true },
    { x: 94, y: 18, s: 16, kind: "hollow", depth: 0.4, spin: 80, o: 0.55 },
    { x: 4, y: 70, s: 3, kind: "dot", depth: 0.3, twinkle: true, o: 0.6 },
    { x: 52, y: 12, s: 9, kind: "plus", depth: 0.4, hop: true, o: 0.45 },
    { x: 30, y: 86, s: 2.5, kind: "dot", depth: 0.7, vanish: true, o: 0.6 },
    { x: 48, y: 92, s: 2, kind: "dot", depth: 0.5, o: 0.5 },
    { x: 62, y: 6, s: 2.5, kind: "dot", depth: 0.2, twinkle: true, o: 0.5 },
  ],
  constellations: [
    figure("diamond-edge", { x: 3, y: 6, w: 4, depth: 0.45, desktop: true }),
    figure("entugo", { x: 92, y: 6, w: 3.4, depth: 0.55, desktop: true }),
    figure("talent-ai", { x: 3, y: 78, w: 4.2, depth: 0.35, desktop: true }),
    figure("orcus", { x: 92, y: 80, w: 3.6, depth: 0.5, desktop: true }),
  ],
};

export const workSky: Formation = {
  stars: [
    { x: 92, y: 6, s: 20, kind: "six", depth: 0.5, spin: 140, o: 0.5 },
    { x: 60, y: 3, s: 3, kind: "dot", depth: 0.3, twinkle: true, o: 0.6 },
    { x: 4, y: 96, s: 12, kind: "spark", depth: 0.7, twinkle: true },
    { x: 48, y: 98, s: 2.5, kind: "dot", depth: 0.2, o: 0.5 },
    { x: 97, y: 74, s: 2, kind: "dot", depth: 0.45, twinkle: true, o: 0.5 },
    { x: 70, y: 9, s: 8, kind: "plus", depth: 0.35, hop: true, o: 0.45, desktop: true },
    { x: 18, y: 6, s: 2.5, kind: "dot", depth: 0.55, vanish: true, o: 0.55 },
    { x: 30, y: 12, s: 2, kind: "dot", depth: 0.6, o: 0.4 },
  ],
};

/** One scene per case study: its own figure beside the title, and a few stars. */
export const projectSky = (id: ProjectId, flip: boolean): Formation => ({
  stars: [
    { x: flip ? 8 : 92, y: 4, s: 10, kind: "spark", depth: 0.7, twinkle: true },
    { x: flip ? 96 : 4, y: 2, s: 2.5, kind: "dot", depth: 0.3, o: 0.55 },
    { x: flip ? 30 : 70, y: 12, s: 2, kind: "dot", depth: 0.5, twinkle: true, o: 0.5 },
    { x: flip ? 4 : 96, y: 40, s: 16, kind: "hollow", depth: 0.4, spin: 110, o: 0.4, desktop: true },
    { x: flip ? 92 : 8, y: 64, s: 2, kind: "dot", depth: 0.6, o: 0.4 },
    { x: flip ? 97 : 3, y: 88, s: 3, kind: "dot", depth: 0.25, twinkle: true, o: 0.5 },
  ],
});

export const capabilitiesSky: Formation = {
  stars: [
    { x: 88, y: 3, s: 16, kind: "ring", depth: 0.3, spin: 90, o: 0.35, pulse: true },
    { x: 40, y: 50, s: 8, kind: "plus", depth: 0.25, hop: true, o: 0.3, desktop: true },
    { x: 6, y: 30, s: 2.5, kind: "dot", depth: 0.4, twinkle: true, o: 0.5 },
    { x: 96, y: 52, s: 11, kind: "spark", depth: 0.65, twinkle: true },
    { x: 3, y: 80, s: 2, kind: "dot", depth: 0.2, o: 0.5 },
  ],
};

export const aboutSky: Formation = {
  stars: [
    { x: 6, y: 70, s: 22, kind: "hollow", depth: 0.3, spin: -120, o: 0.4, rot: 20 },
    { x: 86, y: 20, s: 14, kind: "spark", depth: 0.6, twinkle: true, accent: true },
    { x: 92, y: 78, s: 2.5, kind: "dot", depth: 0.4, o: 0.5 },
    { x: 40, y: 10, s: 2, kind: "dot", depth: 0.25, twinkle: true, o: 0.5 },
    { x: 66, y: 86, s: 8, kind: "plus", depth: 0.5, hop: true, o: 0.4 },
  ],
};

/** Contact: the sky gathers. Stars start scattered and settle into place as the scene enters. */
export const contactSky: Formation = {
  stars: [
    { x: 92, y: 34, s: 16, kind: "hollow", depth: 0.3, spin: 140, o: 0.45, rot: -6 },
    { x: 70, y: 9, s: 10, kind: "spark", depth: 0.6, twinkle: true, o: 0.6 },
    { x: 30, y: 6, s: 2.5, kind: "dot", depth: 0.3, o: 0.4 },
    { x: 48, y: 18, s: 2, kind: "dot", depth: 0.5, vanish: true, o: 0.4 },
    { x: 4, y: 60, s: 2.5, kind: "dot", depth: 0.2, o: 0.35 },
  ],
};
