import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, categories } from "@/data/products";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/collections/")({ head: () => pageMeta("Collections", "Vases, art de la table, textile et objets artisanaux du Maroc. Découvrez les pièces AFUS et demandez un devis."), component: Collections });
function Collections() {
 const [category,setCategory]=useState("Toutes"); const [search,setSearch]=useState("");
 const filtered=products.filter(p => (category==="Toutes" || p.category===category) && `${p.name} ${p.origin}`.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")));
 return <><PageHero eyebrow="La collection AFUS" title="Des pièces de caractère." intro="Argile, laine, cuivre, bois. Des objets façonnés à la main, à choisir pour leur matière et leur histoire." /><section className="container-page pb-24"><div className="flex flex-wrap items-center justify-between gap-6 border-y border-border py-5"><div className="flex flex-wrap gap-2">{["Toutes",...categories].map(c=><Button key={c} variant={category===c?"safi":"ghost"} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</Button>)}</div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground"/><Input aria-label="Rechercher une pièce" placeholder="Rechercher une pièce…" value={search} onChange={e=>setSearch(e.target.value)} className="pl-9"/></div></div><p className="my-6 text-sm text-muted-foreground">{filtered.length} pièce{filtered.length>1?"s":""}</p><div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{filtered.map(p=><ProductCard key={p.slug} p={p}/>)}</div>{filtered.length===0&&<div className="py-16 text-center"><p>Aucune pièce ne correspond à votre recherche.</p><Button variant="line" className="mt-5" onClick={()=>{setCategory("Toutes");setSearch("");}}>Réinitialiser</Button></div>}</section></>;
}
