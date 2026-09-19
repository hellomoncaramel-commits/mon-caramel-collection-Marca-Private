import { MessageCircle, X } from "lucide-react";
import { buildSelectionMessage } from "../../utils/messages";
import BackButton from "../shared/BackButton";

// Shared "Minha Seleção" wishlist/order-builder, filled in from every
// screen, finalized as one WhatsApp message (briefing section 5).
export default function SelectionScreen({ selection, removeFromSelection, onBack, onSend }) {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-28 fade-up">
      <BackButton onClick={onBack} label="Continuar escolhendo" />
      <h2 className="text-2xl mb-1 font-display text-brand-ink">♡ Minha Seleção</h2>
      <p className="text-sm mb-6 text-brand-muted">
        {selection.length === 0
          ? "Ainda vazia — volte e escolha o que combinar com o momento."
          : "Confira tudo antes de enviar pra gente combinar os detalhes."}
      </p>

      {selection.length === 0 ? (
        <button onClick={onBack} className="w-full text-sm font-medium rounded-full py-3 border border-brand-caramelDark text-brand-caramelDark">
          Explorar a coleção
        </button>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {selection.map((it) => (
              <div key={it.productId} className="rounded-2xl border border-brand-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base text-brand-ink">
                      {it.qty} {it.name}
                    </p>
                    {!it.flavors && <p className="text-xs mt-0.5 text-brand-muted">{it.unit}</p>}
                    {it.flavors && (
                      <ul className="text-xs mt-1.5 space-y-0.5 text-brand-inkSoft">
                        {it.flavors.map((f) => (
                          <li key={f.name}>• {f.qty} {f.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromSelection(it.productId)}
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-brand-border text-brand-muted"
                    aria-label="Remover"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSend(buildSelectionMessage(selection))}
              className="w-full text-sm font-medium text-white bg-brand-caramelDark rounded-full py-3 flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} />
              Finalizar pelo WhatsApp
            </button>
            <button onClick={onBack} className="w-full text-sm rounded-full py-3 text-brand-muted">
              Continuar escolhendo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
