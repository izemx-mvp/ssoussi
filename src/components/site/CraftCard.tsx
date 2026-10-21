import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Img } from "@/components/brand/Img";
import { MotifCorner } from "@/components/brand/Motif";
import type { Craft } from "@/data/crafts";
import { useI18n } from "@/i18n";

export function CraftCard({ craft, className }: { craft: Craft; className?: string }) {
  const { l, lp, t } = useI18n();
  return (
    <Link
      to="/{-$locale}/metiers/$slug"
      params={{ ...lp, slug: craft.slug }}
      className={`group block ${className ?? ""}`}
    >
      <div className="lift mask-bowl relative overflow-hidden">
        <Img
          media={craft.image}
          alt={l(craft.name)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
          className="zoom-media aspect-[4/3] w-full"
          focus={craft.steps[0]?.focus}
        />
        {craft.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-clay-deep px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-cream">
            {t.craft.featuredEyebrow}
          </span>
        )}
        <MotifCorner className="absolute bottom-2 right-2 text-cream/80" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">
            {l(craft.city)} · {l(craft.region)}
          </p>
          <h3 className="mt-2 text-3xl">{l(craft.name)}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{craft.materials.map(l).join(" · ")}</p>
        </div>
        <ArrowUpRight
          className="mt-1 size-5 shrink-0 text-clay-deep transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}
