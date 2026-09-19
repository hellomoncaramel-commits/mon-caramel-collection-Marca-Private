import { useState } from "react";

// "Minha Festa" — separate planning flow, only used inside the Festa moment.
// No prices anywhere, independent from the regular "Minha Seleção" basket
// used everywhere else (briefing section 5).
export function useParty() {
  const [items, setItems] = useState([]); // [{id, name, unit, qty}]
  const [theme, setTheme] = useState("");
  const [notes, setNotes] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [toast, setToast] = useState(null);

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
