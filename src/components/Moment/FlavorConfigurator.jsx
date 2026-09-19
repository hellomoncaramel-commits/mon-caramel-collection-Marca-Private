import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
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

  return (
    <div className="fade-up">
      {qtyOptions.length > 1 && (
        <>
          <p className="text-sm font-display text-brand-ink mb-2">Quantos você quer?</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {qtyOptions.map((n) => (
              <button
                key={n}
                onClick={() => setQty(n)}
                className="text-xs rounded-full px-3.5 py-1.5 border"
                style={{
                  backgroundColor: qty === n ? COLORS.ink : "transparent",
                  color: qty === n ? "white" : COLORS.ink,
                  borderColor: qty === n ? COLORS.ink : COLORS.border,
                }}
              >
                {n}
              </button>
            ))}
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
            Quero esse
          </button>
        </>
      )}
    </div>
  );
}
