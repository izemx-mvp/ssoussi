import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Clock,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Plus,
  ShieldCheck,
  Ship,
  Store,
  UserRound,
} from "lucide-react";

import { Rosette } from "@/components/brand/Motif";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal, Stagger, StaggerItem } from "@/components/site/FadeUp";
import { MapEmbed } from "@/components/site/MapEmbed";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { WhatsAppIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { site, whatsappLink } from "@/config/site";
import { messages, useI18n } from "@/i18n";
import { localeFromPath, type L } from "@/i18n/locale";
import { breadcrumbLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/contact")({
  head: ({ match }) => {
    const locale = localeFromPath(match.pathname);
    const t = messages[locale];
    return seo({
      pathname: match.pathname,
      title: t.nav.contact,
      description: t.contact.intro,
      jsonLd: [breadcrumbLd(locale, [[t.nav.contact, "/contact"]])],
    });
  },
  component: Contact,
});

// CONTENU EXEMPLE À VALIDER — general answers, no prices or exact delays.
const FAQ: { q: L; a: L }[] = [
  {
    q: { fr: "Puis-je commander directement en ligne ?", en: "Can I order directly online?" },
    a: {
      fr: "Chaque pièce étant faite main, nous travaillons sur devis. Envoyez-nous votre demande : nous revenons vers vous avec prix, délais et livraison.",
      en: "As every piece is handmade, we work on quotes. Send us your request and we'll come back with price, lead time and delivery.",
    },
  },
  {
    q: { fr: "Livrez-vous hors du Maroc ?", en: "Do you deliver outside Morocco?" },
    a: {
      fr: "Oui, nous expédions au Maroc et à l'international avec un emballage renforcé.",
      en: "Yes, we ship across Morocco and worldwide with reinforced packing.",
    },
  },
  {
    q: { fr: "Peut-on visiter l'atelier ?", en: "Can I visit the workshop?" },
    a: {
      fr: "Oui, sur rendez-vous. Choisissez « Visite atelier » dans le formulaire ou écrivez-nous sur WhatsApp.",
      en: "Yes, by appointment. Choose “Workshop visit” in the form or message us on WhatsApp.",
    },
  },
];

