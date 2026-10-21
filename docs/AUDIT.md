# SSOUSSI — Audit du dépôt (phase 0)

Audit réalisé avant les travaux de finition, en comparant le code généré par Lovable à la
spécification complète (`ssoussi-claude-code-full-prompt.md`, « SPEC »). Statuts :
**done** (conforme), **partial** (existe mais incomplet / à reprendre), **missing** (absent).

## 0. Constat technique

| Point | Statut | Notes |
| --- | --- | --- |
| Stack | — | Le projet n'est **pas** React Router + Vite SPA mais **TanStack Start** (SSR, routage par fichiers dans `src/routes/`, build Nitro → Cloudflare). On garde cette stack ; « React Router » de la SPEC est traduit en TanStack Router. Pas de `src/pages/` ni de `index.html` (le shell HTML est `src/routes/__root.tsx`). |
| `npm install` | done | OK (12 vulnérabilités npm audit dans des dépendances transitives, non bloquantes). |
| `npm run build` | done | Passe déjà (vite build ne typecheck pas). |
| `tsc --noEmit` | done | 0 erreur. |
| `reasoning.tsx` / `shimmer.tsx` | partial | Ne cassent ni le build ni le typecheck en local, mais **ne sont importés nulle part** et tirent des plugins lourds (`@streamdown/mermaid`, `math`, `cjk`, `code`). → supprimés (le raisonnement du modèle n'est pas affiché dans le chat). |
| `npm run lint` | partial | ~8 800 erreurs, toutes `prettier/prettier` (fins de ligne CRLF dues à `core.autocrlf=true` sous Windows + fichiers minifiés sur une ligne). Aucune erreur de logique. |
| `npm run dev` | done | Démarre ; toutes les routes existantes répondent 200, `*` → 404. |
| Backend du chat | **missing** | Le client appelle `POST /api/public/chat`, mais **aucune route serveur n'existe** (404). Il n'y a pas non plus de dossier `supabase/functions/`. Seul le helper `src/lib/ai/responses.ts` (passerelle Lovable AI, Responses API) est présent. Le modèle `google/gemini-3-flash-preview` n'est référencé nulle part. |
| Base de données | partial | Migration Drizzle `0000_migration.sql` : tables `contacts` (INSERT ouvert à `anon` avec contrôles de longueur via RLS) et `prospects` (accès `service_role` uniquement → les leads doivent être insérés côté serveur avec `client.server.ts`). Colonnes `prospects` : name, email, phone, interest, notes (pas de country/request_type/product_ref → regroupés dans `notes`). |
| Variables d'env. | partial | `.env` contient l'URL et la clé publishable Supabase. `SUPABASE_SERVICE_ROLE_KEY` et `LOVABLE_API_KEY` ne sont pas en local (injectés par Lovable Cloud) → le chat et `create_lead` ne peuvent être testés de bout en bout qu'une fois déployés sur Lovable. |

## 1. Marque / design system

| Élément | Statut | Notes |
| --- | --- | --- |
| Rebrand AFUS → SSOUSSI | partial | Le code applicatif dit déjà « SSOUSSI ». Restent : `roadmap.md` (« AFUS completion »), `README.md` générique (« Screenshot Exact Match »). Aucune trace de `ⴰⴼⵓⵙ` ni du texte « Afus = main en tamazight ». |
| Logo | partial | Nouveau logo SSOUSSI uniquement sous forme de pointeur d'asset Lovable (`src/assets/ssoussi-logo.png.asset.json` → URL `/__l5e/assets-v1/...`) qui **ne se résout pas hors de l'infrastructure Lovable** (404 en local). Pas de version compacte (symbole + nom côte à côte) ni de version claire pour le footer bleu (le footer posait le logo dans un cadre crème). Favicon (`public/favicon.png`) = bien le nouveau symbole. Aucun ancien fichier de logo AFUS trouvé. |
| Couleurs | partial | Tokens présents en OKLCH. Échantillonnés sur le logo : bleu ≈ `#043E86` (token : `#053C8F`), terracotta ≈ `#CB4F26` (token : `#C74B28`) → à aligner. `--glaze-green` absent. Le terracotta sur crème donne ~4,2:1 (sous AA pour du petit texte) → besoin d'une nuance foncée pour le texte. |
| Typo | partial | Cormorant Garamond + Manrope chargées ; pas d'italique, pas de police arabe décorative (Amiri). |
| Motif signature SVG | missing | Aucun motif (cercles concentriques, rosette). |
| Masques organiques | partial | Utilitaires `mask-organic` définis mais non utilisés. |
| Grain papier / argile | missing | — |
| `src/config/media.ts` | missing | Les 7 images générées sont importées directement dans les données. |
| Images | partial | 7 JPEG (1024–1280 px, 125–290 Ko) sans formats modernes, sans `srcset`, sans dimensions explicites ni placeholder flou. Pas d'images dédiées pour : étapes de fabrication (argile crue → tourné → séché → cuit → émaillé), tadelakt, thuya, cuivre, tissage (le tissage utilise l'image du four). |

