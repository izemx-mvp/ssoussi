import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Building2,
  ClipboardCheck,
  Globe2,
  Hotel,
  MessagesSquare,
  Package,
  PenTool,
  Ruler,
  Ship,
  Store,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";

import { Img } from "@/components/brand/Img";
import { MotifWatermark, Rosette } from "@/components/brand/Motif";
import { B2BForm } from "@/components/site/B2BForm";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { WhatsAppIcon } from "@/components/site/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { media, type Media } from "@/config/media";
import { whatsappLink } from "@/config/site";
import { messages, useI18n } from "@/i18n";
import { localeFromPath, type L } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/professionnels")({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    return seo({
      pathname: match.pathname,
      title: t.nav.pro,
      description: t.pro.intro,
      jsonLd: [
        breadcrumbLd(locale, [[t.nav.pro, "/professionnels"]]),
        {
          "@type": "FAQPage",
          mainEntity: t.pro.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    });
  },
  component: Professionnels,
});

const SERVICE_ICONS = [Ruler, PenTool, Boxes, Globe2, Package];

// CONTENU EXEMPLE À VALIDER — typical applications per audience (no client references).
const AUDIENCES: {
  key: string;
  icon: typeof Hotel;
  name: L;
  text: L;
  uses: L[];
  image: Media;
}[] = [
  {
    key: "hotels",
    icon: Hotel,
    name: { fr: "Hôtels & riads", en: "Hotels & riads" },
    text: {
      fr: "Une identité marocaine authentique, de la réception aux chambres et au spa.",
      en: "An authentic Moroccan identity, from the lobby to the rooms and spa.",
    },
    uses: [
      { fr: "Vasques et salles de bain en tadelakt", en: "Tadelakt basins and bathrooms" },
      { fr: "Zellige pour patios, fontaines et piscines", en: "Zellige for patios, fountains and pools" },
      { fr: "Luminaires en cuivre et laiton", en: "Copper and brass lighting" },
      { fr: "Tapis et textiles des chambres", en: "Rugs and textiles for rooms" },
    ],
    image: media.riad,
  },
  {
    key: "restaurants",
    icon: UtensilsCrossed,
    name: { fr: "Restaurants & cafés", en: "Restaurants & cafés" },
    text: {
      fr: "Une vaisselle qui raconte votre cuisine, personnalisable à vos couleurs.",
      en: "Tableware that tells the story of your cuisine, customisable in your colours.",
    },
    uses: [
      { fr: "Assiettes, bols et plats de service", en: "Plates, bowls and serving dishes" },
      { fr: "Tajines de présentation", en: "Presentation tagines" },
      { fr: "Logo ou monogramme sur la vaisselle", en: "Logo or monogram on tableware" },
      { fr: "Réassorts réguliers", en: "Regular restocking" },
    ],
    image: media.tableware,
  },
  {
    key: "architectes",
    icon: Building2,
    name: { fr: "Architectes & décorateurs", en: "Architects & designers" },
    text: {
      fr: "Des matières et des savoir-faire au service de vos plans, du prototype à la pose.",
      en: "Materials and crafts serving your plans, from prototype to installation.",
    },
    uses: [
      { fr: "Revêtements zellige sur plan", en: "Zellige cladding to plan" },
      { fr: "Pièces uniques et grands formats", en: "One-off and large-format pieces" },
      { fr: "Échantillons de couleurs et d'émaux", en: "Colour and glaze samples" },
      { fr: "Mobilier et objets en thuya", en: "Thuya furniture and objects" },
    ],
    image: media.craftZellige,
  },
  {
    key: "boutiques",
    icon: Store,
    name: { fr: "Concept stores & revendeurs", en: "Concept stores & retailers" },
    text: {
      fr: "Des collections artisanales sélectionnées, avec un récit à transmettre à vos clients.",
      en: "Curated handmade collections, with a story to pass on to your customers.",
    },
    uses: [
      { fr: "Sélections de pièces par univers", en: "Curated selections by collection" },
      { fr: "Séries limitées et exclusivités", en: "Limited runs and exclusives" },
      { fr: "Visuels et textes sur les métiers", en: "Visuals and texts about the crafts" },
      { fr: "Réassorts selon vos ventes", en: "Restocking based on your sales" },
    ],
    image: media.heroVase,
  },
  {
    key: "export",
    icon: Ship,
    name: { fr: "Importateurs & export", en: "Importers & export" },
    text: {
      fr: "Un interlocuteur au Maroc pour sourcer, contrôler et expédier vos commandes.",
      en: "One contact in Morocco to source, check and ship your orders.",
    },
    uses: [
      { fr: "Sourcing auprès de plusieurs ateliers", en: "Sourcing across several workshops" },
      { fr: "Contrôle qualité avant expédition", en: "Quality check before shipping" },
      { fr: "Emballage adapté à l'export", en: "Export-ready packing" },
      { fr: "Accompagnement logistique", en: "Logistics support" },
    ],
    image: media.craftPoterie,
  },
];

