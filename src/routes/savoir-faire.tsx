import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/savoir-faire")({
  head: () => ({ meta: [{ title: "Savoir-faire — AFUS" }, { name: "description", content: "Savoir-faire — AFUS, artisanat marocain." }, { property: "og:title", content: "Savoir-faire — AFUS" }, { property: "og:description", content: "Savoir-faire — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="Savoir-faire" intro="Page en cours de rédaction." />,
});