## 2. Animations globales

| Élément | Statut | Notes |
| --- | --- | --- |
| Reveal au scroll | partial | `FadeUp` (28 px, pas de stagger, `margin` au lieu de `amount: 0.2`). En reduced-motion, rien n'apparaît animé mais l'opacité est aussi coupée. |
| Hovers (lift 4 px, zoom 1.04, soulignement dessiné) | partial | Lift 6 px / zoom 1.05 ; pas de soulignement SVG. |
| Count-up | missing | Stats affichées nulle part. |
| Transitions de page (fondu + volet argile) | missing | — |
| Timeline signature épinglée (Savoir-faire) | missing | Simple grille d'étapes. |
| Loader premier passage | missing | — |
| `prefers-reduced-motion` | partial | Règle CSS globale ; Framer à compléter. |

## 3. Composants globaux

| Élément | Statut | Notes |
| --- | --- | --- |
| Layout racine (Header, Footer, flottants, devis, toasts) | done | Monté dans `__root.tsx`. |
| Header | partial | Pas transparent puis verre après 40 px, pas de switch FR/EN, nav visible seulement ≥ xl, menu mobile sans motif, libellé « Métiers » au lieu de « Métiers & régions ». |
| Footer | partial | Pas de colonne collections, pas de WhatsApp, pas de newsletter, pas de switch FR/EN, liens légaux pointent vers `/contact`, pas de bordure motif, Pinterest non affiché. |
| Boutons flottants | partial | WhatsApp + lanceur chat présents ; message WhatsApp FR uniquement. |
| Modale devis globale | partial | Contexte global OK et pré-remplissage produit OK ; le formulaire ne suit pas react-hook-form, pas de consentement. |
| Scroll-to-top / 404 | partial | `scrollRestoration: true` ; 404 générique sans illustration « pot fêlé ». |

## 4. Pages

| Route | Statut | Notes |
| --- | --- | --- |
| `/` Accueil | partial | Existent : hero (plein écran image, pas split), métiers (3 cartes), produits, bande pro, journal. Manquent : hero split + badge texte circulaire + parallaxe, marquee, manifeste + 3 valeurs, carte Métiers & régions + slider mobile, Focus Safi, bento collections, frise 6 étapes, chiffres count-up, artisans, CTA final. |
| `/savoir-faire` | partial | Hero + grille des 6 étapes de Safi. Manquent : sélecteur de métier, timeline épinglée, chips outils/durée, matières, décors, vidéo, CTA atelier. |
| `/metiers` | partial | Grille de cartes. Manque la carte interactive, ville/matières dans les cartes. |
| `/metiers/:slug` | partial | Hero, étapes, produits liés. Manquent histoire, matières, artisans, CTA devis, timeline réutilisée. |
| `/collections` | partial | Filtre par catégorie + recherche. Manquent filtres métier/origine/technique/usage/couleur, barre sticky, animation de layout, badge « Sur demande », bouton WhatsApp sur carte. |
| `/collections/:category` | missing | — |
| `/collections/:category/:slug` | partial | Existe en `/collections/:slug` (mauvaise URL). Une seule image, pas de galerie/lightbox, specs incomplètes, pas de WhatsApp, pas de mention « pièce unique », pas de mini-étapes, pas de carrousel. |
| `/atelier` | partial | 2 blocs texte/image. Manquent histoire (placeholder), réseau, valeurs, artisans, galerie masonry, carte, infos visite. |
| `/professionnels` | partial | 3 cibles + formulaire générique. Manquent services, process 4 étapes, FAQ, formulaire B2B (société, pays, type de projet, quantités, échéance, fichier). |
| `/journal` | partial | Liste sans filtre de catégorie ; catégories non conformes. |
| `/journal/:slug` | partial | Pas de temps de lecture, sommaire, partage ; 3 articles au lieu de 4. |
| `/contact` | partial | Formulaire sans react-hook-form, sans consentement, types de demande non conformes, pas d'état de succès animé, pas d'horaires ni de carte. Insert `contacts` codé (non testé). |
| `/mentions-legales`, `/confidentialite` | missing | — |
| `*` 404 | partial | Voir composants globaux. |
| Préfixe `/en/...` | missing | — |

