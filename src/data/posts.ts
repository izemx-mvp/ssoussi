// CONTENU EXEMPLE À REMPLACER
import kiln from "@/assets/kiln.jpg";
import zellige from "@/assets/zellige.jpg";
import riad from "@/assets/riad.jpg";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "colline-des-potiers-safi",
    title: "Sur la colline des potiers de Safi",
    excerpt: "Récit d'une journée aux côtés des maâlems, entre fours à bois et argile rouge.",
    date: "2026-09-12",
    category: "Reportage",
    image: kiln,
    body: [
      "À l'aube, les fours de la colline fument déjà. Ici, la céramique n'est pas un décor : c'est un métier transmis de père en fils depuis le XIIe siècle.",
      "L'argile, extraite à quelques kilomètres, est trempée, foulée puis tournée. Chaque geste compte, chaque pièce porte la trace d'une main.",
      "Chez AFUS, nous travaillons directement avec ces ateliers, pour que la valeur reste au plus près de ceux qui créent.",
    ],
  },
  {
    slug: "geometrie-du-zellige",
    title: "La géométrie secrète du zellige",
    excerpt: "Comment les artisans de Fès composent des motifs infinis à partir de quelques formes.",
    date: "2026-08-03",
    category: "Savoir-faire",
    image: zellige,
    body: [
      "Le zellige repose sur un vocabulaire de formes très réduit, combinées selon des règles de symétrie d'une grande rigueur.",
      "La taille au menqach demande des années d'apprentissage : une tesselle mal coupée, et c'est toute la composition qui se décale.",
    ],
  },
  {
    slug: "styler-un-riad",
    title: "Habiller un intérieur avec la céramique de Safi",
    excerpt: "Nos conseils pour mêler pièces artisanales et intérieurs contemporains.",
    date: "2026-07-18",
    category: "Inspiration",
    image: riad,
    body: [
      "Une seule pièce forte suffit souvent : un grand vase bleu sur une console, un trio de bols sur une table basse en laiton.",
      "Associez les émaux profonds aux matières brutes — lin, chaux, bois — pour laisser respirer le décor.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
