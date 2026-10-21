import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Expand,
  Eye,
  Fingerprint,
  Flame,
  Handshake,
  MapPin,
  PackageCheck,
  SearchCheck,
  Sprout,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Img } from "@/components/brand/Img";
import { MotifWatermark, Rosette } from "@/components/brand/Motif";
import { ArtisanCard } from "@/components/site/ArtisanCard";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { MapEmbed } from "@/components/site/MapEmbed";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { WhatsAppIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { media, type Media } from "@/config/media";
import { site, whatsappLink } from "@/config/site";
import { artisans } from "@/data/artisans";
import { craftCities } from "@/data/crafts";
import { messages, useI18n } from "@/i18n";
import { localeFromPath, type L } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/atelier")({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    return seo({
      pathname: match.pathname,
      title: t.nav.atelier,
      description: t.atelier.intro,
      jsonLd: [breadcrumbLd(locale, [[t.nav.atelier, "/atelier"]])],
    });
  },
  component: Atelier,
});

// CONTENU EXEMPLE À REMPLACER — the client's real story goes here (no invented dates or facts).
const STORY: L[] = [
  {
    fr: "[Histoire de la maison à rédiger avec le client : origine du projet, lien avec Safi, personnes à l'initiative.]",
    en: "[The house's story, to be written with the client: how the project began, its link with Safi, the people behind it.]",
  },
  {
    fr: "Ssoussi est née d'un attachement à la poterie de Safi et à ceux qui la font vivre. Aujourd'hui, la maison relie plusieurs ateliers du Maroc et accompagne particuliers comme professionnels, au Maroc et à l'international.",
    en: "Ssoussi grew out of an attachment to Safi pottery and the people who keep it alive. Today the house links several Moroccan workshops and works with private clients and professionals, in Morocco and abroad.",
  },
];

// CONTENU EXEMPLE À VALIDER AVEC LE CLIENT — how the house works.
const METHOD: { icon: typeof Users; title: L; text: L }[] = [
  {
    icon: Users,
    title: { fr: "Rencontrer les artisans", en: "Meeting the artisans" },
    text: {
      fr: "Nous travaillons directement avec des ateliers que nous visitons et dont nous connaissons le travail.",
      en: "We work directly with workshops we visit and whose work we know.",
    },
  },
  {
    icon: SearchCheck,
    title: { fr: "Sélectionner les pièces", en: "Selecting the pieces" },
    text: {
      fr: "Chaque modèle est choisi pour la justesse de sa forme, de son décor et de sa finition.",
      en: "Each model is chosen for the rightness of its shape, decoration and finish.",
    },
  },
  {
    icon: Eye,
    title: { fr: "Contrôler la qualité", en: "Checking quality" },
    text: {
      fr: "Les pièces sont vérifiées une à une avant expédition, en respectant le caractère du fait main.",
      en: "Pieces are checked one by one before shipping, respecting their handmade character.",
    },
  },
  {
    icon: PackageCheck,
    title: { fr: "Emballer & expédier", en: "Packing & shipping" },
    text: {
      fr: "Emballage renforcé pièce par pièce, livraison au Maroc et à l'international.",
      en: "Reinforced piece-by-piece packing, delivered across Morocco and worldwide.",
    },
  },
];

// CONTENU EXEMPLE À VALIDER — what a workshop visit can include.
const VISIT: L[] = [
  { fr: "Démonstration de tournage", en: "Wheel-throwing demonstration" },
  { fr: "Découverte des fours et du séchage", en: "Kilns and drying areas" },
  { fr: "Peinture des décors à la main", en: "Hand-painting of patterns" },
  { fr: "Sélection de pièces sur place", en: "Choosing pieces on site" },
];

