/* ============================================================================
   Project content.

   Every statement here traces to the repositories (code, config or git
   history). The `evidence` field on each highlight names where. Nothing is a
   metric unless the repository itself states it.
   ========================================================================== */

export type ProjectId = "diamond-edge" | "talent-ai" | "orcus" | "entugo";

export type Highlight = {
  title: string;
  body: string;
  /** Where in the repository this is visible. Kept for honesty, shown on hover/expand. */
  evidence: string;
};

export type Project = {
  id: ProjectId;
  number: string;
  name: string;
  /** One line, plain language */
  summary: string;
  category: string;
  period: string;
  role: string;
  stack: string[];
  integrations: string[];
  /** Live link, when the repository documents one */
  link?: { label: string; href: string; note?: string };
  /** The Product: what it is, in a sentence or two */
  product: string;
  /** The Problem: what the system had to get right */
  problem: string;
  /** The Contribution: what I built, in prose */
  intro: string;
  highlights: Highlight[];
  /** Things a reader should know so nothing is overstated */
  notes: string[];
  /** Which tab in the Systems explorer shows this project's flow */
  systemId: SystemId;
  /** Brand colours of the client product, used only inside its preview */
  brand: { ground: string; accent: string; text: string };
};

export type SystemId = "enquiry" | "csv-import" | "mcp" | "lead";

