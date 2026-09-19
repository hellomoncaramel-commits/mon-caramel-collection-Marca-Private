import { Coffee, CloudRain, PartyPopper, Gift, Snowflake } from "lucide-react";

// Home is organized by moment/mood, not by traditional product category —
// see briefing section 4.
export const MOMENTS = [
  { id: "cafe", emoji: "☕", label: "Hmm... isso aqui com um café..." },
  { id: "dia-dificil", emoji: "💛", label: "Dias de luta. Doces de glória." },
  { id: "freezer", emoji: "❄️", label: "Seu eu do futuro agradece." },
  { id: "presente", emoji: "🎁", label: "É só uma lembrancinha." },
  { id: "festa", emoji: "🎉", label: "Não vai ter festa... só um bolinho." },
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
