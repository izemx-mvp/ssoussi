import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Hand,
  Link2,
  PackageCheck,
  PencilRuler,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { Img } from "@/components/brand/Img";
import { Rosette } from "@/components/brand/Motif";
import { Breadcrumbs } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/FadeUp";
import { Gallery } from "@/components/site/Gallery";
import { ProductCard } from "@/components/site/ProductCard";
import { useQuote } from "@/components/site/QuoteDialog";
import { WhatsAppIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { site, whatsappLink } from "@/config/site";
import { getCategory } from "@/data/categories";
import { getCraft } from "@/data/crafts";
import { getProduct, products } from "@/data/products";
import { messages, useI18n } from "@/i18n";
import { localeFromPath, withLocale } from "@/i18n/locale";
import { absoluteUrl, breadcrumbLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/collections/$category/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product || product.category !== params.category) throw notFound();
    return product;
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
    const cat = getCategory(p.category);
    const craft = getCraft(p.craft);
    return seo({
      pathname: match.pathname,
      title: `${p.name[locale]} — ${p.origin[locale]}`,
      description: p.short,
      image: p.images[0]?.src,
      type: "product",
      jsonLd: [
        {
          "@type": "Product",
          name: p.name[locale],
          description: p.story[locale],
          image: p.images.map((m) => absoluteUrl(m.src)),
          sku: p.slug,
          brand: { "@type": "Brand", name: site.name },
          category: cat?.name[locale],
          material: p.specs.material[locale],
          countryOfOrigin: "MA",
          additionalProperty: craft
            ? [{ "@type": "PropertyValue", name: t.collections.craft, value: craft.name[locale] }]
            : undefined,
          url: absoluteUrl(withLocale(`/collections/${p.category}/${p.slug}`, locale)),
        },
        breadcrumbLd(locale, [
          [t.nav.collections, "/collections"],
          [cat?.name[locale] ?? p.category, `/collections/${p.category}`],
          [p.name[locale], `/collections/${p.category}/${p.slug}`],
        ]),
      ],
    });
  },
  component: ProductPage,
});

const REASSURANCE = [
  { icon: Hand, label: { fr: "Fait main au Maroc", en: "Handmade in Morocco" } },
  { icon: PencilRuler, label: { fr: "Personnalisable", en: "Customisable" } },
  { icon: PackageCheck, label: { fr: "Emballage renforcé", en: "Reinforced packing" } },
  { icon: Truck, label: { fr: "Livraison Maroc & export", en: "Morocco & worldwide delivery" } },
];

// CONTENU EXEMPLE À REMPLACER — general answers, no prices or exact lead times.
const FAQ = [
  {
    q: { fr: "Comment obtenir le prix de cette pièce ?", en: "How do I get the price of this piece?" },
    a: {
      fr: "Demandez un devis ou écrivez-nous sur WhatsApp : nous vous répondons avec un prix adapté à la quantité, aux finitions et à la livraison.",
      en: "Request a quote or message us on WhatsApp: we reply with a price based on quantity, finishes and delivery.",
    },
  },
  {
    q: { fr: "Puis-je la personnaliser ?", en: "Can I customise it?" },
    a: {
      fr: "Oui : dimensions, couleurs, émaux, motifs ou logo peuvent être adaptés selon la technique. Précisez-le dans votre demande.",
      en: "Yes: sizes, colours, glazes, patterns or a logo can be adapted depending on the technique. Mention it in your request.",
    },
  },
  {
    q: { fr: "Quels sont les délais ?", en: "What are the lead times?" },
    a: {
      fr: "Chaque pièce étant faite à la main, le délai dépend du modèle et de la quantité. Il est confirmé avec votre devis.",
      en: "As every piece is handmade, lead times depend on the model and quantity. They are confirmed with your quote.",
    },
  },
  {
    q: { fr: "Livrez-vous à l'étranger ?", en: "Do you ship abroad?" },
    a: {
      fr: "Oui, nous livrons au Maroc et à l'international, avec un emballage renforcé pièce par pièce.",
      en: "Yes, we deliver across Morocco and worldwide, with reinforced piece-by-piece packing.",
    },
  },
  {
    q: { fr: "Comment l'entretenir ?", en: "How do I care for it?" },
    a: {
      fr: "Nettoyez à la main avec une éponge douce et évitez les chocs thermiques. Les conseils précis selon la matière vous sont transmis avec la commande.",
      en: "Clean by hand with a soft sponge and avoid thermal shocks. Specific advice for the material is shared with your order.",
    },
  },
];

