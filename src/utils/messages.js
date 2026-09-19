// One line (or small block) of the WhatsApp message per selection entry —
// shape depends on entry.kind (see utils/selectionKey.js).
function describeEntry(it) {
  if (!it.kind || it.kind === "product") {
    const head = `${it.qty ? it.qty + " " : ""}${it.name}${it.unit ? ` (${it.unit})` : ""}`;
    if (it.flavors && it.flavors.length > 0) {
      const sub = it.flavors.map((f) => `   • ${f.qty} ${f.name}`).join("\n");
      return `${head}\n${sub}`;
    }
    return head;
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
export function buildSelectionMessage(selection) {
  const lines = selection.map(describeEntry);
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
