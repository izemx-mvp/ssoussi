import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Img } from "@/components/brand/Img";
import { Rosette } from "@/components/brand/Motif";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/config/nav";
import { site, whatsappLink } from "@/config/site";
import { categories } from "@/data/categories";
import { crafts } from "@/data/crafts";
import { products } from "@/data/products";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";
import { LanguageSwitch } from "./LanguageSwitch";
import { LogoCompact } from "./Logo";
import { useQuote } from "./QuoteDialog";

/*
 * Desktop nav is kept short so labels never wrap:
 *  - "Métiers & régions" lives inside the "Savoir-faire" mega-menu
 *  - "Accueil" is the logo
 * The mobile menu still lists every page.
 */
type Mega = "craft" | "collections" | null;
const MEGA = new Set<string>(["craft", "collections"]);
const HIDDEN_ON_DESKTOP = new Set<string>(["home", "crafts"]);

function MegaPanel({ kind, onClose }: { kind: Exclude<Mega, null>; onClose: () => void }) {
  const { t, l, lp } = useI18n();
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -10 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute inset-x-0 top-full hidden border-t border-border bg-sand/95 shadow-[0_40px_70px_-45px_rgba(42,30,23,0.55)] backdrop-blur-xl xl:block"
    >
      <div className="container-page grid gap-8 py-8 xl:grid-cols-[15rem_1fr_17rem]">
        {/* Intro column */}
        <div className="border-r border-border pr-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
            {kind === "craft" ? t.nav.craft : t.nav.collections}
          </p>
          <p className="mt-3 font-display text-3xl leading-tight text-safi">
            {kind === "craft"
              ? l({ fr: "Le geste, de la terre au feu", en: "The gesture, from clay to fire" })
              : l({ fr: "Des pièces uniques, sur devis", en: "One-of-a-kind pieces, on quote" })}
          </p>
          <Link
            to={kind === "craft" ? "/{-$locale}/savoir-faire" : "/{-$locale}/collections"}
            params={lp}
            onClick={onClose}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-safi hover:text-clay"
          >
            {kind === "craft"
              ? l({ fr: "Découvrir le savoir-faire", en: "Discover our craft" })
              : l({ fr: "Voir toutes les pièces", en: "See every piece" })}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Items */}
        <ul className="grid grid-cols-3 content-start gap-x-4 gap-y-2 2xl:grid-cols-4">
          {kind === "craft"
            ? crafts.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/{-$locale}/metiers/$slug"
                    params={{ ...lp, slug: c.slug }}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-cream"
                  >
                    <span className="size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                      <Img media={c.image} alt="" sizes="48px" className="size-full transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-lg leading-tight text-safi">{l(c.short)}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" aria-hidden /> {l(c.city)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))
            : categories.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/{-$locale}/collections/$category"
                    params={{ ...lp, category: c.slug }}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-cream"
                  >
                    <span className="size-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
                      <Img media={c.image} alt="" sizes="48px" className="size-full transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-lg leading-tight text-safi">{l(c.name)}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.common.pieces(products.filter((p) => p.category === c.slug).length)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
        </ul>

        {/* Feature card */}
        <Link
          to={kind === "craft" ? "/{-$locale}/metiers" : "/{-$locale}/professionnels"}
          params={lp}
          onClick={onClose}
          className="grain group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] bg-safi p-6 text-cream"
        >
          <Rosette
            className="pointer-events-none absolute -right-10 -top-10 size-40 text-cream opacity-10 transition-transform duration-700 group-hover:rotate-45"
            strokeWidth={0.7}
          />
          <span className="relative text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
            {kind === "craft" ? t.nav.crafts : t.nav.pro}
          </span>
          <span className="relative mt-8 block font-display text-2xl leading-tight">
            {kind === "craft"
              ? l({ fr: "La carte des métiers du Maroc", en: "The map of Moroccan crafts" })
              : l({ fr: "Hôtels, riads, revendeurs : sur mesure", en: "Hotels, riads, retailers: made to order" })}
          </span>
          <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold">
            {t.cta.seeAll}
            <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

