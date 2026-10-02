/**
 * Prefix for files in /public. Empty in Next.js; the static preview build sets
 * it to "." so the exported page works from any folder.
 */
const BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

export const asset = (path: string) => `${BASE}${path}`;

/** Build a srcset from widths that exist on disk as `${stem}-${w}.webp`. */
export const srcSet = (stem: string, widths: number[]) =>
  widths.map((w) => `${asset(`${stem}-${w}.webp`)} ${w}w`).join(", ");
