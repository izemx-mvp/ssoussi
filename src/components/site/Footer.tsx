import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { nav, site } from "@/config/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-safi text-cream/80">
      <div className="container-page grid gap-12 py-20 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="inline-block rounded-3xl bg-cream p-4"><Logo className="h-24" /></div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{site.mission}</p>
        </div>
        <div>
          <h3 className="eyebrow text-ochre">Navigation</h3>
          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-cream">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow text-ochre">Contact</h3>
          <ul className="mt-5 space-y-2 text-sm">
            <li>{site.address}</li>
            <li><a href={`tel:${site.phone}`} className="hover:text-cream">{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-cream">{site.email}</a></li>
          </ul>
          <div className="mt-6 flex gap-4">
            <a href={site.socials.instagram} aria-label="Instagram" className="hover:text-cream"><Instagram className="size-5" /></a>
            <a href={site.socials.facebook} aria-label="Facebook" className="hover:text-cream"><Facebook className="size-5" /></a>
            <a href={site.socials.linkedin} aria-label="LinkedIn" className="hover:text-cream"><Linkedin className="size-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} SSOUSSI — Artisanat marocain</p>
          <div className="flex gap-5">
            <Link to="/contact" className="hover:text-cream">Mentions légales</Link>
            <Link to="/contact" className="hover:text-cream">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
