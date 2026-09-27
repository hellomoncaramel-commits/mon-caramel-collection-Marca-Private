import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";

// Single source of truth for the brand header on every screen. The row is
// `position: relative` with the logo centered by the row's own flex, and
// the back button/rightSlot absolutely positioned at the edges — so
// neither one can push the logo off-center, regardless of whether the
// other is present. Flexbox resolves the static position of an
// absolutely-positioned flex child using the container's own align-items,
// so the back/rightSlot buttons stay vertically centered at any rowHeight
// without needing their own top/bottom offset.
//
// `logoSize`/`rowHeight` default to the values every other screen already
// uses (unchanged for all of them) — only Home passes its own compact
// values, so this stays a same-component, additive change rather than a
// second header.
export default function SiteHeader({ onBack, rightSlot, logoSize = "home", rowHeight = 76 }) {
  // Screens are swapped by conditional rendering (see App.jsx), not
  // routing, so the window keeps whatever scroll position the previous
  // screen was left at — e.g. leaving a page scrolled from clicking a
  // below-the-fold button. Without this, the next screen's header can
  // mount already scrolled past, clipping the logo at the very top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative flex items-center justify-center mb-2 shrink-0" style={{ height: rowHeight }}>
      <div className="absolute left-0">
        {onBack ? (
          <button onClick={onBack} aria-label="Voltar" className="w-11 h-11 flex items-center justify-center">
            <ArrowLeft size={20} className="text-brand-caramelDark" />
          </button>
        ) : (
          <div className="w-11" />
        )}
      </div>
      <Logo size={logoSize} />
      <div className="absolute right-0">{rightSlot ?? <div className="w-11" />}</div>
    </div>
  );
}
