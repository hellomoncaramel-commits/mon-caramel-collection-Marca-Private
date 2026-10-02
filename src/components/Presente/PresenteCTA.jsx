import { COLORS } from "../../styles/colors";

// Same closing block on all three Lembrancinhas pages (Caixas/Bandejas/
// Mimos) — the pages are inspiration + a small catalog, not a store, so
// every path ends the same way: talk to Naia, not "checkout".
//
// Two renderings of the exact same title/body/label/onAction, toggled by
// CSS, not duplicated at the call sites (every caller is unchanged):
// mobile/tablet keep the original centered panel exactly as approved; lg+
// swaps it for a left-aligned, no-background block meant to sit beside the
// carousel in a 2-column row (see Caixas/Bandejas/MimosScreen) instead of
// as a big horizontal band stretching the full width below the photo.
export default function PresenteCTA({
  onAction,
  label = "Quero montar o meu →",
  title = "Gostou de uma ideia?",
  body = "Use essas fotos como inspiração. A gente monta algo do seu jeito para a ocasião, quantidade e tema que você precisa.",
}) {
  return (
    <>
      <div className="mt-10 lg:hidden rounded-3xl p-5 text-center" style={{ backgroundColor: COLORS.subtle }}>
        <p className="text-lg font-display text-brand-ink mb-1">{title}</p>
        <p className="text-sm mb-4 text-brand-inkSoft">{body}</p>
        <button
          onClick={onAction}
          className="text-sm font-medium text-white rounded-full px-6 py-3 min-h-11"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          {label}
        </button>
      </div>

      <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center lg:h-full">
        <p className="text-2xl font-display text-brand-ink mb-3">{title}</p>
        <p className="text-base leading-relaxed mb-6 text-brand-inkSoft max-w-sm">{body}</p>
        <button
          onClick={onAction}
          className="text-sm font-medium text-white rounded-full px-7 py-3.5 min-h-11"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          {label}
        </button>
      </div>
    </>
  );
}
