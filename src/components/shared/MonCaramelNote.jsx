import { COLORS } from "../../styles/colors";

// A short editorial aside in Naia's own voice — not a promo banner, just a
// personal comment folded into the product's detail. `label` deliberately
// varies per product (see data/products.js `experience.noteLabel`) so it
// reads as natural conversation rather than a repeated UI label.
//
// The soft caramel-tinted background is the same "color as a pause" device
// as Dias de luta's editorial asides (see MomentScreen.jsx) — one small,
// deliberately repeated signature instead of a different treatment per
// component. The oversized quote mark is the one piece of pure typographic
// decoration in the whole detail sheet: Fraunces italic, no icon/asset,
// just scale doing the work of marking "this is Naia talking," not a
// generic tip box.
export default function MonCaramelNote({ label, note }) {
  if (!note) return null;

  return (
    <div className="mt-5 rounded-2xl p-4 lg:p-5" style={{ backgroundColor: `${COLORS.caramelLight}22` }}>
      <p aria-hidden="true" className="font-display italic text-4xl leading-[0.6] text-brand-caramelDark">
        “
      </p>
      <p className="text-xs font-display italic text-brand-caramelDark mt-2.5">{label}</p>
      <p className="text-sm mt-1 leading-relaxed text-brand-ink">{note}</p>
    </div>
  );
}
