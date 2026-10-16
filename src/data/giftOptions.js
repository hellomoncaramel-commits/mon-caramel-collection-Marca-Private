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

// Post-UX/UI-audit final decision (2026-10): exactly these 5 + "Outra" —
// "Café da manhã" dropped, "Parabéns" merged into "Parabéns / conquista".
export const CESTA_OCCASIONS = ["Aniversário", "Agradecimento", "Parabéns / conquista", "Só porque sim", "Outra"];

// Etapa 1 ("O que não pode faltar?") of the Cesta wizard — replaces the old
// generic category chips (Doces/Bolo/Cookies/Bebida/Balão/Mensagem, none of
// them a real SKU) with the exact 7-product allow-list from the final
// post-audit decision: real products.js entries only, so the step can show
// a real photo per choice, same pattern as CAIXA_MUST_HAVE_PRODUCTS below.
// "Mini Cake Donuts" and any other catalog item not on this list is
// deliberately excluded — not every product belongs in a cesta.
const CESTA_DOCES_IDS = ["brigadeiro", "pao-de-mel", "alfajor", "casadinho", "butter-cookies", "brownlito", "bala-de-coco"];
export const CESTA_DOCES_PRODUCTS = PRODUCTS.filter((p) => CESTA_DOCES_IDS.includes(p.id));

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
