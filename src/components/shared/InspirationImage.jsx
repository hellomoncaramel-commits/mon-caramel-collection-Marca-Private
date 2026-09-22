// The ONE rule for every inspiration-gallery photo (Caixas today, any
// future "muitas fotos" gallery): never crop, never zoom, always show the
// entire original photo. Deliberately separate from Photo.jsx, which sizes
// its <img> to width:100%/height:100% of its box — exactly what a fixed
// grid tile or product card wants, and exactly what breaks a photo whose
// aspect ratio doesn't match its frame (it either crops via object-fit:cover
// or stretches). Here the <img> is sized from its OWN intrinsic dimensions
// (object-contain + max-width/max-height, no width/height:100%), so the
// browser always shrinks it proportionally to fit — landscape, portrait,
// square, or anything else, with zero per-photo CSS. Frame stays a
// consistent size; only the photo's rendered size inside it changes.
export default function InspirationImage({ src, alt = "", className = "" }) {
  const webp = src.replace(/\.jpe?g$/i, ".webp");
  return (
    <div className={`w-full h-full flex items-center justify-center overflow-hidden bg-brand-subtle ${className}`}>
      <picture className="contents">
        <source srcSet={webp} type="image/webp" />
        <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-auto h-auto max-w-full max-h-full object-contain" />
      </picture>
    </div>
  );
}
