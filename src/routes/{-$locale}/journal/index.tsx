import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, Mail, RotateCw, Search, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Img } from "@/components/brand/Img";
import { MotifWatermark, Rosette } from "@/components/brand/Motif";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { PostCard, formatDate } from "@/components/site/PostCard";
import { Button } from "@/components/ui/button";
import { postCategories, posts, readingTime, type PostCategory } from "@/data/posts";
import { messages, useI18n } from "@/i18n";
import { localeFromPath, type L } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/journal/")({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    return seo({
      pathname: match.pathname,
      title: t.nav.journal,
      description: t.journal.intro,
      jsonLd: [breadcrumbLd(locale, [[t.nav.journal, "/journal"]])],
    });
  },
  component: Journal,
});

// General, well-known craft vocabulary (not company facts).
const LEXICON: { term: string; ar: string; def: L }[] = [
  {
    term: "Maâlem",
    ar: "معلم",
    def: {
      fr: "Le maître artisan. Il dirige l'atelier et transmet le métier aux apprentis.",
      en: "The master craftsman. He runs the workshop and passes the craft on to apprentices.",
    },
  },
  {
    term: "Zellige",
    ar: "زليج",
    def: {
      fr: "Mosaïque de petites pièces de terre émaillée, taillées à la main et assemblées en motifs géométriques.",
      en: "Mosaic of small glazed clay pieces, hand-cut and assembled into geometric patterns.",
    },
  },
  {
    term: "Tadelakt",
    ar: "تادلاكت",
    def: {
      fr: "Enduit à la chaux poli à la pierre et au savon noir, doux et résistant à l'eau.",
      en: "Lime plaster polished with stone and black soap, soft and water-resistant.",
    },
  },
  {
    term: "Menqach",
    ar: "منقاش",
    def: {
      fr: "Le marteau tranchant du zelligeur, qui sert à tailler chaque tesselle une à une.",
      en: "The zellige maker's sharp hammer, used to cut each tessera one by one.",
    },
  },
  {
    term: "Loupe de thuya",
    ar: "عرعار",
    def: {
      fr: "La souche du thuya, au veinage profond, travaillée par les ébénistes d'Essaouira.",
      en: "The root burl of the thuya tree, with a deep grain, worked by Essaouira's cabinetmakers.",
    },
  },
  {
    term: "Dinanderie",
    ar: "نحاس",
    def: {
      fr: "L'art de travailler le cuivre et le laiton : martelage, ciselure, ajourage.",
      en: "The art of working copper and brass: hammering, chasing, piercing.",
    },
  },
];

/* ------------------------------------------------------------------ */

