// CONTENU EXEMPLE À REMPLACER
// All company facts live here. Every value below is a placeholder until the client confirms it.
import type { L } from "@/i18n/locale";

export const site = {
  name: "Ssoussi", // running text
  wordmark: "SSOUSSI", // wordmarks and titles
  url: "https://www.ssoussi.ma", // PLACEHOLDER — production domain (canonical, sitemap, Open Graph)
  tagline: { fr: "Artisanat marocain", en: "Moroccan craftsmanship" } as L,
  mission: {
    fr: "Ssoussi réunit des artisans du Maroc pour faire voyager des pièces façonnées à la main, de Safi au reste du monde.",
    en: "Ssoussi brings Moroccan artisans together so that pieces shaped by hand can travel from Safi to the rest of the world.",
  } as L,
  phone: "+212 5 24 00 00 00", // PLACEHOLDER
  email: "contact@ssoussi.ma", // PLACEHOLDER
  whatsapp: "212600000000", // PLACEHOLDER — international format without "+"
  address: {
    street: "Colline des Potiers", // PLACEHOLDER
    city: "Safi",
    postalCode: "46000", // PLACEHOLDER
    country: "MA",
    full: {
      fr: "Colline des Potiers, 46000 Safi, Maroc",
      en: "Potters' Hill, 46000 Safi, Morocco",
    } as L, // PLACEHOLDER
  },
  // PLACEHOLDER — atelier location (map embed + JSON-LD). Currently central Safi.
  coordinates: { lat: 32.2994, lon: -9.2372 },
  hours: [
    { days: { fr: "Lundi – vendredi", en: "Monday – Friday" }, time: "9:00 – 18:00" }, // PLACEHOLDER
    { days: { fr: "Samedi", en: "Saturday" }, time: "9:00 – 13:00" }, // PLACEHOLDER
    {
      days: { fr: "Visites de l'atelier", en: "Atelier visits" },
      time: { fr: "sur rendez-vous", en: "by appointment" },
    }, // PLACEHOLDER
  ] as { days: L; time: string | L }[],
  socials: {
    instagram: "https://instagram.com/", // PLACEHOLDER
    facebook: "https://facebook.com/", // PLACEHOLDER
    pinterest: "https://pinterest.com/", // PLACEHOLDER
    linkedin: "https://linkedin.com/", // PLACEHOLDER
  },
  // PLACEHOLDER — atelier film. Leave empty to show the "video coming soon" poster.
  videoUrl: "",
  // PLACEHOLDER figures — replace with real, verifiable numbers before launch.
  stats: [
    { value: 15, suffix: "", label: { fr: "années d'expérience", en: "years of experience" } },
    { value: 40, suffix: "+", label: { fr: "artisans partenaires", en: "partner artisans" } },
    {
      value: 3000,
      suffix: "+",
      label: { fr: "pièces façonnées par an", en: "pieces made each year" },
    },
    { value: 12, suffix: "", label: { fr: "pays livrés", en: "countries delivered" } },
  ] as { value: number; suffix: string; label: L }[],
  // PLACEHOLDER — legal identity for the legal notice page.
  legal: {
    companyName: "[Raison sociale à compléter]",
    legalForm: "[Forme juridique — capital]",
    rc: "[RC à compléter]",
    ice: "[ICE à compléter]",
    director: "[Directeur·rice de la publication]",
    host: "[Hébergeur — nom, adresse]",
  },
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
