import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";

import { Img } from "@/components/brand/Img";
import { Rosette } from "@/components/brand/Motif";
import { CollectionsBrowser } from "@/components/site/CollectionsBrowser";
import { Reveal } from "@/components/site/FadeUp";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { useQuote } from "@/components/site/QuoteDialog";
import { Button } from "@/components/ui/button";
import { categories, getCategory } from "@/data/categories";
import { getCraft } from "@/data/crafts";
import { products } from "@/data/products";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/collections/$category/")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return category;
  },
  head: ({ match, loaderData }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    if (!loaderData)
      return seo({
        pathname: match.pathname,
        title: t.notFound.title,
        description: t.notFound.text,
        noindex: true,
      });
    return seo({
      pathname: match.pathname,
      title: `${loaderData.name[locale]} — ${t.nav.collections}`,
      description: loaderData.description,
      image: loaderData.image.src,
      jsonLd: [
        breadcrumbLd(locale, [
          [t.nav.collections, "/collections"],
          [loaderData.name[locale], `/collections/${loaderData.slug}`],
        ]),
      ],
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const category = Route.useLoaderData();
  const { t, l, lp } = useI18n();
  const { open } = useQuote();

  const items = products.filter((p) => p.category === category.slug);
  const craftSlugs = [...new Set(items.map((p) => p.craft))];
  const crafts = craftSlugs.map((s) => getCraft(s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const origins = [...new Set(items.map((p) => l(p.origin)))];
  const others = categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHero
        eyebrow={t.collections.eyebrow}
        title={l(category.name)}
        intro={l(category.description)}
        crumbs={[{ label: t.nav.collections, href: "/collections" }, { label: l(category.name) }]}
      >
        <nav
          aria-label={t.collections.categoriesTitle}
          className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          <Link
            to="/{-$locale}/collections"
            params={lp}
            className="shrink-0 rounded-full border border-border bg-cream px-4 py-2 text-sm font-medium text-ink hover:border-ochre"
          >
            {t.collections.all}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/{-$locale}/collections/$category"
              params={{ ...lp, category: c.slug }}
              aria-current={c.slug === category.slug ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                c.slug === category.slug
                  ? "border-safi bg-safi text-cream"
                  : "border-border bg-cream text-ink hover:border-ochre",
              )}
            >
              {l(c.name)}
            </Link>
          ))}
        </nav>
      </PageHero>

      {/* Cover + category facts */}
      <section className="container-page">
        <Reveal className="relative overflow-hidden rounded-[2.5rem]">
          <Img
            media={category.image}
            priority
            sizes="100vw"
            className="aspect-[16/10] max-h-[520px] w-full md:aspect-[21/8]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-end p-6 md:justify-center md:p-14">
            <p className="font-display text-6xl text-cream md:text-8xl">{items.length}</p>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ochre">
              {t.common.pieces(items.length)}
            </p>
            {origins.length > 0 && (
              <p className="mt-4 hidden items-center gap-2 text-sm text-cream/85 md:flex">
                <MapPin className="size-4 text-ochre" aria-hidden />
                {origins.join(" · ")}
              </p>
            )}
          </div>
        </Reveal>

        {crafts.length > 0 && (
          <Reveal className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {l({ fr: "Savoir-faire :", en: "Crafts:" })}
            </span>
            {crafts.map((c) => (
              <Link
                key={c.slug}
                to="/{-$locale}/metiers/$slug"
                params={{ ...lp, slug: c.slug }}
                className="group flex items-center gap-2 rounded-full border border-border bg-cream py-1 pl-1 pr-4 text-sm font-medium text-safi transition-colors hover:border-clay"
              >
                <span className="size-7 overflow-hidden rounded-full">
                  <Img media={c.image} alt="" sizes="32px" className="size-full" />
                </span>
                {l(c.short)} · {l(c.city)}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </Reveal>
        )}
      </section>

      <CollectionsBrowser key={category.slug} category={category.slug} />

      {/* Custom request */}
      <section className="container-page pb-20 md:pb-28">
        <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-clay-deep px-6 py-12 text-cream md:px-14 md:py-16">
          <Rosette
            className="pointer-events-none absolute -right-16 -top-20 size-72 text-cream opacity-10"
            strokeWidth={0.6}
          />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl !text-cream md:text-5xl">
                {l({ fr: "Une demande précise pour ", en: "A specific request for " })}
                <em>{l(category.name).toLowerCase()}</em> ?
              </h2>
              <p className="mt-3 max-w-xl text-cream/85">
                {l({
                  fr: "Dimensions, couleurs, quantités : décrivez votre besoin, nous revenons vers vous avec un devis.",
                  en: "Sizes, colours, quantities: describe what you need and we'll come back with a quote.",
                })}
              </p>
            </div>
            <Button
              size="xl"
              className="rounded-full bg-cream font-semibold text-clay-deep hover:bg-sand"
              onClick={() => open(l(category.name))}
            >
              {t.cta.quote} <ArrowRight />
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Other categories */}
      {others.length > 0 && (
        <section className="border-t border-border bg-cream py-20 md:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow={t.collections.categoriesTitle}
              title={l({ fr: "Autres univers", en: "Other collections" })}
            />
            <ul className="no-scrollbar -mx-4 mt-10 flex snap-x gap-5 overflow-x-auto px-4 pb-2">
              {others.map((c, i) => (
                <li key={c.slug} className="w-[62%] shrink-0 snap-start sm:w-[36%] lg:w-[22%]">
                  <Link
                    to="/{-$locale}/collections/$category"
                    params={{ ...lp, category: c.slug }}
                    className="group block"
                  >
                    <div className={cn("overflow-hidden", i % 2 ? "mask-bowl" : "rounded-[2rem]")}>
                      <Img
                        media={c.image}
                        alt=""
                        sizes="(min-width: 1024px) 22vw, 62vw"
                        className="zoom-media aspect-square w-full"
                      />
                    </div>
                    <h3 className="mt-4 text-2xl transition-colors group-hover:text-clay">{l(c.name)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.common.pieces(products.filter((p) => p.category === c.slug).length)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}