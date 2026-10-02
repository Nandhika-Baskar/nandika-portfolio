"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { site, sectionIds } from "@/data/site";
import { projects } from "@/data/projects";
import { cn } from "@/lib/cn";
import { PALETTE_OPEN } from "./palette-events";

type Command = {
  id: string;
  group: "Go to" | "Projects" | "Elsewhere";
  label: string;
  hint?: string;
  run: () => void;
};

const goTo = (hash: string) => () => {
  const el = document.getElementById(hash);
  if (!el) return;
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  history.replaceState(null, "", `#${hash}`);
  // Move focus for keyboard and screen reader users, without a second scroll.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
};

/** A real link click: works in more embedding contexts than window.open. */
const openUrl = (href: string) => () => {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
};

function buildCommands(): Command[] {
  const cmds: Command[] = [
    { id: "work", group: "Go to", label: "Work", hint: "Selected projects", run: goTo(sectionIds.work) },
    { id: "capabilities", group: "Go to", label: "Capabilities", run: goTo(sectionIds.capabilities) },
    { id: "about", group: "Go to", label: "About", run: goTo(sectionIds.about) },
    { id: "contact", group: "Go to", label: "Contact", run: goTo(sectionIds.contact) },
    ...projects.map<Command>((p) => ({
      id: `p-${p.id}`,
      group: "Projects",
      label: p.name,
      hint: p.category,
      run: goTo(`project-${p.id}`),
    })),
  ];
  const { github, linkedin, resume, email } = site.links;
  if (github) cmds.push({ id: "github", group: "Elsewhere", label: "GitHub", hint: github.href.replace("https://", ""), run: openUrl(github.href) });
  if (linkedin) cmds.push({ id: "linkedin", group: "Elsewhere", label: "LinkedIn", run: openUrl(linkedin.href) });
  if (resume) cmds.push({ id: "resume", group: "Elsewhere", label: "Resume", run: openUrl(resume.href) });
  if (email) cmds.push({ id: "email", group: "Elsewhere", label: "Copy email", hint: email, run: () => void navigator.clipboard?.writeText(email) });
  return cmds;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const listId = useId();
  const commands = useMemo(buildCommands, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) returnFocus.current = document.activeElement as HTMLElement | null;
          return !o;
        });
        setQuery("");
        setActive(0);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_OPEN, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_OPEN, show);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const runAt = (i: number) => {
    const cmd = results[i];
    if (!cmd) return;
    setOpen(false);
    // Let the dialog unmount before scrolling so focus lands on the target.
    requestAnimationFrame(() => cmd.run());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(active);
    } else if (e.key === "Tab") {
      // The input is the only focus stop; keep focus inside the dialog.
      e.preventDefault();
    }
  };

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[14vh]" onKeyDown={onKeyDown}>
      <button type="button" aria-label="Close command menu" tabIndex={-1} className="absolute inset-0 bg-ink/70 backdrop-blur-[3px]" onClick={close} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="relative w-full max-w-[560px] overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-ink-2 shadow-[var(--shadow-float)] fade-in [--delay:0ms]"
        style={{ animationDuration: "180ms" }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-faint" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section, project or link"
            className="h-14 w-full bg-transparent text-body text-paper placeholder:text-faint focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="rounded-[4px] border border-line px-1.5 py-0.5 font-sans text-meta text-faint">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Commands" className="no-scrollbar max-h-[min(420px,55vh)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-small text-mute">Nothing matches “{query}”. Try work, about or a project name.</li>}
          {results.map((c, i) => {
            const heading = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {heading && <p className="px-3 pb-1 pt-3 text-meta text-faint" aria-hidden>{heading}</p>}
                <div
                  id={`${listId}-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  onPointerMove={() => setActive(i)}
                  onClick={() => runAt(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 rounded-[var(--radius-sm)] px-3 py-2.5 text-small",
                    i === active ? "bg-ink-3 text-paper" : "text-mute",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden className={cn("h-3 w-px transition-colors", i === active ? "bg-signal" : "bg-transparent")} />
                    {c.label}
                  </span>
                  {c.hint && <span className="truncate text-meta text-faint">{c.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-meta text-faint">
          <span>
            <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> to move, <kbd className="font-sans">Enter</kbd> to open
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </div>
      </div>
    </div>
  );
}
