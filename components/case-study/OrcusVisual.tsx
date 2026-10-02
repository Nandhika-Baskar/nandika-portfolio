"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Frame } from "./Frame";

/* Column names from the task_status enum; agent chips from the ai_status enum and its labels. */
const board: Array<{ column: string; cards: Array<{ title: string; agent?: "working" | "needs_you" | "ready_for_check" }> }> = [
  { column: "To do", cards: [{ title: "Draft the onboarding checklist" }, { title: "Collect logo files from client" }] },
  { column: "In progress", cards: [{ title: "Build the pricing table", agent: "working" }, { title: "Confirm launch date" }] },
  { column: "In review", cards: [{ title: "Rewrite the FAQ copy", agent: "needs_you" }, { title: "Contact form fixes", agent: "ready_for_check" }] },
  { column: "Completed", cards: [{ title: "Set up staging" }] },
];

const agentLabel = { working: "Agent working", needs_you: "Needs you", ready_for_check: "Ready for check" } as const;

/* Counts of tools each role is offered, from the role filter in lib/mcp/access.ts. */
const roles = [
  { role: "Owner", tools: 38 },
  { role: "Team", tools: 36 },
  { role: "Agent", tools: 29 },
  { role: "Client", tools: 14 },
];

/**
 * The 38 tools as a grid of cells. Picking a role lights the number of tools
 * that role is offered. Counts are exact; which cells light is illustrative,
 * since the grid shows how many, not which.
 */
function ToolMatrix() {
  const [roleIndex, setRoleIndex] = useState(0);
  const { role, tools } = roles[roleIndex];
  return (
    <div className="flex flex-col rounded-[var(--radius-md)] border border-line bg-ink-2 p-5 md:col-span-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-small text-paper">Role-filtered tools</p>
        <p className="text-meta text-faint">
          <span className="text-title font-[520] tabular-nums text-paper">{tools}</span> / 38
        </p>
      </div>
      <div role="radiogroup" aria-label="Show tools offered to a role" className="mt-4 flex flex-wrap gap-1.5">
        {roles.map((r, i) => (
          <button
            key={r.role}
            type="button"
            role="radio"
            aria-checked={i === roleIndex}
            onClick={() => setRoleIndex(i)}
            className={cn(
              "h-8 rounded-full border px-3 text-small transition-colors duration-[var(--duration-fast)]",
              i === roleIndex ? "border-paper bg-paper text-ink" : "border-line-strong text-mute hover:text-paper",
            )}
          >
            {r.role}
          </button>
        ))}
      </div>
      <div aria-hidden className="mt-6 grid grid-cols-[repeat(19,minmax(0,1fr))] gap-1">
        {Array.from({ length: 38 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "aspect-square rounded-[2px] border transition-[background-color,border-color] duration-[var(--duration-base)]",
              i < tools ? "border-signal/50 bg-signal/45" : "border-line-strong bg-transparent",
            )}
            style={{ transitionDelay: `${i * 12}ms` }}
          />
        ))}
      </div>
      <p className="mt-auto pt-6 text-meta text-faint" aria-live="polite">
        {role}: {tools} of 38 tools offered. Filtered before they are advertised, checked again before they run.
      </p>
    </div>
  );
}

export function OrcusVisual() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-12 md:gap-5 [&>*]:min-w-0">
      <figure className="m-0 md:col-span-7">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-[#0d0d0c]">
          <div className="flex h-9 items-center border-b border-line px-4 text-[11px] text-faint">Terminal</div>
          <pre className="no-scrollbar overflow-x-auto p-5 text-[12px] leading-[1.75] text-paper sm:p-6">
            <code>
              <span className="text-faint"># one command per teammate</span>
              {"\n"}
              <span className="text-signal">$</span> claude mcp add --transport http --scope user orcus \{"\n"}
              {"    "}https://pixsl-project-manager.vercel.app/api/mcp \{"\n"}
              {"    "}--callback-port 29352{"\n\n"}
              <span className="text-faint"># Claude Code then signs in through the app&apos;s OAuth consent screen,</span>
              {"\n"}
              <span className="text-faint"># and every tool call runs as that person.</span>
            </code>
          </pre>
        </div>
        <figcaption className="mt-3 text-meta text-faint">The connect command, as given on the Connect Claude settings page and in docs/SETUP.md.</figcaption>
      </figure>

      <ToolMatrix />

      <Frame
        className="md:col-span-12"
        address="Orcus / project board"
        caption="Board with agent status, recreated from the task and ai_status enums. Task titles are sample data; styling simplified."
      >
        <div className="no-scrollbar grid auto-cols-[minmax(200px,1fr)] grid-flow-col gap-3 overflow-x-auto p-4 sm:p-5">
          {board.map((col) => (
            <div key={col.column} className="min-w-[200px] rounded-[var(--radius-sm)] bg-ink-3/60 p-2.5">
              <p className="flex items-center justify-between px-1 pb-2 text-[11.5px] text-mute">
                {col.column}
                <span className="tabular-nums text-faint">{col.cards.length}</span>
              </p>
              <ul className="space-y-2">
                {col.cards.map((card) => (
                  <li key={card.title} className="rounded-[var(--radius-sm)] border border-line bg-ink-2 p-3">
                    <p className="text-[12.5px] leading-[1.4] text-paper">{card.title}</p>
                    {card.agent && (
                      <p
                        className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] ${
                          card.agent === "working" ? "border-signal/40 text-signal" : "border-line-strong text-mute"
                        }`}
                      >
                        <span aria-hidden className={`size-1.5 rounded-full ${card.agent === "working" ? "blink bg-signal" : "bg-paper/40"}`} />
                        {agentLabel[card.agent]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}
