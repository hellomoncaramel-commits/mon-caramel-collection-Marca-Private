import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MOMENTS, MOMENT_TAGLINE } from "../../data/moments";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

// Real Mon Caramel photography per moment — no AI mockups, no stock. Four
// moments already have a dedicated photo; "festa" reuses the first real
// custom-order photo from the party gallery (there's no single "festa"
// hero shot yet).
const MOMENT_PHOTO = {
  cafe: REAL_PHOTOS.cafe,
  "dia-dificil": REAL_PHOTOS["dia-dificil"],
  freezer: REAL_PHOTOS.freezer,
  presente: REAL_PHOTOS.presente,
  festa: REAL_PHOTOS.festaOptions[0],
};

// Fades the bottom ~28% of the card photo to transparent so it blends into
// the card's own cream base instead of meeting the text area at a hard
// edge — the same masked-photo technique already established on Home,
// just run over a short distance near the photo's bottom instead of its
// top (photography should still dominate the upper portion of the card).
const CARD_PHOTO_MASK_GRADIENT = "linear-gradient(to bottom, black 0%, black 72%, transparent 100%)";
const CARD_PHOTO_MASK = {
  WebkitMaskImage: CARD_PHOTO_MASK_GRADIENT,
  maskImage: CARD_PHOTO_MASK_GRADIENT,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
};

const PHOTO_REGION_HEIGHT = "63%";
const CARD_WIDTH = "min(84vw, 325px)";

// Local, screen-scoped typography — sized to this screen's own targets
// rather than reusing Home's mc-home-hero token, which is close but not
// identical (24px/1.04 vs. the 25-26px/1.05 asked for here).
const HEADING_STYLE = { fontSize: 26, lineHeight: 1.05 };
const CARD_TITLE_STYLE = { fontSize: 26, lineHeight: 1.05 };
const CARD_SUBTITLE_STYLE = { fontSize: 13, lineHeight: 1.35 };

function MomentCard({ moment, photoSrc, eager, onSelect }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 20, backgroundColor: COLORS.beige }}>
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: PHOTO_REGION_HEIGHT }}>
        <Photo
          src={photoSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={CARD_PHOTO_MASK}
          loading={eager ? "eager" : "lazy"}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col" style={{ top: `calc(${PHOTO_REGION_HEIGHT} - 34px)`, padding: 19 }}>
        <span
          className="rounded-full flex items-center justify-center shrink-0"
          style={{ width: 34, height: 34, fontSize: 17, backgroundColor: `${COLORS.caramelDarker}17` }}
        >
          {moment.emoji}
        </span>
        <h3 className="font-display italic text-brand-ink mt-2" style={CARD_TITLE_STYLE}>
          {moment.label}
        </h3>
        <p className="text-brand-inkSoft mt-1" style={CARD_SUBTITLE_STYLE}>
          {MOMENT_TAGLINE[moment.id]}
        </p>
        <button
          onClick={onSelect}
          className="mt-auto self-start text-white font-medium"
          style={{ backgroundColor: COLORS.caramelDarker, height: 43, padding: "0 18px", borderRadius: 999, fontSize: 14 }}
        >
          Quero isso →
        </button>
      </div>
    </div>
  );
}

// "Me ajuda a escolher" — swipe through the 5 moments, recognize yourself
// in one, tap "Quero isso". The carousel *is* the navigation: no "ver
// todos" list, no redundant shortcut row underneath it — just the cards
// and 5 tappable dots.
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
    <div className="w-full md:max-w-xl md:mx-auto px-gutter pt-2 pb-3 fade-up flex flex-col h-[calc(100dvh-6rem)] md:h-auto">
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
        Deslize e encontre o seu momento.
      </p>

      {/* Carousel — one card at a time, a small peek of the next on the
          right teaches the swipe. Bounded by the page's own gutter
          (no full-bleed), so overflow stays contained. The card height is
          capped (not left to fill all available flex space) so it stays
          near the ~440-470px target regardless of viewport; any leftover
          room becomes symmetric breathing space above/below via
          justify-center instead of an oversized card. */}
      <div className="relative flex-1 min-h-0 mt-3 flex flex-col justify-center">
        <div
          ref={trackRef}
          onKeyDown={onTrackKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Momentos"
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar focus:outline-none"
          style={{ height: "min(100%, 460px)" }}
        >
          {MOMENTS.map((m, i) => (
            <div key={m.id} className="h-full shrink-0" style={{ width: CARD_WIDTH, scrollSnapAlign: "start" }}>
              <MomentCard moment={m} photoSrc={MOMENT_PHOTO[m.id]} eager={i === 0} onSelect={() => onSelectMoment(m.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination — the only navigation besides the swipe itself. Each
          dot's visible size stays tiny (7-9px) while a larger invisible
          hit area (via the absolutely-positioned inset child) keeps it
          comfortably tappable. */}
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
              aria-label={m.label}
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