const GALLERY: { m: Media; caption: L }[] = [
  { m: media.craftPoterie, caption: { fr: "Tournage · Safi", en: "Throwing · Safi" } },
  { m: media.kiln, caption: { fr: "Le four traditionnel", en: "The traditional kiln" } },
  { m: media.tableware, caption: { fr: "Art de la table", en: "Tableware" } },
  { m: media.craftZellige, caption: { fr: "Zellige · Fès", en: "Zellige · Fez" } },
  { m: media.handsClay, caption: { fr: "Le geste", en: "The gesture" } },
  { m: media.craftBois, caption: { fr: "Thuya · Essaouira", en: "Thuya · Essaouira" } },
  { m: media.heroVase, caption: { fr: "Émail bleu de Safi", en: "Safi blue glaze" } },
  { m: media.craftTissage, caption: { fr: "Tissage · Atlas", en: "Weaving · Atlas" } },
  { m: media.craftCuir, caption: { fr: "Cuir · Fès", en: "Leather · Fez" } },
];

const VALUE_ICONS = [Fingerprint, Sprout, BadgeCheck];

/* ------------------------------------------------------------------ */

function Story() {
  const { t, l } = useI18n();
  return (
    <section className="container-page grid items-center gap-14 pb-20 md:grid-cols-2 md:gap-20 md:pb-28">
      <Reveal className="relative">
        <div className="mask-arch overflow-hidden">
          <Img media={media.kiln} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5] w-full" />
        </div>
        <div className="mask-bowl absolute -bottom-10 -right-3 w-[42%] overflow-hidden border-[6px] border-sand shadow-[0_30px_60px_-30px_rgba(42,30,23,0.45)] md:-right-10">
          <Img media={media.craftPoterie} alt="" sizes="20vw" className="aspect-square w-full" />
        </div>
        <span
          lang="ar"
          aria-hidden
          className="font-arabic absolute -left-2 -top-6 text-6xl text-ochre/80 md:-left-8 md:text-7xl"
        >
          الورشة
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="eyebrow">{t.atelier.storyEyebrow}</p>
        <h2 className="mt-4 text-4xl md:text-6xl">{t.atelier.storyTitle}</h2>
        {STORY.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "mt-6 rounded-2xl border border-dashed border-ochre/60 bg-cream p-4 text-sm italic text-muted-foreground"
                : "mt-6 text-lg leading-relaxed text-muted-foreground"
            }
          >
            {l(p)}
          </p>
        ))}
        <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
          <Rosette className="size-10 shrink-0 text-clay" strokeWidth={1.4} />
          <p className="font-display text-xl text-safi">
            {l({ fr: "Depuis Safi, vers le monde.", en: "From Safi, to the world." })}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Method() {
  const { l } = useI18n();
  return (
    <section className="relative overflow-hidden border-t border-border bg-cream py-20 md:py-28">
      <MotifWatermark className="-right-52 top-0 size-[34rem] text-safi" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={l({ fr: "Notre méthode", en: "How we work" })}
          title={l({ fr: "De l'atelier jusqu'à chez vous", en: "From the workshop to your door" })}
        />
        <Stagger className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-0 right-0 top-8 hidden border-t border-dashed border-clay/40 lg:block"
            aria-hidden
          />
          {METHOD.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem key={title.fr} className="relative">
              <span className="relative grid size-16 place-items-center rounded-full border border-clay/30 bg-sand text-clay">
                <Icon className="size-6" strokeWidth={1.4} aria-hidden />
                <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-safi font-display text-xs text-cream">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 text-2xl">{l(title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l(text)}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Network() {
  const { t, l, lp } = useI18n();
  const cities = craftCities();
  return (
    <section className="grain relative overflow-hidden bg-safi py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading
            light
            eyebrow={t.atelier.networkEyebrow}
            title={t.atelier.networkTitle}
            text={t.atelier.networkText}
          />
          <Button asChild variant="lineLight" className="mt-8">
            <Link to="/{-$locale}/metiers" params={lp} hash="carte">
              <MapPin /> {l({ fr: "Voir la carte des métiers", en: "See the crafts map" })}
            </Link>
          </Button>
        </div>
        <Stagger className="grid content-start gap-4 sm:grid-cols-2">
          {cities.map((c) => {
            const cover = c.crafts[0]!.image;
            return (
              <StaggerItem key={c.city.fr}>
                <div
                  className={cn(
                    "group relative h-full overflow-hidden rounded-[1.75rem] border",
                    c.featured ? "border-clay sm:col-span-2" : "border-cream/15",
                  )}
                >
                  <Img
                    media={cover}
                    alt=""
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="zoom-media absolute inset-0 size-full opacity-35"
                  />
                  <div
                    className={cn(
                      "absolute inset-0",
                      c.featured
                        ? "bg-gradient-to-br from-clay-deep/95 to-clay-deep/60"
                        : "bg-gradient-to-br from-safi-deep/95 to-safi-deep/70",
                    )}
                  />
                  <div className="relative p-6">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display text-3xl text-cream md:text-4xl">{l(c.city)}</p>
                      {c.featured && (
                        <span className="rounded-full bg-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-clay-deep">
                          {l({ fr: "Berceau", en: "Home" })}
                        </span>
                      )}
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {c.crafts.map((k) => (
                        <li key={k.slug}>
                          <Link
                            to="/{-$locale}/metiers/$slug"
                            params={{ ...lp, slug: k.slug }}
                            className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 px-3 py-1.5 text-sm text-cream/90 transition-colors hover:border-cream hover:bg-cream hover:text-safi"
                          >
                            {l(k.short)} <ArrowRight className="size-3.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function Values() {
  const { t } = useI18n();
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading eyebrow={t.atelier.valuesEyebrow} title={t.home.manifestoQuote} />
      <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
        {t.home.values.map((v, i) => {
          const Icon = VALUE_ICONS[i]!;
          return (
            <StaggerItem
              key={v.title}
              className="group relative overflow-hidden rounded-[2rem] border border-border bg-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(42,30,23,0.4)]"
            >
              <span className="absolute -right-2 -top-6 font-display text-[7rem] leading-none text-ochre/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative grid size-14 place-items-center rounded-full bg-sand text-clay transition-colors group-hover:bg-clay group-hover:text-cream">
                <Icon className="size-6" strokeWidth={1.3} aria-hidden />
              </span>
              <h3 className="relative mt-6 text-3xl">{v.title}</h3>
              <p className="relative mt-3 leading-relaxed text-muted-foreground">{v.text}</p>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

function Artisans() {
  const { t, l } = useI18n();
  return (
    <section className="grain relative overflow-hidden bg-cream py-20 md:py-28">
      <div className="container-page">
        <SectionHeading eyebrow={t.home.artisansEyebrow} title={t.atelier.artisansTitle} />
        <Stagger className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((a) => (
            <StaggerItem key={a.slug}>
              <ArtisanCard artisan={a} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-14 flex flex-col items-start gap-5 rounded-[2rem] border border-dashed border-clay/40 p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <div className="flex items-start gap-4">
            <Handshake className="mt-1 size-7 shrink-0 text-clay" strokeWidth={1.3} aria-hidden />
            <div>
              <h3 className="text-2xl">
                {l({ fr: "Vous êtes artisan ?", en: "Are you an artisan?" })}
              </h3>
              <p className="mt-1 text-muted-foreground">
                {l({
                  fr: "Nous sommes toujours heureux de découvrir de nouveaux ateliers et savoir-faire.",
                  en: "We are always glad to discover new workshops and crafts.",
                })}
              </p>
            </div>
          </div>
          <Button asChild variant="line">
            <a
              href={whatsappLink(
                l({
                  fr: "Bonjour, je suis artisan et j'aimerais présenter mon travail.",
                  en: "Hello, I am an artisan and would like to present my work.",
                }),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l({ fr: "Nous présenter votre travail", en: "Present your work" })} <ArrowRight />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function Gallery() {
  const { t, l } = useI18n();
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const go = useCallback(
    (d: 1 | -1) => setIndex((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length)),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const current = index !== null ? GALLERY[index]! : null;

  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading eyebrow={t.atelier.eyebrow} title={t.atelier.galleryTitle} />
      <div className="mt-12 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {GALLERY.map(({ m, caption }, i) => (
          <Reveal key={i} delay={(i % 3) * 0.08} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-[1.75rem] text-left"
              aria-label={`${l(caption)} — ${l({ fr: "agrandir", en: "enlarge" })}`}
            >
              <Img
                media={m}
                alt={l(m.alt)}
                sizes="(min-width: 768px) 33vw, 50vw"
                className={cn(
                  "zoom-media w-full",
                  i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]",
                )}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-sm font-semibold text-cream">{l(caption)}</span>
                <Expand className="size-4 text-cream" aria-hidden />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent className="max-w-5xl border-none bg-ink p-3 md:p-4">
          <DialogTitle className="sr-only">{current ? l(current.caption) : ""}</DialogTitle>
          {current && (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Img
                    media={current.m}
                    alt={l(current.m.alt)}
                    sizes="90vw"
                    className="max-h-[78vh] w-full rounded-xl object-contain"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="mt-3 flex items-center justify-between gap-4 text-cream">
                <p className="text-sm">
                  <span className="font-semibold">{l(current.caption)}</span>
                  <span className="text-cream/50"> · {(index ?? 0) + 1}/{GALLERY.length}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="grid size-10 place-items-center rounded-full border border-cream/25 transition-colors hover:bg-cream hover:text-ink"
                    aria-label={t.a11y.previous}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="grid size-10 place-items-center rounded-full border border-cream/25 transition-colors hover:bg-cream hover:text-ink"
                    aria-label={t.a11y.next}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Visit() {
  const { t, l, lp } = useI18n();
  return (
    <section className="border-t border-border bg-cream py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="eyebrow">{t.atelier.visitEyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-5xl">{t.atelier.visitTitle}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.atelier.visitText}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {VISIT.map((v) => (
              <li
                key={v.fr}
                className="flex items-center gap-3 rounded-2xl border border-border bg-sand px-4 py-3 text-sm font-medium text-safi"
              >
                <Flame className="size-4 shrink-0 text-clay" strokeWidth={1.6} aria-hidden />
                {l(v)}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-clay" aria-hidden />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t.atelier.address}
                </dt>
                <dd className="mt-1">{l(site.address.full)}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 size-5 shrink-0 text-clay" aria-hidden />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t.atelier.hours}
                </dt>
                {site.hours.map((h) => (
                  <dd key={h.days.fr} className="mt-1">
                    {l(h.days)} : {typeof h.time === "string" ? h.time : l(h.time)}
                  </dd>
                ))}
              </div>
            </div>
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="clay" size="xl">
              <Link to="/{-$locale}/contact" params={lp}>
                {t.atelier.book} <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="line" size="xl">
              <a
                href={whatsappLink(
                  l({
                    fr: "Bonjour, je souhaite visiter l'atelier.",
                    en: "Hello, I would like to visit the workshop.",
                  }),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {l({ fr: "Visites sur rendez-vous uniquement.", en: "Visits by appointment only." })}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="relative">
          <div className="h-full min-h-96 overflow-hidden rounded-[2rem] border border-border">
            <MapEmbed title={t.atelier.mapTitle} className="h-full min-h-96" />
          </div>
          <div className="absolute -bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl bg-safi p-4 text-cream shadow-[0_24px_50px_-25px_rgba(5,60,143,0.6)] md:left-auto md:w-80">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream/10">
              <MapPin className="size-5 text-ochre" aria-hidden />
            </span>
            <span className="text-sm leading-snug">{l(site.address.full)}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Atelier() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t.atelier.eyebrow}
        title={t.atelier.title}
        intro={t.atelier.intro}
        crumbs={[{ label: t.nav.atelier }]}
        arabic="الورشة"
      />
      <Story />
      <Method />
      <Network />
      <Values />
      <Artisans />
      <Gallery />
      <Visit />
    </>
  );
}