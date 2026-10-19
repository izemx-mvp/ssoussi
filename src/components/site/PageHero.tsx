import type { ReactNode } from "react";
import { FadeUp } from "./FadeUp";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: string; children?: ReactNode }) {
  return (
    <section className="container-page pb-16 pt-36 md:pt-44">
      <FadeUp>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-5xl md:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>}
        {children}
      </FadeUp>
    </section>
  );
}
