// CONTENU EXEMPLE À REMPLACER — legal texts must be reviewed by the client / a lawyer.
import { site } from "@/config/site";
import type { L } from "@/i18n/locale";

export type LegalSection = { title: L; body: L[] };

const l = (fr: string, en: string): L => ({ fr, en });

export const legalUpdated = "2026-10-21"; // PLACEHOLDER

export const legalNotice: LegalSection[] = [
  {
    title: l("Éditeur du site", "Site publisher"),
    body: [
      l(
        `${site.legal.companyName} — ${site.legal.legalForm}. Siège : ${site.address.full.fr}. RC : ${site.legal.rc}. ICE : ${site.legal.ice}.`,
        `${site.legal.companyName} — ${site.legal.legalForm}. Registered office: ${site.address.full.en}. Trade register: ${site.legal.rc}. ICE: ${site.legal.ice}.`,
      ),
      l(`Contact : ${site.email} — ${site.phone}.`, `Contact: ${site.email} — ${site.phone}.`),
      l(
        `Directeur·rice de la publication : ${site.legal.director}.`,
        `Publication director: ${site.legal.director}.`,
      ),
    ],
  },
  {
    title: l("Hébergement", "Hosting"),
    body: [l(`${site.legal.host}.`, `${site.legal.host}.`)],
  },
  {
    title: l("Propriété intellectuelle", "Intellectual property"),
    body: [
      l(
        "L'ensemble des contenus du site (textes, photographies, logo, motifs graphiques) est protégé. Toute reproduction sans autorisation écrite préalable est interdite.",
        "All site content (texts, photographs, logo, graphic patterns) is protected. Any reproduction without prior written permission is prohibited.",
      ),
    ],
  },
  {
    title: l("Absence de vente en ligne", "No online sales"),
    body: [
      l(
        "Ce site présente des pièces artisanales à titre informatif. Aucune vente n'est conclue en ligne : prix, délais et conditions sont communiqués par devis personnalisé.",
        "This site presents handmade pieces for information. No sale is concluded online: prices, lead times and terms are provided in a personalised quote.",
      ),
    ],
  },
  {
    title: l("Assistant conversationnel", "Chat assistant"),
    body: [
      l(
        "L'assistant du site répond automatiquement à partir d'une base de réponses préparée par nos soins, sans intelligence artificielle. Ses réponses sont indicatives et ne constituent pas un engagement contractuel ; prix et délais sont communiqués par devis.",
        "The site assistant answers automatically from a set of answers we have prepared, without artificial intelligence. Its answers are indicative and do not constitute a contractual commitment; prices and lead times are given in a quote.",
      ),
    ],
  },
];

export const privacyPolicy: LegalSection[] = [
  {
    title: l("Responsable du traitement", "Data controller"),
    body: [
      l(
        `${site.legal.companyName}, ${site.address.full.fr}. Contact : ${site.email}.`,
        `${site.legal.companyName}, ${site.address.full.en}. Contact: ${site.email}.`,
      ),
    ],
  },
  {
    title: l("Données collectées", "Data collected"),
    body: [
      l(
        "Formulaires de contact, de devis et professionnel : nom, email, téléphone, pays, type de demande, message, référence de pièce. Assistant : les informations que vous choisissez de partager pour être recontacté·e.",
        "Contact, quote and professional forms: name, email, phone, country, request type, message, piece reference. Assistant: the information you choose to share in order to be contacted.",
      ),
      l(
        "Les conversations avec l'assistant sont traitées uniquement dans votre navigateur et ne sont transmises à aucun prestataire. Seules les coordonnées que vous saisissez volontairement dans le formulaire de l'assistant nous sont envoyées.",
        "Assistant conversations are processed only in your browser and are not sent to any third party. Only the contact details you choose to enter in the assistant's form are sent to us.",
      ),
    ],
  },
  {
    title: l("Finalités", "Purposes"),
    body: [
      l(
        "Répondre à vos demandes, établir des devis et assurer le suivi commercial.",
        "Answering your requests, preparing quotes and following up commercially.",
      ),
    ],
  },
  {
    title: l("Durée de conservation", "Retention period"),
    body: [l("[Durée à préciser par le client.]", "[Period to be specified by the client.]")],
  },
  {
    title: l("Vos droits", "Your rights"),
    body: [
      l(
        `Conformément à la loi 09-08 relative à la protection des données personnelles (Maroc) et, le cas échéant, au RGPD, vous disposez d'un droit d'accès, de rectification et d'opposition. Écrivez-nous à ${site.email}.`,
        `Under Moroccan law 09-08 on personal data protection and, where applicable, the GDPR, you have the right to access, rectify and object. Write to us at ${site.email}.`,
      ),
    ],
  },
  {
    title: l("Stockage local", "Local storage"),
    body: [
      l(
        "Le site mémorise dans votre navigateur votre choix de langue, votre première visite (pour l'animation d'accueil) et, le temps de votre session, la conversation avec l'assistant. Aucun cookie publicitaire n'est utilisé.",
        "The site stores in your browser your language choice, your first visit (for the intro animation) and, for the duration of your session, your conversation with the assistant. No advertising cookies are used.",
      ),
    ],
  },
];