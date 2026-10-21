import { Fragment } from "react";

import { MotifDot } from "@/components/brand/Motif";

/** Infinite marquee of words separated by the motif. Pure CSS; static with reduced motion. */
export function Marquee({ words, label }: { words: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <Fragment key={w}>
          <span className="whitespace-nowrap font-display text-4xl italic text-safi md:text-6xl">
            {w}
          </span>
          <MotifDot className="size-7 text-clay md:size-9" />
        </Fragment>
      ))}
    </div>
  );
  return (
    <section
      aria-label={label}
      className="overflow-hidden border-y border-border bg-cream py-7 md:py-9"
    >
      <div className="animate-marquee flex w-max motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
