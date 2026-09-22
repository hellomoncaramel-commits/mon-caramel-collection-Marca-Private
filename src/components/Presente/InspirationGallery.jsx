import { useState } from "react";
import Photo from "../shared/Photo";
import InspirationViewer from "./InspirationViewer";

// Editorial inspiration grid — a teaser to discover from, never a SKU list
// (no name, no price, no "add to cart"). Every source photo here is native
// 4:3 (see data/photos.js), so an aspect-photo box + object-cover shows
// each one full-bleed with no crop from us — cover only ever crops when the
// box and image disagree on aspect, and here they don't. The grid doesn't
// need to show the whole photo (that's what tapping into InspirationViewer
// is for) — every tile is one big tap target, no controls sitting on top.
export default function InspirationGallery({ items, isSelected, onToggleSave }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setOpenIndex(idx)}
            aria-label={`Ver inspiração ${idx + 1} de ${items.length}`}
            className="relative rounded-2xl overflow-hidden aspect-photo bg-brand-subtle"
          >
            <Photo
              src={item.photo}
              alt={item.caption || ""}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <InspirationViewer
          items={items}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          isSelected={isSelected}
          onToggleSave={onToggleSave}
        />
      )}
    </>
  );
}
