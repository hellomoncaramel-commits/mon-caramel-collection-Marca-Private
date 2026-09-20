// Price display isn't turned on in the UI yet — most of the catalog still
// uses non-numeric strings ("A partir de $14", "Sob consulta", "mín. 25 un")
// while Naia finalizes real pricing in Excel. This utility exists so the
// calculation is ready; SelectionScreen keeps it computed but hidden until
// she confirms it should show (2026 decision: "você me diz depois").

// Only accepts a clean "$12" / "$12.50" / "$12.50/un" shape — anything with
// words ("A partir de", "Sob consulta", "mín.") or a range returns null.
export function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.trim().match(/^\$(\d+(?:\.\d{1,2})?)(?:\/un)?$/i);
  if (!match) return null;
  return parseFloat(match[1]);
}

// Per-entry subtotal, product entries only (inspiration/gift-idea have no
// fixed price to add up). Returns null when the product's price isn't a
// clean parseable number.
export function entryPrice(product, qty) {
  if (!product) return null;
  const unitPrice = parsePrice(product.price);
  if (unitPrice == null) return null;
  return unitPrice * (qty || 1);
}

// Whole-selection subtotal. `complete` is false whenever at least one entry
// couldn't be priced (any non-product entry, or a product with a non-numeric
// price) — callers should treat an incomplete subtotal as a floor, not a total.
export function computeSubtotal(selection, productsById) {
  let total = 0;
  let complete = true;
  for (const it of selection) {
    if (!it.kind || it.kind === "product") {
      const price = entryPrice(productsById.get(it.productId), it.qty);
      if (price == null) {
        complete = false;
      } else {
        total += price;
      }
    } else {
      complete = false;
    }
  }
  return { total, complete };
}
