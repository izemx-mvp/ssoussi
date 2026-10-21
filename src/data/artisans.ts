// CONTENU EXEMPLE À REMPLACER
// Placeholder artisans: names are examples only (shown with an "example name" label).
// Replace with real artisans who have agreed to be featured.
import { media, type Media } from "@/config/media";
import type { L } from "@/i18n/locale";

export type Artisan = {
  slug: string;
  name: string;
  craft: string; // slug in crafts.ts
  speciality: L;
  quote: L;
  image: Media;
  focus?: string;
};

export const artisans: Artisan[] = [
  {
    slug: "maalem-potier",
    name: "Maâlem Youssef",
    craft: "poterie",
    speciality: { fr: "Maître potier — tournage, Safi", en: "Master potter — throwing, Safi" },
    quote: {
      fr: "La terre sent tout de suite si la main hésite.",
      en: "Clay can tell straight away when the hand hesitates.",
    },
    image: media.handsClay,
    focus: "50% 40%",
  },
  {
    slug: "peintre-decor",
    name: "Fatima",
    craft: "poterie",
    speciality: {
      fr: "Peintre décoratrice — émaux, Safi",
      en: "Decorative painter — glazes, Safi",
    },
    quote: {
      fr: "Un motif se peint d'un seul souffle.",
      en: "A pattern is painted in a single breath.",
    },
    image: media.tableware,
    focus: "50% 50%",
  },
  {
    slug: "maalem-zellige",
    name: "Maâlem Driss",
    craft: "zellige",
    speciality: { fr: "Tailleur de zellige, Fès", en: "Zellige cutter, Fez" },
    quote: {
      fr: "Une tesselle mal taillée, et c'est toute l'étoile qui se décale.",
      en: "One badly cut tessera and the whole star shifts.",
    },
    image: media.zellige,
    focus: "50% 50%",
  },
];

export const artisansByCraft = (craft: string) => artisans.filter((a) => a.craft === craft);
