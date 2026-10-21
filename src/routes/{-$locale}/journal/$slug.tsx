import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Clock,
  Facebook,
  Link2,
  Linkedin,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Img } from "@/components/brand/Img";
import { MotifDivider, Rosette } from "@/components/brand/Motif";
import { Reveal } from "@/components/site/FadeUp";
import { PageHero } from "@/components/site/PageHero";
import { PostCard, formatDate } from "@/components/site/PostCard";
import { WhatsAppIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { getPost, postCategories, posts, readingTime } from "@/data/posts";
import { messages, useI18n } from "@/i18n";
import { localeFromPath, withLocale } from "@/i18n/locale";
import { absoluteUrl, breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/journal/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ match, loaderData: p }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    if (!p)
      return seo({
        pathname: match.pathname,
        title: t.notFound.title,
        description: t.notFound.text,
        noindex: true,
      });
    return seo({
      pathname: match.pathname,
      title: p.title,
      description: p.excerpt,
      image: p.image.src,
      type: "article",
      jsonLd: [
        {
          "@type": "Article",
          headline: p.title[locale],
          description: p.excerpt[locale],
          image: absoluteUrl(p.image.src),
          datePublished: p.date,
          dateModified: p.date,
          inLanguage: locale,
          articleSection: postCategories[p.category][locale],
          author: { "@type": "Organization", name: site.name },
          publisher: {
            "@type": "Organization",
            name: site.name,
            logo: { "@type": "ImageObject", url: absoluteUrl("/apple-touch-icon.png") },
          },
          mainEntityOfPage: absoluteUrl(withLocale(`/journal/${p.slug}`, locale)),
        },
        breadcrumbLd(locale, [
          [t.nav.journal, "/journal"],
          [p.title[locale], `/journal/${p.slug}`],
        ]),
      ],
    });
  },
  component: Article,
});

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-clay via-ochre to-safi"
    />
  );
}

