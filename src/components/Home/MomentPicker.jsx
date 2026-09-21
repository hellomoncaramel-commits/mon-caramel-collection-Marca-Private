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

// The card's own width on mobile (min(82vw, 330px)) recurs in a few
// places below — the peek padding on the track and the arrow offsets
// both need to know it too, so it can't be simplified away.

// The photo covers the whole card; this is a warm caramel/cream gradient
// laid over it (full card height, not just a lower "panel") so the text
// has a legible platform without a hard, separate rectangle — the photo
// stays essentially untouched through the top ~45%, then the same warm
// hue ramps in and carries through solid at the bottom. The tan
// (#FAD9C4 ≈ rgb(250,217,196)) was sampled from the approved reference
// mockup rather than picked by eye; it's a one-off tint from the brand's
// caramel family (not one of the existing brand.* tokens), scoped here.
const CARD_PANEL_TAN = "250,217,196";
const TEXT_PANEL_GRADIENT = `linear-gradient(to bottom, rgba(${CARD_PANEL_TAN},0) 0%, rgba(${CARD_PANEL_TAN},0) 45%, rgba(${CARD_PANEL_TAN},0.28) 58%, rgba(${CARD_PANEL_TAN},0.74) 72%, rgba(${CARD_PANEL_TAN},0.95) 86%, rgba(${CARD_PANEL_TAN},1) 100%)`;

function MomentCard({ moment, photoSrc, eager, onSelect }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 20 }}>
      <Photo src={photoSrc} alt="" className="absolute inset-0 w-full h-full object-cover" loading={eager ? "eager" : "lazy"} />
      <div className="absolute inset-0" style={{ background: TEXT_PANEL_GRADIENT }} />

      <div className="absolute inset-x-0 bottom-0 flex flex-col" style={{ padding: "0 20px 20px" }}>
        <h3
          className="font-display font-semibold text-brand-ink text-[clamp(24px,6.5vw,30px)] md:text-[25px] leading-[1.02] md:leading-[1.08]"
        >
          <span className="inline-block align-baseline" style={{ fontSize: "0.7em" }}>
            {moment.emoji}
          </span>{" "}
          {moment.label}
        </h3>
        <p className="text-brand-inkSoft mt-2.5 md:mt-1.5 text-[15px] md:text-[13px] leading-[1.3] md:leading-[1.35]">
          {MOMENT_TAGLINE[moment.id]}
        </p>
        <button
          onClick={onSelect}
          className="mt-4 md:mt-3 self-end shrink-0 font-semibold md:font-medium h-11 md:h-[43px] px-5 md:px-[18px] text-[14.5px] md:text-[14px]"
          style={{ backgroundColor: COLORS.caramelDarker, color: COLORS.beige, borderRadius: 999 }}
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

  // Mobile centers the active card with a peek of its neighbors on both
  // sides (scroll-snap-align: center); desktop keeps its original
  // left-aligned, two-cards-visible layout (scroll-snap-align: start).
  // Both the click-to-scroll target and the "which card is active" scroll
  // math depend on which mode is live, so they branch on the same
  // breakpoint the CSS uses (md: 768px) rather than duplicating logic.
  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(el.children);
        if (!children.length) return;
        const desktop = isDesktop();
        let closest = 0;
        let closestDist = Infinity;
        children.forEach((c, i) => {
          const dist = desktop
            ? Math.abs(c.offsetLeft - el.scrollLeft)
            : Math.abs(c.offsetLeft + c.offsetWidth / 2 - (el.scrollLeft + el.clientWidth / 2));
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
    const target = isDesktop() ? child.offsetLeft : child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
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
      <h1 className="font-display italic text-brand-ink text-center shrink-0 text-[clamp(30px,8vw,36px)] md:text-[26px] leading-[1.05]">
        Como você está hoje?
      </h1>
      <p className="text-brand-inkSoft text-center mt-1.5 shrink-0 text-[16px] md:text-mc-home-body leading-[1.35]">
        Deslize para ver os momentos
        <br />e encontre o doce perfeito.
      </p>

      {/* Carousel — the real photo is the protagonist. Mobile: one
          compact card (width/aspect-ratio driven, not viewport-height
          driven) with a peek of the previous/next card on both sides.
          Desktop (untouched): two full cards + a peek of the third,
          left-aligned, filling the fixed md:h-[520px] row. */}
      <div className="relative flex-1 mt-6 md:mt-3 flex flex-col justify-center md:flex-none md:h-[520px]">
        <div
          ref={trackRef}
          onKeyDown={onTrackKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Momentos"
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar focus:outline-none pl-[calc((100%-min(82vw,330px))/2)] pr-[calc((100%-min(82vw,330px))/2)] md:pl-0 md:pr-0 md:h-full"
        >
          {MOMENTS.map((m, i) => (
            <div
              key={m.id}
              className="shrink-0 snap-center md:snap-start w-[min(82vw,330px)] md:w-[325px] aspect-[0.72/1] md:aspect-auto md:h-full"
            >
              <MomentCard moment={m} photoSrc={MOMENT_PHOTO[m.id]} eager={i === 0} onSelect={() => onSelectMoment(m.id)} />
            </div>
          ))}
        </div>

        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Momento anterior"
          className="absolute flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity left-[calc((100%-min(82vw,330px))/2+4px)] md:left-1 w-[42px] h-[42px] md:w-9 md:h-9"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <span
            className="flex items-center justify-center rounded-full w-8 h-8 md:w-9 md:h-9"
            style={{ backgroundColor: "rgba(255,252,245,0.88)", boxShadow: "0 2px 8px rgba(61,36,24,0.18)" }}
          >
            <ChevronLeft className="text-brand-ink w-4 h-4 md:w-[18px] md:h-[18px]" />
          </span>
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === MOMENTS.length - 1}
          aria-label="Próximo momento"
          className="absolute flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity right-[calc((100%-min(82vw,330px))/2+4px)] md:right-1 w-[42px] h-[42px] md:w-9 md:h-9"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <span
            className="flex items-center justify-center rounded-full w-8 h-8 md:w-9 md:h-9"
            style={{ backgroundColor: "rgba(255,252,245,0.88)", boxShadow: "0 2px 8px rgba(61,36,24,0.18)" }}
          >
            <ChevronRight className="text-brand-ink w-4 h-4 md:w-[18px] md:h-[18px]" />
          </span>
        </button>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center shrink-0 mt-4 md:mt-2" role="tablist" aria-label="Ir para momento">
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
