// "Minha Seleção" holds three kinds of entries: a regular product (kind
// "product", keyed by productId), a liked gift-inspiration photo (kind
// "inspiration", keyed by its own id) or a configured gift idea (kind
// "gift-idea", keyed by its own id). This gives every entry a single,
// stable identity for de-duplication regardless of kind.
export function entryKey(item) {
  if (!item.kind || item.kind === "product") return `product:${item.productId}`;
  return `${item.kind}:${item.id}`;
}
