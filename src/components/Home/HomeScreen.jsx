import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { PRODUCTS } from "../../data/products";
import { MOMENTS, MOMENT_SHORT } from "../../data/moments";
import { isBrowsable, defaultPhotos } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

// Reference A: caramel/brown for emphasis, cream/off-white for secondary
// surfaces, yellow only as a small accent (never a large page color) — so
// only the first path is a solid caramel block; the other two are quiet
// cream/white surfaces with a caramel-toned border, all three still reading
// as one system via shared shape, icon treatment and weight.
const PATHS = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Escolha pelo momento.", bg: COLORS.caramelDark, dark: false },
  { id: "feed", emoji: "👀", title: "Só quero olhar e passar vontade", subtitle: "Por sua conta e risco.", bg: COLORS.subtle, dark: true },
  { id: "busca", emoji: "🔎", title: "Já sei o que quero", subtitle: "Me leva pros doces.", bg: "white", dark: true },
];

const MOMENT_ACCENTS = [COLORS.caramelDark, COLORS.caramelLight, COLORS.creamYellow, COLORS.caramelDark, COLORS.caramelLight];

const FEED_PREVIEW = PRODUCTS.filter(isBrowsable).slice(0, 4);

// Three substantial, thumb-friendly cards as the main interaction, a wide
// editorial hero for appetite, then two scrolling discovery previews (real
// moments, real products) so the page keeps going instead of stopping dead
// after the hero — same rhythm as "Me ajuda a escolher" and "Só quero olhar",
// just a taste of each right on Home.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="max-w-xl mx-auto px-4 pt-5 pb-8 fade-up">
      <div className="flex items-center justify-between mb-3">
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

      <h1 className="text-hero mb-1.5 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
      <p className="text-sm leading-normal mb-4 text-brand-inkSoft">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      <div className="flex flex-col gap-2">
        {PATHS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex items-center gap-3 rounded-2xl px-3.5 py-3.5 text-left min-h-11"
            style={{ backgroundColor: p.bg, border: p.dark ? `1px solid ${COLORS.border}` : "none" }}
          >
            <span
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-base"
              style={{ backgroundColor: p.dark ? COLORS.beige : "rgba(255,255,255,0.18)" }}
            >
              {p.emoji}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display text-base" style={{ color: p.dark ? COLORS.ink : "white" }}>
                {p.title}
              </span>
              <span className="block text-xs mt-0.5" style={{ color: p.dark ? COLORS.muted : "rgba(255,255,255,0.85)" }}>
                {p.subtitle}
              </span>
            </span>
            <ChevronRight size={16} style={{ color: p.dark ? COLORS.muted : "rgba(255,255,255,0.85)" }} />
          </button>
        ))}
      </div>

      <button onClick={() => onSelect("feed")} className="relative w-full mt-4 rounded-3xl overflow-hidden text-left aspect-hero">
        <Photo
          src={REAL_PHOTOS.brigadeiroDiaDificil}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <span className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-white font-display text-sm">
          Mais doces dias por aqui
          <ChevronRight size={15} />
        </span>
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-2xs text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xl font-display text-brand-ink">Não sabe por onde começar?</h2>
          <button onClick={() => onSelect("momentos")} className="text-2xs font-medium text-brand-caramelDark shrink-0">
            Ver todos
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {MOMENTS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="flex flex-col items-center gap-1 shrink-0 w-14"
            >
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: MOMENT_ACCENTS[i] }}
              >
                {m.emoji}
              </span>
              <span className="text-2xs text-brand-inkSoft text-center leading-tight">{MOMENT_SHORT[m.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xl font-display text-brand-ink">Só olha... 👀</h2>
          <button onClick={() => onSelect("feed")} className="text-2xs font-medium text-brand-caramelDark shrink-0">
            Ver mais
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {FEED_PREVIEW.map((p) => {
            const photo = defaultPhotos(p)?.[0];
            return (
              <button key={p.id} onClick={() => onSelect("feed")} className="shrink-0 w-52 text-left">
                <div className="w-52 aspect-photo rounded-2xl overflow-hidden bg-brand-subtle mb-2">
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
