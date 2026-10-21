import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { useI18n } from "@/i18n";
import { LOCALE_STORAGE_KEY, locales, stripLocale, withLocale, type Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

const storeLocale = (l: Locale) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, l);
  } catch {
    /* storage unavailable */
  }
};

/** FR / EN toggle that keeps the visitor on the same page. */
export function LanguageSwitch({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const loc = useRouterState({ select: (s) => s.location });
  const base = stripLocale(loc.pathname);
  const suffix = `${loc.searchStr ?? ""}${loc.hash ? `#${loc.hash}` : ""}`;

  return (
    <nav
      aria-label={t.a11y.language}
      className={cn("flex items-center gap-1 text-xs font-semibold tracking-[0.14em]", className)}
    >
      {locales.map((l, i) => {
        const href = `${withLocale(base, l)}${suffix}`;
        const active = l === locale;
        return (
          <span key={l} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className={tone === "light" ? "text-cream/40" : "text-ink/30"}>
                /
              </span>
            )}
            <a
              href={href}
              hrefLang={l}
              lang={l}
              aria-current={active ? "true" : undefined}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                storeLocale(l);
                if (!active) router.navigate({ href });
              }}
              className={cn(
                "rounded px-1.5 py-1 uppercase transition-colors",
                tone === "light"
                  ? active
                    ? "text-cream"
                    : "text-cream/60 hover:text-cream"
                  : active
                    ? "text-clay-deep"
                    : "text-ink/60 hover:text-ink",
              )}
            >
              {l}
            </a>
          </span>
        );
      })}
    </nav>
  );
}

/**
 * On the first page of a visit, send returning visitors to the language they chose
 * last time (stored on explicit switch only). Runs once per browser session.
 */
export function LocaleRestore() {
  const router = useRouter();
  const { locale } = useI18n();
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ssoussi.locale-restored")) return;
      sessionStorage.setItem("ssoussi.locale-restored", "1");
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if ((saved === "en" || saved === "fr") && saved !== locale) {
        const { pathname, searchStr, hash } = router.state.location;
        router.navigate({
          href: `${withLocale(stripLocale(pathname), saved)}${searchStr ?? ""}${hash ? `#${hash}` : ""}`,
          replace: true,
        });
      }
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
