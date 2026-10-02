import { asset } from "@/lib/asset";
import { Edge, Node, Stage, Tag, px, py, type WorldProps } from "./kit";

/* Diamond Edge: a blueprint. The page draws itself as a wireframe, the CMS
   pours content into its blocks, the enquiry path is built out to an inbox,
   and at the end the real site appears inside the frame.

   Steps: 0 structure · 1 content · 2 form · 3 API · 4 validation ·
          5 saved to Sanity · 6 Resend · 7 inbox · 8 (finale) the site */

const r = (x: number, y: number, w: number, h: number) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;

const blocks = [
  { id: "nav", x: 110, y: 80, w: 390, h: 22, label: null },
  { id: "hero", x: 110, y: 118, w: 390, h: 150, label: "home" },
  { id: "s1", x: 110, y: 288, w: 120, h: 82, label: "services" },
  { id: "s2", x: 245, y: 288, w: 120, h: 82, label: "rental" },
  { id: "s3", x: 380, y: 288, w: 120, h: 82, label: null },
  { id: "proj", x: 110, y: 388, w: 390, h: 70, label: "projects" },
  { id: "form", x: 110, y: 478, w: 190, h: 92, label: "contact" },
];

export function DiamondWorld({ step }: WorldProps) {
  const at = (i: number) => step >= i;
  const now = (i: number) => step === i;
  const done = step >= 8;
  return (
    <Stage
      className="world-diamond"
      lines={
        <>
          {/* the frame, then each block, drawn in order */}
          <Edge d={r(90, 60, 430, 530)} on={at(0)} active={now(0)} speed={3} />
          {blocks.map((b, i) => (
            <g key={b.id} className="wf-block" data-fill={at(1) && b.id !== "nav" && b.id !== "form"} data-done={done}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} className="wf-fill" />
              <Edge d={r(b.x, b.y, b.w, b.h)} on={at(0)} delay={200 + i * 140} />
            </g>
          ))}
          {/* form fields */}
          <Edge d="M126 502H284M126 522H284M126 542H220" on={at(2)} active={now(2)} />
          {/* CMS feeding the page */}
          <Edge d="M770 120C660 120 620 190 500 192" on={at(1)} flow={now(1)} dashed />
          <Edge d="M770 128C680 170 640 330 500 330" on={at(1)} flow={now(1)} dashed delay={150} />
          <Edge d="M776 136C720 260 640 420 500 424" on={at(1)} flow={now(1)} dashed delay={300} />
          {/* enquiry path */}
          <Edge d="M300 524C420 524 470 496 592 494" on={at(3)} flow={step >= 3 && step < 8} active={now(3)} />
          <Edge d="M608 492C640 486 660 474 686 470" on={at(3)} flow={step >= 3 && step < 8} delay={200} />
          <Edge d="M700 456C760 380 820 260 792 132" on={at(5)} flow={now(5)} active={now(5)} />
          <Edge d="M704 482C750 520 790 546 832 556" on={at(6)} flow={step >= 6 && step < 8} active={now(6)} />
          <Edge d="M850 550C890 530 920 500 944 476" on={at(7)} flow={now(7)} active={now(7)} />
        </>
      }
    >
      {/* the real site, emerging inside the hero block at the end */}
      <img
        src={asset("/work/diamond-edge/hero-640.webp")}
        srcSet={`${asset("/work/diamond-edge/hero-640.webp")} 640w, ${asset("/work/diamond-edge/hero-1280.webp")} 1280w`}
        sizes="40vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="world-emerge absolute object-cover"
        data-on={done}
        style={{ left: px(110), top: py(118), width: px(390), height: py(150) }}
      />
      {blocks.map((b) =>
        b.label ? (
          <Tag key={b.id} on={at(0)} x={b.x + 8} y={b.y + 6}>
            {b.label}
          </Tag>
        ) : null,
      )}
      <Tag x={92} y={36} on={at(0)} className="text-faint">
        diamondedgecutting.com
      </Tag>

      <Node x={790} y={118} on={at(1)} active={now(1) || now(5)} shape="square" label="Sanity Studio" sub={now(5) ? "inquiry · status new" : "/studio"} />
      <Tag x={612} y={226} on={now(1)}>
        services · rental · projects · team
      </Tag>
      <Node x={200} y={548} on={at(2)} active={now(2)} shape="none" label={now(2) ? "zod · honeypot" : undefined} side="bottom" />
      <Node x={600} y={493} on={at(4)} active={now(4)} shape="diamond" label="name + email" sub="checked" side="bottom" />
      <Node x={694} y={468} on={at(3)} active={now(3)} shape="ring" label="POST /api/inquiries" side="top" />
      <Node x={840} y={556} on={at(6)} active={now(6)} shape="dot" label="Resend" sub="verified domain" side="bottom" />
      <Node x={950} y={470} on={at(7)} active={now(7)} shape="spark" label="info@ inbox" sub="reply-to: visitor" side="left" guide />
      <Tag x={320} y={600} on={at(7)} className="text-faint">
        email fails → lead kept (207), visitor asked to call
      </Tag>
    </Stage>
  );
}
