import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MOMENTS, MOMENT_TAGLINE, MOMENT_SHORT } from "../../data/moments";
import { COLORS } from "../../styles/colors";
import BackButton from "../shared/BackButton";

const ACCENTS = [COLORS.caramelDark, COLORS.caramelLight, COLORS.creamYellow, COLORS.caramelDark, COLORS.caramelLight];

// "Me ajuda a escolher" — one big moment at a time, swipe or arrows to move
// between them. Swipe is never the *only* way through: arrows, dots and a
// plain "ver todos" list all reach the same place.
export default function MomentPicker({ onBack, onSelectMoment }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setIndex(Math.max(0, Math.min(MOMENTS.length - 1, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(MOMENTS.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="max-w-xl mx-auto px-5 pt-8 pb-10 fade-up">
      <BackButton onClick={onBack} label="Voltar" />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Escolha pelo momento</h1>
      <p className="text-sm mb-5 text-brand-muted">Arraste, use as setas, ou veja a lista completa aí embaixo.</p>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-3xl"
          role="group"
          aria-label="Momentos"
        >
          {MOMENTS.map((m, i) => (
            <div key={m.id} className="min-w-full shrink-0 snap-center px-1">
              <div className="rounded-3xl p-8 min-h-64 flex flex-col justify-center items-center text-center" style={{ backgroundColor: `${ACCENTS[i]}1F` }}>
                <span className="text-5xl mb-4">{m.emoji}</span>
                <p className="text-xl font-display text-brand-ink mb-2">{m.label}</p>
                <p className="text-sm mb-6 text-brand-inkSoft">{MOMENT_TAGLINE[m.id]}</p>
                <button
                  onClick={() => onSelectMoment(m.id)}
                  className="text-sm font-medium text-white rounded-full px-6 py-3 min-h-11"
                  style={{ backgroundColor: COLORS.caramelDark }}
                >
                  Quero isso →
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Momento anterior"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-11 h-11 rounded-full bg-white shadow items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft size={18} className="text-brand-ink" />
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === MOMENTS.length - 1}
          aria-label="Próximo momento"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-11 h-11 rounded-full bg-white shadow items-center justify-center disabled:opacity-30"
        >
          <ChevronRight size={18} className="text-brand-ink" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4" role="tablist" aria-label="Ir para momento">
        {MOMENTS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={m.label}
            className="w-11 h-11 flex items-center justify-center"
          >
            <span
              className="block rounded-full transition-all"
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                backgroundColor: i === index ? COLORS.caramelDark : COLORS.border,
              }}
            />
          </button>
        ))}
      </div>

      <div className="flex sm:hidden justify-center gap-6 mt-2">
        <button onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Momento anterior" className="w-11 h-11 flex items-center justify-center disabled:opacity-30">
          <ChevronLeft size={20} className="text-brand-caramelDark" />
        </button>
        <button onClick={() => goTo(index + 1)} disabled={index === MOMENTS.length - 1} aria-label="Próximo momento" className="w-11 h-11 flex items-center justify-center disabled:opacity-30">
          <ChevronRight size={20} className="text-brand-caramelDark" />
        </button>
      </div>

      <div className="flex justify-between gap-1 mt-6">
        {MOMENTS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => onSelectMoment(m.id)}
            className="flex flex-col items-center gap-1.5 flex-1 min-h-11 py-1"
          >
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${ACCENTS[i]}22` }}
            >
              {m.emoji}
            </span>
            <span className="text-3xs text-brand-inkSoft text-center leading-tight">{MOMENT_SHORT[m.id]}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowAll((s) => !s)}
        className="w-full flex items-center justify-center gap-1.5 text-sm font-medium mt-5 py-3 min-h-11 rounded-full border border-brand-caramelDark text-brand-caramelDark"
      >
        {showAll ? "Ocultar lista" : "Ver todos os momentos"}
        {!showAll && <ChevronRight size={16} />}
      </button>

      {showAll && (
        <div className="flex flex-col gap-2.5 mt-2 fade-up">
          {MOMENTS.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMoment(m.id)}
              className="flex items-center gap-3 p-4 rounded-2xl border border-brand-border bg-white text-left min-h-11"
            >
              <span className="text-xl shrink-0">{m.emoji}</span>
              <span>
                <span className="block text-brand-ink text-sm font-medium">{m.label}</span>
                <span className="block text-brand-muted text-xs mt-0.5">{MOMENT_TAGLINE[m.id]}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
