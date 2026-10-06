import { useState, useMemo } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { parseQuantityOptions, splitEvenly, initialQuantity } from "../../utils/products";
import { entryPrice } from "../../utils/pricing";
import QuantityStepper from "../shared/QuantityStepper";

// Three different kinds of "customizable" exist in the catalog, each with
// its own interaction shape — this file just routes to whichever one a
// product actually needs:
//
// - `product.packageOptions` (Brigadeiro, Casadinho, Sequilho): ONE choice
//   among a short list of fixed commercial packages, each with its OWN
//   price — never a per-unit price × qty (6 brigadeiros isn't half the
//   price of 12). See PackageConfigurator below. Checked first since a
//   product with packageOptions never also has optionGroups/flavors this
//   round.
// - `product.optionGroups` (Chocobomb, Cone Trufado, Alfajor, Bolo de
//   Cenoura): several INDEPENDENT choices — recheio, cobertura, versão —
//   each a single pick, not a list to multi-select. See
//   OptionGroupsConfigurator below.
// - `product.flavors`: ONE flavor list, multi-select, with the order
//   quantity auto-split evenly across whichever flavors get picked. See
//   FlavorSplitConfigurator below.
export default function FlavorConfigurator({ product, existing, onConfirm }) {
  if (Array.isArray(product.packageOptions) && product.packageOptions.length > 0) {
    return <PackageConfigurator product={product} existing={existing} onConfirm={onConfirm} />;
  }
  if (product.optionGroups && product.optionGroups.length > 0) {
    return <OptionGroupsConfigurator product={product} existing={existing} onConfirm={onConfirm} />;
  }
  return <FlavorSplitConfigurator product={product} existing={existing} onConfirm={onConfirm} />;
}

