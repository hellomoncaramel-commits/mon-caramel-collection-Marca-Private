import ProductCard from "./ProductCard";

// One of the 3 horizontal photo carousels that make up the "Lembrancinha"
// moment (briefing section 4): inspiration + personalization, not a rigid
// catalog. `header` is optional — the first carousel (Caixas) relies on the
// intro copy already shown above it in MomentScreen.
export default function PresenteSection({ header, products, momentId, cardProps }) {
  if (header && products.length === 0) return null;

  return (
    <div className={header ? "mt-10" : "mt-6"}>
      {header && (
        <>
          <div className="flex items-center gap-2 mb-1 text-brand-caramelDark">
            <header.Icon size={16} />
            <span className="text-2xs uppercase tracking-wide font-medium">{header.eyebrow}</span>
          </div>
          <p className="text-lg mb-1 font-display text-brand-ink">{header.title}</p>
          <p className="text-sm mb-1 text-brand-inkSoft">{header.description}</p>
        </>
      )}
      <div className={`flex gap-4 ${header ? "mt-4" : ""} overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-6 px-6 pb-2 no-scrollbar`}>
        {products.map((p) => (
          <div key={p.id} className="shrink-0 snap-start" style={{ width: "44%", minWidth: "150px", maxWidth: "220px" }}>
            <ProductCard p={p} momentId={momentId} {...cardProps} />
          </div>
        ))}
      </div>
    </div>
  );
}
