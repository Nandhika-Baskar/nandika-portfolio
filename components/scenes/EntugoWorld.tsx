import type { CSSProperties } from "react";
import { Edge, Node, Stage, Tag, px, py, type WorldProps } from "./kit";

/* Entugo: language, geography, movement. A visitor arrives over a faint
   graticule, the road forks by language, a consent gate holds analytics
   back, both roads meet at the form, the request passes four rings of
   guards, and a lead arrives with the team.

   Steps: 0 language · 1 consent · 2 form · 3 guards · 4 SendGrid ·
          5 conversion event · 6 (finale) */

const guards = [
  { r: 24, label: "origin allow-list" },
  { r: 36, label: "5 per minute per IP" },
  { r: 48, label: "honeypot" },
  { r: 60, label: "validated, escaped" },
];
const AX = 742;
const AY = 320;

export function EntugoWorld({ step }: WorldProps) {
  const at = (i: number) => step >= i;
  const now = (i: number) => step === i;
  return (
    <Stage
      className="world-entugo"
      lines={
        <>
          {/* graticule: the ground the journey crosses */}
          <g className="graticule" data-on={at(0)}>
            {[120, 220, 320, 420, 520].map((y, i) => (
              <path key={y} d={`M0 ${y}C250 ${y - 26 + i * 6} 750 ${y - 26 + i * 6} 1000 ${y}`} />
            ))}
            {[200, 400, 600, 800].map((x) => (
              <path key={x} d={`M${x} 40C${x - 30} 240 ${x - 30} 400 ${x} 600`} />
            ))}
          </g>
          {/* the fork */}
          <Edge d="M96 320C200 320 220 190 330 190H468" on={at(0)} flow={step >= 0 && step < 2} active={now(0)} />
          <Edge d="M96 320C200 320 220 450 330 450H468" on={at(0)} flow={step >= 0 && step < 2} active={now(0)} delay={200} />
          {/* consent gate across both roads */}
          <Edge d="M470 150V490" on={at(1)} dashed active={now(1)} />
          {/* roads meet at the form */}
          <Edge d="M472 190C540 190 560 300 594 316" on={at(2)} flow={at(2) && step < 6} delay={100} />
          <Edge d="M472 450C540 450 560 340 594 324" on={at(2)} flow={at(2) && step < 6} delay={250} />
          <Edge d={`M610 320H${AX - 64}`} on={at(3)} flow={at(3) && step < 6} active={now(3)} />
          {/* guards */}
          {guards.map((g, k) => (
            <Edge
              key={g.r}
              d={`M${AX - g.r} ${AY}A${g.r} ${g.r} 0 1 0 ${AX + g.r} ${AY}A${g.r} ${g.r} 0 1 0 ${AX - g.r} ${AY}`}
              on={at(3)}
              active={now(3)}
              delay={k * 260}
              speed={1.2}
            />
          ))}
          {/* the lead goes to the team */}
          <Edge d={`M${AX + 50} ${AY + 40}C820 400 840 420 862 426`} on={at(4)} flow={now(4)} active={now(4)} />
          <Edge d="M878 432C910 456 930 480 946 500" on={at(4)} flow={now(4)} delay={250} />
          {/* the measured moment, only with consent */}
          <Edge d={`M${AX + 30} ${AY - 54}C790 200 830 130 866 112`} on={at(5)} flow={now(5)} dashed active={now(5)} />
        </>
      }
    >
      <Node x={92} y={320} on={at(0)} active={now(0)} shape="dot" label="visitor" sub="Accept-Language" side="bottom" />
      <span className="lang-mark" data-on={at(0)} style={{ left: px(350), top: py(150) } as CSSProperties} aria-hidden>
        DE
      </span>
      <span className="lang-mark" data-on={at(0)} style={{ left: px(350), top: py(410) } as CSSProperties} aria-hidden>
        EN
      </span>
      <Tag x={392} y={204} on={at(0)} className="text-faint">
        /de
      </Tag>
      <Tag x={392} y={464} on={at(0)} className="text-faint">
        /
      </Tag>
      <Tag x={150} y={360} on={now(0)}>
        a cookie remembers a manual choice
      </Tag>

      <Node x={470} y={320} on={at(1)} active={now(1)} shape="diamond" label="Consent Mode v2" sub="denied until accepted" side="bottom" />
      <Node x={872} y={108} on={at(1)} active={now(5)} shape="ring" label="GA4" sub={at(5) ? "lead_form_submit" : "waiting for consent"} side="left" className={at(5) ? "" : "node-dim"} />
      <Node x={952} y={168} on={at(1)} shape="ring" label="PostHog" sub="optional" side="left" className="node-dim" />

      <Node x={602} y={320} on={at(2)} active={now(2)} shape="square" label="lead form" sub="restaurant · email · city" side="top" />
      <Node x={AX} y={AY} on={at(3)} active={now(3)} shape="dot" label="POST /api/signup" side="top" />
      {guards.map((g, k) => (
        <Tag key={g.label} x={AX + 70} y={AY + 8 + k * 18} on={now(3)} className="text-faint">
          <span className="world-tag-delay" style={{ transitionDelay: `${k * 260}ms` }}>
            {g.label}
          </span>
        </Tag>
      ))}
      <Node x={870} y={428} on={at(4)} active={now(4)} shape="ring" label="SendGrid" side="right" />
      <Node x={950} y={502} on={at(4)} active={now(4) || step >= 6} shape="spark" label="the team" sub="a new lead" side="left" guide />
      <Tag x={700} y={150} on={now(5)}>
        no form values are sent
      </Tag>
    </Stage>
  );
}
