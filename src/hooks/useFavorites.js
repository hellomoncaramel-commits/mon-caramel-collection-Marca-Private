import { useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);

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
