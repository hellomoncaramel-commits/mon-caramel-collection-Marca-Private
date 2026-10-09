import { parsePrice } from "./pricing";

// One line (or small block) of the WhatsApp message per selection entry —
// shape depends on entry.kind (see utils/selectionKey.js). `productsById`
// is the live PRODUCTS lookup (Map), passed down from buildSelectionMessage
// — used only to flag entries whose price was never resolved.
function describeEntry(it, productsById) {
  if (!it.kind || it.kind === "product") {
    // Package-priced products (Brigadeiro, Casadinho, Sequilho) describe
    // themselves by their chosen package label ("24 brigadeiros", "500g")
    // instead of the generic qty/unit pattern — qty is 1 for weight-based
    // packages, and `unit` is stale legacy text once packageOptions is
    // set (see products.js), so neither reads correctly here. A
    // `singleItem` product (Bolo de Cenoura) similarly skips the "{qty} "
    // prefix — qty is always 1 because it's one whole item, not a count.
    const head = it.packageLabel
      ? `${it.name} — ${it.packageLabel}`
      : it.singleItem
      ? `${it.name}${it.unit ? ` (${it.unit})` : ""}`
      : `${it.qty ? it.qty + " " : ""}${it.name}${it.unit ? ` (${it.unit})` : ""}`;

    // A package entry already carries its own confirmed price (packageLabel/
    // packagePrice), never "Sob consulta" regardless of the live product's
    // own (stale/unused) `price` field. Everything else is flagged when the
    // live product's price isn't a clean, resolved number — covers both a
    // genuinely "Sob consulta" product and a legacy entry saved to
    // localStorage before that product had real commercial data — so the
    // message never implies a fixed total for an item that still needs a
    // price conversation.
    const needsConsult = !it.packageLabel && parsePrice(productsById?.get(it.productId)?.price) == null;
    const headLine = needsConsult ? `${head} — Sob consulta 💬` : head;

    if (it.flavors && it.flavors.length > 0) {
      const sub = it.flavors.map((f) => `   • ${f.qty} ${f.name}`).join("\n");
      return `${headLine}\n${sub}`;
    }
    if (it.options && it.options.length > 0) {
      const sub = it.options.map((o) => `   • ${o.label}: ${o.value}`).join("\n");
      return `${headLine}\n${sub}`;
    }
    return headLine;
  }
  if (it.kind === "inspiration") {
    return `📌 Referência que gostei: ${it.title}`;
  }
  if (it.kind === "gift-idea") {
    const lines = [`💌 Ideia de ${it.groupLabel}`];
    if (it.items?.length) lines.push(`   Itens: ${it.items.join(", ")}`);
    const prefs = [];
    if (it.occasion) prefs.push(`ocasião: ${it.occasion}`);
    if (it.personalization?.name) prefs.push(`nome: ${it.personalization.name}`);
    if (it.personalization?.colors) prefs.push(`cores: ${it.personalization.colors}`);
    if (it.personalization?.theme) prefs.push(`tema: ${it.personalization.theme}`);
    if (it.personalization?.message) prefs.push(`mensagem: ${it.personalization.message}`);
    if (prefs.length) lines.push(`   Personalização: ${prefs.join(", ")}`);
    if (it.budget) lines.push(`   Faixa que imaginei: ${it.budget}`);
    return lines.join("\n");
  }
  return it.name || "";
}

// Builds the WhatsApp message from the shared "Minha Seleção", used by
// every screen (catálogo, cada momento, presentes, tela de seleção).
// `productsById` (Map, productId -> product) is optional but should always
// be passed by real callers — see describeEntry's own comment on why.
export function buildSelectionMessage(selection, productsById) {
  const lines = selection.map((it) => describeEntry(it, productsById));
  return `Oi! Essa é minha seleção pela Mon Caramel Collection ✨\n\n${lines.join(
    "\n\n"
  )}\n\nPodem confirmar disponibilidade, personalização e valores?`;
}

// Builds the WhatsApp budget-request message from "Minha Festa" — always a
// separate flow from "Minha Seleção", never priced (briefing section 5).
export function buildPartyMessage({ items, theme, notes }) {
  const lines = items.map((it) => `• ${it.qty} ${it.name}`);
  let msg = `Olá! Gostaria de um orçamento para minha festa.\n\nItens selecionados:\n${lines.join("\n")}`;
  if (theme.trim()) msg += `\n\nTema:\n${theme.trim()}`;
  if (notes.trim()) msg += `\n\nObservações:\n${notes.trim()}`;
  msg += `\n\nObrigado!`;
  return msg;
}
