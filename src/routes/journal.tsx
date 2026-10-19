import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — AFUS" }, { name: "description", content: "Journal — AFUS, artisanat marocain." }, { property: "og:title", content: "Journal — AFUS" }, { property: "og:description", content: "Journal — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="Journal" intro="Page en cours de rédaction." />,
});
