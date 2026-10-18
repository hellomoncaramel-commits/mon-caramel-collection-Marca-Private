import { useState, useMemo } from "react";
import { Sparkles, Check } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { BUDGET_RANGES, SURPRISE_ME } from "../../data/giftOptions";
import { defaultPhotos } from "../../utils/products";
import Photo from "../shared/Photo";
import SiteHeader from "../shared/SiteHeader";

function StepDots({ total, current }) {
  return (
    <div className="flex items-center justify-center mb-6" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
            style={{
              backgroundColor: i <= current ? COLORS.caramelDark : "white",
              color: i <= current ? "white" : COLORS.muted,
              border: i <= current ? "none" : `1px solid ${COLORS.border}`,
            }}
          >
            {i + 1}
          </span>
          {i < total - 1 && <span className="w-6 h-px" style={{ backgroundColor: i < current ? COLORS.caramelDark : COLORS.border }} />}
        </div>
      ))}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle, multi = true }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = multi ? selected.includes(opt) : selected === opt;
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className="text-sm rounded-full px-4 min-h-11 border"
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

// The 4 free-text personalize fields — identical markup used by Caixa's
// standalone "personalize" step and Cesta's fused "details" step, so it's
// factored out once instead of duplicated between them.
function PersonalizeFields({ groupKey, name, setName, colors, setColors, theme, setTheme, message, setMessage }) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
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
  );
}

function PhotoChip({ label, photo, selected, onToggle }) {
  return (
    <button onClick={onToggle} className="flex flex-col items-center gap-1.5">
      <span
        className="relative w-full aspect-square rounded-2xl overflow-hidden"
        style={{ outline: selected ? `3px solid ${COLORS.caramelDark}` : `1px solid ${COLORS.border}`, outlineOffset: "-1px" }}
      >
        {photo ? (
          <Photo src={photo} alt={label} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="w-full h-full flex items-center justify-center" style={{ backgroundColor: COLORS.subtle }}>
            <Sparkles size={22} className="text-brand-caramelDark" />
          </span>
        )}
        {selected && (
          <span
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.caramelDark }}
          >
            <Check size={13} className="text-white" />
          </span>
        )}
      </span>
      <span className="text-2xs text-center text-brand-ink leading-tight">{label}</span>
    </button>
  );
}

