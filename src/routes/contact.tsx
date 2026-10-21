import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import { site, whatsappLink } from "@/config/site";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";
export const Route=createFileRoute("/contact")({head:()=>pageMeta("Contact", "Contactez SSOUSSI pour une pièce, un devis ou un projet professionnel d’artisanat marocain."),component:()=> <><PageHero eyebrow="Une question, une idée, un projet" title="Faisons connaissance." intro="Une pièce vous plaît ? Vous imaginez une collection pour votre lieu ? Nous sommes à votre écoute."/><section className="container-page grid gap-12 pb-24 md:grid-cols-[1fr_1.3fr]"><div><h2 className="text-3xl">SSOUSSI · Safi, Maroc</h2><ul className="mt-7 space-y-5 text-sm"><li className="flex gap-3"><MapPin className="size-5 shrink-0 text-clay"/>{site.address}</li><li><a href={`mailto:${site.email}`} className="flex gap-3"><Mail className="size-5 text-clay"/>{site.email}</a></li><li><a href={`tel:${site.phone}`} className="flex gap-3"><Phone className="size-5 text-clay"/>{site.phone}</a></li></ul><Button variant="line" asChild className="mt-8"><a href={whatsappLink("Bonjour SSOUSSI, je souhaite parler de mon projet.")} target="_blank" rel="noreferrer">Échanger sur WhatsApp</a></Button></div><ContactForm/></section></>});
