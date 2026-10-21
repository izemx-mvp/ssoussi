export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/** A content string in both languages. */
export type L = { fr: string; en: string };

export const isLocale = (v: unknown): v is Locale => v === "fr" || v === "en";

export const tr = (value: L, locale: Locale) => value[locale];

/** Optional `{-$locale}` route param: absent for French (default), "en" for English. */
export const localeParam = (locale: Locale): { locale?: string } =>
  locale === "en" ? { locale: "en" } : {};

/** Strip the `/en` prefix from a pathname. */
export const stripLocale = (pathname: string) => {
  const p = pathname.replace(/^\/en(?=\/|$)/, "");
  return p === "" ? "/" : p;
};

export const localeFromPath = (pathname: string): Locale =>
  /^\/en(\/|$)/.test(pathname) ? "en" : "fr";

/** Build a pathname for a locale from a locale-less path ("/collections"). */
export const withLocale = (path: string, locale: Locale) =>
  locale === "en" ? (path === "/" ? "/en" : `/en${path}`) : path;

export const LOCALE_STORAGE_KEY = "ssoussi.locale";