export function Header() {
  const { t, l, lp } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<Mega>(null);
  const { open: openQuote } = useQuote();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      menuButton.current?.focus();
    };
  }, [open]);
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  const show = (k: Mega) => {
    window.clearTimeout(timer.current);
    setMega(k);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMega(null), 160);
  };

  const solid = scrolled || mega !== null;
  const desktopNav = mainNav.filter((n) => !HIDDEN_ON_DESKTOP.has(n.key));

  return (
    <header
      onMouseLeave={hide}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        solid
          ? "bg-sand/85 shadow-[0_1px_0_0_var(--border)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-safi focus:px-4 focus:py-2 focus:text-cream"
      >
        {t.a11y.skip}
      </a>

      <div
        className={cn(
          "container-page flex items-center justify-between gap-6 transition-[height] duration-500",
          scrolled ? "h-[4.5rem]" : "h-20 md:h-24",
        )}
      >
        <Link to="/{-$locale}" params={lp} aria-label={t.a11y.home} className="shrink-0 rounded-md">
          <LogoCompact />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden min-w-0 flex-1 justify-center xl:flex" aria-label={t.a11y.mainNav}>
          <ul className="flex items-center rounded-full border border-transparent p-1 transition-colors">
            {desktopNav.map((n) => {
              const hasMega = MEGA.has(n.key);
              const isOpen = mega === n.key;
              return (
                <li
                  key={n.key}
                  onMouseEnter={() => (hasMega ? show(n.key as Mega) : hide())}
                  className="relative"
                >
                  <Link
                    to={n.to}
                    params={lp}
                    onFocus={() => (hasMega ? show(n.key as Mega) : setMega(null))}
                    aria-haspopup={hasMega ? "true" : undefined}
                    aria-expanded={hasMega ? isOpen : undefined}
                    className={cn(
                      "relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.875rem] font-medium tracking-[0.01em] text-ink/75 transition-colors hover:text-safi 2xl:px-4",
                      isOpen && "text-safi",
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-full bg-cream shadow-[inset_0_0_0_1px_var(--border)]"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className={cn("relative", isActive && "text-safi")}>{t.nav[n.key]}</span>
                        {hasMega && (
                          <ChevronDown
                            className={cn("relative size-3.5 opacity-60 transition-transform duration-300", isOpen && "rotate-180 opacity-100")}
                            aria-hidden
                          />
                        )}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-clay" aria-hidden />
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2" onMouseEnter={hide}>
          <LanguageSwitch className="hidden sm:flex" />
          <span className="mx-1 hidden h-6 w-px bg-border lg:block" aria-hidden />
          <a
            href={whatsappLink(t.whatsapp.default)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.cta.whatsappLong}
            className="hidden size-10 place-items-center rounded-full text-glaze transition-colors hover:bg-glaze hover:text-cream lg:grid"
          >
            <WhatsAppIcon className="size-[1.1rem]" />
          </a>
          <Button
            variant="clay"
            className="group hidden h-10 whitespace-nowrap rounded-full px-5 sm:inline-flex"
            onClick={() => openQuote()}
          >
            {t.cta.quote}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            ref={menuButton}
            variant="ghost"
            size="icon"
            className="size-11 text-safi hover:bg-transparent xl:hidden"
            onClick={() => setOpen(true)}
            aria-label={t.a11y.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-7" />
          </Button>
        </div>
      </div>

      {/* Mega panel */}
      <div onMouseEnter={() => mega && show(mega)}>
        <AnimatePresence>{mega && <MegaPanel kind={mega} onClose={() => setMega(null)} />}</AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.a11y.mainNav}
            initial={{ opacity: 0, clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex h-[100svh] flex-col overflow-y-auto bg-safi px-6 pb-8 pt-5 text-cream xl:hidden"
          >
            <Rosette
              className="pointer-events-none absolute -right-24 top-1/3 size-[28rem] text-cream opacity-[0.06]"
              strokeWidth={0.5}
            />
            <div className="relative flex items-center justify-between">
              <LanguageSwitch tone="light" />
              <Button
                variant="ghost"
                size="icon"
                className="size-11 text-cream hover:bg-cream/10 hover:text-cream"
                onClick={() => setOpen(false)}
                aria-label={t.a11y.closeMenu}
                autoFocus
              >
                <X className="size-8" />
              </Button>
            </div>

            <nav className="relative mt-6 flex flex-col" aria-label={t.a11y.mainNav}>
              {mainNav.map((n, i) => (
                <motion.div
                  key={n.key}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.4 }}
                  className="border-b border-cream/10"
                >
                  <Link
                    to={n.to}
                    params={lp}
                    activeOptions={{ exact: n.key === "home" }}
                    className="group flex items-center justify-between gap-4 py-3 font-display text-[1.9rem] leading-tight text-cream/80 transition-colors hover:text-cream data-[status=active]:text-cream"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="w-6 font-sans text-xs text-ochre">{String(i + 1).padStart(2, "0")}</span>
                      <span className="group-data-[status=active]:italic">{t.nav[n.key]}</span>
                    </span>
                    <ArrowUpRight className="size-5 text-cream/30 transition-colors group-hover:text-ochre" aria-hidden />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="relative mt-8 grid grid-cols-3 gap-2 text-xs">
              <a
                href={whatsappLink(t.whatsapp.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-2xl bg-glaze py-3.5 font-semibold"
              >
                <WhatsAppIcon className="size-5" /> WhatsApp
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-cream/20 py-3.5 font-semibold"
              >
                <Phone className="size-5" /> {l({ fr: "Appeler", en: "Call" })}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-cream/20 py-3.5 font-semibold"
              >
                <Mail className="size-5" /> Email
              </a>
            </div>

            <Button
              variant="clay"
              size="xl"
              className="relative mt-4 w-full"
              onClick={() => {
                setOpen(false);
                openQuote();
              }}
            >
              {t.cta.quote} <ArrowRight />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}