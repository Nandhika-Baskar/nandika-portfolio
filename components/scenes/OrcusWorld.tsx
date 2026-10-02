import type { CSSProperties } from "react";
import { Edge, Node, Stage, Tag, px, py, type WorldProps } from "./kit";

/* Orcus: a guarded constellation. Claude Code sits outside. It passes a
   consent screen, reaches a server ringed by its 38 tools, crosses a gate,
   is written into a log, sees only the tools its role allows, and reaches
   the data only through row-level security.

   Steps: 0 Claude Code · 1 OAuth · 2 server · 3 JWT · 4 connection ·
          5 role · 6 RLS · 7 (finale) controls */

const CX = 590;
const CY = 316;
const RX = 250;
const RY = 236;
/** Tools offered to the agent role, out of 38 */
const AGENT = 29;

const tools = Array.from({ length: 38 }, (_, i) => {
  const a = (i / 38) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.round((CX + Math.cos(a) * RX) * 10) / 10, y: Math.round((CY + Math.sin(a) * RY) * 10) / 10 };
});

export function OrcusWorld({ step }: WorldProps) {
  const at = (i: number) => step >= i;
  const now = (i: number) => step === i;
  const finale = step >= 7;
  return (
    <Stage
      className="world-orcus"
      lines={
        <>
          {/* the outer orbit the tools sit on */}
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} className="orbit-line" data-on={at(2)} />
          {/* sign-in: out to consent and back */}
          <Edge d="M138 304C170 200 220 150 282 136" on={at(1)} flow={now(1)} active={now(1)} />
          <Edge d="M318 136C420 150 500 230 540 290" on={at(1)} flow={now(1)} dashed delay={300} />
          {/* the connection itself */}
          <Edge d={`M140 ${CY}C260 ${CY} 400 ${CY} ${CX - 72} ${CY}`} on={at(0)} flow={at(2)} active={now(0)} dashed={!at(2)} speed={2} />
          {/* the gate */}
          <Edge d={`M${CX - 70} ${CY}A70 70 0 1 0 ${CX + 70} ${CY}A70 70 0 1 0 ${CX - 70} ${CY}`} on={at(3)} active={now(3)} speed={1.6} />
          {/* to the data, through RLS */}
          <Edge d={`M${CX + 48} ${CY + 52}C700 470 800 520 882 528`} on={at(6)} flow={at(6)} active={now(6)} />
          {/* the log */}
          <Edge d="M330 602H850" on={at(4)} dashed />
        </>
      }
    >
      {tools.map((t, i) => (
        <span
          key={i}
          aria-hidden
          className="tool"
          data-on={at(2)}
          data-lit={at(5) && i < AGENT}
          style={{ left: px(t.x), top: py(t.y), transitionDelay: `${i * 22}ms` } as CSSProperties}
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="log-tick"
          data-on={at(4)}
          style={{ left: px(350 + i * 40), top: py(602), transitionDelay: `${i * 70}ms` } as CSSProperties}
        />
      ))}

      <Node x={124} y={CY} on={at(0)} active={now(0)} shape="square" label="Claude Code" sub="claude mcp add … orcus" side="bottom" />
      <Node x={300} y={136} on={at(1)} active={now(1)} shape="ring" label="OAuth 2.1 consent" sub="Supabase authorisation server" side="top" />
      <Node x={CX} y={CY} on={at(2)} active={now(2) || finale} shape="spark" label="MCP server" sub="/api/mcp" side="bottom" guide className="node-lg" />
      <Tag x={CX + 80} y={CY - 96} on={now(3)}>
        JWT · ES256 · issuer · audience · client
      </Tag>
      <Tag x={CX + RX - 40} y={CY - RY + 6} on={at(2)}>
        {at(5) ? `agent · ${AGENT} of 38` : "38 tools"}
      </Tag>
      <Tag x={CX + RX - 40} y={CY - RY + 26} on={now(5)} className="text-faint">
        owner 38 · team 36 · agent 29 · client 14
      </Tag>
      <Tag x={330} y={572} on={at(4)}>
        mcp_call_log · every call, per connection
      </Tag>
      <Node x={896} y={530} on={at(6)} active={now(6)} shape="square" label="Postgres" sub="row-level security" side="top" />

      {/* the controls that wrap it all */}
      <Tag x={40} y={40} on={finale} className="text-signal">
        audit log · revoke a machine · kill switch
      </Tag>
      <Tag x={120} y={360} on={finale} className="text-faint">
        revocable per connection
      </Tag>
      <Tag x={CX - 40} y={CY + 92} on={finale} className="text-faint">
        MCP_ENABLED
      </Tag>
    </Stage>
  );
}
