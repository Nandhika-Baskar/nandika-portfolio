import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Edge, Node, Stage, Tag, type WorldProps } from "./kit";

/* Talent AI: people as points of light. A spreadsheet breaks into people,
   they are sorted, cleaned and de-duplicated, gathered into the database,
   grouped into pools, and one pool is shared with one client, who sees
   nothing else.

   Steps: 0 upload · 1 parse · 2 map · 3 clean · 4 dedupe · 5 database ·
          6 pools · 7 shared */

const N = 24;
const lanes = ["email", "phone", "LinkedIn", "name"];
/** The two rows that turn out to be the same person */
const DUP_A = 5;
const DUP_B = 17;
/** Placeholder cells that cleaning empties */
const PLACEHOLDER = [9, 14];

const pools = [
  { x: 750, y: 150, r: 62 },
  { x: 810, y: 330, r: 70 },
  { x: 740, y: 505, r: 58 },
];

function position(i: number, step: number): { x: number; y: number; o: number } {
  const row = Math.floor(i / 4);
  const col = i % 4;
  // 0: rows of a sheet
  if (step <= 0) return { x: 112 + col * 44, y: 196 + row * 44, o: step < 0 ? 0 : 1 };
  // 1: lifted out of the sheet, still in rows, loosening
  if (step === 1) return { x: 120 + col * 50 + (row % 2) * 12, y: 186 + row * 48 + (col % 2) * 6, o: 1 };
  // 2-3: sorted into one lane per field
  if (step <= 3) {
    const lane = col;
    const x = 340 + row * 34 + (lane % 2) * 10;
    const y = 190 + lane * 82;
    const faded = step === 3 && PLACEHOLDER.includes(i) ? 0.25 : 1;
    return { x, y, o: faded };
  }
  // 4: the duplicates meet; everything else holds in the lanes
  if (step === 4) {
    if (i === DUP_A || i === DUP_B) return { x: 520, y: 312, o: i === DUP_B ? 0.15 : 1 };
    return { x: 340 + row * 34 + (col % 2) * 10, y: 190 + col * 82, o: 1 };
  }
  if (i === DUP_B) return { x: 520, y: 312, o: 0 };
  // 5: gathered inside the database
  if (step === 5) {
    const a = (i / N) * Math.PI * 2 * 3;
    const rad = 10 + (i % 6) * 9;
    return { x: 530 + Math.cos(a) * rad * 1.25, y: 330 + Math.sin(a) * rad * 0.55 + ((i % 3) - 1) * 26, o: 1 };
  }
  // 6-7: grouped into pools
  const p = pools[i % 3];
  const a = (i / N) * Math.PI * 2 * 3 + (i % 3);
  const rad = p.r * (0.35 + ((i * 7) % 5) * 0.12);
  const dim = step >= 7 && i % 3 !== 1 ? 0.3 : 1;
  return { x: p.x + Math.cos(a) * rad, y: p.y + Math.sin(a) * rad, o: dim };
}

export function TalentWorld({ step }: WorldProps) {
  const at = (i: number) => step >= i;
  const now = (i: number) => step === i;
  return (
    <Stage
      className="world-talent"
      lines={
        <>
          {/* the sheet */}
          <Edge d="M86 160H284V430H86Z" on={step >= 0 && step <= 1} active={now(0)} />
          <Edge d="M86 178H284" on={step === 1} dashed />
          {/* lanes */}
          {lanes.map((_, l) => (
            <Edge key={l} d={`M326 ${190 + l * 82}H604`} on={step >= 2 && step <= 4} dashed delay={l * 120} />
          ))}
          {/* database */}
          <g className="db" data-on={at(5)}>
            <Edge d="M440 250C440 226 620 226 620 250V410C620 434 440 434 440 410Z" on={at(5)} active={now(5)} />
            <Edge d="M440 250C440 274 620 274 620 250" on={at(5)} delay={200} />
          </g>
          {/* pools */}
          {pools.map((p, k) => (
            <Edge
              key={k}
              d={`M${p.x - p.r} ${p.y}A${p.r} ${p.r} 0 1 0 ${p.x + p.r} ${p.y}A${p.r} ${p.r} 0 1 0 ${p.x - p.r} ${p.y}`}
              on={at(6)}
              active={now(6)}
              dashed={step >= 7 && k !== 1}
              delay={k * 180}
            />
          ))}
          <Edge d="M620 330C680 330 700 160 708 150" on={now(6)} flow dashed />
          <Edge d="M620 330C680 330 710 330 740 330" on={now(6)} flow dashed delay={120} />
          <Edge d="M620 330C680 330 700 500 702 505" on={now(6)} flow dashed delay={240} />
          {/* sharing: one pool, one client */}
          <Edge d="M880 330C910 330 930 330 956 330" on={at(7)} flow={now(7)} active={now(7)} />
        </>
      }
    >
      {Array.from({ length: N }, (_, i) => {
        const p = position(i, step);
        return (
          <span
            key={i}
            aria-hidden
            className={cn("person", (i === DUP_A || i === DUP_B) && step === 4 && "person-dup")}
            style={{ left: 0, top: 0, translate: `calc(${p.x} * 0.1cqw) calc(${p.y} * 0.1cqw)`, opacity: p.o, transitionDelay: `${(i % 8) * 28}ms` } as CSSProperties}
          />
        );
      })}

      <Tag x={86} y={130} on={step >= 0 && step <= 1}>
        candidates.csv
      </Tag>
      <Tag x={86} y={442} on={now(1)} className="text-faint">
        parsed in the browser, same parser as the server
      </Tag>
      {lanes.map((l, k) => (
        <Tag key={l} x={612} y={180 + k * 82} on={step >= 2 && step <= 4}>
          {l}
        </Tag>
      ))}
      <Tag x={340} y={540} on={now(3)}>
        “no linkedin found” → empty
      </Tag>
      <Node x={520} y={312} on={now(4)} active shape="diamond" label="same LinkedIn URL" sub="one person, not two" side="bottom" />
      <Tag x={444} y={448} on={at(5)}>
        Postgres
      </Tag>
      {pools.map((p, k) => (
        <Tag key={k} x={p.x - 20} y={p.y - p.r - 26} on={at(6)} className={cn(step >= 7 && k !== 1 && "opacity-40")}>
          pool {String(k + 1).padStart(2, "0")}
        </Tag>
      ))}
      <Node x={966} y={330} on={at(7)} active={now(7)} shape="spark" label="client org" sub="sees this pool only" side="bottom" guide />
      <Tag x={880} y={392} on={at(7)} className="text-faint">
        row-level security
      </Tag>
    </Stage>
  );
}
