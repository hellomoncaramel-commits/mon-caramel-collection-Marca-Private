import { useEffect, useRef, useState } from "react";
import Photo from "./Photo";

// A `frames` entry is either a plain src string (uses the shared `imgStyle`
// as-is) or `{ src, style }` for a photo that needs its own crop/focal
// point — different real photos rarely share one objectPosition once the
// rotation grows past a near-identical pair.
function normalizeFrame(frame) {
  return typeof frame === "string" ? { src: frame, style: null } : frame;
}

// Gives a hero "slow food" movement instead of a static photo — a slow
// crossfade between several real photos (~1.4s fade, held ~5s each), not
// an ad-style slider. No real Mon Caramel video exists in the repo yet
// (see data/photos.js), so this ships as a photo crossfade; `videoSrc` is
// already wired in so swapping in a real video later is a one-line prop
// change at the call site, not a new component. If a video is supplied and
// plays, it takes over entirely (no slideshow timer underneath it); if it
// errors, this falls back to the same photo crossfade. `prefers-reduced-
// motion: reduce` always wins — no video, no interval, just the first
// frame, static.
export default function HeroMedia({ frames, videoSrc, videoPoster, className, imgStyle, fadeMs = 1400, holdMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const videoActive = Boolean(videoSrc) && !videoFailed && !reducedMotion;

  useEffect(() => {
    if (reducedMotion || videoActive) return;
    if (!frames || frames.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % frames.length), holdMs);
    return () => clearInterval(t);
  }, [frames, holdMs, reducedMotion, videoActive]);

  if (videoActive) {
    return (
      <video
        ref={videoRef}
        className={className}
        style={imgStyle}
        src={videoSrc}
        poster={videoPoster}
        autoPlay
        muted
        loop
        playsInline
        onError={() => setVideoFailed(true)}
      />
    );
  }

  const normalized = (frames || []).map(normalizeFrame);
  // Mount only through "index + 1" (the upcoming frame) — never the whole
  // set at once. Each later frame enters the DOM exactly one hold cycle
  // before its turn, so by the time it needs to fade in it's already
  // loaded, not just requested (preload without a flash) — while a
  // rotation of 5 heavy photos never fetches all 5 on first paint. Once a
  // frame is introduced it stays mounted (never removed), so every
  // crossfade is a plain opacity transition, never a remount.
  const mountCount = reducedMotion ? 1 : Math.min(index + 2, normalized.length);
  const mounted = normalized.slice(0, mountCount);

  return (
    <>
      {mounted.map((frame, i) => (
        <Photo
          key={frame.src}
          src={frame.src}
          alt=""
          className={className}
          style={{
            ...imgStyle,
            ...frame.style,
            opacity: mounted.length === 1 || i === index ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
          loading="eager"
        />
      ))}
    </>
  );
}
