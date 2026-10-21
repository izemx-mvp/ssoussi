import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { Img } from "@/components/brand/Img";
import { craftCities } from "@/data/crafts";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

// Simple equirectangular projection onto a 540 × 460 viewBox (northern Morocco).
const W = 620;
const H = 480;
const project = (lon: number, lat: number) => ({ x: (lon + 12.4) * 54, y: (36.2 - lat) * 62 });
const toPath = (pts: [number, number][]) =>
  pts
    .map(([lon, lat], i) => {
      const { x, y } = project(lon, lat);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

// Stylised coastline — Mediterranean, Atlantic — and eastern edge; the south fades out.
const OUTLINE =
  toPath([
    [-5.92, 35.79],
    [-5.8, 35.78],
    [-5.35, 35.88],
    [-5.3, 35.6],
    [-4.67, 35.21],
    [-3.93, 35.25],
    [-2.97, 35.43],
    [-2.93, 35.17],
    [-2.22, 35.09],
    [-1.75, 34.68],
    [-1.7, 33.5],
    [-1.22, 32.12],
    [-2.5, 31.55],
    [-3.7, 30.9],
    [-5.2, 30.1],
    [-6.6, 29.5],
    [-8.7, 28.7],
    [-10.6, 28.4],
    [-10.18, 29.38],
    [-9.9, 29.85],
    [-9.62, 30.42],
    [-9.89, 30.64],
    [-9.82, 31.1],
    [-9.77, 31.51],
    [-9.5, 32.0],
    [-9.27, 32.3],
    [-9.28, 32.54],
    [-8.5, 33.25],
    [-7.62, 33.6],
    [-7.38, 33.69],
    [-6.84, 34.03],
    [-6.66, 34.27],
    [-6.15, 35.19],
    [-6.03, 35.47],
    [-5.92, 35.79],
  ]) + " Z";
const HIGH_ATLAS = toPath([
  [-9.4, 30.8],
  [-8.6, 30.95],
  [-7.9, 31.12],
  [-7.1, 31.35],
  [-6.5, 31.6],
  [-5.6, 32.0],
  [-5.0, 32.3],
  [-4.3, 32.6],
  [-3.6, 32.95],
]);
const MIDDLE_ATLAS = toPath([
  [-6.2, 32.6],
  [-5.6, 33.05],
  [-5.0, 33.45],
  [-4.3, 33.9],
  [-3.8, 34.2],
]);

export function MoroccoMap({ className }: { className?: string }) {
  const { t, l, lp } = useI18n();
  const reduce = useReducedMotion();
  const cities = useMemo(() => craftCities(), []);
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      cities.findIndex((c) => c.featured),
    ),
  );
  const uid = useId().replace(/:/g, "");
  const city = cities[active]!;
  const lead = city.crafts[0]!;

  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]", className)}>
      {/* Desktop / tablet: interactive map */}
      <div className="relative hidden sm:block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="group"
          aria-label={t.home.mapEyebrow}
        >
          <defs>
            <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.68" stopColor="white" />
              <stop offset="0.95" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id={`mask-${uid}`}>
              <rect width={W} height={H} fill={`url(#fade-${uid})`} />
            </mask>
          </defs>
          <g mask={`url(#mask-${uid})`}>
            <motion.path
              d={OUTLINE}
              fill="var(--cream)"
              stroke="var(--safi-blue)"
              strokeWidth="1.3"
              strokeLinejoin="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <path
              d={OUTLINE}
              fill="none"
              stroke="var(--safi-blue)"
              strokeWidth="0.5"
              opacity="0.35"
              transform="translate(5 4)"
            />
            <path
              d={HIGH_ATLAS}
              fill="none"
              stroke="var(--ochre)"
              strokeWidth="1"
              strokeDasharray="2 5"
              strokeLinecap="round"
            />
            <path
              d={MIDDLE_ATLAS}
              fill="none"
              stroke="var(--ochre)"
              strokeWidth="1"
              strokeDasharray="2 5"
              strokeLinecap="round"
            />
          </g>
          <text x={14} y={330} className="fill-safi/50 font-display text-[15px] italic" aria-hidden>
            {l({ fr: "Océan Atlantique", en: "Atlantic Ocean" })}
          </text>
          {cities.map((c, i) => {
            const { x, y } = project(c.coords.lon, c.coords.lat);
            const on = i === active;
            return (
              <g
                key={c.city.fr}
                role="button"
                tabIndex={0}
                aria-label={`${l(c.city)} — ${c.crafts.map((k) => l(k.short)).join(", ")}`}
                aria-pressed={on}
                className="cursor-pointer outline-none [&:focus-visible_circle.ring]:stroke-clay-deep"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(i))
                }
              >
                <circle cx={x} cy={y} r={22} fill="transparent" />
                <circle
                  className="ring"
                  cx={x}
                  cy={y}
                  r={on ? 15 : 10}
                  fill="none"
                  stroke={c.featured ? "var(--clay)" : "var(--safi-blue)"}
                  strokeWidth="1"
                  opacity={on ? 1 : 0.5}
                  style={{ transition: "r .3s, opacity .3s" }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={c.featured ? 6 : 4.5}
                  fill={c.featured ? "var(--clay)" : "var(--safi-blue)"}
                />
                <text
                  x={x + (c.coords.lon < -9 ? -14 : 14)}
                  y={y + 4}
                  textAnchor={c.coords.lon < -9 ? "end" : "start"}
                  className={cn("font-display text-[17px]", on ? "fill-ink" : "fill-ink/70")}
                >
                  {l(c.city)}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-xs text-muted-foreground">{t.home.mapHint}</p>
      </div>

      {/* Active city card (desktop) */}
      <div className="hidden sm:block" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={city.city.fr}
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: 0.35 }}
            className="rounded-[2rem] border border-border bg-cream p-5"
          >
            <div className="mask-bowl overflow-hidden">
              <Img
                media={lead.image}
                alt={l(lead.name)}
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="aspect-[16/10] w-full"
                focus={lead.steps[0]?.focus}
              />
            </div>
            <p className="eyebrow mt-5">{l(lead.region)}</p>
            <h3 className="mt-2 text-4xl">{l(city.city)}</h3>
            <ul className="mt-4 space-y-2">
              {city.crafts.map((k) => (
                <li key={k.slug}>
                  <Link
                    to="/{-$locale}/metiers/$slug"
                    params={{ ...lp, slug: k.slug }}
                    className="group flex items-center justify-between gap-3 border-t border-border pt-2 text-[0.95rem] text-ink hover:text-clay-deep"
                  >
                    {l(k.name)}
                    <ArrowUpRight
                      className="size-4 text-clay-deep transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: horizontal card slider instead of the map */}
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
        {cities.map((c) => (
          <li
            key={c.city.fr}
            className="w-[78%] shrink-0 snap-center rounded-[1.75rem] border border-border bg-cream p-4"
          >
            <div className="mask-bowl overflow-hidden">
              <Img
                media={c.crafts[0]!.image}
                alt={l(c.crafts[0]!.name)}
                sizes="80vw"
                className="aspect-[4/3] w-full"
                focus={c.crafts[0]!.steps[0]?.focus}
              />
            </div>
            <h3 className="mt-4 text-3xl">
              {l(c.city)}
              {c.featured && (
                <span className="ml-2 align-middle text-[0.6rem] font-sans font-semibold uppercase tracking-[0.14em] text-clay-deep">
                  {t.craft.featuredEyebrow}
                </span>
              )}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {c.crafts.map((k) => (
                <li key={k.slug}>
                  <Link
                    to="/{-$locale}/metiers/$slug"
                    params={{ ...lp, slug: k.slug }}
                    className="flex items-center justify-between text-sm text-ink"
                  >
                    {l(k.name)} <ArrowUpRight className="size-4 text-clay-deep" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
