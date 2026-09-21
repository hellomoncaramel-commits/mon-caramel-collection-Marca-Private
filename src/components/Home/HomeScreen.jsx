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

// The photo itself fades in via a CSS mask (transparent at the top, fully
// opaque by 48%) instead of a dark/white overlay layered on top — the
// page's own cream background shows through the masked-out top, so it
// flows into the photo with no visible hard edge, and the photo reveals
// itself in full color well before the block's midpoint.
const MASK_GRADIENT =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.10) 8%, rgba(0,0,0,0.25) 16%, rgba(0,0,0,0.50) 26%, rgba(0,0,0,0.78) 36%, black 48%)";
const PHOTO_MASK = {
  WebkitMaskImage: MASK_GRADIENT,
  maskImage: MASK_GRADIENT,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  zIndex: 0,
};

// One composition, one 16px alignment grid. Data, routes and behavior
// (onSelect) come straight from the existing project — only the
// presentation is new. The real photo sits behind the discovery choices
// as a background, not as a separate block below them, and the page stops
// right there — no extra sections competing with the primary decision.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="w-full md:max-w-xl md:mx-auto px-gutter pt-2 pb-3 fade-up flex flex-col h-[calc(100dvh-6rem)] md:h-auto">
      {/* Header — small brand presence, no website navbar feel. Height is
          pinned so the larger, deliberately-overflowing logo below can't
          push the headline down or grow the page. */}
      <div className="flex items-center justify-between mb-2 shrink-0" style={{ height: 76 }}>
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
      <h1 className="text-mc-home-hero mt-2.5 font-display italic text-brand-ink shrink-0">O que a gente vai adoçar hoje? 💛</h1>
      <p className="text-mc-home-body mt-1.5 text-brand-inkSoft shrink-0">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      {/* Real Mon Caramel photo as background, discovery choices layered on top of it */}
      <div className="relative w-full overflow-hidden rounded-mc mt-3 flex-1 min-h-0" style={{ minHeight: 260 }}>
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={PHOTO_MASK}
          loading="eager"
        />

        <div className="relative flex flex-col gap-1.5 p-3" style={{ zIndex: 2 }}>
          {CHOICES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="items-center rounded-mc text-left"
              style={{
                backgroundColor: COLORS.caramelDarker,
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
      </div>

      {/* Pickup/delivery — footnote scale metadata, not a section */}
      <div className="flex items-center justify-center gap-1.5 mt-2 text-mc-home-meta text-brand-muted shrink-0">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>
    </div>
  );
}
