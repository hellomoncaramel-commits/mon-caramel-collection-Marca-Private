import { useState } from "react";
import { COLORS } from "../../styles/colors";

// Quantity + optional theme/notes, shared across every product added to
// "Minha Festa" (briefing section 5) — no pricing shown anywhere here.
export default function PartyModal({ product, sharedTheme, sharedNotes, existingQty, onCancel, onConfirm }) {
  const [qty, setQty] = useState(existingQty ? String(existingQty) : "1");
  const [theme, setTheme] = useState(sharedTheme);
  const [notes, setNotes] = useState(sharedNotes);

  const confirm = () => {
    onConfirm({ qty: Math.max(1, parseInt(qty, 10) || 1), theme, notes });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-modal px-6" onClick={onCancel}>
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <p className="text-lg mb-4 font-display text-brand-ink">🎉 {product.name}</p>

        <label className="text-xs font-medium block mb-1 text-brand-muted">Quantidade desejada</label>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-full rounded-xl border border-brand-border px-3 py-2 mb-4 text-sm"
        />

        <label className="text-xs font-medium block mb-1 text-brand-muted">Tema da festa (opcional)</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Ex: Safari, Moana, tons verde e dourado..."
          className="w-full rounded-xl border border-brand-border px-3 py-2 mb-4 text-sm"
        />

        <label className="text-xs font-medium block mb-1 text-brand-muted">Observações (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Alguma preferência de cor, sabor ou detalhe especial?"
          className="w-full rounded-xl border border-brand-border px-3 py-2 mb-5 text-sm"
          rows={3}
        />

        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 text-sm rounded-full py-2.5 border border-brand-border text-brand-muted">
            Cancelar
          </button>
          <button onClick={confirm} className="flex-1 text-sm font-medium text-white rounded-full py-2.5" style={{ backgroundColor: COLORS.caramelDark }}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
