import { Link } from "@tanstack/react-router";
import { ArrowUp, FileText, Mail, Printer, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Rosette } from "@/components/brand/Motif";
import { site } from "@/config/site";
import { legalUpdated, type LegalSection } from "@/data/legal";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { Reveal } from "./FadeUp";
import { PageHero } from "./PageHero";
import { formatDate } from "./PostCard";

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  const { t, l, lp, locale } = useI18n();
  const items = useMemo(() => sections.map((s) => ({ ...s, id: slug(s.title.fr) })), [sections]);
  const ids = useMemo(() => items.map((s) => s.id), [items]);
  const active = useActive(ids);

  const docs = [
    { to: "/{-$locale}/mentions-legales" as const, label: t.legal.legalTitle, icon: FileText },
    { to: "/{-$locale}/confidentialite" as const, label: t.legal.privacyTitle, icon: ShieldCheck },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${t.legal.updated} : ${formatDate(legalUpdated, locale)}`}
        title={title}
        crumbs={[{ label: title }]}
      />

      <section className="container-page grid gap-12 pb-24 lg:grid-cols-[17rem_1fr] lg:gap-20">
        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start print:hidden">
          <nav
            aria-label={l({ fr: "Sommaire", en: "Contents" })}
            className="rounded-[1.5rem] border border-border bg-cream p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-deep">
              {l({ fr: "Sommaire", en: "Contents" })}
            </p>
            <ol className="mt-4 space-y-1 border-l border-border text-sm">
              {items.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "true" : undefined}
                    className={cn(
                      "-ml-px flex gap-2 border-l-2 py-1.5 pl-3 transition-colors",
                      active === s.id
                        ? "border-clay font-semibold text-safi"
                        : "border-transparent text-ink/70 hover:text-clay-deep",
                    )}
                  >
                    <span className="text-ochre">{String(i + 1).padStart(2, "0")}</span>
                    {l(s.title)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="rounded-[1.5rem] border border-border p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {l({ fr: "Documents", en: "Documents" })}
            </p>
            <ul className="mt-3 space-y-1">
              {docs.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    params={lp}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-cream hover:text-safi"
                    activeProps={{ className: "bg-safi !text-cream hover:!bg-safi" }}
                  >
                    <Icon className="size-4 shrink-0" strokeWidth={1.6} aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-safi transition-colors hover:border-safi"
          >
            <Printer className="size-4" aria-hidden />
            {l({ fr: "Imprimer / PDF", en: "Print / PDF" })}
          </button>
        </aside>

        {/* Content */}
        <div className="max-w-3xl">
          <p className="mb-10 inline-flex items-center gap-2 rounded-full border border-dashed border-ochre px-4 py-2 text-xs text-muted-foreground print:hidden">
            <Rosette className="size-3.5 text-ochre" strokeWidth={2} />
            {t.common.placeholderNotice}
          </p>

          <div className="space-y-5">
            {items.map((s, i) => (
              <Reveal key={s.id}>
                <section
                  id={s.id}
                  className="scroll-mt-28 rounded-[2rem] border border-border bg-cream p-6 md:p-9 print:border-0 print:p-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-4xl leading-none text-ochre/70 md:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-3xl text-safi md:text-4xl">{l(s.title)}</h2>
                  </div>
                  <div className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-ink/85 md:pl-[3.75rem]">
                    {s.body.map((b) => (
                      <p key={b.fr}>{l(b)}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          {/* Contact */}
          <Reveal className="grain relative mt-10 overflow-hidden rounded-[2rem] bg-safi p-7 text-cream md:p-9 print:hidden">
            <Rosette
              className="pointer-events-none absolute -right-12 -top-12 size-48 text-cream opacity-10"
              strokeWidth={0.6}
            />
            <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
              {l({ fr: "Une question ?", en: "A question?" })}
            </p>
            <p className="relative mt-2 font-display text-2xl md:text-3xl">
              {l({
                fr: "Pour toute demande concernant ces informations ou vos données :",
                en: "For any request about this information or your data:",
              })}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-safi transition-colors hover:bg-sand"
            >
              <Mail className="size-4" aria-hidden /> {site.email}
            </a>
          </Reveal>

          <div className="mt-10 flex justify-end print:hidden">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-safi"
            >
              {l({ fr: "Haut de page", en: "Back to top" })} <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}