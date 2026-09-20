import { useMemo, useState } from "react";
import { Search, Plus, Check, MessageCircle } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { isBrowsable, defaultPhotos, parseQuantityOptions } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import BackButton from "../shared/BackButton";
import ProductArt from "../shared/ProductArt";
import Photo from "../shared/Photo";

// Quick shortcuts to real, already-cataloged products — not invented
// categories. Whoever tapped "já sei o que quero" gets straight to results,
// no mood quiz in the way.
const QUICK_TERMS = ["Brigadeiros", "Pão de Mel", "Biscoito Amanteigado", "Alfajor", "Bolo de Cenoura", "Mini Donuts"];

// Compact row (thumbnail + name + short description + price + quick add) —
// search results favor speed and scannability over the feed's big-photo
// seduction, since whoever's here already knows what they want.
function ResultRow({ p, isAdded, onQuickAdd, onOpen }) {
  const photo = defaultPhotos(p)?.[0];
  const isCustomizable = p.customizable === true;

  return (
    <button onClick={() => onOpen(p)} className="w-full flex items-center gap-3 text-left py-2">
      <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden">
        {photo ? <Photo src={photo} alt="" className="w-full h-full object-cover" loading="lazy" /> : <ProductArt kind={p.kind} tint={p.tint} h="h-16" />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-display text-brand-ink leading-tight truncate">{p.name}</h3>
        <p className="text-xs text-brand-inkSoft leading-snug line-clamp-1">{p.sensory}</p>
        <p className="text-sm font-medium mt-0.5 text-brand-caramelDark">{p.price}</p>
      </div>
      <span
        onClick={(e) => {
          e.stopPropagation();
          if (isCustomizable) onOpen(p);
          else onQuickAdd(p, parseQuantityOptions(p.unit)[0]);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            if (isCustomizable) onOpen(p);
            else onQuickAdd(p, parseQuantityOptions(p.unit)[0]);
          }
        }}
        aria-label={isAdded ? `${p.name} já está na seleção` : `Adicionar ${p.name} à seleção`}
        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
        style={{ backgroundColor: isAdded ? COLORS.caramelDark : `${COLORS.caramelDark}15` }}
      >
        {isAdded ? <Check size={16} className="text-white" /> : <Plus size={16} style={{ color: COLORS.caramelDark }} />}
      </span>
    </button>
  );
}

export default function SearchScreen({ onBack, onGoCatalog, selection, addToSelection, onOpenProduct, onSend }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(isBrowsable).filter(
      (p) => p.name.toLowerCase().includes(q) || p.sensory.toLowerCase().includes(q)
    );
  }, [query]);

  const isAdded = (p) => selection.some((it) => it.kind === "product" && it.productId === p.id);
  const quickAdd = (p, qty) =>
    addToSelection({ kind: "product", productId: p.id, name: p.name, unit: p.unit, qty, flavors: null });

  return (
    <div className="max-w-xl mx-auto px-4 pt-8 pb-10 fade-up">
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
          <p className="text-xs mb-2 text-brand-muted">
            {results.length === 0 ? "Nada encontrado" : `Resultados para "${query}" · ${results.length} ${results.length === 1 ? "produto" : "produtos"}`}
          </p>
          <div className="divide-y divide-brand-border">
            {results.map((p) => (
              <ResultRow key={p.id} p={p} isAdded={isAdded(p)} onQuickAdd={quickAdd} onOpen={onOpenProduct} />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-brand-border text-center">
            <p className="text-sm mb-3 text-brand-inkSoft">
              {results.length === 0 ? "Não encontrou o que procura?" : "Não era bem isso?"} Fala com a gente no WhatsApp 💛
            </p>
            <button
              onClick={() => onSend("Oi! Estava procurando um produto no site da Mon Caramel e não encontrei. Pode me ajudar? 💛")}
              className="inline-flex items-center gap-2 text-sm font-medium text-white rounded-full px-5 py-3 min-h-11"
              style={{ backgroundColor: COLORS.caramelDark }}
            >
              <MessageCircle size={15} />
              Conversar agora
            </button>
          </div>
        </>
      )}
    </div>
  );
}
