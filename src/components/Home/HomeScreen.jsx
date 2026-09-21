import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

// Discovery choices — all three rows share the exact same solid caramel
// surface, matching the approved mockup. Only the icon and copy change
// between them.
const CHOICES = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Escolha pelo momento." },
  { id: "feed", emoji: "👀", title: "Só quero olhar e passar vontade", subtitle: "Por sua conta e risco." },
  { id: "busca", emoji: "🔎", title: "Já sei o que quero", subtitle: "Me leva pros doces." },
];

// The real photo is the background for the whole screen, not just a card
// behind the buttons: a white veil sits over it, strong at the top (where
// the text needs to stay readable) and fading to nothing toward the
// bottom, so the sweets themselves become the payoff as the eye moves
// down. The bottom nav (rendered by App.jsx, fixed + blurred) sits in
// front of it, unchanged.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="relative w-full" style={{ minHeight: "100dvh" }}>
      <Photo src={REAL_PHOTOS.casadinhoGoiabada} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(to bottom, white 0%, white 38%, rgba(255,255,255,0.55) 58%, rgba(255,255,255,0) 78%)" }}
      />

      <div className="relative w-full md:max-w-xl md:mx-auto px-gutter pt-2 pb-8 fade-up">
        {/* Header — small brand presence, no website navbar feel */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-11" />
          <Logo size="home" />
          <button
            onClick={() => onSelect("salvos")}
            aria-label="Ver salvos"
            className="w-11 h-11 flex items-center justify-center"
          >
            <Heart size={20} className="text-brand-caramelDark" />
          </button>
        </div>

        {/* Intro — editorial, not a marketing hero */}
        <h1 className="text-mc-home-hero mt-2.5 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
        <p className="text-mc-home-body mt-1.5 text-brand-inkSoft">
          Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
        </p>

        {/* Discovery choices — sit directly on the fading photo background */}
        <div className="flex flex-col gap-1.5 mt-3">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="items-center rounded-mc text-left"
              style={{
                backgroundColor: COLORS.caramelDark,
                display: "grid",
                gridTemplateColumns: "30px 1fr 14px",
                columnGap: "9px",
                height: "50px",
                padding: "0 12px",
              }}
            >
              <span
                className="rounded-full flex items-center justify-center"
                style={{ width: 30, height: 30, fontSize: 16, backgroundColor: "rgba(255,255,255,0.18)" }}
              >
                {c.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-mc-home-card-title truncate text-white">{c.title}</span>
                <span className="block text-mc-home-card-subtitle truncate mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {c.subtitle}
                </span>
              </span>
              <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.85)" }} />
            </button>
          ))}
        </div>

        {/* Pickup/delivery — footnote scale metadata, sits where the photo is fully revealed */}
        <div
          className="inline-flex items-center gap-1.5 mt-2 text-mc-home-meta text-brand-ink rounded-full px-2.5 py-1"
          style={{ backgroundColor: "rgba(255,255,255,0.72)" }}
        >
          <span>📍 Retirada grátis — Ritson x Adelaide</span>
          <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
          <span>🚗 Entrega disponível</span>
        </div>
      </div>
    </div>
  );
}
