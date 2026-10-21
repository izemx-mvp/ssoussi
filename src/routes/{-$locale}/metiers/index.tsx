import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { Img } from "@/components/brand/Img";
import { MotifWatermark, Rosette } from "@/components/brand/Motif";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { MoroccoMap } from "@/components/site/MoroccoMap";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { useQuote } from "@/components/site/QuoteDialog";
import { Button } from "@/components/ui/button";
import { craftCities, crafts, type Craft } from "@/data/crafts";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/metiers/")({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    return seo({
      pathname: match.pathname,
      title: t.nav.crafts,
      description: t.crafts.intro,
      jsonLd: [breadcrumbLd(locale, [[t.nav.crafts, "/metiers"]])],
    });
  },
  component: Metiers,
});

const ALL = "__all__";

/* Key figures computed from the data (no invented numbers). */
function KeyFigures() {
  const { l } = useI18n();
  const cities = craftCities();
  const steps = crafts.reduce((n, c) => n + c.steps.length, 0);
  const items = [
    { value: crafts.length, label: { fr: "Métiers d'art", en: "Crafts" } },
    { value: cities.length, label: { fr: "Villes & régions", en: "Cities & regions" } },
    { value: steps, label: { fr: "Gestes documentés", en: "Documented steps" } },
  ];
  return (
    <Reveal className="container-page -mt-4 pb-16 md:pb-20">
      <dl className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-[2rem] border border-border bg-cream">
        {items.map((it) => (
          <div key={it.label.fr} className="flex flex-col-reverse items-center px-3 py-6 text-center md:py-8">
            <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground md:text-xs">
              {l(it.label)}
            </dt>
            <dd className="font-display text-4xl text-safi md:text-6xl">{it.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

function FeaturedCraft({ craft }: { craft: Craft }) {
  const { l, lp } = useI18n();
  return (
    <Reveal>
      <Link
        to="/{-$locale}/metiers/$slug"
        params={{ ...lp, slug: craft.slug }}
        className="group grid overflow-hidden rounded-[2.5rem] border border-border bg-sand md:grid-cols-[1.15fr_1fr]"
      >
        <div className="relative overflow-hidden">
          <Img
            media={craft.image}
            sizes="(min-width: 768px) 55vw, 100vw"
            className="zoom-media aspect-[4/3] size-full md:aspect-auto md:min-h-[28rem]"
          />
          <span className="absolute left-5 top-5 rounded-full bg-clay px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream">
            {l({ fr: "Métier phare", en: "Flagship craft" })}
          </span>
        </div>
        <div className="relative flex flex-col justify-center p-8 md:p-12">
          <Rosette
            className="pointer-events-none absolute -right-10 -top-10 size-48 text-clay opacity-10"
            strokeWidth={0.8}
          />
          <p className="flex items-center gap-2 text-sm font-semibold text-clay">
            <MapPin className="size-4" aria-hidden /> {l(craft.city)} · {l(craft.region)}
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl">{l(craft.name)}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{l(craft.intro)}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {craft.materials.map((m) => (
              <li key={m.fr} className="rounded-full border border-safi/15 px-3 py-1 text-xs text-safi">
                {l(m)}
              </li>
            ))}
          </ul>
          <span className="mt-8 inline-flex items-center gap-2 font-semibold text-safi transition-colors group-hover:text-clay">
            {l({ fr: "Découvrir ce métier", en: "Discover this craft" })}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function CraftTile({ craft, index }: { craft: Craft; index: number }) {
  const { l, lp } = useI18n();
  return (
    <Link
      to="/{-$locale}/metiers/$slug"
      params={{ ...lp, slug: craft.slug }}
      className="group block"
    >
      <div
        className={cn(
          "relative overflow-hidden",
          index % 3 === 1 ? "mask-bowl" : "rounded-[2rem]",
        )}
      >
        <Img
          media={craft.image}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="zoom-media aspect-[4/5] w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
        <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-cream/90 text-safi transition-all duration-300 group-hover:rotate-45 group-hover:bg-clay group-hover:text-cream">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
            <MapPin className="size-3.5" aria-hidden /> {l(craft.city)}
          </p>
          <h3 className="mt-2 text-3xl !text-cream md:text-4xl">{l(craft.short)}</h3>
        </div>
      </div>
      <p className="mt-5 line-clamp-2 text-[0.95rem] leading-relaxed text-muted-foreground">
        {l(craft.intro)}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-clay">
        {craft.steps.length} {l({ fr: "étapes", en: "steps" })} · {craft.materials.length}{" "}
        {l({ fr: "matières", en: "materials" })}
      </p>
    </Link>
  );
}

function CraftsGrid() {
  const { l } = useI18n();
  const cities = craftCities();
  const [city, setCity] = useState<string>(ALL);
  const featured = crafts.find((c) => c.featured);

  const list = useMemo(
    () =>
      crafts.filter(
        (c) => (city === ALL || c.city.fr === city) && (city !== ALL || !c.featured),
      ),
    [city],
  );

  const filters = [
    { key: ALL, label: l({ fr: "Tous les métiers", en: "All crafts" }), count: crafts.length },
    ...cities.map((c) => ({ key: c.city.fr, label: l(c.city), count: c.crafts.length })),
  ];

  return (
    <section id="liste" className="relative scroll-mt-24 overflow-hidden border-t border-border bg-cream py-20 md:py-28">
      <MotifWatermark className="-left-52 top-40 size-[36rem] text-safi" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={l({ fr: "Les savoir-faire", en: "The crafts" })}
          title={l({ fr: "Un métier, une ville, une histoire", en: "One craft, one city, one story" })}
        />

        <LayoutGroup>
          <div
            role="tablist"
            aria-label={l({ fr: "Filtrer par ville", en: "Filter by city" })}
            className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1"
          >
            {filters.map((f) => {
              const on = city === f.key;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCity(f.key)}
                  className={cn(
                    "relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                    on ? "border-safi text-cream" : "border-safi/20 text-safi hover:border-safi",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="city-pill"
                      className="absolute inset-0 rounded-full bg-safi"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {f.label}{" "}
                    <span className={on ? "text-cream/60" : "text-muted-foreground"}>({f.count})</span>
                  </span>
                </button>
              );
            })}
          </div>

          {city === ALL && featured && (
            <div className="mt-12">
              <FeaturedCraft craft={featured} />
            </div>
          )}

          <motion.ul layout className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((c, i) => (
                <motion.li
                  key={c.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <CraftTile craft={c} index={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  );
}

function Cta() {
  const { l } = useI18n();
  const { open } = useQuote();
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-safi px-6 py-14 md:px-14 md:py-20">
        <Rosette
          className="pointer-events-none absolute -bottom-24 -right-16 size-96 text-cream opacity-10"
          strokeWidth={0.6}
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow !text-ochre">{l({ fr: "Projet sur mesure", en: "Custom project" })}</p>
            <h2 className="mt-4 max-w-2xl text-4xl !text-cream md:text-5xl">
              {l({
                fr: "Un projet qui réunit plusieurs savoir-faire ?",
                en: "A project bringing several crafts together?",
              })}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-cream/80">
              {l({
                fr: "Céramique, zellige, bois, cuivre ou textile : nous coordonnons les artisans pour votre intérieur, hôtel ou riad.",
                en: "Ceramics, zellige, wood, copper or textile: we coordinate the artisans for your home, hotel or riad.",
              })}
            </p>
          </div>
          <Button variant="clay" size="xl" onClick={() => open()}>
            {l({ fr: "Demander un devis", en: "Request a quote" })} <ArrowRight />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

function Metiers() {
  const { t, l } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t.crafts.eyebrow}
        title={t.crafts.title}
        intro={t.crafts.intro}
        crumbs={[{ label: t.nav.crafts }]}
      />
      <KeyFigures />
      <section id="carte" className="container-page scroll-mt-24 pb-20 md:pb-28">
        <SectionHeading
          eyebrow={l({ fr: "La carte", en: "The map" })}
          title={l({ fr: "Le Maroc, atelier par atelier", en: "Morocco, workshop by workshop" })}
          text={l({
            fr: "Chaque ville a son métier, ses matières et ses gestes. Survolez la carte pour les découvrir.",
            en: "Each city has its own craft, materials and gestures. Explore the map to discover them.",
          })}
        />
        <Stagger className="mt-12">
          <StaggerItem>
            <MoroccoMap />
          </StaggerItem>
        </Stagger>
      </section>
      <CraftsGrid />
      <Cta />
    </>
  );
}