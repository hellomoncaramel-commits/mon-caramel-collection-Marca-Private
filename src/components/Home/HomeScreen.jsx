import { MOMENTS, MOMENT_TAGLINE } from "../../data/moments";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";

// Rotating accent tints for the moment badges — purely visual rhythm, so
// five near-identical cards don't all carry the exact same weight.
const ACCENTS = [COLORS.caramelDark, COLORS.caramelLight, COLORS.creamYellow, COLORS.caramelDark, COLORS.caramelLight];

export default function HomeScreen({ onSelect, favorites }) {
  return (
    <div className="max-w-xl mx-auto px-6 pt-14 pb-20 text-center fade-up">
      <div className="mb-6">
        <Logo size="lg" />
      </div>
      <h1 className="text-4xl sm:text-5xl mb-4 font-display italic text-brand-ink">Como você está hoje?</h1>
      <p className="mb-9 leading-relaxed text-brand-inkSoft">
        Conta pra gente o que te trouxe aqui — a gente te mostra o que combina com o seu momento.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOMENTS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="flex flex-col items-start gap-2 p-5 rounded-3xl bg-white text-left transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramelDark"
          >
            <span
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${ACCENTS[i]}22` }}
            >
              {m.emoji}
            </span>
            <span className="font-display text-lg text-brand-ink leading-snug">{m.label}</span>
            <span className="text-sm text-brand-muted">{MOMENT_TAGLINE[m.id]}</span>
          </button>
        ))}
      </div>

      {favorites.length > 0 && (
        <p className="text-xs mt-8 text-brand-muted">
          ♥ Você guardou {favorites.length} {favorites.length === 1 ? "item" : "itens"} pra depois
        </p>
      )}

      <div className="flex items-center justify-center gap-4 mt-8 text-xs text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>

      <button onClick={() => onSelect("catalogo")} className="text-xs mt-6 underline text-brand-muted">
        📋 Já sabe o que procura? Veja toda a coleção.
      </button>
    </div>
  );
}
