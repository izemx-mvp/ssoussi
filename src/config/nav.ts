import type { Messages } from "@/i18n";

export type NavKey = keyof Messages["nav"];

/** Main navigation, in display order. `to` values are typed route ids under `{-$locale}`. */
export const mainNav = [
  { key: "home", to: "/{-$locale}" },
  { key: "craft", to: "/{-$locale}/savoir-faire" },
  { key: "crafts", to: "/{-$locale}/metiers" },
  { key: "collections", to: "/{-$locale}/collections" },
  { key: "atelier", to: "/{-$locale}/atelier" },
  { key: "pro", to: "/{-$locale}/professionnels" },
  { key: "journal", to: "/{-$locale}/journal" },
  { key: "contact", to: "/{-$locale}/contact" },
] as const satisfies readonly { key: NavKey; to: string }[];

export const legalNav = [
  { key: "legal", to: "/{-$locale}/mentions-legales" },
  { key: "privacy", to: "/{-$locale}/confidentialite" },
] as const satisfies readonly { key: NavKey; to: string }[];