// Light multi-step idea builder shared by Caixa and Cesta — the step set
// differs per use. Caixa: items → personalize → budget → summary (no
// occasion at all). Cesta: occasionStep + fuseDetails fold Ocasião
// (required) and Personalização (optional) into a single "Detalhes" step
// between Doces and Orçamento, per the post-audit decision that the cesta
// flow must read as exactly 3 steps, never 4. Never a price calculator:
// budget only tells Naia roughly what the customer has in mind.
export default function GiftIdeaWizard({
  onBack,
  groupKey,
  groupLabel,
  title,
  occasionStep,
  fuseDetails = false,
  detailsIntro,
  itemsStep,
  budgetIntro,
  onAdd,
  onSend,
  buildMessage,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [occasion, setOccasion] = useState(null);
  const [occasionOther, setOccasionOther] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [name, setName] = useState("");
  const [colors, setColors] = useState("");
  const [theme, setTheme] = useState("");
  const [message, setMessage] = useState("");
  const [unsure, setUnsure] = useState(false);
  const [budget, setBudget] = useState(null);
  const [added, setAdded] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  const ideaId = useMemo(() => `${groupKey}-idea-${Math.random().toString(36).slice(2, 9)}`, [groupKey]);

  const toggleItem = (label) => setSelectedItems((cur) => (cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]));

  // "Outra" + a typed reason resolves to the typed text everywhere it's
  // shown/sent (summary, WhatsApp message) — the chip itself still needs
  // the raw "Outra" value to stay highlighted while typing.
  const resolvedOccasion = occasion === "Outra" ? occasionOther.trim() || occasion : occasion;

  const steps = useMemo(() => {
    if (occasionStep && fuseDetails) return ["items", "details", "budget", "summary"];
    const s = [];
    if (occasionStep) s.push("occasion");
    s.push("items", "personalize", "budget", "summary");
    return s;
  }, [occasionStep, fuseDetails]);

  const totalNumbered = steps.length - 1; // summary isn't a numbered step
  const stepId = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const next = () => setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  const back = () => (stepIndex === 0 ? onBack() : setStepIndex((i) => i - 1));

  // itemsStep.required (Cesta only, see BandejasScreen) makes Etapa 1
  // ("O que não pode faltar?") a real gate — she's assembling a cesta of
  // Mon Caramel products, so zero doces isn't a valid idea. Caixa's own
  // itemsStep never sets this, so "O que não pode faltar?" there stays
  // skippable exactly as before (unchanged regression risk).
  const canAdvance =
    stepId === "occasion" || stepId === "details"
      ? !!occasion
      : stepId === "items"
      ? itemsStep.required
        ? selectedItems.length > 0
        : true
      : true;

  // Every step is individually optional (briefing: she can skip any of
  // them), but a fully empty idea has nothing to tell Naia about — this is
  // the one real choice gate, checked only when she tries to finish.
  const hasAnyChoice =
    !!occasion ||
    selectedItems.length > 0 ||
    name.trim() !== "" ||
    colors.trim() !== "" ||
    theme.trim() !== "" ||
    message.trim() !== "" ||
    unsure ||
    !!budget;

  const ideaPayload = () => ({
    kind: "gift-idea",
    id: ideaId,
    group: groupKey,
    groupLabel,
    occasion: resolvedOccasion,
    items: selectedItems,
    personalization: { name, colors, theme, message, unsure },
    budget,
  });

  const submit = () => {
    onAdd(ideaPayload());
    setAdded(true);
  };

  const handlePrimary = () => {
    if (!isLast) {
      next();
      return;
    }
    if (!hasAnyChoice) {
      setShowEmptyWarning(true);
      return;
    }
    submit();
  };

  // Only reached when onSend is provided (Cesta's two-CTA summary) — saving
  // to Minha Seleção there is the secondary action, same empty-choice gate
  // as the single-CTA Caixa flow above.
  const handleSave = () => {
    if (!hasAnyChoice) {
      setShowEmptyWarning(true);
      return;
    }
    submit();
  };

  const handleWhatsapp = () => {
    if (!hasAnyChoice) {
      setShowEmptyWarning(true);
      return;
    }
    onSend(
      buildMessage({
        items: selectedItems,
        occasion: resolvedOccasion,
        personalization: { name, colors, theme, message, unsure },
        budget,
      })
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-2 pb-10 fade-up">
      <SiteHeader onBack={back} />
      <p className="text-xl font-display text-brand-ink mb-1 text-center">{title}</p>

      {!isLast && <StepDots total={totalNumbered} current={stepIndex} />}

      {stepId === "occasion" && (
        <div className="mb-6">
          <p className="text-base font-medium mb-1 text-brand-ink">{occasionStep.question}</p>
          <ChipGroup options={occasionStep.options} selected={occasion} onToggle={setOccasion} multi={false} />
        </div>
      )}

      {stepId === "items" && (
        <div className="mb-6">
          <p className="text-base font-medium mb-1 text-brand-ink">{itemsStep.question}</p>
          <p className="text-sm mb-4 text-brand-muted">{itemsStep.subtext || "Escolha quantos quiser."}</p>
          {itemsStep.products ? (
            <div className="grid grid-cols-3 gap-3">
              {itemsStep.products.map((p) => (
                <PhotoChip
                  key={p.id}
                  label={p.name}
                  photo={defaultPhotos(p)?.[0]}
                  selected={selectedItems.includes(p.name)}
                  onToggle={() => toggleItem(p.name)}
                />
              ))}
              {itemsStep.allowSurprise && (
                <PhotoChip
                  label={SURPRISE_ME.name}
                  photo={null}
                  selected={selectedItems.includes(SURPRISE_ME.name)}
                  onToggle={() => toggleItem(SURPRISE_ME.name)}
                />
              )}
            </div>
          ) : (
            <ChipGroup options={itemsStep.options} selected={selectedItems} onToggle={toggleItem} />
          )}
        </div>
      )}

      {stepId === "personalize" && (
        <div className="mb-6">
          <p className="text-base font-medium mb-4 text-brand-ink">Quer deixar com a cara de quem vai receber?</p>
          <PersonalizeFields
            groupKey={groupKey}
            name={name}
            setName={setName}
            colors={colors}
            setColors={setColors}
            theme={theme}
            setTheme={setTheme}
            message={message}
            setMessage={setMessage}
          />
          <button
            onClick={() => setUnsure((u) => !u)}
            className="text-xs rounded-full px-3.5 min-h-11 border"
            style={{
              backgroundColor: unsure ? COLORS.caramelDark : "white",
              color: unsure ? "white" : COLORS.ink,
              borderColor: unsure ? COLORS.caramelDark : COLORS.border,
            }}
          >
            Não sei ainda
          </button>
        </div>
      )}

      {/* Cesta only (fuseDetails): Ocasião (required) and Personalização
          (optional) combined into one "Detalhes" step, per the post-audit
          decision that the flow must read as exactly 3 steps. */}
      {stepId === "details" && (
        <div className="mb-6">
          <p className="text-base font-medium mb-1 text-brand-ink">{occasionStep.question}</p>
          <ChipGroup options={occasionStep.options} selected={occasion} onToggle={setOccasion} multi={false} />
          {occasion === "Outra" && (
            <input
              value={occasionOther}
              onChange={(e) => setOccasionOther(e.target.value)}
              placeholder="Qual é a ocasião?"
              aria-label="Qual é a ocasião?"
              className="w-full rounded-xl border border-brand-border px-3 py-2 text-sm bg-white min-h-11 mt-2"
            />
          )}

          <p className="text-base font-medium mt-6 mb-3 text-brand-ink">{detailsIntro}</p>
          <PersonalizeFields
            groupKey={groupKey}
            name={name}
            setName={setName}
            colors={colors}
            setColors={setColors}
            theme={theme}
            setTheme={setTheme}
            message={message}
            setMessage={setMessage}
          />
          <button
            onClick={() => setUnsure((u) => !u)}
            className="text-xs rounded-full px-3.5 min-h-11 border"
            style={{
              backgroundColor: unsure ? COLORS.caramelDark : "white",
              color: unsure ? "white" : COLORS.ink,
              borderColor: unsure ? COLORS.caramelDark : COLORS.border,
            }}
          >
            Sem personalização / ainda não sei
          </button>
        </div>
      )}

      {stepId === "budget" && (
        <div className="mb-6">
          <p className="text-base font-medium mb-1 text-brand-ink">Quanto você imaginou gastar?</p>
          <p className={`text-sm text-brand-muted ${budgetIntro ? "mb-1" : "mb-4"}`}>Isso não fecha preço — é só pra eu ter uma ideia.</p>
          {budgetIntro && <p className="text-sm mb-4 text-brand-muted">{budgetIntro}</p>}
          <ChipGroup options={BUDGET_RANGES} selected={budget} onToggle={setBudget} multi={false} />
        </div>
      )}

      {stepId === "summary" && (
        <div className="mb-6 rounded-3xl p-5" style={{ backgroundColor: COLORS.subtle }}>
          <p className="text-lg font-display text-brand-ink mb-3">Sua ideia 💌</p>
          <ul className="text-sm space-y-1 text-brand-inkSoft mb-2">
            {resolvedOccasion && <li>{resolvedOccasion}</li>}
            {selectedItems.length > 0 && <li>{selectedItems.join(" + ")}</li>}
            {colors && <li>Tons de {colors}</li>}
            {name && <li>Nome: {name}</li>}
            {theme && <li>Tema: {theme}</li>}
            {message && <li>Mensagem: {message}</li>}
            {budget && <li>{budget}</li>}
          </ul>
          {added && <p className="text-xs mt-3 text-brand-muted">Salvo na sua seleção ✓</p>}
        </div>
      )}

      {isLast && showEmptyWarning && !hasAnyChoice && (
        <p className="text-xs text-center mb-2" style={{ color: COLORS.caramelDark }}>
          Escolha pelo menos uma opção para montar sua ideia 💛
        </p>
      )}

      {/* Cesta only (onSend provided): two CTAs, never equal weight —
          "Conversar pelo WhatsApp" filled/primary, "Guardar na minha
          seleção" outlined/secondary below it. Caixa keeps its original
          single filled CTA untouched. */}
      {isLast && onSend ? (
        <div className="space-y-2.5">
          <button
            onClick={handleWhatsapp}
            className="w-full text-sm font-medium text-white rounded-full py-3.5 min-h-11 flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.caramelDark }}
          >
            Conversar pelo WhatsApp
          </button>
          <button
            onClick={handleSave}
            className="w-full text-sm font-medium rounded-full py-3 min-h-11 flex items-center justify-center gap-2 border bg-transparent"
            style={{ color: COLORS.ink, borderColor: COLORS.border }}
          >
            {added ? "Atualizado na minha seleção ✓" : "Guardar na minha seleção"}
          </button>
        </div>
      ) : (
        <button
          onClick={handlePrimary}
          disabled={!canAdvance}
          className="w-full text-sm font-medium text-white rounded-full py-3.5 min-h-11 flex items-center justify-center gap-2 disabled:opacity-40"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          {isLast ? (added ? "Atualizar na minha seleção" : "Guardar na minha seleção") : "Continuar →"}
        </button>
      )}
    </div>
  );
}
