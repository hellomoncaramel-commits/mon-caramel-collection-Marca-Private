import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { MOMENTS, MOMENT_TAGLINE } from "../../data/moments";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

// Real Mon Caramel photography per moment — no AI mockups, no stock. Four
// moments already have a dedicated photo; "festa" reuses the first real
// custom-order photo from the party gallery (there's no single "festa"
// hero shot yet). Chosen for how well each crops into a tall vertical
// frame with the treat itself clear and off-center enough to leave room
// for the bottom text panel:
//   café      → moment-cafe.jpg (cup + brigadeiro on a plate)
//   dia-difícil → moment-dia-dificil.jpg (tray of truffles)
//   freezer   → moment-freezer.jpg (literally inside the freezer)
//   presente  → moment-presente.jpg (wrapped gift box with ribbon)
//   festa     → festaOptions[0] (personalized party sweets)
const MOMENT_PHOTO = {
  cafe: REAL_PHOTOS.cafe,
  "dia-dificil": REAL_PHOTOS["dia-dificil"],
  freezer: REAL_PHOTOS.freezer,
  presente: REAL_PHOTOS.presente,
  festa: REAL_PHOTOS.festaOptions[0],
};

const CARD_WIDTH = "min(84vw, 325px)";

// Local, screen-scoped typography — sized to this screen's own targets
// rather than reusing Home's mc-home-hero token, which is close but not
// identical (24px/1.04 vs. the 25-26px/1.05 asked for here).
const HEADING_STYLE = { fontSize: 26, lineHeight: 1.05 };
const CARD_TITLE_STYLE = { fontSize: 25, lineHeight: 1.08 };
const CARD_SUBTITLE_STYLE = { fontSize: 13, lineHeight: 1.35 };

// The photo covers the whole card; this panel is a warm caramel/cream
// gradient laid over its lower portion so the text has a legible platform
// without turning into a hard, separate rectangle — the photo keeps
// showing through the upper, more transparent part of the gradient, and
// the same warm hue carries all the way down (no separate white box).
// The exact tan (#FAD9C4) was sampled from the approved reference mockup
// rather than picked by eye, so the finish matches it precisely; it's a
// one-off tint derived from the brand's caramel family (not one of the
// existing brand.* tokens), scoped to this card only.
const CARD_PANEL_TAN = "250,217,196";
const TEXT_PANEL_GRADIENT = `linear-gradient(to bottom, rgba(${CARD_PANEL_TAN},0) 0%, rgba(${CARD_PANEL_TAN},0.14) 30%, rgba(${CARD_PANEL_TAN},0.48) 44%, rgba(${CARD_PANEL_TAN},0.8) 56%, rgba(${CARD_PANEL_TAN},0.95) 68%, rgb(${CARD_PANEL_TAN}) 100%)`;

function MomentCard({ moment, photoSrc, eager, onSelect }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 20 }}>
      <Photo src={photoSrc} alt="" className="absolute inset-0 w-full h-full object-cover" loading={eager ? "eager" : "lazy"} />

      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end"
        style={{ top: "50%", background: TEXT_PANEL_GRADIENT, padding: 20 }}
      >
        <h3 className="font-display font-semibold text-brand-ink" style={CARD_TITLE_STYLE}>
          {moment.emoji} {moment.label}
        </h3>
        <p className="text-brand-inkSoft mt-1.5" style={CARD_SUBTITLE_STYLE}>
          {MOMENT_TAGLINE[moment.id]}
        </p>
        <button
          onClick={onSelect}
          className="mt-3 self-end shrink-0 font-medium"
          style={{ backgroundColor: COLORS.caramelDarker, color: COLORS.beige, height: 43, padding: "0 18px", borderRadius: 999, fontSize: 14 }}
        >
          Quero isso →
        </button>
      </div>
    </div>
  );
}

