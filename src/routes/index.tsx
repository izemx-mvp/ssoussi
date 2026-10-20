import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/site/FadeUp";
import { ProductCard } from "@/components/site/ProductCard";
import { CraftCard } from "@/components/site/CraftCard";
import { PostCard } from "@/components/site/PostCard";
import { useQuote } from "@/components/site/QuoteDialog";
import { products } from "@/data/products";
import { crafts } from "@/data/crafts";
import { posts } from "@/data/posts";
import { pageMeta } from "@/lib/seo";
import hero from "@/assets/hero-vase.jpg";
import hands from "@/assets/hands-clay.jpg";
import riad from "@/assets/riad.jpg";
export const Route = createFileRoute("/")({
  head: () => pageMeta("AFUS · Artisanat marocain", "De Safi aux ateliers du Maroc, découvrez des pièces façonnées à la main et des collections pour vos projets."),
  component: Index,
});
function Index() {
  const { open } = useQuote();
  return <>
    <section className="relative mt-20 min-h-[560px] overflow-hidden bg-safi md:h-[min(720px,78svh)]">
      <img src={hero} alt="Vase de céramique bleue de Safi" className="absolute inset-0 size-full object-cover object-[65%_50%]" fetchPriority="high" />
      <div className="absolute inset-0 bg-ink/35" />
      <div className="container-page relative flex min-h-[560px] flex-col justify-center py-20 md:h-full">
        <FadeUp><p className="text-xs font-medium uppercase text-cream">ⴰⴼⵓⵙ · La main, à l’origine de tout</p><h1 className="mt-6 text-7xl text-cream md:text-8xl">AFUS</h1><p className="mt-3 font-display text-4xl text-cream md:text-5xl">Artisanat marocain</p><p className="mt-6 max-w-md text-base leading-relaxed text-cream">Des mains qui transmettent. Des matières qui racontent. Des pièces qui traversent le temps.</p><Button variant="lineLight" size="xl" asChild className="mt-9"><Link to="/collections">Explorer les collections <ArrowRight /></Link></Button></FadeUp>
        <div className="absolute bottom-7 left-5 flex items-center gap-3 text-xs text-cream md:left-10"><ArrowDown className="size-4" /> De Safi au reste du monde</div>
      </div>
    </section>
    <section className="container-page grid items-center gap-12 py-20 md:grid-cols-2 md:py-28"><FadeUp><p className="eyebrow">La matière, la main, la mémoire</p><h2 className="mt-5 text-5xl md:text-6xl">L’empreinte<br />d’un savoir-faire.</h2><p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">Une courbe tournée dans l’argile, un motif peint au pinceau, la lumière d’un émail. AFUS célèbre les gestes et les métiers qui donnent à l’artisanat marocain son caractère singulier.</p><Button variant="line" asChild className="mt-7"><Link to="/savoir-faire">Notre savoir-faire <ArrowRight /></Link></Button></FadeUp><img src={hands} alt="Les mains d’un artisan façonnant l’argile au tour" loading="lazy" className="aspect-[5/4] w-full rounded-lg object-cover" /></section>
    <section className="bg-cream py-20"><div className="container-page"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Une terre, mille expressions</p><h2 className="mt-4 text-5xl">Nos métiers d’art</h2></div><Button variant="link" asChild><Link to="/metiers">Tous les métiers <ArrowRight /></Link></Button></div><div className="grid gap-8 md:grid-cols-3">{crafts.slice(0,3).map(c => <CraftCard key={c.slug} craft={c} />)}</div></div></section>
    <section className="container-page py-20"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Pièces choisies</p><h2 className="mt-4 text-5xl">Le beau, au quotidien.</h2></div><Button variant="link" asChild><Link to="/collections">Toutes les collections <ArrowRight /></Link></Button></div><div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">{products.slice(0,4).map(p => <ProductCard key={p.slug} p={p} />)}</div></section>
    <section className="relative overflow-hidden py-24"><img src={riad} alt="Intérieur marocain avec objets artisanaux" loading="lazy" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-safi-deep/70" /><div className="container-page relative"><p className="text-xs uppercase text-cream">Architectes · Hôtels · Décorateurs</p><h2 className="mt-5 max-w-xl text-5xl text-cream md:text-6xl">Une âme singulière<br />pour vos projets.</h2><p className="mt-6 max-w-md leading-relaxed text-cream">Des pièces et des finitions pensées pour votre lieu, de la première idée à la réalisation.</p><Button variant="clay" size="xl" onClick={() => open()} className="mt-8">Parlons de votre projet <ArrowRight /></Button></div></section>
    <section className="container-page py-20"><p className="eyebrow">Dans les coulisses</p><h2 className="mb-10 mt-4 text-5xl">Le journal AFUS</h2><div className="grid gap-10 md:grid-cols-3">{posts.map(post => <PostCard key={post.slug} post={post} />)}</div></section>
  </>;
}
