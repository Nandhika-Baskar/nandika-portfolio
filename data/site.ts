/* ============================================================================
   Site identity and contact links.

   Only links that have been verified are filled in. Anything left as null is
   hidden everywhere it would appear (contact section, command palette,
   footer), so nothing on the page points at a guess. Fill these in and the
   page picks them up; no component needs to change.
   ========================================================================== */

export type SiteLink = { label: string; href: string };

export const site = {
  name: "Nandhika",
  monogram: "N",
  role: "Developer | Full-Stack & AI Builder",
  location: "Chennai / India",
  timeZone: "Asia/Kolkata",
  year: 2026,

  /** Public URL the site is deployed at. Used for canonical, sitemap and OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  description:
    "Portfolio of Nandhika, a developer building web products end to end: interfaces, APIs, databases, integrations and MCP servers, with AI coding agents.",

  links: {
    /** Not set. Add a profile to show it in Contact, the footer and the palette. */
    github: null as SiteLink | null,
    /** Not provided yet. Add an email to show it in Contact and the palette. */
    email: "nandhikabaskar11@gmail.com" as string | null,
    linkedin: null as SiteLink | null,
    resume: null as SiteLink | null,
  },
};

export const sectionIds = {
  work: "work",
  capabilities: "capabilities",
  about: "about",
  contact: "contact",
} as const;
