import { Img } from "@/components/brand/Img";
import type { Artisan } from "@/data/artisans";
import { useI18n } from "@/i18n";

export function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const { l, t } = useI18n();
  return (
    <figure className="group">
      <div className="mask-arch overflow-hidden">
        <Img
          media={artisan.image}
          alt=""
          sizes="(min-width: 768px) 33vw, 80vw"
          className="zoom-media aspect-[3/4] w-full"
          focus={artisan.focus}
        />
      </div>
      <figcaption className="mt-5">
        <p className="font-display text-3xl text-safi">{artisan.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{l(artisan.speciality)}</p>
        <blockquote className="mt-4 border-l border-ochre pl-4 font-display text-xl italic leading-snug text-ink/80">
          « {l(artisan.quote)} »
        </blockquote>
        <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ochre">
          {t.common.exampleName}
        </p>
      </figcaption>
    </figure>
  );
}