## 5. Contenu & données

| Élément | Statut | Notes |
| --- | --- | --- |
| `site.ts` | partial | Pas d'URL du site, coordonnées de carte, horaires, URL vidéo ; stats sans valeur numérique animable ; « 40+ artisans », « 12 pays » présentés comme des faits (à marquer comme exemples). |
| `crafts.ts` | partial | 5 métiers, pas de `{fr,en}`, pas de coordonnées, matières, région, étapes détaillées (outils, durée). « Tradition vivante depuis plus de huit siècles » : à adoucir (fait général non vérifié). |
| `products.ts` | partial | 12 produits (cible ~16), pas de technique/usage/couleurs/galerie, catégories non conformes à la SPEC. |
| `categories.ts`, `artisans.ts` | missing | — |
| `posts.ts` | partial | 3 articles, corps en paragraphes simples, pas de `{fr,en}`. Mention « depuis le XIIe siècle » à adoucir. |
| i18n FR/EN | missing | Tout est en dur en français. |

## 6. Chat IA

| Élément | Statut | Notes |
| --- | --- | --- |
| Route serveur + streaming | missing | Voir constat technique. |
| Outils `search_catalogue`, `search_blog`, `create_lead` | missing | — |
| UI | partial | Panneau fait main (pas AI Elements), 3 suggestions au lieu de 5, pas de markdown, pas d'indicateur de saisie, pas de plein écran mobile, pas de gestion 429/402. Lit le flux en texte brut (incompatible avec un flux UI-message de l'AI SDK). |

## 7. SEO / a11y / perf

| Élément | Statut | Notes |
| --- | --- | --- |
| Title + description par page | partial | FR uniquement via `pageMeta`. |
| Open Graph image | missing | — |
| JSON-LD | missing | — |
| sitemap.xml | missing | `robots.txt` existe, sans sitemap. |
| canonical + hreflang | missing | — |
| Alt texts | partial | FR uniquement. |
| Focus visibles | partial | Ring 1 px sur boutons shadcn ; liens sans style de focus. |
| Images lazy + dimensions | partial | `loading="lazy"` partiel, pas de `width/height`. |

## Plan d'action retenu

On garde la stack TanStack Start, les composants shadcn et les fichiers de données existants,
que l'on enrichit (champs `{fr,en}`, nouveaux champs). On réécrit les pages minifiées en
composants lisibles, on ajoute la route serveur du chat (passerelle Lovable AI existante,
modèle `google/gemini-3-flash-preview`) avec outils, et on introduit un segment de langue
optionnel `{-$locale}` pour les routes `/en/...`.

---

## Après travaux (fin de session)

Tous les éléments ci-dessus sont passés à **done**, sauf les points listés ici.

