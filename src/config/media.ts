// Every image used on the site, with responsive WebP sources, intrinsic size and a tiny
// inline blur placeholder. Replace the files in src/assets/img/ (keep names or update imports).
import type { L } from "@/i18n/locale";

import craftsMix640 from "@/assets/img/crafts-mix-640.webp";
import craftsMix1280 from "@/assets/img/crafts-mix-1280.webp";
import handsClay640 from "@/assets/img/hands-clay-640.webp";
import handsClay1280 from "@/assets/img/hands-clay-1280.webp";
import heroVase640 from "@/assets/img/hero-vase-640.webp";
import heroVase1280 from "@/assets/img/hero-vase-1280.webp";
import kiln640 from "@/assets/img/kiln-640.webp";
import kiln1280 from "@/assets/img/kiln-1280.webp";
import riad640 from "@/assets/img/riad-640.webp";
import riad1280 from "@/assets/img/riad-1280.webp";
import tableware640 from "@/assets/img/tableware-640.webp";
import tableware1280 from "@/assets/img/tableware-1280.webp";
import zellige640 from "@/assets/img/zellige-640.webp";
import zellige1280 from "@/assets/img/zellige-1280.webp";
// Craft images: WebP derived from the source PNGs of the same name in src/assets/img/.
import craftPoterie640 from "@/assets/img/craft-poterie-safi-640.webp";
import craftPoterie1122 from "@/assets/img/craft-poterie-safi-1122.webp";
import craftZellige640 from "@/assets/img/craft-zellige-fes-640.webp";
import craftZellige1122 from "@/assets/img/craft-zellige-fes-1122.webp";
import craftTadelakt640 from "@/assets/img/craft-tadelakt-cuivre-marrakech-640.webp";
import craftTadelakt1122 from "@/assets/img/craft-tadelakt-cuivre-marrakech-1122.webp";
import craftBois640 from "@/assets/img/craft-bois-thuya-essaouira-640.webp";
import craftBois1122 from "@/assets/img/craft-bois-thuya-essaouira-1122.webp";
import craftTissage640 from "@/assets/img/craft-tissage-atlas-640.webp";
import craftTissage1122 from "@/assets/img/craft-tissage-atlas-1122.webp";
import craftCuir640 from "@/assets/img/craft-cuir-640.webp";
import craftCuir1122 from "@/assets/img/craft-cuir-1122.webp";

export type Media = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  placeholder: string;
  alt: L;
};

const webp = (b64: string) => `data:image/webp;base64,${b64}`;

const make = (
  small: string,
  large: string,
  width: number,
  height: number,
  placeholder: string,
  alt: L,
): Media => ({
  src: large,
  srcSet: `${small} 640w, ${large} ${width}w`,
  width,
  height,
  placeholder: webp(placeholder),
  alt,
});

