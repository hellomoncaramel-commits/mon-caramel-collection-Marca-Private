import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import Photo from "../shared/Photo";

// Full-screen "explore" step for an inspiration gallery: the grid is just a
// teaser (small, cropped-to-fit tiles), so tapping any tile opens the whole
// photo here — object-contain, nothing cropped — with swipe/arrows to keep
// browsing and a single Heart to save the one currently on screen.
export default function InspirationViewer({ items, startIndex, onClose, isSelected, onToggleSave }) {
  const [i, setI] = useState(startIndex);
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = startIndex * el.clientWidth;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setI(Math.max(0, Math.min(items.length - 1, idx)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const go = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // Reads the track's actual scroll position instead of the `i` state:
    // state only updates once a previous smooth-scroll settles, so a tap
    // that lands mid-animation would otherwise compute "current + 1" from a
    // stale `i` and re-target the same page instead of advancing.
    const currentIndex = Math.round(el.scrollLeft / el.clientWidth);
    const next = Math.max(0, Math.min(items.length - 1, currentIndex + dir));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const current = items[i];
  const saved = isSelected({ kind: "inspiration", id: current.id });

  return (
    <div className="fixed inset-0 z-modal flex flex-col bg-brand-beige fade-up" role="dialog" aria-modal="true">
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)", paddingBottom: 12 }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shrink-0"
        >
          <X size={18} className="text-brand-ink" />
        </button>
        <span className="text-sm font-medium text-brand-inkSoft">
          {i + 1} de {items.length}
        </span>
      </div>

      <div className="relative flex-1 min-h-0">
        <div ref={trackRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full">
          {items.map((item) => (
            <div key={item.id} className="min-w-full shrink-0 snap-center h-full flex items-center justify-center px-3">
              <Photo
                src={item.photo}
                alt={item.caption || ""}
                className="max-w-full max-h-full object-contain rounded-2xl"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-center gap-3 px-4 pb-3">
        {items.length > 1 && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => go(-1)}
              disabled={i === 0}
              aria-label="Inspiração anterior"
              className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft size={18} className="text-brand-ink" />
            </button>
            <button
              onClick={() => go(1)}
              disabled={i === items.length - 1}
              aria-label="Próxima inspiração"
              className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight size={18} className="text-brand-ink" />
            </button>
          </div>
        )}

        <button
          onClick={() => onToggleSave(current)}
          className="inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-5 min-h-11 border"
          style={{
            backgroundColor: saved ? COLORS.caramelDark : "transparent",
            color: saved ? "white" : COLORS.caramelDark,
            borderColor: COLORS.caramelDark,
          }}
        >
          <Heart size={15} fill={saved ? "white" : "none"} />
          Gostei dessa ideia
        </button>

        {items.length > 1 && <p className="text-xs pb-1" style={{ color: COLORS.muted }}>Deslize para ver mais</p>}
      </div>
    </div>
  );
}
