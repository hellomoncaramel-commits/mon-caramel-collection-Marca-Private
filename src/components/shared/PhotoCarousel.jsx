import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Photo from "./Photo";

// Rotates automatically every ~3s (briefing section 7 — many customers don't
// notice they can drag/see more photos). Pauses as soon as someone
// interacts manually with the arrows.
export default function PhotoCarousel({ photos, alt }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!photos || photos.length <= 1 || paused) return;
    const t = setInterval(() => setI((cur) => (cur + 1) % photos.length), 2800);
    return () => clearInterval(t);
  }, [photos, paused]);

  if (!photos || photos.length === 0) return null;

  const go = (dir, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPaused(true);
    setI((cur) => (cur + dir + photos.length) % photos.length);
  };

  return (
    <div className="relative w-full overflow-hidden select-none aspect-photo">
      <Photo src={photos[i]} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(-1, e)}
            aria-label="Foto anterior"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/85 flex items-center justify-center z-10"
          >
            <ChevronLeft size={16} className="text-brand-ink" />
          </button>
          <button
            type="button"
            onClick={(e) => go(1, e)}
            aria-label="Próxima foto"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/85 flex items-center justify-center z-10"
          >
            <ChevronRight size={16} className="text-brand-ink" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: dotIdx === i ? "white" : "rgba(255,255,255,0.5)" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
