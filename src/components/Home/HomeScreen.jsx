import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import SiteHeader from "../shared/SiteHeader";
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
// opaque by 52%) instead of a dark/white overlay layered on top — the
// page's own cream background shows through the masked-out top, so it
// flows into the photo with no visible hard edge, and the photo reveals
// itself in full color around the block's midpoint.
const MASK_GRADIENT =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.06) 7%, rgba(0,0,0,0.18) 15%, rgba(0,0,0,0.38) 24%, rgba(0,0,0,0.65) 34%, rgba(0,0,0,0.88) 43%, black 52%)";
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
//
// Height: unlike MomentPicker (whose carousel genuinely needs a fixed
// viewport-relative height for the swipe math), Home has no such
// requirement — it previously borrowed the same h-[calc(100dvh-6rem)] +
// flex-1 pattern anyway, which forced the whole composition (hero, body,
// photo, cards) to shrink to fit whatever was left above the fold. That's
// what made Home read smaller than every other screen despite being the
// first thing a customer sees. It now flows naturally like every other
// page — minimal scroll on short phones, full presence everywhere else.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl md:mx-auto px-gutter pt-2 pb-6 fade-up">
      <SiteHeader
        rightSlot={
          <button
            onClick={() => onSelect("salvos")}
            aria-label="Ver salvos"
            className="w-11 h-11 flex items-center justify-center"
          >
            <Heart size={20} className="text-brand-caramelDark" />
          </button>
        }
      />

      {/* Intro — editorial, not a marketing hero. Scale matched to
          MomentPicker's own mobile hero (see tailwind.config.js) so the
          two "big editorial headline" screens read as the same family. */}
      <h1 className="text-mc-home-hero mt-2 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
      <p className="text-[15px] leading-[1.4] mt-2 text-brand-inkSoft">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      {/* Real Mon Caramel photo as background, discovery choices layered on top of it.
          No margin-top here — the 14px gap to the first button comes entirely from the
          inner wrapper's pt-[14px] below, since the photo itself is still fully
          transparent (via mask) at its very top and reads as part of that same gap.
          Fixed height on both mobile and desktop now — the photo is the page's main
          visual anchor, sized for presence rather than for "whatever space is left". */}
      <div className="relative w-full overflow-hidden rounded-mc mt-5 h-[400px] md:h-[460px]">
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={PHOTO_MASK}
          loading="eager"
        />

        <div className="relative flex flex-col gap-2 pt-[14px] px-3.5 pb-3.5" style={{ zIndex: 2 }}>
          {CHOICES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="items-center rounded-mc text-left"
              style={{
                backgroundColor: COLORS.caramelDarker,
                display: "grid",
                gridTemplateColumns: "34px 1fr 16px",
                columnGap: "10px",
                height: "62px",
                padding: "0 14px",
              }}
            >
              <span
                className="rounded-full flex items-center justify-center"
                style={{ width: 34, height: 34, fontSize: 18, backgroundColor: "rgba(255,255,255,0.18)" }}
              >
                {c.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-mc-home-card-title truncate text-white">{c.title}</span>
                <span className="block text-mc-home-card-subtitle truncate mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {c.subtitle}
                </span>
              </span>
              <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.85)" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Pickup/delivery — footnote scale metadata, not a section */}
      <div className="flex items-center justify-center gap-1.5 mt-3 text-mc-home-meta text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>
    </div>
  );
}
