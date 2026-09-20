import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { PRODUCTS } from "../../data/products";
import { MOMENTS, MOMENT_SHORT } from "../../data/moments";
import { isBrowsable, defaultPhotos } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

const PATHS = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Escolha pelo momento.", solid: true },
  { id: "feed", emoji: "👀", title: "Só quero olhar e passar vontade", subtitle: "Por sua conta e risco.", solid: true },
  { id: "busca", emoji: "🔎", title: "Já sei o que quero", subtitle: "Me leva pros doces.", solid: false },
];

const MOMENT_ACCENTS = [COLORS.caramelDark, COLORS.caramelLight, COLORS.creamYellow, COLORS.caramelDark, COLORS.caramelLight];

const FEED_PREVIEW = PRODUCTS.filter(isBrowsable).slice(0, 8);

// Three substantial, thumb-friendly cards as the main interaction, a wide
// editorial hero for appetite, then two scrolling discovery previews (real
// moments, real products) so the page keeps going instead of stopping dead
// after the hero — same rhythm as "Me ajuda a escolher" and "Só quero olhar",
// just a taste of each right on Home.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-10 fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="w-11" />
        <Logo size="home" />
        <button
          onClick={() => onSelect("salvos")}
          aria-label="Ver salvos"
          className="w-11 h-11 flex items-center justify-center"
        >
          <Heart size={22} className="text-brand-caramelDark" />
        </button>
      </div>

      <h1 className="text-hero mb-2 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
      <p className="text-base leading-normal mb-5 text-brand-inkSoft">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      <div className="flex flex-col gap-2.5">
        {PATHS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left min-h-11"
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

      <button onClick={() => onSelect("feed")} className="relative w-full mt-5 rounded-3xl overflow-hidden text-left aspect-hero">
        <Photo
          src={REAL_PHOTOS.brigadeiroDiaDificil}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white font-display text-lg">
          Mais doces dias por aqui
          <ChevronRight size={18} />
        </span>
      </button>

      <div className="flex items-center justify-center gap-3 mt-5 text-sm text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>

      <div className="mt-9">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display text-brand-ink">Não sabe por onde começar?</h2>
          <button onClick={() => onSelect("momentos")} className="text-xs font-medium text-brand-caramelDark shrink-0">
            Ver todos
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {MOMENTS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 w-16"
            >
              <span
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${MOMENT_ACCENTS[i]}1F` }}
              >
                {m.emoji}
              </span>
              <span className="text-xs text-brand-inkSoft text-center leading-tight">{MOMENT_SHORT[m.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display text-brand-ink">Só olha... 👀</h2>
          <button onClick={() => onSelect("feed")} className="text-xs font-medium text-brand-caramelDark shrink-0">
            Ver mais
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {FEED_PREVIEW.map((p) => {
            const photo = defaultPhotos(p)?.[0];
            return (
              <button key={p.id} onClick={() => onSelect("feed")} className="shrink-0 w-32 text-left">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-brand-subtle mb-1.5">
                  {photo && <Photo src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />}
                </div>
                <p className="text-sm font-display text-brand-ink truncate">{p.name}</p>
                <p className="text-xs text-brand-caramelDark">{p.price}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