function Share({ url, title, vertical }: { url: string; title: string; vertical?: boolean }) {
  const { t } = useI18n();
  const u = encodeURIComponent(url);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, Icon: WhatsAppIcon },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: Facebook },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: Linkedin },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(title)}&body=${u}`, Icon: Mail },
  ];
  const btn =
    "grid size-10 place-items-center rounded-full border border-border bg-cream text-safi transition-all hover:-translate-y-0.5 hover:border-safi hover:bg-safi hover:text-cream";
  return (
    <div>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-clay-deep">
        {t.journal.share}
      </p>
      <ul className={cn("mt-3 flex flex-wrap gap-2", vertical && "lg:flex-col")}>
        {links.map(({ label, href, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${t.journal.share} — ${label}`} className={btn}>
              <Icon className="size-4" />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={btn}
            aria-label={t.journal.copyLink}
            onClick={() => {
              void navigator.clipboard?.writeText(url).then(() => toast.success(t.journal.copied));
            }}
          >
            <Link2 className="size-4" />
          </button>
        </li>
      </ul>
    </div>
  );
}

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Article() {
  const p = Route.useLoaderData();
  const { t, l, lp, locale } = useI18n();
  const toc = p.body.filter((b) => b.type === "h2");
  const tocIds = toc.map((b) => (b.type === "h2" ? b.id : "")).filter(Boolean);
  const active = useActiveHeading(tocIds);
  const url = absoluteUrl(withLocale(`/journal/${p.slug}`, locale));
  const minutes = readingTime(p, locale);

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((x) => x.slug === p.slug);
  const newer = idx > 0 ? sorted[idx - 1] : undefined;
  const older = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;

  const related = posts
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
    .slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <PageHero
        eyebrow={`${l(postCategories[p.category])} · ${formatDate(p.date, locale)} · ${t.common.minRead(minutes)}`}
        title={l(p.title)}
        intro={l(p.excerpt)}
        crumbs={[{ label: t.nav.journal, href: "/journal" }, { label: l(p.title) }]}
      />
      <div className="container-page">
        <Reveal className="relative">
          <div className="mask-bowl overflow-hidden">
            <Img media={p.image} priority sizes="100vw" className="aspect-[16/9] w-full md:aspect-[21/9]" />
          </div>
          <div className="absolute -bottom-6 right-6 hidden items-center gap-3 rounded-full bg-safi px-5 py-3 text-sm text-cream shadow-[0_20px_40px_-20px_rgba(5,60,143,0.6)] md:flex">
            <Clock className="size-4 text-ochre" aria-hidden />
            {t.common.minRead(minutes)}
          </div>
        </Reveal>
      </div>

      <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          {toc.length > 0 && (
            <nav aria-label={t.journal.toc} className="rounded-[1.5rem] border border-border bg-cream p-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-clay-deep">
                {t.journal.toc}
              </p>
              <ol className="relative mt-4 space-y-1 border-l border-border text-sm">
                {toc.map((b, i) =>
                  b.type === "h2" ? (
                    <li key={b.id}>
                      <a
                        href={`#${b.id}`}
                        aria-current={active === b.id ? "true" : undefined}
                        className={cn(
                          "-ml-px flex gap-2 border-l-2 py-1.5 pl-3 transition-colors",
                          active === b.id
                            ? "border-clay font-semibold text-safi"
                            : "border-transparent text-ink/70 hover:text-clay-deep",
                        )}
                      >
                        <span className="text-ochre">{String(i + 1).padStart(2, "0")}</span>
                        {l(b.text)}
                      </a>
                    </li>
                  ) : null,
                )}
              </ol>
            </nav>
          )}
          <div className="mt-6 hidden lg:block">
            <Share url={url} title={l(p.title)} />
          </div>
        </aside>

        <div className="max-w-[42rem]">
          <article className="prose-ssoussi" lang={locale}>
            {p.body.map((b, i) => {
              if (b.type === "h2")
                return (
                  <h2 key={i} id={b.id} className="scroll-mt-28">
                    {l(b.text)}
                  </h2>
                );
              if (b.type === "quote")
                return (
                  <blockquote key={i} className="relative">
                    <Rosette className="absolute -left-2 -top-4 size-8 text-clay opacity-60" strokeWidth={1.4} />
                    {l(b.text)}
                  </blockquote>
                );
              return (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "font-display text-2xl leading-snug text-safi first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-clay"
                      : undefined
                  }
                >
                  {l(b.text)}
                </p>
              );
            })}
          </article>

          {/* Signature */}
          <div className="mt-14 flex items-center gap-4 border-y border-border py-6">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-safi">
              <Rosette className="size-7 text-cream" strokeWidth={1.6} />
            </span>
            <div>
              <p className="font-display text-xl text-safi">
                {l({ fr: `L'atelier ${site.name}`, en: `The ${site.name} workshop` })}
              </p>
              <p className="text-sm text-muted-foreground">
                {l({
                  fr: "Récits et savoir-faire de l'artisanat marocain.",
                  en: "Stories and know-how from Moroccan craftsmanship.",
                })}
              </p>
            </div>
          </div>

          <div className="mt-10 lg:hidden">
            <Share url={url} title={l(p.title)} />
          </div>

          {/* Contextual CTA */}
          <div className="grain relative mt-12 overflow-hidden rounded-[2rem] bg-cream p-7 md:p-9">
            <Rosette
              className="pointer-events-none absolute -right-10 -top-10 size-40 text-clay opacity-10"
              strokeWidth={0.8}
            />
            <p className="relative eyebrow">{l({ fr: "Aller plus loin", en: "Go further" })}</p>
            <p className="relative mt-3 font-display text-2xl text-safi md:text-3xl">
              {l({
                fr: "Découvrez les pièces nées de ces gestes.",
                en: "Discover the pieces born from these gestures.",
              })}
            </p>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Button asChild variant="clay">
                <Link to="/{-$locale}/collections" params={lp}>
                  {t.cta.discoverCollections} <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="line">
                <Link to="/{-$locale}/savoir-faire" params={lp}>
                  {t.cta.ourCraft}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <Link
              to="/{-$locale}/journal"
              params={lp}
              className="inline-flex items-center gap-2 text-sm font-semibold text-safi hover:text-clay-deep"
            >
              <ArrowLeft className="size-4" /> {t.journal.back}
            </Link>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-safi"
            >
              {l({ fr: "Haut de page", en: "Back to top" })} <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Previous / next */}
      {(newer || older) && (
        <nav
          aria-label={l({ fr: "Articles précédent et suivant", en: "Previous and next articles" })}
          className="grid border-y border-border md:grid-cols-2"
        >
          {[
            { post: older, label: { fr: "Article précédent", en: "Previous article" }, dir: "prev" as const },
            { post: newer, label: { fr: "Article suivant", en: "Next article" }, dir: "next" as const },
          ].map(({ post, label, dir }) =>
            post ? (
              <Link
                key={dir}
                to="/{-$locale}/journal/$slug"
                params={{ ...lp, slug: post.slug }}
                className={cn(
                  "group relative flex min-h-[12rem] items-end overflow-hidden p-8 md:min-h-[15rem] md:p-12",
                  dir === "next" && "md:justify-end md:text-right",
                )}
              >
                <Img media={post.image} alt="" sizes="50vw" className="zoom-media absolute inset-0 size-full" />
                <span className="absolute inset-0 bg-safi-deep/75 transition-colors duration-500 group-hover:bg-safi-deep/60" />
                <span className="relative max-w-md">
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
                  <span className="mt-2 block font-display text-3xl leading-tight text-cream md:text-4xl">
                    {l(post.title)}
                  </span>
                </span>
              </Link>
            ) : (
              <span key={dir} className="hidden md:block" />
            ),
          )}
        </nav>
      )}

      {related.length > 0 && (
        <section className="container-page py-20 md:py-24">
          <MotifDivider className="mb-14" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl">{t.journal.related}</h2>
            <Button asChild variant="line">
              <Link to="/{-$locale}/journal" params={lp}>
                {t.journal.all} <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
            {related.map((x) => (
              <PostCard key={x.slug} post={x} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}