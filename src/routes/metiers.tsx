import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/metiers")({
  head: () => ({ meta: [{ title: "Métiers — AFUS" }, { name: "description", content: "Métiers — AFUS, artisanat marocain." }, { property: "og:title", content: "Métiers — AFUS" }, { property: "og:description", content: "Métiers — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="Métiers" intro="Page en cours de rédaction." />,
});
