import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Layers, ListOrdered, MapPin, Mountain } from "lucide-react";

import { Img } from "@/components/brand/Img";
import { MotifDivider, Rosette } from "@/components/brand/Motif";
import { ArtisanCard } from "@/components/site/ArtisanCard";
import { CraftCard } from "@/components/site/CraftCard";
import { CraftTimeline } from "@/components/site/CraftTimeline";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { useQuote } from "@/components/site/QuoteDialog";
import { WhatsAppIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";
import { artisansByCraft } from "@/data/artisans";
import { crafts, getCraft, type Craft } from "@/data/crafts";
import { products } from "@/data/products";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/metiers/$slug")({
  loader: ({ params }) => {
    const craft = getCraft(params.slug);
    if (!craft) throw notFound();
    return craft;
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
      title: `${loaderData.name[locale]} — ${loaderData.city[locale]}`,
      description: loaderData.intro,
      image: loaderData.image.src,
      jsonLd: [
        breadcrumbLd(locale, [
          [t.nav.crafts, "/metiers"],
          [loaderData.name[locale], `/metiers/${loaderData.slug}`],
        ]),
      ],
    });
  },
  component: CraftPage,
});

const ARABIC: Record<string, string> = {
  poterie: "فخار",
  zellige: "زليج",
  tadelakt: "تادلاكت",
  cuivre: "نحاس",
  bois: "خشب",
  tissage: "نسيج",
  cuir: "جلد",
};