// CONTENU EXEMPLE À VALIDER — commitments for professional clients.
const GUARANTEES: { icon: typeof UserRound; title: L; text: L }[] = [
  {
    icon: UserRound,
    title: { fr: "Un interlocuteur dédié", en: "A dedicated contact" },
    text: {
      fr: "Une seule personne suit votre projet, du brief à la livraison.",
      en: "One person follows your project, from brief to delivery.",
    },
  },
  {
    icon: PenTool,
    title: { fr: "Prototype avant production", en: "Prototype before production" },
    text: {
      fr: "Validez forme, couleur et finition sur échantillon avant de lancer la série.",
      en: "Approve shape, colour and finish on a sample before the run starts.",
    },
  },
  {
    icon: ClipboardCheck,
    title: { fr: "Contrôle pièce par pièce", en: "Piece-by-piece checks" },
    text: {
      fr: "Chaque pièce est vérifiée avant emballage, dans le respect du fait main.",
      en: "Every piece is checked before packing, respecting its handmade nature.",
    },
  },
  {
    icon: MessagesSquare,
    title: { fr: "Suivi transparent", en: "Transparent follow-up" },
    text: {
      fr: "Points d'étape réguliers et photos de l'avancement en atelier.",
      en: "Regular updates and photos of progress in the workshop.",
    },
  },
];

/* ------------------------------------------------------------------ */

