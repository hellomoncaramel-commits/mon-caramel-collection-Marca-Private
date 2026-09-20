import { useRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import Photo from "../shared/Photo";

// One inspiration photo at a time — swipe or dots to move between them.
// Never shows a name, price or "buy this": these are references from real
// past work, not fixed SKUs (briefing: Caixas/Bandejas are inspiration).
export default function SwipeGallery({ items, isSaved, onToggleSave }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setIndex(Math.max(0, Math.min(items.length - 1, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: Math.max(0, Math.min(items.length - 1, i)) * el.clientWidth, behavior: "smooth" });
  };

  if (items.length === 0) return null;
  const current = items[index];
  // isSaved/onToggleSave compare by entryKey, which needs a "kind" to avoid
  // being misread as a plain product entry — these are always inspiration photos.
  const saved = isSaved({ kind: "inspiration", id: current.id });

  return (
    <div>
      <div ref={trackRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-3xl">
        {items.map((item) => (
          <div key={item.id} className="min-w-full shrink-0 snap-center">
            <div className="relative rounded-3xl overflow-hidden aspect-photo">
              <Photo src={item.photo} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3" role="tablist" aria-label="Fotos de inspiração">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === index}
              aria-label={`Foto ${i + 1}`}
              className="w-8 h-8 flex items-center justify-center"
            >
              <span
                className="block rounded-full"
                style={{ width: i === index ? 16 : 6, height: 6, backgroundColor: i === index ? COLORS.caramelDark : COLORS.border }}
              />
            </button>
          ))}
        </div>
      )}

      {current.caption && <p className="text-sm mt-3 leading-relaxed text-brand-inkSoft">{current.caption}</p>}

      <button
        onClick={() => onToggleSave(current)}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-4 min-h-11 border"
        style={{
          backgroundColor: saved ? COLORS.caramelDark : "transparent",
          color: saved ? "white" : COLORS.caramelDark,
          borderColor: COLORS.caramelDark,
        }}
      >
        <Heart size={14} fill={saved ? "white" : "none"} />
        {saved ? "Salvo na seleção" : "Gostei dessa ideia"}
      </button>
    </div>
  );
}
