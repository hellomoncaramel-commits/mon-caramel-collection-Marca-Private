import { useRef } from "react";

// Click-and-drag horizontal scrolling for mouse/trackpad users — touch
// already scrolls natively, this only adds the equivalent for desktop,
// where a horizontal row otherwise needs a scrollbar or shift+wheel.
// Spread the returned handlers onto the same scrollable element that
// already has overflow-x-auto; doesn't interfere with native touch
// scrolling or with children's own onClick (a real drag past the
// threshold suppresses the next click via a capture-phase listener, a tap
// that never moved is untouched).
export function useDragScroll() {
  const ref = useRef(null);
  const state = useRef({ down: false, moved: false, startX: 0, startScroll: 0 });

  const onPointerDown = (e) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    state.current = { down: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
  };

  const onPointerMove = (e) => {
    const s = state.current;
    const el = ref.current;
    if (!s.down || !el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 3) s.moved = true;
    el.scrollLeft = s.startScroll - dx;
  };

  const endDrag = () => {
    state.current.down = false;
  };

  const onClickCapture = (e) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  return {
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerLeave: endDrag,
    onClickCapture,
    className: "cursor-grab active:cursor-grabbing",
  };
}
