import { CloudRain, PartyPopper, Gift } from "lucide-react";

// Home is organized by moment/mood, not by traditional product category —
// see briefing section 4.
// titleLines is an optional editorial line-break for the moment carousel
// card's heading (see MomentPicker) — label stays the plain-text source
// used everywhere else and for accessibility.
export const MOMENTS = [
  {
    id: "dia-dificil",
    emoji: "💛",
    label: "Dias de luta. Doces de glória.",
    titleLines: ["Dias de luta.", "Doces de glória."],
  },
  {
    id: "presente",
    emoji: "🎁",
    label: "É só uma lembrancinha.",
    titleLines: ["É só uma", "lembrancinha."],
  },
  {
    id: "festa",
    emoji: "🎉",
    label: "Não vai ter festa... só um bolinho.",
    titleLines: ["Não vai ter festa...", "só um bolinho."],
  },
];

export const MOMENT_INTRO = {
  "dia-dificil":
    "Seja TPM, segunda-feira, uma pausa pro café ou só aquela vontade de um doce. Nem todo problema tem solução, mas um docinho sempre ajuda.",
  presente:
    "Pra gente, é muito mais que isso. Cada caixa é única, pensada e personalizada para que quem a receba se sinta realmente especial.",
  festa: "A gente conhece essa história... foi assim que muita festa começou.",
};

// Short, scannable version of MOMENT_INTRO used on the Home cards — the
// full text above still shows up inside each moment's own screen.
export const MOMENT_TAGLINE = {
  "dia-dificil": "Café, TPM, lanche ou só vontade de um docinho.",
  presente: "Presentes feitos para alguém especial.",
  festa: "A gente conhece essa história...",
};

// One or two words per moment — for tight spots (quick-shortcut rows,
// nav) where the full label sentence doesn't fit.
export const MOMENT_SHORT = {
  "dia-dificil": "Dias de luta",
  presente: "Presente",
  festa: "Festa",
};

// Fixed display order within a moment, when it differs from catalog order.
// Anything not listed here still shows — pickForMoment() (utils/products.js)
// appends every other matched product afterward, in catalog (PRODUCTS array)
// order. Listed ids ALWAYS sort before unlisted ones, so a pair only stays
// adjacent if BOTH ids are listed here, consecutively — that's why every
// regular/frozen-variant pair below (see data/products.js) is spelled out
// in full, rather than relying on where either one happens to sit in
// PRODUCTS. "pao-de-mel" leads deliberately — Naia wants it to be the
// first thing a customer sees in this category.
export const MOMENT_ORDER = {
  "dia-dificil": [
    "pao-de-mel",
    "bala-de-coco",
    "chocobomb",
    "cone-trufado",
    "mini-donut-decorado",
    "mini-donut-simples",
    "butter-cookies",
    "butter-cookies-congelado",
  ],
};

export const MOMENT_ICON = {
  "dia-dificil": CloudRain,
  festa: PartyPopper,
  presente: Gift,
};
