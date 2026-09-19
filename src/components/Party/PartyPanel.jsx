import { forwardRef } from "react";
import { MessageCircle } from "lucide-react";
import { COLORS } from "../../styles/colors";

// Gradient planner panel, shown inline within the Festa moment screen. Copy
// changes between empty and filled state (briefing section 5).
const PartyPanel = forwardRef(function PartyPanel({ items, theme, notes, onSubmit }, ref) {
  return (
    <div
      ref={ref}
      className="mt-6 rounded-3xl p-5 backdrop-blur border"
      style={{
        background: `linear-gradient(150deg, ${COLORS.caramelDark}1F, ${COLORS.caramelLight}12)`,
        borderColor: `${COLORS.caramelDark}55`,
      }}
    >
      <p className="text-lg mb-1 font-display text-brand-ink">🎉 Minha Festa</p>
      {items.length === 0 ? (
        <p className="text-sm italic leading-relaxed font-subtitle text-brand-inkSoft">
          Sua festa é única. Escolha os docinhos e detalhes que mais combinam com esse momento.
        </p>
      ) : (
        <>
          <p className="text-xs uppercase tracking-wide mb-3 text-brand-muted">
            {items.length} {items.length === 1 ? "item adicionado" : "itens adicionados"}
          </p>
          <ul className="text-sm space-y-1.5 mb-4 text-brand-ink">
            {items.map((it) => (
              <li key={it.id}>✓ {it.name}</li>
            ))}
          </ul>
          {theme.trim() && (
            <p className="text-xs mb-1 text-brand-inkSoft">
              <strong>Tema:</strong> {theme}
            </p>
          )}
          {notes.trim() && (
            <p className="text-xs mb-3 text-brand-inkSoft">
              <strong>Observações:</strong> {notes}
            </p>
          )}
          <button
            onClick={onSubmit}
            className="w-full text-sm font-medium text-white rounded-full py-3 flex items-center justify-center gap-2 mt-2"
            style={{ backgroundColor: COLORS.caramelDark }}
          >
            <MessageCircle size={15} />
            Solicitar orçamento
          </button>
        </>
      )}
    </div>
  );
});

export default PartyPanel;
