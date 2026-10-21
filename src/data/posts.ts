// CONTENU EXEMPLE À REMPLACER
import { media, type Media } from "@/config/media";
import type { L } from "@/i18n/locale";

export const postCategories = {
  "savoir-faire": { fr: "Savoir-faire", en: "Craftsmanship" },
  "metiers-regions": { fr: "Métiers & régions", en: "Crafts & regions" },
  "histoire-safi": { fr: "Histoire de Safi", en: "History of Safi" },
  decoration: { fr: "Décoration", en: "Decoration" },
  entretien: { fr: "Entretien", en: "Care" },
  coulisses: { fr: "Coulisses", en: "Behind the scenes" },
} satisfies Record<string, L>;
export type PostCategory = keyof typeof postCategories;

export type PostBlock =
  { type: "h2"; id: string; text: L } | { type: "p"; text: L } | { type: "quote"; text: L };

export type Post = {
  slug: string;
  title: L;
  excerpt: L;
  date: string; // ISO
  category: PostCategory;
  image: Media;
  body: PostBlock[];
};

const l = (fr: string, en: string): L => ({ fr, en });
const h2 = (id: string, fr: string, en: string): PostBlock => ({ type: "h2", id, text: l(fr, en) });
const p = (fr: string, en: string): PostBlock => ({ type: "p", text: l(fr, en) });
const q = (fr: string, en: string): PostBlock => ({ type: "quote", text: l(fr, en) });

