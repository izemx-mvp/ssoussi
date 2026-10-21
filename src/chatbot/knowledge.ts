// CONTENU EXEMPLE À REMPLACER
// Rule-based assistant knowledge. Answers stay general: no prices, stock or exact lead times.
// Contact facts are read from src/config/site.ts and craft texts from src/data/crafts.ts only.
import { site } from "@/config/site";
import { crafts, getCraft } from "@/data/crafts";
import type { L } from "@/i18n/locale";

/** Request types offered in the inline lead form (labels come from `t.form.types`). */
export const requestTypes = ["particulier", "professionnel", "export", "visite", "presse"] as const;
export type RequestType = (typeof requestTypes)[number];

/** `href` is locale-less ("/collections"); the panel adds the current locale. */
export type ChatAction =
  | { type: "link"; href: string; label: L }
  | { type: "lead"; requestType?: RequestType }
  | { type: "quote" }
  | { type: "whatsapp" };

export type Intent = {
  id: string;
  /** Chip label when the intent is offered as a quick reply. */
  label: L;
  /** Normalised on load (lowercase, no accents). Multi-word entries match as phrases. */
  keywords: { fr: string[]; en: string[]; darija?: string[] };
  /** Simple markdown: **bold**, [label](/path), "- " lists, blank line = new paragraph. */
  answer: L;
  quickReplies?: string[];
  action?: ChatAction[];
  /** Show matching catalogue cards when the message also names a piece, craft, colour or city. */
  cards?: boolean;
  /** Show journal cards. */
  posts?: boolean;
};

const l = (fr: string, en: string): L => ({ fr, en });

const hours = (lang: "fr" | "en") =>
  site.hours
    .map((h) => `- ${h.days[lang]} : ${typeof h.time === "string" ? h.time : h.time[lang]}`)
    .join("\n");

const link = (href: string, fr: string, en: string): ChatAction => ({
  type: "link",
  href,
  label: l(fr, en),
});

/** Craft intents reuse the editorial intro from crafts.ts so the bot never contradicts the site. */
function craftIntent(
  slug: string,
  keywords: Intent["keywords"],
  quickReplies: string[] = ["fabrication", "catalogue", "quote"],
): Intent {
  const c = getCraft(slug)!;
  return {
    id: `craft-${slug}`,
    label: c.short,
    keywords,
    answer: l(
      `**${c.name.fr}** — ${c.city.fr}\n\n${c.intro.fr}\n\n[Découvrir le métier](/metiers/${slug})`,
      `**${c.name.en}** — ${c.city.en}\n\n${c.intro.en}\n\n[Discover the craft](/metiers/${slug})`,
    ),
    quickReplies,
    cards: true,
  };
}

const pottery = getCraft("poterie")!;
const potteryHistory = (lang: "fr" | "en") => pottery.history.map((p) => p[lang]).join("\n\n");
const potterySteps = (lang: "fr" | "en") =>
  pottery.steps.map((s, i) => `${i + 1}. **${s.title[lang]}** — ${s.text[lang]}`).join("\n");
const craftList = (lang: "fr" | "en") =>
  crafts.map((c) => `- **${c.short[lang]}** — ${c.city[lang]}`).join("\n");

