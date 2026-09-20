import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { PRODUCTS } from "../../data/products";
import { MOMENTS, MOMENT_SHORT } from "../../data/moments";
import { isBrowsable, defaultPhotos } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

// Discovery choices — compact app-style rows, not stacked website buttons.
// Only choice 1 is a solid caramel surface; the other two are quiet
// beige/off-white surfaces. Yellow never becomes a large surface, only a
// small icon accent (see moment shortcuts below).
const CHOICES = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Escolha pelo momento.", bg: COLORS.caramelDark, dark: false },
  { id: "feed", emoji: "👀", title: "Só quero olhar e passar vontade", subtitle: "Por sua conta e risco.", bg: COLORS.subtle, dark: true },
  { id: "busca", emoji: "🔎", title: "Já sei o que quero", subtitle: "Me leva pros doces.", bg: "white", dark: true },
];

const MOMENT_ACCENTS = [COLORS.caramelDark, COLORS.caramelLight, COLORS.creamYellow, COLORS.caramelDark, COLORS.caramelLight];

// Home preview only — a taste of the real feed, not the feed itself.
const FEED_PREVIEW = PRODUCTS.filter(isBrowsable).slice(0, 4);

// Art-directed crops for the portrait preview — real photos, not blindly
// centered. Anything not listed here keeps a plain center crop.
const PREVIEW_POSITION = {
  brigadeiro: "center 35%",
  "cone-trufado": "center 20%",
};

// One composition, one 16px alignment grid, four real typographic levels
// (main/section/body/utility). Data, routes and behavior (onSelect) come
// straight from the existing project — only the presentation is new.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="w-full md:max-w-xl md:mx-auto px-gutter pt-2 pb-8 fade-up">
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

      {/* Discovery choices — compact rows, identical geometry, tap target = full row (50px) */}
      <div className="flex flex-col gap-1.5 mt-3">
        {CHOICES.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="items-center rounded-mc text-left"
            style={{
              backgroundColor: c.bg,
              border: c.dark ? `1px solid ${COLORS.border}` : "none",
              display: "grid",
              gridTemplateColumns: "30px 1fr 14px",
              columnGap: "9px",
              height: "50px",
              padding: "0 12px",
            }}
          >
            <span
              className="rounded-full flex items-center justify-center"
              style={{ width: 30, height: 30, fontSize: 16, backgroundColor: c.dark ? COLORS.beige : "rgba(255,255,255,0.18)" }}
            >
              {c.emoji}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-mc-home-card-title truncate" style={{ color: c.dark ? COLORS.ink : "white" }}>
                {c.title}
              </span>
              <span className="block text-mc-home-card-subtitle truncate mt-0.5" style={{ color: c.dark ? COLORS.muted : "rgba(255,255,255,0.85)" }}>
                {c.subtitle}
              </span>
            </span>
            <ChevronRight size={14} style={{ color: c.dark ? COLORS.muted : "rgba(255,255,255,0.85)" }} />
          </button>
        ))}
      </div>

      {/* Real Mon Caramel hero photo — editorial crop, photography as the star */}
      <button
        onClick={() => onSelect("feed")}
        className="relative w-full overflow-hidden text-left rounded-mc block mt-2.5"
        style={{ height: 154 }}
      >
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute flex items-center gap-1 text-white font-display" style={{ left: 12, bottom: 10, fontSize: 12 }}>
          Mais doces dias por aqui
          <ChevronRight size={12} />
        </span>
      </button>

      {/* Pickup/delivery — footnote scale metadata, not a section */}
      <div className="flex items-center justify-center gap-1.5 mt-1.5 text-mc-home-meta text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>

      {/* Secondary discovery: moment shortcuts — small, not another hero */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-mc-home-section font-display text-brand-ink">Não sabe por onde começar?</h2>
          <button onClick={() => onSelect("momentos")} className="text-mc-home-meta font-medium text-brand-caramelDark shrink-0">
            Ver todos
          </button>
        </div>
        <div className="flex justify-between">
          {MOMENTS.map((m, i) => (
            <button key={m.id} onClick={() => onSelect(m.id)} className="flex flex-col items-center min-h-11" style={{ gap: 4 }}>
              <span
                className="rounded-full flex items-center justify-center"
                style={{ width: 36, height: 36, fontSize: 17, backgroundColor: MOMENT_ACCENTS[i] }}
              >
                {m.emoji}
              </span>
              <span className="text-mc-home-meta text-brand-inkSoft text-center leading-tight">{MOMENT_SHORT[m.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary discovery: real product preview — photography + text only, no card */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-mc-home-section font-display text-brand-ink">Só olha... 👀</h2>
          <button onClick={() => onSelect("feed")} className="text-mc-home-meta font-medium text-brand-caramelDark shrink-0">
            Ver mais
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEED_PREVIEW.map((p) => {
            const photo = defaultPhotos(p)?.[0];
            return (
              <button key={p.id} onClick={() => onSelect("feed")} className="text-left">
                <div className="w-full aspect-mc-portrait rounded-mc-img overflow-hidden bg-brand-subtle">
                  {photo && (
                    <Photo
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ objectPosition: PREVIEW_POSITION[p.id] || "center" }}
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="text-mc-home-product font-display text-brand-ink truncate mt-1.5">{p.name}</p>
                <p className="text-mc-home-price text-brand-caramelDark mt-0.5">{p.price}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
