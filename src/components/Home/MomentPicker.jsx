import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MOMENTS, MOMENT_TAGLINE } from "../../data/moments";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// Real Mon Caramel photography per moment — no AI mockups, no stock.
//   dia-difícil → dias-de-luta.jpg (real photo, cookie/chocolate tray) —
//                 consolidated moment, also covers what used to be "café"
//                 and "freezer" as standalone journeys
//   presente    → lembrancinha.jpg (real photo, gift box + ribbon)
//   festa       → nao-vai-ter-festa.jpg (real photo, party dessert table)
const MOMENT_PHOTO = {
  "dia-dificil": REAL_PHOTOS.diasDeLuta,
  presente: REAL_PHOTOS.lembrancinha,
  festa: REAL_PHOTOS.naoVaiTerFesta,
};

// Final CTA copy, approved after the UX/UI audit — one distinct verb per
// card, matching what each destination actually is (dia-dificil: a real
// product grid; presente: a router into 3 inspiration formats; festa: a
// real order-building screen with quantity + budget request, not a passive
// gallery — "Quero planejar" was chosen over "Ver galeria" specifically
// because the destination isn't passive).
const MOMENT_CTA = {
  "dia-dificil": "Quero escolher",
  presente: "Ver inspirações",
  festa: "Quero planejar",
};

// Structural redesign, 2026-10 (post-UX/UI-audit round): text-over-photo is
// abandoned entirely — three prior rounds of gradient calibration (see git
// history on this file) kept the "painel"/legibility complaint alive
// because the problem was never really contrast, it was the format itself.
// Every card is now two physically separate zones stacked in a flex
// column: a clean photo (no gradient, no scrim, no text-shadow — nothing
// sits on it) and a solid-background content zone below it, same "photo
// mounted on a card" language ProductCard's dia-dificil treatment and
// InspirationCarousel already use elsewhere on the site. Contrast is
// guaranteed by construction (ink text on a solid subtle-beige surface),
// not by per-photo calibration — nothing left to recalibrate if a photo
// changes later.
//
// Per-moment photo framing override — only set where the source photo's
// framing needs a nudge so the (now shorter, photo-zone-only) crop keeps
// the right subject in frame; anything absent just uses object-fit: cover
// at the CSS default position (50% 50%). Re-tuned for the new, shorter
// photo zone (was tuned for the old full-card-height crop window).
// "festa": the source photo is landscape; the zone is still taller than
// wide, so object-position alone can only slide sideways — a scale() zoom
// anchored near the green "E" party favors crops the backdrop wall out.
const MOMENT_PHOTO_STYLE = {
  festa: { objectPosition: "0% 38%", transform: "scale(1.65)", transformOrigin: "58% 30%" },
  presente: { objectPosition: "50% 38%" },
};

