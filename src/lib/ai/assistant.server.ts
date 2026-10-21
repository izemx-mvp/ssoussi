// Server-only: the Ssoussi assistant (Lovable AI gateway, AI SDK UI-message stream).
// Load from a server handler with `await import("@/lib/ai/assistant.server")`.
import { APICallError, convertToModelMessages, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { categories, usages } from "@/data/categories";
import { crafts } from "@/data/crafts";
import { site } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/locale";
import { searchPosts, searchProducts, toPostCard, toProductCard } from "@/lib/catalogue-search";
import { createResponsesCall } from "./responses";

/** Gateway model — chosen by Lovable, keep as is. */
export const ASSISTANT_MODEL = "google/gemini-3-flash-preview";
const GATEWAY_URL = "https://ai.gateway.lovable.dev";

/** Error codes the chat UI maps to friendly, localized messages. */
export const CHAT_ERRORS = {
  rateLimited: "RATE_LIMITED",
  credits: "CREDITS_EXHAUSTED",
  unavailable: "ASSISTANT_UNAVAILABLE",
  invalid: "INVALID_REQUEST",
} as const;

function systemPrompt(locale: Locale) {
  const craftList = crafts
    .map(
      (c) =>
        `- ${c.name.fr} (${c.city.fr}) — slug « ${c.slug} »${c.featured ? " — métier phare" : ""}`,
    )
    .join("\n");
  const categoryList = categories.map((c) => `- ${c.name.fr} — slug « ${c.slug} »`).join("\n");
  const usageList = Object.entries(usages)
    .map(([k, v]) => `« ${k} » (${v.fr})`)
    .join(", ");
  return `Tu es l'assistant de Ssoussi, une maison qui présente et fait fabriquer des pièces d'artisanat traditionnel marocain, avec la poterie de Safi comme métier phare. Tu es un guide chaleureux, cultivé et précis sur l'artisanat marocain, avec une connaissance approfondie de la poterie de Safi (colline des potiers, argile locale, tournage, séchage, cuisson au four traditionnel, émaillage et décor peint à la main).

LANGUE
- Réponds TOUJOURS dans la langue du visiteur : français, anglais, ou arabe / darija s'il écrit en arabe ou en darija. La page actuelle est en ${locale === "fr" ? "français" : "anglais"} ; utilise cette langue par défaut si le message est ambigu.

TON
- Chaleureux, élégant, concis. Phrases courtes. Pas d'emoji. Mise en forme Markdown légère (paragraphes courts, listes à puces si utile, gras avec parcimonie).

CE QUE TU FAIS
- Expliquer les techniques et les étapes de fabrication des métiers (poterie et céramique émaillée, zellige, tadelakt, dinanderie, bois de thuya, tissage, cuir).
- Recommander des pièces selon l'usage, le style ou la couleur : utilise TOUJOURS l'outil search_catalogue avant de citer une pièce, et ne cite que des pièces renvoyées par l'outil (l'interface les affiche en cartes, inutile de recopier les liens).
- Proposer des articles du journal avec search_blog quand c'est pertinent.
- Expliquer les commandes sur mesure et le processus professionnel : Brief → Prototype → Production → Livraison. Services : sur mesure, personnalisation (logo, couleurs), grandes quantités, export international, emballage sécurisé.
- Donner des conseils d'entretien généraux (céramique : lavage à la main, éviter les chocs thermiques ; bois : chiffon sec, huiler de temps en temps ; cuivre : se patine, citron et sel pour raviver ; textiles : aspirer sans brosse rotative, nettoyage professionnel).
- Collecter les demandes (leads) avec create_lead.

RÈGLES STRICTES
- N'invente JAMAIS de prix, de délais, de stock, de minimum de commande, de frais de port ni de faits sur l'entreprise (date de création, chiffres, clients, récompenses, noms d'artisans). Pour tout prix ou délai, explique que l'équipe envoie un devis personnalisé.
- Ne promets rien au nom de l'équipe au-delà d'un retour personnalisé.
- Les faits historiques doivent rester généraux et exacts ; si tu n'es pas sûr, dis-le.
- Reste dans ton rôle : si la question est sans rapport avec Ssoussi ou l'artisanat, réponds brièvement et ramène poliment la conversation.

LEADS (create_lead)
- Quand le visiteur veut un devis, une commande, une visite de l'atelier ou être recontacté, propose de transmettre sa demande à l'équipe.
- Avant d'appeler create_lead, rassemble de manière conversationnelle (une ou deux questions à la fois) : nom, email OU téléphone, pays, type de demande (particulier, professionnel, export, visite, presse, devis), et un court message décrivant le besoin (pièces, quantités, usage, échéance). Référence produit si elle est connue.
- N'appelle create_lead qu'une fois ces informations obtenues et le consentement implicite du visiteur à être recontacté. Après l'appel, si ok = true, confirme que la demande a bien été transmise et que l'équipe reviendra vers lui. Si ok = false, excuse-toi brièvement et propose le formulaire « Demander un devis » du site ou WhatsApp.

CONTACT
- WhatsApp et formulaire de devis disponibles sur le site. Email : ${site.email}. Les visites de l'atelier se font sur rendez-vous.

RÉFÉRENTIEL
Métiers (filtre craft) :
${craftList}
Catégories (filtre category) :
${categoryList}
Usages (filtre usage) : ${usageList}
Origines (filtre origin) : Safi, Fès, Marrakech, Essaouira, Atlas.`;
}

function tools(locale: Locale) {
  return {
    search_catalogue: tool({
      description:
        "Recherche des pièces dans le catalogue Ssoussi. Renvoie des cartes produit (affichées au visiteur). À utiliser avant de recommander ou citer une pièce.",
      inputSchema: z.object({
        query: z.string().describe("Mots-clés libres : type de pièce, style, couleur, matière…"),
        craft: z
          .string()
          .optional()
          .describe("Slug du métier, ex. poterie, zellige, tadelakt, cuivre, bois, tissage, cuir"),
        origin: z.string().optional().describe("Ville ou région, ex. Safi, Fès"),
        category: z.string().optional().describe("Slug de catégorie, ex. art-de-la-table"),
        usage: z.string().optional().describe("table, decoration, architecture ou luminaires"),
      }),
      execute: async (input) => {
        const found = searchProducts(input);
        // Relax filters before giving up, so the model always has something to work with.
        const results = found.length ? found : searchProducts({ query: input.query });
        return { products: results.map((p) => toProductCard(p, locale)) };
      },
    }),
    search_blog: tool({
      description:
        "Recherche des articles du journal Ssoussi (savoir-faire, histoire de Safi, décoration, entretien).",
      inputSchema: z.object({ query: z.string() }),
      execute: async ({ query }) => ({
        posts: searchPosts(query).map((p) => toPostCard(p, locale)),
      }),
    }),
    create_lead: tool({
      description:
        "Transmet une demande qualifiée à l'équipe Ssoussi (table prospects). N'appeler qu'avec nom, email ou téléphone, pays, type de demande et message.",
      inputSchema: z
        .object({
          name: z.string().min(1).max(120),
          email: z.string().email().max(255).optional(),
          phone: z.string().max(40).optional(),
          country: z.string().min(1).max(80),
          request_type: z.enum([
            "particulier",
            "professionnel",
            "export",
            "visite",
            "presse",
            "devis",
          ]),
          message: z.string().min(1).max(2000),
          product_ref: z.string().max(200).optional(),
        })
        .refine((v) => Boolean(v.email || v.phone), { message: "email ou téléphone requis" }),
      execute: async (lead) => {
        // prospects has no country / product columns: they are kept in `notes`.
        const notes = [
          `Pays : ${lead.country}`,
          lead.product_ref ? `Pièce : ${lead.product_ref}` : null,
          `Langue : ${locale}`,
          "Source : assistant du site",
          "",
          lead.message,
        ]
          .filter((x) => x !== null)
          .join("\n");
        try {
          const { error } = await supabaseAdmin.from("prospects").insert({
            name: lead.name,
            email: lead.email ?? null,
            phone: lead.phone ?? null,
            interest: lead.request_type,
            notes,
          });
          if (error) throw error;
          return { ok: true as const };
        } catch (error) {
          // e.g. missing service-role key or DB error: let the model offer the form / WhatsApp instead.
          console.error("[assistant] create_lead failed", error);
          return {
            ok: false as const,
            fallback: "Proposer le formulaire de devis du site ou WhatsApp.",
          };
        }
      },
    }),
  };
}

export function mapChatError(error: unknown): string {
  if (APICallError.isInstance(error)) {
    if (error.statusCode === 429) return CHAT_ERRORS.rateLimited;
    if (error.statusCode === 402) return CHAT_ERRORS.credits;
  }
  console.error("[assistant] stream error", error);
  return CHAT_ERRORS.unavailable;
}

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

const bodySchema = z.object({
  messages: z
    .array(
      z.custom<UIMessage>(
        (m) => typeof m === "object" && m !== null && "role" in m && "parts" in m,
      ),
    )
    .min(1)
    .max(40),
  locale: z.string().optional(),
});

export async function handleChat(request: Request): Promise<Response> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    console.error("[assistant] LOVABLE_API_KEY is not set");
    return text(CHAT_ERRORS.unavailable, 503);
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return text(CHAT_ERRORS.invalid, 400);
  }
  const locale: Locale = isLocale(body.locale) ? body.locale : "fr";
  const toolset = tools(locale);

  // Keep the context small: the last 20 messages are plenty for this assistant.
  const messages = await convertToModelMessages(body.messages.slice(-20), {
    tools: toolset,
    ignoreIncompleteToolCalls: true,
  });

  try {
    const call = createResponsesCall(
      request,
      {
        baseURL: process.env["LOVABLE_AI_GATEWAY_URL"] ?? GATEWAY_URL,
        apiKey,
        model: ASSISTANT_MODEL,
      },
      messages,
      systemPrompt(locale),
      { tools: toolset, stopWhen: stepCountIs(5), onError: mapChatError, sendReasoning: false },
    );
    return await call.response();
  } catch (error) {
    const code = mapChatError(error);
    return text(
      code,
      code === CHAT_ERRORS.rateLimited ? 429 : code === CHAT_ERRORS.credits ? 402 : 503,
    );
  }
}