| Point | Statut | Notes |
| --- | --- | --- |
| Build / typecheck / tests | done | `npm run build` OK, `tsc --noEmit` 0 erreur, `vitest` 9/9 (routing FR + EN). Lint : 0 erreur sur les fichiers modifiés (avertissements *fast refresh* seulement). Les fichiers générés (shadcn, Supabase) n'ont pas été reformatés. |
| Chat — route serveur | done | `POST /api/public/chat` → `src/lib/ai/assistant.server.ts`. Testé contre une maquette locale de la passerelle : streaming, outil `search_catalogue` puis réponse, cartes produit dans l'UI, repli par noms cités, 429 → `RATE_LIMITED`, 402 → `CREDITS_EXHAUSTED`, sans clé → 503. |
| Chat — passerelle Lovable réelle | **à vérifier** | `LOVABLE_API_KEY` absent en local : pas testé contre la vraie passerelle ni le modèle `google/gemini-3-flash-preview`. |
| `create_lead` → `prospects` | **à vérifier** | Code prêt (client service-role). Sans `SUPABASE_SERVICE_ROLE_KEY` local, l'outil renvoie `{ok:false}` et l'assistant propose le formulaire / WhatsApp (testé). Insertion réelle à vérifier sur Lovable Cloud. |
| Formulaire contact → `contacts` | done | Testé de bout en bout (1 ligne de test « TEST — vérification Claude Code (à supprimer) », test@example.com). |
| Images | partial | Pas d'outil de génération d'images disponible : les 7 images existantes sont réutilisées (WebP 640/1280 + flou). Étapes de fabrication, tadelakt, cuivre, thuya, tissage et cuir utilisent des recadrages de ces images. |
| Newsletter | partial | Front uniquement (toast), comme demandé. |
| Bundle | partial | supabase-js reste dans le bundle initial car importé par le middleware généré `src/start.ts`. |
| Contraste | done | Terracotta du logo `#CB4F26` conservé pour la marque ; `--clay-deep #B4441F` pour CTA et petit texte (AA). |

---

## Assistant sans IA (remplace le chat IA)

La clé de la passerelle Lovable AI n'étant pas configurée, l'assistant IA est remplacé par un
assistant à règles, 100 % côté navigateur, sans clé ni appel serveur. Les lignes « Chat — route
serveur », « Chat — passerelle Lovable réelle » et « `create_lead` » ci-dessus ne s'appliquent plus.

| Point | Statut | Notes |
| --- | --- | --- |
| Base de connaissances | done | `src/chatbot/knowledge.ts` : 36 intentions, mots-clés FR / EN / darija (lettres latines), réponses FR / EN. Coordonnées lues dans `src/config/site.ts`, textes des métiers dans `src/data/crafts.ts`. Aucun prix, stock ni délai chiffré. |
| Moteur | done | `src/chatbot/engine.ts` : normalisation, score par mots-clés et expressions, Fuse.js pour les fautes de frappe, seuil de confiance, détection FR / EN / darija (darija → langue de la page). Recherche produits / articles (Fuse.js) → 3 cartes max (Voir + Devis). Tests : `src/test/chatbot.test.ts`. |
| Repli | done | Message poli + suggestions + WhatsApp pré-rempli avec la question + « Être recontacté ». Au 2ᵉ échec consécutif, WhatsApp est mis en avant. |
| UI | done | Design du panneau conservé ; suggestions d'accueil, réponses rapides, faux indicateur de saisie (400–700 ms), markdown simple, historique en `sessionStorage` (try/catch), bouton « Recommencer », plein écran mobile. |
| Leads → `prospects` | **bloqué par RLS** | Le formulaire du chat insère dans `prospects` avec le client Supabase du navigateur. Or la migration ne donne accès à `prospects` qu'au `service_role` : l'insertion est refusée. En attendant, le lead est enregistré dans `contacts` (préfixe `[Assistant]`) si un email est fourni ; sinon le visiteur est orienté vers WhatsApp. Pour activer `prospects`, ajouter dans Lovable Cloud (voir SQL ci-dessous). |

```sql
GRANT INSERT ON public.prospects TO anon, authenticated;
CREATE POLICY "Anyone can submit a chat lead" ON public.prospects
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    coalesce(length(name), 0) BETWEEN 1 AND 120
    AND (email IS NOT NULL OR phone IS NOT NULL)
    AND coalesce(length(email), 0) <= 255
    AND coalesce(length(phone), 0) <= 40
    AND coalesce(length(notes), 0) <= 3000
  );
```
