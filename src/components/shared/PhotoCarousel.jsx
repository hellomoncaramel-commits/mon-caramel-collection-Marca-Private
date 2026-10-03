import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Photo from "./Photo";

// Rotates automatically every ~3s (briefing section 7 — many customers don't
// notice they can drag/see more photos). Pauses as soon as someone
// interacts manually — arrows, or now a real drag/swipe.
//
// `aspectClassName` defaults to the original "aspect-photo" (4:3) every
// existing caller already got — opt-in only, for a specific context that
// wants its photo taller/more dominant (e.g. Dias de luta's cards and
// detail sheet on mobile, see ProductCard.jsx/ProductDetailSheet.jsx).
// Every other usage (FeedCard, Festa, Search, etc.) is untouched.
//
// `compact`: opt-in, default false — shrinks the arrow buttons and dots for
// a context where the full-size controls read as too heavy against a
// smaller photo (Dias de luta's card, see ProductCard.jsx). Every other
// caller keeps the original 44px arrows/dots exactly as before.
export default function PhotoCarousel({ photos, alt, aspectClassName = "aspect-photo", compact = false }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  // Plain ref, not state: a drag updates every pointermove and must never
  // trigger a re-render mid-gesture, only the eventual setI/setPaused does.
  const drag = useRef({ down: false, startX: 0, moved: false });

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

  // Swipe-to-advance — mouse and touch alike (pointer events unify both).
  // `touchAction: pan-y` below tells the browser to keep handling vertical
  // scroll natively while leaving horizontal gestures free for this to
  // read, so a swipe here doesn't fight the page's own scroll.
  const onPointerDown = (e) => {
    if (photos.length <= 1) return;
    drag.current = { down: true, startX: e.clientX, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    if (Math.abs(e.clientX - d.startX) > 8) d.moved = true;
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 40) {
      setPaused(true);
      setI((cur) => (cur + (dx < 0 ? 1 : -1) + photos.length) % photos.length);
    }
  };
  // A real drag (not a plain tap) shouldn't also fire whatever onClick the
  // parent card has for "open product" — capture phase runs before that
  // bubbling click, so it can cancel it without needing the parent's
  // cooperation.
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${aspectClassName}`}
      style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
    >
      {/* The very first photo (i === 0, shown on mount with no interaction
          needed) is already in the viewport the instant this card renders —
          marking it "lazy" gave it no fetch priority and could leave it
          blank for a beat right when it's most visible. Any later photo
          (reached via arrows or the auto-rotate timer) stays lazy, since
          those loads are already deferred until the user/timer asks for
          them. */}
      <Photo src={photos[i]} alt={alt} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(-1, e)}
            aria-label="Foto anterior"
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center z-10 ${
              compact ? "w-8 h-8 bg-white/90" : "w-11 h-11 bg-white/85"
            }`}
          >
            <ChevronLeft size={compact ? 13 : 16} className="text-brand-ink" />
          </button>
          <button
            type="button"
            onClick={(e) => go(1, e)}
            aria-label="Próxima foto"
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center z-10 ${
              compact ? "w-8 h-8 bg-white/90" : "w-11 h-11 bg-white/85"
            }`}
          >
            <ChevronRight size={compact ? 13 : 16} className="text-brand-ink" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={compact ? "w-1 h-1 rounded-full" : "w-1.5 h-1.5 rounded-full"}
                style={{ backgroundColor: dotIdx === i ? "white" : "rgba(255,255,255,0.5)" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
