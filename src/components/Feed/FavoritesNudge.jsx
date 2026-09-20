import { useState } from "react";
import { X } from "lucide-react";
import { COLORS } from "../../styles/colors";

// A gentle, dismissible nudge — never a popup — shown once someone has
// favorited a few things, pointing them at Salvos.
export default function FavoritesNudge({ count, onGoSaved }) {
  const [dismissed, setDismissed] = useState(false);
  if (count < 3 || dismissed) return null;

  return (
    <div className="fade-up mt-6 rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: COLORS.subtle }}>
      <p className="text-sm flex-1 text-brand-ink">👀 Você já gostou de {count}...</p>
      <button onClick={onGoSaved} className="text-xs font-medium rounded-full px-3.5 py-2 min-h-11 text-white" style={{ backgroundColor: COLORS.caramelDark }}>
        Ver salvos
      </button>
      <button onClick={() => setDismissed(true)} aria-label="Dispensar" className="w-11 h-11 shrink-0 flex items-center justify-center">
        <X size={14} className="text-brand-muted" />
      </button>
    </div>
  );
}
