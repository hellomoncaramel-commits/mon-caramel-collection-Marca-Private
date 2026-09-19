import { useState } from "react";
import { entryKey } from "../utils/selectionKey";

// Shared "Minha Seleção" — filled in from every screen, finalized as one
// WhatsApp message. Not a checkout cart: no prices are totaled, nothing is
// "bought" here. Holds regular products, liked gift-inspiration photos and
// configured gift ideas side by side (see utils/selectionKey.js).
export function useSelection() {
  const [selection, setSelection] = useState([]);

  // One entry per key: adding again (e.g. re-configuring flavors) updates
  // it in place instead of duplicating the line.
  const addToSelection = (entry) => {
    const key = entryKey(entry);
    setSelection((s) => {
      const exists = s.some((it) => entryKey(it) === key);
      if (exists) return s.map((it) => (entryKey(it) === key ? { ...it, ...entry } : it));
      return [...s, entry];
    });
  };

  const removeFromSelection = (item) => {
    const key = entryKey(item);
    setSelection((s) => s.filter((it) => entryKey(it) !== key));
  };

  const isSelected = (item) => selection.some((it) => entryKey(it) === entryKey(item));

  return { selection, addToSelection, removeFromSelection, isSelected };
}
