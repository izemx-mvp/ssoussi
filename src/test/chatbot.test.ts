import { describe, expect, it } from "vitest";

import { detectLang, matchIntent, respond } from "@/chatbot/engine";
import { intents } from "@/chatbot/knowledge";

const intentOf = (q: string) => matchIntent(q)?.intent.id;

describe("rule-based chatbot", () => {
  it("covers the expected topics", () => {
    expect(intents.length).toBeGreaterThanOrEqual(30);
    expect(new Set(intents.map((i) => i.id)).size).toBe(intents.length);
  });

  it.each([
    ["Bonjour !", "greeting"],
    ["merci beaucoup", "thanks"],
    ["Qui êtes-vous ?", "about"],
    ["Quels sont vos prix ?", "prices"],
    ["chhal taman dyal tajine", "prices"],
    ["How much does it cost?", "prices"],
    ["Je voudrais un devis", "quote"],
    ["Livrez-vous en France ?", "export"],
    ["Do you ship abroad?", "export"],
    ["combien de temps pour la fabrication d'une commande", "lead-time"],
    ["Parlez-moi du zelige", "craft-zellige"],
    ["tadelakt pour salle de bain", "craft-tadelakt"],
    ["fin kaynin ?", "address"],
    ["Peut-on visiter l'atelier ?", "visit"],
    ["Je suis architecte, projet pour un hôtel", "b2b"],
    ["Is it dishwasher safe?", "oven"],
    ["je suis artisan et je veux travailler avec vous", "artisan-partner"],
    ["votre numéro whatsapp", "contact"],
    ["livraision internationale", "export"],
    ["potterie de safi", "safi-history"],
  ])("%s → %s", (q, id) => {
    expect(intentOf(q)).toBe(id);
  });

  it("detects language and Darija", () => {
    expect(detectLang("Bonjour, je cherche un vase", "en")).toBe("fr");
    expect(detectLang("Hello, I am looking for a vase", "fr")).toBe("en");
    expect(detectLang("salam wach kayn tajine", "fr")).toBe("darija");
    expect(respond("Hello, what are your prices?", "fr", 0).lang).toBe("en");
    expect(respond("wach kayn tawsil l france", "fr", 0).lang).toBe("fr");
  });

  it("shows up to 3 catalogue cards when a piece or craft is mentioned", () => {
    const r = respond("je cherche un tajine bleu", "fr", 0);
    expect(r.products.length).toBeGreaterThan(0);
    expect(r.products.length).toBeLessThanOrEqual(3);
  });

  it("falls back, then pushes WhatsApp after two misses", () => {
    const first = respond("qwerty azerty", "fr", 0);
    expect(first.kind).toBe("fallback");
    expect(first.actions.map((a) => a.type)).toEqual(["whatsapp", "lead"]);
    expect(respond("qwerty azerty", "fr", 1).kind).toBe("fallback-strong");
  });

  it("never mentions a price figure", () => {
    const money = /\d+\s?(€|eur|dh|mad|\$)/i;
    for (const i of intents) {
      expect(i.answer.fr).not.toMatch(money);
      expect(i.answer.en).not.toMatch(money);
    }
  });
});
