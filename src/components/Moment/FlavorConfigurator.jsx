import { useState, useMemo } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { parseQuantityOptions, splitEvenly } from "../../utils/products";

// Inline "escolha seus sabores" configurator shown inside a customizable
// product's card: quantity first ("quantos você quer?"), then flavor chips
// (multi-select), with a live, auto-split breakdown of quantity per flavor.
// Kept as an elegant inline expansion rather than a separate modal/drawer —
// the product stays visible the whole time.
export default function FlavorConfigurator({ product, existing, onConfirm }) {
  const qtyOptions = useMemo(() => parseQuantityOptions(product.unit), [product.unit]);
  const [qty, setQty] = useState(existing?.qty ?? qtyOptions[0]);
  const [selectedFlavors, setSelectedFlavors] = useState(existing?.flavors ? existing.flavors.map((f) => f.name) : []);

  const toggleFlavor = (name) => {
    setSelectedFlavors((cur) => (cur.includes(name) ? cur.filter((f) => f !== name) : [...cur, name]));
  };

  const flavorBreakdown = useMemo(() => {
    if (selectedFlavors.length === 0) return [];
    const parts = splitEvenly(qty, selectedFlavors.length);
    return selectedFlavors.map((name, i) => ({ name, qty: parts[i] }));
  }, [selectedFlavors, qty]);

  // Steps through the real cataloged quantities (e.g. 6 → 12 → 24) rather
  // than an arbitrary ±1 — a customer can never land on a quantity that
  // isn't actually offered.
  const qtyIndex = qtyOptions.indexOf(qty);
  const stepQty = (dir) => setQty(qtyOptions[Math.max(0, Math.min(qtyOptions.length - 1, qtyIndex + dir))]);

  return (
    <div className="fade-up">
      {qtyOptions.length > 1 && (
        <>
          <p className="text-sm font-display text-brand-ink mb-2">Quantidade</p>
          <div className="inline-flex items-center gap-1 rounded-full border border-brand-border mb-4">
            <button
              onClick={() => stepQty(-1)}
              disabled={qtyIndex <= 0}
              aria-label="Diminuir quantidade"
              className="w-11 h-11 flex items-center justify-center disabled:opacity-30"
            >
              <Minus size={16} className="text-brand-ink" />
            </button>
            <span className="w-10 text-center text-base font-medium text-brand-ink" aria-live="polite">
              {qty}
            </span>
            <button
              onClick={() => stepQty(1)}
              disabled={qtyIndex >= qtyOptions.length - 1}
              aria-label="Aumentar quantidade"
              className="w-11 h-11 flex items-center justify-center disabled:opacity-30"
            >
              <Plus size={16} className="text-brand-ink" />
            </button>
          </div>
        </>
      )}

      {product.flavors.length === 0 ? (
        <p className="text-xs italic text-brand-muted">Sabores em breve — fala com a gente pra combinar.</p>
      ) : (
        <>
          <p className="text-sm font-display text-brand-ink mb-2">Escolha seus sabores</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.flavors.map((f) => {
              const on = selectedFlavors.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleFlavor(f)}
                  className="text-xs rounded-full px-3 py-1.5 border"
                  style={{
                    backgroundColor: on ? COLORS.caramelDark : "transparent",
                    color: on ? "white" : COLORS.ink,
                    borderColor: on ? COLORS.caramelDark : COLORS.border,
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {flavorBreakdown.length > 0 && (
            <ul className="text-xs space-y-0.5 mb-3 text-brand-inkSoft">
              {flavorBreakdown.map((f) => (
                <li key={f.name}>
                  • {f.qty} {f.name}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => onConfirm({ qty, flavorBreakdown })}
            disabled={selectedFlavors.length === 0}
            className="w-full text-xs font-medium rounded-full py-2.5 flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: selectedFlavors.length === 0 ? COLORS.border : COLORS.caramelDark,
              color: selectedFlavors.length === 0 ? COLORS.muted : "white",
            }}
          >
            <Heart size={12} fill={selectedFlavors.length === 0 ? "none" : "white"} />
            Adicionar à minha seleção
          </button>
        </>
      )}
    </div>
  );
}
