import { Coffee, CloudRain, PartyPopper, Gift, Snowflake } from "lucide-react";

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
    id: "cafe",
    emoji: "☕",
    label: "Hmm... isso aqui com um café...",
    titleLines: ["Hmm...", "isso aqui com", "um café..."],
  },
  {
    id: "festa",
    emoji: "🎉",
    label: "Não vai ter festa... só um bolinho.",
    titleLines: ["Não vai ter festa...", "só um bolinho."],
  },
  {
    id: "freezer",
    emoji: "❄️",
    label: "Seu eu do futuro agradece.",
    titleLines: ["Seu eu do futuro", "agradece."],
  },
];

export const MOMENT_INTRO = {
  cafe: "Sempre tem um bom motivo para colocar um docinho na mesa.",
  "dia-dificil":
    "Seja TPM, segunda-feira ou um dia difícil. Nem todo problema tem solução, mas um docinho sempre ajuda.",
  freezer:
    "Guarde no freezer e tenha sempre à mão opções low sugar para a lancheira das crianças ou para aquela vontade de um doce de última hora.",
  presente:
    "Pra gente, é muito mais que isso. Cada caixa é única, pensada e personalizada para que quem a receba se sinta realmente especial.",
  festa: "A gente conhece essa história... foi assim que muita festa começou.",
};

// Short, scannable version of MOMENT_INTRO used on the Home cards — the
// full text above still shows up inside each moment's own screen.
export const MOMENT_TAGLINE = {
  cafe: "Um docinho sempre cabe na mesa.",
  "dia-dificil": "TPM, segunda-feira ou só um dia difícil.",
  freezer: "Docinhos que ficam felizes no freezer.",
  presente: "Presentes feitos para alguém especial.",
  festa: "A gente conhece essa história...",
};

// One or two words per moment — for tight spots (quick-shortcut rows,
// nav) where the full label sentence doesn't fit.
export const MOMENT_SHORT = {
  cafe: "Café",
  "dia-dificil": "Dias de luta",
  freezer: "Freezer",
  presente: "Presente",
  festa: "Festa",
};

// Fixed display order within a moment, when it differs from catalog order.
export const MOMENT_ORDER = {
  "dia-dificil": ["bala-de-coco", "chocobomb", "cone-trufado", "mini-donut-decorado"],
};

export const MOMENT_ICON = {
  cafe: Coffee,
  "dia-dificil": CloudRain,
  festa: PartyPopper,
  presente: Gift,
  freezer: Snowflake,
};