// "Me ajuda a escolher" — swipe (or use the side arrows) through the 5
// moments, recognize yourself in one, tap "Quero isso". A big real photo
// carries each card; the dots underneath are the only other way through
// (no "ver todos" list — the carousel is the whole page).
export default function MomentPicker({ onBack, onSelectMoment }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(el.children);
        if (!children.length) return;
        let closest = 0;
        let closestDist = Infinity;
        children.forEach((c, i) => {
          const dist = Math.abs(c.offsetLeft - el.scrollLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setIndex(closest);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(MOMENTS.length - 1, i));
    const child = el.children[clamped];
    if (!child) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: child.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onTrackKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <div className="w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl md:mx-auto px-gutter pt-2 pb-3 fade-up flex flex-col h-[calc(100dvh-6rem)] md:h-auto">
      {/* Header — same compact, icon-only language as Home. The right-side
          spacer mirrors the back button's width so the logo stays
          centered on the viewport, independent of the back arrow. */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <button onClick={onBack} aria-label="Voltar" className="w-11 h-11 flex items-center justify-center">
          <ArrowLeft size={20} className="text-brand-caramelDark" />
        </button>
        <Logo size="sm" />
        <div className="w-11" />
      </div>

      {/* Intro */}
      <h1 className="font-display italic text-brand-ink text-center shrink-0" style={HEADING_STYLE}>
        Como você está hoje?
      </h1>
      <p className="text-mc-home-body text-brand-inkSoft text-center mt-1.5 shrink-0">
        Deslize para ver os momentos
        <br />e encontre o doce perfeito.
      </p>

      {/* Carousel — the real photo is the protagonist, one card at a time,
          a small peek of the next on the right teaches the swipe. Side
          arrows sit partially over the card edges as an alternative to
          swiping. Bounded by the page's own gutter (no full-bleed), so
          overflow stays contained.

          Height: mobile uses flex-1 to fill whatever's left inside the
          page's fixed h-[calc(100dvh-6rem)]. At md+ the page switches to
          h-auto (content-sized) — flex-1 then has no space to grow into,
          so this and the cards' h-full inside it would resolve to 0
          (percentage height on an indeterminate ancestor). Pinning a
          fixed height at md+ breaks that chain and keeps the card
          visible on desktop. */}
      <div className="relative flex-1 min-h-0 mt-3 md:flex-none md:h-[520px]">
        <div
          ref={trackRef}
          onKeyDown={onTrackKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Momentos"
          className="h-full flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar focus:outline-none"
        >
          {MOMENTS.map((m, i) => (
            <div key={m.id} className="h-full shrink-0" style={{ width: CARD_WIDTH, scrollSnapAlign: "start" }}>
              <MomentCard moment={m} photoSrc={MOMENT_PHOTO[m.id]} eager={i === 0} onSelect={() => onSelectMoment(m.id)} />
            </div>
          ))}
        </div>

        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Momento anterior"
          className="absolute rounded-full flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity"
          style={{ left: 4, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, backgroundColor: "rgba(255,252,245,0.88)", boxShadow: "0 2px 8px rgba(61,36,24,0.18)" }}
        >
          <ChevronLeft size={18} className="text-brand-ink" />
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === MOMENTS.length - 1}
          aria-label="Próximo momento"
          className="absolute rounded-full flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity"
          style={{ right: 4, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, backgroundColor: "rgba(255,252,245,0.88)", boxShadow: "0 2px 8px rgba(61,36,24,0.18)" }}
        >
          <ChevronRight size={18} className="text-brand-ink" />
        </button>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center shrink-0 mt-2" role="tablist" aria-label="Ir para momento">
        {MOMENTS.map((m, i) => {
          const active = i === index;
          const dotSize = active ? 9 : 7;
          return (
            <button
              key={m.id}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={active}
              aria-label={`Ir para momento ${i + 1}`}
              className="flex items-center justify-center shrink-0"
              style={{ width: dotSize + 7, height: 32 }}
            >
              <span className="block rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: active ? COLORS.caramelDarker : COLORS.border }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
