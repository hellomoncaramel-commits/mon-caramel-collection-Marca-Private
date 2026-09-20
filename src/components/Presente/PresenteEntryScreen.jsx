import { ChevronRight } from "lucide-react";
import { COLORS } from "../../styles/colors";
import BackButton from "../shared/BackButton";

const OPTIONS = [
  {
    id: "presente-caixas",
    emoji: "🎁",
    title: "Caixas",
    description: "Um presente montado do jeitinho que quem vai receber merece.",
    cta: "Quero ver ideias →",
    tint: COLORS.caramelDark,
  },
  {
    id: "presente-bandejas",
    emoji: "🎈",
    title: "Bandejas",
    description: "Para transformar qualquer dia em uma comemoração.",
    cta: "Quero ver ideias →",
    tint: COLORS.creamYellow,
  },
  {
    id: "presente-mimos",
    emoji: "✨",
    title: "Pequenos mimos",
    description: "Um jeitinho pequeno de fazer alguém sorrir.",
    cta: "Quero ver produtos →",
    tint: COLORS.caramelLight,
  },
];

// Entry point for "É só uma lembrancinha" — three formats, three dedicated
// screens (never a rigid catalog of fixed boxes). Caixas/Bandejas lead into
// inspiration + a light idea-builder; Mimos, being real individual
// products, leads straight to a small catalog.
export default function PresenteEntryScreen({ onBack, onSelect }) {
  return (
    <div className="max-w-xl mx-auto px-4 pt-8 pb-10 fade-up">
      <BackButton onClick={onBack} label="Voltar" />
      <h1 className="text-2xl font-display text-brand-ink mb-1">É só uma lembrancinha.</h1>
      <p className="text-sm mb-6 text-brand-inkSoft">
        Pra gente, é muito mais que isso. Cada presente é único, pensado pra quem vai receber se sentir especial.
      </p>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((o) => (
          <button key={o.id} onClick={() => onSelect(o.id)} className="rounded-3xl p-5 text-left" style={{ backgroundColor: `${o.tint}22` }}>
            <span className="text-2xl">{o.emoji}</span>
            <p className="text-lg font-display mt-2 text-brand-ink">{o.title}</p>
            <p className="text-sm mt-0.5 mb-3 text-brand-inkSoft">{o.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLORS.caramelDark }}>
              {o.cta}
              <ChevronRight size={15} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
