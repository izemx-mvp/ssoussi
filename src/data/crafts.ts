// CONTENU EXEMPLE À REMPLACER
import handsClay from "@/assets/hands-clay.jpg";
import zellige from "@/assets/zellige.jpg";
import riad from "@/assets/riad.jpg";
import craftsMix from "@/assets/crafts-mix.jpg";
import kiln from "@/assets/kiln.jpg";

export type Craft = {
  slug: string;
  name: string;
  city: string;
  featured?: boolean;
  description: string;
  image: string;
  steps: { title: string; text: string }[];
};

export const crafts: Craft[] = [
  {
    slug: "poterie",
    name: "Poterie & céramique",
    city: "Safi",
    featured: true,
    image: handsClay,
    description:
      "Sur la colline des potiers, l'argile rouge de Safi est tournée, séchée au soleil puis cuite au four à bois. Une tradition vivante depuis plus de huit siècles.",
    steps: [
      { title: "Argile", text: "Extraction de l'argile locale, trempage et décantation." },
      { title: "Pétrissage", text: "La pâte est foulée aux pieds puis pétrie à la main." },
      { title: "Tournage", text: "Le maâlem façonne chaque pièce au tour à pied." },
      { title: "Séchage", text: "Plusieurs jours à l'ombre, puis au soleil." },
      { title: "Cuisson", text: "Première cuisson au four traditionnel alimenté au bois." },
      { title: "Émaillage", text: "Décor peint au pinceau, émail puis seconde cuisson." },
    ],
  },
  {
    slug: "zellige",
    name: "Zellige",
    city: "Fès",
    image: zellige,
    description:
      "Tesselles d'argile émaillée taillées une à une au marteau, puis assemblées en compositions géométriques d'une précision infinie.",
    steps: [
      { title: "Carreaux", text: "Façonnage et cuisson de carreaux d'argile de Fès." },
      { title: "Émail", text: "Application des émaux, seconde cuisson." },
      { title: "Taille", text: "Découpe au menqach selon des gabarits ancestraux." },
      { title: "Assemblage", text: "Pose face contre terre, coulis de mortier au revers." },
    ],
  },
  {
    slug: "tadelakt-dinanderie",
    name: "Tadelakt & dinanderie",
    city: "Marrakech",
    image: riad,
    description:
      "L'enduit de chaux poli au galet et savon noir, et le cuivre martelé et ciselé des souks de Marrakech.",
    steps: [
      { title: "Chaux", text: "Chaux de la région de Marrakech, tamisée et mouillée." },
      { title: "Polissage", text: "Lissage au galet jusqu'à l'éclat satiné." },
      { title: "Martelage", text: "Mise en forme du cuivre au marteau sur enclume." },
      { title: "Ciselure", text: "Motifs gravés au burin, patine finale." },
    ],
  },
  {
    slug: "bois-de-thuya",
    name: "Bois de thuya",
    city: "Essaouira",
    image: craftsMix,
    description:
      "La loupe de thuya, aux veines profondes et au parfum boisé, travaillée et marquetée par les ébénistes d'Essaouira.",
    steps: [
      { title: "Loupe", text: "Sélection des racines de thuya de l'arrière-pays." },
      { title: "Débit", text: "Découpe et séchage lent du bois." },
      { title: "Marqueterie", text: "Incrustations de citronnier, d'ébène ou de nacre." },
      { title: "Finition", text: "Ponçage et huilage à la main." },
    ],
  },
  {
    slug: "tissage",
    name: "Tissage",
    city: "Atlas",
    image: kiln,
    description:
      "Laine filée et teinte aux pigments naturels, tissée sur métier vertical par les femmes des villages de l'Atlas.",
    steps: [
      { title: "Tonte", text: "Laine de moutons de l'Atlas, lavée à la rivière." },
      { title: "Filage", text: "Cardage et filage au fuseau." },
      { title: "Teinture", text: "Garance, henné, indigo et écorce de grenade." },
      { title: "Tissage", text: "Nouage sur métier vertical, motif après motif." },
    ],
  },
];

export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);
