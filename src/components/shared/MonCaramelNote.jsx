// A short editorial aside in Naia's own voice — not a promo banner, just a
// personal comment folded into the product's detail. `label` deliberately
// varies per product (see data/products.js `experience.noteLabel`) so it
// reads as natural conversation rather than a repeated UI label.
export default function MonCaramelNote({ label, note }) {
  if (!note) return null;

  return (
    <div className="mt-4 rounded-2xl p-3.5 bg-brand-subtle">
      <p className="text-xs font-medium text-brand-caramelDark">{label}</p>
      <p className="text-sm mt-1 leading-relaxed text-brand-inkSoft">{note}</p>
    </div>
  );
}
