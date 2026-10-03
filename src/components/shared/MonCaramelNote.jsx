import { COLORS } from "../../styles/colors";

// A short editorial aside in Naia's own voice — not a promo banner, just a
// personal comment folded into the product's detail. `label` deliberately
// varies per product (see data/products.js `experience.noteLabel`) so it
// reads as natural conversation rather than a repeated UI label.
//
// The soft caramel-tinted background is the same "color as a pause" device
// as Dias de luta's editorial asides (see MomentScreen.jsx) — one small,
// deliberately repeated signature instead of a different treatment per
// component. Visual-correction pass: a prior round grew this into a bigger
// card with an oversized quote mark — compacted back down to the size the
// reference shows: small quote, small label, comfortable body text, tight
// padding. It's a brand signature, not a feature block.
export default function MonCaramelNote({ label, note }) {
  if (!note) return null;

  return (
    <div className="mt-3 rounded-2xl p-3 lg:p-3.5" style={{ backgroundColor: `${COLORS.caramelLight}22` }}>
      <p aria-hidden="true" className="font-display italic text-xl leading-[0.5] text-brand-caramelDark">
        “
      </p>
      <p className="text-xs font-display italic text-brand-caramelDark mt-1.5">{label}</p>
      <p className="text-sm mt-1 leading-snug text-brand-ink">{note}</p>
    </div>
  );
}
