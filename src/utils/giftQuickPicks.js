import { PRODUCTS } from "../data/products.js";
import { GIFT_QUICK_PICKS } from "../data/giftQuickPicks.js";
import { parsePrice, entryPrice } from "./pricing.js";

// The 4 budget tiers — these belong ONLY to Presente Rápido (Fase 2 brief,
// item 3). Deliberately different ranges/labels from GiftIdeaWizard's own
// BUDGET_RANGES (Caixas/Cestas, src/data/giftOptions.js), which is just a
// loose hint for Naia, never a real filter — keeping the two visually and
// textually distinct avoids the site reading as if it has two different
// "orçamento" concepts with the same shape.
export const GIFT_BUDGET_TIERS = [
  { key: "ate-15", label: "Até $15" },
  { key: "15-30", label: "$15 – $30" },
  { key: "30-50", label: "$30 – $50" },
  { key: "50-mais", label: "$50+" },
];

// Resolves one curated pick into real, display-ready data — or null if it
// can't be honestly resolved (missing product, a packageLabel that no
// longer matches a real package, or a price that isn't a clean number).
// Never falls back to inventing a price: an unresolvable pick is simply
// left out of the results, not shown with a guessed value.
export function resolveGiftPick(pick) {
  const product = PRODUCTS.find((p) => p.id === pick.productId);
  if (!product) return null;

  if (pick.packageLabel) {
    const option = product.packageOptions?.find((opt) => opt.label === pick.packageLabel);
    if (!option) return null;
    return { product, qty: option.qty, packageLabel: option.label, totalPrice: option.price, quantityLabel: option.label };
  }

  if (product.singleItem) {
    const unitPrice = parsePrice(product.price);
    if (unitPrice == null) return null;
    return { product, qty: 1, packageLabel: null, totalPrice: unitPrice, quantityLabel: null };
  }

  const qty = pick.qty ?? 1;
  const totalPrice = entryPrice(product, qty);
  if (totalPrice == null) return null;
  const unitWord = product.quantityUnitWord ?? (qty === 1 ? "unidade" : "unidades");
  return { product, qty, packageLabel: null, totalPrice, quantityLabel: `${qty} ${unitWord}` };
}

// Up to 3 resolved ideas for a tier — never more, per the brief ("No
// máximo 3 resultados por faixa"). An unresolvable entry is dropped
// silently rather than shown broken; curation (GIFT_QUICK_PICKS) is the
// only thing that decides WHICH products can appear, this just resolves
// their real numbers.
export function getGiftQuickPicks(tierKey) {
  const picks = GIFT_QUICK_PICKS[tierKey] ?? [];
  return picks.map(resolveGiftPick).filter(Boolean).slice(0, 3);
}
