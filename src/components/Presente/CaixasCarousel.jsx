import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../../styles/colors";
import Photo from "../shared/Photo";

// Slide width: "min(84vw,460px)" — same technique as MomentPicker, scales
// with the viewport on mobile and caps at a fixed size once there's room
// to spare (tablet/desktop) instead of growing into one giant photo. It
// has to be written out as a literal class string everywhere it's used
// below (track padding, each slide, both arrows) rather than built from a
// shared JS constant: Tailwind's build-time scanner matches class names by
// searching the file's raw text, so a template-literal interpolation like
// `w-[${SLIDE}]` never produces the real class text and silently emits no
// CSS for it.

// Per-photo display-only crop override — every source photo here is native
// 4:3, exactly matching the slide's own aspect-photo box, so object-contain
// already fills the box edge to edge with zero crop by default (nothing to
// override). These three are the exception: the photographer's own framing
// leaves an awkward partial row cut at the very top (pão de mel, butter
// cookies) or a wide dead margin of out-of-focus table on the left (chá de
// bebê), so a mild transform: scale(), anchored away from that dead space,
// trims just enough to drop the confusing/empty part while keeping the
// whole coherent composition (box, ribbon, treats) in frame. No file is
// touched — this only changes how the existing photo is displayed here.
const PHOTO_STYLE = {
  "presente-caixa-pao-de-mel": { transform: "scale(1.25)", transformOrigin: "50% 100%" },
  "presente-caixa-butter-cookies": { transform: "scale(1.1)", transformOrigin: "50% 100%" },
  "presente-caixa-cha-de-bebe": { transform: "scale(1.45)", transformOrigin: "80% 42%" },
};

// One inspiration photo at a time, full width of its own slide — the
// whole point of retiring the grid+lightbox is that there's no
// intermediate tap before you can actually see a box. Items are just
// {id, photo}: add more to the array (data/giftOptions.js → getInspiration)
// and they show up here automatically, nothing else to wire up.
export default function CaixasCarousel({ items }) {
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
          const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - (el.scrollLeft + el.clientWidth / 2));
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
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    const child = el.children[clamped];
    if (!child) return;
    const target = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
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
          aria-label="Fotos de caixas"
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar focus:outline-none pl-[calc((100%-min(84vw,460px))/2)] pr-[calc((100%-min(84vw,460px))/2)]"
        >
          {items.map((item) => (
            <div key={item.id} className="shrink-0 snap-center w-[min(84vw,460px)]">
              <div className="relative aspect-photo rounded-3xl overflow-hidden bg-brand-subtle">
                <Photo
                  src={item.photo}
                  alt={item.caption || ""}
                  className="w-full h-full object-contain"
                  style={PHOTO_STYLE[item.id]}
                  loading="lazy"
                />
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
              className="absolute top-1/2 -translate-y-1/2 left-[calc((100%-min(84vw,460px))/2+4px)] w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity"
            >
              <ChevronLeft size={18} className="text-brand-ink" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              disabled={index === items.length - 1}
              aria-label="Próxima foto"
              className="absolute top-1/2 -translate-y-1/2 right-[calc((100%-min(84vw,460px))/2+4px)] w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity"
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
