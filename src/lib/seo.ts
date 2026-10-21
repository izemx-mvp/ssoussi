import { site } from "@/config/site";
import { messages } from "@/i18n";
import { localeFromPath, stripLocale, withLocale, type L, type Locale } from "@/i18n/locale";

// Default social image (public/og-image.jpg, generated from the logo). Replace with a real photo.
const ogImage = "/og-image.jpg";

export const absoluteUrl = (path: string) =>
  path.startsWith("http")
    ? path
    : `${site.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

type SeoInput = {
  /** Current pathname (with or without /en prefix). */
  pathname: string;
  title: L | string;
  description: L | string;
  image?: string | undefined;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, unknown>[];
  noindex?: boolean;
};

const pick = (v: L | string, locale: Locale) => (typeof v === "string" ? v : v[locale]);

/**
 * Per-page head: localized title + description, Open Graph, canonical, hreflang
 * alternates and JSON-LD. Use from a route's `head` with `match.pathname`.
 */
export function seo({
  pathname,
  title,
  description,
  image,
  type = "website",
  jsonLd = [],
  noindex,
}: SeoInput) {
  const locale = localeFromPath(pathname);
  const base = stripLocale(pathname);
  const t = pick(title, locale);
  const fullTitle = t.includes(site.wordmark) ? t : `${t} — ${site.wordmark}`;
  const desc = pick(description, locale);
  const url = absoluteUrl(withLocale(base, locale));
  const img = absoluteUrl(image ?? ogImage);

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: desc },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
      { property: "og:site_name", content: site.wordmark },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: desc },
      { property: "og:type", content: type === "product" ? "website" : type },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { property: "og:locale", content: locale === "fr" ? "fr_FR" : "en_GB" },
      { property: "og:locale:alternate", content: locale === "fr" ? "en_GB" : "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: img },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "fr", href: absoluteUrl(withLocale(base, "fr")) },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl(withLocale(base, "en")) },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(withLocale(base, "fr")) },
    ],
    scripts: jsonLd.map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", ...data }),
    })),
  };
}

export function organizationLd(): Record<string, unknown> {
  return {
    "@type": ["Organization", "LocalBusiness"],
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/apple-touch-icon.png"),
    image: absoluteUrl(ogImage),
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.coordinates.lat,
      longitude: site.coordinates.lon,
    },
    sameAs: Object.values(site.socials),
  };
}

/** BreadcrumbList from [label, locale-less path] pairs (home is prepended). */
export function breadcrumbLd(locale: Locale, items: [string, string][]): Record<string, unknown> {
  const all: [string, string][] = [[messages[locale].nav.home, "/"], ...items];
  return {
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(withLocale(path, locale)),
    })),
  };
}
