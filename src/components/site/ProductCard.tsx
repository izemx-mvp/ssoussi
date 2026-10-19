import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/collections/$slug" params={{ slug: p.slug }} className="group block">
      <div className="lift overflow-hidden rounded-[2rem] bg-cream">
        <img src={p.image} alt={p.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <p className="eyebrow mt-4 text-ochre">{p.origin} · {p.category}</p>
      <h3 className="mt-1 text-2xl">{p.name}</h3>
    </Link>
  );
}
