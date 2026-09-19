import { PRODUCTS } from "./products";

// Config for the "Presentes" idea-builders (Caixas & Bandejas). Everything
// here is either a UI-only category label (never a priced product/SKU) or
// derived straight from the real product catalog — nothing invented.
//
// Naia: the arrays below (occasions, tray contents, budget ranges) are
// plain strings — safe to edit, add to, or reorder any time.

// Self-reported budget range, never a computed/quoted price — just tells
// Naia roughly what the customer has in mind.
export const BUDGET_RANGES = ["Até $30", "$30–50", "$50–75", "$75+", "Ainda não sei"];

export const BANDEJA_OCCASIONS = ["Aniversário", "Café da manhã", "Parabéns", "Agradecimento", "Só porque sim", "Outra"];

export const BANDEJA_CONTENTS = ["Doces", "Bolo", "Cookies", "Bebida", "Balão", "Mensagem"];

// "O que não pode faltar" options for the Caixa builder — every day-to-day
// treat already tagged to the "cafe" moment, i.e. real, cataloged products.
export const CAIXA_MUST_HAVES = [...PRODUCTS.filter((p) => p.moments.includes("cafe")).map((p) => p.name), "Surpreenda-me"];

// Editorial inspiration photos for a presente sub-group ("caixas" |
// "bandejas") — pulled from the matching cataloged products, but shown
// without name, price or an "add to cart" affordance: these are references,
// not fixed SKUs (briefing: "Reformular completamente a área de presentes").
export function getInspiration(group) {
  return PRODUCTS.filter((p) => p.presenteGroup === group).map((p) => ({
    id: p.id,
    photo: p.photos?.[0],
    caption: p.sensory,
  }));
}

export function getMimos() {
  return PRODUCTS.filter((p) => p.presenteGroup === "mimos");
}
