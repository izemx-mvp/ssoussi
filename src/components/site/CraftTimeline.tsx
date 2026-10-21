import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Img } from "@/components/brand/Img";
import { Rosette } from "@/components/brand/Motif";
import type { CraftStep } from "@/data/crafts";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Signature scroll timeline: on large screens the image column is pinned and crossfades
 * as each text step scrolls past (raw clay → thrown → dried → fired → glazed).
 * On small screens each step simply shows its own image.
 */
export function CraftTimeline({ steps, label }: { steps: CraftStep[]; label: string }) {
  const { t, l } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start 60%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    setActive(0);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset["index"]));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps]);

  const current = steps[active] ?? steps[0]!;

  return (
    <div ref={container} className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
      {/* Pinned visual (lg+) */}
      <div className="hidden lg:block">
        <div className="sticky top-[max(7rem,14vh)] h-[min(72vh,46rem)]">
          <div className="mask-organic relative h-full overflow-hidden bg-cream">
            <AnimatePresence initial={false}>
              <motion.div
                key={`${label}-${active}`}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <Img
                  media={current.image}
                  alt={l(current.title)}
                  sizes="45vw"
                  className="size-full"
                  focus={current.focus}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-8 pt-24">
              <p className="font-display text-7xl leading-none text-cream">
                {String(active + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm font-medium text-cream/85">{l(current.title)}</p>
            </div>
          </div>
          <Rosette className="absolute -right-10 -top-10 size-28 text-ochre" strokeWidth={1.2} />
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        <div
          className="absolute bottom-0 left-[1.15rem] top-0 hidden w-px bg-border lg:block"
          aria-hidden
        >
          <motion.div
            className="h-full w-full origin-top bg-clay"
            style={{ scaleY: reduce ? 1 : progress }}
          />
        </div>
        <ol aria-label={label} className="space-y-14 lg:space-y-0">
          {steps.map((s, i) => (
            <li
              key={`${label}-${i}`}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="relative lg:flex lg:min-h-[min(78vh,44rem)] lg:items-center lg:pl-16"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-1/2 hidden size-[2.3rem] -translate-y-1/2 place-items-center rounded-full border bg-sand font-display text-lg transition-colors duration-500 lg:grid",
                  i <= active
                    ? "border-clay bg-clay text-cream"
                    : "border-border text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <div>
                <div className="mask-bowl mb-6 overflow-hidden lg:hidden">
                  <Img
                    media={s.image}
                    alt={l(s.title)}
                    sizes="100vw"
                    className="aspect-[4/3] w-full"
                    focus={s.focus}
                  />
                </div>
                <p className="eyebrow">
                  {t.common.step} {String(i + 1).padStart(2, "0")} /{" "}
                  {String(steps.length).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-4xl md:text-5xl">{l(s.title)}</h3>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  {l(s.text)}
                </p>
                <div className="mt-6 flex flex-wrap gap-2" aria-label={t.common.tools}>
                  {s.tools.map((tool) => (
                    <span
                      key={tool.fr}
                      className="rounded-full border border-ochre/40 px-3 py-1 text-xs font-medium text-ink/80"
                    >
                      {l(tool)}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-safi px-3 py-1 text-xs font-medium text-cream">
                    <Clock className="size-3" aria-hidden />
                    <span className="sr-only">{t.common.duration} :</span> {l(s.duration)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