export const intents: Intent[] = [
  // — Conversation —
  {
    id: "greeting",
    label: l("Bonjour", "Hello"),
    keywords: {
      fr: ["bonjour", "bonsoir", "salut", "coucou", "allo"],
      en: ["hello", "hi", "hey", "good morning", "good evening"],
      darija: ["salam", "slm", "salamo alaykom", "labas", "ahlan", "marhba"],
    },
    answer: l(
      "Bonjour et bienvenue chez **Ssoussi** ! Je peux vous présenter nos métiers, vous guider dans les collections ou préparer une demande de devis. Que cherchez-vous ?",
      "Hello and welcome to **Ssoussi**! I can introduce our crafts, guide you through the collections or help you prepare a quote request. What are you looking for?",
    ),
    quickReplies: ["about", "catalogue", "b2b", "quote"],
  },
  {
    id: "thanks",
    label: l("Merci", "Thanks"),
    keywords: {
      fr: ["merci", "merci beaucoup", "super", "parfait", "au revoir", "bonne journee"],
      en: ["thanks", "thank you", "great", "perfect", "bye", "goodbye", "cheers"],
      darija: ["chokran", "choukran", "shukran", "chokrane", "bslama", "baraka allah fik", "mzyan"],
    },
    answer: l(
      "Avec plaisir ! Si une autre question vous vient, je suis là. Pour un échange direct, notre équipe répond aussi sur WhatsApp.",
      "You're welcome! If another question comes up, I'm here. For a direct conversation, our team also answers on WhatsApp.",
    ),
    quickReplies: ["catalogue", "contact"],
  },

  // — Brand & heritage —
  {
    id: "about",
    label: l("Qui est Ssoussi ?", "Who is Ssoussi?"),
    keywords: {
      fr: [
        "ssoussi",
        "qui etes vous",
        "qui est",
        "votre histoire",
        "votre entreprise",
        "a propos",
        "presentation",
        "atelier ssoussi",
      ],
      en: ["who are you", "about you", "your story", "your company", "about ssoussi", "who is"],
      darija: ["chkoun ntouma", "chkon ntoma", "achno hiya ssoussi"],
    },
    answer: l(
      `${site.mission.fr}\n\nLa poterie de **Safi** est notre métier phare, aux côtés d'autres savoir-faire du Maroc.\n\n[Lire notre histoire](/atelier)`,
      `${site.mission.en}\n\n**Safi** pottery is our flagship craft, alongside other Moroccan skills.\n\n[Read our story](/atelier)`,
    ),
    quickReplies: ["safi-history", "crafts", "visit"],
  },
  {
    id: "safi-history",
    label: l("Histoire de la poterie de Safi", "History of Safi pottery"),
    keywords: {
      fr: [
        "safi",
        "histoire",
        "poterie de safi",
        "colline des potiers",
        "potier",
        "potiers",
        "tradition",
        "patrimoine",
        "origine",
      ],
      en: [
        "history",
        "safi pottery",
        "potters hill",
        "potter",
        "potters",
        "heritage",
        "tradition",
        "origin",
      ],
      darija: ["asfi", "lfekhar", "fekhar", "fokhar", "tarikh"],
    },
    answer: l(
      `${potteryHistory("fr")}\n\n[La poterie de Safi en détail](/metiers/poterie)`,
      `${potteryHistory("en")}\n\n[Safi pottery in detail](/metiers/poterie)`,
    ),
    quickReplies: ["fabrication", "craft-poterie", "catalogue"],
    cards: true,
  },
  {
    id: "fabrication",
    label: l("Étapes de fabrication", "How it's made"),
    keywords: {
      fr: [
        "fabrication",
        "fabrique",
        "fabriquee",
        "etapes",
        "comment est faite",
        "comment est fabriquee",
        "tour",
        "cuisson",
        "four",
        "emaillage",
        "processus",
      ],
      en: [
        "how is it made",
        "how are they made",
        "made",
        "making",
        "steps",
        "process",
        "wheel",
        "firing",
        "kiln",
        "glazing",
      ],
      darija: ["kifach katsaybo", "kifach kaydiro", "sna3a", "san3a"],
    },
    answer: l(
      `Une pièce de Safi passe entre plusieurs mains :\n\n${potterySteps("fr")}\n\nLes durées varient selon la pièce et la saison.\n\n[Voir le savoir-faire](/savoir-faire)`,
      `A Safi piece passes through several pairs of hands:\n\n${potterySteps("en")}\n\nTimings vary with the piece and the season.\n\n[See the know-how](/savoir-faire)`,
    ),
    quickReplies: ["handmade", "visit", "catalogue"],
  },
  {
    id: "crafts",
    label: l("Nos artisanats", "Our crafts"),
    keywords: {
      fr: [
        "artisanat",
        "artisanats",
        "metiers",
        "metier",
        "savoir faire",
        "quels produits",
        "que proposez vous",
        "que faites vous",
      ],
      en: ["crafts", "craft", "craftsmanship", "what do you make", "what do you offer", "products"],
      darija: ["achno 3ndkom", "chno kayn", "sina3a taqlidiya"],
    },
    answer: l(
      `Nous travaillons avec des ateliers de plusieurs régions du Maroc :\n\n${craftList("fr")}\n\n[Tous les métiers](/metiers)`,
      `We work with workshops from several regions of Morocco:\n\n${craftList("en")}\n\n[All crafts](/metiers)`,
    ),
    quickReplies: [
      "craft-zellige",
      "craft-tadelakt",
      "craft-bois",
      "craft-cuivre",
      "craft-tissage",
      "craft-cuir",
    ],
  },
  craftIntent("poterie", {
    fr: ["poterie", "ceramique", "argile", "terre cuite", "faience"],
    en: ["pottery", "ceramic", "ceramics", "clay", "earthenware"],
    darija: ["fekhar", "lfekhar", "tin"],
  }),
  craftIntent("zellige", {
    fr: ["zellige", "zelliges", "mosaique", "carreaux", "carrelage"],
    en: ["zellige", "mosaic", "tiles", "tile"],
    darija: ["zlij", "zellij", "zliij"],
  }),
  craftIntent("tadelakt", {
    fr: ["tadelakt", "enduit", "chaux", "salle de bain", "hammam"],
    en: ["tadelakt", "plaster", "lime plaster", "bathroom", "hammam"],
    darija: ["tadlakt", "jir"],
  }),
  craftIntent("bois", {
    fr: ["bois", "thuya", "marqueterie", "ebenisterie", "essaouira"],
    en: ["wood", "wooden", "thuya", "thuja", "marquetry", "inlay", "essaouira"],
    darija: ["l3oud", "khchab", "souira"],
  }),
  craftIntent("cuivre", {
    fr: ["cuivre", "laiton", "dinanderie", "lanterne", "luminaire", "lampe", "plateau"],
    en: ["copper", "brass", "metalwork", "lantern", "lamp", "lighting", "tray"],
    darija: ["nhas", "n7as", "fanar"],
  }),
  craftIntent("tissage", {
    fr: ["tissage", "tapis", "laine", "berbere", "kilim", "textile", "atlas"],
    en: ["weaving", "rug", "rugs", "carpet", "wool", "berber", "kilim", "textile", "atlas"],
    darija: ["zerbiya", "zrabi", "hanbel", "souf"],
  }),
  craftIntent("cuir", {
    fr: ["cuir", "maroquinerie", "babouche", "babouches", "pouf", "tannerie"],
    en: ["leather", "leatherwork", "slippers", "babouche", "pouf", "tannery"],
    darija: ["jeld", "lbelgha", "belgha", "dbagh"],
  }),
  {
    id: "handmade",
    label: l("Fait main & authenticité", "Handmade & authenticity"),
    keywords: {
      fr: [
        "fait main",
        "authentique",
        "authenticite",
        "artisanal",
        "industriel",
        "vrai",
        "original",
        "unique",
        "imperfection",
        "variation",
      ],
      en: [
        "handmade",
        "hand made",
        "authentic",
        "authenticity",
        "genuine",
        "industrial",
        "unique",
        "imperfection",
        "variation",
      ],
      darija: ["bliyed", "bl yed", "sna3a dyal yed"],
    },
    answer: l(
      "Chaque pièce est façonnée à la main par des artisans marocains. C'est pourquoi deux pièces ne sont jamais tout à fait identiques : de légères variations de forme, de trait ou d'émail font partie de leur caractère, ce ne sont pas des défauts.",
      "Every piece is shaped by hand by Moroccan artisans. That's why no two pieces are ever quite identical: slight variations in shape, line or glaze are part of their character, not flaws.",
    ),
    quickReplies: ["fabrication", "catalogue", "visit"],
    cards: true,
  },

  // — Catalogue & ordering —
  {
    id: "catalogue",
    label: l("Voir le catalogue", "Browse the catalogue"),
    keywords: {
      fr: [
        "catalogue",
        "collection",
        "collections",
        "produits",
        "pieces",
        "je cherche",
        "vous avez",
        "avez vous",
        "modele",
        "modeles",
        "acheter",
      ],
      en: [
        "catalogue",
        "catalog",
        "collection",
        "collections",
        "products",
        "pieces",
        "looking for",
        "do you have",
        "buy",
        "models",
      ],
      darija: ["bghit", "kayn", "kayna", "3ndkom", "andkom", "nchri", "nchouf"],
    },
    answer: l(
      "Nos collections réunissent art de la table, décoration, zellige, luminaires, bois, textiles et cuir. Dites-moi une pièce, une couleur ou une ville et je vous montre quelques exemples.\n\n[Parcourir les collections](/collections)",
      "Our collections cover tableware, decoration, zellige, lighting, wood, textiles and leather. Tell me a piece, a colour or a city and I'll show you a few examples.\n\n[Browse the collections](/collections)",
    ),
    quickReplies: ["quote", "custom", "b2b"],
    cards: true,
  },
  {
    id: "prices",
    label: l("Prix", "Prices"),
    keywords: {
      fr: [
        "prix",
        "tarif",
        "tarifs",
        "combien",
        "cout",
        "coute",
        "cher",
        "budget",
        "grille tarifaire",
      ],
      en: [
        "price",
        "prices",
        "pricing",
        "how much",
        "cost",
        "costs",
        "expensive",
        "budget",
        "rate",
      ],
      darija: ["chhal", "ch7al", "bchhal", "b ch7al", "taman", "thaman", "flous", "chhal taman"],
    },
    answer: l(
      "Nous n'affichons pas de prix : chaque pièce étant faite main, le tarif dépend du modèle, des dimensions, de la finition, des quantités et de la destination.\n\nLe plus simple est de demander un **devis personnalisé** — gratuit et sans engagement.",
      "We don't display prices: since every piece is handmade, the price depends on the model, dimensions, finish, quantities and destination.\n\nThe simplest way is to ask for a **personalised quote** — free and with no obligation.",
    ),
    quickReplies: ["quote", "minimum", "export"],
    action: [{ type: "quote" }],
    cards: true,
  },
  {
    id: "quote",
    label: l("Demander un devis", "Request a quote"),
    keywords: {
      fr: [
        "devis",
        "demande de devis",
        "cotation",
        "proposition",
        "commander",
        "commande",
        "passer commande",
        "offre",
      ],
      en: ["quote", "quotation", "estimate", "order", "place an order", "proposal", "offer"],
      darija: ["devi", "bghit ncommandi", "ncommandi", "talab"],
    },
    answer: l(
      "Avec plaisir. Indiquez-nous la ou les pièces, les quantités et la destination : notre équipe vous prépare un devis personnalisé.\n\nVous pouvez remplir le formulaire de devis, ou laisser vos coordonnées ici pour être recontacté.",
      "With pleasure. Tell us the piece(s), quantities and destination: our team will prepare a personalised quote.\n\nYou can fill in the quote form, or leave your details here to be contacted.",
    ),
    quickReplies: ["custom", "export", "lead-time"],
    action: [{ type: "quote" }, { type: "lead" }],
    cards: true,
  },
  {
    id: "custom",
    label: l("Sur-mesure", "Custom orders"),
    keywords: {
      fr: [
        "sur mesure",
        "personnalise",
        "personnalisation",
        "personnaliser",
        "special",
        "logo",
        "couleur specifique",
        "dimensions specifiques",
        "reproduire",
        "prototype",
        "en serie",
      ],
      en: [
        "custom",
        "bespoke",
        "made to measure",
        "personalised",
        "personalized",
        "customise",
        "customize",
        "logo",
        "prototype",
        "reproduce",
      ],
      darija: ["3la qyas", "3la l9yas", "khass", "bghit chi haja khassa"],
    },
    answer: l(
      "Oui, nous accompagnons les projets sur-mesure : formes, dimensions, couleurs ou décors. Une pièce peut être reproduite en série à partir d'un prototype validé — chaque exemplaire restant fait main, de légères variations font partie de son caractère.\n\nDécrivez-nous votre projet et nous revenons vers vous.",
      "Yes, we support custom projects: shapes, dimensions, colours or decoration. A piece can be reproduced in series from an approved prototype — each one is still handmade, so slight variations are part of its character.\n\nDescribe your project and we'll get back to you.",
    ),
    quickReplies: ["b2b", "lead-time", "quote"],
    action: [{ type: "lead", requestType: "professionnel" }],
  },
  {
    id: "b2b",
    label: l("Professionnels (hôtels, riads…)", "Trade (hotels, riads…)"),
    keywords: {
      fr: [
        "professionnel",
        "professionnels",
        "pro",
        "hotel",
        "hotels",
        "riad",
        "riads",
        "restaurant",
        "architecte",
        "architectes",
        "decorateur",
        "revendeur",
        "revendeurs",
        "boutique",
        "concept store",
        "grossiste",
        "b2b",
        "entreprise",
        "projet",
      ],
      en: [
        "trade",
        "professional",
        "business",
        "hotel",
        "hotels",
        "riad",
        "restaurant",
        "architect",
        "architects",
        "interior designer",
        "reseller",
        "retailer",
        "wholesale",
        "wholesaler",
        "shop",
        "store",
        "b2b",
        "project",
      ],
      darija: ["chari", "lhotel", "mta3 lkhedma", "tajir"],
    },
    answer: l(
      "Nous travaillons avec les **hôtels, riads, restaurants, architectes, décorateurs et revendeurs** : sélection de pièces, séries, sur-mesure et accompagnement à l'export.\n\n[Espace professionnels](/professionnels)",
      "We work with **hotels, riads, restaurants, architects, interior designers and retailers**: curated pieces, series, custom work and export support.\n\n[Trade area](/professionnels)",
    ),
    quickReplies: ["minimum", "custom", "export"],
    action: [{ type: "lead", requestType: "professionnel" }],
  },
  {
    id: "minimum",
    label: l("Quantités minimum", "Minimum quantities"),
    keywords: {
      fr: [
        "minimum",
        "quantite minimum",
        "quantite minimale",
        "moq",
        "quantites",
        "quantite",
        "volume",
        "en gros",
        "une seule piece",
        "a l unite",
      ],
      en: [
        "minimum",
        "minimum order",
        "moq",
        "quantity",
        "quantities",
        "volume",
        "bulk",
        "single piece",
        "one piece",
      ],
      darija: ["9alil", "qalil", "bzaf", "ch7al men wa7ed", "l9al"],
    },
    answer: l(
      "Cela dépend du métier et de la pièce. Indiquez-nous vos besoins : nous vous dirons ce qui est réalisable et dans quelles conditions.",
      "It depends on the craft and the piece. Tell us what you need: we'll let you know what's feasible and on what terms.",
    ),
    quickReplies: ["b2b", "quote", "lead-time"],
    action: [{ type: "lead", requestType: "professionnel" }],
  },
  {
    id: "export",
    label: l("Export & livraison", "Export & delivery"),
    keywords: {
      fr: [
        "livraison",
        "livrer",
        "livrez",
        "expedition",
        "expedier",
        "export",
        "exporter",
        "international",
        "etranger",
        "france",
        "europe",
        "usa",
        "transport",
        "douane",
        "frais de port",
      ],
      en: [
        "delivery",
        "deliver",
        "shipping",
        "ship",
        "export",
        "international",
        "abroad",
        "worldwide",
        "europe",
        "usa",
        "transport",
        "customs",
        "freight",
      ],
      darija: ["tawsil", "twsil", "tsifat", "sifat", "lkharij", "l khārij"],
    },
    answer: l(
      "Oui, nous accompagnons les envois au Maroc et à l'export. Les modalités et les coûts de transport sont précisés dans le devis, selon la destination et le volume.",
      "Yes, we support shipments within Morocco and for export. Shipping terms and costs are set out in the quote, depending on destination and volume.",
    ),
    quickReplies: ["packaging", "lead-time", "quote"],
    action: [{ type: "lead", requestType: "export" }],
  },
  {
    id: "lead-time",
    label: l("Délais", "Lead times"),
    keywords: {
      fr: [
        "delai",
        "delais",
        "combien de temps",
        "quand",
        "duree",
        "rapidement",
        "urgent",
        "disponible",
        "disponibilite",
        "stock",
        "en stock",
      ],
      en: [
        "lead time",
        "lead times",
        "how long",
        "when",
        "delay",
        "fast",
        "urgent",
        "available",
        "availability",
        "stock",
        "in stock",
      ],
      darija: ["imta", "fo9ach", "foqach", "ch7al dyal lwe9t", "chhal dyal lwaqt", "mojoud"],
    },
    answer: l(
      "Les délais varient selon la pièce, la quantité et la saison — et nous ne gérons pas de stock en ligne. Nous vous communiquons un calendrier précis avec le devis.",
      "Lead times vary with the piece, the quantity and the season — and we don't manage online stock. We'll give you a precise schedule with the quote.",
    ),
    quickReplies: ["quote", "export"],
    action: [{ type: "quote" }],
  },
  {
    id: "packaging",
    label: l("Emballage", "Packaging"),
    keywords: {
      fr: ["emballage", "emballer", "emballe", "protection", "casse", "fragile", "carton", "colis"],
      en: [
        "packaging",
        "packing",
        "packed",
        "protection",
        "breakage",
        "broken",
        "fragile",
        "box",
        "parcel",
      ],
      darija: ["tghlif", "kartona", "ytherres", "therres"],
    },
    answer: l(
      "Les pièces faites main sont fragiles : le conditionnement est adapté à chaque pièce et à la destination, et il est détaillé dans le devis. N'hésitez pas à nous préciser vos contraintes (palettes, emballage individuel…).",
      "Handmade pieces are fragile: packaging is adapted to each piece and destination, and is detailed in the quote. Feel free to tell us your requirements (pallets, individual packaging…).",
    ),
    quickReplies: ["export", "quote"],
  },
  {
    id: "payment",
    label: l("Paiement", "Payment"),
    keywords: {
      fr: ["paiement", "payer", "carte", "virement", "acompte", "facture", "reglement"],
      en: ["payment", "pay", "card", "bank transfer", "wire", "deposit", "invoice"],
      darija: ["khlas", "nkhalas", "kifach nkhalas", "virma"],
    },
    answer: l(
      "Le site ne propose pas de paiement en ligne. Les conditions et moyens de paiement sont indiqués dans votre devis.",
      "The website doesn't take online payments. Payment terms and methods are set out in your quote.",
    ),
    quickReplies: ["quote", "contact"],
  },

  // — Care & use —
  {
    id: "care-ceramic",
    label: l("Entretien céramique", "Ceramic care"),
    keywords: {
      fr: [
        "entretien",
        "entretenir",
        "nettoyer",
        "nettoyage",
        "laver",
        "lavage",
        "entretien ceramique",
        "entretien poterie",
      ],
      en: [
        "care",
        "clean",
        "cleaning",
        "wash",
        "washing",
        "maintain",
        "maintenance",
        "ceramic care",
      ],
      darija: ["ngessel", "nghassel", "tnaddaf", "kifach nhafed"],
    },
    answer: l(
      "Pour la céramique : lavage à la main, eau tiède et savon doux. Évitez les chocs thermiques (passer du froid au très chaud) et les éponges abrasives sur les décors peints.\n\nChaque fiche produit précise l'entretien de la pièce.",
      "For ceramics: hand wash in warm water with mild soap. Avoid thermal shocks (going from cold to very hot) and abrasive sponges on painted decoration.\n\nEach product page gives the care for that piece.",
    ),
    quickReplies: ["care-tajine", "oven", "care-wood", "care-copper"],
    cards: true,
  },
  {
    id: "care-tajine",
    label: l("Utiliser un tajine", "Using a tagine"),
    keywords: {
      fr: ["tajine", "tagine", "culotter", "premiere utilisation", "cuisiner", "feu", "gaz"],
      en: [
        "tagine",
        "tajine",
        "season",
        "seasoning",
        "first use",
        "cook",
        "cooking",
        "stove",
        "gas",
      ],
      darija: ["tjine", "tajin", "tayb", "ntayeb"],
    },
    answer: l(
      "Conseils généraux pour un tajine en terre :\n\n- Faites-le tremper dans l'eau avant la première utilisation.\n- Chauffez progressivement, à feu doux, idéalement avec un diffuseur.\n- Évitez les chocs thermiques : ne le posez pas chaud sur une surface froide.\n\nTous nos tajines ne sont pas destinés à la cuisson (certains sont décoratifs) : vérifiez l'usage sur la fiche produit ou demandez-nous.",
      "General tips for a clay tagine:\n\n- Soak it in water before first use.\n- Heat gradually over a low flame, ideally with a diffuser.\n- Avoid thermal shocks: don't set it down hot on a cold surface.\n\nNot every tagine is meant for cooking (some are decorative): check the intended use on the product page or ask us.",
    ),
    quickReplies: ["oven", "care-ceramic"],
    cards: true,
  },
  {
    id: "care-wood",
    label: l("Entretien du bois", "Wood care"),
    keywords: {
      fr: ["entretien bois", "bois sec", "huile", "huiler", "cire"],
      en: ["wood care", "oil", "oiling", "wax", "dry wood"],
      darija: ["zit", "dhen"],
    },
    answer: l(
      "Pour le bois (thuya, marqueterie) : un chiffon doux et sec suffit au quotidien. Évitez l'eau stagnante, le soleil direct prolongé et les sources de chaleur. Une fine couche d'huile ou de cire adaptée de temps en temps lui garde son éclat.",
      "For wood (thuya, marquetry): a soft dry cloth is enough day to day. Avoid standing water, long direct sunlight and heat sources. A thin coat of suitable oil or wax now and then keeps its sheen.",
    ),
    quickReplies: ["craft-bois", "care-copper"],
  },
  {
    id: "care-copper",
    label: l("Entretien du cuivre", "Copper care"),
    keywords: {
      fr: ["entretien cuivre", "oxydation", "noircit", "terni", "patine", "briller", "polir"],
      en: ["copper care", "tarnish", "tarnished", "oxidation", "patina", "polish", "shine"],
      darija: ["kaykhal", "yseddi"],
    },
    answer: l(
      "Le cuivre et le laiton se patinent naturellement avec le temps. Pour retrouver leur éclat, frottez avec un chiffon doux et un mélange citron + sel ou vinaigre + farine, puis rincez et séchez bien. Évitez les produits abrasifs sur les pièces ciselées.",
      "Copper and brass develop a natural patina over time. To bring back their shine, rub with a soft cloth and lemon + salt or vinegar + flour, then rinse and dry well. Avoid abrasive products on chased pieces.",
    ),
    quickReplies: ["craft-cuivre", "care-wood"],
  },
  {
    id: "oven",
    label: l("Four, lave-vaisselle, alimentaire ?", "Oven, dishwasher, food-safe?"),
    keywords: {
      fr: [
        "four",
        "micro onde",
        "micro ondes",
        "lave vaisselle",
        "alimentaire",
        "contact alimentaire",
        "plomb",
        "sans plomb",
        "toxique",
        "sain",
      ],
      en: [
        "oven",
        "microwave",
        "dishwasher",
        "dishwasher safe",
        "food safe",
        "food-safe",
        "lead",
        "lead free",
        "toxic",
        "safe to eat",
      ],
      darija: ["lfour", "makla", "nakoul fih", "nwakal"],
    },
    answer: l(
      "Cela dépend de chaque pièce. Par précaution, nous recommandons le **lavage à la main** plutôt que le lave-vaisselle pour préserver les décors peints.\n\nL'usage au four, au micro-ondes ou au contact alimentaire est précisé **pièce par pièce** : certaines sont purement décoratives. Vérifiez la fiche produit ou demandez-nous avant utilisation.",
      "It depends on each piece. As a precaution, we recommend **hand washing** rather than the dishwasher to protect painted decoration.\n\nOven, microwave and food-contact use is confirmed **piece by piece**: some are purely decorative. Check the product page or ask us before use.",
    ),
    quickReplies: ["care-ceramic", "care-tajine", "contact"],
    cards: true,
  },

  // — Visiting & contact —
  {
    id: "visit",
    label: l("Visiter l'atelier", "Visit the atelier"),
    keywords: {
      fr: ["visite", "visiter", "venir", "rendez vous", "atelier", "showroom", "voir les artisans"],
      en: [
        "visit",
        "visiting",
        "come",
        "appointment",
        "atelier",
        "workshop",
        "showroom",
        "meet the artisans",
      ],
      darija: ["nji", "nzour", "nzorkom", "zyara"],
    },
    answer: l(
      `Oui, l'atelier se visite **sur rendez-vous**. C'est souvent la meilleure façon de choisir matières et finitions.\n\nAdresse : ${site.address.full.fr}\n\n[L'atelier](/atelier)`,
      `Yes, the atelier can be visited **by appointment**. It's often the best way to choose materials and finishes.\n\nAddress: ${site.address.full.en}\n\n[The atelier](/atelier)`,
    ),
    quickReplies: ["address", "contact"],
    action: [{ type: "lead", requestType: "visite" }],
  },
  {
    id: "address",
    label: l("Adresse & horaires", "Address & hours"),
    keywords: {
      fr: [
        "adresse",
        "ou etes vous",
        "ou se trouve",
        "localisation",
        "situe",
        "horaires",
        "horaire",
        "ouvert",
        "ouverture",
        "heures",
        "itineraire",
      ],
      en: [
        "address",
        "where are you",
        "where is",
        "location",
        "located",
        "hours",
        "opening hours",
        "open",
        "opening",
        "map",
        "directions",
      ],
      darija: ["fin", "fine", "fin kaynin", "fin ntouma", "fin jaya", "waqt", "m7loul", "mhloul"],
    },
    answer: l(
      `**Adresse** : ${site.address.full.fr}\n\n**Horaires**\n${hours("fr")}\n\n[Voir sur la page contact](/contact)`,
      `**Address**: ${site.address.full.en}\n\n**Opening hours**\n${hours("en")}\n\n[See the contact page](/contact)`,
    ),
    quickReplies: ["visit", "contact"],
  },
  {
    id: "contact",
    label: l("Contact & WhatsApp", "Contact & WhatsApp"),
    keywords: {
      fr: [
        "contact",
        "contacter",
        "joindre",
        "telephone",
        "appeler",
        "numero",
        "email",
        "mail",
        "whatsapp",
        "parler a quelqu un",
        "conseiller",
        "humain",
      ],
      en: [
        "contact",
        "reach",
        "phone",
        "call",
        "number",
        "email",
        "mail",
        "whatsapp",
        "talk to someone",
        "human",
        "agent",
      ],
      darija: ["nmra", "ra9m", "raqm", "nttasel", "ntassel", "wtsap", "watsap", "whatsap"],
    },
    answer: l(
      `Vous pouvez nous joindre :\n\n- **Téléphone** : ${site.phone}\n- **Email** : ${site.email}\n- **WhatsApp** : bouton ci-dessous\n\n[Page contact](/contact)`,
      `You can reach us:\n\n- **Phone**: ${site.phone}\n- **Email**: ${site.email}\n- **WhatsApp**: button below\n\n[Contact page](/contact)`,
    ),
    quickReplies: ["address", "quote"],
    action: [{ type: "whatsapp" }, { type: "lead" }],
  },
  {
    id: "socials",
    label: l("Réseaux sociaux", "Social media"),
    keywords: {
      fr: [
        "instagram",
        "facebook",
        "pinterest",
        "linkedin",
        "reseaux sociaux",
        "reseaux",
        "suivre",
        "insta",
      ],
      en: [
        "instagram",
        "facebook",
        "pinterest",
        "linkedin",
        "social media",
        "socials",
        "follow",
        "insta",
      ],
      darija: ["insta", "fb", "face"],
    },
    answer: l(
      `Suivez Ssoussi :\n\n- [Instagram](${site.socials.instagram})\n- [Facebook](${site.socials.facebook})\n- [Pinterest](${site.socials.pinterest})\n- [LinkedIn](${site.socials.linkedin})`,
      `Follow Ssoussi:\n\n- [Instagram](${site.socials.instagram})\n- [Facebook](${site.socials.facebook})\n- [Pinterest](${site.socials.pinterest})\n- [LinkedIn](${site.socials.linkedin})`,
    ),
    quickReplies: ["journal", "contact"],
  },
  {
    id: "journal",
    label: l("Le journal", "The journal"),
    keywords: {
      fr: [
        "journal",
        "blog",
        "article",
        "articles",
        "lire",
        "recit",
        "reportage",
        "conseils deco",
        "decoration interieure",
      ],
      en: [
        "journal",
        "blog",
        "article",
        "articles",
        "read",
        "story",
        "stories",
        "decor tips",
        "interior",
      ],
      darija: ["maqal", "nqra"],
    },
    answer: l(
      "Dans le journal : reportages d'ateliers, histoire de Safi, conseils de décoration et d'entretien. Quelques lectures :",
      "In the journal: workshop stories, the history of Safi, decoration and care tips. A few reads:",
    ),
    quickReplies: ["safi-history", "care-ceramic"],
    action: [link("/journal", "Tout le journal", "The whole journal")],
    posts: true,
  },
  {
    id: "press",
    label: l("Presse & partenariats", "Press & partnerships"),
    keywords: {
      fr: [
        "presse",
        "journaliste",
        "media",
        "interview",
        "partenariat",
        "partenaire",
        "collaboration",
        "collaborer",
        "influenceur",
        "evenement",
        "salon",
      ],
      en: [
        "press",
        "journalist",
        "media",
        "interview",
        "partnership",
        "partner",
        "collaboration",
        "collaborate",
        "influencer",
        "event",
        "fair",
      ],
      darija: ["shafi", "s7afa", "chraka"],
    },
    answer: l(
      "Merci de votre intérêt ! Pour une demande presse, un partenariat ou une collaboration, laissez-nous quelques mots sur votre projet et nous revenons vers vous.",
      "Thank you for your interest! For a press request, partnership or collaboration, leave us a few words about your project and we'll get back to you.",
    ),
    quickReplies: ["about", "contact"],
    action: [{ type: "lead", requestType: "presse" }],
  },
  {
    id: "artisan-partner",
    label: l("Devenir artisan partenaire", "Become a partner artisan"),
    keywords: {
      fr: [
        "devenir artisan",
        "artisan partenaire",
        "je suis artisan",
        "travailler avec vous",
        "rejoindre",
        "recrutement",
        "emploi",
        "candidature",
        "mon atelier",
      ],
      en: [
        "become an artisan",
        "partner artisan",
        "i am an artisan",
        "i m an artisan",
        "work with you",
        "join",
        "recruitment",
        "job",
        "apply",
        "my workshop",
      ],
      darija: ["ana sanay3", "ana m3allem", "bghit nkhdem m3akom", "khdma"],
    },
    answer: l(
      "Vous êtes artisan et souhaitez travailler avec Ssoussi ? Présentez-nous votre métier, votre ville et quelques pièces : notre équipe vous recontacte.",
      "Are you an artisan who would like to work with Ssoussi? Tell us about your craft, your city and a few pieces: our team will get back to you.",
    ),
    quickReplies: ["about", "contact"],
    action: [{ type: "lead", requestType: "professionnel" }, { type: "whatsapp" }],
  },
];

export const getIntent = (id: string) => intents.find((i) => i.id === id);

/** Chips shown on the welcome message. */
export const welcomeChips = ["fabrication", "crafts", "catalogue", "b2b", "visit"];

/** Chips shown after a miss. */
export const fallbackChips = ["catalogue", "quote", "b2b", "contact"];

export const fallback = {
  first: l(
    "Je ne suis pas sûr d'avoir bien compris. Pouvez-vous reformuler, ou choisir un sujet ci-dessous ?",
    "I'm not sure I understood. Could you rephrase, or pick a topic below?",
  ),
  repeated: l(
    "Je suis un assistant automatique et je n'ai pas de réponse précise à cette question. Le plus rapide est d'écrire à notre équipe sur **WhatsApp** — votre question est déjà pré-remplie — ou de laisser vos coordonnées pour être recontacté.",
    "I'm an automated assistant and don't have a precise answer to that. The quickest way is to message our team on **WhatsApp** — your question is already filled in — or to leave your details so we can contact you.",
  ),
  products: l(
    "Voici quelques pièces qui correspondent. Chaque pièce est faite main : les prix et délais sont communiqués sur devis.",
    "Here are a few matching pieces. Every piece is handmade: prices and lead times are given by quote.",
  ),
};