// A single step: pick one fixed commercial package (e.g. "24 brigadeiros ·
// $36"), same pill-chip visual language as every other configurator step
// in this file. No quantity stepper, no per-unit math — the chosen
// package's own `price` is captured right here and passed straight
// through to `onConfirm` (see ProductDetailSheet.jsx/SelectionScreen.jsx's
// use of `packageLabel`/`packagePrice`), never recomputed later from a
// per-unit `product.price`. Starts unselected, same "no default pick"
// rule as every other configurator step.
function PackageConfigurator({ product, existing, onConfirm }) {
  const [chosen, setChosen] = useState(() =>
    existing?.packageLabel ? product.packageOptions.find((opt) => opt.label === existing.packageLabel) ?? null : null
  );

  const confirm = () => {
    onConfirm({ qty: chosen.qty, packageLabel: chosen.label, packagePrice: chosen.price });
  };

  return (
    <div className="fade-up">
      <p className="text-lg font-display text-brand-ink mb-4">Monte o seu</p>
      <div className="mb-5">
        <p className="text-sm font-medium text-brand-ink mb-2.5">1. {product.packageStepLabel ?? "Escolha a quantidade"}</p>
        <div className="flex flex-wrap gap-1.5">
          {product.packageOptions.map((opt) => {
            const on = chosen?.label === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => setChosen(opt)}
                className="text-xs rounded-full px-3.5 py-2 transition-colors"
                style={{
                  backgroundColor: on ? COLORS.caramelDark : "white",
                  color: on ? "white" : COLORS.ink,
                  border: on ? `1.5px solid ${COLORS.caramelDark}` : `1px solid ${COLORS.border}`,
                }}
              >
                {opt.label} · ${opt.price}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={confirm}
        disabled={!chosen}
        className="w-full text-sm font-medium rounded-full py-3 min-h-11 flex items-center justify-center gap-2 transition-colors active:scale-95"
        style={{
          backgroundColor: chosen ? COLORS.caramelDark : "transparent",
          color: chosen ? "white" : COLORS.muted,
          border: chosen ? "none" : `1.5px solid ${COLORS.border}`,
        }}
      >
        <Heart size={14} fill={chosen ? "white" : "none"} />
        Eu quero
      </button>
    </div>
  );
}

// Recheio / cobertura / versão — each its own group of single-select pill
// chips (same pill visual language as FlavorSplitConfigurator's flavor
// chips below, just one choice per group instead of multiple), plus a
// quantity step at the end — either an ordinary ±1 stepper floored at the
// product's own minimumQuantity, or (when `product.quantityOptions` is
// set) the exact same single-select chip pattern as every other group
// above, limited to that explicit list. Never both: a product commercially
// sold only in fixed batches (today: the two Mini Cake Donuts, Biscoito
// Amanteigado congelado) sets `quantityOptions` instead of relying on
// `minimumQuantity` + a free stepper, which would let a customer land on
// an unsupported quantity like 13 or 20.
//
// Every group starts unselected and must be explicitly chosen — no
// default/"most common" pick is pre-filled for any of them, recheio or
// cobertura or versão (even "Tradicional"), since nothing in the data
// says one choice is the default and inventing one would mean guessing at
// a customer's order on their behalf. The discrete quantity step follows
// the same rule: no quantity is pre-selected either.
//
// A third quantity mode exists alongside the stepper and the discrete-chip
// list above: `product.singleItem` (Bolo de Cenoura) skips the quantity
// section entirely — the commercial product IS one whole item (one cake
// form), never a count to choose, so qty is fixed at 1 and no "Quantos?"
// step renders at all.
function OptionGroupsConfigurator({ product, existing, onConfirm }) {
  const hasDiscreteQty = Array.isArray(product.quantityOptions) && product.quantityOptions.length > 0;
  const noQtyStep = product.singleItem === true;
  const minQty = initialQuantity(product);
  const [qty, setQty] = useState(() => {
    if (noQtyStep) return 1;
    if (hasDiscreteQty) return existing?.qty ?? null;
    return existing?.qty ?? minQty;
  });

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

  const allChosen = product.optionGroups.every((g) => choices[g.key]) && (!hasDiscreteQty || qty != null);

  const confirm = () => {
    const options = product.optionGroups.map((g) => ({ key: g.key, label: g.label, value: choices[g.key] }));
    // `singleItem` passed through so Minha Seleção/the WhatsApp message
    // can tell "qty is always 1 because it's one whole item" apart from
    // an ordinary product that just happens to have qty 1 — same
    // treatment as `packageLabel` below, carried on the stored entry
    // rather than re-derived later from a product lookup.
    onConfirm({ qty, options, singleItem: noQtyStep || undefined });
  };

  return (
    <div className="fade-up">
      {/* "Monte o seu" + numbered steps make the sequence unmissable: this
          is the explicit fix for a product owner testing her own site not
          realizing Chocobomb could be configured at all. Steps count
          recheio/cobertura/versão (whatever `optionGroups` actually holds,
          in its own order) then quantity last — never a hardcoded "4",
          so this still numbers correctly if a product's own group count
          ever changes. Finishing pass: more room between groups (mb-5,
          was mb-4) and a touch more presence on the "Monte o seu" heading
          itself (text-lg font-display) so the whole thing reads as a
          small, delicate sequence rather than a form. */}
      <p className="text-lg font-display text-brand-ink mb-4">Monte o seu</p>

      {product.optionGroups.map((g, i) => (
        <div key={g.key} className="mb-5">
          <p className="text-sm font-medium text-brand-ink mb-2.5">
            {i + 1}. {STEP_INTRO[g.key] ?? `Escolha: ${g.label}`}
          </p>
          {/* "Sem glúten" lives in the versão group itself — the real
              record of the choice — so the price note only needs to sit
              here once, quietly, never as its own badge (see the single
              gluten-free callout in ProductDetailSheet). */}
          {g.key === "versao" && product.badges?.includes("glutenFreeOption") && (
            <p className="text-3xs text-brand-muted mb-2 -mt-1">Sem glúten, pelo mesmo preço.</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {g.choices.map((c) => {
              const on = choices[g.key] === c;
              return (
                <button
                  key={c}
                  onClick={() => setChoices((cur) => ({ ...cur, [g.key]: c }))}
                  className="text-xs rounded-full px-3.5 py-2 transition-colors"
                  style={{
                    backgroundColor: on ? COLORS.caramelDark : "white",
                    color: on ? "white" : COLORS.ink,
                    border: on ? `1.5px solid ${COLORS.caramelDark}` : `1px solid ${COLORS.border}`,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {noQtyStep ? null : hasDiscreteQty ? (
        <div className="mb-5">
          <p className="text-sm font-medium text-brand-ink mb-2.5">{product.optionGroups.length + 1}. Escolha a quantidade</p>
          <div className="flex flex-wrap gap-1.5">
            {product.quantityOptions.map((q) => {
              const on = qty === q;
              // `quantityUnitWord` is opt-in, per product (today only
              // Biscoito Amanteigado congelado) — when set, each chip
              // spells out its own total ("24 biscoitos · $24") using the
              // same entryPrice() math Minha Seleção already uses for its
              // subtotal, not a hand-typed number. Every other product
              // with discrete quantities (the two Mini Cake Donuts) omits
              // it on purpose, per Naia's brief: "a interface deve
              // continuar leve" — just the plain number there.
              const total = product.quantityUnitWord ? entryPrice(product, q) : null;
              const label =
                total != null
                  ? `${q} ${product.quantityUnitWord} · $${Number.isInteger(total) ? total : total.toFixed(2)}`
                  : String(q);
              return (
                <button
                  key={q}
                  onClick={() => setQty(q)}
                  className="text-xs rounded-full px-3.5 py-2 transition-colors"
                  style={{
                    backgroundColor: on ? COLORS.caramelDark : "white",
                    color: on ? "white" : COLORS.ink,
                    border: on ? `1.5px solid ${COLORS.caramelDark}` : `1px solid ${COLORS.border}`,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-brand-ink mb-2.5">{product.optionGroups.length + 1}. Quantos?</p>
          <div className="mb-5">
            <QuantityStepper value={qty} onChange={setQty} min={minQty} />
          </div>
        </>
      )}

      {/* Disabled = clearly inert but intentional (muted fill, visible
          border, no icon fill) — never just a paler version of the same
          button, which reads as broken rather than "not yet." Enabled =
          the one real brand CTA, same solid caramelDark the simple-
          product "Eu quero" button already uses. */}
      <button
        onClick={confirm}
        disabled={!allChosen}
        className="w-full text-sm font-medium rounded-full py-3 min-h-11 flex items-center justify-center gap-2 transition-colors active:scale-95"
        style={{
          backgroundColor: allChosen ? COLORS.caramelDark : "transparent",
          color: allChosen ? "white" : COLORS.muted,
          border: allChosen ? "none" : `1.5px solid ${COLORS.border}`,
        }}
      >
        <Heart size={14} fill={allChosen ? "white" : "none"} />
        Eu quero
      </button>
    </div>
  );
}

// Exact phrasing from Naia's approved reference for the groups in use
// today — a generic fallback below covers any future group key rather
// than guessing at Portuguese grammatical gender ("o"/"a") from the key.
const STEP_INTRO = {
  recheio: "Escolha o recheio",
  cobertura: "Escolha a cobertura",
  versao: "Escolha a versão",
  sabor: "Escolha o sabor",
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
