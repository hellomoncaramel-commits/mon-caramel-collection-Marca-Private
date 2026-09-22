// Every product photo has a WebP sibling generated alongside its .jpg
// (see scripts note in public/images/products — same basename, .webp
// extension). This renders both: modern browsers get the smaller WebP,
// anything else falls back to the original JPEG. No component using photos
// needs to know the difference — just pass the .jpg path as `src`, same as
// a plain <img>.
//
// <picture> has no special sizing behavior of its own — by default it's an
// inline box that just wraps its chosen <source>/<img>. A block-level img
// with percentage width/height inside it still resolves those percentages
// against the nearest block ancestor (skipping the inline <picture>), which
// is why this has worked without a wrapper class anywhere else Photo is
// used. `pictureClassName` exists only for callers that want <picture>
// itself sized explicitly instead of relying on that pass-through — pass
// e.g. "block w-full h-full" when the img needs a guaranteed 100%×100% box
// to fill (fixed-frame carousels/galleries). Optional and unset by default,
// so no existing usage changes.
export default function Photo({ src, alt, className, pictureClassName, style, loading, decoding = "async", onError }) {
  const webp = src.replace(/\.jpe?g$/i, ".webp");
  return (
    <picture className={pictureClassName}>
      <source srcSet={webp} type="image/webp" />
      <img src={src} alt={alt} className={className} style={style} loading={loading} decoding={decoding} onError={onError} />
    </picture>
  );
}
