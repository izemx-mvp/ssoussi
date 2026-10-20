import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CraftCard } from "@/components/site/CraftCard";
import { crafts } from "@/data/crafts";
import { pageMeta } from "@/lib/seo";
export const Route=createFileRoute("/metiers/")({head:()=>pageMeta("Métiers d’art", "Découvrez la poterie de Safi, le zellige de Fès, le cuivre, le thuya et le tissage marocain."),component:()=> <><PageHero eyebrow="Le Maroc des artisans" title="Cinq métiers, une même passion." intro="De la colline des potiers aux villages de l’Atlas, chaque territoire possède son langage de formes, de matières et de gestes."/><section className="container-page grid gap-x-8 gap-y-12 pb-24 md:grid-cols-2 lg:grid-cols-3">{crafts.map(c=><CraftCard key={c.slug} craft={c}/>)}</section></>});
