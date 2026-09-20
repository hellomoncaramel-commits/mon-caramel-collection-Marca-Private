import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { isBrowsable } from "../../utils/products";
import BackButton from "../shared/BackButton";
import FeedCard from "../Feed/FeedCard";

// Quick shortcuts to real, already-cataloged products — not invented
// categories. Whoever tapped "já sei o que quero" gets straight to results,
// no mood quiz in the way.
const QUICK_TERMS = ["Brigadeiros", "Pão de Mel", "Biscoito Amanteigado", "Alfajor", "Bolo de Cenoura", "Mini Donuts"];

export default function SearchScreen({ onBack, onGoCatalog, favorites, toggleFavorite, onOpenProduct }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(isBrowsable).filter(
      (p) => p.name.toLowerCase().includes(q) || p.sensory.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-xl mx-auto px-5 pt-8 pb-10 fade-up">
      <BackButton onClick={onBack} label="Voltar" />
      <h1 className="text-2xl font-display text-brand-ink mb-4">O que você está procurando?</h1>

      <label htmlFor="search-input" className="sr-only">
        Buscar produto
      </label>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar brigadeiro, pão de mel..."
          className="w-full rounded-full border border-brand-border pl-11 pr-4 py-3 text-sm bg-white min-h-11"
        />
      </div>

      {!query && (
        <div className="flex flex-wrap gap-2 mb-6">
          {QUICK_TERMS.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="text-sm rounded-full px-4 py-2 border border-brand-border bg-white text-brand-ink min-h-11"
            >
              {term}
            </button>
          ))}
          <button
            onClick={onGoCatalog}
            className="text-sm font-medium rounded-full px-4 py-2 border border-brand-caramelDark text-brand-caramelDark min-h-11"
          >
            Ver tudo
          </button>
        </div>
      )}

      {query && (
        <>
          <p className="text-xs mb-4 text-brand-muted">
            {results.length === 0 ? "Nada encontrado" : `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`}
          </p>
          <div className="flex flex-col gap-8">
            {results.map((p) => (
              <FeedCard
                key={p.id}
                product={p}
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={toggleFavorite}
                onOpen={onOpenProduct}
              />
            ))}
          </div>
          {results.length === 0 && (
            <button onClick={onGoCatalog} className="w-full text-center text-sm underline text-brand-muted mt-4 min-h-11">
              Ver a coleção completa
            </button>
          )}
        </>
      )}
    </div>
  );
}
