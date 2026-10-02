/** Join class names, skipping falsy values. Small enough not to need clsx. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
