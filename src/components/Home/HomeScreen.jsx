import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

const PATHS = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Escolha pelo momento.", solid: true },
  { id: "feed", emoji: "👀", title: "Só quero olhar e passar vontade", subtitle: "Por sua conta e risco.", solid: true },
  { id: "busca", emoji: "🔎", title: "Já sei o que quero", subtitle: "Me leva pros doces.", solid: false },
];

// Three compact, thumb-friendly rows rather than three tall blocks — quick
// to scan, quick to tap. The photo lives in its own banner below instead of
// being buried inside a button, so it reads as "look how good this is",
// not as a background image behind text.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="max-w-xl mx-auto px-5 pt-8 pb-10 fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="w-11" />
        <Logo size="sm" />
        <button
          onClick={() => onSelect("salvos")}
          aria-label="Ver salvos"
          className="w-11 h-11 flex items-center justify-center"
        >
          <Heart size={20} className="text-brand-caramelDark" />
        </button>
      </div>

      <h1 className="text-3xl text-center mb-2 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
      <p className="text-sm text-center mb-7 leading-relaxed text-brand-inkSoft">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      <div className="flex flex-col gap-2.5">
        {PATHS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left min-h-11"
            style={{
              backgroundColor: p.solid ? COLORS.caramelDark : "white",
              border: p.solid ? "none" : `1px solid ${COLORS.border}`,
            }}
          >
            <span
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: p.solid ? "rgba(255,255,255,0.18)" : COLORS.subtle }}
            >
              {p.emoji}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display text-base" style={{ color: p.solid ? "white" : COLORS.ink }}>
                {p.title}
              </span>
              <span className="block text-xs mt-0.5" style={{ color: p.solid ? "rgba(255,255,255,0.85)" : COLORS.muted }}>
                {p.subtitle}
              </span>
            </span>
            <ChevronRight size={18} style={{ color: p.solid ? "rgba(255,255,255,0.85)" : COLORS.muted }} />
          </button>
        ))}
      </div>

      <button
        onClick={() => onSelect("feed")}
        className="relative w-full mt-5 rounded-3xl overflow-hidden text-left min-h-32 flex items-end p-5"
      >
        <Photo
          src={REAL_PHOTOS.brigadeiroDiaDificil}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <span className="relative flex items-center gap-1.5 text-white font-display text-base">
          Mais doces dias por aqui
          <ChevronRight size={16} />
        </span>
      </button>

      <div className="flex items-center justify-center gap-4 mt-8 text-xs text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>
    </div>
  );
}
