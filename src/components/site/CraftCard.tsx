import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Craft } from "@/data/crafts";
export function CraftCard({ craft }: { craft: Craft }) {
  return <Link to="/metiers/$slug" params={{ slug: craft.slug }} className="group block"><div className="overflow-hidden rounded-lg"><img src={craft.image} alt={craft.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="mt-4 flex items-center justify-between gap-3"><div><p className="eyebrow">{craft.city}</p><h3 className="mt-2 text-3xl">{craft.name}</h3></div><ArrowUpRight className="size-5 text-clay" /></div></Link>;
}