function FactsBar({ craft }: { craft: Craft }) {
  const { l } = useI18n();
  const facts = [
    { icon: MapPin, label: { fr: "Ville", en: "City" }, value: l(craft.city) },
    { icon: Mountain, label: { fr: "Région", en: "Region" }, value: l(craft.region) },
    {
      icon: Layers,
      label: { fr: "Matières", en: "Materials" },
      value: `${craft.materials.length}`,
    },
    {
      icon: ListOrdered,
      label: { fr: "Étapes", en: "Steps" },
      value: `${craft.steps.length}`,
    },
  ];
  return (
    <Reveal className="relative z-10 mx-auto -mt-12 w-[calc(100%-2rem)] max-w-5xl md:-mt-16">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-border bg-border shadow-[0_30px_60px_-35px_rgba(42,30,23,0.45)] md:grid-cols-4">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label.fr} className="flex items-center gap-4 bg-cream p-5 md:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sand text-clay">
              <Icon className="size-5" strokeWidth={1.4} aria-hidden />
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {l(label)}
              </dt>
              <dd className="truncate font-display text-xl text-safi md:text-2xl">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

function PrevNext({ craft }: { craft: Craft }) {
  const { l, lp } = useI18n();
  const i = crafts.findIndex((c) => c.slug === craft.slug);
  const prev = crafts[(i - 1 + crafts.length) % crafts.length]!;
  const next = crafts[(i + 1) % crafts.length]!;
  const items = [
    { c: prev, dir: "prev" as const, label: { fr: "Métier précédent", en: "Previous craft" } },
    { c: next, dir: "next" as const, label: { fr: "Métier suivant", en: "Next craft" } },
  ];
  return (
    <nav
      aria-label={l({ fr: "Navigation entre métiers", en: "Craft navigation" })}
      className="grid border-t border-border md:grid-cols-2"
    >
      {items.map(({ c, dir, label }) => (
        <Link
          key={dir}
          to="/{-$locale}/metiers/$slug"
          params={{ ...lp, slug: c.slug }}
          className={cn(
            "group relative flex min-h-[12rem] items-end overflow-hidden p-8 md:min-h-[16rem] md:p-12",
            dir === "next" && "md:justify-end md:text-right",
          )}
        >
          <Img
            media={c.image}
            alt=""
            sizes="50vw"
            className="zoom-media absolute inset-0 size-full"
          />
          <span className="absolute inset-0 bg-safi-deep/70 transition-colors duration-500 group-hover:bg-safi-deep/55" />
          <span className="relative">
            <span
              className={cn(
                "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ochre",
                dir === "next" && "md:justify-end",
              )}
            >
              {dir === "prev" && <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />}
              {l(label)}
              {dir === "next" && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
            </span>
            <span className="mt-2 block font-display text-4xl text-cream md:text-5xl">{l(c.short)}</span>
            <span className="mt-1 block text-sm text-cream/70">{l(c.city)}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

function CraftPage() {
  const craft = Route.useLoaderData();
  const { t, l, lp } = useI18n();
  const { open } = useQuote();
  const related = products.filter((p) => p.craft === craft.slug).slice(0, 4);
  const team = artisansByCraft(craft.slug);
  const sameCity = crafts.filter((c) => c.slug !== craft.slug && c.city.fr === craft.city.fr);
  const others = crafts
    .filter((c) => c.slug !== craft.slug && !sameCity.includes(c))
    .slice(0, 3);
  const [lead, ...rest] = craft.history;

  return (
    <>
      <PageHero
        eyebrow={`${l(craft.city)} · ${l(craft.region)}`}
        title={l(craft.name)}
        intro={l(craft.intro)}
        crumbs={[{ label: t.nav.crafts, href: "/metiers" }, { label: l(craft.name) }]}
        arabic={ARABIC[craft.slug]}
      />

      {/* Cover image + facts */}
      <div className="container-page">
        <Reveal className="mask-bowl overflow-hidden">
          <Img
            media={craft.image}
            priority
            sizes="100vw"
            className="aspect-[16/10] max-h-[640px] w-full md:aspect-[21/9]"
            focus={craft.steps[2]?.focus}
          />
        </Reveal>
      </div>
      <FactsBar craft={craft} />

      {/* History + materials */}
      <section className="container-page grid gap-12 py-20 md:grid-cols-[1.4fr_1fr] md:gap-20 md:py-28">
        <Reveal>
          <p className="eyebrow">{t.crafts.history}</p>
          {lead && (
            <p className="relative mt-5 font-display text-3xl leading-snug text-safi md:text-4xl">
              <span className="float-left mr-3 mt-1 font-display text-7xl leading-[0.8] text-clay md:text-8xl">
                {l(lead).charAt(0)}
              </span>
              {l(lead).slice(1)}
            </p>
          )}
          {rest.map((h, i) => (
            <p key={i} className="mt-6 clear-left text-lg leading-relaxed text-muted-foreground">
              {l(h)}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="sticky top-28 space-y-5">
            <div className="rounded-[2rem] border border-border bg-cream p-7">
              <p className="eyebrow">{t.crafts.materials}</p>
              <ul className="mt-5 space-y-3">
                {craft.materials.map((m, i) => (
                  <li
                    key={m.fr}
                    className="flex items-center gap-3 border-b border-border pb-3 text-[0.95rem] last:border-0 last:pb-0"
                  >
                    <span className="font-display text-sm text-ochre">{String(i + 1).padStart(2, "0")}</span>
                    {l(m)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] bg-safi p-7 text-cream">
              <p className="eyebrow !text-ochre">{t.crafts.region}</p>
              <p className="mt-2 font-display text-2xl">{l(craft.region)}</p>
              <Link
                to="/{-$locale}/metiers"
                params={lp}
                hash="carte"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cream/85 transition-colors hover:text-ochre"
              >
                <MapPin className="size-4" /> {l({ fr: "Voir sur la carte", en: "See on the map" })}
              </Link>
            </div>
          </aside>
        </Reveal>
      </section>

      {/* Steps */}
      <section className="relative overflow-hidden border-t border-border bg-cream py-20 md:py-28">
        <Rosette
          className="pointer-events-none absolute -right-32 -top-24 size-[28rem] text-safi opacity-[0.05]"
          strokeWidth={0.5}
        />
        <div className="container-page relative">
          <SectionHeading
            eyebrow={t.crafts.steps}
            title={t.craft.timelineTitle(l(craft.short))}
            className="mb-14"
          />
          <CraftTimeline steps={craft.steps} label={l(craft.name)} />
        </div>
      </section>

      {/* Artisans */}
      {team.length > 0 && (
        <section className="container-page py-20 md:py-28">
          <SectionHeading eyebrow={t.home.artisansEyebrow} title={t.crafts.artisans} />
          <Stagger className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((a) => (
              <StaggerItem key={a.slug}>
                <ArtisanCard artisan={a} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Products */}
      {related.length > 0 && (
        <section className={cn("container-page pb-20 md:pb-28", team.length === 0 && "pt-20 md:pt-28")}>
          {team.length > 0 && <MotifDivider className="mb-14" />}
          <SectionHeading
            eyebrow={t.nav.collections}
            title={t.crafts.products}
            action={
              <Button asChild variant="line">
                <Link to="/{-$locale}/collections" params={lp}>
                  {t.cta.seeAll} <ArrowRight />
                </Link>
              </Button>
            }
          />
          <Stagger className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard p={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* CTA */}
      <section className="grain relative overflow-hidden bg-safi py-16 md:py-24">
        <Rosette
          className="pointer-events-none absolute -left-20 -top-24 size-80 text-cream opacity-10"
          strokeWidth={0.6}
        />
        <div className="container-page relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow !text-ochre">{l(craft.short)} · {l(craft.city)}</p>
            <h2 className="mt-4 max-w-2xl text-4xl !text-cream md:text-5xl">
              {t.crafts.ctaTitle(l(craft.short).toLowerCase())}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="clay" size="xl" onClick={() => open(l(craft.name))}>
              {t.cta.quote} <ArrowRight />
            </Button>
            <Button asChild variant="lineLight" size="xl">
              <a
                href={whatsappLink(`${l(craft.name)} — ${l(craft.city)}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Same city */}
      {sameCity.length > 0 && (
        <section className="container-page pt-20 md:pt-28">
          <SectionHeading
            eyebrow={l(craft.city)}
            title={l({ fr: "Dans la même ville", en: "In the same city" })}
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {sameCity.map((c) => (
              <CraftCard key={c.slug} craft={c} />
            ))}
          </div>
        </section>
      )}

      {/* Other crafts */}
      {others.length > 0 && (
        <section className="container-page py-20 md:py-28">
          <SectionHeading
            eyebrow={t.crafts.eyebrow}
            title={t.cta.allCrafts}
            action={
              <Button asChild variant="line">
                <Link to="/{-$locale}/metiers" params={lp}>
                  {t.cta.seeAll} <ArrowRight />
                </Link>
              </Button>
            }
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((c) => (
              <CraftCard key={c.slug} craft={c} />
            ))}
          </div>
        </section>
      )}

      <PrevNext craft={craft} />
    </>
  );
}