function CopyLink({ url }: { url: string }) {
  const { l } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-safi"
    >
      {done ? <Check className="size-3.5 text-glaze" /> : <Link2 className="size-3.5" />}
      {done ? l({ fr: "Lien copié", en: "Link copied" }) : l({ fr: "Copier le lien", en: "Copy link" })}
    </button>
  );
}

function ProductPage() {
  const p = Route.useLoaderData();
  const { t, l, lp, locale } = useI18n();
  const { open } = useQuote();
  const craft = getCraft(p.craft);
  const cat = getCategory(p.category);
  const url = absoluteUrl(withLocale(`/collections/${p.category}/${p.slug}`, locale));
  const related = [
    ...products.filter((x) => x.slug !== p.slug && x.category === p.category),
    ...products.filter(
      (x) => x.slug !== p.slug && x.category !== p.category && x.craft === p.craft,
    ),
  ].slice(0, 8);
  const specs = (Object.keys(t.product.specLabels) as (keyof typeof p.specs)[]).map(
    (k) => [t.product.specLabels[k], l(p.specs[k])] as const,
  );
  const miniSteps = craft?.steps.slice(0, 4) ?? [];

  return (
    <>
      <section className="container-page pb-20 pt-28 md:pt-36">
        <Breadcrumbs
          items={[
            { label: t.nav.collections, href: "/collections" },
            {
              label: cat ? l(cat.name) : p.category,
              href: `/collections/${p.category}`,
            },
            { label: l(p.name) },
          ]}
        />
        <div className="mt-8 grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <Gallery images={p.images} name={l(p.name)} />
          <div className="md:sticky md:top-28">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-safi px-3 py-1 text-xs font-semibold text-cream">
                {craft ? l(craft.short) : ""} · {l(p.origin)}
              </span>
              {cat && (
                <Link
                  to="/{-$locale}/collections/$category"
                  params={{ ...lp, category: cat.slug }}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink/80 hover:border-ochre"
                >
                  {l(cat.name)}
                </Link>
              )}
              <span className="rounded-full border border-clay/40 px-3 py-1 text-xs font-semibold text-clay-deep">
                {t.common.onRequest}
              </span>
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl">{l(p.name)}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{l(p.story)}</p>

            <div className="mt-7 flex gap-3 rounded-2xl border border-ochre/40 bg-cream p-4 text-sm leading-relaxed">
              <Hand className="mt-0.5 size-5 shrink-0 text-clay" strokeWidth={1.4} aria-hidden />
              <p>{t.product.handmade}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="clay" size="xl" onClick={() => open(`${l(p.name)} (${p.slug})`)}>
                {t.cta.quote} <ArrowRight />
              </Button>
              <Button
                asChild
                size="xl"
                className="rounded-full bg-glaze font-semibold text-cream hover:bg-glaze/90"
              >
                <a
                  href={whatsappLink(t.whatsapp.product(l(p.name), url))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="size-4" /> {t.cta.whatsapp}
                </a>
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{t.product.priceNote}</p>
              <CopyLink url={url} />
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {REASSURANCE.map(({ icon: Icon, label }) => (
                <li key={label.fr} className="flex items-center gap-3 bg-cream p-4 text-sm font-medium text-safi">
                  <Icon className="size-5 shrink-0 text-clay" strokeWidth={1.4} aria-hidden />
                  {l(label)}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-clay-deep">
              {t.product.specs}
            </h2>
            <dl className="mt-3 border-t border-border">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[9rem_1fr] gap-4 border-b border-border py-3.5 text-sm sm:grid-cols-[11rem_1fr]"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 rounded-[1.75rem] bg-safi p-6 text-cream">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
                <PencilRuler className="size-4" aria-hidden />
                {l({ fr: "Sur mesure", en: "Made to order" })}
              </p>
              <p className="mt-2 font-display text-2xl">
                {l({
                  fr: "Une autre taille, couleur ou quantité ?",
                  en: "Another size, colour or quantity?",
                })}
              </p>
              <button
                type="button"
                onClick={() => open(`${l(p.name)} (${p.slug}) — ${l({ fr: "personnalisation", en: "customisation" })}`)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cream underline-offset-4 hover:text-ochre hover:underline"
              >
                {l({ fr: "Personnaliser cette pièce", en: "Customise this piece" })}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {craft && (
        <section className="container-page pb-20 md:pb-28">
          <Reveal className="grid overflow-hidden rounded-[2.5rem] border border-border bg-cream md:grid-cols-[1fr_1.2fr]">
            <div className="relative min-h-[16rem] overflow-hidden">
              <Img
                media={craft.image}
                alt=""
                sizes="(min-width: 768px) 40vw, 100vw"
                className="absolute inset-0 size-full"
              />
            </div>
            <div className="relative p-8 md:p-12">
              <Rosette
                className="pointer-events-none absolute -right-10 -top-10 size-44 text-clay opacity-10"
                strokeWidth={0.8}
              />
              <p className="eyebrow">{l({ fr: "Le savoir-faire", en: "The craft" })}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">
                {l(craft.name)} · <span className="text-clay">{l(craft.city)}</span>
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{l(craft.intro)}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {craft.materials.map((m) => (
                  <li key={m.fr} className="rounded-full border border-safi/15 bg-sand px-3 py-1 text-xs text-safi">
                    {l(m)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
      )}

      {craft && miniSteps.length > 0 && (
        <section className="bg-cream py-16 md:py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-4xl">{t.product.fabrication}</h2>
              <Link
                to="/{-$locale}/metiers/$slug"
                params={{ ...lp, slug: craft.slug }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-safi hover:text-clay-deep"
              >
                {l(craft.name)} <ArrowRight className="size-4" />
              </Link>
            </div>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {miniSteps.map((s, i) => (
                <Reveal as="li" key={s.title.fr} delay={i * 0.08} className="flex gap-4">
                  <Img
                    media={s.image}
                    alt=""
                    sizes="96px"
                    className="size-20 shrink-0 rounded-2xl"
                    focus={s.focus}
                  />
                  <div>
                    <p className="font-display text-2xl text-clay">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-xl">{l(s.title)}</h3>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="container-page grid gap-10 py-20 md:grid-cols-[1fr_1.5fr] md:gap-20 md:py-24">
        <Reveal>
          <p className="eyebrow">{l({ fr: "Questions fréquentes", en: "FAQ" })}</p>
          <h2 className="mt-4 text-4xl md:text-5xl">
            {l({ fr: "Tout savoir avant de commander", en: "Good to know before ordering" })}
          </h2>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-glaze" aria-hidden />
            {l({ fr: "Une question précise ? Écrivez-nous.", en: "A specific question? Message us." })}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="divide-y divide-border border-y border-border">
          {FAQ.map((f) => (
            <details key={f.q.fr} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-safi md:text-2xl [&::-webkit-details-marker]:hidden">
                {l(f.q)}
                <Plus className="size-5 shrink-0 text-clay transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 pr-8 leading-relaxed text-muted-foreground">{l(f.a)}</p>
            </details>
          ))}
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="container-page border-t border-border py-20 md:py-24">
          <Carousel opts={{ align: "start" }} aria-label={t.product.related}>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-4xl md:text-5xl">{t.product.related}</h2>
              <div className="flex gap-2">
                <CarouselPrevious
                  className="static size-11 translate-y-0 rounded-full border-safi/30 text-safi"
                  aria-label={t.a11y.previous}
                />
                <CarouselNext
                  className="static size-11 translate-y-0 rounded-full border-safi/30 text-safi"
                  aria-label={t.a11y.next}
                />
              </div>
            </div>
            <CarouselContent className="mt-10 -ml-4 md:-ml-6">
              {related.map((x) => (
                <CarouselItem
                  key={x.slug}
                  className="basis-[70%] pl-4 sm:basis-1/2 md:basis-1/3 md:pl-6 lg:basis-1/4"
                >
                  <ProductCard p={x} sizes="(min-width: 1024px) 25vw, 70vw" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      )}

      {/* Mobile sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-sand/95 p-3 backdrop-blur-md md:hidden">
        <div className="flex gap-2">
          <Button
            variant="clay"
            className="h-12 flex-1 rounded-full"
            onClick={() => open(`${l(p.name)} (${p.slug})`)}
          >
            {t.cta.quote}
          </Button>
          <Button asChild className="h-12 rounded-full bg-glaze px-5 text-cream hover:bg-glaze/90">
            <a
              href={whatsappLink(t.whatsapp.product(l(p.name), url))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.cta.whatsapp}
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </Button>
        </div>
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}