// CONTENU EXEMPLE À REMPLACER
import heroVase from "@/assets/hero-vase.jpg";
import tableware from "@/assets/tableware.jpg";
import riad from "@/assets/riad.jpg";
import zellige from "@/assets/zellige.jpg";
import craftsMix from "@/assets/crafts-mix.jpg";
import handsClay from "@/assets/hands-clay.jpg";

export type Product = {
  slug: string;
  name: string;
  craft: string; // slug du métier
  origin: string;
  category: "Vases" | "Art de la table" | "Décoration" | "Revêtements" | "Textile" | "Objets";
  description: string;
  specs: { label: string; value: string }[];
  image: string;
};

const p = (x: Product) => x;

export const products: Product[] = [
  p({ slug: "vase-amphore-safi", name: "Vase amphore Safi", craft: "poterie", origin: "Safi", category: "Vases", image: heroVase,
    description: "Grand vase tourné à la main, décor géométrique bleu de Safi peint au pinceau.",
    specs: [{ label: "Hauteur", value: "55 cm" }, { label: "Matière", value: "Argile rouge émaillée" }, { label: "Délai", value: "Sur demande" }] }),
  p({ slug: "service-assiettes-zahra", name: "Service d'assiettes Zahra", craft: "poterie", origin: "Safi", category: "Art de la table", image: tableware,
    description: "Assiettes plates et creuses aux motifs floraux, bordure terre cuite.",
    specs: [{ label: "Diamètres", value: "18 / 24 / 28 cm" }, { label: "Usage", value: "Alimentaire" }] }),
  p({ slug: "tajine-decor-bleu", name: "Tajine décoré bleu", craft: "poterie", origin: "Safi", category: "Art de la table", image: tableware,
    description: "Tajine de service au couvercle conique, décor étoilé.",
    specs: [{ label: "Diamètre", value: "30 cm" }, { label: "Usage", value: "Service" }] }),
  p({ slug: "bols-riad", name: "Bols Riad", craft: "poterie", origin: "Safi", category: "Art de la table", image: riad,
    description: "Trio de bols émaillés aux tons bleu et turquoise.",
    specs: [{ label: "Diamètres", value: "12 / 18 / 26 cm" }] }),
  p({ slug: "jarre-terre-brute", name: "Jarre en terre brute", craft: "poterie", origin: "Safi", category: "Décoration", image: riad,
    description: "Jarre d'extérieur non émaillée, patine naturelle de la cuisson au bois.",
    specs: [{ label: "Hauteur", value: "70 cm" }, { label: "Usage", value: "Intérieur / extérieur" }] }),
  p({ slug: "pichet-tourne-main", name: "Pichet tourné main", craft: "poterie", origin: "Safi", category: "Art de la table", image: handsClay,
    description: "Pichet à l'anse généreuse, émail sable ou bleu.",
    specs: [{ label: "Contenance", value: "1,2 L" }] }),
  p({ slug: "vase-bouteille", name: "Vase bouteille", craft: "poterie", origin: "Safi", category: "Vases", image: heroVase,
    description: "Col étroit et panse ronde, décor en bandes concentriques.",
    specs: [{ label: "Hauteur", value: "35 cm" }] }),
  p({ slug: "plat-a-couscous", name: "Plat à couscous Safi", craft: "poterie", origin: "Safi", category: "Art de la table", image: tableware,
    description: "Grand plat creux pour le partage, décor rosace.",
    specs: [{ label: "Diamètre", value: "40 cm" }] }),
  p({ slug: "zellige-etoile", name: "Panneau zellige Étoile", craft: "zellige", origin: "Fès", category: "Revêtements", image: zellige,
    description: "Composition à étoiles à douze branches, sur mesure.",
    specs: [{ label: "Format", value: "Sur mesure" }, { label: "Pose", value: "Intérieur" }] }),
  p({ slug: "plateau-cuivre-martele", name: "Plateau cuivre martelé", craft: "tadelakt-dinanderie", origin: "Marrakech", category: "Objets", image: craftsMix,
    description: "Plateau rond martelé à la main, patine cuivrée.",
    specs: [{ label: "Diamètre", value: "60 cm" }] }),
  p({ slug: "coffret-thuya", name: "Coffret en thuya", craft: "bois-de-thuya", origin: "Essaouira", category: "Objets", image: craftsMix,
    description: "Coffret marqueté de citronnier, intérieur feutré.",
    specs: [{ label: "Dimensions", value: "22 × 14 × 12 cm" }] }),
  p({ slug: "tapis-atlas", name: "Tapis de l'Atlas", craft: "tissage", origin: "Atlas", category: "Textile", image: craftsMix,
    description: "Tissage en laine teinte aux pigments naturels, motifs berbères.",
    specs: [{ label: "Dimensions", value: "200 × 300 cm" }, { label: "Matière", value: "Laine" }] }),
];

export const categories = Array.from(new Set(products.map((x) => x.category)));
export const getProduct = (slug: string) => products.find((x) => x.slug === slug);
