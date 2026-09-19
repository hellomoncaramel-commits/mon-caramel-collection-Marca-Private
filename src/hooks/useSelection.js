import { useState } from "react";

// Shared "Minha Seleção" cart — filled in from every screen, finalized as
// one WhatsApp message. Independent from "Minha Festa" (briefing section 5).
export function useSelection() {
  const [selection, setSelection] = useState([]);

  // One entry per product: adding again (e.g. re-configuring flavors) updates
  // it in place instead of duplicating the line.
  const addToSelection = (entry) => {
    setSelection((s) => {
      const exists = s.some((it) => it.productId === entry.productId);
      if (exists) return s.map((it) => (it.productId === entry.productId ? { ...it, ...entry } : it));
      return [...s, entry];
    });
  };

  const removeFromSelection = (productId) => setSelection((s) => s.filter((it) => it.productId !== productId));

  return { selection, addToSelection, removeFromSelection };
}
