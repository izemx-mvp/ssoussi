// CONTENU EXEMPLE À REMPLACER
import { media, type Media } from "@/config/media";
import type { L } from "@/i18n/locale";

export type Category = {
  slug: string;
  name: L;
  description: L;
  image: Media;
};

export const categories: Category[] = [
  {
    slug: "art-de-la-table",
    name: { fr: "Art de la table", en: "Tableware" },
    description: {
      fr: "Tajines, plats, bols et assiettes tournés et peints à la main.",
      en: "Tagines, serving dishes, bowls and plates, thrown and hand-painted.",
    },
    image: media.tableware,
  },
  {
    slug: "decoration",
    name: { fr: "Décoration", en: "Decoration" },
    description: {
      fr: "Vases, jarres et cache-pots pour habiller un lieu d'une seule pièce.",
      en: "Vases, jars and planters that can dress a room on their own.",
    },
    image: media.heroVase,
  },
  {
    slug: "zellige-revetements",
    name: { fr: "Zellige & revêtements", en: "Zellige & surfaces" },
    description: {
      fr: "Zellige taillé main et enduits tadelakt pour l'architecture intérieure.",
      en: "Hand-cut zellige and tadelakt plaster for interior architecture.",
    },
    image: media.zellige,
  },
  {
    slug: "luminaires",
    name: { fr: "Luminaires", en: "Lighting" },
    description: {
      fr: "Lampes en céramique et suspensions en laiton ajouré.",
      en: "Ceramic lamps and pierced brass pendants.",
    },
    image: media.riad,
  },
  {
    slug: "tapis-textiles",
    name: { fr: "Tapis & textiles", en: "Rugs & textiles" },
    description: {
      fr: "Tapis et coussins tissés à la main dans l'Atlas.",
      en: "Rugs and cushions hand-woven in the Atlas.",
    },
    image: media.craftsMix,
  },
  {
    slug: "bois",
    name: { fr: "Bois", en: "Wood" },
    description: {
      fr: "Coffrets et objets en thuya d'Essaouira, marquetés à la main.",
      en: "Boxes and objects in Essaouira thuya wood, hand-inlaid.",
    },
    image: media.craftsMix,
  },
  {
    slug: "cuivre-laiton",
    name: { fr: "Cuivre & laiton", en: "Copper & brass" },
    description: {
      fr: "Plateaux et objets martelés, ciselés au burin.",
      en: "Hammered and hand-chased trays and objects.",
    },
    image: media.craftsMix,
  },
  {
    slug: "maroquinerie",
    name: { fr: "Maroquinerie", en: "Leather goods" },
    description: {
      fr: "Poufs et pièces en cuir tanné végétal.",
      en: "Poufs and pieces in vegetable-tanned leather.",
    },
    image: media.riad,
  },
  {
    slug: "pieces-exception",
    name: { fr: "Pièces d'exception", en: "Signature pieces" },
    description: {
      fr: "Grands formats et pièces uniques, réalisés sur commande.",
      en: "Large formats and one-off pieces, made to order.",
    },
    image: media.kiln,
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const techniques = {
  tournee: { fr: "Tournée main", en: "Wheel-thrown" },
  emaillee: { fr: "Émaillée", en: "Glazed" },
  peinte: { fr: "Peinte à la main", en: "Hand-painted" },
  brute: { fr: "Terre brute", en: "Raw clay" },
  zellige: { fr: "Zellige taillé main", en: "Hand-cut zellige" },
  tadelakt: { fr: "Tadelakt", en: "Tadelakt" },
  martelee: { fr: "Martelée", en: "Hammered" },
  ciselee: { fr: "Ciselée", en: "Hand-chased" },
  marquetee: { fr: "Marquetée", en: "Inlaid" },
  tissee: { fr: "Tissée main", en: "Hand-woven" },
  "tannage-vegetal": { fr: "Tannage végétal", en: "Vegetable-tanned" },
} satisfies Record<string, L>;
export type Technique = keyof typeof techniques;

export const usages = {
  table: { fr: "Art de la table", en: "Table" },
  decoration: { fr: "Décoration", en: "Decoration" },
  architecture: { fr: "Architecture / revêtement", en: "Architecture / surfaces" },
  luminaires: { fr: "Luminaires", en: "Lighting" },
} satisfies Record<string, L>;
export type Usage = keyof typeof usages;

/** Colour chips — swatches use brand tokens only. */
export const colors = {
  bleu: { label: { fr: "Bleu de Safi", en: "Safi blue" }, swatch: "var(--safi-blue)" },
  vert: { label: { fr: "Vert de cuivre", en: "Copper green" }, swatch: "var(--glaze-green)" },
  terre: { label: { fr: "Terre cuite", en: "Terracotta" }, swatch: "var(--clay)" },
  ocre: { label: { fr: "Ocre & laiton", en: "Ochre & brass" }, swatch: "var(--ochre)" },
  naturel: { label: { fr: "Naturel", en: "Natural" }, swatch: "var(--sand)" },
  brun: { label: { fr: "Brun profond", en: "Deep brown" }, swatch: "var(--ink)" },
} satisfies Record<string, { label: L; swatch: string }>;
export type Color = keyof typeof colors;
