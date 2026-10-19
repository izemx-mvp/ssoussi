import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/collections/$slug")({
  head: () => ({ meta: [{ title: "Pièce — AFUS" }, { name: "description", content: "Pièce — AFUS, artisanat marocain." }, { property: "og:title", content: "Pièce — AFUS" }, { property: "og:description", content: "Pièce — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="Pièce" intro="Page en cours de rédaction." />,
});
