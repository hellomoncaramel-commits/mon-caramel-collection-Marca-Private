import { PRODUCTS } from "../data/products";
import { MOMENT_ORDER } from "../data/moments";

export function pickForMoment(momentId) {
  const matched = PRODUCTS.filter((p) => p.moments.includes(momentId));
  const priority = MOMENT_ORDER[momentId];
  if (!priority) return matched;
  return [...matched].sort((a, b) => {
    const ia = priority.indexOf(a.id);
    const ib = priority.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

// Cross-sell: products tagged to *other* moments than the current one, to
// nudge genuine discovery beyond what the customer came looking for. Festa
// items are excluded everywhere else — they read as out of place outside
// the Festa moment itself.
export function pickCrossSell(momentId, alreadyShown) {
  const shownIds = alreadyShown.map((p) => p.id);
  const others = PRODUCTS.filter(
    (p) => !shownIds.includes(p.id) && !p.moments.includes(momentId) && !p.moments.includes("festa")
  );
  return others.slice(0, 2);
}

// Resolves which photo set to show a product in, given the current moment:
// a moment-specific set wins, then the product's general photos, then a
// single moment-specific photo, otherwise none (falls back to <ProductArt />).
export function photosForMoment(product, momentId) {
  return (
    product.photosByMoment?.[momentId] ||
    product.photos ||
    (product.photoByMoment?.[momentId] ? [product.photoByMoment[momentId]] : null) ||
    null
  );
}

// Pulls whole numbers out of a unit string like "6, 12 ou 24 unidades" to
// offer as quantity chips. Falls back to a single default when the unit
// doesn't describe multiple options.
export function parseQuantityOptions(unit) {
  const nums = (unit || "").match(/\d+/g);
  if (!nums || nums.length === 0) return [1];
  return [...new Set(nums.map((n) => parseInt(n, 10)))];
}

// Splits a total quantity evenly across N selected flavors, handing the
// remainder to the first flavors so the numbers always add up exactly.
export function splitEvenly(total, count) {
  if (count === 0) return [];
  const base = Math.floor(total / count);
  const remainder = total % count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}