export const projects: Project[] = [
  {
    id: "diamond-edge",
    number: "01",
    name: "Diamond Edge Cutting",
    summary: "Company website and self-service content system for a demolition and concrete-cutting contractor in the UAE.",
    category: "Business website and CMS",
    period: "Apr to Jul 2026",
    role: "Development: site build, CMS, enquiry pipeline, deployment",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Framer Motion", "GSAP", "react-hook-form", "Zod", "GitHub Actions"],
    integrations: ["Sanity", "Resend", "Google Maps embed"],
    link: { label: "diamondedgecutting.com", href: "https://diamondedgecutting.com" },
    product:
      "The marketing website for Diamond Edge Cutting LLC, a demolition, concrete cutting and core drilling contractor in Dubai: services, rental equipment, a project portfolio and a contact page.",
    problem:
      "A contractor's website has two jobs: show the work convincingly, and make sure an enquiry actually reaches someone. The client also needed to update services, projects and the team without calling a developer.",
    intro:
      "I built the site, gave the client a content system they can run themselves, and made the enquiry path reliable end to end, from the form to their inbox.",
    highlights: [
      {
        title: "A CMS the client runs",
        body: "Sanity Studio is embedded at /studio. Editors manage services, rental equipment categories, projects, project categories and the team, and choose which projects lead the homepage.",
        evidence: "sanity.config.ts, sanity/schemas/*, src/app/studio",
      },
      {
        title: "Custom Studio controls",
        body: "An order picker that greys out positions already taken, a six-slot homepage order and an optional project timeline, so editors cannot create the conflicts a plain number field allows.",
        evidence: "sanity/components/OrderInput.tsx, sanity/lib/uniqueOrder.ts",
      },
      {
        title: "Enquiries that arrive",
        body: "The contact form posts to an API route that validates, stores the lead in Sanity and emails it through Resend from the company's verified domain. If email fails, the lead is still saved and the visitor is asked to call.",
        evidence: "src/app/api/inquiries/route.ts, src/app/contact/ContactForm.tsx",
      },
      {
        title: "Caught a silent failure",
        body: "The contact form still had its placeholder submit: it showed a success message without sending anything. I caught it and connected it to the enquiry API and email pipeline.",
        evidence: "commits 9d057c5, 30c31db",
      },
      {
        title: "Search and sharing",
        body: "JSON-LD structured data for the business, services, projects and FAQs, plus Open Graph and Twitter cards on every page.",
        evidence: "src/components/seo/*, page metadata",
      },
      {
        title: "Two environments",
        body: "A dev branch that deploys to Vercel for review and a main branch that serves the live site from Hostinger, with a GitHub Actions build check and npm audit findings cleared.",
        evidence: "vercel.json, .github/workflows, DEPLOYMENT.md (dev branch)",
      },
    ],
    notes: [
      "A CMS-driven blog is built and running on staging; it is not on the live site yet.",
      "A June client revision round (logos, legal pages, hero imagery) was done by another developer.",
      "Built with Claude Code as a coding agent.",
    ],
    systemId: "enquiry",
    brand: { ground: "#0a0a0a", accent: "#c8102e", text: "#ffffff" },
  },
  {
    id: "talent-ai",
    number: "02",
    name: "Talent AI",
    summary: "An invite-only talent platform: an admin team curates candidate pools and shares them with client companies.",
    category: "B2B web application",
    period: "Sep 2026",
    role: "Full-stack: interface, database schema and access rules, integrations",
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS 4", "shadcn/ui", "Radix", "Lucide", "Recharts", "Vitest", "Vercel"],
    integrations: ["Supabase Auth, Postgres, Storage, Vault", "Clay API"],
    product:
      "talent.ai, an invite-only B2B talent marketplace. Admins source and verify candidates and group them into pools; client companies sign in to their own workspace to browse the pools shared with them.",
    problem:
      "Two products in one codebase, with sensitive data on both sides. A client must only ever see candidates shared with their organisation, and bulk imports must never merge two different people.",
    intro:
      "I was the main developer: the admin console and client workspace, the Postgres schema and row-level security (26 of 31 migrations), the server actions, middleware and the Clay integration. The pool is the unit of access, and the database enforces it.",
    highlights: [
      {
        title: "Admin console",
        body: "Candidate inventory with filters and bulk review, a configurable field catalogue, organisations and teams, a pool builder with a candidate picker, sharing controls, request queues and an activity log.",
        evidence: "src/app/(admin)/admin/**",
      },
      {
        title: "Client workspace",
        body: "Buyers see their shared pools, react to candidates, request introductions or a new pool, manage their team and export a pool to CSV.",
        evidence: "src/app/(client)/**",
      },
      {
        title: "CSV import that will not merge strangers",
        body: "Upload, map, preview, done. Each column shows its first three values beside the mapping, unmapped columns stay visible, emails and LinkedIn URLs are normalised, and duplicates are matched only on identity fields.",
        evidence: "candidates/import/import-wizard.tsx, src/lib/csv.ts, src/lib/import-normalise.ts",
      },
      {
        title: "Access enforced by the database",
        body: "Postgres row-level security decides what each role can read and write, so a client only ever sees candidates through pools shared with their organisation.",
        evidence: "supabase/migrations (26 of 31 written by me)",
      },
      {
        title: "Overview dashboard",
        body: "Pool engagement, candidate reactions, sourcing mix and response lag, drawn with Recharts from Postgres aggregate views.",
        evidence: "src/components/overview/*",
      },
      {
        title: "Sourcing through Clay",
        body: "Admins connect a Clay workspace, search for people and import results as candidates. The key is kept in Supabase Vault and never reaches the browser.",
        evidence: "src/lib/integrations/clay.ts",
      },
    ],
    notes: [
      "The admin Settings page (profile, avatar, theme) was built by a teammate.",
      "Built with Claude Code; migrations applied through the Supabase MCP server.",
    ],
    systemId: "csv-import",
    brand: { ground: "#fcfcfb", accent: "#ff1270", text: "#161616" },
  },
  {
    id: "orcus",
    number: "03",
    name: "Orcus",
    summary: "A project board that Claude Code can work, through a hosted MCP server with real sign-in and permissions.",
    category: "Systems and AI tooling",
    period: "Sep 2026",
    role: "Built the MCP server layer: OAuth, tools, revocation, audit log",
    stack: ["Next.js 15", "TypeScript", "mcp-handler", "Zod", "Supabase Auth", "PostgreSQL", "Row-level security"],
    integrations: ["Model Context Protocol", "Supabase OAuth 2.1", "Claude Code"],
    link: { label: "pixsl-project-manager.vercel.app", href: "https://pixsl-project-manager.vercel.app", note: "Sign-in required" },
    product:
      "Orcus (formerly Pixsl Project Manager), an internal client-project manager with a kanban board, tasks, features and a clients CRM, plus an agent account that works the board.",
    problem:
      "The team's AI agent reached the board through a plugin that carried the database service key, so it could do anything. The agent needed real sign-in, and it should only be able to do what the person behind it could do.",
    intro:
      "I built the MCP layer: a server hosted inside the app, OAuth 2.1 sign-in, the role-filtered tool layer, revocation, the audit log and the Connect Claude page. Each person connects Claude Code with their own login. The app itself calls no AI model.",
    highlights: [
      {
        title: "Hosted MCP server",
        body: "Served from /api/mcp over Streamable HTTP. Teammates connect with one command and get 38 tools for projects, tasks, subtasks, features, apps, comments and attachments.",
        evidence: "app/api/mcp/route.ts, lib/mcp/tools/*",
      },
      {
        title: "Real sign-in for an agent",
        body: "Supabase acts as an OAuth 2.1 authorisation server with dynamic client registration and a consent screen. Every request carries a JWT that is checked for algorithm, issuer, audience and client.",
        evidence: "lib/mcp/token.ts, app/oauth/consent, .well-known/oauth-protected-resource",
      },
      {
        title: "Checked three times",
        body: "Tools are filtered by role (owner, team, agent, client) before they are advertised, checked again before they run, and every query runs under the caller's own token so row-level security has the final word.",
        evidence: "app/api/mcp/route.ts, lib/mcp/dispatch.ts, lib/mcp/access.ts",
      },
      {
        title: "Revoke a machine, instantly",
        body: "Each connection is recorded. Revoking one is enforced inside Postgres access rules, every call is written to an audit log, and an environment switch turns the whole server off.",
        evidence: "migrations 20260916130003, 20260917075315, lib/mcp/log.ts",
      },
      {
        title: "Connect Claude page",
        body: "A settings page that gives each person their connect command and lists their connected machines, with revoke.",
        evidence: "app/(app)/settings/claude, components/settings/*",
      },
    ],
    notes: [
      "The board, dashboard and other app screens were built in earlier sessions; my part is the MCP layer and its database security.",
      "The app does not call an AI model. Claude Code connects to it as a client.",
    ],
    systemId: "mcp",
    brand: { ground: "#141414", accent: "#e9b44c", text: "#ece7dd" },
  },
  {
    id: "entugo",
    number: "04",
    name: "Entugo",
    summary: "Bilingual marketing site for a restaurant loyalty platform in Germany.",
    category: "Marketing website",
    period: "Jun to Sep 2026",
    role: "Development: site, localisation, SEO, analytics, lead API, blog CMS",
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS 3", "GSAP", "Lenis", "GitHub Actions"],
    integrations: ["Sanity", "SendGrid", "Google Analytics 4", "PostHog (optional)", "Calendly"],
    link: { label: "entugo.com", href: "https://www.entugo.com" },
    product: "The English and German marketing website for Entugo, a restaurant loyalty platform in Germany.",
    problem:
      "A site for German restaurant owners that also had to work in English, respect cookie law from the first request, and hand warm leads to the sales team without losing them.",
    intro:
      "I built and maintained the site: localisation, technical SEO, consent-gated analytics, the lead API, a bilingual Sanity blog, and the work that made it lighter to host.",
    highlights: [
      {
        title: "English and German",
        body: "Typed dictionaries keep both languages in step. Middleware reads the browser's language preference and sends German speakers to /de, and a cookie remembers a manual choice.",
        evidence: "src/dictionaries/*, src/middleware.ts",
      },
      {
        title: "Consent before anything loads",
        body: "Google Consent Mode v2 starts denied. Google Analytics, PostHog and the Calendly booking embed load only after the visitor opts in.",
        evidence: "src/lib/consent.ts, src/components/CookieConsent.tsx, Analytics.tsx",
      },
      {
        title: "Technical SEO",
        body: "A bilingual sitemap with hreflang, robots rules, generated Open Graph images and Organization, WebSite and SoftwareApplication JSON-LD.",
        evidence: "src/app/sitemap.ts, robots.ts, opengraph-image.tsx, layout.tsx",
      },
      {
        title: "Lead form with guards",
        body: "The trial form posts to an API route with an origin allow-list, a per-IP rate limit, a honeypot and validation, then notifies the team through SendGrid.",
        evidence: "src/app/api/signup/route.ts",
      },
      {
        title: "A blog editors can publish",
        body: "Sanity powers a bilingual blog with an embedded Studio. A webhook clears the cache on publish, and a terminal script creates posts from markdown.",
        evidence: "sanity.config.ts, src/app/api/revalidate, scripts/cms.mjs",
      },
      {
        title: "Lighter and calmer",
        body: "Pages moved to static prerendering, scanner bots blocked in middleware, unused UI components removed (dependencies 50 to 11) and the background video cut from 7.4 MB to 1.8 MB, with reduced-motion fallbacks.",
        evidence: "commits ca4fd64, fbd1a78, f6380d5",
      },
    ],
    notes: [
      "Legal pages (terms, privacy, refund) were written by another contributor.",
      "Built with Claude Code as a coding agent.",
    ],
    systemId: "lead",
    brand: { ground: "#faf1e4", accent: "#ee3d24", text: "#1c1714" },
  },
];

export const projectById = (id: ProjectId) => projects.find((p) => p.id === id)!;