function Cover({ post }: { post: (typeof posts)[number] }) {
  const { t, l, lp, locale } = useI18n();
  return (
    <Reveal>
      <Link
        to="/{-$locale}/journal/$slug"
        params={{ ...lp, slug: post.slug }}
        className="group relative grid overflow-hidden rounded-[2.5rem] bg-safi md:grid-cols-[1.3fr_1fr]"
      >
        <div className="relative overflow-hidden">
          <Img
            media={post.image}
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="zoom-media aspect-[4/3] size-full md:aspect-auto md:min-h-[32rem]"
          />
          <span className="absolute left-5 top-5 rounded-full bg-clay px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream">
            {l({ fr: "À la une", en: "Featured" })}
          </span>
        </div>
        <div className="grain relative flex flex-col justify-between gap-10 p-8 text-cream md:p-12">
          <Rosette
            className="pointer-events-none absolute -right-14 -top-14 size-56 text-cream opacity-10"
            strokeWidth={0.6}
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-ochre">
            {l(postCategories[post.category])}
          </p>
          <div className="relative">
            <h2 className="text-4xl leading-[1.05] !text-cream md:text-5xl">{l(post.title)}</h2>
            <p className="mt-5 line-clamp-3 text-cream/80">{l(post.excerpt)}</p>
          </div>
          <div className="relative flex items-center justify-between gap-4 border-t border-cream/15 pt-5 text-sm text-cream/70">
            <span>
              {formatDate(post.date, locale)} · {t.common.minRead(readingTime(post, locale))}
            </span>
            <span className="grid size-12 place-items-center rounded-full bg-cream text-safi transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="size-5" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function Lexicon() {
  const { l } = useI18n();
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState<string | null>(null);
  return (
    <section className="relative overflow-hidden border-y border-border bg-cream py-20 md:py-28">
      <MotifWatermark className="-left-52 top-10 size-[34rem] text-safi" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={l({ fr: "Petit lexique", en: "Glossary" })}
          title={l({ fr: "Les mots de l'atelier", en: "Words from the workshop" })}
          text={l({
            fr: "Retournez les cartes pour découvrir le vocabulaire des artisans marocains.",
            en: "Flip the cards to discover the vocabulary of Moroccan artisans.",
          })}
        />
        <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {LEXICON.map((w) => {
            const on = flipped === w.term;
            return (
              <StaggerItem key={w.term} className="[perspective:1200px]">
                <button
                  type="button"
                  onClick={() => setFlipped(on ? null : w.term)}
                  aria-pressed={on}
                  aria-label={`${w.term} — ${l({ fr: "voir la définition", en: "see definition" })}`}
                  className="relative block aspect-[4/3] w-full text-left md:aspect-[16/10]"
                >
                  <motion.span
                    className="absolute inset-0 [transform-style:preserve-3d]"
                    animate={{ rotateY: on && !reduce ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    {/* Front */}
                    <span
                      className={cn(
                        "absolute inset-0 flex flex-col justify-between rounded-[1.75rem] border border-border bg-sand p-5 [backface-visibility:hidden] md:p-7",
                        reduce && on && "opacity-0",
                      )}
                    >
                      <span lang="ar" className="font-arabic text-3xl text-ochre md:text-4xl">
                        {w.ar}
                      </span>
                      <span className="flex items-end justify-between gap-2">
                        <span className="font-display text-2xl text-safi md:text-4xl">{w.term}</span>
                        <RotateCw className="mb-1 size-4 shrink-0 text-clay" aria-hidden />
                      </span>
                    </span>
                    {/* Back */}
                    <span
                      className={cn(
                        "absolute inset-0 flex flex-col justify-center rounded-[1.75rem] bg-safi p-5 text-cream [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-7",
                        reduce && (on ? "opacity-100 [transform:none]" : "opacity-0"),
                      )}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
                        {w.term}
                      </span>
                      <span className="mt-2 text-sm leading-relaxed text-cream/90 md:text-base">
                        {l(w.def)}
                      </span>
                    </span>
                  </motion.span>
                </button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function Newsletter() {
  const { l } = useI18n();
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error(l({ fr: "Adresse email invalide", en: "Invalid email address" }));
      return;
    }
    // Front-end only for now — connect to an email tool later.
    toast.success(
      l({ fr: "Merci ! Vous recevrez nos prochaines lettres.", en: "Thank you! You'll receive our next letters." }),
    );
    setEmail("");
  };
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-clay-deep px-6 py-14 text-cream md:px-14 md:py-20">
        <Rosette
          className="pointer-events-none absolute -bottom-24 -right-16 size-96 text-cream opacity-10"
          strokeWidth={0.6}
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_1.1fr] md:gap-14">
          <div>
            <Mail className="size-8 text-ochre" strokeWidth={1.3} aria-hidden />
            <h2 className="mt-5 text-4xl !text-cream md:text-5xl">
              {l({ fr: "La lettre de l'atelier", en: "Letters from the workshop" })}
            </h2>
            <p className="mt-3 max-w-md text-cream/85">
              {l({
                fr: "Nouveaux articles, coulisses et nouvelles pièces — quelques fois par saison, jamais plus.",
                en: "New stories, behind the scenes and new pieces — a few times a season, never more.",
              })}
            </p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">
              Email
            </label>
            <input
              id="nl-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={l({ fr: "Votre adresse email", en: "Your email address" })}
              className="h-14 flex-1 rounded-full border border-cream/30 bg-cream/10 px-6 text-cream placeholder:text-cream/60 focus:border-cream focus:outline-none"
            />
            <Button type="submit" size="xl" className="h-14 rounded-full bg-cream font-semibold text-clay-deep hover:bg-sand">
              {l({ fr: "S'inscrire", en: "Subscribe" })} <ArrowRight />
            </Button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Journal() {
  const { t, l } = useI18n();
  const reduce = useReducedMotion();
  const [cat, setCat] = useState<PostCategory | "">("");
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), []);
  const featured = sorted[0];
  const filtering = Boolean(cat || query.trim());

  const list = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
    return sorted
      .filter((p) => (filtering ? true : p.slug !== featured?.slug))
      .filter((p) => !cat || p.category === cat)
      .filter((p) => {
        if (!q) return true;
        const hay = `${l(p.title)} ${l(p.excerpt)}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "");
        return hay.includes(q);
      });
  }, [sorted, cat, query, filtering, featured, l]);

  return (
    <>
      <PageHero
        eyebrow={t.journal.eyebrow}
        title={t.journal.title}
        intro={t.journal.intro}
        crumbs={[{ label: t.nav.journal }]}
        arabic="مجلة"
      />

      {featured && !filtering && (
        <section className="container-page pb-16 md:pb-20">
          <Cover post={featured} />
        </section>
      )}

      <section className="container-page pb-24">
        {/* Toolbar */}
        <div className="sticky top-[4.5rem] z-20 -mx-4 border-y border-border bg-sand/90 px-4 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <LayoutGroup>
              <div
                role="group"
                aria-label={t.collections.category}
                className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0"
              >
                {(["", ...Object.keys(postCategories)] as (PostCategory | "")[]).map((k) => {
                  const on = cat === k;
                  const count = k ? posts.filter((p) => p.category === k).length : posts.length;
                  return (
                    <button
                      key={k || "all"}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setCat(k)}
                      className={cn(
                        "relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        on ? "border-safi text-cream" : "border-border bg-cream text-ink hover:border-ochre",
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="journal-pill"
                          className="absolute inset-0 rounded-full bg-safi"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">
                        {k ? l(postCategories[k]) : t.journal.all}{" "}
                        <span className={on ? "text-cream/70" : "text-muted-foreground"}>{count}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            <label className="relative flex shrink-0 items-center md:w-72">
              <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" aria-hidden />
              <span className="sr-only">{l({ fr: "Rechercher un article", en: "Search articles" })}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={l({ fr: "Rechercher…", en: "Search…" })}
                className="h-11 w-full rounded-full border border-border bg-cream pl-11 pr-10 text-sm focus:border-safi focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={l({ fr: "Effacer", en: "Clear" })}
                  className="absolute right-3 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-sand hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </label>
          </div>
        </div>

        {/* Grid — first card spans two columns for a magazine rhythm */}
        <motion.div
          layout={!reduce}
          className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout={!reduce}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(i === 0 && list.length > 2 && "md:col-span-2 lg:col-span-2")}
              >
                <PostCard post={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto size-10 text-ochre" strokeWidth={1.2} aria-hidden />
            <p className="mt-4 font-display text-3xl text-safi">{t.collections.empty}</p>
            <button
              type="button"
              onClick={() => {
                setCat("");
                setQuery("");
              }}
              className="mt-4 text-sm font-semibold text-clay underline-offset-4 hover:underline"
            >
              {l({ fr: "Réinitialiser les filtres", en: "Reset filters" })}
            </button>
          </div>
        )}
      </section>

      <Lexicon />
      <Newsletter />
    </>
  );
}