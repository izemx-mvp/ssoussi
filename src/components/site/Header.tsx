import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useQuote } from "./QuoteDialog";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: openQuote } = useQuote();
  const loc = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b border-border/60 transition-all duration-500", scrolled ? "bg-cream/95 backdrop-blur-lg" : "bg-cream")}>
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link to="/" aria-label="SSOUSSI, accueil" className="shrink-0">
          <Logo className="h-14" />
        </Link>
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Navigation principale">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="text-[0.82rem] font-medium text-ink/80 transition-colors hover:text-clay data-[status=active]:text-clay">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="clay" size="default" className="hidden sm:inline-flex" onClick={() => openQuote()}>Demander un devis</Button>
          <Button variant="ghost" size="icon" className="text-safi xl:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu"><Menu className="size-7" /></Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-safi px-6 py-6 text-cream xl:hidden">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fermer le menu"><X className="size-8" /></Button>
          </div>
          <nav className="mt-6 flex flex-col gap-4">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="font-display text-4xl text-cream/90 hover:text-cream">{n.label}</Link>
            ))}
          </nav>
          <Button variant="clay" size="xl" className="mt-auto" onClick={() => { setOpen(false); openQuote(); }}>Demander un devis</Button>
        </div>
      )}
    </header>
  );
}
