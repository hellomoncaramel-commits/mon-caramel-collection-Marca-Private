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
// treat already tagged to the "cafe" moment, i.e. real, cataloged products
// (with real photos, so the step can show a picture, not just a word).
export const CAIXA_MUST_HAVE_PRODUCTS = PRODUCTS.filter((p) => p.moments.includes("cafe"));

// Not a real product — a wildcard the customer can pick alongside (or
// instead of) actual items, handled specially wherever items are rendered.
export const SURPRISE_ME = { id: "surpreenda-me", name: "Surpreenda-me" };

export function getMimos() {
  return PRODUCTS.filter((p) => p.presenteGroup === "mimos");
}