function Channels() {
  const { t, l } = useI18n();
  const items = [
    {
      icon: WhatsAppIcon,
      title: "WhatsApp",
      value: l({ fr: "La réponse la plus rapide", en: "The fastest reply" }),
      href: whatsappLink(t.whatsapp.default),
      external: true,
      tone: "bg-glaze text-cream border-glaze",
    },
    {
      icon: Phone,
      title: l({ fr: "Téléphone", en: "Phone" }),
      value: site.phone,
      href: `tel:${site.phone.replace(/\s/g, "")}`,
      tone: "bg-cream border-border",
    },
    {
      icon: Mail,
      title: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      tone: "bg-cream border-border",
    },
    {
      icon: MapPin,
      title: l({ fr: "L'atelier", en: "The workshop" }),
      value: l(site.address.full),
      href: "#carte",
      tone: "bg-cream border-border",
    },
  ];
  return (
    <Stagger className="container-page grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, value, href, external, tone }) => {
        const dark = tone.includes("text-cream");
        return (
          <StaggerItem key={title}>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={cn(
                "group flex h-full flex-col justify-between gap-8 rounded-[1.75rem] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(42,30,23,0.4)]",
                tone,
              )}
            >
              <span className="flex items-start justify-between">
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-full",
                    dark ? "bg-cream/15" : "bg-sand text-clay",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <ArrowUpRight
                  className={cn(
                    "size-5 transition-transform duration-300 group-hover:rotate-45",
                    dark ? "text-cream/70" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
              </span>
              <span>
                <span className={cn("block font-display text-2xl", dark ? "text-cream" : "text-safi")}>
                  {title}
                </span>
                <span className={cn("mt-1 block break-words text-sm", dark ? "text-cream/80" : "text-muted-foreground")}>
                  {value}
                </span>
              </span>
            </a>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

function Intents() {
  const { l, lp } = useI18n();
  const items = [
    { icon: UserRound, label: { fr: "Particulier", en: "Individual" }, to: "form" as const },
    { icon: Building2, label: { fr: "Hôtel, riad, restaurant", en: "Hotel, riad, restaurant" }, to: "pro" as const },
    { icon: Store, label: { fr: "Revendeur", en: "Retailer" }, to: "pro" as const },
    { icon: Ship, label: { fr: "Export", en: "Export" }, to: "pro" as const },
    { icon: Newspaper, label: { fr: "Presse & partenariats", en: "Press & partnerships" }, to: "form" as const },
  ];
  const cls =
    "inline-flex items-center gap-2 rounded-full border border-safi/20 bg-cream px-4 py-2 text-sm font-medium text-safi transition-colors hover:border-safi hover:bg-safi hover:text-cream";
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {l({ fr: "Vous êtes…", en: "You are…" })}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map(({ icon: Icon, label, to }) => (
          <li key={label.fr}>
            {to === "pro" ? (
              <Link to="/{-$locale}/professionnels" params={lp} hash="brief" className={cls}>
                <Icon className="size-4" strokeWidth={1.6} aria-hidden /> {l(label)}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            ) : (
              <a href="#formulaire" className={cls}>
                <Icon className="size-4" strokeWidth={1.6} aria-hidden /> {l(label)}
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        {l({
          fr: "Les demandes professionnelles ont leur formulaire dédié, plus complet.",
          en: "Trade enquiries have their own, more detailed form.",
        })}
      </p>
    </div>
  );
}

function InfoPanel() {
  const { t, l } = useI18n();
  return (
    <div className="grain relative overflow-hidden rounded-[2rem] bg-safi p-7 text-cream md:p-9">
      <Rosette
        className="pointer-events-none absolute -right-14 -top-14 size-52 text-cream opacity-10"
        strokeWidth={0.6}
      />
      <h2 className="relative text-3xl !text-cream">{t.contact.infoTitle}</h2>
      <ul className="relative mt-6 space-y-4 text-[0.95rem]">
        <li className="flex gap-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-ochre" aria-hidden />
          <span className="text-cream/90">{l(site.address.full)}</span>
        </li>
        <li>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex gap-3 text-cream/90 hover:text-ochre">
            <Phone className="mt-0.5 size-5 shrink-0 text-ochre" aria-hidden />
            {site.phone}
          </a>
        </li>
        <li>
          <a href={`mailto:${site.email}`} className="flex gap-3 break-all text-cream/90 hover:text-ochre">
            <Mail className="mt-0.5 size-5 shrink-0 text-ochre" aria-hidden />
            {site.email}
          </a>
        </li>
      </ul>

      <h3 className="relative mt-8 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
        <Clock className="size-4" aria-hidden /> {t.contact.hours}
      </h3>
      <dl className="relative mt-3 divide-y divide-cream/15 border-y border-cream/15 text-sm">
        {site.hours.map((h) => (
          <div key={h.days.fr} className="flex justify-between gap-4 py-3">
            <dt className="text-cream/70">{l(h.days)}</dt>
            <dd className="text-cream">{typeof h.time === "string" ? h.time : l(h.time)}</dd>
          </div>
        ))}
      </dl>

      <Button
        asChild
        size="xl"
        className="relative mt-8 w-full rounded-full bg-glaze font-semibold text-cream hover:bg-glaze/90"
      >
        <a href={whatsappLink(t.whatsapp.default)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon className="size-4" /> {t.cta.whatsappLong}
        </a>
      </Button>
    </div>
  );
}

function Faq() {
  const { l } = useI18n();
  return (
    <section className="border-t border-border bg-cream">
      <div className="container-page grid gap-10 py-20 md:grid-cols-[1fr_1.5fr] md:gap-20 md:py-24">
        <SectionHeading
          eyebrow={l({ fr: "Avant d'écrire", en: "Before you write" })}
          title={l({ fr: "Questions fréquentes", en: "Frequently asked" })}
        />
        <Reveal className="divide-y divide-border border-y border-border">
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
      </div>
    </section>
  );
}

function Contact() {
  const { t, l } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        intro={t.contact.intro}
        crumbs={[{ label: t.nav.contact }]}
        arabic="تواصل"
      />

      <Channels />

      <section
        id="formulaire"
        className="container-page grid scroll-mt-24 gap-10 pb-24 lg:grid-cols-[1.4fr_1fr] lg:gap-14"
      >
        <Reveal className="rounded-[2.5rem] border border-border bg-cream p-6 shadow-[0_30px_70px_-45px_rgba(42,30,23,0.45)] md:p-10">
          <p className="eyebrow">{l({ fr: "Écrivez-nous", en: "Write to us" })}</p>
          <h2 className="mt-3 text-4xl md:text-5xl">
            {l({ fr: "Parlons de ", en: "Let's talk about " })}
            <em className="text-clay">{l({ fr: "votre projet", en: "your project" })}</em>
          </h2>
          <div className="mt-8">
            <Intents />
            <ContactForm />
          </div>
          <p className="mt-6 flex items-start gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-glaze" aria-hidden />
            {l({
              fr: "Vos informations servent uniquement à répondre à votre demande. Nous répondons en français ou en anglais.",
              en: "Your details are only used to answer your request. We reply in French or English.",
            })}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
          <InfoPanel />
        </Reveal>
      </section>

      <section id="carte" className="relative scroll-mt-24">
        <MapEmbed title={t.contact.mapTitle} className="h-[26rem] w-full md:h-[32rem]" />
        <div className="container-page pointer-events-none absolute inset-x-0 bottom-6 md:bottom-10">
          <Reveal className="pointer-events-auto max-w-sm rounded-[1.75rem] bg-cream p-6 shadow-[0_30px_60px_-30px_rgba(42,30,23,0.5)]">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-clay">
              <MapPin className="size-4" aria-hidden /> {l({ fr: "Nous trouver", en: "Find us" })}
            </p>
            <p className="mt-2 font-display text-2xl text-safi">{l(site.address.full)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {l({ fr: "Visites de l'atelier sur rendez-vous.", en: "Workshop visits by appointment." })}
            </p>
          </Reveal>
        </div>
      </section>

      <Faq />
    </>
  );
}