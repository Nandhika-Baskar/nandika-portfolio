/* ============================================================================
   Star shapes, drawn by hand in a 100 × 100 box centred on 50,50.

   spark   ✦  four points, concave sides, solid
   hollow  ✧  the same spark as a hairline outline
   six     ✶  six thin rays
   eight   ✷  eight rays, long and short alternating
   contour    a large spark engraved as nested outlines, like a chart plate
   node       a crosshair node, used where constellation lines meet
   dot        a single point of light
   ring       a small outlined orbit with a body on it
   plus       a thin registration cross
   ========================================================================== */

export type StarKind = "spark" | "hollow" | "six" | "eight" | "contour" | "node" | "dot" | "ring" | "plus";

/** Four-point spark with concave sides. `w` sets the waist: smaller is sharper. */
const spark4 = (r = 50, w = 9) =>
  `M50 ${50 - r} C${50 + w * 0.35} ${50 - w} ${50 + w} ${50 - w * 0.35} ${50 + r} 50 ` +
  `C${50 + w} ${50 + w * 0.35} ${50 + w * 0.35} ${50 + w} 50 ${50 + r} ` +
  `C${50 - w * 0.35} ${50 + w} ${50 - w} ${50 + w * 0.35} ${50 - r} 50 ` +
  `C${50 - w} ${50 - w * 0.35} ${50 - w * 0.35} ${50 - w} 50 ${50 - r}Z`;

function rays(count: number, long: number, short: number) {
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const len = i % 2 === 0 ? long : short;
    const f = (v: number) => v.toFixed(2);
    parts.push(`M${f(50 + Math.cos(a) * 4)} ${f(50 + Math.sin(a) * 4)}L${f(50 + Math.cos(a) * len)} ${f(50 + Math.sin(a) * len)}`);
  }
  return parts.join("");
}

export function StarShape({ kind, accent = false }: { kind: StarKind; accent?: boolean }) {
  const ink = accent ? "var(--color-signal)" : "var(--color-paper)";
  switch (kind) {
    case "spark":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <path d={spark4(50, 8)} fill={ink} />
        </svg>
      );
    case "hollow":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <path d={spark4(47, 10)} fill="none" stroke={ink} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "six":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <path d={rays(6, 48, 48)} stroke={ink} strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="50" r="5" fill={ink} />
        </svg>
      );
    case "eight":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <path d={rays(8, 49, 26)} stroke={ink} strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={spark4(14, 4)} fill={ink} />
        </svg>
      );
    case "contour":
      // Nested outlines of one spark: the large, engraved star. Lines thin
      // and fade toward the outside, so it reads as depth, not as a logo.
      return (
        <svg viewBox="0 0 100 100" aria-hidden overflow="visible">
          {[
            [50, 7, 0.95],
            [44, 6.2, 0.6],
            [38, 5.4, 0.42],
            [32, 4.6, 0.3],
            [26, 3.8, 0.22],
          ].map(([r, w, o]) => (
            <path key={r} d={spark4(r, w)} fill="none" stroke={ink} strokeOpacity={o} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={spark4(10, 2.4)} fill={ink} />
        </svg>
      );
    case "node":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <rect x="30" y="30" width="40" height="40" fill="none" stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M50 0V22M50 78V100M0 50H22M78 50H100" stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "ring":
      return (
        <svg viewBox="0 0 100 100" aria-hidden overflow="visible">
          <circle cx="50" cy="50" r="44" fill="none" stroke={ink} strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="6" r="7" fill={ink} />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <path d="M50 4V96M4 50H96" stroke={ink} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "dot":
    default:
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="50" fill={ink} />
        </svg>
      );
  }
}
