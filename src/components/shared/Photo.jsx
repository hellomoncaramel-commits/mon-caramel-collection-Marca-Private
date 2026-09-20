// Every product photo has a WebP sibling generated alongside its .jpg
// (see scripts note in public/images/products — same basename, .webp
// extension). This renders both: modern browsers get the smaller WebP,
// anything else falls back to the original JPEG. No component using photos
// needs to know the difference — just pass the .jpg path as `src`, same as
// a plain <img>.
export default function Photo({ src, alt, className, loading, decoding = "async", onError }) {
  const webp = src.replace(/\.jpe?g$/i, ".webp");
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img src={src} alt={alt} className={className} loading={loading} decoding={decoding} onError={onError} />
    </picture>
  );
}
