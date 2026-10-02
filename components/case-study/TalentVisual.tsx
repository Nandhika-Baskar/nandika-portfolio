import { Frame } from "./Frame";

/* Navigation copied from src/components/layout/nav-config.ts (admin area). */
const nav: Array<{ label?: string; items: string[] }> = [
  { items: ["Overview"] },
  { label: "Inventory", items: ["Sourcing", "Candidates", "Import CSV", "Field catalogue"] },
  { label: "Pools", items: ["All pools"] },
  { label: "Buyers", items: ["Organisations", "Shares", "Pool requests", "Intro requests"] },
];

/* Sample rows. Targets are real options from CORE_TARGETS in import-wizard.tsx. */
const columns = [
  { column: "Name", values: ["Asha Menon", "Rahim Q.", "Lena Vogt"], target: "Full name" },
  { column: "Email Address", values: ["asha@example.com", "rq@example.com", "—"], target: "Email" },
  { column: "Profile", values: ["linkedin.com/in/asha-m", "no linkedin found", "de.linkedin.com/in/lvogt"], target: "LinkedIn URL" },
  { column: "Title", values: ["Data engineer", "Product designer", "Backend developer"], target: "Current role" },
  { column: "Notes", values: ["met at meetup", "", "referral"], target: null },
];

const steps = ["Upload", "Map", "Preview", "Done"];

function Logo() {
  // The talent.ai mark: two discs and the lens between them (src/app/icon.svg).
  return (
    <svg viewBox="0 0 162.558 98.91" className="h-3.5 w-auto" aria-hidden>
      <defs>
        <linearGradient id="tai-p" x1="48.8" y1="66.3" x2="48.8" y2="-5.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF1370" />
          <stop offset="1" stopColor="#FF1370" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tai-u" x1="113.7" y1="32.6" x2="113.7" y2="104.4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6930C3" />
          <stop offset="1" stopColor="#6930C3" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="48.84" cy="49.45" r="48.84" fill="url(#tai-p)" />
      <circle cx="113.72" cy="49.45" r="48.84" fill="url(#tai-u)" />
    </svg>
  );
}

/** Recreation of the admin import screen, the part of the app where a mistake would be most expensive. */
export function TalentVisual() {
  return (
    <Frame
      tone="light"
      address="talent.ai / admin / candidates / import"
      caption="Import wizard, mapping step. Recreated from import-wizard.tsx and the app's navigation config; names and values are sample data."
    >
      <div className="flex min-h-[420px] bg-[#fcfcfb] text-[#161616]">
        <aside className="hidden w-[208px] shrink-0 border-r border-[#e7e5e0] bg-[#f4f3f0] px-3 py-4 md:block">
          <div className="flex items-center gap-2 px-2 pb-4">
            <Logo />
            <span className="text-[13px] font-semibold tracking-[-0.01em]">talent.ai</span>
          </div>
          <div className="mx-2 mb-4 rounded-[6px] bg-[#161616] px-3 py-1.5 text-center text-[11px] font-medium text-white">New pool</div>
          {nav.map((g, gi) => (
            <div key={gi} className="mb-3">
              {g.label && <p className="px-2 pb-1 text-[10px] text-[#6b6862]">{g.label}</p>}
              {g.items.map((item) => {
                const active = item === "Import CSV";
                return (
                  <p
                    key={item}
                    className={`relative rounded-[6px] px-2 py-1.5 text-[12px] ${active ? "bg-white font-medium shadow-[0_1px_2px_rgba(22,22,22,.08)]" : "text-[#505050]"}`}
                  >
                    {active && <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[#ff1270]" />}
                    {item}
                  </p>
                );
              })}
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <p className="text-[11px] text-[#6b6862]">Candidates / Import CSV</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <p className="text-[19px] font-semibold tracking-[-0.02em]">Import candidates</p>
            <ol className="flex items-center gap-1.5 text-[10.5px]" aria-label="Import steps">
              {steps.map((s, i) => (
                <li
                  key={s}
                  aria-current={s === "Map" ? "step" : undefined}
                  className={`rounded-full px-2.5 py-1 ${s === "Map" ? "bg-[#161616] text-white" : i < 1 ? "bg-[#e7e5e0] text-[#333331]" : "text-[#8a8a8a]"}`}
                >
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-2 max-w-[60ch] text-[11.5px] leading-[1.5] text-[#6b6862]">
            candidates-batch.csv: 42 rows, 5 columns. Each column shows its first three values. Unmapped columns are listed, not hidden.
          </p>

          <div className="mt-4 overflow-x-auto rounded-[8px] border border-[#e7e5e0] bg-white">
            <table className="w-full min-w-[520px] text-left text-[11.5px]">
              <thead className="bg-[#f4f3f0] text-[10.5px] text-[#6b6862]">
                <tr>
                  <th className="px-3 py-2 font-medium">Column in file</th>
                  <th className="px-3 py-2 font-medium">First three values</th>
                  <th className="px-3 py-2 font-medium">Maps to</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((c) => (
                  <tr key={c.column} className="border-t border-[#e7e5e0] align-top">
                    <td className="px-3 py-2.5 font-medium">{c.column}</td>
                    <td className="px-3 py-2.5 text-[#505050]">
                      {c.values.map((v, i) => (
                        <span key={i} className={`block truncate ${v === "no linkedin found" ? "text-[#a8a49b] line-through" : ""}`}>
                          {v || <span className="text-[#a8a49b]">empty</span>}
                        </span>
                      ))}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex min-w-[130px] items-center justify-between gap-2 rounded-[6px] border px-2 py-1 ${c.target ? "border-[#d4d1ca]" : "border-dashed border-[#d4d1ca] text-[#8a8a8a]"}`}
                      >
                        {c.target ?? "Don't import"}
                        <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 text-[#8a8a8a]" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <path d="m2 4 3 3 3-3" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-[#6b6862]">Matches on email, phone, LinkedIn URL or Clay profile ID update a person. Nothing else merges.</p>
            <span className="rounded-[6px] bg-[#161616] px-3.5 py-2 text-[11.5px] font-medium text-white">Next: preview</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
