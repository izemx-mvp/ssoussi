import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/atelier")({
  head: () => ({ meta: [{ title: "L'atelier — AFUS" }, { name: "description", content: "L'atelier — AFUS, artisanat marocain." }, { property: "og:title", content: "L'atelier — AFUS" }, { property: "og:description", content: "L'atelier — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="L'atelier" intro="Page en cours de rédaction." />,
});
