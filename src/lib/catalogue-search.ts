import { categories, colors, techniques, usages } from "@/data/categories";
import { crafts } from "@/data/crafts";
import { posts, postCategories } from "@/data/posts";
import { products, type Product } from "@/data/products";
import { withLocale, type L, type Locale } from "@/i18n/locale";

/** Lowercase, strip accents and punctuation. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ");

const both = (v: L) => `${v.fr} ${v.en}`;

const STOP = new Set(
  "le la les un une des de du d l et ou en pour avec sur a au aux je cherche voudrais the a an of for with and or in on to i im looking piece pieces".split(
    " ",
  ),
);

const tokens = (q: string) =>
  normalize(q)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    // crude singular: "assiettes" → "assiette", "bowls" → "bowl"
    .map((w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w));

export function productHaystack(p: Product) {
  const craft = crafts.find((c) => c.slug === p.craft);
  const cat = categories.find((c) => c.slug === p.category);
  return normalize(
    [
      both(p.name),
      both(p.short),
      both(p.story),
      both(p.origin),
      cat ? both(cat.name) : "",
      craft ? `${both(craft.name)} ${both(craft.short)} ${craft.slug}` : "",
      p.techniques.map((t) => both(techniques[t])).join(" "),
      both(usages[p.usage]),
      p.colors.map((c) => both(colors[c].label)).join(" "),
      p.category,
      p.slug.replace(/-/g, " "),
    ].join(" "),
  );
}

const score = (hay: string, words: string[]) =>
  words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);

export type CatalogueFilters = {
  query?: string | undefined;
  craft?: string | undefined;
  origin?: string | undefined;
  category?: string | undefined;
  usage?: string | undefined;
};

/** Search sample products. Empty query + no filters returns a featured selection. */
export function searchProducts(f: CatalogueFilters, limit = 6) {
  const words = tokens(f.query ?? "");
  const match = (p: Product) => {
    if (
      f.craft &&
      normalize(f.craft) !== p.craft &&
      !productHaystack(p).includes(normalize(f.craft))
    )
      return false;
    if (f.origin && !normalize(both(p.origin)).includes(normalize(f.origin))) return false;
    if (
      f.category &&
      p.category !== f.category &&
      !normalize(
        both(categories.find((c) => c.slug === p.category)?.name ?? { fr: "", en: "" }),
      ).includes(normalize(f.category))
    )
      return false;
    if (
      f.usage &&
      p.usage !== f.usage &&
      !normalize(both(usages[p.usage])).includes(normalize(f.usage))
    )
      return false;
    return true;
  };
  const ranked = products
    .filter(match)
    .map((p) => ({ p, s: words.length ? score(productHaystack(p), words) : 1 }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return ranked.slice(0, limit).map((x) => x.p);
}

export function searchPosts(query: string, limit = 3) {
  const words = tokens(query);
  return posts
    .map((p) => ({
      p,
      s: words.length
        ? score(
            normalize(
              [
                both(p.title),
                both(p.excerpt),
                both(postCategories[p.category]),
                ...p.body.map((b) => both(b.text)),
              ].join(" "),
            ),
            words,
          )
        : 1,
    }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

/** Compact, serialisable card data sent to the chat UI. */
export type ProductCardData = {
  slug: string;
  category: string;
  name: string;
  subtitle: string;
  image: string;
  url: string;
};
export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  url: string;
};

export function toProductCard(p: Product, locale: Locale): ProductCardData {
  const craft = crafts.find((c) => c.slug === p.craft);
  return {
    slug: p.slug,
    category: p.category,
    name: p.name[locale],
    subtitle: `${craft ? craft.short[locale] : ""} · ${p.origin[locale]}`,
    image: p.images[0]?.src ?? "",
    url: withLocale(`/collections/${p.category}/${p.slug}`, locale),
  };
}

export function toPostCard(p: (typeof posts)[number], locale: Locale): PostCardData {
  return {
    slug: p.slug,
    title: p.title[locale],
    excerpt: p.excerpt[locale],
    image: p.image.src,
    url: withLocale(`/journal/${p.slug}`, locale),
  };
}
