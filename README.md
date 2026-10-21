# Ssoussi — Artisanat marocain

Showcase site for Ssoussi, a house dedicated to traditional Moroccan craftsmanship with Safi pottery
as its flagship craft. Bilingual (French default, English under `/en`), no e-commerce: every piece
leads to a quote request or WhatsApp.

This project is connected to [Lovable](https://lovable.dev/projects/5631b23a-daa1-42e0-bd91-5ec57d4456c2);
pushes to `main` sync back to the Lovable editor.

## Stack

TanStack Start (React 19, file-based routing in `src/routes/`, SSR) · Vite · TypeScript · Tailwind v4 ·
shadcn/ui · Framer Motion · Fuse.js · Lovable Cloud (Supabase).

## Where things live

| What | Where |
| --- | --- |
| Company facts (name, contact, address, stats, coordinates, video) | `src/config/site.ts` |
| Images (responsive WebP + blur placeholders) | `src/config/media.ts`, `src/assets/img/` |
| Logo variants (cut from the official logo) | `src/assets/brand/` |
| Crafts & regions, products, categories, artisans, journal, legal | `src/data/*` |
| UI strings FR / EN | `src/i18n/fr.ts`, `src/i18n/en.ts` |
| Pages (`{-$locale}` = optional `/en` prefix) | `src/routes/{-$locale}/` |
| Assistant (rule-based, client-side) | `src/chatbot/` (knowledge, engine, leads) → `src/components/chat/ChatPanel.tsx` |
| SEO helpers, sitemap | `src/lib/seo.ts`, `src/routes/sitemap[.]xml.ts` |

Sample content is marked `// CONTENU EXEMPLE À REMPLACER`; sample images `// IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE`.

## Development

```sh
npm i
npm run dev     # http://localhost:8080
npm run build
npm test
```

The assistant needs no API key. Chat leads go to the `prospects` table, which needs an anon
INSERT policy (SQL in `docs/AUDIT.md`); until then they fall back to `contacts`.
