import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getPost, posts } from "@/data/posts";
import { PageHero } from "@/components/site/PageHero";
import { PostCard } from "@/components/site/PostCard";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";
export const Route=createFileRoute("/journal/$slug")({loader:({params})=>{const p=getPost(params.slug);if(!p)throw notFound();return p;},head:({loaderData})=>pageMeta(loaderData?.title??"Article introuvable",loaderData?.excerpt??"Le journal AFUS."),component:Article});
function Article(){const p=Route.useLoaderData();return <><PageHero eyebrow={`${p.category} · ${new Date(p.date).toLocaleDateString("fr-FR")}`} title={p.title} intro={p.excerpt}/><div className="container-page"><img src={p.image} alt={p.title} className="aspect-[16/8] w-full rounded-lg object-cover"/></div><article className="mx-auto max-w-3xl space-y-7 px-5 py-16 text-lg leading-relaxed text-muted-foreground">{p.body.map((text,i)=><p key={i}>{text}</p>)}<Button variant="line" asChild><Link to="/journal">Retour au journal</Link></Button></article><section className="container-page pb-20"><h2 className="mb-8 text-4xl">À lire aussi</h2><div className="grid gap-8 md:grid-cols-2">{posts.filter(x=>x.slug!==p.slug).map(x=><PostCard key={x.slug} post={x}/>)}</div></section></>;}

