import { useEffect, useState } from "react";

const STORAGE_KEY = "mon-caramel:party";

// Same lazy-load-once + try/catch pattern as useSelection.js — items,
// theme and notes are all real planning work a customer can spend several
// minutes on, so all three are persisted together.
function loadInitialParty() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return { items: [], theme: "", notes: "" };
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      theme: typeof parsed.theme === "string" ? parsed.theme : "",
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    };
  } catch {
    return { items: [], theme: "", notes: "" };
  }
}

// "Minha Festa" — separate planning flow, only used inside the Festa moment.
// No prices anywhere, independent from the regular "Minha Seleção" basket
// used everywhere else (briefing section 5).
//
// Persisted to localStorage (same reasoning as useSelection.js) — a
// refresh/accidental tab close shouldn't wipe out items + tema + notes a
// customer already spent time on.
export function useParty() {
  const [party, setParty] = useState(loadInitialParty);
  const { items, theme, notes } = party;
  const [modalProduct, setModalProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const setItems = (updater) =>
    setParty((p) => ({ ...p, items: typeof updater === "function" ? updater(p.items) : updater }));
  const setTheme = (theme) => setParty((p) => ({ ...p, theme }));
  const setNotes = (notes) => setParty((p) => ({ ...p, notes }));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(party));
    } catch {
      // Storage full/unavailable — party planning still works for this
      // session, just won't survive a reload.
    }
  }, [party]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2200);
  };

  const openModal = (product) => setModalProduct(product);
  const closeModal = () => setModalProduct(null);

  const confirmAdd = ({ qty, theme: newTheme, notes: newNotes }) => {
    setItems((cur) => {
      const exists = cur.find((it) => it.id === modalProduct.id);
      if (exists) return cur.map((it) => (it.id === modalProduct.id ? { ...it, qty } : it));
      return [...cur, { id: modalProduct.id, name: modalProduct.name, unit: modalProduct.unit, qty }];
    });
    setTheme(newTheme);
    setNotes(newNotes);
    showToast(`✨ ${modalProduct.name} adicionado à Minha Festa.`);
    setModalProduct(null);
  };

  return { items, theme, notes, modalProduct, toast, openModal, closeModal, confirmAdd };
}
