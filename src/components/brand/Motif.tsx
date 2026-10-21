import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Signature motif — after Safi bowl painting and zellige geometry: concentric circles,
 * radiating brush strokes and a simplified eight-point star, drawn as thin hand-painted lines.
 * Every stroke carries pathLength=1 so it can be "drawn" with stroke-dashoffset.
 */
const RAYS = Array.from({ length: 16 }, (_, i) => i);

function starPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.62;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

export function Rosette({
  className,
  strokeWidth = 1.1,
  title,
}: {
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {/* slightly off-centre circles read as hand-painted */}
      <circle cx="50" cy="50.4" r="46" strokeWidth={strokeWidth} pathLength={1} />
      <circle cx="50.3" cy="50" r="38" strokeWidth={strokeWidth * 0.7} pathLength={1} />
      <circle cx="50" cy="49.8" r="24" strokeWidth={strokeWidth} pathLength={1} />
      <path
        pathLength={1}
        strokeWidth={strokeWidth * 0.9}
        d={RAYS.map((i) => {
          const a = (Math.PI / 8) * i;
          const r1 = 26.5;
          const r2 = i % 2 === 0 ? 36 : 33;
          const bend = 1.4;
          const x1 = 50 + Math.cos(a) * r1;
          const y1 = 50 + Math.sin(a) * r1;
          const x2 = 50 + Math.cos(a) * r2;
          const y2 = 50 + Math.sin(a) * r2;
          const mx = 50 + Math.cos(a + 0.05) * ((r1 + r2) / 2) + bend * 0.2;
          const my = 50 + Math.sin(a + 0.05) * ((r1 + r2) / 2);
          return `M${x1.toFixed(2)} ${y1.toFixed(2)} Q${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
        }).join(" ")}
      />
      <path pathLength={1} strokeWidth={strokeWidth} d={starPath(50, 50, 15)} />
      <circle cx="50" cy="50" r="3.2" strokeWidth={strokeWidth * 0.8} pathLength={1} />
    </svg>
  );
}

/** Small rosette used as a separator (marquee, lists). */
export function MotifDot({ className }: { className?: string }) {
  return <Rosette className={cn("inline-block size-5 shrink-0", className)} strokeWidth={2.4} />;
}

/** Horizontal section divider: a brushed line with a rosette at its centre. */
export function MotifDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 text-ochre", className)} aria-hidden>
      <svg viewBox="0 0 400 8" preserveAspectRatio="none" className="h-2 flex-1">
        <path
          d="M0 4.4 C 80 3.2, 160 5.2, 240 4 S 360 3.6, 400 4.2"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <Rosette className="size-7" strokeWidth={1.6} />
      <svg viewBox="0 0 400 8" preserveAspectRatio="none" className="h-2 flex-1">
        <path
          d="M0 4 C 60 4.8, 140 3.2, 220 4.2 S 340 4.8, 400 3.8"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}

/** Edge border made of repeated half-rosettes (footer top edge). */
export function MotifBorder({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={cn("block h-6 w-full", className)} aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id={`mb-${id}`} width="48" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 24 A24 24 0 0 1 48 24" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M8 24 A16 16 0 0 1 40 24" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path
            d="M24 24 L24 12 M17 24 L19 15 M31 24 L29 15"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="24" fill={`url(#mb-${id})`} />
    </svg>
  );
}

/** Large, very faint background watermark (4–6 % opacity). */
export function MotifWatermark({ className }: { className?: string }) {
  return (
    <Rosette
      className={cn("pointer-events-none absolute select-none opacity-[0.05]", className)}
      strokeWidth={0.6}
    />
  );
}

/** Corner ornament for cards: a quarter rosette. */
export function MotifCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      className={cn("size-10", className)}
      aria-hidden
    >
      <path d="M0 38 A38 38 0 0 1 38 0" strokeWidth="0.9" />
      <path d="M0 28 A28 28 0 0 1 28 0" strokeWidth="0.7" />
      <path d="M0 14 L8 12 M4 6 L10 8 M12 0 L12 7" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

/** Cracked pot for the 404 page — a vase drawn in the motif line style, split by a crack. */
export function CrackedPot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <g className="text-safi" strokeWidth="1.6">
        <path
          pathLength={1}
          d="M78 20 C 80 34, 72 44, 58 58 C 30 86, 28 140, 52 172 C 66 190, 84 198, 98 198"
        />
        <path pathLength={1} d="M70 18 L 96 18" />
      </g>
      <g className="text-clay" strokeWidth="1.6" transform="translate(10 6) rotate(6 140 120)">
        <path
          pathLength={1}
          d="M106 18 C 108 34, 122 44, 138 58 C 166 86, 168 140, 144 172 C 130 190, 112 198, 98 198"
        />
        <path pathLength={1} d="M104 18 L 130 18" />
      </g>
      {/* crack */}
      <path
        pathLength={1}
        className="text-ochre"
        strokeWidth="1.2"
        d="M98 22 L 92 52 L 104 76 L 94 104 L 106 132 L 96 160 L 102 196"
      />
      {/* painted bands */}
      <g className="text-safi" strokeWidth="0.9" opacity="0.7">
        <path d="M40 110 C 52 114, 70 116, 90 116" />
        <path d="M44 128 C 56 132, 72 134, 90 134" />
      </g>
      <g
        className="text-clay"
        strokeWidth="0.9"
        opacity="0.7"
        transform="translate(10 6) rotate(6 140 120)"
      >
        <path d="M108 116 C 128 116, 146 114, 158 110" />
        <path d="M108 134 C 126 134, 142 132, 154 128" />
      </g>
      <g className="text-ochre" strokeWidth="1">
        <path d="M40 210 L 60 206 M150 212 L 170 208 M88 214 L 104 212" />
      </g>
    </svg>
  );
}
