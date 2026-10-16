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
    // Reads as the person's own answer to the page's own opening question
    // ("Como você está hoje?" → "Hoje eu só quero um docinho.") — replaces
    // the old "Dias de luta. Doces de glória.", which read as an ad slogan
    // rather than something a real person would say about their own day
    // (editorial audit, 2026-10).
    label: "Hoje eu só quero um docinho.",
    titleLines: ["Hoje eu só quero", "um docinho."],
  },
  {
    id: "presente",
    emoji: "🎁",
    // No period — approved direction post-UX/UI-audit: an open phrase, not
    // a closed statement, consistent across every customer-facing surface.
    label: "É só uma lembrancinha",
    titleLines: ["É só uma", "lembrancinha"],
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
    "Se o dia está difícil, você precisa de uma pausa ou quer receber alguém com carinho, um docinho artesanal sempre ajuda a deixar tudo um pouquinho melhor.",
  presente:
    "Pra gente, é muito mais que isso. Cada caixa é única, pensada e personalizada para que quem a receba se sinta realmente especial.",
  festa: "A gente conhece essa história... foi assim que muita festa começou.",
};

// Short, scannable version of MOMENT_INTRO used on the Home cards — the
// full text above still shows up inside each moment's own screen.
export const MOMENT_TAGLINE = {
  "dia-dificil": "Café, TPM, lanche ou só vontade de um docinho.",
  // Post-UX/UI-audit: replaces the generic "Presentes feitos para alguém
  // especial." — communicates the actual idea (mimo nunca é pequeno),
  // distinct from the internal page's own subtitle below so the two never
  // repeat the same thought (see PresenteEntryScreen.jsx).
  presente: "Pra gente, nunca é só uma lembrancinha. Toda ocasião merece ser celebrada com um pouco de doçura.",
  festa: "A gente conhece essa história — foi assim que muita festa começou.",
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
  // Festa is a deliberately curated menu — only products that make sense
  // for a party/personalization occasion, in this exact order. Day-to-day
  // staples (Pão de Mel, Casadinho, Bala de Coco, Brigadeiros
  // Personalizados, Lembrancinhas Pirâmide) were removed from Festa's
  // `moments` tag entirely (still browsable elsewhere in the catalog) so
  // there's nothing left unlisted for pickForMoment() to append afterward.
  festa: [
    "bolo-palito",
    "pirulito-decorado",
    "cone-trufado",
    "briganinho-personalizado",
    "mini-donut-decorado",
    "chocobomb",
    "docinho-personalizado",
  ],
};

export const MOMENT_ICON = {
  "dia-dificil": CloudRain,
  festa: PartyPopper,
  presente: Gift,
};
