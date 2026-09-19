import { useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const toggleFavorite = (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  return { favorites, toggleFavorite };
}