function MomentCard({ moment, photoSrc, eager, onSelect }) {
  const lines = moment.titleLines ?? [moment.label];
  const photoStyle = MOMENT_PHOTO_STYLE[moment.id];
  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl flex flex-col">
      {/* Zone 1 — photo. Clean, full stop: no gradient, no scrim, no
          overlay, no text-shadow (nothing renders on top of it to need
          one). ~62% of card height on mobile/tablet, ~67% on desktop —
          the photo stays the larger, dominant element either way. */}
      <div className="relative w-full h-[62%] lg:h-[67%] shrink-0">
        <Photo
          src={photoSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={photoStyle}
          loading={eager ? "eager" : "lazy"}
        />
      </div>

      {/* Zone 2 — content. Solid surface (COLORS.subtle — the same warm
          beige "card content" surface ProductCard's dia-dificil treatment
          already uses), title/tagline/CTA entirely off the photograph.
          No emoji before the title in this composition (approved
          direction) — the photo itself already communicates the moment. */}
      <div
        className="relative flex-1 min-h-0 flex flex-col justify-center px-5 lg:px-6 py-4 lg:py-5"
        style={{ backgroundColor: COLORS.subtle }}
      >
        <h3
          className="font-display font-semibold text-brand-ink text-[clamp(21px,5.5vw,24px)] lg:text-[22px] leading-[1.05] tracking-[-0.01em]"
          aria-label={moment.label}
        >
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h3>
        <p className="text-brand-inkSoft mt-2 lg:mt-1.5 text-[14px] lg:text-[13px] leading-[1.35]">
          {MOMENT_TAGLINE[moment.id]}
        </p>
        <button
          onClick={onSelect}
          className="mt-3.5 lg:mt-3 self-start shrink-0 inline-flex items-center gap-1 font-medium h-11 lg:h-10 pl-4 pr-3.5 text-[13.5px] text-white transition-transform active:scale-95"
          style={{ backgroundColor: COLORS.caramelDark, borderRadius: 999, boxShadow: "0 2px 8px rgba(61,36,24,0.14)" }}
        >
          {MOMENT_CTA[moment.id]}
          <ChevronRight size={15} strokeWidth={2.5} />
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
    <div className="w-full md:max-w-2xl lg:max-w-6xl xl:max-w-7xl md:mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-3 fade-up flex flex-col h-[calc(100dvh-6rem)] md:h-auto lg:h-auto">
      {/* Visual-correction pass: bigger brand presence here specifically
          (logoSize="heroLogo", see Logo.jsx) — explicit override, so every
          other SiteHeader caller relying on the default "home" size is
          unaffected. rowHeight bumped to give the taller logo room, same
          overflow-the-row allowance "home" already uses at its own size. */}
      <SiteHeader onBack={onBack} logoSize="heroLogo" rowHeight={108} />

      {/* Intro — Fraunces roman medium, matching the Home headline's own
          treatment (italic is an accent now, not the default headline
          voice). lg+ gets its own larger size for more editorial presence
          (three full cards deserve a heavier anchor above them) and its
          own copy: "Deslize" literally doesn't apply once there's nothing
          to swipe through, so lg+ swaps it for a direct, non-gesture line
          — mobile/tablet copy is untouched. */}
      <h1 className="font-display font-medium text-brand-ink text-center shrink-0 text-[clamp(30px,8vw,36px)] md:text-[26px] lg:text-[38px] leading-[1.05]">
        Como você está hoje?
      </h1>
      <p className="text-brand-inkSoft text-center mt-1.5 shrink-0 text-[15px] md:text-mc-home-body lg:hidden leading-[1.35]">
        Deslize para ver os momentos
        <br />e encontre o doce perfeito.
      </p>
      <p className="text-brand-inkSoft text-center mt-2.5 shrink-0 hidden lg:block text-lg leading-[1.4]">
        Escolha o que combina com o que você precisa hoje.
      </p>

      {/* Carousel — the real photo is the protagonist. Mobile: one
          compact card (width/aspect-ratio driven, not viewport-height
          driven) with a peek of the previous/next card on both sides.
          Tablet (untouched): two full cards + a peek of the third,
          left-aligned, filling the fixed md:h-[520px] row. Hidden at lg+,
          where the 3-card grid below takes over — same MomentCard, same
          MOMENTS/MOMENT_PHOTO/onSelectMoment, no carousel logic needed
          since there's nothing to scroll through anymore. */}
      <div className="relative flex-1 mt-6 md:mt-3 flex flex-col justify-center md:flex-none md:h-[520px] lg:hidden">
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
          style={{ top: "31%", transform: "translateY(-50%)" }}
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
          style={{ top: "31%", transform: "translateY(-50%)" }}
        >
          <span
            className="flex items-center justify-center rounded-full w-8 h-8 md:w-9 md:h-9"
            style={{ backgroundColor: "rgba(255,252,245,0.88)", boxShadow: "0 2px 8px rgba(61,36,24,0.18)" }}
          >
            <ChevronRight className="text-brand-ink w-4 h-4 md:w-[18px] md:h-[18px]" />
          </span>
        </button>
      </div>

      {/* Pagination — hidden at lg+ along with the carousel it belongs to. */}
      <div className="flex items-center justify-center shrink-0 mt-4 md:mt-2 lg:hidden" role="tablist" aria-label="Ir para momento">
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

      {/* Desktop (lg+) — exactly 3 journeys, shown simultaneously, no
          scroll/arrows/dots needed. aspect-[3/4] keeps all three a
          consistent, comfortable height regardless of column width; the
          wider lg:max-w-6xl/xl:max-w-7xl container above (was 5xl/6xl)
          gives each card meaningfully more room, so they read as three
          large editorial photographs rather than small dashboard tiles. */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-10">
        {MOMENTS.map((m, i) => (
          <div key={m.id} className="aspect-[3/4]">
            <MomentCard moment={m} photoSrc={MOMENT_PHOTO[m.id]} eager={i === 0} onSelect={() => onSelectMoment(m.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