export const posts: Post[] = [
  {
    slug: "colline-des-potiers-safi",
    title: l("Sur la colline des potiers de Safi", "On Safi's potters' hill"),
    excerpt: l(
      "Une journée entre les fours, les séchoirs et les tours : ce que l'on voit, ce que l'on apprend.",
      "A day among the kilns, drying racks and wheels: what you see, what you learn.",
    ),
    date: "2026-09-12",
    category: "histoire-safi",
    image: media.kiln,
    body: [
      p(
        "À Safi, la céramique n'est pas un décor de carte postale : c'est un quartier entier, accroché à une colline, où l'on façonne, sèche et cuit la terre au quotidien.",
        "In Safi, ceramics is not a postcard backdrop: it is an entire quarter on a hill, where clay is shaped, dried and fired every day.",
      ),
      h2("matin", "Le matin, la terre", "Morning: the clay"),
      p(
        "La journée commence par la préparation de l'argile. Trempée, décantée, foulée : la pâte doit être parfaitement homogène avant d'arriver au tour.",
        "The day begins with preparing the clay. Soaked, settled, trodden: the paste must be perfectly even before it reaches the wheel.",
      ),
      p(
        "Au tour, le maâlem centre la motte en quelques secondes. Le reste est une affaire d'œil : la hauteur d'un col, l'épaisseur d'une lèvre.",
        "At the wheel, the maâlem centres the clay in seconds. The rest is a matter of the eye: the height of a neck, the thickness of a rim.",
      ),
      q("Le tour ne pardonne pas l'hésitation.", "The wheel does not forgive hesitation."),
      h2("feu", "L'après-midi, le feu", "Afternoon: the fire"),
      p(
        "Les pièces sèches rejoignent le four traditionnel. Conduire le feu demande une attention constante : trop vite, la pièce se fend ; pas assez, la terre reste fragile.",
        "Dried pieces go into the traditional kiln. Managing the fire takes constant attention: too fast and the piece cracks; not enough and the clay stays fragile.",
      ),
      h2("decor", "Le décor, enfin", "Finally, the decoration"),
      p(
        "Après la première cuisson viennent le décor peint au pinceau et l'émail. Les couleurs n'apparaissent qu'à la sortie de la seconde cuisson — c'est le moment que tout l'atelier attend.",
        "After the first firing come the brush-painted decoration and the glaze. The colours only appear after the second firing — the moment the whole workshop waits for.",
      ),
      p(
        "Chez Ssoussi, nous travaillons au plus près de ces ateliers, pour que chaque pièce reste liée aux mains qui l'ont faite.",
        "At Ssoussi, we work closely with these workshops so that each piece stays connected to the hands that made it.",
      ),
    ],
  },
  {
    slug: "geometrie-du-zellige",
    title: l("La géométrie du zellige de Fès", "The geometry of Fez zellige"),
    excerpt: l(
      "Comment quelques formes simples, taillées à la main, composent des motifs sans fin.",
      "How a few simple, hand-cut shapes compose endless patterns.",
    ),
    date: "2026-08-03",
    category: "metiers-regions",
    image: media.zellige,
    body: [
      p(
        "Le zellige repose sur un paradoxe : un vocabulaire de formes très réduit, et des compositions d'une richesse infinie.",
        "Zellige rests on a paradox: a very small vocabulary of shapes, and compositions of endless richness.",
      ),
      h2("formes", "Quelques formes, des règles strictes", "A few shapes, strict rules"),
      p(
        "Étoiles, polygones, amandes : chaque tesselle obéit à des règles de symétrie qui permettent de la répéter et de l'emboîter.",
        "Stars, polygons, almonds: each tessera follows rules of symmetry that allow it to be repeated and interlocked.",
      ),
      h2("taille", "La taille au marteau", "Cutting by hammer"),
      p(
        "La forme est tracée sur un carreau émaillé, puis taillée au marteau tranchant. Le biseau au revers permet aux pièces de se serrer au moment de la pose.",
        "The shape is drawn on a glazed tile and cut with a sharp hammer. The bevel on the back lets the pieces fit tightly when laid.",
      ),
      q(
        "Une tesselle mal coupée, et c'est toute la composition qui se décale.",
        "One badly cut tessera, and the whole composition shifts.",
      ),
      h2("pose", "Une pose à l'envers", "Laid upside down"),
      p(
        "Le panneau est assemblé face contre terre : l'artisan compose son motif sans le voir, puis coule le mortier au revers.",
        "The panel is assembled face down: the craftsman builds the pattern without seeing it, then pours mortar on the back.",
      ),
    ],
  },
  {
    slug: "ceramique-de-safi-interieur",
    title: l(
      "Habiller un intérieur avec la céramique de Safi",
      "Styling an interior with Safi ceramics",
    ),
    excerpt: l(
      "Nos conseils pour mêler pièces artisanales et intérieurs contemporains.",
      "Our advice for mixing handmade pieces with contemporary interiors.",
    ),
    date: "2026-07-18",
    category: "decoration",
    image: media.riad,
    body: [
      p(
        "Une pièce artisanale forte suffit souvent à donner une identité à un lieu. Tout l'enjeu est de lui laisser de l'espace.",
        "A single strong handmade piece is often enough to give a place its identity. The key is to give it room.",
      ),
      h2("une-piece", "Commencer par une pièce", "Start with one piece"),
      p(
        "Un grand vase bleu sur une console, une jarre en terre brute dans une entrée : choisissez d'abord la pièce, puis composez autour.",
        "A large blue vase on a console, a raw clay jar in an entrance: choose the piece first, then build around it.",
      ),
      h2("matieres", "Jouer avec les matières", "Play with materials"),
      p(
        "Associez les émaux profonds aux matières brutes — lin, chaux, bois clair, laiton — pour laisser respirer le décor.",
        "Pair deep glazes with raw materials — linen, lime, pale wood, brass — so the decoration can breathe.",
      ),
      q(
        "La céramique faite main aime la lumière naturelle.",
        "Handmade ceramics love natural light.",
      ),
      h2("table", "À table", "At the table"),
      p(
        "Mélanger plusieurs décors d'un même atelier crée une table vivante, sans effet de catalogue.",
        "Mixing several patterns from the same workshop creates a lively table, without a catalogue look.",
      ),
    ],
  },
  {
    slug: "entretenir-pieces-artisanales",
    title: l("Entretenir ses pièces artisanales", "Caring for handmade pieces"),
    excerpt: l(
      "Céramique, bois, cuivre, textile : les bons gestes pour faire durer vos pièces.",
      "Ceramics, wood, copper, textiles: the right habits to make your pieces last.",
    ),
    date: "2026-06-05",
    category: "entretien",
    image: media.tableware,
    body: [
      p(
        "Une pièce faite main se garde longtemps, à condition de respecter sa matière. Voici quelques principes généraux — votre devis précisera les recommandations propres à chaque pièce.",
        "A handmade piece lasts a long time if its material is respected. Here are a few general principles — your quote will include the specific recommendations for each piece.",
      ),
      h2("ceramique", "Céramique émaillée", "Glazed ceramics"),
      p(
        "Lavage à la main, eau tiède et savon doux. Évitez les chocs thermiques : ne passez pas une pièce froide directement sur une source de chaleur.",
        "Hand wash in warm water with mild soap. Avoid thermal shocks: don't move a cold piece straight onto a heat source.",
      ),
      h2("bois", "Bois de thuya", "Thuya wood"),
      p(
        "Dépoussiérez avec un chiffon sec et nourrissez le bois de temps en temps avec une huile adaptée. Évitez l'humidité prolongée.",
        "Dust with a dry cloth and feed the wood occasionally with a suitable oil. Avoid prolonged damp.",
      ),
      h2("cuivre", "Cuivre et laiton", "Copper and brass"),
      p(
        "Le métal se patine naturellement. Pour raviver l'éclat, un mélange de citron et de sel, puis un rinçage et un séchage soigneux.",
        "Metal gains a natural patina. To revive the shine, use lemon and salt, then rinse and dry carefully.",
      ),
      h2("textile", "Tapis et textiles", "Rugs and textiles"),
      p(
        "Aspirez sans brosse rotative, retournez le tapis de temps en temps et confiez les nettoyages en profondeur à un professionnel.",
        "Vacuum without a rotating brush, turn the rug from time to time and leave deep cleaning to a professional.",
      ),
    ],
  },
];

export const getPost = (slug: string) => posts.find((x) => x.slug === slug);

export const readingTime = (post: Post, locale: "fr" | "en") => {
  const words = post.body.reduce((n, b) => n + b.text[locale].split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
};
