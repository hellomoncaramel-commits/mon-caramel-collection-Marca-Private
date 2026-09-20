import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { BUDGET_RANGES } from "../../data/giftOptions";

function ChipGroup({ options, selected, onToggle, multi = true }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = multi ? selected.includes(opt) : selected === opt;
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className="text-sm rounded-full px-4 py-2 border transition-colors"
            style={{
              backgroundColor: on ? COLORS.caramelDark : "white",
              color: on ? "white" : COLORS.ink,
              borderColor: on ? COLORS.caramelDark : COLORS.border,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Light, single-page idea builder shared by the Caixa and Bandeja
// experiences — the question set differs per use (occasion is Bandeja-only,
// for example), so it never reads as a copy-pasted form between the two.
// This is explicitly *not* a price calculator: the budget step only tells
// Naia roughly what the customer has in mind.
export default function IdeaConfigurator({ title, subtitle, groupKey, groupLabel, occasion, items, extras, onAdd }) {
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [name, setName] = useState("");
  const [colors, setColors] = useState("");
  const [theme, setTheme] = useState("");
  const [message, setMessage] = useState("");
  const [unsure, setUnsure] = useState(false);
  const [budget, setBudget] = useState(null);
  const [added, setAdded] = useState(false);

  // Stable id for this in-progress idea: re-submitting after tweaking a
  // field updates the same "Minha Seleção" entry instead of duplicating it.
  const ideaId = useMemo(() => `${groupKey}-idea-${Math.random().toString(36).slice(2, 9)}`, [groupKey]);

  const toggleItem = (name) => setSelectedItems((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));
  const toggleExtra = (name) => setSelectedExtras((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));

  const hasContent = selectedItems.length > 0 || selectedExtras.length > 0 || selectedOccasion || budget;

  const submit = () => {
    onAdd({
      kind: "gift-idea",
      id: ideaId,
      group: groupKey,
      groupLabel,
      occasion: selectedOccasion,
      items: selectedItems,
      extras: selectedExtras,
      personalization: { name, colors, theme, message, unsure },
      budget,
    });
    setAdded(true);
  };

  return (
    <div className="mt-10 rounded-3xl p-6 sm:p-8" style={{ backgroundColor: COLORS.subtle }}>
      <p className="text-xl font-display text-brand-ink mb-1">{title}</p>
      {subtitle && <p className="text-sm mb-6 text-brand-inkSoft">{subtitle}</p>}

      {occasion && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-2 text-brand-ink">{occasion.question}</p>
          <ChipGroup options={occasion.options} selected={selectedOccasion} onToggle={setSelectedOccasion} multi={false} />
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm font-medium mb-2 text-brand-ink">{items.question}</p>
        <ChipGroup options={items.options} selected={selectedItems} onToggle={toggleItem} />
      </div>

      {extras && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-2 text-brand-ink">{extras.question}</p>
          <ChipGroup options={extras.options} selected={selectedExtras} onToggle={toggleExtra} />
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm font-medium mb-2 text-brand-ink">Quer deixar com a cara de quem vai receber?</p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[
            { id: "name", label: "Nome", value: name, set: setName },
            { id: "colors", label: "Cores", value: colors, set: setColors },
            { id: "theme", label: "Tema", value: theme, set: setTheme },
            { id: "message", label: "Mensagem", value: message, set: setMessage },
          ].map((field) => {
            const inputId = `${groupKey}-${field.id}`;
            return (
              <div key={field.id}>
                <label htmlFor={inputId} className="sr-only">
                  {field.label}
                </label>
                <input
                  id={inputId}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.label}
                  className="w-full rounded-xl border border-brand-border px-3 py-2 text-sm bg-white min-h-11"
                />
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setUnsure((u) => !u)}
          className="text-xs rounded-full px-3.5 py-1.5 border"
          style={{
            backgroundColor: unsure ? COLORS.caramelDark : "white",
            color: unsure ? "white" : COLORS.ink,
            borderColor: unsure ? COLORS.caramelDark : COLORS.border,
          }}
        >
          Ainda não sei
        </button>
      </div>

      <div className="mb-2">
        <p className="text-sm font-medium mb-2 text-brand-ink">Quanto você imaginou gastar?</p>
        <ChipGroup options={BUDGET_RANGES} selected={budget} onToggle={setBudget} multi={false} />
      </div>

      {hasContent && (
        <div className="mt-6 pt-5 border-t border-dashed" style={{ borderColor: COLORS.border }}>
          <p className="text-sm font-display text-brand-ink mb-2">Sua ideia 💌</p>
          <ul className="text-sm space-y-1 text-brand-inkSoft mb-4">
            {selectedItems.length > 0 && <li>{selectedItems.join(" + ")}</li>}
            {selectedExtras.length > 0 && <li>{selectedExtras.join(", ")}</li>}
            {selectedOccasion && <li>{selectedOccasion}</li>}
            {colors && <li>Tons de {colors}</li>}
            {name && <li>Nome: {name}</li>}
            {theme && <li>Tema: {theme}</li>}
            {budget && <li>{budget}</li>}
          </ul>
          <button
            onClick={submit}
            className="w-full sm:w-auto text-sm font-medium text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.caramelDark }}
          >
            <Heart size={14} fill="white" />
            {added ? "Atualizar na minha seleção" : "Adicionar à minha seleção"}
          </button>
          {added && <p className="text-xs mt-2 text-brand-muted">Salvo ✓ — pode continuar ajustando se quiser.</p>}
        </div>
      )}
    </div>
  );
}
