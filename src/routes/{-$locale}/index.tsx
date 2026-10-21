import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Disc3,
  FileText,
  Fingerprint,
  Flame,
  Globe2,
  Hand,
  MessageSquareText,
  Mountain,
  PackageCheck,
  Paintbrush,
  PencilRuler,
  Sprout,
  Sun,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CountUp } from "@/components/brand/CountUp";
import { Img } from "@/components/brand/Img";
import { MotifDivider, MotifWatermark, Rosette } from "@/components/brand/Motif";
import { ArtisanCard } from "@/components/site/ArtisanCard";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { Marquee } from "@/components/site/Marquee";
import { MoroccoMap } from "@/components/site/MoroccoMap";
import { SectionHeading } from "@/components/site/PageHero";
import { PostCard } from "@/components/site/PostCard";
import { useQuote } from "@/components/site/QuoteDialog";
import { WhatsAppIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { media } from "@/config/media";
import { site, whatsappLink } from "@/config/site";
import { artisans } from "@/data/artisans";
import { categories } from "@/data/categories";
import { crafts } from "@/data/crafts";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { messages, useI18n } from "@/i18n";
import { localeFromPath } from "@/i18n/locale";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

// New images — see image prompts (place files in src/assets/)
import heroDetail from "@/assets/img/home-hero-detail.png";
import paintingPlate from "@/assets/img/home-painting-plate.png";

export const Route = createFileRoute("/{-$locale}/")({
  head: ({ match }) => {
    const t = messages[localeFromPath(match.pathname)];
    return seo({
      pathname: match.pathname,
      title: `${site.wordmark} — ${t.home.heroOverline}`,
      description: t.meta.siteDescription,
    });
  },
  component: Home,
});

const STEP_ICONS = [Mountain, Hand, Disc3, Sun, Flame, Paintbrush];
const VALUE_ICONS = [Fingerprint, Sprout, BadgeCheck];

function CircularBadge({ text }: { text: string }) {
  return (
    <div className="relative grid size-32 place-items-center rounded-full bg-sand md:size-40">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 animate-spin-slow text-safi motion-reduce:animate-none"
        aria-hidden
      >
        <defs>
          <path id="badge-circle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text className="fill-current font-sans text-[13px] font-semibold uppercase">
          {/* textLength makes the two repetitions fill the circle exactly, in any language */}
          <textPath
            href="#badge-circle"
            textLength="486"
            lengthAdjust="spacing"
          >{`${text} ${text}`}</textPath>
        </text>
      </svg>
      <span className="flex flex-col items-center gap-1">
        <Rosette className="size-7 text-clay md:size-8" strokeWidth={2.2} />
        <span lang="ar" className="font-arabic text-lg leading-none text-clay-deep md:text-xl">
          صنع يدوي
        </span>
      </span>
    </div>
  );
}

function Hero() {
  const { t, l, lp } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const [a, b, c] = t.home.heroTitle;
  const trust = [
    { fr: "100 % fait main", en: "100% handmade" },
    { fr: "Sur mesure", en: "Made to order" },
    { fr: "Export international", en: "Worldwide export" },
  ];

  return (
    <section
      ref={ref}
      className="grain relative overflow-hidden pt-24 md:min-h-[min(100svh,58rem)] md:pt-28"
    >
      <MotifWatermark className="-left-40 top-24 size-[36rem] text-safi" />
      <div className="container-page relative grid items-center gap-10 pb-16 md:min-h-[min(calc(100svh-7rem),51rem)] md:grid-cols-[1.08fr_1fr] md:gap-8 lg:gap-16">
        <div className="order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="eyebrow"
          >
            {t.home.heroOverline}
          </motion.p>
          <h1 className="mt-6 text-[2.75rem] leading-[0.98] sm:text-6xl lg:text-[5.6rem] xl:text-[6.2rem]">
            {[a, b, c].map((line, i) => (
              <motion.span
                key={i}
                className={cn("block", i === 1 && "italic text-clay")}
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.12, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            {t.home.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button asChild variant="clay" size="xl">
              <Link to="/{-$locale}/collections" params={lp}>
                {t.cta.discoverCollections} <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="line" size="xl">
              <Link to="/{-$locale}/savoir-faire" params={lp}>
                {t.cta.ourCraft}
              </Link>
            </Button>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6"
          >
            {trust.map((item) => (
              <li
                key={item.fr}
                className="flex items-center gap-2 text-sm font-medium text-safi"
              >
                <Rosette className="size-4 text-clay" strokeWidth={2} />
                {l(item)}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="relative order-1 mb-6 md:order-2 md:mb-0">
          <motion.div
            style={wide ? { y } : {}}
            className="mask-organic relative mx-auto aspect-[4/5] w-[88%] overflow-hidden md:w-full"
          >
            <Img
              media={media.heroVase}
              priority
              sizes="(min-width: 768px) 46vw, 88vw"
              className="size-full scale-105"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="mask-bowl absolute -right-2 top-[12%] hidden w-[34%] overflow-hidden border-[6px] border-sand shadow-[0_30px_60px_-30px_rgba(42,30,23,0.45)] md:block lg:-right-8"
          >
            <img
              src={heroDetail}
              alt=""
              width={800}
              height={800}
              loading="eager"
              className="aspect-square w-full object-cover"
            />
          </motion.div>
          <div className="absolute -bottom-6 -left-1 scale-90 md:-left-10 md:bottom-10 md:scale-100">
            <CircularBadge text={t.home.badge} />
          </div>
          <span
            lang="ar"
            aria-hidden
            className="font-arabic absolute -top-2 right-2 text-5xl text-ochre/80 md:-right-4 md:-top-6 md:text-7xl"
          >
            فخار
          </span>
        </div>
      </div>
      <a
        href="#manifesto"
        aria-label={l({ fr: "Défiler vers le contenu", en: "Scroll to content" })}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-clay md:flex"
      >
        {l({ fr: "Découvrir", en: "Discover" })}
        <ChevronDown className="size-4 animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  );
}

function Manifesto() {
  const { t } = useI18n();
  return (
    <section
      id="manifesto"
      className="container-page grid scroll-mt-24 gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:gap-20 md:py-32"
    >
      <Reveal>
        <p className="eyebrow">{t.home.manifestoEyebrow}</p>
        <blockquote className="mt-6 font-display text-4xl leading-[1.12] text-safi md:text-[3.4rem]">
          <span className="text-clay">«&nbsp;</span>
          {t.home.manifestoQuote}
          <span className="text-clay">&nbsp;»</span>
        </blockquote>
      </Reveal>
      <div>
        <Reveal delay={0.1}>
          {t.home.manifestoText.map((p) => (
            <p key={p} className="mb-5 text-lg leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </Reveal>
        <Stagger className="mt-10 grid gap-8 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          {t.home.values.map((v, i) => {
            const Icon = VALUE_ICONS[i]!;
            return (
              <StaggerItem key={v.title}>
                <Icon className="size-7 text-clay" strokeWidth={1.2} aria-hidden />
                <h3 className="mt-4 text-2xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function FocusSafi() {
  const { t, lp } = useI18n();
  const safi = crafts.find((c) => c.featured)!;
  return (
    <section className="relative overflow-hidden bg-cream py-20 md:py-28">
      <div className="container-page grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal className="relative">
          <div className="mask-arch overflow-hidden">
            <Img
              media={media.kiln}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] w-full"
            />
          </div>
          <div className="mask-bowl absolute -bottom-8 -right-4 w-[42%] overflow-hidden border-[6px] border-cream md:-right-10">
            <Img
              media={safi.image}
              alt=""
              sizes="20vw"
              className="aspect-square w-full"
              focus="60% 40%"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">{t.home.safiEyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-6xl">
            {t.home.safiTitle}
            <span
              lang="ar"
              aria-hidden
              className="font-arabic ml-3 align-middle text-4xl text-ochre md:text-5xl"
            >
              آسفي
            </span>
          </h2>
          {t.home.safiText.map((p) => (
            <p key={p} className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
          <Button asChild variant="safi" size="xl" className="mt-9">
            <Link to="/{-$locale}/savoir-faire" params={lp}>
              {t.home.safiCta} <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

// Asymmetric bento: first tile is large, the rest fill around it.
const BENTO = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

function CollectionsBento() {
  const { t, l, lp } = useI18n();
  const items = categories.slice(0, 6);
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading
        eyebrow={t.home.collectionsEyebrow}
        title={t.home.collectionsTitle}
        action={
          <Button asChild variant="line">
            <Link to="/{-$locale}/collections" params={lp}>
              {t.cta.seeAll} <ArrowRight />
            </Link>
          </Button>
        }
      />
      <Stagger className="mt-12 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[13rem] md:grid-cols-4 lg:auto-rows-[15rem]">
        {items.map((c, i) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <StaggerItem key={c.slug} className={cn("h-full", BENTO[i])}>
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
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-6">
                  <h3 className="text-3xl text-cream md:text-4xl">{l(c.name)}</h3>
                  <span className="translate-y-1 whitespace-nowrap rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-safi opacity-90 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    {t.common.pieces(count)}
                  </span>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

function StepsStrip() {
  const { t, l, lp } = useI18n();
  const steps = crafts.find((c) => c.featured)!.steps.slice(0, 6);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 85%", "end 55%"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section className="relative overflow-hidden bg-safi py-20 text-cream md:py-28">
      <Rosette
        className="pointer-events-none absolute -right-32 -top-32 size-[30rem] text-cream opacity-[0.05]"
        strokeWidth={0.5}
      />
      <div className="container-page relative">
        <SectionHeading
          light
          eyebrow={t.home.stepsEyebrow}
          title={t.home.stepsTitle}
          action={
            <Button asChild variant="lineLight">
              <Link to="/{-$locale}/savoir-faire" params={lp}>
                {t.cta.ourCraft} <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="relative mt-14 hidden h-px bg-cream/15 lg:block" aria-hidden>
          <motion.div
            style={{ scaleX: progress }}
            className="absolute inset-0 origin-left bg-ochre"
          />
        </div>
        <ol
          ref={listRef}
          className="no-scrollbar -mx-4 mt-14 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:mt-8 lg:grid lg:grid-cols-6 lg:gap-0 lg:overflow-visible lg:px-0"
        >
          {steps.map((s, i) => {
            const Icon = STEP_ICONS[i]!;
            return (
              <li
                key={s.title.fr}
                className="relative w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-auto lg:border-l lg:border-cream/15 lg:px-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <Reveal delay={i * 0.08}>
                  <span className="font-display text-5xl text-ochre">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="mt-5 size-7 text-cream" strokeWidth={1.2} aria-hidden />
                  <h3 className="mt-4 text-2xl !text-cream">{l(s.title)}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream/75">
                    {l(s.text)}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function FeaturedPieces() {
  const { t, l, lp } = useI18n();
  const { open } = useQuote();
  const railRef = useRef<HTMLUListElement>(null);
  const items = products.slice(0, 8);
  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={l({ fr: "Pièces choisies", en: "Selected pieces" })}
          title={l({
            fr: "Façonnées une à une, jamais deux fois pareilles",
            en: "Shaped one by one, never twice the same",
          })}
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="line"
                size="icon"
                className="rounded-full"
                onClick={() => scroll(-1)}
                aria-label={l({ fr: "Pièces précédentes", en: "Previous pieces" })}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant="line"
                size="icon"
                className="rounded-full"
                onClick={() => scroll(1)}
                aria-label={l({ fr: "Pièces suivantes", en: "Next pieces" })}
              >
                <ArrowRight />
              </Button>
            </div>
          }
        />
      </div>
      <ul
        ref={railRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {items.map((p, i) => {
          const craft = crafts.find((c) => c.slug === p.craft);
          const category = categories.find((c) => c.slug === p.category);
          return (
            <li key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[23%]">
              <Reveal delay={Math.min(i, 4) * 0.06} className="group">
                <Link
                  to="/{-$locale}/collections/$category/$slug"
                  params={{ ...lp, category: p.category, slug: p.slug }}
                  className={cn(
                    "relative block overflow-hidden bg-cream",
                    i % 3 === 1 ? "mask-bowl" : "rounded-[2rem]",
                  )}
                >
                  <Img
                    media={(p as any).images?.[0] ?? (p as any).image ?? (p as any).gallery?.[0] ?? media.heroVase}
                    alt={l(p.name)}
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 44vw, 78vw"
                    className="zoom-media aspect-[4/5] w-full"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-safi">
                    {l({ fr: "Sur demande", en: "On request" })}
                  </span>
                </Link>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-clay">
                      {[craft && l(craft.name), category && l(category.name)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <h3 className="mt-1 text-2xl leading-tight">{l(p.name)}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => open()}
                    className="mt-1 shrink-0 rounded-full border border-safi/20 px-3 py-1.5 text-xs font-semibold text-safi transition-colors hover:border-clay hover:bg-clay hover:text-cream"
                  >
                    {t.cta.quote}
                  </button>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Commitments() {
  const { l } = useI18n();
  const items = [
    {
      icon: Hand,
      title: { fr: "Fait main, sans raccourci", en: "Handmade, no shortcuts" },
      text: {
        fr: "Chaque pièce est tournée, peinte et cuite à la main. Les légères variations sont la signature du geste.",
        en: "Every piece is thrown, painted and fired by hand. Slight variations are the signature of the gesture.",
      },
    },
    {
      icon: Sprout,
      title: { fr: "Matières naturelles", en: "Natural materials" },
      text: {
        fr: "Argiles locales, oxydes et émaux choisis pour leur tenue et leur profondeur de couleur.",
        en: "Local clays, oxides and glazes chosen for their durability and depth of colour.",
      },
    },
    {
      icon: PencilRuler,
      title: { fr: "Sur mesure", en: "Made to order" },
      text: {
        fr: "Dimensions, couleurs, motifs ou logo : nous adaptons les pièces à votre projet.",
        en: "Sizes, colours, patterns or logo: we adapt pieces to your project.",
      },
    },
    {
      icon: PackageCheck,
      title: { fr: "Emballage & export", en: "Packing & export" },
      text: {
        fr: "Emballage renforcé pièce par pièce et expédition au Maroc comme à l'international.",
        en: "Reinforced, piece-by-piece packing and shipping across Morocco and worldwide.",
      },
    },
  ];
  return (
    <section className="relative overflow-hidden bg-cream py-20 md:py-28">
      <MotifWatermark className="-right-48 -top-24 size-[34rem] text-clay" />
      <div className="container-page relative grid items-center gap-14 md:grid-cols-[1fr_1.15fr] md:gap-20">
        <Reveal className="relative">
          <div className="mask-arch overflow-hidden">
            <img
              src={paintingPlate}
              alt={l({
                fr: "Artisan peignant à la main un plat en céramique de Safi",
                en: "Artisan hand-painting a Safi ceramic plate",
              })}
              width={1200}
              height={1500}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <p
            lang="ar"
            aria-hidden
            className="font-arabic absolute -bottom-6 -left-2 text-6xl text-ochre/80 md:-left-8 md:text-7xl"
          >
            صنعة
          </p>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">{l({ fr: "Nos engagements", en: "Our commitments" })}</p>
            <h2 className="mt-4 text-4xl md:text-6xl">
              {l({ fr: "Le geste juste, ", en: "The right gesture, " })}
              <span className="italic text-clay">
                {l({ fr: "à chaque pièce", en: "in every piece" })}
              </span>
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title.fr} className="group">
                <span className="grid size-12 place-items-center rounded-full border border-clay/30 text-clay transition-colors group-hover:bg-clay group-hover:text-cream">
                  <Icon className="size-5" strokeWidth={1.4} aria-hidden />
                </span>
                <h3 className="mt-5 text-2xl">{l(title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l(text)}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function HowToOrder() {
  const { l, lp } = useI18n();
  const steps = [
    {
      icon: MessageSquareText,
      title: { fr: "Votre demande", en: "Your request" },
      text: {
        fr: "Une pièce du catalogue ou un projet sur mesure : décrivez-nous votre besoin.",
        en: "A catalogue piece or a custom project: tell us what you need.",
      },
    },
    {
      icon: FileText,
      title: { fr: "Devis personnalisé", en: "Tailored quote" },
      text: {
        fr: "Nous revenons vers vous avec un devis, les délais et, si besoin, un prototype.",
        en: "We come back with a quote, lead times and, if needed, a prototype.",
      },
    },
    {
      icon: Truck,
      title: { fr: "Fabrication & livraison", en: "Making & delivery" },
      text: {
        fr: "Les artisans façonnent votre commande, emballée avec soin et livrée chez vous.",
        en: "Artisans craft your order, carefully packed and delivered to your door.",
      },
    },
  ];
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading
        eyebrow={l({ fr: "Commander", en: "How to order" })}
        title={l({ fr: "Trois étapes, aucun panier", en: "Three steps, no checkout" })}
        text={l({
          fr: "Chaque pièce étant unique, nous travaillons sur devis — pour les particuliers comme pour les professionnels.",
          en: "As every piece is unique, we work on quotes — for individuals and professionals alike.",
        })}
        action={
          <Button asChild variant="line">
            <Link to="/{-$locale}/professionnels" params={lp}>
              <Globe2 /> {l({ fr: "Export & pros", en: "Export & trade" })}
            </Link>
          </Button>
        }
      />
      <Stagger className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div
          className="absolute left-0 right-0 top-[3.25rem] hidden border-t border-dashed border-clay/40 md:block"
          aria-hidden
        />
        {steps.map(({ icon: Icon, title, text }, i) => (
          <StaggerItem
            key={title.fr}
            className="relative rounded-[2rem] border border-border bg-cream p-7 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(42,30,23,0.4)] md:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="relative grid size-14 place-items-center rounded-full bg-safi text-cream">
                <Icon className="size-6" strokeWidth={1.4} aria-hidden />
              </span>
              <span className="font-display text-5xl text-ochre/70">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-6 text-2xl">{l(title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l(text)}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function Stats() {
  const { t, l } = useI18n();
  return (
    <section className="container-page py-20 md:py-24" aria-label={t.home.statsEyebrow}>
      <MotifDivider className="mb-14" />
      <dl className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {site.stats.map((s) => (
          <Reveal key={s.label.fr} className="flex flex-col-reverse items-center text-center">
            <dt className="mt-2 text-sm uppercase tracking-[0.14em] text-muted-foreground">
              {l(s.label)}
            </dt>
            <dd className="font-display text-6xl text-safi md:text-7xl">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
      <p className="mt-10 text-center text-xs text-muted-foreground">
        {t.common.placeholderNotice}
      </p>
    </section>
  );
}

function Artisans() {
  const { t, lp } = useI18n();
  return (
    <section className="grain relative overflow-hidden bg-cream py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.home.artisansEyebrow}
          title={t.home.artisansTitle}
          action={
            <Button asChild variant="line">
              <Link to="/{-$locale}/atelier" params={lp}>
                {t.nav.atelier} <ArrowRight />
              </Link>
            </Button>
          }
        />
        <Stagger className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((a) => (
            <StaggerItem key={a.slug}>
              <ArtisanCard artisan={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ProBand() {
  const { t, lp } = useI18n();
  return (
    <section className="relative overflow-hidden bg-safi-deep py-20 md:py-28">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
        <Img media={media.riad} alt="" sizes="50vw" className="size-full opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-safi-deep via-safi-deep/40 to-transparent" />
      </div>
      <div className="container-page relative">
        <Reveal className="max-w-xl">
          <p className="eyebrow !text-ochre">{t.home.proEyebrow}</p>
          <h2 className="mt-5 text-5xl !text-cream md:text-6xl">{t.home.proTitle}</h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/80">{t.home.proText}</p>
          <Button asChild variant="clay" size="xl" className="mt-9">
            <Link to="/{-$locale}/professionnels" params={lp}>
              {t.cta.proSpace} <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function Journal() {
  const { t, lp } = useI18n();
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading
        eyebrow={t.home.journalEyebrow}
        title={t.home.journalTitle}
        action={
          <Button asChild variant="line">
            <Link to="/{-$locale}/journal" params={lp}>
              {t.cta.allArticles} <ArrowRight />
            </Link>
          </Button>
        }
      />
      <Stagger className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
        {latest.map((p) => (
          <StaggerItem key={p.slug}>
            <PostCard post={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function FinalCta() {
  const { t } = useI18n();
  const { open } = useQuote();
  return (
    <section className="container-page pb-24">
      <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-clay-deep px-6 py-16 text-center text-cream md:px-16 md:py-24">
        <Rosette
          className="pointer-events-none absolute -left-20 -top-20 size-80 text-cream opacity-10"
          strokeWidth={0.6}
        />
        <Rosette
          className="pointer-events-none absolute -bottom-24 -right-16 size-96 text-cream opacity-10"
          strokeWidth={0.6}
        />
        <h2 className="relative mx-auto max-w-3xl text-4xl !text-cream md:text-6xl">
          {t.home.finalTitle}
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg text-cream/85">{t.home.finalText}</p>
        <div className="relative mt-9 flex flex-wrap justify-center gap-3">
          <Button
            size="xl"
            className="rounded-full bg-cream font-semibold text-clay-deep hover:bg-sand"
            onClick={() => open()}
          >
            {t.cta.quote} <ArrowRight />
          </Button>
          <Button asChild variant="lineLight" size="xl">
            <a href={whatsappLink(t.whatsapp.project)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" /> {t.cta.whatsappLong}
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

function Home() {
  const { t, l } = useI18n();
  const marquee = [
    { fr: "Poterie", en: "Pottery" },
    { fr: "Céramique émaillée", en: "Glazed ceramics" },
    { fr: "Zellige", en: "Zellige" },
    { fr: "Tadelakt", en: "Tadelakt" },
    { fr: "Bois", en: "Wood" },
    { fr: "Tissage", en: "Weaving" },
    { fr: "Cuivre", en: "Copper" },
  ];
  return (
    <>
      <Hero />
      <Marquee words={marquee.map(l)} label={t.nav.crafts} />
      <Manifesto />
      <section className="grain relative overflow-hidden border-t border-border py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow={t.home.mapEyebrow}
            title={t.home.mapTitle}
            text={t.home.mapText}
          />
          <MoroccoMap className="mt-12" />
        </div>
      </section>
      <FocusSafi />
      <CollectionsBento />
      <FeaturedPieces />
      <StepsStrip />
      <Commitments />
      <Stats />
      <Artisans />
      <ProBand />
      <HowToOrder />
      <Journal />
      <FinalCta />
    </>
  );
}