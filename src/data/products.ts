// CONTENU EXEMPLE À REMPLACER
// Sample catalogue. Dimensions, lead times and finishes are illustrative placeholders.
import { media, type Media } from "@/config/media";
import type { L } from "@/i18n/locale";
import type { Color, Technique, Usage } from "./categories";

export type Product = {
  slug: string;
  name: L;
  craft: string; // slug in crafts.ts
  origin: L; // city / region
  category: string; // slug in categories.ts
  techniques: Technique[];
  usage: Usage;
  colors: Color[];
  short: L;
  story: L;
  images: Media[];
  specs: {
    dimensions: L;
    material: L;
    technique: L;
    finish: L;
    care: L;
    leadTime: L;
  };
};

const l = (fr: string, en: string): L => ({ fr, en });

const safi = l("Safi", "Safi");
const ceramicCare = l(
  "Lavage à la main, eau tiède et savon doux. Éviter les chocs thermiques.",
  "Hand wash in warm water with mild soap. Avoid thermal shocks.",
);
const onQuote = l("Sur devis — à préciser", "By quote — to be confirmed");

export const products: Product[] = [
  {
    slug: "vase-amphore-safi",
    name: l("Vase amphore bleu de Safi", "Safi blue amphora vase"),
    craft: "poterie",
    origin: safi,
    category: "decoration",
    techniques: ["tournee", "emaillee", "peinte"],
    usage: "decoration",
    colors: ["bleu", "naturel"],
    short: l(
      "Grand vase tourné main, décor géométrique peint au pinceau.",
      "Large wheel-thrown vase with brush-painted geometric decoration.",
    ),
    story: l(
      "Une silhouette d'amphore, montée au tour sur la colline des potiers, puis couverte d'un décor géométrique bleu peint à main levée. Chaque vase porte ses propres variations de trait et d'émail.",
      "An amphora silhouette raised on the wheel on the potters' hill, then covered with freehand blue geometric decoration. Every vase carries its own variations of line and glaze.",
    ),
    images: [media.heroVase, media.tableware, media.kiln],
    specs: {
      dimensions: l("H. env. 55 cm (exemple)", "H. approx. 55 cm (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, peinte à la main, émaillée", "Wheel-thrown, hand-painted, glazed"),
      finish: l("Émail brillant", "Gloss glaze"),
      care: l("Chiffon doux et sec. Usage décoratif.", "Soft dry cloth. Decorative use."),
      leadTime: onQuote,
    },
  },
  {
    slug: "service-assiettes-zahra",
    name: l("Service d'assiettes Zahra", "Zahra plate set"),
    craft: "poterie",
    origin: safi,
    category: "art-de-la-table",
    techniques: ["tournee", "emaillee", "peinte"],
    usage: "table",
    colors: ["bleu", "terre"],
    short: l(
      "Assiettes plates et creuses aux motifs floraux.",
      "Dinner and soup plates with floral patterns.",
    ),
    story: l(
      "Un service pensé pour la table de tous les jours comme pour les grandes tablées : motifs floraux peints au pinceau, bordure laissée en terre pour souligner la matière.",
      "A set made for everyday meals as well as large gatherings: brush-painted floral patterns and an unglazed rim that lets the clay show.",
    ),
    images: [media.tableware, media.heroVase, media.handsClay],
    specs: {
      dimensions: l("Ø 18 / 24 / 28 cm (exemple)", "Ø 18 / 24 / 28 cm (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, peinte à la main", "Wheel-thrown, hand-painted"),
      finish: l("Émail compatible alimentaire (à confirmer)", "Food-safe glaze (to be confirmed)"),
      care: ceramicCare,
      leadTime: onQuote,
    },
  },
  {
    slug: "tajine-decor-bleu",
    name: l("Tajine de service décor étoilé", "Star-pattern serving tagine"),
    craft: "poterie",
    origin: safi,
    category: "art-de-la-table",
    techniques: ["tournee", "emaillee", "peinte"],
    usage: "table",
    colors: ["bleu", "vert"],
    short: l("Tajine de service au couvercle conique.", "Serving tagine with a conical lid."),
    story: l(
      "Le tajine, objet de partage par excellence, ici dans sa version de service : un couvercle conique tourné d'un seul geste et un décor étoilé qui rayonne depuis le bouton.",
      "The tagine, the ultimate sharing dish, here as a serving piece: a conical lid thrown in a single gesture and a star pattern radiating from the knob.",
    ),
    images: [media.tableware, media.kiln],
    specs: {
      dimensions: l("Ø env. 30 cm (exemple)", "Ø approx. 30 cm (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, peinte à la main", "Wheel-thrown, hand-painted"),
      finish: l("Émail brillant", "Gloss glaze"),
      care: ceramicCare,
      leadTime: onQuote,
    },
  },
  {
    slug: "bols-riad",
    name: l("Trio de bols Riad", "Riad bowl trio"),
    craft: "poterie",
    origin: safi,
    category: "art-de-la-table",
    techniques: ["tournee", "emaillee"],
    usage: "table",
    colors: ["bleu", "vert"],
    short: l(
      "Trois bols gigognes aux émaux bleu et vert.",
      "Three nesting bowls in blue and green glazes.",
    ),
    story: l(
      "Trois tailles qui s'emboîtent, trois profondeurs d'émail. Le vert de cuivre et le bleu de Safi se répondent sur une table, une console ou un plateau.",
      "Three nesting sizes, three depths of glaze. Copper green and Safi blue echo each other on a table, a console or a tray.",
    ),
    images: [media.riad, media.tableware],
    specs: {
      dimensions: l("Ø 12 / 18 / 26 cm (exemple)", "Ø 12 / 18 / 26 cm (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, émaillée", "Wheel-thrown, glazed"),
      finish: l("Émail profond", "Deep glaze"),
      care: ceramicCare,
      leadTime: onQuote,
    },
  },
  {
    slug: "jarre-terre-brute",
    name: l("Jarre en terre brute", "Raw clay jar"),
    craft: "poterie",
    origin: safi,
    category: "decoration",
    techniques: ["tournee", "brute"],
    usage: "decoration",
    colors: ["terre", "naturel"],
    short: l(
      "Jarre non émaillée, patine de cuisson au bois.",
      "Unglazed jar with a wood-fired patina.",
    ),
    story: l(
      "Ni émail ni décor : seulement la terre et la trace du feu. Cette jarre garde les nuances laissées par la cuisson au bois, du rose à l'ocre.",
      "No glaze, no decoration: only clay and the mark of the fire. This jar keeps the shades left by wood firing, from pink to ochre.",
    ),
    images: [media.kiln, media.handsClay],
    specs: {
      dimensions: l("H. env. 70 cm (exemple)", "H. approx. 70 cm (example)"),
      material: l("Argile de Safi", "Safi clay"),
      technique: l("Tournée, terre brute", "Wheel-thrown, raw clay"),
      finish: l("Mat naturel", "Natural matte"),
      care: l(
        "Intérieur ou extérieur abrité ; craint le gel.",
        "Indoors or sheltered outdoors; frost-sensitive.",
      ),
      leadTime: onQuote,
    },
  },
  {
    slug: "pichet-tourne-main",
    name: l("Pichet tourné main", "Hand-thrown pitcher"),
    craft: "poterie",
    origin: safi,
    category: "art-de-la-table",
    techniques: ["tournee", "emaillee"],
    usage: "table",
    colors: ["naturel", "bleu"],
    short: l(
      "Pichet à l'anse généreuse, émail sable ou bleu.",
      "Pitcher with a generous handle, sand or blue glaze.",
    ),
    story: l(
      "Un bec tiré au doigt, une anse posée à la main : le pichet est l'un des gestes les plus anciens du potier.",
      "A spout pulled with a finger, a handle attached by hand: the pitcher is one of the potter's oldest gestures.",
    ),
    images: [media.handsClay, media.tableware],
    specs: {
      dimensions: l("Contenance env. 1,2 L (exemple)", "Approx. 1.2 L (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, émaillée", "Wheel-thrown, glazed"),
      finish: l("Émail satiné", "Satin glaze"),
      care: ceramicCare,
      leadTime: onQuote,
    },
  },
  {
    slug: "vase-bouteille",
    name: l("Vase bouteille à bandes", "Banded bottle vase"),
    craft: "poterie",
    origin: safi,
    category: "decoration",
    techniques: ["tournee", "emaillee", "peinte"],
    usage: "decoration",
    colors: ["bleu", "ocre"],
    short: l(
      "Col étroit, panse ronde, décor en bandes concentriques.",
      "Narrow neck, round belly, concentric banded decoration.",
    ),
    story: l(
      "Les bandes sont tracées pendant que la pièce tourne encore : le pinceau reste immobile, c'est le tour qui dessine.",
      "The bands are drawn while the piece is still turning: the brush stays still and the wheel does the drawing.",
    ),
    images: [media.heroVase, media.riad],
    specs: {
      dimensions: l("H. env. 35 cm (exemple)", "H. approx. 35 cm (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, peinte à la main", "Wheel-thrown, hand-painted"),
      finish: l("Émail brillant", "Gloss glaze"),
      care: l("Chiffon doux.", "Soft cloth."),
      leadTime: onQuote,
    },
  },
  {
    slug: "plat-a-couscous",
    name: l("Grand plat à couscous", "Large couscous dish"),
    craft: "poterie",
    origin: safi,
    category: "art-de-la-table",
    techniques: ["tournee", "emaillee", "peinte"],
    usage: "table",
    colors: ["bleu", "vert", "ocre"],
    short: l(
      "Grand plat creux pour le partage, décor rosace.",
      "Large deep sharing dish with a rosette pattern.",
    ),
    story: l(
      "Au centre, une rosace ; autour, des cercles qui s'élargissent. Un plat fait pour être posé au milieu de la table.",
      "A rosette at the centre, widening circles around it. A dish made to sit in the middle of the table.",
    ),
    images: [media.tableware, media.heroVase],
    specs: {
      dimensions: l("Ø env. 40 cm (exemple)", "Ø approx. 40 cm (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, peinte à la main", "Wheel-thrown, hand-painted"),
      finish: l("Émail brillant", "Gloss glaze"),
      care: ceramicCare,
      leadTime: onQuote,
    },
  },
  {
    slug: "lampe-ceramique-safi",
    name: l("Lampe en céramique de Safi", "Safi ceramic lamp"),
    craft: "poterie",
    origin: safi,
    category: "luminaires",
    techniques: ["tournee", "emaillee"],
    usage: "luminaires",
    colors: ["vert", "naturel"],
    short: l(
      "Pied de lampe tourné, émail vert de cuivre.",
      "Wheel-thrown lamp base in copper-green glaze.",
    ),
    story: l(
      "Un pied de lampe à la courbe de jarre, couvert d'un vert de cuivre qui change selon la lumière du jour.",
      "A lamp base with the curve of a jar, covered in a copper green that shifts with daylight.",
    ),
    images: [media.riad, media.heroVase],
    specs: {
      dimensions: l(
        "H. env. 45 cm hors abat-jour (exemple)",
        "H. approx. 45 cm without shade (example)",
      ),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée, émaillée", "Wheel-thrown, glazed"),
      finish: l("Émail vert de cuivre", "Copper-green glaze"),
      care: l(
        "Chiffon sec ; électrification aux normes du pays de livraison (à confirmer).",
        "Dry cloth; wiring to destination-country standards (to be confirmed).",
      ),
      leadTime: onQuote,
    },
  },
  {
    slug: "grande-jarre-safi",
    name: l("Grande jarre de cour", "Large courtyard jar"),
    craft: "poterie",
    origin: safi,
    category: "pieces-exception",
    techniques: ["tournee", "emaillee"],
    usage: "decoration",
    colors: ["vert", "terre"],
    short: l(
      "Pièce de grand format, montée en plusieurs étapes.",
      "Large-format piece built up in several stages.",
    ),
    story: l(
      "Trop grande pour être tournée d'un coup, elle est montée par sections puis cuite avec soin. Une pièce pour un patio, un lobby, une cour de riad.",
      "Too large to be thrown in one go, it is built up in sections then carefully fired. A piece for a patio, a lobby, a riad courtyard.",
    ),
    images: [media.kiln, media.riad],
    specs: {
      dimensions: l("H. env. 110 cm (exemple)", "H. approx. 110 cm (example)"),
      material: l("Argile de Safi émaillée", "Glazed Safi clay"),
      technique: l("Tournée par sections, émaillée", "Thrown in sections, glazed"),
      finish: l("Émail coulé", "Run glaze"),
      care: l("Extérieur abrité ; craint le gel.", "Sheltered outdoors; frost-sensitive."),
      leadTime: onQuote,
    },
  },
  {
    slug: "zellige-etoile",
    name: l("Panneau de zellige Étoile", "Star zellige panel"),
    craft: "zellige",
    origin: l("Fès", "Fez"),
    category: "zellige-revetements",
    techniques: ["zellige"],
    usage: "architecture",
    colors: ["bleu", "vert", "naturel"],
    short: l("Composition étoilée, réalisée sur mesure.", "Star composition, made to measure."),
    story: l(
      "Une étoile centrale et ses rayonnements, taillés tesselle par tesselle. Format, palette et motif s'adaptent à votre mur.",
      "A central star and its radiating pattern, cut tessera by tessera. Size, palette and design adapt to your wall.",
    ),
    images: [media.zellige, media.riad],
    specs: {
      dimensions: l("Sur mesure", "Made to measure"),
      material: l("Argile émaillée", "Glazed clay"),
      technique: l("Zellige taillé main", "Hand-cut zellige"),
      finish: l("Émail brillant", "Gloss glaze"),
      care: l("Nettoyage à l'eau, produits non acides.", "Clean with water, non-acidic products."),
      leadTime: onQuote,
    },
  },
  {
    slug: "carreaux-zellige-vert",
    name: l("Carreaux de zellige vert", "Green zellige tiles"),
    craft: "zellige",
    origin: l("Fès", "Fez"),
    category: "zellige-revetements",
    techniques: ["zellige", "emaillee"],
    usage: "architecture",
    colors: ["vert"],
    short: l("Carreaux unis aux nuances irrégulières.", "Plain tiles with irregular shades."),
    story: l(
      "Chaque carreau a sa propre profondeur de vert : posés ensemble, ils donnent au mur une vibration que le carrelage industriel n'a pas.",
      "Each tile has its own depth of green: laid together, they give a wall a vibration industrial tiling lacks.",
    ),
    images: [media.zellige],
    specs: {
      dimensions: l("10 × 10 cm (exemple)", "10 × 10 cm (example)"),
      material: l("Argile émaillée", "Glazed clay"),
      technique: l("Façonné et émaillé main", "Hand-shaped and glazed"),
      finish: l("Brillant, nuancé", "Gloss, shaded"),
      care: l("Nettoyage à l'eau, produits non acides.", "Clean with water, non-acidic products."),
      leadTime: onQuote,
    },
  },
  {
    slug: "vasque-tadelakt",
    name: l("Vasque en tadelakt", "Tadelakt basin"),
    craft: "tadelakt",
    origin: l("Marrakech", "Marrakech"),
    category: "zellige-revetements",
    techniques: ["tadelakt"],
    usage: "architecture",
    colors: ["ocre", "naturel"],
    short: l(
      "Vasque polie à la pierre, teinte dans la masse.",
      "Stone-polished basin, pigmented throughout.",
    ),
    story: l(
      "Douce au toucher, satinée à l'œil : la vasque en tadelakt apporte la chaleur de la chaux dans une salle de bains.",
      "Soft to the touch, satin to the eye: a tadelakt basin brings the warmth of lime into a bathroom.",
    ),
    images: [media.riad],
    specs: {
      dimensions: l("Sur mesure", "Made to measure"),
      material: l("Chaux, pigments, savon noir", "Lime, pigments, black soap"),
      technique: l("Tadelakt poli à la pierre", "Stone-polished tadelakt"),
      finish: l("Satiné", "Satin"),
      care: l("Savon noir ; éviter les produits abrasifs.", "Black soap; avoid abrasive products."),
      leadTime: onQuote,
    },
  },
  {
    slug: "plateau-cuivre-martele",
    name: l("Plateau en cuivre martelé", "Hammered copper tray"),
    craft: "cuivre",
    origin: l("Marrakech", "Marrakech"),
    category: "cuivre-laiton",
    techniques: ["martelee", "ciselee"],
    usage: "table",
    colors: ["ocre", "terre"],
    short: l("Plateau rond martelé, bordure ciselée.", "Round hammered tray with a chased rim."),
    story: l(
      "Des milliers de coups de marteau donnent au cuivre son relief. La bordure est ciselée au burin, à main levée.",
      "Thousands of hammer blows give the copper its texture. The rim is chased by hand with a chisel.",
    ),
    images: [media.craftsMix],
    specs: {
      dimensions: l("Ø env. 60 cm (exemple)", "Ø approx. 60 cm (example)"),
      material: l("Cuivre", "Copper"),
      technique: l("Martelé et ciselé main", "Hand-hammered and chased"),
      finish: l("Patine cuivrée", "Copper patina"),
      care: l(
        "Chiffon doux ; raviver au citron et sel si besoin.",
        "Soft cloth; revive with lemon and salt if needed.",
      ),
      leadTime: onQuote,
    },
  },
  {
    slug: "suspension-laiton-ajouree",
    name: l("Suspension en laiton ajouré", "Pierced brass pendant"),
    craft: "cuivre",
    origin: l("Marrakech", "Marrakech"),
    category: "luminaires",
    techniques: ["ciselee"],
    usage: "luminaires",
    colors: ["ocre"],
    short: l(
      "Suspension ajourée au burin, motifs géométriques.",
      "Chisel-pierced pendant with geometric patterns.",
    ),
    story: l(
      "Allumée, elle dessine sur les murs le motif ciselé dans le métal. Éteinte, c'est une sculpture de laiton.",
      "Lit, it casts the pattern chased into the metal onto the walls. Unlit, it is a brass sculpture.",
    ),
    images: [media.craftsMix, media.riad],
    specs: {
      dimensions: l("Ø env. 35 cm (exemple)", "Ø approx. 35 cm (example)"),
      material: l("Laiton", "Brass"),
      technique: l("Ajouré et ciselé main", "Hand-pierced and chased"),
      finish: l("Laiton brossé", "Brushed brass"),
      care: l("Chiffon sec.", "Dry cloth."),
      leadTime: onQuote,
    },
  },
  {
    slug: "coffret-thuya",
    name: l("Coffret en thuya marqueté", "Inlaid thuya box"),
    craft: "bois",
    origin: l("Essaouira", "Essaouira"),
    category: "bois",
    techniques: ["marquetee"],
    usage: "decoration",
    colors: ["brun", "ocre"],
    short: l(
      "Coffret en loupe de thuya, incrustations de citronnier.",
      "Thuya burl box with lemon-wood inlay.",
    ),
    story: l(
      "Le veinage de la loupe de thuya rend chaque coffret différent ; le citronnier dessine le motif en clair.",
      "The grain of thuya burl makes every box different; lemon wood draws the pattern in pale tones.",
    ),
    images: [media.craftsMix],
    specs: {
      dimensions: l("22 × 14 × 12 cm (exemple)", "22 × 14 × 12 cm (example)"),
      material: l("Loupe de thuya, citronnier", "Thuya burl, lemon wood"),
      technique: l("Marqueterie main", "Hand inlay"),
      finish: l("Huilé", "Oiled"),
      care: l("Chiffon sec ; huiler de temps en temps.", "Dry cloth; oil occasionally."),
      leadTime: onQuote,
    },
  },
  {
    slug: "tapis-atlas",
    name: l("Tapis de l'Atlas", "Atlas rug"),
    craft: "tissage",
    origin: l("Atlas", "Atlas"),
    category: "tapis-textiles",
    techniques: ["tissee"],
    usage: "decoration",
    colors: ["naturel", "brun", "terre"],
    short: l(
      "Tapis noué main, laine aux teintes naturelles.",
      "Hand-knotted rug in naturally dyed wool.",
    ),
    story: l(
      "Tissé sur métier vertical, il garde les irrégularités du nouage à la main et les motifs propres à sa région.",
      "Woven on a vertical loom, it keeps the irregularities of hand-knotting and the patterns of its region.",
    ),
    images: [media.craftsMix, media.riad],
    specs: {
      dimensions: l("200 × 300 cm (exemple)", "200 × 300 cm (example)"),
      material: l("Laine", "Wool"),
      technique: l("Noué et tissé main", "Hand-knotted and woven"),
      finish: l("Naturel", "Natural"),
      care: l(
        "Aspirer sans brosse rotative ; nettoyage professionnel.",
        "Vacuum without a rotating brush; professional cleaning.",
      ),
      leadTime: onQuote,
    },
  },
  {
    slug: "pouf-cuir-fes",
    name: l("Pouf en cuir de Fès", "Fez leather pouf"),
    craft: "cuir",
    origin: l("Fès", "Fez"),
    category: "maroquinerie",
    techniques: ["tannage-vegetal"],
    usage: "decoration",
    colors: ["terre", "ocre"],
    short: l(
      "Pouf en cuir tanné végétal, cousu main.",
      "Vegetable-tanned leather pouf, hand-stitched.",
    ),
    story: l(
      "Panneaux de cuir assemblés et brodés à la main ; le cuir se patine et s'assouplit avec les années.",
      "Leather panels assembled and embroidered by hand; the leather softens and gains patina over the years.",
    ),
    images: [media.riad],
    specs: {
      dimensions: l("Ø env. 50 cm (exemple)", "Ø approx. 50 cm (example)"),
      material: l("Cuir tanné végétal", "Vegetable-tanned leather"),
      technique: l("Tannage végétal, couture main", "Vegetable tanning, hand-stitched"),
      finish: l("Cuir naturel", "Natural leather"),
      care: l("Cire ou lait pour cuir.", "Leather wax or balm."),
      leadTime: onQuote,
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
