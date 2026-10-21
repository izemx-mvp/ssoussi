import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PostCard } from "@/components/site/PostCard";
import { posts } from "@/data/posts";
import { pageMeta } from "@/lib/seo";
export const Route=createFileRoute("/journal/")({head:()=>pageMeta("Journal", "Reportages d’ateliers, savoir-faire et inspirations : le journal de l’artisanat marocain par SSOUSSI."),component:()=> <><PageHero eyebrow="Récits, regards, rencontres" title="Le journal SSOUSSI" intro="Un voyage dans les ateliers, les matières et les intérieurs qui font vivre l’artisanat marocain."/><section className="container-page grid gap-10 pb-24 md:grid-cols-3">{posts.map(p=><PostCard key={p.slug} post={p}/>)}</section></>});