function Audiences() {
  const { l } = useI18n();
  const [key, setKey] = useState(AUDIENCES[0]!.key);
  const a = AUDIENCES.find((x) => x.key === key)!;

  return (
    <section className="relative overflow-hidden border-t border-border bg-cream py-20 md:py-28">
      <MotifWatermark className="-right-52 -top-10 size-[34rem] text-safi" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={l({ fr: "Pour qui", en: "Who we work with" })}
          title={l({ fr: "Des solutions selon votre métier", en: "Solutions for your business" })}
        />

        <div
          role="tablist"
          aria-label={l({ fr: "Type de client", en: "Client type" })}
          className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          {AUDIENCES.map((x) => {
            const on = x.key === key;
            const Icon = x.icon;
            return (
              <button
                key={x.key}
                role="tab"
                aria-selected={on}
                aria-controls="audience-panel"
                onClick={() => setKey(x.key)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                  on ? "border-safi text-cream" : "border-safi/20 bg-sand/60 text-safi hover:border-safi",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="audience-pill"
                    className="absolute inset-0 rounded-full bg-safi"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative size-4" strokeWidth={1.6} aria-hidden />
                <span className="relative">{l(x.name)}</span>
              </button>
            );
          })}
        </div>

        <div id="audience-panel" role="tabpanel" className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={a.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16"
            >
              <div className="mask-organic overflow-hidden">
                <Img
                  media={a.image}
                  alt=""
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="aspect-[4/3] w-full md:aspect-[5/4]"
                />
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl">{l(a.name)}</h3>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{l(a.text)}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {a.uses.map((u, i) => (
                    <li
                      key={u.fr}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-sand p-4 text-sm font-medium text-safi"
                    >
                      <span className="font-display text-lg leading-none text-clay">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {l(u)}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="clay" className="mt-8">
                  <a href="#brief">
                    {l({ fr: "Parler de mon projet", en: "Discuss my project" })} <ArrowRight />
                  </a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const { t } = useI18n();
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading eyebrow={t.pro.servicesEyebrow} title={t.pro.servicesTitle} />
      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {t.pro.services.map((s, i) => {
          const Icon = SERVICE_ICONS[i] ?? Package;
          const big = i < 2;
          return (
            <StaggerItem key={s.title} className={cn(big ? "lg:col-span-3" : "lg:col-span-2")}>
              <div
                className={cn(
                  "group relative h-full overflow-hidden rounded-[2rem] border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(42,30,23,0.4)]",
                  i === 0 ? "border-safi bg-safi text-cream" : "border-border bg-cream",
                )}
              >
                <span className="absolute -right-2 -top-6 font-display text-[6.5rem] leading-none text-ochre/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "relative grid size-14 place-items-center rounded-full transition-colors",
                    i === 0 ? "bg-cream/10 text-ochre" : "bg-sand text-clay group-hover:bg-clay group-hover:text-cream",
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.3} aria-hidden />
                </span>
                <h3 className={cn("relative mt-6 text-2xl md:text-3xl", i === 0 && "!text-cream")}>{s.title}</h3>
                <p
                  className={cn(
                    "relative mt-3 text-sm leading-relaxed",
                    i === 0 ? "text-cream/80" : "text-muted-foreground",
                  )}
                >
                  {s.text}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

function Process() {
  const { t } = useI18n();
  return (
    <section className="grain relative overflow-hidden bg-safi py-20 md:py-28">
      <Rosette
        className="pointer-events-none absolute -left-32 bottom-0 size-[28rem] text-cream opacity-[0.05]"
        strokeWidth={0.5}
      />
      <div className="container-page relative">
        <SectionHeading light eyebrow={t.pro.processEyebrow} title={t.pro.processTitle} />
        <ol className="mt-14 grid gap-6 md:grid-cols-4">
          {t.pro.process.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 0.08}
              className="relative rounded-[1.75rem] border border-cream/15 bg-cream/[0.04] p-6 transition-colors hover:border-cream/35"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-full border border-ochre font-display text-2xl text-ochre">
                  {i + 1}
                </span>
                {i < t.pro.process.length - 1 && (
                  <ArrowRight className="hidden size-5 text-cream/30 md:block" aria-hidden />
                )}
              </div>
              <h3 className="mt-6 text-3xl !text-cream">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Guarantees() {
  const { l } = useI18n();
  return (
    <section className="container-page grid items-center gap-12 py-20 md:grid-cols-[1fr_1.3fr] md:gap-20 md:py-28">
      <Reveal className="relative">
        <div className="mask-arch overflow-hidden">
          <Img media={media.kiln} alt="" sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] w-full" />
        </div>
        <span
          lang="ar"
          aria-hidden
          className="font-arabic absolute -bottom-6 -left-2 text-6xl text-ochre/80 md:-left-8 md:text-7xl"
        >
          ثقة
        </span>
      </Reveal>
      <div>
        <Reveal>
          <p className="eyebrow">{l({ fr: "Nos engagements pro", en: "Our trade commitments" })}</p>
          <h2 className="mt-4 text-4xl md:text-5xl">
            {l({ fr: "La souplesse de l'artisanat, ", en: "The flexibility of craft, " })}
            <em className="text-clay">{l({ fr: "la rigueur d'un partenaire", en: "the rigour of a partner" })}</em>
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {GUARANTEES.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title.fr} className="border-t border-border pt-5">
              <Icon className="size-6 text-clay" strokeWidth={1.4} aria-hidden />
              <h3 className="mt-4 text-2xl">{l(title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l(text)}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  return (
    <section className="border-t border-border bg-cream">
      <div className="container-page grid gap-12 py-20 md:grid-cols-[1fr_1.4fr] md:gap-20 md:py-28">
        <SectionHeading eyebrow={t.pro.faqEyebrow} title={t.pro.faqTitle} />
        <Reveal>
          <Accordion type="single" collapsible className="border-t border-border">
            {t.pro.faq.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`} className="border-border">
                <AccordionTrigger className="py-5 text-left font-display text-2xl font-medium text-safi hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function Brief() {
  const { t, l } = useI18n();
  const checklist: L[] = [
    { fr: "Type de pièces et usage", en: "Type of pieces and use" },
    { fr: "Quantités estimées", en: "Estimated quantities" },
    { fr: "Couleurs, dimensions, personnalisation", en: "Colours, sizes, customisation" },
    { fr: "Lieu de livraison et échéance", en: "Delivery location and deadline" },
    { fr: "Plans, photos ou références (si vous en avez)", en: "Plans, photos or references (if any)" },
  ];
  return (
    <section id="brief" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
        <div>
          <SectionHeading eyebrow={t.pro.formEyebrow} title={t.pro.formTitle} text={t.pro.formText} />
          <Reveal className="mt-10 rounded-[2rem] border border-border bg-cream p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">
              {l({ fr: "Pour un devis précis, indiquez :", en: "For an accurate quote, include:" })}
            </p>
            <ul className="mt-4 space-y-3">
              {checklist.map((c) => (
                <li key={c.fr} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-clay" aria-hidden />
                  {l(c)}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-5 flex items-center justify-between gap-4 rounded-[2rem] bg-safi p-6 text-cream">
            <div>
              <p className="font-display text-2xl">{l({ fr: "Plus rapide ?", en: "In a hurry?" })}</p>
              <p className="text-sm text-cream/75">
                {l({ fr: "Écrivez-nous directement sur WhatsApp.", en: "Message us directly on WhatsApp." })}
              </p>
            </div>
            <Button asChild className="shrink-0 rounded-full bg-glaze text-cream hover:bg-glaze/90">
              <a
                href={whatsappLink(
                  l({
                    fr: "Bonjour, je suis un professionnel et j'ai un projet.",
                    en: "Hello, I'm a professional and I have a project.",
                  }),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </Button>
          </Reveal>
        </div>
        <Reveal className="rounded-[2.5rem] border border-border bg-cream p-6 shadow-[0_30px_70px_-45px_rgba(42,30,23,0.45)] md:p-10">
          <B2BForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Professionnels() {
  const { t, l } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t.pro.eyebrow}
        title={t.pro.title}
        intro={t.pro.intro}
        crumbs={[{ label: t.nav.pro }]}
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {t.pro.audiences.map((a) => (
            <li
              key={a}
              className="rounded-full border border-safi/25 bg-cream px-4 py-2 text-sm font-medium text-safi"
            >
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="clay" size="xl">
            <a href="#brief">
              {t.cta.quote} <ArrowRight />
            </a>
          </Button>
          <Button asChild variant="line" size="xl">
            <a
              href={whatsappLink(l({ fr: "Bonjour, j'ai un projet professionnel.", en: "Hello, I have a trade project." }))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          </Button>
        </div>
      </PageHero>

      <div className="container-page">
        <Reveal className="relative">
          <div className="mask-bowl overflow-hidden">
            <Img media={media.riad} priority sizes="100vw" className="aspect-[16/10] w-full md:aspect-[21/8]" />
          </div>
          <div className="absolute bottom-5 left-5 hidden flex-wrap gap-2 md:flex">
            {[
              { fr: "Sur mesure", en: "Made to order" },
              { fr: "Petites & grandes séries", en: "Small & large runs" },
              { fr: "Export", en: "Export" },
            ].map((x) => (
              <span
                key={x.fr}
                className="rounded-full bg-cream/90 px-4 py-2 text-sm font-semibold text-safi backdrop-blur"
              >
                {l(x)}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Services />
      <Audiences />
      <Process />
      <Guarantees />
      <Faq />
      <Brief />
    </>
  );
}