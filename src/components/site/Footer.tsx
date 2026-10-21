import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Img } from "@/components/brand/Img";
import { MotifBorder, Rosette } from "@/components/brand/Motif";
import { legalNav, mainNav } from "@/config/nav";
import { site, whatsappLink } from "@/config/site";
import { categories } from "@/data/categories";
import { crafts } from "@/data/crafts";
import { useI18n } from "@/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { LogoStacked } from "./Logo";
import { PinterestIcon, WhatsAppIcon } from "./icons";

const heading = "font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre";
const linkCls =
  "group inline-flex items-center gap-1.5 text-cream/75 transition-colors duration-200 hover:text-cream";

function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  // Front-end only for now: no newsletter provider is connected yet.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(t.footer.invalidEmail);
      return;
    }
    setEmail("");
    toast.success(t.footer.subscribed);
  };
  return (
    <form onSubmit={onSubmit} className="relative mt-6 flex w-full max-w-md items-center" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        {t.footer.emailPlaceholder}
      </label>
      <input
        id="newsletter-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.footer.emailPlaceholder}
        className="h-14 w-full rounded-full border border-cream/25 bg-cream/5 pl-6 pr-36 text-sm text-cream placeholder:text-cream/50 focus-visible:border-cream focus-visible:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1.5 inline-flex h-11 items-center gap-2 rounded-full bg-cream px-5 text-sm font-semibold text-safi transition-colors hover:bg-ochre hover:text-cream"
      >
        {t.footer.subscribe} <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

export function Footer() {
  const { t, l, lp } = useI18n();
  const socials = [
    { href: site.socials.instagram, label: "Instagram", Icon: Instagram },
    { href: site.socials.facebook, label: "Facebook", Icon: Facebook },
    { href: site.socials.pinterest, label: "Pinterest", Icon: PinterestIcon },
    { href: site.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  ];

  return (
    <footer className="relative overflow-hidden bg-safi text-cream/80">
      <MotifBorder className="text-cream/25" />
      <Rosette
        className="pointer-events-none absolute -right-40 top-20 size-[34rem] text-cream opacity-[0.04]"
        strokeWidth={0.5}
      />

      {/* 1 — Statement + newsletter */}
      <div className="container-page relative grid gap-10 border-b border-cream/10 py-16 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p className={heading}>
            <span lang="ar" className="font-arabic mr-2 text-base normal-case tracking-normal">
              صنع يدوي
            </span>
            {l({ fr: "Fait main au Maroc", en: "Handmade in Morocco" })}
          </p>
          <p className="mt-5 font-display text-4xl leading-[1.05] text-cream md:text-6xl">
            {l({ fr: "La main, la terre, ", en: "The hand, the clay, " })}
            <em className="text-ochre">{l({ fr: "le feu.", en: "the fire." })}</em>
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-cream">{t.footer.newsletter}</h2>
          <p className="mt-2 max-w-md text-sm">{t.footer.newsletterText}</p>
          <Newsletter />
        </div>
      </div>

      {/* 2 — Columns */}
      <div className="container-page relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr] lg:gap-10">
        {/* Brand + contact */}
        <div className="space-y-7">
          <LogoStacked light className="w-36" />
          <p className="max-w-xs text-sm leading-relaxed">{l(site.mission)}</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ochre" aria-hidden />
              <span>{l(site.address.full)}</span>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex gap-3 transition-colors hover:text-cream">
                <Phone className="mt-0.5 size-4 shrink-0 text-ochre" aria-hidden />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 break-all transition-colors hover:text-cream">
                <Mail className="mt-0.5 size-4 shrink-0 text-ochre" aria-hidden />
                {site.email}
              </a>
            </li>
            {site.hours[0] && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-ochre" aria-hidden />
                <span>
                  {l(site.hours[0].days)} ·{" "}
                  {typeof site.hours[0].time === "string" ? site.hours[0].time : l(site.hours[0].time)}
                </span>
              </li>
            )}
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={whatsappLink(t.whatsapp.default)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-glaze px-4 text-sm font-semibold text-cream transition-colors hover:bg-glaze/90"
            >
              <WhatsAppIcon className="size-4" /> {t.cta.whatsapp}
            </a>
            <h2 className="sr-only">{t.footer.follow}</h2>
            <ul className="flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-cream/20 transition-all hover:-translate-y-0.5 hover:border-cream hover:bg-cream hover:text-safi"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h2 className={heading}>{t.footer.navigation}</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {mainNav.map((n) => (
              <li key={n.key}>
                <Link to={n.to} params={lp} className={linkCls}>
                  <span className="h-px w-0 bg-ochre transition-all duration-300 group-hover:w-3" aria-hidden />
                  {t.nav[n.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div>
          <h2 className={heading}>{t.footer.collections}</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {categories.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link to="/{-$locale}/collections/$category" params={{ ...lp, category: c.slug }} className={linkCls}>
                  <span className="h-px w-0 bg-ochre transition-all duration-300 group-hover:w-3" aria-hidden />
                  {l(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Crafts */}
        <div>
          <h2 className={heading}>{t.nav.crafts}</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {crafts.map((c) => (
              <li key={c.slug}>
                <Link to="/{-$locale}/metiers/$slug" params={{ ...lp, slug: c.slug }} className={linkCls}>
                  <span className="h-px w-0 bg-ochre transition-all duration-300 group-hover:w-3" aria-hidden />
                  {l(c.short)}
                  <span className="text-cream/40">· {l(c.city)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3 — Craft strip */}
      <div className="container-page relative">
        <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0">
          {crafts.slice(0, 7).map((c) => (
            <li key={c.slug} className="w-36 shrink-0 lg:w-auto">
              <Link
                to="/{-$locale}/metiers/$slug"
                params={{ ...lp, slug: c.slug }}
                className="group relative block aspect-square overflow-hidden rounded-[1.25rem]"
              >
                <Img
                  media={c.image}
                  alt=""
                  sizes="(min-width: 1024px) 14vw, 144px"
                  className="size-full opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-safi-deep/90 via-safi-deep/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                  <span className="font-display text-lg leading-none text-cream">{l(c.short)}</span>
                  <ArrowUpRight className="size-4 text-cream/70 transition-transform group-hover:rotate-45" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 4 — Giant wordmark */}
      <div aria-hidden className="pointer-events-none relative mt-10 select-none overflow-hidden">
        <p className="translate-y-[22%] whitespace-nowrap text-center font-display text-[21vw] leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(253,247,237,0.16)]">
          {site.wordmark}
        </p>
      </div>

      {/* 5 — Bottom bar */}
      <div className="relative border-t border-cream/15 bg-safi-deep/40">
        <div className="container-page flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-cream/70">
            © {new Date().getFullYear()} {site.wordmark} — {l(site.tagline)}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            {legalNav.map((n) => (
              <Link key={n.key} to={n.to} params={lp} className="text-cream/70 transition-colors hover:text-cream">
                {t.nav[n.key]}
              </Link>
            ))}
            <LanguageSwitch tone="light" />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label={l({ fr: "Haut de page", en: "Back to top" })}
              className="grid size-9 place-items-center rounded-full border border-cream/25 transition-all hover:-translate-y-0.5 hover:bg-cream hover:text-safi"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}