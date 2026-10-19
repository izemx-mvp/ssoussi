// CONTENU EXEMPLE À REMPLACER
export const site = {
  name: "AFUS",
  tifinagh: "ⴰⴼⵓⵙ",
  tagline: "Artisanat marocain",
  mission:
    "AFUS réunit des maîtres artisans du Maroc pour faire voyager des pièces façonnées à la main, de Safi au reste du monde.",
  phone: "+212 5 24 00 00 00",
  email: "contact@afus-artisanat.ma",
  whatsapp: "212600000000", // format international sans +
  address: "Colline des Potiers, Safi 46000, Maroc",
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    pinterest: "https://pinterest.com/",
    linkedin: "https://linkedin.com/",
  },
  stats: [
    { value: "40+", label: "artisans partenaires" },
    { value: "5", label: "métiers d'art" },
    { value: "12", label: "pays livrés" },
    { value: "100%", label: "fait main" },
  ],
} as const;

export const nav = [
  { to: "/", label: "Accueil" },
  { to: "/savoir-faire", label: "Savoir-faire" },
  { to: "/metiers", label: "Métiers" },
  { to: "/collections", label: "Collections" },
  { to: "/atelier", label: "L'atelier" },
  { to: "/professionnels", label: "Professionnels" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
