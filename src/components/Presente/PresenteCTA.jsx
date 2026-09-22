import { COLORS } from "../../styles/colors";

// Same closing block on all three Lembrancinhas pages (Caixas/Bandejas/
// Mimos) — the pages are inspiration + a small catalog, not a store, so
// every path ends the same way: talk to Naia, not "checkout".
export default function PresenteCTA({
  onAction,
  label = "Quero montar o meu →",
  title = "Gostou de uma ideia?",
  body = "Use essas fotos como inspiração. A gente monta algo do seu jeito para a ocasião, quantidade e tema que você precisa.",
}) {
  return (
    <div className="mt-10 rounded-3xl p-5 text-center" style={{ backgroundColor: COLORS.subtle }}>
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
  );
}
