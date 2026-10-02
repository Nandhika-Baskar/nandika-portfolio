import type { ProjectId } from "./projects";

/* ============================================================================
   Capabilities, each tied to the projects where it shows up in my own
   commits. No levels, no percentages: the evidence is where it was used.
   ========================================================================== */

export type Capability = { name: string; projects: ProjectId[]; note?: string };
export type CapabilityGroup = { title: string; summary: string; items: Capability[] };

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: "Product",
    summary: "What gets built",
    items: [
      { name: "Business and marketing websites", projects: ["diamond-edge", "entugo"] },
      { name: "Web applications", projects: ["talent-ai", "orcus"] },
      { name: "Admin consoles and dashboards", projects: ["talent-ai"] },
      { name: "Customer-facing workspaces", projects: ["talent-ai"] },
      { name: "Responsive interfaces", projects: ["diamond-edge", "talent-ai", "entugo"] },
    ],
  },
  {
    title: "Engineering",
    summary: "How it is built",
    items: [
      { name: "Next.js App Router", projects: ["diamond-edge", "talent-ai", "orcus", "entugo"] },
      { name: "React and TypeScript", projects: ["diamond-edge", "talent-ai", "orcus", "entugo"] },
      { name: "Tailwind CSS", projects: ["diamond-edge", "talent-ai", "orcus", "entugo"] },
      { name: "API route handlers", projects: ["diamond-edge", "talent-ai", "orcus", "entugo"] },
      { name: "Server actions", projects: ["talent-ai", "orcus"] },
      { name: "Middleware", projects: ["talent-ai", "orcus", "entugo"] },
      { name: "English and German localisation", projects: ["entugo"] },
    ],
  },
  {
    title: "Data and backend",
    summary: "Where it lives",
    items: [
      { name: "Supabase", projects: ["talent-ai", "orcus"] },
      { name: "PostgreSQL and SQL migrations", projects: ["talent-ai", "orcus"] },
      { name: "Row-level security", projects: ["talent-ai", "orcus"] },
      { name: "Authentication flows", projects: ["talent-ai", "orcus"], note: "Invite-only sign-in; OAuth 2.1 for agents" },
      { name: "CSV import and export", projects: ["talent-ai"] },
    ],
  },
  {
    title: "Content and integrations",
    summary: "What it talks to",
    items: [
      { name: "Sanity CMS and Studio", projects: ["diamond-edge", "entugo"] },
      { name: "Resend", projects: ["diamond-edge"] },
      { name: "SendGrid", projects: ["entugo"] },
      { name: "Clay API", projects: ["talent-ai"] },
      { name: "GA4 with Consent Mode v2", projects: ["entugo"] },
      { name: "Structured data and technical SEO", projects: ["diamond-edge", "entugo"] },
    ],
  },
  {
    title: "AI-assisted development",
    summary: "How I work",
    items: [
      { name: "Claude Code as a coding agent", projects: ["diamond-edge", "talent-ai", "orcus", "entugo"] },
      { name: "Building MCP servers", projects: ["orcus"] },
      { name: "Supabase MCP for migrations", projects: ["talent-ai"] },
    ],
  },
  {
    title: "Shipping",
    summary: "How it goes live",
    items: [
      { name: "Vercel", projects: ["diamond-edge", "talent-ai", "orcus"] },
      { name: "Hostinger", projects: ["diamond-edge", "entugo"] },
      { name: "GitHub Actions CI", projects: ["diamond-edge", "entugo"] },
    ],
  },
];
