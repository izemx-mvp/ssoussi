// Rule-based matching: keyword scoring + Fuse.js fuzzy matching. 100% client-side.
import Fuse from "fuse.js";

import { categories, colors, techniques } from "@/data/categories";
import { crafts } from "@/data/crafts";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import type { L, Locale } from "@/i18n/locale";
import { productHaystack } from "@/lib/catalogue-search";
import {
  fallback,
  fallbackChips,
  getIntent,
  intents,
  type ChatAction,
  type Intent,
} from "./knowledge";

/** Lowercase, strip accents and punctuation, collapse spaces. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Crude FR/EN singular: "assiettes" → "assiett", "assiette" → "assiett", "bowls" → "bowl". */
const stem = (w: string) => {
  let s = w;
  if (s.length > 3 && /[sx]$/.test(s)) s = s.slice(0, -1);
  if (s.length > 4 && s.endsWith("e")) s = s.slice(0, -1);
  return s;
};

const words = (s: string) => normalize(s).split(" ").filter(Boolean).map(stem);

// ——— Intent index ———

type Compiled = { intent: Intent; words: Set<string>; phrases: string[][] };

const compiled: Compiled[] = intents.map((intent) => {
  const all = [...intent.keywords.fr, ...intent.keywords.en, ...(intent.keywords.darija ?? [])];
  const single = new Set<string>();
  const phrases: string[][] = [];
  for (const k of all) {
    const w = words(k);
    if (w.length === 1) single.add(w[0]!);
    else if (w.length > 1) phrases.push(w);
  }
  return { intent, words: single, phrases };
});

const fuzzyIntents = new Fuse(
  compiled.flatMap((c) =>
    [...c.words].filter((w) => w.length >= 5).map((w) => ({ w, id: c.intent.id })),
  ),
  { keys: ["w"], threshold: 0.25, includeScore: true, ignoreLocation: true },
);

/** Greetings and thanks only win when nothing more specific matched. */
const SOCIAL = new Set(["greeting", "thanks"]);
const MIN_SCORE = 1;

const hasPhrase = (tokens: string[], phrase: string[]) => {
  for (let i = 0; i + phrase.length <= tokens.length; i++)
    if (phrase.every((p, j) => tokens[i + j] === p)) return true;
  return false;
};

export function matchIntent(input: string): { intent: Intent; score: number } | null {
  const tokens = words(input);
  if (!tokens.length) return null;
  const scores = new Map<string, number>();
  const add = (id: string, n: number) => scores.set(id, (scores.get(id) ?? 0) + n);
  const known = new Set<string>();

  for (const c of compiled) {
    for (const t of tokens)
      if (c.words.has(t)) {
        add(c.intent.id, 2);
        known.add(t);
      }
    for (const p of c.phrases)
      if (hasPhrase(tokens, p)) {
        add(c.intent.id, 1.5 * p.length);
        p.forEach((w) => known.add(w));
      }
  }
  // Typos: "zelige", "potterie", "livraision"…
  for (const t of tokens) {
    if (t.length < 5 || known.has(t)) continue;
    const seen = new Set<string>();
    for (const r of fuzzyIntents.search(t, { limit: 6 })) {
      if (seen.has(r.item.id)) continue;
      seen.add(r.item.id);
      // A close misspelling counts almost like the exact word (exact = 2).
      add(r.item.id, 2 * (1 - (r.score ?? 0)));
    }
  }

  let best: { intent: Intent; score: number } | null = null;
  for (const c of compiled) {
    let s = scores.get(c.intent.id) ?? 0;
    if (SOCIAL.has(c.intent.id)) s *= 0.5;
    if (s >= MIN_SCORE && (!best || s > best.score)) best = { intent: c.intent, score: s };
  }
  // A lone "bonjour" scores 1 after the social discount: still a match.
  return best;
}

// ——— Language ———

const FR = new Set(
  "je j vous est les des pour quel quelle quels quelles comment bonjour bonsoir merci avez une un du de la le et ou sur combien prix livraison salut votre vos peut faire cherche voudrais est ce qu que".split(
    " ",
  ),
);
const EN = new Set(
  "i you the is are what how do does hello hi hey thanks thank can want your a an of for with and where which price delivery looking my me need would like please".split(
    " ",
  ),
);
const DARIJA = new Set(
  "wach wash bghit bgha bghina chhal ch7al bchhal fin fine kifach kifax chno achno 3afak afak dyal dial mzyan labas salam slm kayn kayna kaynin wa7ed bzaf nta nti ana chi hna daba imta 3ndkom andkom ndir khoya khti smahli chokran choukran shukran bslama wakha ghir rah".split(
    " ",
  ),
);

export type DetectedLang = Locale | "darija";

export function detectLang(input: string, pageLocale: Locale): DetectedLang {
  const raw = normalize(input).split(" ");
  let fr = /[àâçéèêëîïôûùüÿœ]/i.test(input) ? 1 : 0;
  let en = 0;
  let dj = 0;
  for (const w of raw) {
    if (DARIJA.has(w)) dj++;
    if (FR.has(w)) fr++;
    if (EN.has(w)) en++;
  }
  if (dj > 0 && dj >= Math.max(fr, en)) return "darija";
  if (fr === en) return pageLocale;
  return fr > en ? "fr" : "en";
}

/** Darija (Latin letters) is answered in French on French pages, in English on /en pages. */
export const answerLang = (d: DetectedLang, pageLocale: Locale): Locale =>
  d === "darija" ? pageLocale : d;

// ——— Catalogue & journal search ———

