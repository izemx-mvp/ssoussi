import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Brush, Disc3, Flame, Mountain, Play, Quote } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Img } from "@/components/brand/Img";
import { MotifWatermark, Rosette } from "@/components/brand/Motif";
import { CraftTimeline } from "@/components/site/CraftTimeline";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { media } from "@/config/media";
import { site } from "@/config/site";
import { crafts } from "@/data/crafts";
import { messages, useI18n } from "@/i18n";
import { localeFromPath, type L } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

// New images — see image prompts (place files in src/assets/img/)
import glazeDetail from "@/assets/img/craft-glaze-detail.png";
import transmission from "@/assets/img/craft-transmission.png";

export const Route = createFileRoute("/{-$locale}/savoir-faire")({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    return seo({
      pathname: match.pathname,
      title: t.nav.craft,
      description: t.craft.intro,
      jsonLd: [breadcrumbLd(locale, [[t.nav.craft, "/savoir-faire"]])],
    });
  },
  component: SavoirFaire,
});

/* ------------------------------------------------------------------ */
/* Content — CONTENU EXEMPLE À REMPLACER (general, non-invented facts) */
/* ------------------------------------------------------------------ */

const CHAPTERS: { id: string; label: L }[] = [
  { id: "safi", label: { fr: "Safi", en: "Safi" } },
  { id: "etapes", label: { fr: "Les étapes", en: "The steps" } },
  { id: "matieres", label: { fr: "Les matières", en: "Materials" } },
  { id: "decors", label: { fr: "Les décors", en: "Patterns" } },
  { id: "transmission", label: { fr: "Transmission", en: "Heritage" } },
  { id: "video", label: { fr: "Vidéo", en: "Film" } },
];

const SAFI_FACTS: { icon: typeof Mountain; label: L; value: L }[] = [
  {
    icon: Mountain,
    label: { fr: "La terre", en: "The earth" },
    value: { fr: "Argile locale de Safi", en: "Local Safi clay" },
  },
  {
    icon: Disc3,
    label: { fr: "Le tour", en: "The wheel" },
    value: { fr: "Tourné à la main", en: "Hand-thrown" },
  },
  {
    icon: Brush,
    label: { fr: "Le décor", en: "The decoration" },
    value: { fr: "Peint au pinceau", en: "Brush-painted" },
  },
  {
    icon: Flame,
    label: { fr: "Le feu", en: "The fire" },
    value: { fr: "Four traditionnel", en: "Traditional kiln" },
  },
];

const MATERIALS: { title: L; text: L; color: string; tag: L }[] = [
  {
    title: { fr: "L'argile", en: "Clay" },
    tag: { fr: "La matière", en: "The body" },
    text: {
      fr: "Extraite près de Safi, trempée et décantée, elle donne une pâte fine et plastique, rouge à la cuisson.",
      en: "Dug near Safi, soaked and settled, it gives a fine, plastic paste that fires red.",
    },
    color: "var(--clay)",
  },
  {
    title: { fr: "Pigments & oxydes", en: "Pigments & oxides" },
    tag: { fr: "La couleur", en: "The colour" },
    text: {
      fr: "Oxydes métalliques et pigments naturels composent la palette des décors peints au pinceau.",
      en: "Metal oxides and natural pigments make up the palette of brush-painted decoration.",
    },
    color: "var(--safi-blue)",
  },
  {
    title: { fr: "Les émaux", en: "Glazes" },
    tag: { fr: "La lumière", en: "The shine" },
    text: {
      fr: "Posés après une première cuisson, ils se vitrifient au four et révèlent leurs couleurs profondes.",
      en: "Applied after a first firing, they vitrify in the kiln and reveal their deep colours.",
    },
    color: "var(--glaze-green)",
  },
  {
    title: { fr: "Le feu de bois", en: "Wood fire" },
    tag: { fr: "La transformation", en: "The change" },
    text: {
      fr: "Le four traditionnel, alimenté au bois, demande un savoir précis pour conduire la montée en température.",
      en: "The traditional wood-fuelled kiln takes precise know-how to manage the rise in temperature.",
    },
    color: "var(--ochre)",
  },
];

