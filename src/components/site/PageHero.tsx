import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { MotifWatermark } from "@/components/brand/Motif";
import { useI18n } from "@/i18n";
import { withLocale } from "@/i18n/locale";
import { Reveal } from "./FadeUp";

/** `href` is locale-less ("/collections"); the current locale prefix is added. */
export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t, lp, locale } = useI18n();
  const router = useRouter();
  return (
    <nav aria-label={t.a11y.breadcrumb} className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/{-$locale}" params={lp} className="hover:text-ink">
            {t.nav.home}
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span aria-hidden className="text-ochre">
              /
            </span>
            {c.href && i < items.length - 1 ? (
              <a
                href={withLocale(c.href, locale)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  router.navigate({ href: withLocale(c.href!, locale) });
                }}
                className="hover:text-ink"
              >
                {c.label}
              </a>
            ) : (
              <span
                aria-current={i === items.length - 1 ? "page" : undefined}
                className="text-ink/80"
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  crumbs,
  arabic,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
  crumbs?: Crumb[];
  /** Decorative Arabic accent word (never the reading language). */
  arabic?: string | undefined;
}) {
  return (
    <section className="grain relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
      <MotifWatermark className="-right-24 -top-16 size-[30rem] text-safi md:-right-10 md:size-[38rem]" />
      <div className="container-page relative">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <Reveal className={crumbs ? "mt-8" : ""}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-[2.9rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            {title}
          </h1>
          {intro && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
          )}
          {children}
        </Reveal>
        {arabic && (
          <span
            aria-hidden
            lang="ar"
            className="font-arabic pointer-events-none absolute bottom-0 right-4 hidden text-7xl text-ochre/40 md:block lg:text-8xl"
          >
            {arabic}
          </span>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  className,
  light,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  action?: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <Reveal className={`flex flex-wrap items-end justify-between gap-6 ${className ?? ""}`}>
      <div className="max-w-2xl">
        <p className={light ? "eyebrow !text-ochre" : "eyebrow"}>{eyebrow}</p>
        <h2
          className={`mt-4 text-4xl leading-[1.05] md:text-[3.4rem] ${light ? "!text-cream" : ""}`}
        >
          {title}
        </h2>
        {text && (
          <p
            className={`mt-5 text-lg leading-relaxed ${light ? "text-cream/80" : "text-muted-foreground"}`}
          >
            {text}
          </p>
        )}
      </div>
      {action}
    </Reveal>
  );
}
