import { useRouterState } from "@tanstack/react-router";
import { useCallback } from "react";

import { en } from "./en";
import { fr, type Messages } from "./fr";
import { localeFromPath, localeParam, tr, type L, type Locale } from "./locale";

export * from "./locale";
export type { Messages };

export const messages: Record<Locale, Messages> = { fr, en };

/** Current locale, derived from the URL (`/en/...` → en, anything else → fr). */
export function useLocale(): Locale {
  return useRouterState({ select: (s) => localeFromPath(s.location.pathname) });
}

/** UI strings plus helpers for the current locale. */
export function useI18n() {
  const locale = useLocale();
  const t = messages[locale];
  const l = useCallback((value: L) => tr(value, locale), [locale]);
  return { locale, t, l, lp: localeParam(locale) };
}
