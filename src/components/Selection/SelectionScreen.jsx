import { useMemo } from "react";
import { MessageCircle, X, Sparkles, Gift } from "lucide-react";
import { buildSelectionMessage } from "../../utils/messages";
import { entryKey } from "../../utils/selectionKey";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos } from "../../utils/products";
import { entryPrice } from "../../utils/pricing";
import Photo from "../shared/Photo";
import SiteHeader from "../shared/SiteHeader";

function Thumb({ photo, fallbackIcon }) {
  return (
    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-brand-subtle flex items-center justify-center">
      {photo ? <Photo src={photo} alt="" className="w-full h-full object-cover" loading="lazy" /> : fallbackIcon}
    </div>
  );
}

// A line-item, not a cart row — no box, no border, just the entry and a
// hairline separator from the list wrapper below (matches Busca's
// ResultRow treatment, same "scannable list" language). The photo still
// gets real size (64px) so it reads as the actual sweet, not a form field.
function EntryCard({ it, product, onRemove }) {
  const isProduct = !it.kind || it.kind === "product";
  const photo = isProduct ? defaultPhotos(product)?.[0] : it.kind === "inspiration" ? it.photo : null;
  const price = isProduct ? entryPrice(product, it.qty) : null;

  return (
    <div className="flex items-start gap-3 lg:gap-4 py-4">
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

      <div className="min-w-0 flex-1">
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

      <button
        onClick={() => onRemove(it)}
        aria-label="Remover"
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-brand-muted transition-transform active:scale-90 lg:hover:text-brand-caramelDark"
      >
        <X size={15} />
      </button>
    </div>
  );
}

// Shared "Minha Seleção" — not a checkout cart. Its job is to help build an
// idea of an order before talking to Naia; the finish line is one organized
// WhatsApp message, not a purchase.
export default function SelectionScreen({ selection, removeFromSelection, onBack, onSend }) {
  const productsById = useMemo(() => new Map(PRODUCTS.map((p) => [p.id, p])), []);

  return (
    // Minha Seleção is a pre-WhatsApp summary, not a marketplace checkout —
    // lg:max-w-4xl (896px) read as too wide for a short list of compact
    // rows. Narrowed to ~820px, well within the 760–850px the brief asks
    // for; the WhatsApp CTA stays full-width of THIS container, so it
    // naturally stops being a 1200px-wide bar too.
    <div className="max-w-2xl lg:max-w-[820px] mx-auto px-gutter lg:px-8 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h2 className="mc-page-title">♡ Minha Seleção</h2>
      <p className="mc-page-subtitle">
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
          <div className="mb-6 divide-y divide-brand-border">
            {selection.map((it) => (
              <EntryCard
                key={entryKey(it)}
                it={it}
                product={it.productId ? productsById.get(it.productId) : null}
                onRemove={removeFromSelection}
              />
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
