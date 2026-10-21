// CONTENU EXEMPLE À REMPLACER
// Crafts and regions. Heritage texts stay general; durations are indicative examples.
import { media, type Media } from "@/config/media";
import type { L } from "@/i18n/locale";

export type CraftStep = {
  title: L;
  text: L;
  tools: L[];
  duration: L; // EXEMPLE — durée indicative à valider avec les artisans
  image: Media;
  /** CSS object-position used to vary the crop of the craft's image from one step to the next. */
  focus?: string;
};

export type Craft = {
  slug: string;
  name: L;
  short: L;
  city: L;
  region: L;
  /** WGS84 coordinates for the map pin. */
  coords: { lat: number; lon: number };
  featured?: boolean;
  image: Media;
  intro: L;
  history: L[];
  materials: L[];
  steps: CraftStep[];
};

const l = (fr: string, en: string): L => ({ fr, en });

export const crafts: Craft[] = [
  {
    slug: "poterie",
    name: l("Poterie & céramique émaillée", "Pottery & glazed ceramics"),
    short: l("Poterie", "Pottery"),
    city: l("Safi", "Safi"),
    region: l("Marrakech-Safi, côte atlantique", "Marrakech-Safi, Atlantic coast"),
    coords: { lat: 32.2994, lon: -9.2372 },
    featured: true,
    image: media.craftPoterie,
    intro: l(
      "Sur la colline des potiers de Safi, l'argile de la région est tournée, séchée, cuite au four traditionnel puis émaillée et peinte à la main.",
      "On Safi's potters' hill, the region's clay is thrown, dried, fired in traditional kilns, then glazed and painted by hand.",
    ),
    history: [
      l(
        "Safi compte parmi les grands centres historiques de la céramique marocaine. Son quartier des potiers, installé sur une colline proche de la médina, réunit ateliers, séchoirs et fours.",
        "Safi is one of the great historic centres of Moroccan ceramics. Its potters' quarter, on a hill near the medina, gathers workshops, drying areas and kilns.",
      ),
      l(
        "Le savoir-faire s'y transmet traditionnellement au sein des ateliers, du maâlem (maître artisan) à l'apprenti. La ville accueille aussi un musée national de la céramique, signe de la place de ce métier dans son identité.",
        "Skills are traditionally passed on inside the workshops, from the maâlem (master craftsman) to the apprentice. The city is also home to a national ceramics museum, a sign of how central this craft is to its identity.",
      ),
      l(
        "Les décors de Safi sont reconnaissables à leurs motifs peints au pinceau — géométries, rosaces, rinceaux — et à leurs bleus profonds, aux côtés de verts, d'ocres et de pièces en terre brute.",
        "Safi decoration is recognisable by its brush-painted patterns — geometry, rosettes, scrolls — and its deep blues, alongside greens, ochres and unglazed pieces.",
      ),
    ],
    materials: [
      l("Argile de la région de Safi", "Clay from the Safi region"),
      l("Oxydes et pigments naturels", "Natural oxides and pigments"),
      l("Émaux", "Glazes"),
      l("Bois de chauffe pour le four", "Firewood for the kiln"),
    ],
    steps: [
      {
        title: l("Extraction de l'argile", "Clay extraction"),
        text: l(
          "L'argile est extraite près de Safi, puis mise à tremper et décantée pour en retirer pierres et impuretés. On obtient une pâte fine et homogène.",
          "Clay is dug near Safi, then soaked and settled to remove stones and impurities, giving a fine, even paste.",
        ),
        tools: [l("Bassins de décantation", "Settling basins"), l("Tamis", "Sieves")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.handsClay,
        focus: "20% 80%",
      },
      {
        title: l("Pétrissage", "Wedging"),
        text: l(
          "La pâte est foulée puis pétrie à la main pour chasser l'air et lui donner la plasticité nécessaire au tournage.",
          "The paste is trodden and kneaded by hand to drive out air and give it the plasticity needed for throwing.",
        ),
        tools: [l("Mains et pieds", "Hands and feet"), l("Table de pétrissage", "Wedging table")],
        duration: l("Quelques heures", "A few hours"),
        image: media.handsClay,
        focus: "50% 70%",
      },
      {
        title: l("Tournage", "Throwing"),
        text: l(
          "Au tour, le maâlem centre la motte puis monte la forme : panse, col, lèvre. Le geste est rapide, l'œil décide de la justesse des proportions.",
          "At the wheel, the maâlem centres the clay and raises the form — belly, neck, rim. The gesture is quick; the eye judges the proportions.",
        ),
        tools: [
          l("Tour de potier", "Potter's wheel"),
          l("Estèques", "Ribs"),
          l("Fil à couper", "Cutting wire"),
        ],
        duration: l("Quelques minutes par pièce", "Minutes per piece"),
        image: media.craftPoterie,
        focus: "50% 55%",
      },
      {
        title: l("Séchage", "Drying"),
        text: l(
          "Les pièces sèchent lentement, d'abord à l'ombre puis à l'air libre, pour éviter les fissures. La terre passe du brun au clair.",
          "Pieces dry slowly, first in the shade then in the open air, to avoid cracking. The clay turns from brown to pale.",
        ),
        tools: [l("Étagères de séchage", "Drying racks"), l("Air et soleil", "Air and sun")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftPoterie,
        focus: "50% 15%",
      },
      {
        title: l("Cuisson au four traditionnel", "Firing in the traditional kiln"),
        text: l(
          "Une première cuisson au four traditionnel, alimenté au bois, transforme la terre en biscuit. La conduite du feu est un savoir à part entière.",
          "A first firing in the traditional wood-fuelled kiln turns the clay into bisque. Managing the fire is a craft in itself.",
        ),
        tools: [l("Four traditionnel", "Traditional kiln"), l("Bois de chauffe", "Firewood")],
        duration: l("Une journée et une nuit", "A day and a night"),
        image: media.kiln,
        focus: "50% 50%",
      },
      {
        title: l("Émaillage & décoration", "Glazing & decoration"),
        text: l(
          "Le décor est peint au pinceau, motif après motif, puis la pièce est émaillée et repasse au four. Les couleurs ne se révèlent qu'à la sortie.",
          "Decoration is painted by brush, pattern after pattern; the piece is then glazed and fired again. The colours only appear when it leaves the kiln.",
        ),
        tools: [
          l("Pinceaux", "Brushes"),
          l("Oxydes et émaux", "Oxides and glazes"),
          l("Seconde cuisson", "Second firing"),
        ],
        duration: l("Plusieurs heures par pièce", "Hours per piece"),
        image: media.heroVase,
        focus: "50% 40%",
      },
    ],
  },
  {
    slug: "zellige",
    name: l("Zellige & céramique", "Zellige & ceramics"),
    short: l("Zellige", "Zellige"),
    city: l("Fès", "Fez"),
    region: l("Fès-Meknès", "Fès-Meknès"),
    coords: { lat: 34.0331, lon: -5.0003 },
    image: media.craftZellige,
    intro: l(
      "À Fès, des carreaux d'argile émaillée sont taillés un à un au marteau, puis assemblés en compositions géométriques d'une grande précision.",
      "In Fez, glazed clay tiles are cut one by one with a hammer, then assembled into highly precise geometric compositions.",
    ),
    history: [
      l(
        "Le zellige est l'un des arts emblématiques de l'architecture marocaine : on le retrouve sur les murs, les sols et les fontaines des médersas, palais et riads.",
        "Zellige is one of the emblematic arts of Moroccan architecture, found on the walls, floors and fountains of madrasas, palaces and riads.",
      ),
      l(
        "Fès en est un foyer réputé. Le métier repose sur un vocabulaire de formes réduit, combiné selon des règles de symétrie rigoureuses.",
        "Fez is a renowned centre for it. The craft relies on a small vocabulary of shapes combined according to strict rules of symmetry.",
      ),
    ],
    materials: [l("Argile de Fès", "Fez clay"), l("Émaux", "Glazes"), l("Mortier", "Mortar")],
    steps: [
      {
        title: l("Carreaux", "Tiles"),
        text: l(
          "Façonnage et première cuisson de carreaux d'argile.",
          "Shaping and first firing of clay tiles.",
        ),
        tools: [l("Moules", "Moulds"), l("Four", "Kiln")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftZellige,
        focus: "30% 30%",
      },
      {
        title: l("Émaillage", "Glazing"),
        text: l(
          "Application des émaux colorés, puis seconde cuisson.",
          "Coloured glazes are applied, followed by a second firing.",
        ),
        tools: [l("Émaux", "Glazes")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftZellige,
        focus: "70% 30%",
      },
      {
        title: l("Taille", "Cutting"),
        text: l(
          "Chaque tesselle est dessinée sur le carreau puis taillée au marteau tranchant, avec un biseau au revers.",
          "Each tessera is drawn on the tile then cut with a sharp hammer, bevelled on the back.",
        ),
        tools: [l("Marteau de taille", "Cutting hammer"), l("Gabarits", "Templates")],
        duration: l("Selon la composition", "Depends on the design"),
        image: media.craftZellige,
        focus: "50% 70%",
      },
      {
        title: l("Assemblage", "Assembly"),
        text: l(
          "Les tesselles sont posées face contre terre selon le motif, puis liées au revers par un mortier.",
          "Tesserae are laid face down following the pattern, then bound together from the back with mortar.",
        ),
        tools: [l("Mortier", "Mortar"), l("Plan du motif", "Pattern plan")],
        duration: l("Selon la surface", "Depends on the surface"),
        image: media.craftZellige,
        focus: "50% 50%",
      },
    ],
  },
  {
    slug: "tadelakt",
    name: l("Tadelakt", "Tadelakt"),
    short: l("Tadelakt", "Tadelakt"),
    city: l("Marrakech", "Marrakech"),
    region: l("Marrakech-Safi", "Marrakech-Safi"),
    coords: { lat: 31.6295, lon: -7.9811 },
    image: media.craftTadelakt,
    intro: l(
      "Enduit de chaux poli à la pierre et au savon noir, le tadelakt donne aux murs et aux vasques une surface douce, satinée et résistante à l'eau.",
      "A lime plaster polished with stone and black soap, tadelakt gives walls and basins a soft, satin, water-resistant surface.",
    ),
    history: [
      l(
        "Traditionnellement associé à la région de Marrakech, le tadelakt habillait hammams et bassins. Il est aujourd'hui recherché en architecture intérieure.",
        "Traditionally associated with the Marrakech region, tadelakt lined hammams and basins. It is now sought after in interior architecture.",
      ),
    ],
    materials: [
      l("Chaux", "Lime"),
      l("Pigments naturels", "Natural pigments"),
      l("Savon noir", "Black soap"),
    ],
    steps: [
      {
        title: l("Préparation de la chaux", "Preparing the lime"),
        text: l(
          "La chaux est tamisée, mouillée et laissée reposer.",
          "The lime is sieved, wetted and left to rest.",
        ),
        tools: [l("Tamis", "Sieve")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftTadelakt,
        focus: "30% 50%",
      },
      {
        title: l("Application", "Application"),
        text: l(
          "L'enduit est appliqué en couches, pigmenté dans la masse.",
          "The plaster is applied in coats, pigmented throughout.",
        ),
        tools: [l("Taloches", "Floats")],
        duration: l("Selon la surface", "Depends on the surface"),
        image: media.craftTadelakt,
        focus: "60% 50%",
      },
      {
        title: l("Polissage", "Polishing"),
        text: l(
          "Lissage à la pierre jusqu'à obtenir un éclat satiné.",
          "Smoothed with a stone until it takes on a satin sheen.",
        ),
        tools: [l("Galet de polissage", "Polishing stone")],
        duration: l("Plusieurs heures", "Several hours"),
        image: media.craftTadelakt,
        focus: "50% 70%",
      },
      {
        title: l("Savon noir", "Black soap"),
        text: l(
          "Le savon noir, réagissant avec la chaux, rend la surface résistante à l'eau.",
          "Black soap reacts with the lime and makes the surface water-resistant.",
        ),
        tools: [l("Savon noir", "Black soap")],
        duration: l("Une journée", "A day"),
        image: media.craftTadelakt,
        focus: "50% 30%",
      },
    ],
  },
  {
    slug: "cuivre",
    name: l("Dinanderie — cuivre & laiton", "Metalwork — copper & brass"),
    short: l("Cuivre", "Copper"),
    city: l("Marrakech", "Marrakech"),
    region: l("Marrakech-Safi", "Marrakech-Safi"),
    coords: { lat: 31.6295, lon: -7.9811 },
    image: media.craftTadelakt,
    intro: l(
      "Plateaux, luminaires et objets en cuivre et laiton, martelés puis ciselés au burin dans les ateliers des souks.",
      "Trays, lights and objects in copper and brass, hammered then chased by hand in the souk workshops.",
    ),
    history: [
      l(
        "La dinanderie — le travail du cuivre et du laiton — est un métier ancien des médinas marocaines, de Marrakech à Fès.",
        "Dinanderie — copper and brass work — is an old craft of Moroccan medinas, from Marrakech to Fez.",
      ),
    ],
    materials: [l("Cuivre", "Copper"), l("Laiton", "Brass")],
    steps: [
      {
        title: l("Découpe", "Cutting"),
        text: l(
          "La feuille de métal est tracée et découpée.",
          "The metal sheet is marked out and cut.",
        ),
        tools: [l("Cisailles", "Shears")],
        duration: l("Une heure", "An hour"),
        image: media.craftTadelakt,
        focus: "30% 40%",
      },
      {
        title: l("Martelage", "Hammering"),
        text: l(
          "La forme est montée au marteau sur l'enclume.",
          "The form is raised with a hammer on the anvil.",
        ),
        tools: [l("Marteaux", "Hammers"), l("Enclume", "Anvil")],
        duration: l("Plusieurs heures", "Several hours"),
        image: media.craftTadelakt,
        focus: "60% 40%",
      },
      {
        title: l("Ciselure", "Chasing"),
        text: l(
          "Les motifs sont gravés ou ajourés au burin.",
          "Patterns are engraved or pierced with a chisel.",
        ),
        tools: [l("Burins", "Chisels")],
        duration: l("Selon le décor", "Depends on the pattern"),
        image: media.craftTadelakt,
        focus: "50% 60%",
      },
      {
        title: l("Patine", "Patina"),
        text: l("Polissage et patine finale.", "Final polishing and patina."),
        tools: [l("Abrasifs", "Abrasives")],
        duration: l("Une heure", "An hour"),
        image: media.craftTadelakt,
        focus: "50% 50%",
      },
    ],
  },
  {
    slug: "bois",
    name: l("Bois de thuya", "Thuya wood"),
    short: l("Bois", "Wood"),
    city: l("Essaouira", "Essaouira"),
    region: l("Marrakech-Safi, côte atlantique", "Marrakech-Safi, Atlantic coast"),
    coords: { lat: 31.5085, lon: -9.7595 },
    image: media.craftBois,
    intro: l(
      "La loupe de thuya, aux veines profondes et au parfum boisé, travaillée et marquetée par les ébénistes d'Essaouira.",
      "Thuya burl, with its deep grain and woody scent, worked and inlaid by Essaouira's cabinetmakers.",
    ),
    history: [
      l(
        "Essaouira est réputée pour le travail du thuya, un conifère de la région dont la loupe — la souche — offre un veinage très recherché.",
        "Essaouira is known for thuya work: the burl of this local conifer offers a highly prized grain.",
      ),
    ],
    materials: [
      l("Loupe de thuya", "Thuya burl"),
      l("Citronnier", "Lemon wood"),
      l("Huiles naturelles", "Natural oils"),
    ],
    steps: [
      {
        title: l("Sélection", "Selection"),
        text: l("Choix des loupes selon leur veinage.", "Burls are chosen for their grain."),
        tools: [l("Œil de l'ébéniste", "The cabinetmaker's eye")],
        duration: l("Variable", "Varies"),
        image: media.craftBois,
        focus: "20% 50%",
      },
      {
        title: l("Débit & séchage", "Sawing & drying"),
        text: l("Découpe puis séchage lent du bois.", "The wood is cut then slowly dried."),
        tools: [l("Scies", "Saws")],
        duration: l("Plusieurs semaines", "Several weeks"),
        image: media.craftBois,
        focus: "40% 50%",
      },
      {
        title: l("Marqueterie", "Inlay"),
        text: l(
          "Incrustations de citronnier ou d'autres bois clairs.",
          "Inlays of lemon wood or other pale woods.",
        ),
        tools: [l("Gouges", "Gouges"), l("Colle", "Glue")],
        duration: l("Plusieurs heures", "Several hours"),
        image: media.craftBois,
        focus: "60% 50%",
      },
      {
        title: l("Finition", "Finishing"),
        text: l("Ponçage et huilage à la main.", "Sanding and oiling by hand."),
        tools: [l("Abrasifs", "Abrasives"), l("Huile", "Oil")],
        duration: l("Quelques heures", "A few hours"),
        image: media.craftBois,
        focus: "80% 50%",
      },
    ],
  },
  {
    slug: "tissage",
    name: l("Tissage & tapis", "Weaving & rugs"),
    short: l("Tissage", "Weaving"),
    city: l("Atlas", "Atlas"),
    region: l("Moyen et Haut Atlas", "Middle and High Atlas"),
    coords: { lat: 31.95, lon: -6.4 },
    image: media.craftTissage,
    intro: l(
      "Laine filée et teinte, tissée sur métier vertical dans les villages de l'Atlas, motif après motif.",
      "Spun and dyed wool, woven on vertical looms in Atlas villages, pattern after pattern.",
    ),
    history: [
      l(
        "Le tissage est un savoir-faire amazigh ancien, pratiqué en grande partie par des femmes. Chaque région a ses motifs, ses couleurs et ses techniques de nouage.",
        "Weaving is an old Amazigh craft, largely practised by women. Each region has its own patterns, colours and knotting techniques.",
      ),
    ],
    materials: [l("Laine", "Wool"), l("Teintures végétales", "Plant dyes")],
    steps: [
      {
        title: l("Laine", "Wool"),
        text: l("La laine est lavée et cardée.", "The wool is washed and carded."),
        tools: [l("Cardes", "Carders")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftTissage,
        focus: "30% 70%",
      },
      {
        title: l("Filage", "Spinning"),
        text: l("Filage au fuseau.", "Spun on a drop spindle."),
        tools: [l("Fuseau", "Spindle")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftTissage,
        focus: "50% 70%",
      },
      {
        title: l("Teinture", "Dyeing"),
        text: l(
          "Teinture aux pigments naturels : garance, henné, indigo…",
          "Dyed with natural pigments: madder, henna, indigo…",
        ),
        tools: [l("Bains de teinture", "Dye baths")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftTissage,
        focus: "70% 70%",
      },
      {
        title: l("Tissage", "Weaving"),
        text: l("Nouage et tissage sur métier vertical.", "Knotted and woven on a vertical loom."),
        tools: [l("Métier vertical", "Vertical loom"), l("Peigne", "Comb")],
        duration: l("Plusieurs semaines", "Several weeks"),
        image: media.craftTissage,
        focus: "50% 50%",
      },
    ],
  },
  {
    slug: "cuir",
    name: l("Cuir & maroquinerie", "Leather & leather goods"),
    short: l("Cuir", "Leather"),
    city: l("Fès", "Fez"),
    region: l("Fès-Meknès", "Fès-Meknès"),
    coords: { lat: 34.0331, lon: -5.0003 },
    image: media.craftCuir,
    intro: l(
      "Peaux tannées selon des procédés végétaux traditionnels, teintes puis cousues à la main en poufs et objets.",
      "Hides tanned with traditional plant-based methods, dyed then hand-stitched into poufs and objects.",
    ),
    history: [
      l(
        "Les tanneries de Fès, avec leurs cuves de pierre à ciel ouvert, comptent parmi les images les plus connues de l'artisanat marocain.",
        "The tanneries of Fez, with their open-air stone vats, are among the best-known images of Moroccan craftsmanship.",
      ),
    ],
    materials: [
      l("Peaux", "Hides"),
      l("Tanins végétaux", "Plant tannins"),
      l("Teintures naturelles", "Natural dyes"),
    ],
    steps: [
      {
        title: l("Tannage", "Tanning"),
        text: l(
          "Les peaux sont traitées en cuves selon des procédés traditionnels.",
          "Hides are treated in vats using traditional methods.",
        ),
        tools: [l("Cuves", "Vats")],
        duration: l("Plusieurs semaines", "Several weeks"),
        image: media.craftCuir,
        focus: "30% 50%",
      },
      {
        title: l("Teinture", "Dyeing"),
        text: l("Teinture et séchage au soleil.", "Dyed and dried in the sun."),
        tools: [l("Teintures", "Dyes")],
        duration: l("Plusieurs jours", "Several days"),
        image: media.craftCuir,
        focus: "60% 50%",
      },
      {
        title: l("Coupe & couture", "Cutting & stitching"),
        text: l("Découpe des pièces et couture à la main.", "Pieces are cut and stitched by hand."),
        tools: [l("Tranchet", "Leather knife"), l("Aiguilles", "Needles")],
        duration: l("Quelques heures", "A few hours"),
        image: media.craftCuir,
        focus: "50% 70%",
      },
    ],
  },
];

export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);

/** Crafts grouped by city, for map pins. */
export const craftCities = () => {
  const map = new Map<
    string,
    { city: L; coords: Craft["coords"]; crafts: Craft[]; featured: boolean }
  >();
  for (const c of crafts) {
    const key = c.city.fr;
    const entry = map.get(key) ?? { city: c.city, coords: c.coords, crafts: [], featured: false };
    entry.crafts.push(c);
    entry.featured ||= Boolean(c.featured);
    map.set(key, entry);
  }
  return [...map.values()];
};