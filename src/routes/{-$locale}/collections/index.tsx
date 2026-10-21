import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Gem, Hand, PackageCheck, PencilRuler } from "lucide-react";

import { Img } from "@/components/brand/Img";
import { Rosette } from "@/components/brand/Motif";
import { CollectionsBrowser } from "@/components/site/CollectionsBrowser";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { useQuote } from "@/components/site/QuoteDialog";
import { WhatsAppIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/collections/")({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    return seo({
      pathname: match.pathname,
      title: t.nav.collections,
      description: t.collections.intro,
      jsonLd: [breadcrumbLd(locale, [[t.nav.collections, "/collections"]])],
    });
  },
  component: Collections,
});

const TRUST = [
  { icon: Hand, label: { fr: "100 % fait main", en: "100% handmade" } },
  { icon: Gem, label: { fr: "Pièces uniques", en: "One-of-a-kind" } },
  { icon: PencilRuler, label: { fr: "Personnalisables", en: "Customisable" } },
  { icon: PackageCheck, label: { fr: "Export international", en: "Worldwide export" } },
];

// Bento layout for category tiles (6 first categories), then regular tiles.
const BENTO = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

function TrustStrip() {
  const { l } = useI18n();
  return (
    <div className="border-y border-border bg-cream">
      <ul className="container-page no-scrollbar flex gap-8 overflow-x-auto py-5 md:justify-between">
        {TRUST.map(({ icon: Icon, label }) => (
          <li key={label.fr} className="flex shrink-0 items-center gap-3 text-sm font-semibold text-safi">
            <span className="grid size-9 place-items-center rounded-full bg-sand text-clay">
              <Icon className="size-4" strokeWidth={1.6} aria-hidden />
            </span>
            {l(label)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryBento() {
  const { t, l, lp } = useI18n();
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading
        eyebrow={t.collections.categoriesTitle}
        title={l({ fr: "Explorer par univers", en: "Explore by collection" })}
        action={
          <Button asChild variant="line">
            <a href="#catalogue">
              {l({ fr: "Voir toutes les pièces", en: "See every piece" })} <ArrowRight />
            </a>
          </Button>
        }
      />
      <Stagger className="mt-12 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[13rem] md:grid-cols-4 lg:auto-rows-[15rem]">
        {categories.map((c, i) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <StaggerItem key={c.slug} className={cn("h-full", BENTO[i] ?? "md:col-span-1")}>
              <Link
                to="/{-$locale}/collections/$category"
                params={{ ...lp, category: c.slug }}
                className={cn(
                  "group relative block h-full overflow-hidden",
                  i % 2 ? "mask-bowl" : "rounded-[2rem]",
                )}
              >
                <Img
                  media={c.image}
                  alt=""
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="zoom-media size-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-cream/90 text-safi transition-all duration-300 group-hover:rotate-45 group-hover:bg-clay group-hover:text-cream">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
                    {t.common.pieces(count)}
                  </p>
                  <h3 className="mt-1 text-3xl !text-cream md:text-4xl">{l(c.name)}</h3>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

function CustomBand() {
  const { l } = useI18n();
  const { open } = useQuote();
  const points = [
    { fr: "Dimensions et formes adaptées", en: "Adapted sizes and shapes" },
    { fr: "Couleurs, émaux et motifs au choix", en: "Your choice of colours, glazes and patterns" },
    { fr: "Logo ou monogramme pour hôtels et restaurants", en: "Logo or monogram for hotels and restaurants" },
    { fr: "Petites et grandes quantités", en: "Small and large quantities" },
  ];
  return (
    <section className="grain relative overflow-hidden bg-safi py-20 md:py-28">
      <Rosette
        className="pointer-events-none absolute -right-32 -top-32 size-[30rem] text-cream opacity-[0.06]"
        strokeWidth={0.5}
      />
      <div className="container-page relative grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <Reveal>
          <p className="eyebrow !text-ochre">{l({ fr: "Sur mesure", en: "Made to order" })}</p>
          <h2 className="mt-4 text-4xl !text-cream md:text-6xl">
            {l({ fr: "Vous ne trouvez pas ", en: "Can't find " })}
            <em className="text-ochre">{l({ fr: "la pièce idéale ?", en: "the perfect piece?" })}</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/80">
            {l({
              fr: "Nos artisans réalisent des pièces sur mesure à partir de votre idée, d'un croquis ou d'une photo.",
              en: "Our artisans create bespoke pieces from your idea, a sketch or a photo.",
            })}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="clay" size="xl" onClick={() => open(l({ fr: "Pièce sur mesure", en: "Custom piece" }))}>
              {l({ fr: "Décrire mon projet", en: "Describe my project" })} <ArrowRight />
            </Button>
            <Button asChild variant="lineLight" size="xl">
              <a
                href={whatsappLink(l({ fr: "Bonjour, j'ai un projet sur mesure.", en: "Hello, I have a custom project." }))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </Reveal>
        <Stagger className="grid gap-3">
          {points.map((p, i) => (
            <StaggerItem
              key={p.fr}
              className="flex items-center gap-5 rounded-[1.5rem] border border-cream/15 bg-cream/5 p-5 transition-colors hover:border-cream/35"
            >
              <span className="font-display text-3xl text-ochre">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-cream">{l(p)}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Collections() {
  const { t, l, lp } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t.collections.eyebrow}
        title={t.collections.title}
        intro={t.collections.intro}
        crumbs={[{ label: t.nav.collections }]}
      >
        <nav
          aria-label={t.collections.categoriesTitle}
          className="no-scrollbar -mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-1"
        >
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/{-$locale}/collections/$category"
              params={{ ...lp, category: c.slug }}
              className="group flex shrink-0 items-center gap-3 rounded-full border border-border bg-cream py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink transition-colors hover:border-ochre"
            >
              <span className="size-9 overflow-hidden rounded-full">
                <Img
                  media={c.image}
                  alt=""
                  sizes="40px"
                  className="size-full transition-transform duration-500 group-hover:scale-110"
                />
              </span>
              {l(c.name)}
            </Link>
          ))}
        </nav>
      </PageHero>
      <TrustStrip />
      <CategoryBento />
      <section id="catalogue" className="scroll-mt-24 border-t border-border">
        <div className="container-page pt-20 md:pt-28">
          <SectionHeading
            eyebrow={l({ fr: "Le catalogue", en: "The catalogue" })}
            title={l({ fr: "Toutes les pièces", en: "Every piece" })}
            text={l({
              fr: "Filtrez par métier, origine ou usage. Chaque pièce est disponible sur demande de devis.",
              en: "Filter by craft, origin or use. Every piece is available on quote request.",
            })}
          />
        </div>
        <CollectionsBrowser />
      </section>
      <CustomBand />
    </>
  );
}