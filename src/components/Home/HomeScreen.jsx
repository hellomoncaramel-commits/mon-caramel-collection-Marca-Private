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

// The photo fades in via a CSS mask (transparent at both ends, fully opaque
// through the middle) instead of a color overlay layered on top — the
// page's own cream background shows through the masked-out top and bottom,
// so the photo "emerges" from the intro text above it and "dissolves" into
// the choice panel below it, rather than reading as a hard rectangle
// dropped between two unrelated blocks. Both masked zones land where the
// choice panel's own -mt-12 overlap actually covers them, so the visible
// seam a reader sees is the soft fade, not a sharp photo/panel edge.
const MASK_GRADIENT =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 5%, black 13%, black 79%, rgba(0,0,0,0.4) 90%, transparent 100%)";
const PHOTO_MASK = {
  WebkitMaskImage: MASK_GRADIENT,
  maskImage: MASK_GRADIENT,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
};

// Same data, routes, behavior (onSelect), copy and photo as before — only
// the composition changed. The previous version read as "three brown
// buttons sitting on a photo": the photo was a small, fully-boxed
// background container with the choices glued directly onto it, no real
// separation between "picture" and "controls". This version treats them as
// two distinct, layered things — a full-bleed photo (breaks the page's own
// gutter on both sides, so it reads as a real photograph rather than an
// inset decoration) with nothing on top of it, and a separate elevated
// panel that overlaps its lower edge, holding the three choices and the
// pickup/delivery line as its own closing row. That overlap is the one
// piece of "sophisticated" the brief specifically asked for — it's also
// what makes the photo read as a hero image instead of a background-fill.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl md:mx-auto px-gutter pt-2 pb-8 fade-up">
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

      {/* Hero — the page's clear textual protagonist, not a compact
          heading. Deliberately more room above it (mt-4) and below it
          (mt-3 to the subtitle, mt-7 from subtitle to photo) than the
          tight mt-2/mt-1.5 rhythm used before, so LOGO → HERO → INTRO →
          CHOICES read as four distinct steps instead of one compressed
          block. */}
      <h1 className="text-mc-home-hero mt-4 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
      {/* max-w keeps the line comfortably short (it would otherwise stretch
          nearly full-width on a 390–430px phone) — a narrower, shaped
          paragraph reads as deliberately subordinate to the hero above it,
          not as another wide, equally-weighted block. */}
      <p className="text-[15.5px] leading-[1.5] mt-3 max-w-[290px] text-brand-inkSoft">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      {/* Full-bleed photo — breaks out of the page's own 16px gutter
          (-mx-gutter) on both sides instead of sitting inset inside a
          rounded box, so it reads as a real photograph the page runs
          into, not a decorative container. No text or controls sit on
          it anymore; height is picked for how the photo itself reads
          (a proper hero, not "whatever's left of the viewport"), not to
          fit a fixed 400px box carried over from a different attempt. */}
      <div className="relative -mx-gutter mt-7 h-[300px] overflow-hidden md:h-[380px] md:rounded-3xl">
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={PHOTO_MASK}
          loading="eager"
        />
      </div>

      {/* The choice panel overlaps the photo's lower edge (-mt-12) instead
          of floating inside it — a distinct, elevated cream card (its own
          radius, border and shadow) rather than rows glued directly onto
          the picture. Sitting at the page's normal gutter width while the
          photo behind it bleeds further out, a sliver of photo shows on
          both sides of the panel where they overlap — the "photo peeking
          around a floating card" look, not a hard photo/card seam. */}
      <div
        className="relative -mt-12 rounded-mc border border-brand-border/60 bg-brand-beige p-3.5"
        style={{ boxShadow: "0 14px 32px rgba(61,36,24,0.16)" }}
      >
        <div className="flex flex-col gap-2">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="items-center rounded-2xl text-left transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
              style={{
                backgroundColor: COLORS.caramelDarker,
                display: "grid",
                gridTemplateColumns: "36px 1fr 16px",
                columnGap: "11px",
                height: "64px",
                padding: "0 16px",
              }}
            >
              <span
                className="rounded-full flex items-center justify-center"
                style={{ width: 36, height: 36, fontSize: 18, backgroundColor: "rgba(255,255,255,0.18)" }}
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

        {/* Pickup/delivery — the panel's own closing row (a bordered
            footer inside it), not a separate footnote left dangling after
            the block. */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-3 border-t border-brand-border/70 text-mc-home-meta text-brand-muted">
          <span>📍 Retirada grátis — Ritson x Adelaide</span>
          <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
          <span>🚗 Entrega disponível</span>
        </div>
      </div>
    </div>
  );
}
