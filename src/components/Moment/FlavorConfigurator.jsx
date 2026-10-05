import { useState, useMemo } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { parseQuantityOptions, splitEvenly, initialQuantity } from "../../utils/products";
import QuantityStepper from "../shared/QuantityStepper";

// Two different kinds of "customizable" exist in the catalog, each with its
// own interaction shape — this file just routes to whichever one a product
// actually needs:
//
// - `product.optionGroups` (Chocobomb, Cone Trufado): several INDEPENDENT
//   choices — recheio, cobertura, versão — each a single pick, not a list
//   to multi-select. See OptionGroupsConfigurator below.
// - `product.flavors` (Brigadeiro, today the only one): ONE flavor list,
//   multi-select, with the order quantity auto-split evenly across
//   whichever flavors get picked. See FlavorSplitConfigurator below —
//   unchanged from before this file had two modes.
export default function FlavorConfigurator({ product, existing, onConfirm }) {
  if (product.optionGroups && product.optionGroups.length > 0) {
    return <OptionGroupsConfigurator product={product} existing={existing} onConfirm={onConfirm} />;
  }
  return <FlavorSplitConfigurator product={product} existing={existing} onConfirm={onConfirm} />;
}

// Recheio / cobertura / versão — each its own group of single-select pill
// chips (same pill visual language as FlavorSplitConfigurator's flavor
// chips below, just one choice per group instead of multiple), plus an
// ordinary ±1 quantity stepper floored at the product's own
// minimumQuantity (reusing the same shared QuantityStepper the detail
// sheet uses — not the discrete-options stepper below, which only makes
// sense for a short list of exact cataloged quantities like Brigadeiro's
// 6/12/24).
//
// Every group starts unselected and must be explicitly chosen — no
// default/"most common" pick is pre-filled for any of them, recheio or
// cobertura or versão (even "Tradicional"), since nothing in the data
// says one choice is the default and inventing one would mean guessing at
// a customer's order on their behalf.
function OptionGroupsConfigurator({ product, existing, onConfirm }) {
  const minQty = initialQuantity(product);
  const [qty, setQty] = useState(existing?.qty ?? minQty);

  const existingByKey = useMemo(() => {
    const map = {};
    (existing?.options ?? []).forEach((o) => {
      map[o.key] = o.value;
    });
    return map;
  }, [existing]);

  const [choices, setChoices] = useState(() => {
    const init = {};
    product.optionGroups.forEach((g) => {
      init[g.key] = existingByKey[g.key] ?? null;
    });
    return init;
  });

  const allChosen = product.optionGroups.every((g) => choices[g.key]);

  const confirm = () => {
    const options = product.optionGroups.map((g) => ({ key: g.key, label: g.label, value: choices[g.key] }));
    onConfirm({ qty, options });
  };

  return (
    <div className="fade-up">
      {/* "Monte o seu" + numbered steps make the sequence unmissable: this
          is the explicit fix for a product owner testing her own site not
          realizing Chocobomb could be configured at all. Steps count
          recheio/cobertura/versão (whatever `optionGroups` actually holds,
          in its own order) then quantity last — never a hardcoded "4",
          so this still numbers correctly if a product's own group count
          ever changes. */}
      <p className="text-base font-display text-brand-ink mb-3">Monte o seu</p>

      {product.optionGroups.map((g, i) => (
        <div key={g.key} className="mb-4">
          <p className="text-sm font-medium text-brand-ink mb-2">
            {i + 1}. {STEP_INTRO[g.key] ?? `Escolha: ${g.label}`}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {g.choices.map((c) => {
              const on = choices[g.key] === c;
              return (
                <button
                  key={c}
                  onClick={() => setChoices((cur) => ({ ...cur, [g.key]: c }))}
                  className="text-xs rounded-full px-3 py-1.5 border"
                  style={{
                    backgroundColor: on ? COLORS.caramelDark : "transparent",
                    color: on ? "white" : COLORS.ink,
                    borderColor: on ? COLORS.caramelDark : COLORS.border,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-sm font-medium text-brand-ink mb-2">{product.optionGroups.length + 1}. Quantos?</p>
      <div className="mb-4">
        <QuantityStepper value={qty} onChange={setQty} min={minQty} />
      </div>

      <button
        onClick={confirm}
        disabled={!allChosen}
        className="w-full text-sm font-medium rounded-full py-3 min-h-11 flex items-center justify-center gap-2"
        style={{
          backgroundColor: allChosen ? COLORS.caramelDark : COLORS.border,
          color: allChosen ? "white" : COLORS.muted,
        }}
      >
        <Heart size={14} fill={allChosen ? "white" : "none"} />
        Quero esse
      </button>
    </div>
  );
}

// Exact phrasing from Naia's approved reference for the 3 groups in use
// today — a generic fallback below covers any future group key rather
// than guessing at Portuguese grammatical gender ("o"/"a") from the key.
const STEP_INTRO = {
  recheio: "Escolha o recheio",
  cobertura: "Escolha a cobertura",
  versao: "Escolha a versão",
};

// Inline "escolha seus sabores" configurator shown inside a customizable
// product's card: quantity first ("quantos você quer?"), then flavor chips
// (multi-select), with a live, auto-split breakdown of quantity per flavor.
// Kept as an elegant inline expansion rather than a separate modal/drawer —
// the product stays visible the whole time.
function FlavorSplitConfigurator({ product, existing, onConfirm }) {
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
          {/* Functional label, not an editorial moment — DM Sans (plain,
              no font-display override). */}
          <p className="text-sm font-medium text-brand-ink mb-2">Quantidade</p>
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
        <>
          <p className="text-xs text-brand-muted mb-3">Sabores em breve — fala com a gente pra combinar.</p>
          {/* No flavor list yet (data pending — see products.js), but that's
              never a reason the product can't be selected: same "add now,
              combine details over WhatsApp" pattern the rest of the catalog
              already uses for pending info. */}
          <button
            onClick={() => onConfirm({ qty, flavorBreakdown: [] })}
            className="w-full text-xs font-medium rounded-full py-2.5 flex items-center justify-center gap-1.5"
            style={{ backgroundColor: COLORS.caramelDark, color: "white" }}
          >
            <Heart size={12} fill="white" />
            Adicionar à minha seleção
          </button>
        </>
      ) : (
        <>
          {/* Functional label — DM Sans, same treatment as "Quantidade" above. */}
          <p className="text-sm font-medium text-brand-ink mb-2">Escolha seus sabores</p>
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
