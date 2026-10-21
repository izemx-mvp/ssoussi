import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  categories,
  colors,
  techniques,
  usages,
  type Color,
  type Technique,
  type Usage,
} from "@/data/categories";
import { crafts } from "@/data/crafts";
import { products } from "@/data/products";
import { useI18n } from "@/i18n";
import { normalize, productHaystack } from "@/lib/catalogue-search";
import { cn } from "@/lib/utils";
import { SelectInput } from "./FormKit";
import { ProductCard } from "./ProductCard";

type Filters = {
  craft: string;
  origin: string;
  category: string;
  technique: "" | Technique;
  usage: "" | Usage;
  color: "" | Color;
  q: string;
};

const EMPTY: Omit<Filters, "category"> = {
  craft: "",
  origin: "",
  technique: "",
  usage: "",
  color: "",
  q: "",
};

export function CollectionsBrowser({ category }: { category?: string }) {
  const { t, l } = useI18n();
  const reduce = useReducedMotion();
  const [f, setF] = useState<Filters>({ ...EMPTY, category: category ?? "" });
  const [panel, setPanel] = useState(false);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((s) => ({ ...s, [k]: v }));

  const origins = useMemo(
    () => Array.from(new Map(products.map((p) => [p.origin.fr, p.origin])).values()),
    [],
  );
  const usedTechniques = useMemo(
    () =>
      (Object.keys(techniques) as Technique[]).filter((k) =>
        products.some((p) => p.techniques.includes(k)),
      ),
    [],
  );

  const filtered = useMemo(() => {
    const words = normalize(f.q).split(/\s+/).filter(Boolean);
    return products.filter(
      (p) =>
        (!f.craft || p.craft === f.craft) &&
        (!f.origin || p.origin.fr === f.origin) &&
        (!f.category || p.category === f.category) &&
        (!f.technique || p.techniques.includes(f.technique)) &&
        (!f.usage || p.usage === f.usage) &&
        (!f.color || p.colors.includes(f.color)) &&
        (words.length === 0 || words.every((w) => productHaystack(p).includes(w))),
    );
  }, [f]);

  const active = Object.entries(f).filter(([k, v]) => v && !(k === "category" && category)).length;
  const reset = () => setF({ ...EMPTY, category: category ?? "" });

  const selects = (
    <>
      <SelectInput
        aria-label={t.collections.craft}
        value={f.craft}
        onChange={(e) => set("craft", e.target.value)}
        className="h-11 rounded-full text-sm"
      >
        <option value="">
          {t.collections.craft} — {t.collections.all}
        </option>
        {crafts.map((c) => (
          <option key={c.slug} value={c.slug}>
            {l(c.short)}
          </option>
        ))}
      </SelectInput>
      <SelectInput
        aria-label={t.collections.origin}
        value={f.origin}
        onChange={(e) => set("origin", e.target.value)}
        className="h-11 rounded-full text-sm"
      >
        <option value="">
          {t.collections.origin} — {t.collections.all}
        </option>
        {origins.map((o) => (
          <option key={o.fr} value={o.fr}>
            {l(o)}
          </option>
        ))}
      </SelectInput>
      {!category && (
        <SelectInput
          aria-label={t.collections.category}
          value={f.category}
          onChange={(e) => set("category", e.target.value)}
          className="h-11 rounded-full text-sm"
        >
          <option value="">
            {t.collections.category} — {t.collections.all}
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {l(c.name)}
            </option>
          ))}
        </SelectInput>
      )}
      <SelectInput
        aria-label={t.collections.technique}
        value={f.technique}
        onChange={(e) => set("technique", e.target.value as Filters["technique"])}
        className="h-11 rounded-full text-sm"
      >
        <option value="">
          {t.collections.technique} — {t.collections.all}
        </option>
        {usedTechniques.map((k) => (
          <option key={k} value={k}>
            {l(techniques[k])}
          </option>
        ))}
      </SelectInput>
      <SelectInput
        aria-label={t.collections.usage}
        value={f.usage}
        onChange={(e) => set("usage", e.target.value as Filters["usage"])}
        className="h-11 rounded-full text-sm"
      >
        <option value="">
          {t.collections.usage} — {t.collections.all}
        </option>
        {(Object.keys(usages) as Usage[]).map((k) => (
          <option key={k} value={k}>
            {l(usages[k])}
          </option>
        ))}
      </SelectInput>
    </>
  );

  const colorChips = (
    <div
      role="group"
      aria-label={t.collections.color}
      className="flex flex-wrap items-center gap-2"
    >
      {(Object.keys(colors) as Color[]).map((k) => {
        const on = f.color === k;
        return (
          <button
            key={k}
            type="button"
            aria-pressed={on}
            onClick={() => set("color", on ? "" : k)}
            className={cn(
              "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-medium transition-colors",
              on
                ? "border-safi bg-safi text-cream"
                : "border-border bg-cream text-ink/80 hover:border-ochre",
            )}
          >
            <span
              className="size-5 rounded-full border border-ink/10"
              style={{ background: colors[k].swatch }}
              aria-hidden
            />
            {l(colors[k].label)}
          </button>
        );
      })}
    </div>
  );

  return (
    <section className="pb-24">
      {/* Sticky filter bar */}
      <div className="sticky top-[4.5rem] z-30 border-y border-border bg-sand/95 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-sand/85">
        <div className="container-page flex items-center gap-3">
          <div className="relative min-w-0 flex-1 lg:max-w-xs">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder={t.collections.search}
              aria-label={t.collections.searchLabel}
              className="h-11 w-full rounded-full border border-input bg-cream pl-10 pr-4 text-sm focus-visible:border-clay-deep focus-visible:outline-none"
            />
          </div>
          <div className="hidden flex-1 grid-cols-5 gap-2 lg:grid">{selects}</div>
          <button
            type="button"
            onClick={() => setPanel((p) => !p)}
            aria-expanded={panel}
            aria-controls="filters-panel"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-safi/30 px-4 text-sm font-semibold text-safi lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            {t.collections.filters}
            {active > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-clay-deep text-[0.65rem] text-cream">
                {active}
              </span>
            )}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {panel && (
            <motion.div
              id="filters-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="container-page grid gap-2 pt-3 sm:grid-cols-2">{selects}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          {colorChips}
          <div className="flex items-center gap-4 text-sm">
            <p className="text-muted-foreground" aria-live="polite">
              {t.common.pieces(filtered.length)}
            </p>
            {active > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 font-semibold text-clay-deep"
              >
                <X className="size-4" aria-hidden /> {t.collections.reset}
              </button>
            )}
          </div>
        </div>

        <LayoutGroup>
          <motion.ul
            layout={!reduce}
            className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.li
                  key={p.slug}
                  layout={!reduce}
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <ProductCard p={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-3xl text-safi">{t.collections.empty}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full border border-safi/30 px-6 py-3 text-sm font-semibold text-safi hover:bg-safi hover:text-cream"
            >
              {t.collections.reset}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