const DECORS: { name: L; text: L; svg: ReactNode }[] = [
  {
    name: { fr: "Rosace", en: "Rosette" },
    text: {
      fr: "Motif rayonnant posé au centre des plats, il organise tout le décor autour de lui.",
      en: "A radiating motif set at the heart of plates, organising the whole design around it.",
    },
    svg: <Rosette className="size-full" strokeWidth={1.3} />,
  },
  {
    name: { fr: "Cercles concentriques", en: "Concentric circles" },
    text: {
      fr: "Tracés d'un geste continu pendant que la pièce tourne, ils rythment bords et fonds.",
      en: "Drawn in one continuous gesture as the piece turns, they give rhythm to rims and centres.",
    },
    svg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="size-full" aria-hidden>
        {[46, 38, 30, 22, 14, 6].map((r, i) => (
          <circle key={r} cx="50" cy="50" r={r} strokeWidth={i % 2 ? 0.7 : 1.4} />
        ))}
      </svg>
    ),
  },
  {
    name: { fr: "Étoile à huit branches", en: "Eight-point star" },
    text: {
      fr: "Figure géométrique emblématique de l'art marocain, née de deux carrés superposés.",
      en: "An emblematic figure of Moroccan art, born from two overlapping squares.",
    },
    svg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-full" aria-hidden>
        <rect x="22" y="22" width="56" height="56" />
        <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="12" />
        <circle cx="50" cy="50" r="46" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    name: { fr: "Rinceaux", en: "Scrolls" },
    text: {
      fr: "Volutes végétales souples qui adoucissent la géométrie et habillent les panses.",
      en: "Supple plant-like scrolls that soften the geometry and dress the bodies of vessels.",
    },
    svg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="size-full" aria-hidden>
        <path d="M8 70 C 20 40, 40 40, 46 58 S 70 82, 82 52 S 72 20, 60 30" />
        <path d="M30 52 c -6 -8 -2 -16 6 -14" />
        <path d="M66 62 c 8 4 14 -2 12 -10" />
        <circle cx="60" cy="30" r="4" />
        <circle cx="8" cy="70" r="2" />
      </svg>
    ),
  },
  {
    name: { fr: "Frises & bandes", en: "Bands & friezes" },
    text: {
      fr: "Bandes répétitives qui cernent les cols et les bords, comme une ponctuation.",
      en: "Repeating bands that frame necks and rims, like punctuation.",
    },
    svg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.1" className="size-full" aria-hidden>
        <path d="M4 30 H96 M4 70 H96" />
        <path d="M4 50 L14 38 L24 50 L34 38 L44 50 L54 38 L64 50 L74 38 L84 50 L96 38" />
        <path d="M4 62 L14 50 L24 62 L34 50 L44 62 L54 50 L64 62 L74 50 L84 62 L96 50" strokeWidth="0.7" />
      </svg>
    ),
  },
  {
    name: { fr: "Géométrie de zellige", en: "Zellige geometry" },
    text: {
      fr: "Héritée de la mosaïque, une géométrie rigoureuse qui se répète à l'infini.",
      en: "Inherited from mosaic, a rigorous geometry that repeats endlessly.",
    },
    svg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.9" className="size-full" aria-hidden>
        {[25, 75].flatMap((x) =>
          [25, 75].map((y) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <rect x="-14" y="-14" width="28" height="28" />
              <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" />
            </g>
          )),
        )}
        <path d="M50 0 V100 M0 50 H100" strokeWidth="0.5" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function ChapterNav() {
  const { l } = useI18n();
  const [active, setActive] = useState(CHAPTERS[0]!.id);

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Chapitres"
      className="sticky top-[4.5rem] z-30 border-y border-border bg-sand/85 backdrop-blur-md"
    >
      <ul className="container-page no-scrollbar flex gap-1 overflow-x-auto py-2.5">
        {CHAPTERS.map((c, i) => {
          const on = active === c.id;
          return (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  on ? "text-cream" : "text-safi/70 hover:text-safi",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="chapter-pill"
                    className="absolute inset-0 rounded-full bg-safi"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={cn("relative font-display text-xs", on ? "text-ochre" : "text-clay")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative">{l(c.label)}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function FeaturedSafi() {
  const { t, l } = useI18n();
  const featured = crafts.find((c) => c.featured)!;
  return (
    <section
      id="safi"
      className="container-page grid scroll-mt-36 items-center gap-14 py-20 md:grid-cols-[1fr_1.1fr] md:gap-20 md:py-28"
    >
      <Reveal className="relative">
        <div className="mask-organic overflow-hidden">
          <Img
            media={featured.image}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="aspect-[4/5] w-full"
          />
        </div>
        <div className="mask-bowl absolute -bottom-10 -right-3 w-[44%] overflow-hidden border-[6px] border-sand shadow-[0_30px_60px_-30px_rgba(42,30,23,0.45)] md:-right-10">
          <img
            src={glazeDetail}
            alt={l({
              fr: "Détail d'un émail bleu de Safi peint à la main",
              en: "Close-up of a hand-painted Safi blue glaze",
            })}
            width={800}
            height={800}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>
        <span
          lang="ar"
          aria-hidden
          className="font-arabic absolute -left-2 -top-6 text-6xl text-ochre/80 md:-left-8 md:text-7xl"
        >
          آسفي
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="eyebrow">{t.craft.featuredEyebrow}</p>
        <h2 className="mt-4 text-4xl md:text-6xl">{t.craft.featuredTitle}</h2>
        {t.craft.featuredText.map((p) => (
          <p key={p} className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border">
          {SAFI_FACTS.map(({ icon: Icon, label, value }) => (
            <div key={label.fr} className="group bg-cream p-5 transition-colors hover:bg-sand">
              <Icon
                className="size-5 text-clay transition-transform duration-500 group-hover:-rotate-12"
                strokeWidth={1.4}
                aria-hidden
              />
              <dt className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {l(label)}
              </dt>
              <dd className="mt-1 font-display text-xl text-safi md:text-2xl">{l(value)}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

function Steps() {
  const { t, l, lp } = useI18n();
  const [slug, setSlug] = useState(crafts.find((c) => c.featured)?.slug ?? crafts[0]!.slug);
  const craft = crafts.find((c) => c.slug === slug) ?? crafts[0]!;

  return (
    <section id="etapes" className="relative scroll-mt-36 overflow-hidden bg-cream py-20 md:py-28">
      <MotifWatermark className="-right-52 top-10 size-[36rem] text-safi" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={t.craft.timelineEyebrow}
          title={t.craft.timelineTitle(l(craft.short))}
        />

        <div
          role="tablist"
          aria-label={t.craft.switcherLabel}
          className="no-scrollbar -mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-2"
        >
          {crafts.map((c) => {
            const on = c.slug === slug;
            return (
              <button
                key={c.slug}
                role="tab"
                id={`tab-${c.slug}`}
                aria-selected={on}
                aria-controls="craft-timeline"
                onClick={() => setSlug(c.slug)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-5 text-left transition-colors",
                  on ? "border-safi text-cream" : "border-safi/20 bg-sand/60 text-safi hover:border-safi",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="craft-tab"
                    className="absolute inset-0 rounded-full bg-safi"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative size-10 overflow-hidden rounded-full ring-2 ring-cream/40">
                  <Img media={c.image} alt="" sizes="40px" className="size-full" />
                </span>
                <span className="relative leading-tight">
                  <span className="block text-sm font-semibold">{l(c.short)}</span>
                  <span className={cn("block text-xs", on ? "text-cream/70" : "text-muted-foreground")}>
                    {l(c.city)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="craft-timeline"
          role="tabpanel"
          aria-labelledby={`tab-${slug}`}
          className="mt-14 md:mt-20"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <CraftTimeline steps={craft.steps} label={l(craft.name)} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Button asChild variant="safi">
            <Link to="/{-$locale}/metiers/$slug" params={{ ...lp, slug: craft.slug }}>
              {l({ fr: "Tout sur ce métier :", en: "All about this craft:" })} {l(craft.name)}{" "}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="line">
            <Link to="/{-$locale}/collections" params={lp}>
              {t.cta.discoverCollections}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Materials() {
  const { t, l } = useI18n();
  return (
    <section id="matieres" className="container-page scroll-mt-36 py-20 md:py-28">
      <SectionHeading eyebrow={t.craft.materialsEyebrow} title={t.craft.materialsTitle} />

      {/* Palette strip */}
      <Reveal className="mt-12">
        <div className="flex h-3 overflow-hidden rounded-full" aria-hidden>
          {MATERIALS.map((m) => (
            <span key={m.title.fr} className="flex-1" style={{ background: m.color }} />
          ))}
        </div>
      </Reveal>

      <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MATERIALS.map((m, i) => (
          <StaggerItem key={m.title.fr}>
            <article className="group relative h-full overflow-hidden rounded-[2rem] border border-border bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(42,30,23,0.4)]">
              <span
                className="absolute -right-10 -top-10 size-36 opacity-15 transition-transform duration-700 group-hover:scale-125"
                style={{ background: m.color, borderRadius: "46% 54% 50% 50% / 50% 44% 56% 50%" }}
                aria-hidden
              />
              <div className="relative flex items-center justify-between">
                <span
                  className="block size-14"
                  style={{ background: m.color, borderRadius: "46% 54% 50% 50% / 50% 44% 56% 50%" }}
                  aria-hidden
                />
                <span className="font-display text-4xl text-ochre/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="relative mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">
                {l(m.tag)}
              </p>
              <h3 className="relative mt-1 text-3xl">{l(m.title)}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{l(m.text)}</p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function Decors() {
  const { t, l } = useI18n();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const current = DECORS[index]!;

  return (
    <section id="decors" className="grain relative scroll-mt-36 overflow-hidden bg-safi py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          light
          eyebrow={t.craft.decorsEyebrow}
          title={t.craft.decorsTitle}
          text={t.craft.decorsText}
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* Large "plate" showing the selected motif */}
          <Reveal className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square rounded-full border border-cream/20 bg-safi-deep/40 p-[12%]">
              <div className="absolute inset-[5%] rounded-full border border-cream/10" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotate: reduce ? 0 : -25, scale: reduce ? 1 : 0.9 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: reduce ? 0 : 25, scale: reduce ? 1 : 0.9 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                  className={cn("size-full", index % 2 ? "text-ochre" : "text-cream")}
                >
                  {current.svg}
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 text-center"
                aria-live="polite"
              >
                <h3 className="text-3xl !text-cream">{l(current.name)}</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream/75">
                  {l(current.text)}
                </p>
              </motion.div>
            </AnimatePresence>
          </Reveal>

          {/* Motif picker */}
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {DECORS.map((d, i) => {
              const on = i === index;
              return (
                <StaggerItem key={d.name.fr}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    onMouseEnter={() => setIndex(i)}
                    aria-pressed={on}
                    className={cn(
                      "group w-full rounded-[1.75rem] border p-5 text-left transition-colors",
                      on ? "border-ochre bg-cream/10" : "border-cream/15 hover:border-cream/40",
                    )}
                  >
                    <div
                      className={cn(
                        "aspect-square transition-transform duration-700 group-hover:rotate-12 motion-reduce:group-hover:rotate-0",
                        i % 2 ? "text-ochre" : "text-cream",
                      )}
                    >
                      {d.svg}
                    </div>
                    <p className="mt-4 text-center text-sm text-cream/85">{l(d.name)}</p>
                  </button>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Transmission() {
  const { l, lp } = useI18n();
  return (
    <section
      id="transmission"
      className="container-page grid scroll-mt-36 items-center gap-14 py-20 md:grid-cols-[1.1fr_1fr] md:gap-20 md:py-28"
    >
      <Reveal className="order-2 md:order-1">
        <p className="eyebrow">{l({ fr: "Transmission", en: "Passing it on" })}</p>
        <h2 className="mt-4 text-4xl md:text-6xl">
          {l({ fr: "Du maâlem ", en: "From master " })}
          <em className="text-clay">{l({ fr: "à l'apprenti", en: "to apprentice" })}</em>
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {l({
            fr: "Au Maroc, le savoir-faire se transmet d'abord par le geste. L'apprenti observe, prépare la terre, puis prend place au tour, guidé par le maâlem, le maître artisan. Des années de pratique sont nécessaires pour maîtriser le tournage, le décor et la conduite du four.",
            en: "In Morocco, craft is passed on through the gesture first. The apprentice watches, prepares the clay, then takes a seat at the wheel, guided by the maâlem, the master craftsman. Years of practice are needed to master throwing, painting and firing.",
          })}
        </p>
        <figure className="relative mt-10 rounded-[2rem] border border-border bg-cream p-7 md:p-8">
          <Quote className="absolute -top-4 left-7 size-8 fill-clay text-clay" aria-hidden />
          <blockquote className="font-display text-2xl leading-snug text-safi md:text-3xl">
            {l({
              fr: "La main apprend avant les mots : on regarde, on recommence, jusqu'à ce que la terre obéisse.",
              en: "The hand learns before words do: you watch, you start again, until the clay obeys.",
            })}
          </blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground">
            {l({ fr: "Parole d'atelier — exemple à remplacer", en: "Workshop saying — example to replace" })}
          </figcaption>
        </figure>
        <Button asChild variant="line" className="mt-8">
          <Link to="/{-$locale}/atelier" params={lp}>
            {l({ fr: "Rencontrer nos artisans", en: "Meet our artisans" })} <ArrowRight />
          </Link>
        </Button>
      </Reveal>
      <Reveal delay={0.1} className="relative order-1 md:order-2">
        <div className="mask-arch overflow-hidden">
          <img
            src={transmission}
            alt={l({
              fr: "Un maître potier guide les mains d'un apprenti au tour",
              en: "A master potter guiding an apprentice's hands at the wheel",
            })}
            width={1200}
            height={1500}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <Rosette
          className="absolute -bottom-8 -left-8 size-28 text-clay opacity-80 md:size-36"
          strokeWidth={1}
        />
      </Reveal>
    </section>
  );
}

function VideoBlock() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const hasVideo = Boolean(site.videoUrl);
  return (
    <section id="video" className="container-page scroll-mt-36 py-20 md:py-28">
      <SectionHeading eyebrow={t.craft.videoEyebrow} title={t.craft.videoTitle} />
      <Reveal className="mt-10">
        <button
          type="button"
          disabled={!hasVideo}
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden rounded-[2.5rem] disabled:cursor-default"
          aria-label={hasVideo ? t.craft.play : t.craft.videoSoon}
        >
          <Img
            media={media.kiln}
            alt=""
            sizes="100vw"
            className="zoom-media aspect-[16/9] w-full md:aspect-[21/9]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex flex-col items-center gap-4">
              <span className="relative grid size-20 place-items-center rounded-full bg-cream text-clay-deep shadow-soft transition-transform group-hover:scale-105 md:size-24">
                {hasVideo && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-cream/40 motion-reduce:animate-none" />
                )}
                <Play className="relative ml-1 size-8 fill-current" aria-hidden />
              </span>
              {!hasVideo && (
                <span className="rounded-full bg-ink/50 px-4 py-1.5 text-sm text-cream">
                  {t.craft.videoSoon}
                </span>
              )}
            </span>
          </span>
          <span className="absolute bottom-6 left-6 hidden text-left md:block md:bottom-10 md:left-10">
            <span className="block text-xs uppercase tracking-[0.2em] text-cream/70">
              {t.craft.videoEyebrow}
            </span>
            <span className="mt-1 block font-display text-3xl text-cream">{t.craft.videoTitle}</span>
          </span>
        </button>
      </Reveal>
      {hasVideo && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-5xl border-none bg-ink p-2">
            <DialogTitle className="sr-only">{t.craft.videoTitle}</DialogTitle>
            {open && (
              <iframe
                src={site.videoUrl}
                title={t.craft.videoTitle}
                className="aspect-video w-full rounded-lg"
                allow="fullscreen; picture-in-picture"
                loading="lazy"
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

function Cta() {
  const { t, lp } = useI18n();
  return (
    <section className="container-page pb-24">
      <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-clay-deep px-6 py-14 text-cream md:px-14 md:py-20">
        <Rosette
          className="pointer-events-none absolute -right-16 -top-20 size-80 text-cream opacity-10"
          strokeWidth={0.6}
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-4xl !text-cream md:text-5xl">{t.craft.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-lg text-cream/85">{t.craft.ctaText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="xl"
              className="rounded-full bg-cream font-semibold text-clay-deep hover:bg-sand"
            >
              <Link to="/{-$locale}/atelier" params={lp}>
                {t.cta.visitAtelier} <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="lineLight" size="xl">
              <Link to="/{-$locale}/contact" params={lp}>
                {t.cta.contactUs}
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SavoirFaire() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t.craft.eyebrow}
        title={
          <>
            {t.craft.title.split(" ").slice(0, -2).join(" ")}{" "}
            <em className="text-clay">{t.craft.title.split(" ").slice(-2).join(" ")}</em>
          </>
        }
        intro={t.craft.intro}
        crumbs={[{ label: t.nav.craft }]}
        arabic="صنع يدوي"
      />
      <ChapterNav />
      <FeaturedSafi />
      <Steps />
      <Materials />
      <Decors />
      <Transmission />
      <VideoBlock />
      <Cta />
    </>
  );
}