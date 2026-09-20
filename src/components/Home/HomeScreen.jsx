import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { PRODUCTS } from "../../data/products";
import { MOMENTS, MOMENT_SHORT } from "../../data/moments";
import { isBrowsable, defaultPhotos } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

// Discovery choices — the central interaction. Card 1 is the only solid
// caramel surface; the other two are quiet cream/off-white surfaces with a
// warm border. Yellow never becomes a large surface, only a small icon
// accent (see moment shortcuts below).
const CHOICES = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Escolha pelo momento.", bg: COLORS.caramelDark, dark: false },
  { id: "feed", emoji: "👀", title: "Só quero olhar e passar vontade", subtitle: "Por sua conta e risco.", bg: COLORS.subtle, dark: true },
  { id: "busca", emoji: "🔎", title: "Já sei o que quero", subtitle: "Me leva pros doces.", bg: "white", dark: true },
];

const MOMENT_ACCENTS = [COLORS.caramelDark, COLORS.caramelLight, COLORS.creamYellow, COLORS.caramelDark, COLORS.caramelLight];

// Home preview only — a taste of the real feed, not the feed itself.
const FEED_PREVIEW = PRODUCTS.filter(isBrowsable).slice(0, 4);

// Implements the approved Mon Caramel mockup as one composition: header,
// headline, copy, three discovery choices and the real hero photo all share
// a single 18px gutter and a single mc-* type/space/radius scale, so
// nothing here is an independently-styled component. Data, routes and
// behavior (onSelect) come straight from the existing project.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="w-full md:max-w-xl md:mx-auto px-gutter pt-3 pb-8 fade-up">
      {/* Header — compact, logo centered, heart right, real touch targets kept at 44px */}
      <div className="flex items-center justify-between mb-3">
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

      {/* Hero copy */}
      <h1 className="text-mc-hero mb-2 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
      <p className="text-mc-body mb-4 text-brand-inkSoft">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      {/* Discovery choices — identical geometry across all three */}
      <div className="flex flex-col gap-2">
        {CHOICES.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="flex items-center gap-3 rounded-mc px-4 py-3 text-left min-h-11"
            style={{ backgroundColor: c.bg, border: c.dark ? `1px solid ${COLORS.border}` : "none" }}
          >
            <span
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: c.dark ? COLORS.beige : "rgba(255,255,255,0.18)" }}
            >
              {c.emoji}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display text-mc-card leading-snug" style={{ color: c.dark ? COLORS.ink : "white" }}>
                {c.title}
              </span>
              <span className="block text-mc-small leading-snug" style={{ color: c.dark ? COLORS.muted : "rgba(255,255,255,0.85)" }}>
                {c.subtitle}
              </span>
            </span>
            <ChevronRight size={16} style={{ color: c.dark ? COLORS.muted : "rgba(255,255,255,0.85)" }} />
          </button>
        ))}
      </div>

      {/* Real Mon Caramel hero photo — editorial image CTA, not a button surface */}
      <button onClick={() => onSelect("feed")} className="relative w-full mt-4 rounded-mc overflow-hidden text-left aspect-hero">
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <span className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white font-display text-mc-body">
          Mais doces dias por aqui
          <ChevronRight size={14} />
        </span>
      </button>

      {/* Pickup/delivery — tiny metadata, not a section */}
      <div className="flex items-center justify-center gap-2 mt-3 text-mc-meta text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>

      {/* Secondary discovery: moment shortcuts */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-mc-section font-display text-brand-ink">Não sabe por onde começar?</h2>
          <button onClick={() => onSelect("momentos")} className="text-mc-meta font-medium text-brand-caramelDark shrink-0">
            Ver todos
          </button>
        </div>
        <div className="flex justify-between gap-1">
          {MOMENTS.map((m, i) => (
            <button key={m.id} onClick={() => onSelect(m.id)} className="flex flex-col items-center gap-1 flex-1 min-h-11">
              <span
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: MOMENT_ACCENTS[i] }}
              >
                {m.emoji}
              </span>
              <span className="text-mc-meta text-brand-inkSoft text-center leading-tight">{MOMENT_SHORT[m.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary discovery: real product preview (editorial, not a store grid) */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-mc-section font-display text-brand-ink">Só olha... 👀</h2>
          <button onClick={() => onSelect("feed")} className="text-mc-meta font-medium text-brand-caramelDark shrink-0">
            Ver mais
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEED_PREVIEW.map((p) => {
            const photo = defaultPhotos(p)?.[0];
            return (
              <button key={p.id} onClick={() => onSelect("feed")} className="text-left">
                <div className="w-full aspect-square rounded-mc overflow-hidden bg-brand-subtle mb-1.5">
                  {photo && <Photo src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />}
                </div>
                <p className="text-mc-card font-display text-brand-ink truncate">{p.name}</p>
                <p className="text-mc-small text-brand-caramelDark">{p.price}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
