import { useMemo } from "react";
import { MessageCircle, X, Sparkles, Plus, Gift } from "lucide-react";
import { buildSelectionMessage } from "../../utils/messages";
import { entryKey } from "../../utils/selectionKey";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos, pickSelectionCrossSell } from "../../utils/products";
import { entryPrice } from "../../utils/pricing";
import Photo from "../shared/Photo";
import BackButton from "../shared/BackButton";

function Thumb({ photo, fallbackIcon }) {
  return (
    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-brand-subtle flex items-center justify-center">
      {photo ? <Photo src={photo} alt="" className="w-full h-full object-cover" loading="lazy" /> : fallbackIcon}
    </div>
  );
}

function EntryCard({ it, product, onRemove }) {
  const isProduct = !it.kind || it.kind === "product";
  const photo = isProduct ? defaultPhotos(product)?.[0] : it.kind === "inspiration" ? it.photo : null;
  const price = isProduct ? entryPrice(product, it.qty) : null;

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Thumb
            photo={photo}
            fallbackIcon={
              it.kind === "gift-idea" ? (
                <Gift size={20} className="text-brand-caramelDark" />
              ) : (
                <Sparkles size={20} className="text-brand-caramelDark" />
              )
            }
          />

          <div className="min-w-0">
            {isProduct && (
              <>
                <p className="font-display text-base text-brand-ink">
                  {it.qty} {it.name}
                </p>
                {!it.flavors && <p className="text-xs mt-0.5 text-brand-muted">{it.unit}</p>}
                {it.flavors && (
                  <ul className="text-xs mt-1.5 space-y-0.5 text-brand-inkSoft">
                    {it.flavors.map((f) => (
                      <li key={f.name}>
                        • {f.qty} {f.name}
                      </li>
                    ))}
                  </ul>
                )}
                {price != null && <p className="text-xs mt-1 font-medium text-brand-caramelDark">${price.toFixed(2)}</p>}
              </>
            )}

            {it.kind === "inspiration" && (
              <>
                <span className="inline-flex items-center gap-1 text-3xs font-medium text-brand-caramelDark mb-1">
                  <Sparkles size={10} /> Referência
                </span>
                <p className="font-display text-base text-brand-ink">{it.title}</p>
              </>
            )}

            {it.kind === "gift-idea" && (
              <>
                <span className="inline-flex items-center gap-1 text-3xs font-medium text-brand-caramelDark mb-1">
                  💌 Ideia de {it.groupLabel}
                </span>
                {it.items?.length > 0 && <p className="font-display text-base text-brand-ink">{it.items.join(", ")}</p>}
                <ul className="text-xs mt-1.5 space-y-0.5 text-brand-inkSoft">
                  {it.occasion && <li>Ocasião: {it.occasion}</li>}
                  {it.personalization?.name && <li>Nome: {it.personalization.name}</li>}
                  {it.personalization?.colors && <li>Cores: {it.personalization.colors}</li>}
                  {it.personalization?.theme && <li>Tema: {it.personalization.theme}</li>}
                  {it.personalization?.message && <li>Mensagem: {it.personalization.message}</li>}
                  {it.budget && <li>Faixa: {it.budget}</li>}
                </ul>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(it)}
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-brand-border text-brand-muted"
          aria-label="Remover"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// Shared "Minha Seleção" — not a checkout cart. Its job is to help build an
// idea of an order before talking to Naia; the finish line is one organized
// WhatsApp message, not a purchase.
export default function SelectionScreen({ selection, removeFromSelection, addToSelection, onBack, onSend }) {
  const productsById = useMemo(() => new Map(PRODUCTS.map((p) => [p.id, p])), []);
  const suggestion = useMemo(() => pickSelectionCrossSell(selection), [selection]);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-28 fade-up">
      <BackButton onClick={onBack} label="Continuar escolhendo" />
      <h2 className="text-2xl mb-1 font-display text-brand-ink">♡ Minha Seleção</h2>
      <p className="text-sm mb-6 text-brand-muted">
        {selection.length === 0
          ? "Ainda vazia — volte e escolha o que combinar com o momento."
          : "Confira tudo antes de conversar com a gente."}
      </p>

      {selection.length === 0 ? (
        <button
          onClick={onBack}
          className="w-full text-sm font-medium rounded-full py-3 border border-brand-caramelDark text-brand-caramelDark"
        >
          Explorar a coleção
        </button>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {selection.map((it) => (
              <EntryCard
                key={entryKey(it)}
                it={it}
                product={it.productId ? productsById.get(it.productId) : null}
                onRemove={removeFromSelection}
              />
            ))}
          </div>

          {suggestion && (
            <div className="rounded-2xl border border-brand-border bg-brand-subtle p-4 mb-6 flex items-center gap-3">
              <Thumb photo={defaultPhotos(suggestion)?.[0]} fallbackIcon={<Sparkles size={20} className="text-brand-caramelDark" />} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-brand-muted mb-0.5">Só mais uma coisinha... 👀</p>
                <p className="font-display text-sm text-brand-ink truncate">{suggestion.name}</p>
              </div>
              <button
                onClick={() =>
                  addToSelection({ kind: "product", productId: suggestion.id, name: suggestion.name, unit: suggestion.unit, qty: 1, flavors: null })
                }
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white bg-brand-caramelDark"
                aria-label={`Adicionar ${suggestion.name}`}
              >
                <Plus size={16} />
              </button>
            </div>
          )}

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
