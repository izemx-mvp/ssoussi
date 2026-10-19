import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — AFUS" }, { name: "description", content: "Contact — AFUS, artisanat marocain." }, { property: "og:title", content: "Contact — AFUS" }, { property: "og:description", content: "Contact — AFUS, artisanat marocain." }] }),
  component: () => <PageHero eyebrow="AFUS" title="Contact" intro="Page en cours de rédaction." />,
});
