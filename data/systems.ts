import type { ProjectId, SystemId } from "./projects";

/* ============================================================================
   System flows, one per project. Each step is what the code actually does,
   in order, with the file where it happens. Steps marked `guard` are checks
   that can stop the request.
   ========================================================================== */

export type SystemStep = {
  label: string;
  /** Short label for narrow screens */
  short?: string;
  detail: string;
  where: string;
  guard?: boolean;
};

export type SystemFlow = {
  id: SystemId;
  project: ProjectId;
  title: string;
  question: string;
  steps: SystemStep[];
  outcome: string;
  /** The closing state, shown once every step has played */
  finale?: { label: string; detail: string; where: string };
  /** Safeguards that wrap every request rather than sitting at one step */
  controls?: Array<{ label: string; detail: string; where: string }>;
};

export const systems: SystemFlow[] = [
  {
    id: "enquiry",
    project: "diamond-edge",
    title: "Enquiry to inbox",
    question: "What happens when someone sends an enquiry to Diamond Edge?",
    steps: [
      {
        label: "The structure",
        short: "Structure",
        detail: "The site is laid out: home, services, rental equipment, projects and contact, built in Next.js 16 and Tailwind CSS 4.",
        where: "src/app/*",
      },
      {
        label: "The content",
        short: "Content",
        detail:
          "Sanity Studio, embedded at /studio, feeds the pages: services, rental categories, projects, project categories and the team. Editors choose which projects lead the homepage.",
        where: "sanity/schemas/*, src/app/studio",
      },
      {
        label: "Contact form",
        detail:
          "The visitor fills in name, company, email, phone, enquiry type and a description. Zod validates in the browser, and a hidden honeypot field quietly stops bots.",
        where: "src/app/contact/ContactForm.tsx",
      },
      {
        label: "API route",
        detail: "The form posts JSON to POST /api/inquiries. A body that is not valid JSON is rejected with a 400.",
        where: "src/app/api/inquiries/route.ts",
      },
      {
        label: "Validation",
        short: "Checks",
        detail: "The server requires a name and a well-formed email before anything is stored or sent.",
        where: "src/app/api/inquiries/route.ts",
        guard: true,
      },
      {
        label: "Saved to Sanity",
        short: "Saved",
        detail:
          "The lead is written as an inquiry document with status new. If the CMS is unreachable the request carries on, so email still goes out.",
        where: "src/app/api/inquiries/route.ts",
      },
      {
        label: "Resend email",
        short: "Email",
        detail:
          "Resend sends from the company's verified domain to the info inbox. Reply-to is the visitor, and the subject carries the enquiry type and their name.",
        where: "src/app/api/inquiries/route.ts",
      },
      {
        label: "Inbox",
        detail:
          "The team replies straight to the visitor. If the email fails but the lead was saved, the API answers 207 and the visitor is asked to call instead.",
        where: "src/app/contact/ContactForm.tsx",
      },
    ],
    outcome: "No enquiry is silently lost: it is either delivered, or saved with the visitor told to call.",
    finale: {
      label: "The site",
      detail: "Structure, content and the enquiry path together: the live website at diamondedgecutting.com.",
      where: "diamondedgecutting.com",
    },
  },
  {
    id: "csv-import",
    project: "talent-ai",
    title: "CSV to candidates",
    question: "How does a spreadsheet of people become candidates without creating duplicates?",
    steps: [
      {
        label: "Upload",
        detail: "An admin chooses a CSV file of people on the import page.",
        where: "admin/candidates/import/import-wizard.tsx",
      },
      {
        label: "Parsing",
        short: "Parse",
        detail:
          "The file is parsed in the browser with the same parser the server uses, so the preview shows exactly what will be written.",
        where: "src/lib/csv.ts",
      },
      {
        label: "Field mapping",
        short: "Map",
        detail:
          "Each column shows its first three values beside a target dropdown with suggested matches. Unmapped columns stay visible: a column nobody noticed is worse than one skipped on purpose.",
        where: "import-wizard.tsx (guessMapping)",
      },
      {
        label: "Validation",
        short: "Clean",
        detail:
          "Emails are normalised, LinkedIn links reduced to one canonical form, and placeholder cells such as “no linkedin found” are treated as empty instead of becoming data.",
        where: "src/lib/import-normalise.ts",
        guard: true,
      },
      {
        label: "Duplicate detection",
        short: "Dedupe",
        detail:
          "Matches happen only on identity fields (email, phone, LinkedIn URL, Clay profile ID), so two different people are never merged and existing data is not wiped.",
        where: "migration 20260925040000_import_duplicate_check.sql",
        guard: true,
      },
      {
        label: "Database",
        detail:
          "On commit the server re-parses the raw text with the chosen mapping, writes to Postgres and reports what was inserted, updated, skipped and why.",
        where: "admin/candidates/import/actions.ts",
      },
      {
        label: "Pools",
        detail: "Admins group verified candidates into pools with the pool builder and its candidate picker.",
        where: "src/app/(admin)/admin/pools/**",
      },
      {
        label: "Shared, and only shared",
        short: "Shared",
        detail:
          "A pool is shared with a client organisation. Row-level security means that client sees those candidates and nothing else; the database enforces it, not the interface.",
        where: "supabase/migrations (RLS policies)",
        guard: true,
      },
    ],
    outcome: "The admin sees every decision before it is written, and the server, not the browser, has the final say.",
  },
  {
    id: "mcp",
    project: "orcus",
    title: "Claude Code to the board",
    question: "How does an AI agent get to work on a project board, and only do what it should?",
    steps: [
      {
        label: "Claude Code",
        detail:
          "A teammate runs one command: claude mcp add --transport http --scope user orcus <site>/api/mcp. Claude Code discovers how to sign in from the server's metadata.",
        where: ".well-known/oauth-protected-resource",
      },
      {
        label: "OAuth 2.1",
        short: "OAuth",
        detail:
          "Supabase is the authorisation server. The client registers itself, the person approves it on a consent screen, and Claude Code receives a token for that person.",
        where: "app/oauth/consent",
      },
      {
        label: "MCP server",
        short: "Server",
        detail: "Requests arrive at /api/mcp over Streamable HTTP. An environment switch can turn the whole server off.",
        where: "app/api/mcp/route.ts",
      },
      {
        label: "JWT verification",
        short: "JWT",
        detail: "The bearer token is checked for its signing algorithm, issuer, audience and client before anything else happens.",
        where: "lib/mcp/token.ts",
        guard: true,
      },
      {
        label: "Connection check",
        short: "Connection",
        detail:
          "The connection must be on record and not revoked. Every call is written to an audit log against the connection that made it.",
        where: "lib/mcp/connection.ts, lib/mcp/log.ts",
        guard: true,
      },
      {
        label: "Role authorisation",
        short: "Role",
        detail:
          "Tools are advertised by role: an owner sees 38, a client 14. Hiding a tool is a courtesy; the dispatcher checks the role again before running it.",
        where: "lib/mcp/access.ts, lib/mcp/dispatch.ts",
        guard: true,
      },
      {
        label: "PostgreSQL and RLS",
        short: "RLS",
        detail:
          "The query runs under the caller's own token, so row-level security decides which rows exist for them. Revoked connections are refused here too.",
        where: "supabase/migrations",
        guard: true,
      },
    ],
    outcome: "The agent works with the person's own permissions. Nothing it does bypasses the rules the web app follows.",
    controls: [
      {
        label: "Audit log",
        detail: "Every tool call is written to mcp_call_log against the connection that made it.",
        where: "lib/mcp/log.ts",
      },
      {
        label: "Connection revocation",
        detail: "Each connected machine is listed on the Connect Claude page. Revoking one is enforced inside Postgres access rules, not just in the app.",
        where: "migration 20260916130003, app/(app)/settings/claude",
      },
      {
        label: "Kill switch",
        detail: "The MCP_ENABLED environment switch turns the whole MCP server off in one place.",
        where: "app/api/mcp/route.ts",
      },
    ],
  },
  {
    id: "lead",
    project: "entugo",
    title: "Visitor to lead",
    question: "How does a restaurant owner become a lead, in their language, without tracking them first?",
    steps: [
      {
        label: "Language",
        detail:
          "Middleware reads the browser's Accept-Language header and sends German speakers to /de. A cookie keeps a manual choice.",
        where: "src/middleware.ts",
      },
      {
        label: "Consent",
        detail:
          "Google Consent Mode v2 defaults to denied. Analytics and PostHog load only if the visitor accepts.",
        where: "src/lib/consent.ts, src/components/Analytics.tsx",
        guard: true,
      },
      {
        label: "Lead form",
        short: "Form",
        detail: "Restaurant name, email and city, with a hidden honeypot field.",
        where: "src/sections/Conversion.tsx",
      },
      {
        label: "API guards",
        short: "Guards",
        detail:
          "POST /api/signup checks the origin against an allow-list, rate-limits each IP to five a minute, validates and escapes every field.",
        where: "src/app/api/signup/route.ts",
        guard: true,
      },
      {
        label: "SendGrid",
        short: "Email",
        detail: "The team is notified by email with the lead's details.",
        where: "src/app/api/signup/route.ts",
      },
      {
        label: "Conversion event",
        short: "Event",
        detail:
          "If the visitor consented, a lead_form_submit event is sent without any form values, and the product's sign-up opens in a new tab.",
        where: "src/lib/analytics.ts",
      },
    ],
    outcome: "Leads reach the team, in either language, and nothing is measured without permission.",
  },
];
