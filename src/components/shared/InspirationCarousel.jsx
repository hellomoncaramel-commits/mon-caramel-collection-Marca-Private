import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { useSnapCarousel } from "../../hooks/useSnapCarousel";
import InspirationImage from "./InspirationImage";

// Slide width: "min(84vw,460px)" — same technique as MomentPicker, scales
// with the viewport on mobile and caps at a fixed size once there's room
// to spare (tablet/desktop) instead of growing into one giant photo. It
// has to be written out as a literal class string everywhere it's used
// below (track padding, each slide, both arrows) rather than built from a
// shared JS constant: Tailwind's build-time scanner matches class names by
// searching the file's raw text, so a template-literal interpolation like
// `w-[${SLIDE}]` never produces the real class text and silently emits no
// CSS for it.
//
// At lg+ this carousel now also sits inside a narrower column (the 2-col
// "carousel | copy" desktop layout on Caixas/Bandejas/Mimos — see those
// screens), not the full page width, so the 84vw/460px mobile formula
// would badly undersize it there. "min(90%,680px)" below is deliberately
// %-based, not vw-based — % resolves against the track's own container
// (the column), so it actually fills most of that column regardless of
// viewport size, instead of racing against the full browser width.

// The slide FRAME (aspect-photo, rounded-3xl, overflow-hidden below) is the
// only thing with a fixed size — it stays identical for every photo, now
// and for whatever gets added later. What goes inside it never needs its
// own CSS: InspirationImage renders each photo at its own natural aspect
// ratio (no crop, no zoom, no forced width/height:100%), so a portrait, a
// square, or an odd phone-camera ratio all just work, with cream space
// showing on the sides when a photo doesn't fill the frame — same
// intentional "photo mounted in a frame" look for every slide.

// One inspiration photo at a time, full width of its own slide — no
// intermediate tap before you can actually see the whole thing. Items are
// just {id, src, alt}, not derived from PRODUCTS — an inspiration photo
// isn't a SKU: add an entry to the relevant array in
// data/inspirationGalleries.js and it shows up here automatically, nothing
// else to wire up. Shared by every "para inspirar" carousel (Caixas,
// Bandejas, and whatever comes next) — ariaLabel is the one thing each
// caller sets for itself (screen-reader context, e.g. "Fotos de caixas"
// vs. "Fotos de cestas especiais"); everything else here is identical across all
// of them on purpose, so they read as one consistent system.
// `onIndexChange`: optional — fires with the currently-visible slide's
// index on change (and once on mount), for a caller that needs to know
// which inspiration is on screen (see MimosScreen.jsx). Caixas/Bandejas
// simply don't pass it.
export default function InspirationCarousel({ items, ariaLabel, onIndexChange }) {
  const { trackRef, index, goTo, onTrackKeyDown } = useSnapCarousel(items.length);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          onKeyDown={onTrackKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar focus:outline-none pl-[calc((100%-min(84vw,460px))/2)] pr-[calc((100%-min(84vw,460px))/2)] lg:pl-[calc((100%-min(90%,680px))/2)] lg:pr-[calc((100%-min(90%,680px))/2)]"
        >
          {items.map((item) => (
            <div key={item.id} className="shrink-0 snap-center w-[min(84vw,460px)] lg:w-[min(90%,680px)]">
              <div className="relative aspect-photo rounded-3xl overflow-hidden bg-brand-subtle">
                <InspirationImage src={item.src} alt={item.alt || ""} />
              </div>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Foto anterior"
              className="absolute top-1/2 -translate-y-1/2 left-[calc((100%-min(84vw,460px))/2+4px)] lg:left-[calc((100%-min(90%,680px))/2+4px)] w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity"
            >
              <ChevronLeft size={18} className="text-brand-ink" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              disabled={index === items.length - 1}
              aria-label="Próxima foto"
              className="absolute top-1/2 -translate-y-1/2 right-[calc((100%-min(84vw,460px))/2+4px)] lg:right-[calc((100%-min(90%,680px))/2+4px)] w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity"
            >
              <ChevronRight size={18} className="text-brand-ink" />
            </button>
          </>
        )}
      </div>

      <p className="text-center text-xs mt-3 text-brand-muted">
        {index + 1} de {items.length}
      </p>

      {items.length > 1 && (
        <div className="flex items-center justify-center mt-1" role="tablist" aria-label="Ir para foto">
          {items.map((item, i) => {
            const active = i === index;
            return (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={active}
                aria-label={`Ir para foto ${i + 1}`}
                className="flex items-center justify-center shrink-0 w-8 h-8"
              >
                <span
                  className="block rounded-full"
                  style={{ width: active ? 9 : 6, height: active ? 9 : 6, backgroundColor: active ? COLORS.caramelDark : COLORS.border }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
