// Builds the WhatsApp message from the shared "Minha Seleção" cart, used by
// every screen (catálogo, cada momento, tela de seleção).
export function buildSelectionMessage(selection) {
  const lines = selection.map((it) => {
    const head = `${it.qty ? it.qty + " " : ""}${it.name}${it.unit ? ` (${it.unit})` : ""}`;
    if (it.flavors && it.flavors.length > 0) {
      const sub = it.flavors.map((f) => `   • ${f.qty} ${f.name}`).join("\n");
      return `${head}\n${sub}`;
    }
    return head;
  });
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
