/** Anything on the page can open the command palette by dispatching this. */
export const PALETTE_OPEN = "palette:open";
export const openPalette = () => window.dispatchEvent(new CustomEvent(PALETTE_OPEN));
