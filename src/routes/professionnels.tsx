import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/professionnels")({
  head: () => ({ meta: [{ title: "Professionnels — AFUS" }, { name: "description", content: "Professionnels — AFUS, artisanat marocain." }, { property: "og:title", content: "Professionnels — AFUS" }, { property: "og:description", content: "Professionnels — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="Professionnels" intro="Page en cours de rédaction." />,
});
