import { useEffect, useState } from "react";

const STORAGE_KEY = "mon-caramel:favorites";

// Read once at module load, not per-mount — App.jsx holds the one
// useFavorites instance for the whole app, but this guards against a
// future second caller re-reading stale localStorage after the first
// has already changed it in memory.
function loadInitialFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Private browsing, disabled storage, or corrupted JSON — start empty
    // rather than crash; favorites just won't persist this session.
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadInitialFavorites);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage full/unavailable — favorites still work for this session,
      // just won't survive a reload.
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((f) => {
      const removing = f.includes(id);
      if (!removing) {
        setToast("♥ Salvo");
        setTimeout(() => setToast((t) => (t === "♥ Salvo" ? null : t)), 1600);
      }
      return removing ? f.filter((x) => x !== id) : [...f, id];
    });
  };

  return { favorites, toggleFavorite, toast };
}