export const media = {
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  heroVase: make(
    heroVase640,
    heroVase1280,
    1024,
    1280,
    "UklGRoQAAABXRUJQVlA4IHgAAAAQBACdASoQABQAPu1iqU2ppaOiMAgBMB2JZgCdMoBOABJr9gs+QYjvAADGRvlhSke26cR+iM10krliCRgJXqomj9IAsLLXJRMJNBPcIJcaBqAlC2zn+GWAsROzkLWh8SDZYg7R3oqKiuqKE201JWRPZy4sIqhuAAA=",
    {
      fr: "Grand vase de Safi émaillé bleu, décor peint à la main",
      en: "Large blue-glazed Safi vase with hand-painted decoration",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  handsClay: make(
    handsClay640,
    handsClay1280,
    1280,
    960,
    "UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoQAAwAA4BaJbACdAEf/hUN8aUpAAD+7y58cEuxkhsIxngXIsbTZBNIqln14tIFC3gBj2hddPK1e8oUY/loWR4btkmwv7TUf44VL43D/SjDwAAA",
    {
      fr: "Mains d'un potier façonnant l'argile au tour",
      en: "A potter's hands shaping clay on the wheel",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  kiln: make(
    kiln640,
    kiln1280,
    1280,
    960,
    "UklGRmQAAABXRUJQVlA4IFgAAACwAQCdASoQAAwAA4BaJYgCdADQJWQAAP70lKEA0ufNDUjQOHrC1q4aWMTMRJuya5Y05V5rtl0tHAmRoM6N6EWjbWOruaEuJyNO4ziZf0xHF8hKviznwAAA",
    {
      fr: "Four traditionnel à bois dans un atelier de poterie",
      en: "Traditional wood-fired kiln in a pottery workshop",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  riad: make(
    riad640,
    riad1280,
    1280,
    960,
    "UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoQAAwAA4BaJZgCdACzB699PgAA9oVwtfSi3feiHXeFt4UXh8dFoHkpBK85kSssgtlZHMs5sbhK3iWbZMQGm0Ms8TjAcRh6aCOuLmfC90n34gAA",
    {
      fr: "Intérieur de riad mis en scène avec des céramiques artisanales",
      en: "Riad interior styled with handmade ceramics",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  tableware: make(
    tableware640,
    tableware1280,
    1024,
    1024,
    "UklGRnwAAABXRUJQVlA4IHAAAAAwAgCdASoQABAAA4BaJYwCdAYvXc6lhfXyAAD84t8r+F0XFCvqadGD3kiGJxlyyrOIyVchDnJ8Q6a9FmHT/UUkX05u1Ft76g5KwuuG5Deav1US9d6JSvRrAd00ToH3GNcOHFKb7Z42PSiLvZOnAAAA",
    {
      fr: "Assiettes et bols de Safi aux décors peints",
      en: "Safi plates and bowls with painted decoration",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  zellige: make(
    zellige640,
    zellige1280,
    1024,
    1024,
    "UklGRoYAAABXRUJQVlA4IHoAAACQAgCdASoQABAAA4BaJZACdBaglAQgHJBZilfD4AD9NEkTBFD/2Mzqi99iGamlqa9SrvBKrIhbeJF5foMp926My0J9E04GiK6EnswxF3CeopTltMxTxRSuoJVzH/ubNY4NVzwmkINrvicJ0GfgAAOy8XMCeQnPuYQAAA==",
    {
      fr: "Composition de zellige aux tesselles émaillées",
      en: "Zellige composition of glazed tesserae",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  craftsMix: make(
    craftsMix640,
    craftsMix1280,
    1024,
    1024,
    "UklGRnQAAABXRUJQVlA4IGgAAABwAgCdASoQABAAA4BaJbACdLoAEJ6W4DTNXn4AAP4D+70SrWOz25BNBvY/ICwzHQa92UaDjrkjlpNdKa9XlGPVEdi+iRIQrxNfOZC4QYInb5f97H5H2AXhSeeLf0KNd89+KATSDAAAAA==",
    {
      fr: "Objets artisanaux marocains : bois, cuivre, textile",
      en: "Moroccan handmade objects: wood, copper, textile",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  craftPoterie: make(
    craftPoterie640,
    craftPoterie1122,
    1122,
    1402,
    "UklGRqAAAABXRUJQVlA4IJQAAABwBACdASoQABQAPu1iqU2ppaOiMAgBMB2JagCdMoRwACaol2LBGnSJF9sNAAD+wkRxPFGmciAREZPv2LnGbiS0Yd2Cr40nxIZGdiDZtjQFkDzhCCvBmhB3KQjELe1eyEuKMj0NxpR+5KVR8QuqZW1BqAuoKMhMTExsK24v7oumTOs+VIDA0YphayrB04WX4nDIEgAA",
    {
      fr: "Potier de Safi montant un vase en terre au tour, devant des céramiques bleues",
      en: "Safi potter raising a clay vase on the wheel, in front of blue ceramics",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  craftZellige: make(
    craftZellige640,
    craftZellige1122,
    1122,
    1402,
    "UklGRq4AAABXRUJQVlA4IKIAAADQBACdASoQABQAPu1iqU2ppaOiMAgBMB2JagCdMoR4PoArkBEDtertfas/yIw1gAD+JlXjZrKYT7QUrewevN+E3vPa90phXRhFJSY2xqLCP8wySSkH5EP7qkdrzfzLlfaWBU19snWH733gLz9t7XA6kpnvJwW3k8pZNAgLkqGWqRF1+O/OAtaTwwGcDBr28ju+kuH7IM2SyS3+0FQ7d4kkAAA=",
    {
      fr: "Maâlem taillant des tesselles de zellige au marteau, à côté d'un panneau étoilé",
      en: "Maâlem cutting zellige tesserae with a hammer next to a star-pattern panel",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  craftTadelakt: make(
    craftTadelakt640,
    craftTadelakt1122,
    1122,
    1402,
    "UklGRpgAAABXRUJQVlA4IIwAAACwBACdASoQABQAPu1iqU2ppaOiMAgBMB2JbACdMoMxg+gBv3QOY7oSc+qWAX+AAP7mYAz59mCD0V1lkFSU7H4vQi0NoeCOZjdYZfRxEqdZK0aoUeFJxqtivhFY16yBD+gUBZShFl3qZMUhS1C/JlpusM3Bi+TQkoa18UTQM56jBV9zhUUKGEHrbiAAAA==",
    {
      fr: "Artisan lissant un enduit tadelakt à la pierre, lanternes en cuivre en arrière-plan",
      en: "Artisan polishing tadelakt plaster with a stone, copper lanterns behind",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  craftBois: make(
    craftBois640,
    craftBois1122,
    1122,
    1402,
    "UklGRqgAAABXRUJQVlA4IJwAAACQBACdASoQABQAPu1iqU2ppaOiMAgBMB2JagCdMoAluxb0GhTndnyYlvWH93gA/k5fBMsBI5COV/KzlijWTXPoG/a5bQgaQWcPd3kF+Izw3W+8rTJ1wwp3Rn7IfB0UZq//CR3dqXJSZxHuOsXpFXI8oFSpT7CayJYcNhwU+rsI+c3RC6aqbmPmj9C2HyUJ0ckibMZ59LlhrMBb1AA=",
    {
      fr: "Coffret en thuya marqueté poli à la main dans un atelier d'Essaouira",
      en: "Inlaid thuya box being hand-polished in an Essaouira workshop",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  craftTissage: make(
    craftTissage640,
    craftTissage1122,
    1122,
    1402,
    "UklGRrQAAABXRUJQVlA4IKgAAABwBACdASoQABQAPu1iqU2ppaOiMAgBMB2JbACdMoMYA+gB+MEZ73hta0CXAAD3up2Vx7Oftry2RCC3p6ugoftQDnUU17K74jKp+jhWuydpMYQbwdWQZEjBSk9AhQzvzwiEOcKjqSwi3EO57/QgUtpB0TVeZ6EUB7WPlumBy89GZY6KOf7IPaMWv5HyesTP4GKYJhqj/04sSwOcqdXCSaCpqA1EjYgAAAA=",
    {
      fr: "Tisserande nouant la laine d'un tapis sur un métier, montagnes de l'Atlas au loin",
      en: "Weaver knotting wool on a rug loom, Atlas mountains in the distance",
    },
  ),
  // IMAGE EXEMPLE À REMPLACER PAR PHOTO RÉELLE
  craftCuir: make(
    craftCuir640,
    craftCuir1122,
    1122,
    1402,
    "UklGRqAAAABXRUJQVlA4IJQAAADwAwCdASoQABQAPu1iqU2ppaOiMAgBMB2JbACdMoRwABwKmW8FyjWWAPaa7jGP/v8LLEPsl+BKYWmg2/1sSc6vRBUZF7SeGZj5ocG2z727JHVoMkc/M4TPwgVqDU8NKGpY4x5Oj98DUCnGsCB6PrbnxMH06sqc0FYYTJ72DL7Ou8E4IlkQTM28M5IcveDRJbfFG4AA",
    {
      fr: "Maroquinier cousant à la main un sac en cuir ciselé",
      en: "Leatherworker hand-stitching a tooled leather bag",
    },
  ),
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;
