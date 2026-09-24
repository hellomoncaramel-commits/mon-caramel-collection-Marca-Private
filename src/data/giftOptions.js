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
// treat, i.e. real, cataloged products (with real photos, so the step can
// show a picture, not just a word). These 7 ids used to be picked out by
// filtering products.js for the "cafe" moment tag; now that "cafe" has
// been folded into "dia-dificil" (src/data/moments.js) — a broader moment
// that also covers non-everyday treats like Chocobomb — the same 7 ids are
// listed explicitly here instead, so this step keeps showing exactly the
// products it always has.
const CAIXA_MUST_HAVE_IDS = ["brigadeiro", "alfajor", "pao-de-mel", "bolo-cenoura", "butter-cookies", "casadinho", "melties"];
export const CAIXA_MUST_HAVE_PRODUCTS = PRODUCTS.filter((p) => CAIXA_MUST_HAVE_IDS.includes(p.id));

// Not a real product — a wildcard the customer can pick alongside (or
// instead of) actual items, handled specially wherever items are rendered.
export const SURPRISE_ME = { id: "surpreenda-me", name: "Surpreenda-me" };
