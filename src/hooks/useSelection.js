import { useEffect, useState } from "react";
import { entryKey } from "../utils/selectionKey";

const STORAGE_KEY = "mon-caramel:selection";

// Lazy-load-once + try/catch pattern (same as useParty.js) — read once at
// module-load-time (the one useSelection instance App.jsx holds), never
// crash on private browsing/disabled/corrupted storage, just start empty.
function loadInitialSelection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Shared "Minha Seleção" — filled in from every screen, finalized as one
// WhatsApp message. Not a checkout cart: no prices are totaled, nothing is
// "bought" here. Holds regular products, liked gift-inspiration photos and
// configured gift ideas side by side (see utils/selectionKey.js).
//
// Persisted to localStorage (same entries, same shape, same entryKey — only
// the initial value and a save-on-change effect were added) so a refresh
// doesn't wipe out what the customer already picked.
export function useSelection() {
  const [selection, setSelection] = useState(loadInitialSelection);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // Storage full/unavailable — selection still works for this session,
      // just won't survive a reload.
    }
  }, [selection]);

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
