import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/collections/")({
  head: () => ({ meta: [{ title: "Collections — AFUS" }, { name: "description", content: "Collections — AFUS, artisanat marocain." }, { property: "og:title", content: "Collections — AFUS" }, { property: "og:description", content: "Collections — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="Collections" intro="Page en cours de rédaction." />,
});