const both = (v: L) => `${v.fr} ${v.en}`;
const GENERIC = new Set(
  "main hand made fait piece pieces maroc morocco moroccan marocain marocaine artisan artisans avec with pour for sans grand grande petit petite large small".split(
    " ",
  ),
);

/** Words that name a piece, category, craft, colour, technique or city. */
const entityWords = new Set(
  [
    ...products.flatMap((p) => [both(p.name), both(p.origin)]),
    ...categories.map((c) => both(c.name)),
    ...crafts.flatMap((c) => [both(c.name), both(c.short), both(c.city), c.slug]),
    ...Object.values(colors).map((c) => both(c.label)),
    ...Object.values(techniques).map(both),
  ]
    .flatMap(words)
    .filter((w) => w.length >= 4 && !GENERIC.has(w)),
);

const productFuse = new Fuse(
  products.map((p) => {
    const craft = crafts.find((c) => c.slug === p.craft);
    const cat = categories.find((c) => c.slug === p.category);
    return {
      slug: p.slug,
      name: normalize(both(p.name)),
      craft: craft ? normalize(`${both(craft.name)} ${both(craft.short)}`) : "",
      category: cat ? normalize(both(cat.name)) : "",
      origin: normalize(both(p.origin)),
      colors: normalize(p.colors.map((c) => both(colors[c].label)).join(" ")),
      techniques: normalize(p.techniques.map((t) => both(techniques[t])).join(" ")),
    };
  }),
  {
    keys: [
      { name: "name", weight: 3 },
      { name: "craft", weight: 2 },
      { name: "category", weight: 2 },
      { name: "origin", weight: 2 },
      { name: "colors", weight: 1.5 },
      { name: "techniques", weight: 1 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true,
  },
);

const haystacks = new Map(products.map((p) => [p.slug, words(productHaystack(p)).join(" ")]));

/** Entity words the message mentions (exact or close spelling). */
function mentionedEntities(input: string) {
  return words(input).filter(
    (t) =>
      t.length >= 4 &&
      !GENERIC.has(t) &&
      (entityWords.has(t) || [...entityWords].some((e) => e.length >= 5 && near(t, e))),
  );
}

/** One edit apart (typo tolerance for entity detection). */
function near(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export function searchCatalogue(input: string, limit = 3, craft?: string): string[] {
  const terms = mentionedEntities(input);
  const score = new Map<string, number>();
  const add = (slug: string, n: number) => score.set(slug, (score.get(slug) ?? 0) + n);
  for (const t of terms) {
    for (const [slug, hay] of haystacks) if (hay.split(" ").includes(t)) add(slug, 2);
    for (const r of productFuse.search(t, { limit: 10 })) add(r.item.slug, 1 - (r.score ?? 0));
  }
  if (craft) for (const p of products) if (p.craft === craft) add(p.slug, terms.length ? 0.5 : 1);
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
}

const postFuse = new Fuse(
  posts.map((p) => ({
    slug: p.slug,
    title: normalize(both(p.title)),
    excerpt: normalize(both(p.excerpt)),
  })),
  {
    keys: [
      { name: "title", weight: 2 },
      { name: "excerpt", weight: 1 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
  },
);

export function searchJournal(input: string, limit = 3): string[] {
  const hits = new Set<string>();
  for (const t of words(input).filter((w) => w.length >= 4 && !GENERIC.has(w)))
    for (const r of postFuse.search(t, { limit })) hits.add(r.item.slug);
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).map((p) => p.slug);
  return [...hits, ...latest.filter((s) => !hits.has(s))].slice(0, limit);
}

// ——— Replies ———

export type BotReply = {
  lang: Locale;
  text: string;
  intentId?: string;
  quickReplies: string[];
  products: string[];
  posts: string[];
  actions: ChatAction[];
  kind: "answer" | "fallback" | "fallback-strong";
  /** The visitor's question, used to pre-fill WhatsApp. */
  question?: string;
};

export function replyForIntent(intent: Intent, lang: Locale, input = ""): BotReply {
  const craft = intent.id.startsWith("craft-")
    ? intent.id.slice(6)
    : intent.id === "safi-history"
      ? "poterie"
      : undefined;
  const showCards = intent.cards && (craft || mentionedEntities(input).length > 0);
  return {
    lang,
    text: intent.answer[lang],
    intentId: intent.id,
    quickReplies: intent.quickReplies ?? [],
    products: showCards ? searchCatalogue(input, 3, craft) : [],
    posts: intent.posts ? searchJournal(input) : [],
    actions: intent.action ?? [],
    kind: "answer",
    ...(input ? { question: input } : {}),
  };
}

export function replyForIntentId(id: string, lang: Locale): BotReply | null {
  const intent = getIntent(id);
  return intent ? replyForIntent(intent, lang) : null;
}

/** Answer a free-text message. `misses` = consecutive unanswered messages before this one. */
export function respond(input: string, pageLocale: Locale, misses: number): BotReply {
  const lang = answerLang(detectLang(input, pageLocale), pageLocale);
  const match = matchIntent(input);
  if (match) return replyForIntent(match.intent, lang, input);

  const found = searchCatalogue(input);
  if (found.length)
    return {
      lang,
      text: fallback.products[lang],
      quickReplies: ["quote", "custom", "catalogue"],
      products: found,
      posts: [],
      actions: [],
      kind: "answer",
      question: input,
    };

  const strong = misses + 1 >= 2;
  return {
    lang,
    text: (strong ? fallback.repeated : fallback.first)[lang],
    quickReplies: strong ? [] : fallbackChips,
    products: [],
    posts: [],
    actions: [{ type: "whatsapp" }, { type: "lead" }],
    kind: strong ? "fallback-strong" : "fallback",
    question: input,
  };
}
