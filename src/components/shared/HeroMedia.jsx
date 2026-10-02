import { useEffect, useRef, useState } from "react";
import Photo from "./Photo";

// Gives a hero "slow food" movement instead of a static photo — a slow
// crossfade between a couple of real photos (~1.4s fade, held ~5s each),
// not an ad-style slider. No real Mon Caramel video exists in the repo yet
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

  const shown = reducedMotion ? frames.slice(0, 1) : frames;
  return (
    <>
      {shown.map((src, i) => (
        <Photo
          key={src}
          src={src}
          alt=""
          className={className}
          style={{ ...imgStyle, opacity: shown.length === 1 || i === index ? 1 : 0, transition: `opacity ${fadeMs}ms ease-in-out` }}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
    </>
  );
}
