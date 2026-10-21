import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getCraft } from "@/data/crafts";
import { products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";
export const Route=createFileRoute("/metiers/$slug")({loader:({params})=>{const c=getCraft(params.slug);if(!c)throw notFound();return c;},head:({loaderData})=>pageMeta(loaderData?.name??"Métier introuvable",loaderData?.description??"Les métiers d’art SSOUSSI."),component:Craft});
function Craft(){const c=Route.useLoaderData();return <><PageHero eyebrow={c.city} title={c.name} intro={c.description}/><div className="container-page"><img src={c.image} alt={c.name} className="max-h-[600px] w-full rounded-lg object-cover"/></div><section className="container-page py-20"><p className="eyebrow">Le temps du geste</p><h2 className="mt-4 text-5xl">De la matière à la pièce.</h2><div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{c.steps.map((s,i)=><div key={s.title} className="border-t border-border pt-5"><span className="font-display text-3xl text-clay">0{i+1}</span><h3 className="mt-3 text-3xl">{s.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p></div>)}</div></section><section className="bg-cream py-16"><div className="container-page"><h2 className="mb-8 text-4xl">Les pièces de ce métier</h2><div className="grid grid-cols-2 gap-6 md:grid-cols-4">{products.filter(p=>p.craft===c.slug).slice(0,4).map(p=><ProductCard key={p.slug} p={p}/>)}</div><Button variant="line" asChild className="mt-8"><Link to="/collections">Voir les collections</Link></Button></div></section></>;}

