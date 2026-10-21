import { createFileRoute } from "@tanstack/react-router";

import { categories } from "@/data/categories";
import { crafts } from "@/data/crafts";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { withLocale } from "@/i18n/locale";
import { absoluteUrl } from "@/lib/seo";

const STATIC = [
  "/",
  "/savoir-faire",
  "/metiers",
  "/collections",
  "/atelier",
  "/professionnels",
  "/journal",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
];

function urlEntry(path: string, lastmod?: string) {
  const fr = absoluteUrl(withLocale(path, "fr"));
  const en = absoluteUrl(withLocale(path, "en"));
  const alternates = `<xhtml:link rel="alternate" hreflang="fr" href="${fr}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${fr}"/>`;
  const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
  return [fr, en].map((loc) => `<url><loc>${loc}</loc>${mod}${alternates}</url>`).join("");
}

// GET /sitemap.xml — generated from the shared data modules, both languages.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths: [string, string?][] = [
          ...STATIC.map((p): [string] => [p]),
          ...crafts.map((c): [string] => [`/metiers/${c.slug}`]),
          ...categories.map((c): [string] => [`/collections/${c.slug}`]),
          ...products.map((p): [string] => [`/collections/${p.category}/${p.slug}`]),
          ...posts.map((p): [string, string] => [`/journal/${p.slug}`, p.date]),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${paths
          .map(([p, d]) => urlEntry(p, d))
          .join("")}</urlset>`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
