import { MOMENTS, MOMENT_INTRO } from "../../data/moments";
import Logo from "../shared/Logo";

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
        {MOMENTS.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="flex items-center gap-3 p-4 rounded-2xl border border-brand-border bg-white text-left transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramelDark"
          >
            <span className="text-2xl shrink-0">{m.emoji}</span>
            <span>
              <span className="block text-brand-ink text-moment-title">{m.label}</span>
              <span className="block mt-0.5 text-brand-muted text-moment-caption">{MOMENT_INTRO[m.id]}</span>
            </span>
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
