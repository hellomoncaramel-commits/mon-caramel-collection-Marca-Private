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

// Whether a product belongs in general, price-showing browsing (the feed,
// search, catalog). Excludes: presente-exclusive items (pure inspiration,
// not an individual SKU with its own day-to-day moment — they live only in
// PresenteScreen) and festa-exclusive items, since the Festa flow
// deliberately never shows a price or mixes with Minha Seleção. A product
// with `presenteGroup` set that *also* belongs to a real moment (e.g.
// Brownlito — dia-dificil catalog AND Presentes → Pequenos Mimos, see
// data/products.js) stays browsable: `presenteGroup` only means "also
// featured in Presentes," not "exclusive to Presentes."
export function isBrowsable(product) {
  const hasRealMoment = product.moments.some((m) => m !== "presente" && m !== "festa");
  if (product.presenteGroup && !hasRealMoment) return false;
  if (product.moments.length === 1 && product.moments[0] === "festa") return false;
  return true;
}

// Same idea as photosForMoment, but for contexts with no moment in play
// (the feed, search results, catalog) — first whatever general photos
// the product has, otherwise the first moment-specific set available.
export function defaultPhotos(product) {
  if (product.photos) return product.photos;
  if (product.photosByMoment) return Object.values(product.photosByMoment)[0];
  if (product.photoByMoment) return [Object.values(product.photoByMoment)[0]];
  return null;
}

// Pulls whole numbers out of a unit string like "6, 12 ou 24 unidades" to
// offer as quantity chips. Falls back to a single default when the unit
// doesn't describe multiple options.
export function parseQuantityOptions(unit) {
  const nums = (unit || "").match(/\d+/g);
  if (!nums || nums.length === 0) return [1];
  return [...new Set(nums.map((n) => parseInt(n, 10)))];
}

// Legacy fallback: a real commercial minimum when the unit text says so
// explicitly ("mín. 5", "mín. 12 un") — deliberately NOT inferred from the
// first number parseQuantityOptions would find. That number can just as
// easily be a pack size ("3 unidades") or a weight ("250g", "~60g ... por
// unidade"), neither of which means "can't order fewer than that many
// units" — conflating them would silently floor Sequilhos/Bala de Coco at
// 250/150 "units". Returns null (no artificial floor) whenever "mín."
// isn't present, rather than guessing. Still used by the handful of
// products that encode their minimum this way (Alfajor, Briganinhos/
// Brigadeiros Personalizados) — see minimumQuantityOf below for the
// preferred, non-text-parsing path.
export function parseMinQuantity(unit) {
  const match = (unit || "").match(/mín\.?\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

// The real source of truth for a commercial minimum: the product's own
// `minimumQuantity` field, set explicitly in products.js only when there's
// a confirmed commercial rule for that exact product (e.g. Pão de Mel/
// Chocobomb → 4, Cone Trufado → 2). Never derived by parsing `unit` or any
// other display string — price, sale unit, weight/content and minimum are
// kept as separate fields on purpose, so a weight ("250g") or pack size
// ("3 unidades") can never be silently read as a minimum. Products not yet
// migrated to this field fall back to the legacy "mín." text marker above,
// so their existing behavior is unchanged.
export function minimumQuantityOf(product) {
  return product.minimumQuantity ?? parseMinQuantity(product.unit);
}

// The quantity to start a product at — quick-add (ProductCard/FeedCard/
// SearchScreen/PartyModal) and the detail sheet's own stepper, both its
// default value and its floor.
//
// Only ever called for non-customizable products: the one customizable
// product today (Brigadeiro, "6, 12 ou 24 unidades") is always routed to
// FlavorConfigurator instead, whose own qtyOptions stepper (built on
// parseQuantityOptions) already handles that discrete-options case
// correctly and isn't touched by this.
export function initialQuantity(product) {
  return minimumQuantityOf(product) ?? 1;
}

// Pure display formatting — never touches the underlying data. The
// approved price string is always "$X/un" (unit price, see products.js);
// this turns it into the warmer "$X cada" the card now shows. Anything
// that doesn't match that exact shape (e.g. "Sob consulta 💬", "A partir
// de $14") is returned unchanged — never guessed at.
export function displayPriceCada(price) {
  const match = /^\$(\d+(?:\.\d{1,2})?)\/un$/i.exec(price || "");
  return match ? `$${match[1]} cada` : price;
}

// Splits a total quantity evenly across N selected flavors, handing the
// remainder to the first flavors so the numbers always add up exactly.
export function splitEvenly(total, count) {
  if (count === 0) return [];
  const base = Math.floor(total / count);
  const remainder = total % count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}
