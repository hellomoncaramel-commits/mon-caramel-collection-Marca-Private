import { useEffect, useRef, useState } from "react";

// Shared scroll-snap carousel mechanics — extracted from InspirationCarousel
// so Mimos (full product cards, not bare photos) can reuse the exact same
// navigation behavior (center-snap tracking, arrow goTo, arrow-key support)
// instead of a second hand-rolled implementation. MomentPicker's own track
// is intentionally left on its separate, slightly different implementation
// (peek math tied to its own card width constants) — not worth the risk of
// touching it this round.
export function useSnapCarousel(itemCount) {
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
    const clamped = Math.max(0, Math.min(itemCount - 1, i));
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

  return { trackRef, index, goTo, onTrackKeyDown };
}
