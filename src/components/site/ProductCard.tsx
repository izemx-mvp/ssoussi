import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Img } from "@/components/brand/Img";
import { absoluteUrl } from "@/lib/seo";
import { whatsappLink } from "@/config/site";
import { getCategory, techniques } from "@/data/categories";
import { getCraft } from "@/data/crafts";
import type { Product } from "@/data/products";
import { useI18n } from "@/i18n";
import { withLocale } from "@/i18n/locale";
import { WhatsAppIcon } from "./icons";

export function ProductCard({
  p,
  sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
}: {
  p: Product;
  sizes?: string;
}) {
  const { t, l, lp, locale } = useI18n();
  const craft = getCraft(p.craft);
  const cat = getCategory(p.category);
  const params = { ...lp, category: p.category, slug: p.slug };
  const url = absoluteUrl(withLocale(`/collections/${p.category}/${p.slug}`, locale));
  const technique = p.techniques[0];

  return (
    <article className="group relative">
      <Link
        to="/{-$locale}/collections/$category/$slug"
        params={params}
        className="block"
        aria-label={l(p.name)}
      >
        <div className="lift mask-bowl relative overflow-hidden bg-cream">
          <Img
            media={p.images[0]!}
            alt={l(p.name)}
            sizes={sizes}
            className="zoom-media aspect-[4/5] w-full"
          />
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-safi">
            {t.common.onRequest}
          </span>
        </div>
      </Link>
      <div className="mt-4">
        <p className="eyebrow">
          {craft ? l(craft.short) : ""} · {l(p.origin)}
        </p>
        <h3 className="mt-1.5 text-2xl leading-tight">
          <Link
            to="/{-$locale}/collections/$category/$slug"
            params={params}
            className="hover:text-clay-deep"
          >
            {l(p.name)}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {cat ? l(cat.name) : ""}
          {technique ? ` — ${l(techniques[technique])}` : ""}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Link
            to="/{-$locale}/collections/$category/$slug"
            params={params}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-safi/30 px-4 text-xs font-semibold text-safi transition-colors hover:bg-safi hover:text-cream"
            tabIndex={-1}
            aria-hidden
          >
            {t.cta.details} <ArrowUpRight className="size-3.5" />
          </Link>
          <a
            href={whatsappLink(t.whatsapp.product(l(p.name), url))}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-9 place-items-center rounded-full border border-glaze/30 text-glaze transition-colors hover:bg-glaze hover:text-cream"
            aria-label={`${t.cta.whatsapp} — ${l(p.name)}`}
          >
            <WhatsAppIcon className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
